angular.module('starter.controllers', ['ionic'])

.controller('HomeCtrl', function($scope, $ionicPopup, $state, Hunts) {
        
    $scope.locations = [];
    $scope.items = [];
    $scope.huntCode = {
        text: ''
    };
    $scope.username = {
        text: ''
    };


    // Gets data from the service
    Hunts.getData().then(function() {
        $scope.locations = Hunts.locations;
        $scope.items = Hunts.items;
        $scope.username.text = Hunts.getUsername();
        // console.log($scope.locations);   
        // console.log($scope.username.text);
    });
    
    // Checks inital run of app
    if(Hunts.isInitialRun()) {
        Hunts.setInitialRun('false');
        $ionicPopup.alert({
            title: 'Welcome To Scavenger Hunt!',
            template: "<p style='text-align:center'>This app creates automated scavenger hunts for your favorite locations that you can play by yourself or with friends! Just start a hunt or join a friend's, then take pictures of items and watch them get checked off your list! Enter a username below: <p> <br> <input type='text' ng-model='username.text'>",
            scope: $scope,
            buttons: [{ 
                text: 'Lets Get Started!',
                type: 'button-stable',
                onTap: function(e) {
                    console.log($scope.username.text)
                    Hunts.setUsername($scope.username.text);
                }
            }]
        });
    }

    
    // function to join hunt, calls create hunt
    // TODO **********************************************************
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
                    // TODO: add check to make sure ID exists
                    if($scope.huntCode.text != '') {
                        $scope.alertHunt($scope.huntCode.text);
                        Hunts.playing = true;
                        $scope.huntCode.text = '';
                        
                    }
                }
            }]
        });
    }

    // function to pick location, calls create hunt
    // TODO **********************************************************
    $scope.pickLocation = function(location) {
        $ionicPopup.alert({
            title: 'Start A Scavenger Hunt',
            subTitle: 'Make up a unique code for a hunt and invite your friends:',
            template: '<input type="text" ng-model="huntCode.text">',
            scope: $scope,
            buttons: [
            { 
                text: 'Cancel',
                type: 'button-light'
            },
            { 
                text: 'Create!',
                type: 'button-stable',
                onTap: function(e) {
                    // TODO: add check to make sure ID isn't taken and not in game
                    if($scope.huntCode.text != '') {
                        $scope.alertHunt($scope.huntCode.text);
                        $scope.createHunt(location, $scope.huntCode.text);
                        Hunts.playing = true;
                        $scope.huntCode.text = '';
                    }
                }
            }]
        });
    }

    // Creates a hunt object and pushes it to database
    $scope.createHunt = function(location, ID) {
        var locationRef = firebase.database().ref('hunts/');

        var data = {
            id: ID,
            location: location,
            items: $scope.getItems(location)
        }

        console.log(data)
    }

    // helper function to get 10 random items
    $scope.getItems = function(location) {
        var array = [];
        var uniqueItems = new Set();

        var i = 0;
        // get location index
        for(i = 0; i < $scope.locations.length; i++) {
            if($scope.locations[i] == location) {
                break;
            }
        }

        // fill up set with 10 unique objects
        var locationObj = $scope.items[i];
        var max = Object.keys(locationObj).length;
        

        while(uniqueItems.size < 10){
            var number = Math.floor((Math.random() * max) + 1);
            uniqueItems.add(locationObj['item' + number]);
        }
        
        // put set into an array
        uniqueItems.forEach(function(value) {
            array.push(value);
        })

        return array;

    }

    // change state
    $scope.goto = function(toState, param) {
        $state.go(toState, param)
    };

    // function to alert when hunt successfully joined/created
    $scope.alertHunt = function(code) {
        $ionicPopup.alert({
            title: 'Hunt Started!',
            template: "<p style='text-align:center;'>Go check out your hunt in the Current Hunt tab! Invite your friends to hunt: '" + code + "'.</p>" ,
            buttons: 
            [{ 
                text: 'Okay!',
                type: 'button-stable'
            }]
            
        });
    }

})

.controller('CurrentCtrl', function($scope, Hunts) {

    $scope.username = {
        text: ''
    };
    $scope.username.text = Hunts.getUsername();
    console.log($scope.username);

})


.controller('PastCtrl', function($scope) {



});
