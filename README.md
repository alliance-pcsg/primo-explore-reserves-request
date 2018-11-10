# primo-explore-reserves-request
functionality for requesting items for course reserve within the catalog, for selected user groups


var app = angular.module('viewCustom', ['reservesRequest']);

app.constant('reserveRequestOptions', {
  instCode : "LCC",  //code of your library
  formatBlacklist : ["journal", "ebook"],  // formats for which this will not appear
  userGroupWhitelist : [2,3],    //array of whitelisted group members who will see this when authenticated
  selectProps : {
    "value": "3 hours", // initial default text display in select menu
    "values": ["3 hours", "1 day", "3 days"], // pulldown menu options for loan periods
    "loanRule" : "3 hours" // defaut select value for <option> value
  },
  targetUrl : "https://watzek.lclark.edu/src/prod/reservesRequestTesting.php", // URL to send data to, for emailing, etc.
  successMessage : "<md-card style='background-color:#e6e6e6;'><md-card-content><p>Your request has been placed. Watzek Library Access Services staff will aim to place the item on reserve within 24 hours. Items that are checked out will be recalled and placed on reserves as soon as possible. If you have questions, please email reserves@lclark.edu, or contact the Service Desk at 503-768-7270.</p></md-card-content></md-card>",
  failureMessage : "<md-card style='background-color:#e6e6e6;'><md-card-content><p>We're sorry, an error occurred. Please let us know at reserves@lclark.edu, or contact the Service Desk at 503-768-7270.</p></md-card-content></md-card>",
  primoDomain : "primo.lclark.edu", //to help create a permalink to the record in the email message
  primoVid : "LCC",    //to help create a permalink to the record in the email message
  primoScope : "lcc_local"  //to help create a permalink to the record in the email message
});
