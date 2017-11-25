(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    function UserService($http, $window) {
        // Sign Out User
        function signOutUser() {
            return $http({
                method: 'GET',
                url: '/api/google_logout'})
            .then(function success(message) {
                    $window.location.href = 'http://127.0.0.1:5000/index.html';
                }, function error(message) {
                    return message.status;
                });
        }

        return {
            signOutUser: signOutUser
        };
    }

})();