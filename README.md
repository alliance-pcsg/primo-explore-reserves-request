# primo-explore-reserves-request



## Features
Allows users to submit requests for course reserves directly from the Primo catalog. Requires a server side php file to receive the request from Primo, and send as email to reserves staff. Within the app.constant options, you can indicate which user groups will see the request option.

### Screenshot
![screenshot](https://github.com/alliance-pcsg/primo-explore-reserves-request/blob/master/screenshot.png?raw=true)

## Install
1. Make sure you've installed and configured [primo-explore-devenv](https://github.com/ExLibrisGroup/primo-explore-devenv).
2. Navigate to your template/central package root directory. For example:
    ```
    cd primo-explore/custom/MY_VIEW_ID
    ```
3. If you do not already have a `package.json` file in this directory, create one:
    ```
    npm init -y
    ```
4. Install this package:
    ```
    npm install primo-explore-reserves-request --save-dev
    ```

## Usage
Once this package is installed, add `reservesRequest` as a dependency for your custom module definition.

```js
var app = angular.module('viewCustom', ['reservesRequest'])
```
Note: If you're using the `--browserify` build option, you will need to first import the module with:

```javascript
import 'primo-explore-reserves-request';
```
You can configure this customization by passing the following options via reserveRequestOptions (a full example is at the bottom of [this file](https://github.com/alliance-pcsg/primo-explore-reserves-request/blob/master/example/custom.js).) :

| param     | type         | usage                                                                                                                |
|-----------|--------------|----------------------------------------------------------------------------------------------------------------------|
| `instCode`    | string       | the short code of your institution target                                                                                   |
| `formatBlacklist`     | array | format types for which you don't want the request option to appear (e.g. journal)                                      |
| `userGroupWhitelist`     | array | Alma user groups for which you want the request option to appear
| `selectProps`     | mixed       | values for the reserves loan period select menu
| `targetUrl` | string     | URL where your PHP script lives, for converting data to email request |
| `successMessage` | html     | Message users will see upon successful request |
| `failureMessage` | html     | Message users will see upon failed request |
| `primoDomain` | string     | Domain of your primo instance (e.g. primo.lclark.edu). Used to generate permalink for staff. |
| `primoVid` | string     | VID of your Primo view. Used to generate permalink for staff. |
| `primoScope` | string     | Primo scope. Used to generate permalink for staff. |
