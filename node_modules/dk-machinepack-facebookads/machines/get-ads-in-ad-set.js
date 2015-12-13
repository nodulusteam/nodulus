module.exports = {


  friendlyName: 'get-ads-in-ad-set',


  description: 'get ads in an ad set with standard metadata',


  extendedDescription: 'get ads in an ad set and standard metadata',
  cacheable: true,

  inputs: {
    adCampaignId: {
      example: '31231321312',
      description: 'an adcampaign is an adset',
      required: true
    },

    accessToken: {
      example: 'CAACEdEose0cBACBhZA7DJbYapwM7oZBt1EWhPiGqibBZAZAZCZCe6IOkfDRzrs1jyZCS93zSuj9GaNQQtxbny0jeSCqyBNaQUl3ocDiD3lO4GSboFm5B7NogSHFzTGYw0rdpndDKolQcfsS5nYeYwZAIKXF1WPzgGaGxNIDh36oZBHuazcN3WSNmL9jGyO9YmYlZBmZCcigBuMFvtXj4XlzNWyb',
      description: 'this is the facebook issued access token for a given user and app pair',
      required: true
    },
  },


  defaultExit: 'success',


  exits: {

    error: {
      description: 'The Facebook API returned an error (i.e. a non-2xx status code)',
    },

    success: {
      description: 'Here are the ads in the ad set and their standard metadata',
    },

  },

// get ad sets by campaign - first, find the right campaign id for a given name
// second, fetch all the ad sets for that given campaign
  fn: function (inputs,exits) {

    var doJSONRequest = require('../lib/do-request');
    var fields = inputs.fields || 'id,stats,name,adgroup_status';
    // GET ad accounts/ and send the api token as a header
    doJSONRequest({
      method: 'get',
      url: ['/v2.3/', inputs.adCampaignId, '/adgroups' ].join(""),
      data: {
        'access_token': inputs.accessToken,
        'fields' : fields
      },
      headers: {},
    },
    function (err, responseBody) {
      if (err) { return exits.error(err); }
      return exits.success(responseBody);
    });
  }
};
