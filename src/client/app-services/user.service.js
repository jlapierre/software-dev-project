(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    function UserService($http, $window, $q) {
        // User Examples
        var user1 = {
            id: 1,
            firstName: 'Katherine',
            lastName: 'McDonough',
            email: 'mcdonough.kat@husky.neu.edu',
            authRole: 'Student'
        };
        var user2 = {
            id: 2,
            firstName: 'Jennifer',
            lastName: 'LaPierre',
            email: 'lapierre.j@husky.neu.edu',
            authRole: 'Peer Leader'
        };
        var user3 = {
            id: 3,
            firstName: 'Lawrence',
            lastName: 'Lim',
            email: 'lim.law@husky.neu.edu',
            authRole: 'Administrator'
        };
        var user4 = {
            id: 4,
            firstName: 'Jonathon',
            lastName: 'Northcott',
            email: 'northcott.j@husky.neu.edu',
            authRole: 'Student'
        };

        // Current Signed In User
        function getCurrentUser() {
            return user2;
        }

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

        // Upload a new set of students
        function uploadStudents(file) {
            var fileFormData = new FormData();
            fileFormData.append('file', file);

            return $http({
                method: 'POST',
                url: '/api/upload_from_file',
                data: {file: fileFormData, type: 'Students'}});
        }

        // Upload a new set of peer leaders
        function uploadPeerLeaders(file) {
            var fileFormData = new FormData();
            fileFormData.append('file', file);

            return $http({
                method: 'POST',
                url: '/api/upload_from_file',
                data: {file: fileFormData, type: 'Peer Leaders'}});
        }

        // Upload a new set of administrators
        function uploadAdministrators(file) {
            var fileFormData = new FormData();
            fileFormData.append('file', file);

            return $http({
                method: 'POST',
                url: '/api/upload_from_file',
                data: {file: fileFormData, type: 'Administrators'}});
        }

        return {
            signOutUser: signOutUser,
            getCurrentUser: getCurrentUser,
            uploadStudents: uploadStudents,
            uploadPeerLeaders: uploadPeerLeaders,
            uploadAdministrators: uploadAdministrators
        };
    }

})();