var
  extend        = require('xtend'),
  fs            = require('fs'),
  flat          = require('flat'),
  passwordless  = require('passwordless'),
  jade          = require('jade'),
  md5           = require('MD5'),
  redis         = require('redis'),
  mapValues     = require('lodash.mapvalues'),
  merge         = require('lodash.merge'),
  zipObj        = require('lodash.zipobject'),
  bb            = require('callbackbox'),
  RedisStore    = require('passwordless-redisstore'),

  expressSession= require('express-session'),
  
  validator     = require('validator'),

  RedisSessionStore
                = require('connect-redis')(expressSession),
  
  unflat        = flat.unflatten,
  
  routes        = {},
  settings      = {
    keys              : {},
    templatesDirectory: './templates/',
    loginSuccessPath  : '/',
    loginFailurePath  : '/',
    redis             : {
      port              : 6379,
      ip                : '127.0.0.1'
    }
  },
  
  profileFieldBlackList = {
    blocked : true
  },
  
  compileTemplates,
  compileClientTemplates,
  
  thisRedisStore,
  client;
  
  
/**
 * Simple sugar to concatenate the arguments into colon (`:`) delimited keys
 *
 * @static
 * @category tools
 * @memberOf haloid
 * @param {...string} strings - a string to be concatenated
 * @returns {string} colon delimited redis key
 *
 * @example
 * 
 * haloid.rk('a','b','c'); //returns a:b:c
 */ 
function rk() {
  return Array.prototype.slice.call(arguments).join(':');
}  


/**
 * Middleware factory that applies the values of `req.haloidValues` to a compiled template and stores them in req.html and calls `next`
 *
 * @static
 * @category middleware
 * @memberOf haloid
 * @param {function} aTemplate a compiled template (single argument, jade-style)
 * @returns {function} Express-style middleware
 *
 */
function addTemplate(aTemplate) {
  return function(req,res,next) {
    if (req.user) {
      req.haloidValues.user = req.userProfile;
    }    
    req.html = aTemplate(req.haloidValues);
    next();
  };
}

/**
 * Middleware that sends req.html as a response
 *
 * @static
 * @memberOf haloid
 * @category middleware
 * @param {Object} req Express request object.
 * @param {Object} res Express response object.
 * @param {function} next Express `next` callback
 * @returns
 * 
 */
function sendIt(req,res,next) {
  res.send(req.html);
}

function setup(newSettings) {
  settings = merge(settings, newSettings);

  module.exports.settings = settings;
}

/**
 * Stub function that defines how your token is delievered (e.g. send email). By default it simply diplays the token query string on the console.
 *
 * @static
 * @memberOf haloid
 * @category stub
 * @param {string} tokenToSend The token
 * @param {stinrg} uidToSend The encoded user ID
 * @param {string} recipient The email address of the user
 * @cb {function} callback Executed when send it complete
 * @returns
 *
 */
function defaultDelivery(tokenToSend, uidToSend, recipient, cb) {
  console.log('?token='+tokenToSend+'&uid='+encodeURIComponent(uidToSend), 'recp',recipient);
  cb();
}

/**
 * Applies all required middlewares to `app`
 *
 * @static
 * @memberOf haloid
 * @category init
 * @param {Object} app Express app object
 * @returns
 *
 */
function haloidUse(app) {
  thisRedisStore = new RedisStore(settings.redis.port, settings.redis.ip);
  
  passwordless.init(thisRedisStore);
  
  passwordless.addDelivery(module.exports.tokenDelievery);
  
  module.exports.requestToken = passwordless.requestToken(tokenRequestProcess, { failureRedirect: settings.loginFailurePath }),
  
  app.use(
    expressSession({
      resave    : true,
      saveUninitialized
                : true,
      secret    : settings.sessionSecret, //error if not set?
      store     : new RedisSessionStore({
        client : client,
        prefix : settings.keys.sessions
      }),
    }),
    
    passwordless.sessionSupport(),
    
    passwordless.acceptToken({ successRedirect: settings.loginSuccessPath, failureRedirect : '/failure' }),
    
    module.exports.profileData
  );
}

/**
 * Initializes redis
 *
 * @static
 * @memberOf haloid
 * @category init
 * @returns {object} redis client
 */
function redisClient() {
  return client = redis.createClient(
    settings.redis.port,
    settings.redis.ip
  );
}

/**
 * Creates a collection of objects from an array with ordered elements. Useful for redis bulk replies
 *
 * @static
 * @memberOf haloid
 * @category tools
 * @param {array} inArray Array with ordered elements.
 * @param {array} keys Array of names.
 * @returns collection of objects.
 *
 * @example
 * // returns [ { make : 'volvo', age : '3', color : 'red' }, { make : 'saab', age : '2', color : 'green' } ]
 * haloid.deinterlace(['volvo','3','red','saab','2','green'],['make','age','color']);
 */
function deinterlace(inArray, keys) {
  var
    building = {},
    outArray = [];
  inArray.forEach(function(el,index) {
    building[keys[index % keys.length]] = el;
    if (((index+1) % keys.length) === 0) {
      outArray.push(building);
      building = {};
    } 
  }); 
  return outArray;
}

/**
 * Logs the route to the console, to be used with routewrangler
 *
 * @static
 * @memberOf haloid
 * @category logging
 * @param {string} aVerb The route verb (GET,PUT,etc.)
 * @param {array} aRoute A routewrangler-style array (0th element is the Express style route)
 * @returns
 * 
 */
function announceRoute(aVerb,aRoute){
  console.log('route',aVerb,aRoute[0]);
}

/**
 * Factory to create compileTemplates and compileTemplatesClient
 * 
 * @private
 */
function createTemplateCompiler(compilerFnName) {
  return function(templates, templateDirectory) {
    return mapValues(templates, function(aTemplateSlug){
      var
        filename = (templateDirectory || settings.templatesDirectory)+aTemplateSlug+'.jade'
      return jade[compilerFnName](
        fs.readFileSync(filename),
        {
          pretty    : true,
          filename  : filename
        }
      );
    });
  };
}
/**
 * Compiles all the templates. This operation is prefomed synchronously, so it is only appropriate during startup.  
 *
 * @static
 * @memberOf haloid
 * @category tools
 * @param {object} templates An object of templates. Should structured like `{ home : 'home', dashboard : 'dashboard'}`. The `settings.templatesDirectory` is prepended to the value and the extension '.jade' is appended. So, if `settings.templatesDirectory` was set to './templates/', the above example would read and compile './templates/home.jade' and './templates/dashboard.jade'.
 * @returns
 * 
 */
 compileTemplates = createTemplateCompiler('compile');

 /**
 * Compiles all client templates. This operation is prefomed synchronously, so it is only appropriate during startup.  
 *
 * @static
 * @memberOf haloid
 * @category tools
 * @param {object} templates An object of templates. Should structured like `{ home : 'home', dashboard : 'dashboard'}`. The `settings.templatesDirectory` is prepended to the value and the extension '.jade' is appended. So, if `settings.templatesDirectory` was set to './templates/', the above example would read and compile './templates/home.jade' and './templates/dashboard.jade'.
 * @returns
 * 
 */
 compileClientTemplates = createTemplateCompiler('compileClient');
 
/**
 * Stub function that defines how user emails are hashed. This is not for security purposes, but primarily to ensure consistent keys that are compatible with both redis, routes and query strings. By default, this uses hex encoded MD5. As this is a stub function, feel free to override it in your application.
 *
 * @static
 * @memberOf haloid
 * @category stub
 * @param {string} email email address of user
 * @returns {string} hashed value
 *
 */
function userLookupHash(email) {
  return md5(settings.userSecret+email);
}

/**
 * Checks to see if a user is registered. If registered, pass back the user hash, if not pass back a failure callback
 * @private
 * @param {string} email email address
 * @param {string} delievery not used, but required by passwordless
 * @param {function} cb success/fail callback
 * @returns
 */
function tokenRequestProcess(email, delivery, cb) {
  var
    userLookup = module.exports.userLookupHash(email);
  
  client.exists(rk(settings.keys.users,userLookup),function(err,userExists) {
    if (err) { cb('error', null); } else {
      if (userExists === 0) {
        cb(null,null); //unknown user
      } else {
        cb(null,userLookup);
      }
    }
  });
}

/**
 * Adds the profile data to the request object. Primarily used internally, but has external uses, especially if anotehr middleware makes changes to the profile and you want to re-pickup the new changes.
 *
 * @static
 * @memberOf haloid
 * @category middleware
 * @param {object} req Express Request Object
 * @param {object} res Express Response Object
 * @param {function} next Next callback
 * @returns
 *
 */
function profileData(req,res,next) {
  if (req.user) {
    client.hgetall(
      rk(settings.keys.users,req.user),
      function(err,values) {
        var
          profileData;
          
        if (err) { next(err); } else {
          profileData = unflat(values);
          
          if (Number(profileData.blocked) === 1) {
            if (settings.blockedRedirect) {
              //this stops the redirect loop
              if (req.originalUrl !== settings.blockedRedirect) {
                res.redirect(settings.blockedRedirect);
              } else {
                next();
              }
            } else {
              res.status(401).end('Blocked.');
            }
          } else {
            req.userProfile = merge(settings.userDefaults,profileData);
            next();
          }
        }
      }
    );
  } else { next(); }
}

/**
 * Middleware factory to get authorized capabilities a user and add them to the request object
 *
 * @static
 * @memberOf haloid
 * @category middleware
 * @param {array} capabilitiesList Array of the capabilities slugs
 * @param {string} dest The destination inside the `req.haloidValues` object.
 * @returns {function} Express middleware
 * 
 */
function fetchCapabilities(capabilitiesList,dest) {
  return function(req,res,next) {
    getCapabilities(capabilitiesList,req.user,function(err,results){
      if (err) { next(err); } else {
        req.haloidValues[dest] = zipObj(capabilitiesList,results);
        next();
      }
    });
  };
}

/**
 * Primitave to get the capabilities from redis
 * 
 * @private
 * @param {array} capabilitiesList Array of the capabilities slugs
 * @param {string} user Hash of user
 * @param {function} cb callback
 * @returns
 *
 */
function getCapabilities(capabilitiesList,user,cb) {
  var
    i,
    capabilitiesCheckMulti = client.multi();
    
  for(i = 0; i < capabilitiesList.length; i += 1) {
    capabilitiesCheckMulti.hget(
      rk(settings.keys.capabilities,user),
      capabilitiesList[i]
    );
  }
  
  capabilitiesCheckMulti.exec(cb);
}

/**
 * Sugar, if the value is 0 or null it returns null.
 *
 * @private
 * @param {number} val any number or null
 * @returns
 * 
 */
function notNull(val) {
  return Number(val) !== 0 ? 1 : 0; 
}
/**
 * Sugar, just add some values. Used for reduce
 *
 * @private
 * @param {number} a a number
 * @param {number} b a number
 * @returns {number} the sum of `a` and `b`
 *
 */
function sum(a, b) {
  return a + b;
}


/**
 * Middleware factory to require capabilities for a route
 *
 * @static
 * @memberOf haloid
 * @category middleware
 * @param {...string} aCapability slug of a capability
 * @returns {function} Express Middleware function
 * 
 */
function userCan() {
/*
 * pass in any capabilities to check for - it will look at the
 *
 * haloid:capabilities:<userMd5>
 *
 * and find any fields that match. If the field is present, then it counts, otherwise it is 0.
 *
 * At the end we'll sum them and if the sum matches the number of arguments, we're golden, otherwise reject the user
 *
 */
  var
    userCanArguments =  Array.prototype.slice.call(arguments);
    
  return function(req,res,next) {
    if (req.user) {
      getCapabilities(userCanArguments,req.user,function(err,capabilitiesVals){
        var capabSum;
        if (err) {
          next(err);
        } else {
          capabSum = capabilitiesVals
            .map(notNull)
            .reduce(sum);
          
          if (capabSum === userCanArguments.length) {
            next();
          } else {
            module.exports.genericError({ status : 401 },req,res);
          }
        }
      });
    } else {
      module.exports.genericError({ status : 401 },req,res);
    }
  };
}

/**
 * Restricted to logged in users only. Alias of `passwordless.restricted()`.
 *
 * @static
 * @memberOf haloid
 * @category middleware
 * @param {object} options (see passwordless for documentation)
 * @returns Express Middleware
 *
 */
function restricted(options) {
  return passwordless.restricted.call(passwordless,options);
}


/**
 * Pass a raw error to the user
 *
 * @static
 * @memberOf haloid
 * @category routes
 * @param {Object} errorObject - Description of the error (see example)

 * @param {object} req - Express Request object
 * @param {object} res - Express Response object
 * @returns
 *
 * @example
 * //error object
{
  langCode : 'en',
  status   : 500    //http status code
}
 *
 */
function genericError(errorObject,req,res) {
  var
    errorTemplate = extend({
        langCode  : req.params.langCode || 'en',
        pageTitle : 'Error '+ (errorObject.status || 500)
      },
      errorObject
    );
  res.status(errorObject.status || 500).end(
    '<pre>'+
    JSON.stringify(errorTemplate,' ',' ',' ')+
    '</pre>'
  );
}

/**
 * Logs out a user (not the current user) by adding the user to a list. For this to be effective the `haloid.forceLogout` middleware. Admin.
 *
 * @static
 * @memberOf haloid
 * @category middleware
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @param {Function} next - Express next function
 * @returns
 * 
 */
function logOutUser(req,res,next) {
  //console.log('uid',req.params.uid);
  thisRedisStore.invalidateUser(req.params.uid,function(err){
    if (err) { next(err); } else {
      res.send({ status : 'ok'});
    }
  });
}

/**
 * Middleware to check if a user is on the force logout list. If the user is on the logout list, then a logout will occur on the next http request. 
 *
 * @static
 * @memberOf haloid
 * @category middleware
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @param {Function} next - Express next function
 * @returns
 * 
 */
function forceLogout(req,res,next) {
  var
    forceMulti = client.multi();
  
  forceMulti
    .sismember(settings.keys.forceLogout,req.user)
    .srem(settings.keys.forceLogout,req.user);
  
  forceMulti.exec(function(err, results){
    var
      membership;
      
    if (err) { next(err); } else {
      membership = results[0];
      if (membership === 1) {
        
        res.redirect('/logout');
      } else {
        next();
      }
    }
  });
}

/**
 * Change some profile data on a user. Looks for `req.params.field`, `req.params.uid` and `req.body.newValue`. Admin.
 *
 * @static
 * @memberOf haloid
 * @category admin
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @param {Function} next - Express next function
 * @returns
 *
 */
function changeProfileData(req,res,next) {
  var
    field = req.params.field,
    uid = req.params.uid,
    newValue = req.body.newValue;
  
  if (profileFieldBlackList[field]) {
    res.status(401).end('You cannot change '+field);
  } else {
    client.hset(rk(settings.keys.users,uid),field,newValue,function(err) {
      var
        out = {};
      if (err) {
        next(err);
      } else {
        out[uid] = {};
        out[uid][field] = newValue;
        res.send(out);
      }
    });
  }
}

/**
 * Blocks a user.  Looks for `req.params.uid` and `req.params.blockUnblock` ('block' or 'unblock'). Admin.
 *
 * @static
 * @memberOf haloid
 * @category admin
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @param {Function} next - Express next function
 * @returns
 *
 */
function blockUser(req,res,next) {
  var
    uid = req.params.uid,
    blockOrUnblock = req.params.blockUnblock;
  
  
  client.hset(
    rk(settings.keys.users,uid),
    'blocked',
    blockOrUnblock === 'block' ? 1 : 0,
    function(err) {
      if (err) { next(err); } else {
        res.send({ status : blockOrUnblock });
      }
    }
  );
}


/**
 * Opposite of `haloid.restricted` - e.g. only users that are *not* logged in will be able to access this page. Middleware.
 *
 * @static
 * @memberOf haloid
 * @category middleware
 * @param {Object} req - Express Request Object
 * @param {Object} res - Express Response Object
 * @param {Function} next - Express next function
 * @returns
 * 
 */
function loggedOutOnly(req,res,next) {
  if (req.user) {
    res.redirect('/');
  } else {
    next();
  }
}


/**
 * Sugar. If the el is true it returns true. For some funtional maniuplation.
 *
 * @private
 * @returns
 *
 */
function isTrue(el) {
  return el === true;
}


/**
 * Takes an editSetObject (an object that contains the relevant text, storage location and validation functions) and returns a slightly rearranged version that is ready to be put into the templates
 *
 * @static
 * @memberOf haloid.forms
 * @category forms
 * @param {Object} formField - Object containing the form input / label sets (see example)
 * @param {string} key - the key of the object that you are extracting
 * @returns {object} Edit set ready for `req.haloidValues`
 *
 * @example
haloid.forms.editSet({
  name : {
    control : {
      label       : 'Name',                   //displayed
      placeholder : 'Name Placeholder',       //HTML control placeholder
      value       : 'bob',                    //value you're passing in
      validationHelp : 'Help block for name'  //what to show when validation fails
    },
    store   : {
      //important, but not used by editSet
    },
    validate : [
      //important, but not used by editSet
    ]
  }
},'name');
//returns
{
  label       : 'Name', 
  placeholder : 'Name Placeholder', 
  value       : 'bob;,
  validationHelp : 'Help block for name',
  nameId      : 'name'
}

 */
function editSet(formField,key) {
  var
    outEditSet = extend(formField[key].control);
  
  outEditSet.nameId = key;
  
  return outEditSet;
}


/**
 * Check the validation of a POST form field based on the information in the editSetsObject.
 *
 * @static
 * @memberOf haloid.forms
 * @category forms
 * @param {object} req - Express request object
 * @param {object} formField - the editSetsObject
 * @param {string} key - the key of the relevant editSetObject
 * @returns true if the validation passes, otherwise false
 *
 */
function checkValidation(req,formField,key) {
  var
    validators,
    isValid;
  
  validators = formField[key].validate ? formField[key].validate.slice(0) : [];
    
  validators = validators.map(function(aValidatorObj) {
    var
      validatorArgs = [req.body[key]].concat(aValidatorObj.options || []);
      
    return module.exports.validator[aValidatorObj.fn].apply(module.exports.validator,validatorArgs);
  });
  
  isValid = validators.every(isTrue);
  
  formField[key].control.valid = isValid;
  
  return isValid;
}


/**
 * Validates all the fields in the editSetsObject against the POST fields in the Express `req` object
 *
 * @static
 * @memberOf haloid.forms
 * @category forms
 * @param {object} req - Express request object
 * @param {object} formField - an editSetObject
 * @returns true if all fields validate, otherwise false
 * 
 */
function validateAll(req,formField) {
  var
    validations = [];
    
  Object.keys(req.body).forEach(function(aKey) {
    var
      isValid = checkValidation(req,formField,aKey);
    validations.push(isValid);
  });
  
  return validations.every(isTrue);
}


/**
 * Repopulate the editSet with POST values. Useful in preventing form blanking during validation failures.
 *
 * @static
 * @memberOf haloid.forms
 * @category forms
 * @param {object} req - Express request object
 * @param {formFields} formFields - an editSetsObject
 * @returns {object} the new editSetsObject with the values set to the corresponding req.body values
 *
 */
function repopulateForm(req,formFields) {
  Object.keys(req.body).forEach(function(aKey) {
    formFields[aKey].control.value = req.body[aKey];
  });
  
  return formFields;
}

/**
 * Save a field to redis based on the values in the editSet.store object.
 *
 * @private
 *
 * @param {object} multi - redis multi/bulk object
 * @param {object} req - Express request Object
 * @param {object} formFields - the editSetsObject
 * @param {string} field - the key of the field that is to be saved
 * @returns redis multi/bulk
 *
 */
function saveField(multi,req,formFields, field) {
  var
    fnMap = {
      'hash'  : 'hset',
      'string': 'set'
    },
    keyType = fnMap[formFields[field].store.keyType],
    fn = client[keyType],
    storeArgs =[];
  
  if (keyType === 'hset') {
    storeArgs.push(
      formFields[field].store.key,
      formFields[field].store.field,
      req.body[field]
    );
  } else if (keyType === 'set') {
    storeArgs.push(
      formFields[field].store.key,
      req.body[field]
    );
  }
  fn.apply(client,storeArgs);
  
  return multi;
}

/**
 * Save all the fields in the editSetsObject to the corresponding values in req.body (POST)
 *
 * @static
 * @memberOf haloid.forms
 * @category forms
 * @argument {object} req - Express request object
 * @argument {object} formFields - editsetsObject
 * @argument {function} cb - callback
 * @returns
 *
 */
function saveForm(req,formFields,cb) {
  var
    saveMulti = client.multi();
  
  Object.keys(formFields).forEach(function(aKey) {
    saveField(saveMulti,req,formFields,aKey);
  });
  
  saveMulti.exec(cb);
}


/**
 * Determines if the email address is unique in the userbase
 *
 * @static
 * @memberOf haloid
 * @category tools
 * @argument {string} anAddress - an email address
 * @argument {function} cb - callback that returns `cb(err,hash)` `hash` returns false if a user already exists. If no user exists, then it returns the hashed version of the email
 * @returns
 * 
 */
function uniqueUserEmail(anAddress,cb) {
  var
    emailHash = module.exports.userLookupHash(anAddress);
    
  client.exists(
    rk(settings.keys.users,emailHash),
    function(err, exists) {
      if (err) {
        cb(err);
      } else {
        cb(null, exists === 1 ? false : emailHash);
      }
    }
  );
}


/**
 * Adds a user to the user index. This indicates that the user now exists and nothing more.
 *
 * @static
 * @memberOf haloid
 * @category admin
 * @argument {object} user - Express request object
 * @returns
 * 
 */
function addToUserList(user,cb) {
  client.sadd(settings.keys.userList,module.exports.userLookupHash(user),cb);
}

/**
 * Route that adds a capability to a user (in GET 'capability' to GET 'uid'). Admin function.
 *
 * @static
 * @memberOf haloid
 * @category admin
 * @argument {object} req - Express request object
 * @argument {object} res - Express response object
 * @argument {function} next - Express next function (only used in a failure)
 * @returns
 * 
 */
function addCapability(req,res,next) {
  client.hset(
    rk(settings.keys.capabilities,req.params.uid),
    req.params.capability,
    1,
    function(err) {
      if (err) { next(err); } else {
        res.send( { status : 'ok'});
      }
    }
  );
}

/**
 * Route that removes a capability to a user (in GET 'capability' to GET 'uid'). Admin function.
 *
 * @static
 * @memberOf haloid
 * @category admin
 * @argument {object} req - Express request object
 * @argument {object} res - Express response object
 * @argument {function} next - Express next function (only used in a failure)
 * @returns
 * 
 */
function removeCapability(req,res,next) {
  client.hdel(
    rk(settings.keys.capabilities,req.params.uid),
    req.params.capability,
    function(err) {
      if (err) { next(err); } else {
        res.send( { status : 'ok'});
      }
    }
  );
}


/**
 * Route that adds a user(GET 'uid') to the logout list. Admin function.
 *
 * @static
 * @memberOf haloid
 * @category admin
 * @argument {object} req - Express request object
 * @argument {object} res - Express response object
 * @argument {function} next - Express next function (only used in a failure)
 * @returns
 * 
 */
function logoutToken(req,res,next) {
  client.sadd(
    rk(settings.keys.forceLogout),
    req.params.uid,
    function(err) {
      if (err) { next(err); } else {
        res.send( { status : 'ok'});
      }
    }
  );
}

/**
 * Route that deletes a user (GET `uid`). Admin fucntion
 *
 * @static
 * @memberOf haloid
 * @category admin
 * @argument {object} req - Express request object
 * @argument {object} res - Express response object
 * @argument {function} next - Express next function (only used in a failure)
 * @returns
 * 
 */
function deleteUser(req,res,next) {
  var
    delUserMulti = client.multi();
    
  delUserMulti
    .del(rk(settings.keys.users, req.params.uid))
    .srem(settings.keys.userList, req.params.uid)
    .exec(function(err) {
      if (err) { next(err); } else {
        res.send({ status : 'ok' });
      }
    });
}


/**
 * Middleware that logs the date/time, logged in user's email and the originalUrl (aka route)
 * 
 * @static
 * @memberOf haloid
 * @category logging
 * @argument {object} req - Express request object
 * @argument {object} res - Express response object
 * @argument {function} next - Express next function
 * @returns
 *
 */
function userLogger(req,res,next) {
  if (req.userProfile) {
    console.log(new Date().getTime(), req.userProfile.email, req.originalUrl);
  }

  next();
}

/**
 * Middleware that logs the values in req.haloidValues
 * 
 * @static
 * @memberOf haloid
 * @category logging
 * @argument {object} req - Express request object
 * @argument {object} res - Express response object
 * @argument {function} next - Express next function
 * @returns
 *
 */
function valuesLogger(req,res,next) {
  console.log(req.haloidValues);
  next();
}


/**
 * Route factory that returns the token send route (`/sendtoken`) followed by the middleware and routes in `toDo`
 * 
 * @static
 * @category routes
 * @memberOf haloid.routes
 * @argument {array} toDo - array of fun 
 * @returns
 *
 */
function sendToken(toDo) {
  return ['/sendtoken',module.exports.requestToken].concat(toDo);
}


/**
 * Route factory that returns the logout route. After the user is logged out they are redirected back to `/`
 * 
 * @static
 * @category routes
 * @memberOf haloid.routes
 * @returns
 *
 */
function logout() {
  return [
    '/logout',
    passwordless.logout(),
    function(req, res) {
      res.redirect('/');
    }
  ];
}

routes = {
  sendToken : sendToken,
  logout    : logout
};


module.exports = {
  forms             : {
    editSet           : editSet,
    checkValidation   : checkValidation,
    validateAll       : validateAll,
    repopulate        : repopulateForm,
    save              : saveForm
  },
  addToUserList     : addToUserList,
  uniqueUserEmail   : uniqueUserEmail,
  loggedOutOnly     : loggedOutOnly,
  validator         : validator, //expose it for custom validation routines
  genericError      : genericError,
  restricted        : restricted,
  userCan           : userCan,
  profileData       : profileData,
  userLookupHash    : userLookupHash,
  routes            : routes,
  
  announceRoute     : announceRoute,
  sendPage          : sendIt,
  addTemplate       : addTemplate,
  compileTemplates  : compileTemplates,
  compileClientTemplates
                    : compileClientTemplates,
  redisClient       : redisClient,
  use               : haloidUse,
  setup             : setup,
  settings          : settings,
  deinterlace       : deinterlace,
  logOutUser        : logOutUser,
  changeProfileData : changeProfileData,
  
  tokenDelievery    : defaultDelivery,
  
  forceLogout       : forceLogout,
  addLogoutToken    : logoutToken,
  blockUser         : blockUser,
  deleteUser        : deleteUser,
  
  
  addCapability     : addCapability,
  removeCapability  : removeCapability,
  fetchCapabilities : fetchCapabilities,
  
  userLogger        : userLogger,
  valuesLogger      : valuesLogger,
  
  rk                : rk
};

/*
 * To generate docs
 * docdown haloid.module.node.js haloid-doc.md url="https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js" title="Haloid" toc="categories"
 *
 */