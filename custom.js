(function(){
"use strict";
'use strict';

var app = angular.module('viewCustom', ['reservesRequest']);





angular.module('reservesRequest', []).component('prmLoginAlmaMashupAfter', {
  bindings: { parentCtrl: '<' },
  controller: function controller($scope, $http, $element, dataService, $mdDialog, reserveRequestOptions) {

    var formatBlacklist = reserveRequestOptions.formatBlacklist;

    this.$onInit = function () {
      $scope.displayRequestLink = false;
      $scope.required = true;

      $scope.format = dataService.getFormat($scope);

      var formatCheck = formatBlacklist.indexOf($scope.format);
      if (formatCheck >= 0) {
        var okFormat = false;
      } else {
        var okFormat = true;
      }


      var userGroup = dataService.getUserGroup($scope);
      //console.log("item:");
      //console.log($scope.$parent.$parent.$parent.$parent.$ctrl.item);
      var valid = dataService.doesLCCown($scope);
      var userGroupWhitelist=reserveRequestOptions.userGroupWhitelist;
      var userCheck = userGroupWhitelist.indexOf(userGroup);
      if (userCheck > 0 && valid == true && okFormat == true) {

        $scope.displayRequestLink = true;
        $scope.instructor = dataService.getInstructor($scope);
        $scope.delCat = dataService.getDeliveryCategory($scope);
        $scope.prop=reserveRequestOptions.selectProps;
        $scope.loanRule=reserveRequestOptions.selectProps.loanRule;

      }
      //  $scope.mmsID=dataService.getMMSid($scope);
      // $scope.callNumber=dataService.getCallNumber($scope);

    };
    $scope.showSelectValue = function (mySelect) {
      console.log(mySelect);
      $scope.loanRule = mySelect;
    };

    $scope.submitRequest = function () {

      console.log("request");
      $scope.title = dataService.getTitle($scope);
      $scope.author = dataService.getAuthor($scope);
      $scope.callNumber = dataService.getCallNumber($scope);
      $scope.location = dataService.getLocation($scope);
      $scope.url = dataService.getUrl($scope);
      $scope.availability = dataService.getAvailability($scope);

      console.log($scope);
      console.log($element);
      var title = $scope.title;
      var req = {
        method: 'POST',
        url: reserveRequestOptions.targetUrl,
        headers: {
          'Content-Type': undefined
        },
        data: {
          title: $scope.title,
          loanRule: $scope.loanRule,
          callNumber: $scope.callNumber,
          instructor: $scope.instructor,
          author: $scope.author,
          course: $scope.course,
          courseTitle: $scope.courseTitle,
          location: $scope.location,
          url: $scope.url,
          availability: $scope.availability,
          comments: $scope.comments
        }
      };

      $http(req).then(function successCallback(response) {
        console.log(response);

        $element.find('md-card').html(response.data);
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        console.log(response);
        $element.find('md-card').html(response.data);
      });
    };
  },
  template: '<div ng-click="isReplyFormOpen = !isReplyFormOpen" ng-show=\'{{displayRequestLink}}\' style=\'margin-bottom:10px;\'>\n    <span style=\'color: #883300;font-weight: bold;font-size: 100%;font-size:15px;margin-left: 10px;margin-right:15px;\'>COURSE RESERVES: </span>\n    <a     style=\'font-weight: bold;\n    font-size: 100%;\n    color: #1c62a8;\n    padding: 5px 7px;\n    -moz-border-radius: 1em;\n    border-radius: 1em;\n    line-height: 1.3em;\n    background: #f5f5f5;\n    border: solid 1px #ddd;\n    height: 30px;\n    margin-left: 5px;\n    margin-right: 5px;\'\'>Place on Reserve</a></div>\n\n     <md-card style=\'background-color:#e6e6e6;margin-bottom:50px;\' ng-init="isReplyFormOpen = false" ng-show="isReplyFormOpen" id="replyForm">\n        <md-card-title>\n          <md-card-title-text>\n            <span class="md-headline">Place item on reserve</span>\n          </md-card-title-text>\n        </md-card-title>\n\n        <md-content md-theme="docs-dark" layout-gt-sm="row">\n\t\t\t<div layout="column" layout-padding>\n\t\t\t\t<div flex>Course: <input type=\'text\' ng-model=\'course\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. ART 101\' required></div>\n\t\t\t\t<div flex>Course Title: <input type=\'text\' ng-model=\'courseTitle\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. Intro to Art\' required></div>\n\t\t\t\t<div flex>Loan Period:  <span >\n\t\t\t\t  <select ng-model="prop.value" ng-change="showSelectValue(prop.value)" ng-options="v for v in prop.values">\n\t\t\t\t  </select>\n\t\t\t\t</span>\n\t\t\t\t</div>\n        <div flex>Comments: <textarea ng-model=\'comments\'></textarea></div>\n\t\t\t</div>\n\n         </md-content>\n        <md-card-actions layout="row" layout-align="left center">\n          <md-button ng-click=\'submitRequest(mySelect)\' class="rreq md-raised">Place item on reserve</md-button>\n\n        </md-card-actions>\n      </md-card>'
}).factory('dataService', ['$http', function ($http) {
  return {
    getMMSid: function getMMSid($scope) {
      var mms = $scope.$parent.$parent.$parent.$ctrl.item.pnx.display.lds04;
      //console.log("MMSID: "+mms);
      for (var i = 0; i < mms.length; i++) {
        //console.log(mms[i]);
        var pieces = mms[i].split("$$I");
        if (pieces[1] == "LCC") {
          var mmsid = pieces[0];
          $scope.mmsid = mmsid;
        }
      }
      return mmsid;
    },
    doesLCCown: function doesLCCown($scope) {

      var insts = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.institution;
      console.log(insts);
      var check = insts.indexOf("LCC");
      console.log(check);
      var second = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.browse.institution;
      var check2 = second.indexOf("LCC");
      console.log(check2);
      if (check == "-1" && check2 == "-1") {
        return false;
      } else {
        return true;
      }
    },
    getCallNumber: function getCallNumber($scope) {
      // var calls=$scope.$root.$$childHead.$$childHead.$$childHead.$$childHead.$ctrl.fullViewPageService._currentItem.pnx.browse.callnumber;
      if ($scope.delCat == "Alma-E") {
        var callNumber = "N/A";
      } else {
        var calls = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.browse.callnumber;
        for (var i = 0; i < calls.length; i++) {
          var parts = calls[i].split("$$");
          //console.log(parts);
          if (parts[1] == "ILCC") {
            var callNumber = parts[2].substring(1);
          }
        }
      }

      return callNumber;
    },
    getTitle: function getTitle($scope) {
      var title = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.btitle[0];
      return title;
    },
    getAuthor: function getAuthor($scope) {

      var obj = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata;
      if (obj.hasOwnProperty("aulast")) {
        var author = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.aulast[0];
      } else {
        var author = "N/A";
      }
      return author;
    },
    getFormat: function getFormat($scope) {
      var format = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.addata.format[0];
      return format;
    },
    getDeliveryCategory: function getDeliveryCategory($scope) {
      var delCat = $scope.$parent.$parent.$parent.$parent.$ctrl.item.delivery.deliveryCategory[0];
      return delCat;
    },
    getLocation: function getLocation($scope) {

      if ($scope.delCat == "Alma-E") {
        var location = "Electronic Resource";
      } else {
        var mainLocation = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.mainLocation;
        var subLocation = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.subLocation;

        var location = mainLocation + " " + subLocation;
      }
      return location;
    },
    getUrl: function getUrl($scope) {

      var docid = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.control.recordid[0];
      var url = "http://primo.lclark.edu/primo-explore/fulldisplay?docid=" + docid + "&context=L&vid=LCC&search_scope=lcc_local&tab=default_tab&lang=en_US";
      return url;
    },
    getAvailability: function getAvailability($scope) {
      if ($scope.delCat == "Alma-E") {
        var availability = "Electronic";
      } else {
        var availability = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.bestlocation.availabilityStatus;
      }
      return availability;
    },
    getInstructor: function getInstructor($scope) {
      var rootScope = $scope.$root;
      var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
      var jwtData = uSMS.jwtUtilService.getDecodedToken();
      console.log(jwtData);
      var instructor = jwtData.userName;
      return instructor;
    },
    getUserGroup: function getUserGroup($scope) {

      var rootScope = $scope.$root;
      var uSMS = rootScope.$$childHead.$ctrl.userSessionManagerService;
      var jwtData = uSMS.jwtUtilService.getDecodedToken();
      console.log(jwtData);
      var userGroup = parseInt(jwtData.userGroup);
      return userGroup;
    }
  };
}]);

app.constant('reserveRequestOptions', {
  formatBlacklist : ["journal", "ebook"],
  userGroupWhitelist : [2,3],
  selectProps : {
    //"type": "select",  /*  this seems unnecessary */
    //"name": "loanperiod", /*  this seems unnecessary */
    "value": "3 hours", /* initial default value  */
    "values": ["3 hours", "1 day", "3 days"],
    "loanRule" : "3 hours"
  },
  targetUrl : "https://watzek.lclark.edu/src/prod/reservesRequestTesting.php" /* URL to send data to, for emailing, etc.*/
});
/*
$scope.prop = {
  "type": "select",
  "name": "loanperiod",
  "value": "3 hours",
  "values": ["3 hours", "1 day", "3 days"],

};
$scope.loanRule = "3 hours";
*/

})();
