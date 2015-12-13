module.exports = {


  friendlyName: 'get page',


  description: 'get page name',


  extendedDescription: 'retrieves page name',
  cacheable: true,

  inputs: {
    fbPageId: {
      example: '123831290831209312',
      description: 'facebook page id',
      required: true
    },

    accessToken: {
      example: 'CAACEdEose0cBACBhZA7DJbYapwM7oZBt1EWhPiGqibBZAZAZCZCe6IOkfDRzrs1jyZCS93zSuj9GaNQQtxbny0jeSCqyBNaQUl3ocDiD3lO4GSboFm5B7NogSHFzTGYw0rdpndDKolQcfsS5nYeYwZAIKXF1WPzgGaGxNIDh36oZBHuazcN3WSNmL9jGyO9YmYlZBmZCcigBuMFvtXj4XlzNWyb',
      description: 'this is the facebook issued access token for a given user and app pair',
      required: true
    }
  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'The Facebook API returned an error (i.e. a non-2xx status code)',
    },

    success: {
      description: 'page name',
    },

  },


  fn: function (inputs,exits) {

    var doJSONRequest = require('../lib/do-request');

    // GET ad accounts/ and send the api token as a header
    doJSONRequest({
      method: 'get',
      url: ['/v2.3/', inputs.fbPageId ].join(""),
      data: {
        'fields' : 'name',
        'access_token' : inputs.accessToken
      },
      headers: {},
    }, function (err, responseBody) {
      if (err) { return exits.error(err); }
      return exits.success(responseBody);
    });
    // here we are fixing this for create-campaign
  }
};
