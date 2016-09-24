angular.module('starter.services', [])

.factory('Hunts', function() {

    var o = {
        items: [],
        locations: []
    }

    o.getData = function() {
        console.log('getdata');

        var keyList = [];

        return firebase.database().ref('locations').once('value').then(function(snapshot) {
      
            // o.locations.push(snapshot.val());
            for(var key in snapshot.val()) {
                keyList.push(key);
                o.locations.push(key);
            }

            var length = Object.keys(snapshot.val()).length;
            for(var i = 0; i < length; i++) {
                o.items.push(snapshot.val()[keyList[i]]);
            }

            console.log(o.items);
            console.log(o.locations);
        })
    }



    return o;
});
