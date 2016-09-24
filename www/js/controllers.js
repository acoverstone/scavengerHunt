// With the new view caching in Ionic, Controllers are only called
// when they are recreated or on app start, instead of every page change.
// To listen for when this page is active (for example, to refresh data),
// listen for the $ionicView.enter event:
//
//$scope.$on('$ionicView.enter', function(e) {
//});

angular.module('starter.controllers', [])

.controller('HomeCtrl', function($scope, Hunts) {

    $scope.locations = [];

    Hunts.getData().then(function() {
        $scope.locations = Hunts.locations;
        Hunts.locations.forEach(function(location) {
            $scope.locations.push(location);
        })
           
    });

})

.controller('CurrentCtrl', function($scope, Chats) {


})


.controller('PastCtrl', function($scope) {



});
