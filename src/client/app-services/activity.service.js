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
        var activity4 = {
            type: 'Civic/Alliance',
            startTime: 1510833600,
            civicCategory: 'Voting',
            manual: true,
            comment: 'Voted in the city mayoral election'
        };
        var activityTypes = [{name: 'Partner'}, {name: 'Civic'}, {name: 'Alliance'}, {name: 'Civic/Alliance'}];
        var civicCategories = [{name: 'Voting'}, {name: 'Rally'}, {name: 'Community Meeting'}, {name: 'Other'}];

        // Returns all the activity types
        function getActivityTypes() {
            return activityTypes;
        }

        // Returns all the activity types
        function getCivicCategories() {
            return civicCategories;
        }

        // Current User Activity Examples
        var currentUserActivities = {1: activity1, 2: activity2};

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
            getActivityTypes: getActivityTypes,
            getCivicCategories: getCivicCategories,
            currentUserActivity: currentUserActivity,
            checkUserIn: checkUserIn,
            checkUserOut: checkUserOut
        };
    }

})();