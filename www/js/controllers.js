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

    if($scope.locations == []) {
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
