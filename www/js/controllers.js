angular.module('starter.controllers', ['ionic'])

.controller('HomeCtrl', function($scope, $ionicPopup, $state, Hunts) {
        
    $scope.locations = [];
    $scope.items = [];
    $scope.huntList = [];
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
        Hunts.getPlaying();
        // console.log($scope.locations);   
        // console.log($scope.username.text);
    });

    Hunts.getHunts().then(function() {
        $scope.huntList = Hunts.hunts;
        console.log($scope.huntList);
    })


    
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
                    // Chck ID isn't empty, player isn't playing and ID exists
                    // If so, joing game, set playing and maybe clear code
                    if($scope.huntCode.text != '' && Hunts.getPlaying() == '' && Hunts.getHuntByID($scope.huntCode.text) != 0) {
                        $scope.alertHunt($scope.huntCode.text);

                        // add player
                        $scope.addPlayer($scope.huntCode.text);

                        // set playing and clear code
                        Hunts.playing = $scope.huntCode.text;
                        Hunts.setPlaying($scope.huntCode.text);
                        $scope.huntCode.text = '';

                        // TODO: goto(current hunt)
                        
                    } else {
                        $scope.errorMsg();
                    }
                }
            }]
        });
    }

    // add player to database and local copy
    $scope.addPlayer = function(ID) {
        var player = { name: $scope.username.text, score: 0};

        for(var i = 0; i < $scope.huntList.length; i++) {
            if($scope.huntList[i]['id'] == ID) {
                var currentPlayers = $scope.huntList[i]['people'];
                currentPlayers.push(player);
                
                var updates = {};
                updates['hunts/' + keyList[i] + '/people'] = currentPlayers;
                firebase.database().ref().update(updates);

                $scope.huntList[i]['people'] = currentPlayers;

            }
        }
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
                    // Check ID isn't empty, player isn't playing already and ID doesn't exist
                    // Otherwise, push to database
                    if($scope.huntCode.text != '' && Hunts.getPlaying() == '' && Hunts.getHuntByID($scope.huntCode.text) == 0) {
                        // create hunt
                        $scope.alertHunt($scope.huntCode.text);
                        $scope.createHunt(location, $scope.huntCode.text);

                        // set playing and clear code
                        Hunts.playing = $scope.huntCode.text;
                        Hunts.setPlaying($scope.huntCode.text);
                        $scope.huntCode.text = '';

                        // TODO: goto(current hunt)
                    } else {
                        $scope.errorMsg();
                    }
                }
            }]
        });
    }

    // Creates a hunt object and pushes it to database as well as local copy
    $scope.createHunt = function(location, ID) {
        var locationRef = firebase.database().ref('hunts/');

        var data = {
            id: ID,
            location: location,
            items: $scope.getItems(location),
            people: [{ name: $scope.username.text, score: 0}]
        }

        locationRef.push(data).then(function() {
            $scope.huntList.push(data);
            console.log(data);
        });
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

    $scope.errorMsg = function() {
        $ionicPopup.alert({
            title: 'Oops!',
            template: "<p style='text-align:center;'>Something went wrong. Check your ID and try again.</p>" ,
            buttons: 
            [{ 
                text: 'Okay',
                type: 'button-stable'
            }]
            
        });
    }


    $scope.doRefresh = function() {
        Hunts.getHunts().then(function() {
            $scope.huntList = Hunts.hunts;
            console.log($scope.huntList);
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

})







.controller('CurrentCtrl', function($scope, $state, Hunts) {

    $scope.$on('$ionicView.enter', function() {
        $scope.username = {
            text: ''
        };
        $scope.username.text = Hunts.getUsername();
        $scope.hunt = Hunts.getHuntByID(Hunts.playing);
        $scope.items = $scope.hunt['items'];
    });

    $scope.doRefresh = function() {
        Hunts.getHunts().then(function() {
            $scope.$broadcast('scroll.refreshComplete');
        });
    };

})


.controller('PastCtrl', function($scope, $ionicPopup) {
	$scope.url = {
        text: ''
    };

	$scope.postUrl = function(){
	 $ionicPopup.alert({
            title: 'Enter url',
            template: '<input type="text" ng-model="url.text">',
            scope: $scope,
            buttons: [{ 
                text: 'Enter',
                type: 'button-stable',
                onTap: function(e) {
                    console.log($scope.url.text);
             		
             		Clarifai.getToken().then(
             			handleResponse,
             			handleError
             		);

                    Clarifai.getTagsByUrl($scope.url.text).then(
                    	handleResponse,
                    	handleError
                    );

                    Clarifai.getInfo().then(
                    	handleResponse,
                    	handleError);
                    
                }
            }]
        })
	}

	function handleResponse(response){
		console.log('promise response:', response);
	}

	function handleError(err){
		console.log('promise error:', err);
	}

});


