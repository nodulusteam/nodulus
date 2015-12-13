module.exports = {


  friendlyName: 'get-top-ad-in-ad-set',


  description: 'return the best performing ad in ad set',


  extendedDescription: 'fetch all ads in ad set and then return top performing ad, determined by impressions served.',
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
      description: 'Done.',
    },

  },

// get ad sets by campaign - first, find the right campaign id for a given name
// second, fetch all the ad sets for that given campaign
  fn: function (inputs,exits) {

    var doJSONRequest = require('../lib/do-request');

    // GET ad accounts/ and send the api token as a header
    doJSONRequest({
      method: 'get',
      url: ['/v2.3/', inputs.adCampaignId, '/adgroups' ].join(""),
      data: {
        'access_token': inputs.accessToken,
        'fields' : 'id,stats'
      },
      headers: {},
    },
    function (err, responseBody) {
      if (err) { return exits.error(err); }

      // parse the response and create a new json object.
      var myJson = responseBody;
      var newArray = [];
      var len = myJson.data.length;
      for (var i=0; i<len; i++){
        newArray.push({
          'id' : myJson.data[i].id,
          'clicks' : myJson.data[i].stats.clicks,
          'impressions' : myJson.data[i].stats.impressions
         });
       }
       newArray.sort(function(a,b){
        return b.impressions - a.impressions;
      }),
      responseBody = newArray[0];
      return exits.success(responseBody);
    });
  }
};
