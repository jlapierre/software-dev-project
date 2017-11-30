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
            peerLeaders: [2],
            authRole: 'Student',
            pronouns: 'she',
            uStartYear: 2013,
            aStartYear: 2013,
            active: true
        };
        var user2 = {
            id: 2,
            firstName: 'Jennifer',
            lastName: 'LaPierre',
            email: 'lapierre.j@husky.neu.edu',
            authRole: 'Peer Leader',
            pronouns: 'she',
            uStartYear: 2014,
            aStartYear: 2015,
            active: true
        };
        var user3 = {
            id: 3,
            firstName: 'Lawrence',
            lastName: 'Lim',
            email: 'lim.law@husky.neu.edu',
            authRole: 'Administrator',
            pronouns: 'he',
            uStartYear: 2016,
            aStartYear: 2016,
            active: true
        };
        var user4 = {
            id: 4,
            firstName: 'Jonathon',
            lastName: 'Northcott',
            email: 'northcott.j@husky.neu.edu',
            authRole: 'Student',
            pronouns: 'he',
            corePartnerId: 3,
            uStartYear: 2013,
            aStartYear: 2015,
            active: true
        };
        var authRoles = [{name: 'Student'}, {name: 'Peer Leader'}, {name: 'Administrator'}];


        // Returns the potential user Auth Roles
        function getAuthRoles() {
            return authRoles;
        }

        // Current Signed In User
        function getCurrentUser() {
            return user2;
        }

        // Get all users the current signed in user has access too
        function getUsers() {
            return [user1, user2, user3, user4];
        }

        // Saves the current user
        function upsertUser(user) {
            return true;
        }

        // Saves the current user
        function deleteUser(user) {
            return true;
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
            getAuthRoles: getAuthRoles,
            getCurrentUser: getCurrentUser,
            getUsers: getUsers,
            upsertUser: upsertUser,
            deleteUser: deleteUser,
            signOutUser: signOutUser,
            uploadStudents: uploadStudents,
            uploadPeerLeaders: uploadPeerLeaders,
            uploadAdministrators: uploadAdministrators
        };
    }

})();