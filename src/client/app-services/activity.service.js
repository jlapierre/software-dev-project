(function () {
    'use strict';

    angular
        .module('app')
        .factory('ActivityService', ActivityService);

    function ActivityService() {
        // Activity Examples
        var activity1 = {
            type: 'Partner',
            partnerId: 1,
            locationId: 1,
            contactId: 1,
            startTime: 1510833600,
            endTime: 1510837200,
            manual: false
        };
        var activity2 = {
            type: 'Partner',
            partnerId: 2,
            locationId: 3,
            startTime: 1510837200,
            manual: false
        };
        var activity3 = {
            type: 'Partner',
            partnerId: 3,
            contactId: 2,
            locationId: 2,
            startTime: 1510833600,
            endTime: 1510840800,
            manual: true,
            comment: 'Assisted with organization of an event'
        };

        // Current User Activity Examples
        var currentUserActivities = {1: activity1, 2: activity2, 3: activity3, 4: {}};

        // Current User Activity
        function currentUserActivity(userId) {
            return currentUserActivities[userId];
        }

        // Check User In
        function checkUserIn(userId, partnerId, locationId, contactId) {
            var currentTime = new Date().getTime() / 1000;
            var activity = {
                type: 'Partner',
                partnerId: partnerId,
                locationId: locationId,
                contactId: contactId,
                startTime: currentTime
            };

            return true;
        }

        // Check User Out
        function checkUserOut(userId) {
            return true;
        }

        return {
            currentUserActivity: currentUserActivity,
            checkUserIn: checkUserIn,
            checkUserOut: checkUserOut
        };
    }

})();