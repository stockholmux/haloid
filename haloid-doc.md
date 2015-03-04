# Haloid

<!-- div class="toc-container" -->

<!-- div -->

## `admin`
* <a href="#haloid-addCapability">`haloid.addCapability`</a>
* <a href="#haloid-addToUserList">`haloid.addToUserList`</a>
* <a href="#haloid-blockUser">`haloid.blockUser`</a>
* <a href="#haloid-changeProfileData">`haloid.changeProfileData`</a>
* <a href="#haloid-deleteUser">`haloid.deleteUser`</a>
* <a href="#haloid-logoutToken">`haloid.logoutToken`</a>
* <a href="#haloid-removeCapability">`haloid.removeCapability`</a>

<!-- /div -->

<!-- div -->

## `forms`
* <a href="#haloid-forms-checkValidation">`haloid.forms.checkValidation`</a>
* <a href="#haloid-forms-editSet">`haloid.forms.editSet`</a>
* <a href="#haloid-forms-repopulateForm">`haloid.forms.repopulateForm`</a>
* <a href="#haloid-forms-saveForm">`haloid.forms.saveForm`</a>
* <a href="#haloid-forms-validateAll">`haloid.forms.validateAll`</a>

<!-- /div -->

<!-- div -->

## `init`
* <a href="#haloid-haloidUse">`haloid.haloidUse`</a>
* <a href="#haloid-redisClient">`haloid.redisClient`</a>

<!-- /div -->

<!-- div -->

## `logging`
* <a href="#haloid-announceRoute">`haloid.announceRoute`</a>
* <a href="#haloid-userLogger">`haloid.userLogger`</a>
* <a href="#haloid-valuesLogger">`haloid.valuesLogger`</a>

<!-- /div -->

<!-- div -->

## `middleware`
* <a href="#haloid-addTemplate">`haloid.addTemplate`</a>
* <a href="#haloid-fetchCapabilities">`haloid.fetchCapabilities`</a>
* <a href="#haloid-forceLogout">`haloid.forceLogout`</a>
* <a href="#haloid-logOutUser">`haloid.logOutUser`</a>
* <a href="#haloid-loggedOutOnly">`haloid.loggedOutOnly`</a>
* <a href="#haloid-profileData">`haloid.profileData`</a>
* <a href="#haloid-restricted">`haloid.restricted`</a>
* <a href="#haloid-sendIt">`haloid.sendIt`</a>
* <a href="#haloid-userCan">`haloid.userCan`</a>

<!-- /div -->

<!-- div -->

## `routes`
* <a href="#haloid-genericError">`haloid.genericError`</a>
* <a href="#haloid-routes-logout">`haloid.routes.logout`</a>
* <a href="#haloid-routes-sendToken">`haloid.routes.sendToken`</a>

<!-- /div -->

<!-- div -->

## `stub`
* <a href="#haloid-defaultDelivery">`haloid.defaultDelivery`</a>
* <a href="#haloid-userLookupHash">`haloid.userLookupHash`</a>

<!-- /div -->

<!-- div -->

## `tools`
* <a href="#haloid-compileTemplates">`haloid.compileTemplates`</a>
* <a href="#haloid-deinterlace">`haloid.deinterlace`</a>
* <a href="#haloid-rk">`haloid.rk`</a>
* <a href="#haloid-uniqueUserEmail">`haloid.uniqueUserEmail`</a>

<!-- /div -->

<!-- div -->

## `Methods`

<!-- /div -->

<!-- div -->

## `Properties`

<!-- /div -->

<!-- /div -->

<!-- div class="doc-container" -->

<!-- div -->

## `“admin” Methods`

<!-- div -->

### <a id="haloid-addCapability"></a>`haloid.addCapability()`
<a href="#haloid-addCapability">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L890 "View in source") [&#x24C9;][1]

Route that adds a capability to a user (in GET 'capability' to GET 'uid'). Admin function.

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-addToUserList"></a>`haloid.addToUserList()`
<a href="#haloid-addToUserList">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L874 "View in source") [&#x24C9;][1]

Adds a user to the user index. This indicates that the user now exists and nothing more.

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-blockUser"></a>`haloid.blockUser(req, res, next)`
<a href="#haloid-blockUser">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L596 "View in source") [&#x24C9;][1]

Blocks a user.  Looks for `req.params.uid` and `req.params.blockUnblock` ('block' or 'unblock'). Admin.

#### Arguments
1. `req` *(Object)*: - Express Request Object
2. `res` *(Object)*: - Express Response Object
3. `next` *(Function)*: - Express next function

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-changeProfileData"></a>`haloid.changeProfileData(req, res, next)`
<a href="#haloid-changeProfileData">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L561 "View in source") [&#x24C9;][1]

Change some profile data on a user. Looks for `req.params.field`, `req.params.uid` and `req.body.newValue`. Admin.

#### Arguments
1. `req` *(Object)*: - Express Request Object
2. `res` *(Object)*: - Express Response Object
3. `next` *(Function)*: - Express next function

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-deleteUser"></a>`haloid.deleteUser()`
<a href="#haloid-deleteUser">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L964 "View in source") [&#x24C9;][1]

Route that deletes a user (GET `uid`). Admin fucntion

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-logoutToken"></a>`haloid.logoutToken()`
<a href="#haloid-logoutToken">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L940 "View in source") [&#x24C9;][1]

Route that adds a user(GET 'uid') to the logout list. Admin function.

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-removeCapability"></a>`haloid.removeCapability()`
<a href="#haloid-removeCapability">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L915 "View in source") [&#x24C9;][1]

Route that removes a capability to a user (in GET 'capability' to GET 'uid'). Admin function.

* * *

<!-- /div -->

<!-- /div -->

<!-- div -->

## `“forms” Methods`

<!-- div -->

### <a id="haloid-forms-checkValidation"></a>`haloid.forms.checkValidation(req, formField, key)`
<a href="#haloid-forms-checkValidation">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L707 "View in source") [&#x24C9;][1]

Check the validation of a POST form field based on the information in the editSetsObject.

#### Arguments
1. `req` *(object)*: - Express request object
2. `formField` *(object)*: - the editSetsObject
3. `key` *(string)*: - the key of the relevant editSetObject

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-forms-editSet"></a>`haloid.forms.editSet(formField, key)`
<a href="#haloid-forms-editSet">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L685 "View in source") [&#x24C9;][1]

Takes an editSetObject (an object that contains the relevant text, storage location and validation functions) and returns a slightly rearranged version that is ready to be put into the templates

#### Arguments
1. `formField` *(Object)*: - Object containing the form input / label sets *(see example)*
2. `key` *(string)*: - the key of the object that you are extracting

#### Returns
*(object)*:  Edit set ready for `req.haloidValues`

#### Example
```js
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
```
* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-forms-repopulateForm"></a>`haloid.forms.repopulateForm(req, formFields)`
<a href="#haloid-forms-repopulateForm">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L765 "View in source") [&#x24C9;][1]

Repopulate the editSet with POST values. Useful in preventing form blanking during validation failures.

#### Arguments
1. `req` *(object)*: - Express request object
2. `formFields` *(formFields)*: - an editSetsObject

#### Returns
*(object)*:  the new editSetsObject with the values set to the corresponding req.body values

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-forms-saveForm"></a>`haloid.forms.saveForm()`
<a href="#haloid-forms-saveForm">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L824 "View in source") [&#x24C9;][1]

Save all the fields in the editSetsObject to the corresponding values in req.body (POST)

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-forms-validateAll"></a>`haloid.forms.validateAll(req, formField)`
<a href="#haloid-forms-validateAll">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L740 "View in source") [&#x24C9;][1]

Validates all the fields in the editSetsObject against the POST fields in the Express `req` object

#### Arguments
1. `req` *(object)*: - Express request object
2. `formField` *(object)*: - an editSetObject

* * *

<!-- /div -->

<!-- /div -->

<!-- div -->

## `“init” Methods`

<!-- div -->

### <a id="haloid-haloidUse"></a>`haloid.haloidUse(app)`
<a href="#haloid-haloidUse">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L132 "View in source") [&#x24C9;][1]

Applies all required middlewares to `app`

#### Arguments
1. `app` *(Object)*: Express app object

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-redisClient"></a>`haloid.redisClient()`
<a href="#haloid-redisClient">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L167 "View in source") [&#x24C9;][1]

Initializes redis

#### Returns
*(object)*:  redis client

* * *

<!-- /div -->

<!-- /div -->

<!-- div -->

## `“logging” Methods`

<!-- div -->

### <a id="haloid-announceRoute"></a>`haloid.announceRoute(aVerb, aRoute)`
<a href="#haloid-announceRoute">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L213 "View in source") [&#x24C9;][1]

Logs the route to the console, to be used with routewrangler

#### Arguments
1. `aVerb` *(string)*: The route verb *(GET,PUT,etc.)*
2. `aRoute` *(array)*: A routewrangler-style array *(0th element is the Express style route)*

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-userLogger"></a>`haloid.userLogger()`
<a href="#haloid-userLogger">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L991 "View in source") [&#x24C9;][1]

Middleware that logs the date/time, logged in user's email and the originalUrl (aka route)

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-valuesLogger"></a>`haloid.valuesLogger()`
<a href="#haloid-valuesLogger">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L1011 "View in source") [&#x24C9;][1]

Middleware that logs the values in req.haloidValues

* * *

<!-- /div -->

<!-- /div -->

<!-- div -->

## `“middleware” Methods`

<!-- div -->

### <a id="haloid-addTemplate"></a>`haloid.addTemplate(aTemplate)`
<a href="#haloid-addTemplate">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L72 "View in source") [&#x24C9;][1]

Middleware factory that applies the values of `req.haloidValues` to a compiled template and stores them in req.html and calls `next`

#### Arguments
1. `aTemplate` *(function)*: a compiled template *(single argument, jade-style)*

#### Returns
*(function)*:  Express-style middleware

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-fetchCapabilities"></a>`haloid.fetchCapabilities(capabilitiesList, dest)`
<a href="#haloid-fetchCapabilities">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L333 "View in source") [&#x24C9;][1]

Middleware factory to get authorized capabilities a user and add them to the request object

#### Arguments
1. `capabilitiesList` *(array)*: Array of the capabilities slugs
2. `dest` *(string)*: The destination inside the `req.haloidValues` object.

#### Returns
*(function)*:  Express middleware

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-forceLogout"></a>`haloid.forceLogout(req, res, next)`
<a href="#haloid-forceLogout">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L525 "View in source") [&#x24C9;][1]

Middleware to check if a user is on the force logout list. If the user is on the logout list, then a logout will occur on the next http request.

#### Arguments
1. `req` *(Object)*: - Express Request Object
2. `res` *(Object)*: - Express Response Object
3. `next` *(Function)*: - Express next function

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-logOutUser"></a>`haloid.logOutUser(req, res, next)`
<a href="#haloid-logOutUser">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L504 "View in source") [&#x24C9;][1]

Logs out a user (not the current user) by adding the user to a list. For this to be effective the `haloid.forceLogout` middleware. Admin.

#### Arguments
1. `req` *(Object)*: - Express Request Object
2. `res` *(Object)*: - Express Response Object
3. `next` *(Function)*: - Express next function

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-loggedOutOnly"></a>`haloid.loggedOutOnly(req, res, next)`
<a href="#haloid-loggedOutOnly">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L627 "View in source") [&#x24C9;][1]

Opposite of `haloid.restricted` - e.g. only users that are *not* logged in will be able to access this page. Middleware.

#### Arguments
1. `req` *(Object)*: - Express Request Object
2. `res` *(Object)*: - Express Response Object
3. `next` *(Function)*: - Express next function

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-profileData"></a>`haloid.profileData(req, res, next)`
<a href="#haloid-profileData">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L290 "View in source") [&#x24C9;][1]

Adds the profile data to the request object. Primarily used internally, but has external uses, especially if anotehr middleware makes changes to the profile and you want to re-pickup the new changes.

#### Arguments
1. `req` *(object)*: Express Request Object
2. `res` *(object)*: Express Response Object
3. `next` *(function)*: Next callback

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-restricted"></a>`haloid.restricted(options)`
<a href="#haloid-restricted">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L452 "View in source") [&#x24C9;][1]

Restricted to logged in users only. Alias of `passwordless.restricted()`.

#### Arguments
1. `options` *(object)*: *(see passwordless for documentation)*

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-sendIt"></a>`haloid.sendIt(req, res, next)`
<a href="#haloid-sendIt">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L94 "View in source") [&#x24C9;][1]

Middleware that sends req.html as a response

#### Arguments
1. `req` *(Object)*: Express request object.
2. `res` *(Object)*: Express response object.
3. `next` *(function)*: Express `next` callback

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-userCan"></a>`haloid.userCan(aCapability)`
<a href="#haloid-userCan">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L404 "View in source") [&#x24C9;][1]

Middleware factory to require capabilities for a route

#### Arguments
1. `aCapability` *(...string)*: slug of a capability

#### Returns
*(function)*:  Express Middleware function

* * *

<!-- /div -->

<!-- /div -->

<!-- div -->

## `“routes” Methods`

<!-- div -->

### <a id="haloid-genericError"></a>`haloid.genericError(errorObject, req, res)`
<a href="#haloid-genericError">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L477 "View in source") [&#x24C9;][1]

Pass a raw error to the user

#### Arguments
1. `errorObject` *(Object)*: - Description of the error *(see example)*
2. `req` *(object)*: - Express Request object
3. `res` *(object)*: - Express Response object

#### Example
```js
//error object
{
  langCode : 'en',
  status   : 500    //http status code
}
```
* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-routes-logout"></a>`haloid.routes.logout()`
<a href="#haloid-routes-logout">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L1041 "View in source") [&#x24C9;][1]

Route factory that returns the logout route. After the user is logged out they are redirected back to `/`

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-routes-sendToken"></a>`haloid.routes.sendToken()`
<a href="#haloid-routes-sendToken">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L1027 "View in source") [&#x24C9;][1]

Route factory that returns the token send route (`/sendtoken`) followed by the middleware and routes in `toDo`

* * *

<!-- /div -->

<!-- /div -->

<!-- div -->

## `“stub” Methods`

<!-- div -->

### <a id="haloid-defaultDelivery"></a>`haloid.defaultDelivery(tokenToSend, uidToSend, recipient)`
<a href="#haloid-defaultDelivery">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L117 "View in source") [&#x24C9;][1]

Stub function that defines how your token is delievered (e.g. send email). By default it simply diplays the token query string on the console.

#### Arguments
1. `tokenToSend` *(string)*: The token
2. `uidToSend` *(stinrg)*: The encoded user ID
3. `recipient` *(string)*: The email address of the user

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-userLookupHash"></a>`haloid.userLookupHash(email)`
<a href="#haloid-userLookupHash">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L251 "View in source") [&#x24C9;][1]

Stub function that defines how user emails are hashed. This is not for security purposes, but primarily to ensure consistent keys that are compatible with both redis, routes and query strings. By default, this uses hex encoded MD5. As this is a stub function, feel free to override it in your application.

#### Arguments
1. `email` *(string)*: email address of user

#### Returns
*(string)*:  hashed value

* * *

<!-- /div -->

<!-- /div -->

<!-- div -->

## `“tools” Methods`

<!-- div -->

### <a id="haloid-compileTemplates"></a>`haloid.compileTemplates(templates)`
<a href="#haloid-compileTemplates">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L227 "View in source") [&#x24C9;][1]

Compiles all the templates. This operation is prefomed synchronously, so it is only appropriate during startup.

#### Arguments
1. `templates` *(object)*: An object of templates. Should structured like `{ home : 'home', dashboard : 'dashboard'}`. The `settings.templatesDirectory` is prepended to the value and the extension '.jade' is appended. So, if `settings.templatesDirectory` was set to './templates/', the above example would read and compile './templates/home.jade' and './templates/dashboard.jade'.

* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-deinterlace"></a>`haloid.deinterlace(inArray, keys)`
<a href="#haloid-deinterlace">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L188 "View in source") [&#x24C9;][1]

Creates a collection of objects from an array with ordered elements. Useful for redis bulk replies

#### Arguments
1. `inArray` *(array)*: Array with ordered elements.
2. `keys` *(array)*: Array of names.

#### Example
```js
// returns [ { make : 'volvo', age : '3', color : 'red' }, { make : 'saab', age : '2', color : 'green' } ]
haloid.deinterlace(['volvo','3','red','saab','2','green'],['make','age','color']);
```
* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-rk"></a>`haloid.rk(strings)`
<a href="#haloid-rk">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L57 "View in source") [&#x24C9;][1]

Simple sugar to concatenate the arguments into colon (`:`) delimited keys

#### Arguments
1. `strings` *(...string)*: - a string to be concatenated

#### Returns
*(string)*:  colon delimited redis key

#### Example
```js
haloid.rk('a','b','c'); //returns a:b:c
```
* * *

<!-- /div -->

<!-- div -->

### <a id="haloid-uniqueUserEmail"></a>`haloid.uniqueUserEmail()`
<a href="#haloid-uniqueUserEmail">#</a> [&#x24C8;](https://github.com/stockholmux/haloid/blob/master/haloid.module.node.js#L847 "View in source") [&#x24C9;][1]

Determines if the email address is unique in the userbase

* * *

<!-- /div -->

<!-- /div -->

<!-- div -->

## `Methods`

<!-- /div -->

<!-- div -->

## `Properties`

<!-- /div -->

<!-- /div -->

 [1]: #admin "Jump back to the TOC."
