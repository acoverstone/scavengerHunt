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
