angular.module('starter.controllers', ['ionic'])

.controller('HomeCtrl', function($scope, $ionicPopup, Hunts) {
        
    $scope.locations = [];
    $scope.huntCode = {
        text: ''
    };
    $scope.username = {
        text: ''
    };



    Hunts.getData().then(function() {
        $scope.locations = Hunts.locations;
        $scope.username.text = Hunts.getUsername();
        // console.log($scope.locations);   
        // console.log($scope.username.text);
    });
    

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

    $scope.goto = function(toState, param) {
        $state.go(toState, param)
    };

})

.controller('CurrentCtrl', function($scope, Hunts) {

    $scope.username = {
        text: ''
    };
    $scope.username.text = Hunts.getUsername();
    console.log($scope.username);

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


