module.exports = {


  friendlyName: 'update-ad-set',


  description: 'update an ad set',


  extendedDescription: 'changes an ad set',
  cacheable: true,

  inputs: {
    adCampaignId: {
      example: '3213213124',
      description: 'this is the Ad Set Id',
      required: true
    },

    dailyBudget: {
      example: '100',
      description: 'daily budget, string, in cents',
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

    budgetError: {
      example: {},
      description : 'minimum budget needs to be greater than 100 cents. However, 0 is an acceptable value.',
    },

    success: {
      example: {},
      description: 'ad set has been updated.',
    },

  },


  fn: function (inputs,exits) {
    // fetch ad set information
    var doJSONRequest = require('../lib/do-request');
    if (inputs.dailyBudget < 100 && inputs.dailyBudget != 0){
      console.log('minimum budget needs to be greater than 100 cents. However, 0 is an acceptable value.');
      return exits.budgetError();
    }
    // if budget is set to 0, then pause the campaign.
    if (inputs.dailyBudget == 0) {
      console.log('0');
      doJSONRequest({
        method: 'post',
        url: ['/v2.3/', inputs.adCampaignId ].join(""),
        data: {
          'access_token': inputs.accessToken,
          'campaign_status' : 'PAUSED',
        },
        headers: {},
      },

      function (err, responseBody) {
        if (err) { return exits.error(err); }
        responseBody = 'campaign paused';
        return exits.success(responseBody);
      });
    } // end if
    else {
    doJSONRequest({
      method: 'post',
      url: ['/v2.3/', inputs.adCampaignId ].join(""),
      data: {
        'daily_budget' : inputs.dailyBudget,
        'access_token': inputs.accessToken,
        'campaign_status' : 'ACTIVE',
      },
      headers: {},
    },

    function (err, responseBody) {
      if (err) { return exits.error(err); }
      return exits.success('changed daily budget');
      console.log(responseBody)
    });
    }
  } // function (inputs, exits)
} // module exports
