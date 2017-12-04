(function () {
    'use strict';

    angular
        .module('app')
        .factory('ActivityService', ActivityService);

    function ActivityService($http) {

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

        // Current User Activity
        function currentUserActivity(userId) {
            return $http({
                method: 'GET',
                url: '/api/user_activity/' + userId.$oid});
        }

        // Check User In
        function checkUserIn(user, partner, location, contact) {
            return $http({
                method: 'POST',
                url: '/api/check_in',
                data: {
                    user_id: user,
                    partner_id: partner,
                    location: location,
                    contact: contact
                }
            });
        }

        // Check User Out
        function checkUserOut(user) {
            return $http({
                method: 'POST',
                url: '/api/check_out',
                data: {user_id: user}
            });
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