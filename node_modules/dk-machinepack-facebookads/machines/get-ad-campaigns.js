module.exports = {


  friendlyName: 'get ad campaigns',


  description: 'get ad campaigns for a given ad account',


  extendedDescription: 'retrieves the ad account id for a given user',
  cacheable: true,

  inputs: {
    adAccountId: {
      example: 'act_230989',
      description: 'facebook ad account id',
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
      description: 'Here is an array of ad campaigns associated with the ad account.',
    },

  },


  fn: function(inputs, exits) {

    var doJSONRequest = require('../lib/do-request');
    var fields = inputs.fields || 'name';
    var data = {
      'access_token': inputs.accessToken,
      'fields': fields
    };
    if (inputs.queries) {
      for (var i in inputs.queries) {
        data[i] = inputs.queries[i];
      }
    }
    // GET ad accounts/ and send the api token as a header
    doJSONRequest({
      method: 'get',
      url: ['/v2.3/', inputs.adAccountId, '/adcampaign_groups'].join(""),
      data: data,
      headers: {},
    }, function(err, responseBody) {
      if (err) {
        return exits.error(err);
      }
      return exits.success(responseBody);
    });
  }
};