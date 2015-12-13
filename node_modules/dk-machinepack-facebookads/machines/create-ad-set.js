module.exports = {


  friendlyName: 'create-ad-set',


  description: 'create an ad set and the creative',


  extendedDescription: 'return a paused campaign',
  cacheable: true,

  inputs: {
    fbUserId: {
      example: '509503',
      description: 'facebook user id',
      required: true,
    },

    adCampaignGroupId: {
      example: '3213213124',
      description: 'woo campaign group id',
      required: true,
    },

    adImages: {
      example: "['fadlk3421jkl;rehui234', '1235tgds43q41234']",
      description: 'an array of image_hashes returned by facebook',
      required: true,
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
    example: {},
      description: 'The Facebook API returned an error (i.e. a non-2xx status code)',
    },

    success: {
      example: {},
      description: 'here is your campaign id',
    },

  },


  fn: function (inputs,exits) {
    // fetch ad set information

    // create the ad set
    doBatchRequest({
      method: 'post',
      url: ['/v2.3', ]
    })






    var doJSONRequest = require('../lib/do-request');

    getAdAccountId = require('machine').build(require('./get-ad-account-id'));

    getAdAccountId({
      "fbUserId" : inputs.fbUserId,
      "accessToken" : inputs.accessToken
    }).exec({
      error: function(error){
        return exits.error(error);
      },

      success: function(account_id){
        // get the page name of the page id param

        doJSONRequest({
          method: 'post',
          url: ['/v2.3/', account_id.data[0].id, '/adcampaigns' ].join(""),
          data: {
            'name' : ['Woo - ', page.name,'-', Date.now()].join(""),
            'bid_type' : 'ABSOLUTE_OCPM' ,
            'bid_info' : {"REACH" : 100, "CLICKS" : 200},
            'campaign_status' : 'PAUSED',
            'daily_budget' : '1000',
            'campaign_group_id' : inputs.campaignGroupId,
            'targeting' : {'geo_locations' : 'Boston'},
            'objective' : 'WEBSITE_CONVERSIONS',
            'campaign_group_status' : 'PAUSED',
            'access_token': inputs.accessToken

          },
          headers: {},
        },

            function (err, responseBody) {
              if (err) { return exits.error(err); }
              return exits.success(responseBody);
            });
          }
    })// success function find account id
  } // module exports
}
