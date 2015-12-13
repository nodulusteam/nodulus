/**
 * Module dependencies
 */

var request = require('request');



// • method  - e.g. 'get', 'post', 'put', etc.
// • data    - e.g. {}
// • headers    - e.g. {}
// • url     - e.g. '/pets'
module.exports = function doJSONRequest(options, cb){
  options = options||{};
  options.data = options.data||{};
  options.headers = options.headers||{};
  options.method = (options.method||'get').toLowerCase();

  if (!options.url) return cb(new Error('`url` is required'));

  // Base url for API requests.
  var BASE_URL = 'https://graph.facebook.com';
  // Strip trailing slash(es)
  BASE_URL = BASE_URL.replace(/\/*$/, '');

  // url should start w/ a leading slash
  // Help our future selves out by ensuring there is a leading slash:
  options.url = options.url.replace(/^([^\/])/,'/$1');

  var requestObject;
  if (options.method==='get') {
    requestObject = {
      url: BASE_URL + options.url,
      qs: options.data,
      json: true,
      headers: options.headers
    };
  }
  else {
    requestObject = {
      url: BASE_URL + options.url,
      json: options.data,
      headers: options.headers
    };
  }
  
  // console.log('SENDING REQUESET TO .... ',requestObject);

  request[options.method](requestObject, function(err, response, httpBody) {
    // Wat
    if (err) return cb(err);

    // Non 2xx status code
    if (response.statusCode >= 300 || response.statusCode < 200) {
      return cb({
        status: response.statusCode,
        headers: response.headers,
        body: httpBody
      });
    }

    // Success, send back the body
    return cb(null, httpBody);
  });
};
