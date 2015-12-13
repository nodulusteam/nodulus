module.exports = {


  friendlyName: 'get first campaign id for given campaign name',


  description: 'look up a campaign by name',


  extendedDescription: 'for a given campaign name, retrieve the campaign id ',
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
    },

    adCampaignName: {
      example: 'WOO:(null)',
      description: 'the name of an individual campaign on facebook',
      required: true
    },
  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'The Facebook API returned an error (i.e. a non-2xx status code)',
    },

    success: {
      description: 'This is the first result for campaigns that match the given name',
    },

  },

// get ad sets by campaign - first, find the right campaign id for a given name
// second, fetch all the ad sets for that given campaign
  fn: function (inputs,exits) {

    var doJSONRequest = require('../lib/do-request');

    // GET ad accounts/ and send the api token as a header
    doJSONRequest({
      method: 'get',
      url: ['/v2.3/', inputs.adAccountId, '/adcampaign_groups'].join(""),
      data: {
        'access_token': inputs.accessToken,
        'fields' : 'name'
      },
      headers: {},
    },
    function (err, responseBody) {
      if (err) { return exits.error(err); }
      for (var i in responseBody.data) {
        if (responseBody.data[i].name == inputs.adCampaignName) {
            return exits.success(responseBody.data[i].id);
        }
        }
      return exits.error('no campaign found by that name');
    });
  }
};
