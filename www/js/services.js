angular.module('starter.services', ['ionic.utils'])

.factory('Hunts', function($localstorage) {

    var o = {
        items: [],
        locations: [], 
        hunts: [],
        playing: ''
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

    o.getHunts = function() {
        o.hunts = [];
        if(o.hunts.length == 0) {
            return firebase.database().ref('hunts').once('value').then(function(snapshot) {

                keyList = [];
                for(var key in snapshot.val()) {
                  keyList.push(key);
                }

                var length = Object.keys(snapshot.val()).length;
                for(var i = 0; i < length; i++) {
                    o.hunts.push(snapshot.val()[keyList[i]]);
                }
            });
        }
        return firebase.database().ref('hunts').once('value').then(function(snapshot) {})
    }

    o.getHuntByID = function(ID) {
        var max = Object.keys(o.hunts).length;
        for(var i = 0; i < max; i++){
            if(o.hunts[i]['id'] == ID){
                return o.hunts[i];
            }
        }
        return 0;
    }





    // Getters and setters to local storage
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

    o.setPlaying = function(playing) {
        $localstorage.setObject('playing', playing);
    }

    o.getPlaying = function() {
        if(Object.keys($localstorage.getObject('playing')).length != 0){
            o.playing = $localstorage.getObject('playing');
            return $localstorage.getObject('playing');
        }
        return '';
    }



    return o;
});
