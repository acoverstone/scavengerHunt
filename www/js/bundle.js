(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    require('./controllers');
    require('./services');
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  // setup an abstract state for the tabs directive
    .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })

  // Each tab has its own nav history stack:

  .state('tab.home', {
    url: '/home',
    views: {
      'tab-home': {
        templateUrl: 'templates/home.html',
        controller: 'HomeCtrl'
      }
    }
  })

  .state('tab.current', {
      url: '/current',
      views: {
        'tab-current': {
          templateUrl: 'templates/current.html',
          controller: 'CurrentCtrl'
        }
      }
    })

  .state('tab.past', {
    url: '/past',
    views: {
      'tab-past': {
        templateUrl: 'templates/past.html',
        controller: 'PastCtrl'
      }
    }
  })

  .state('tab.create', {
    url: '/home/create',
    views: {
      'tab-home': {
        templateUrl: 'templates/create.html',
        controller: 'HomeCtrl'
      }
    }
  });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/home');

});

},{"./controllers":2,"./services":3}],2:[function(require,module,exports){
// With the new view caching in Ionic, Controllers are only called
// when they are recreated or on app start, instead of every page change.
// To listen for when this page is active (for example, to refresh data),
// listen for the $ionicView.enter event:
//
//$scope.$on('$ionicView.enter', function(e) {
//});

angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, $ionicPopup, Hunts) {

    $scope.locations = [];
    $scope.huntCode = {
        text: ''
    };

    if(Hunts.locations.length == 0) {
        Hunts.getData().then(function() {
            $scope.locations = Hunts.locations;
           
            console.log($scope.locations)     
        });
    }

    

    $scope.joinHunt = function() {
        $ionicPopup.alert({
            title: 'Join A Scavenger Hunt',
            subTitle: 'Enter the code for an already created hunt:',
            template: '<input type="text" ng-model="huntCode.text">',
            scope: $scope,
            buttons: [
            { 
                text: 'Cancel',
                type: 'button-light'
            },
            { 
                text: 'Join!',
                type: 'button-stable',
                onTap: function(e) {
                    console.log($scope.huntCode.text)
                    // User.deleteFavorite(businessName);
                    $scope.huntCode.text = '';
                    // $state.go($state.current, {}, {reload: true});
                }
            }]
        });
    }

})

.controller('CurrentCtrl', function($scope) {


})


.controller('PastCtrl', function($scope) {



});

},{}],3:[function(require,module,exports){
angular.module('starter.services', [])

.factory('Hunts', function() {

    var o = {
        items: [],
        locations: []
    }

    o.getData = function() {

        return firebase.database().ref('locations').once('value').then(function(snapshot) {
            var max = Object.keys(snapshot.val()).length;
            var count = 0;
            for(var key in snapshot.val()) {
                if(count == max) break;
                count++;
                o.locations.push(key);
            }

            var length = Object.keys(snapshot.val()).length;
            for(var i = 0; i < length; i++) {
                o.items.push(snapshot.val()[o.locations[i]]);
            }

            console.log(o.items);
        })
    }



    return o;
});

},{}]},{},[1]);
