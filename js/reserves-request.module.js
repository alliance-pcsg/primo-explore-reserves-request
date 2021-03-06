angular.module('reservesRequest', []).component('prmLoginAlmaMashupAfter', {
  bindings: { parentCtrl: '<' },
  controller: function controller($scope, $http, $element, dataService, $mdDialog, reserveRequestOptions) {
    console.log($scope);

    var formatDenyList = reserveRequestOptions.formatDenyList;
    $scope.instCode=reserveRequestOptions.instCode;
    $scope.primoDomain=reserveRequestOptions.primoDomain;
    $scope.primoVid=reserveRequestOptions.primoVid;
    $scope.primoScope=reserveRequestOptions.primoScope;
    $scope.successMessage=reserveRequestOptions.successMessage;
    $scope.failureMessage=reserveRequestOptions.failureMessage;

    this.$onInit = function () {

      var cdiCheck=dataService.isCdi($scope);
      $scope.cdiCheck=cdiCheck;

      //determines section
      var scrollId=dataService.getScrollId($scope);
      console.log(scrollId);

      // determines delivery category
      var deliveryCategory=dataService.getDeliveryCategory($scope);
      console.log(deliveryCategory);

      //hopefully this is effective- displays in 'view it' for print, 'get it' for electronic
      if(deliveryCategory=="Alma-P"){var scrollIdMatch="getit_link1_0";}
      else{var scrollIdMatch="getit_link2";}

      $scope.displayRequestLink = false;
      $scope.required = true;
      $scope.format = dataService.getFormat($scope);

      var formatCheck = formatDenyList.indexOf($scope.format);
      if (formatCheck >= 0) {
        var okFormat = false;
      } else {
        var okFormat = true;
      }

      var userGroup = dataService.getUserGroup($scope);
      if($scope.cdiCheck==false){var valid = dataService.doesLibraryOwn($scope);}
      var userGroupAllowedlist=reserveRequestOptions.userGroupAllowedlist;
      var userCheck = userGroupAllowedlist.indexOf(userGroup);

      if ((userCheck >= 0 && valid == true && okFormat == true && scrollId==scrollIdMatch) || (userCheck>=0 && $scope.cdiCheck==true && okFormat==true && scrollId==scrollIdMatch)) {

        $scope.displayRequestLink = true;
        $scope.instructor = dataService.getInstructor($scope);
        $scope.delCat = dataService.getDeliveryCategory($scope);
        $scope.prop=reserveRequestOptions.selectProps;
        $scope.loanRule=reserveRequestOptions.selectProps.loanRule;

      }

    };
    $scope.showSelectValue = function (mySelect) {
      console.log(mySelect);
      $scope.loanRule = mySelect;
    };

    $scope.checkFormVals = function() {
      if (sessionStorage.course && sessionStorage.course !="undefined"){$scope.course = sessionStorage.course;};
      if (sessionStorage.courseTitle && sessionStorage.courseTitle !="undefined"){$scope.courseTitle = sessionStorage.courseTitle;};

    }

    $scope.submitRequest = function () {
      sessionStorage.course=$scope.course;
      sessionStorage.courseTitle=$scope.courseTitle;
      //console.log("request");
      $scope.title = dataService.getTitle($scope);
      $scope.author = dataService.getAuthor($scope);
      if($scope.cdiCheck==false){$scope.callNumber = dataService.getCallNumber($scope);}
      else{$scope.callNumber="N/A";}
      if($scope.cdiCheck==false){$scope.location = dataService.getLocation($scope);}
      else{$scope.location="N/A";}
      $scope.url = dataService.getUrl($scope);
      if($scope.cdiCheck==false){$scope.availability = dataService.getAvailability($scope);}
      else{$scope.availability="Electronic record";}

      //console.log($scope);
      //console.log($element);
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
        $element.find('md-card').html($scope.successMessage);
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {

        $element.find('md-card').html($scope.failureMessage);
      });
    };
  },
  template: '<div ng-init="checkFormVals()" ng-click="isReplyFormOpen = !isReplyFormOpen" ng-show=\'{{displayRequestLink}}\' style=\'margin-bottom:10px;\'>\n    <span style=\'color: #883300;font-weight: bold;font-size: 100%;font-size:15px;margin-left: 10px;margin-right:15px;\'>COURSE RESERVES: </span>\n    <a     style=\'font-weight: bold;\n    font-size: 100%;\n    color: #1c62a8;\n    padding: 5px 7px;\n    -moz-border-radius: 1em;\n    border-radius: 1em;\n    line-height: 1.3em;\n    background: #f5f5f5;\n    border: solid 1px #ddd;\n    height: 30px;\n    margin-left: 5px;\n    margin-right: 5px;\'\'>Place on Reserve</a></div>\n\n     <md-card style=\'background-color:#e6e6e6;margin-bottom:50px;\' ng-init="isReplyFormOpen = false" ng-show="isReplyFormOpen" id="replyForm">\n        <md-card-title>\n          <md-card-title-text>\n            <span class="md-headline">Place item on reserve</span>\n          </md-card-title-text>\n        </md-card-title>\n\n        <md-content md-theme="docs-dark" layout-gt-sm="row">\n\t\t\t<div layout="column" layout-padding>\n\t\t\t\t<div flex>Course: <input type=\'text\' ng-model=\'course\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. ART 101\' ng-value="course" required> </div>\n\t\t\t\t<div flex>Course Title: <input type=\'text\' ng-model=\'courseTitle\' style=\'border-bottom: 1px solid gray\' size=\'50\' placeholder=\'e.g. Intro to Art\' required></div>\n\t\t\t\t<div flex>Loan Period:  <span >\n\t\t\t\t  <select ng-model="prop.value" ng-change="showSelectValue(prop.value)" ng-options="v for v in prop.values">\n\t\t\t\t  </select>\n\t\t\t\t</span>\n\t\t\t\t</div>\n        <div flex>Comments: <textarea ng-model=\'comments\'></textarea></div>\n\t\t\t</div>\n\n         </md-content>\n        <md-card-actions layout="row" layout-align="left center">\n          <md-button ng-click=\'submitRequest(mySelect)\' class="rreq md-raised">Place item on reserve</md-button>\n\n        </md-card-actions>\n      </md-card>'
}).factory('dataService', ['$http', function ($http) {
  return {
    getMMSid: function getMMSid($scope) {
      var mms = $scope.$parent.$parent.$parent.$ctrl.item.pnx.display.lds04;
      //console.log("MMSID: "+mms);
      for (var i = 0; i < mms.length; i++) {
        //console.log(mms[i]);
        var pieces = mms[i].split("$$I");
        if (pieces[1] == $scope.instCode) {
          var mmsid = pieces[0];
          $scope.mmsid = mmsid;
        }
      }
      return mmsid;
    },
    isCdi: function isCdi($scope){

      var pnx= $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx;
      var recordid=pnx.control.recordid[0];
      var pieces = recordid.split("_");
      var verdict=pieces.includes("cdi");
      return verdict;

    },
    getScrollId: function getScrollId($scope){
      var scrollId=$scope.$parent.$parent.$parent.$ctrl.service.scrollId;
      return scrollId;
    },
    getDeliveryCategory: function getDeliveryCategory($scope){
      var deliveryCategory=$scope.$parent.$parent.$parent.$parent.$ctrl.item.delivery.deliveryCategory[0];
      console.log($scope.$parent.$parent.$parent.$parent.$ctrl.item);
      return deliveryCategory;

    },
    doesLibraryOwn: function doesLibraryOwn($scope) {

      var insts = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.delivery.institution;
      var check = insts.indexOf($scope.instCode);
      console.log(check);
      var second = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.browse.institution;
      var check2 = second.indexOf($scope.instCode);
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
          console.log("parts:")
          console.log(parts);
          var partCheck="I"+$scope.instCode;
          if (parts[1] == partCheck) {
            var callNumber = parts[2].substring(1);
            console.log("exception");
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

      if($scope.cdiCheck==false){var context="L";}
      else{var context="PC";}


      var docid = $scope.$parent.$parent.$parent.$parent.$ctrl.item.pnx.control.recordid[0];
      var url = "http://"+ $scope.primoDomain+"/primo-explore/fulldisplay?docid=" + docid + "&context="+context+"&vid="+$scope.primoVid+"&search_scope="+$scope.primoScope+"&tab=default_tab&lang=en_US";
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
      var userGroup = jwtData.userGroup;
      return userGroup;
    }
  };
}]);
