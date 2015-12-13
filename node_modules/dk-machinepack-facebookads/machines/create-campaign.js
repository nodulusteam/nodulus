module.exports = {


  friendlyName: 'create-campaign',


  description: 'create a facebook campaign',


  extendedDescription: 'create facebook campaign and return campaignGroupId',
  cacheable: true,

  inputs: {
    fbUserId: {
      example: '509503',
      description: 'facebook user id',
      required: true
    },

    fbPageId: {
      example: '3213213124',
      description: 'facebook page id',
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
    var doJSONRequest = require('../lib/do-request');

    getAdAccountId = require('machine').build(require('./get-ad-account-id'));
    getPageName = require('machine').build(require('./get-page'));

    getAdAccountId({
      "fbUserId" : inputs.fbUserId,
      "accessToken" : inputs.accessToken
    }).exec({
      error: function(error){
        return exits.error(error);
      },

      success: function(account_id){
        // get the page name of the page id param
        getPageName({
          "fbPageId" : inputs.fbPageId,
          "accessToken" : inputs.accessToken
        }).exec({
          error: function(error){
            console.log(error);
            return exits.error(error);
          },

          success: function(page){
            doJSONRequest({
              method: 'post',
              url: ['/v2.3/', account_id.data[0].id, '/adcampaign_groups' ].join(""),
              data: {
                'name' : ['Woos - ', page.name].join(""),
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
        })
      }
    })// success function find account id
  } // module exports
}
