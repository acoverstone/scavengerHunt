angular.module('starter.services', ['ionic.utils'])

.factory('Hunts', function($localstorage) {

    var o = {
        items: [],
        locations: [], 
        playing: false
    }

    o.getData = function() {
        if(o.locations.length == 0) {
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
        return firebase.database().ref('locations').once('value').then(function(snapshot) {})
    }



    o.setInitialRun = function(initial) {
        $localstorage.setObject('initialRun', initial);
    }


    o.isInitialRun = function() {
        if(Object.keys($localstorage.getObject('initialRun')).length != 0){
            return false;
        }
        return true;
    }

    o.setUsername = function(username) {
        $localstorage.setObject('username', username);
    }

    o.getUsername = function() {
        return $localstorage.getObject('username');
    }



    return o;
});
