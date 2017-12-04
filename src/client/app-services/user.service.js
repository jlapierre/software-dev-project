(function () {
    'use strict';

    angular
        .module('app')
        .factory('UserService', UserService);

    function UserService($http, $window, $q) {
        // Activity Examples
        var activity2 = {
            activity_type: 'Partner',
            partner: 2,
            location: 3,
            start_time: 1510837200000,
            manually_edited: false
        };
        var activity3 = {
            activity_type: 'Partner',
            partner: 3,
            contact: 2,
            location: 2,
            start_time: 1510833600000,
            end_time: 1510840800000,
            manually_edited: true,
            comment: 'Assisted with organization of an event'
        };
        var activity4 = {
            activity_type: 'Civic/Alliance',
            start_time: 1510833600000,
            civic_category: 'Voting',
            manually_edited: true,
            comment: 'Voted in the city mayoral election'
        };


        // User Examples
        var user1 = {
            id: 1,
            first_name: 'Katherine',
            last_name: 'McDonough',
            email: 'mcdonough.kat@husky.neu.edu',
            peer_leaders: [2],
            auth_role: 'Student',
            pronouns: 'she',
            neu_start: 2013,
            aces_start: 2013,
            is_active: true
        };
        var user2 = {
            id: 2,
            first_name: 'Jennifer',
            last_name: 'LaPierre',
            email: 'lapierre.j@husky.neu.edu',
            auth_role: 'Peer Leader',
            pronouns: 'she',
            neu_start: 2014,
            aces_start: 2015,
            is_active: true,
            activities: {2: activity2, 3: activity3, 4: activity4}
        };
        var user3 = {
            id: 3,
            first_name: 'Lawrence',
            last_name: 'Lim',
            email: 'lim.law@husky.neu.edu',
            auth_role: 'Administrator',
            pronouns: 'he',
            neu_start: 2016,
            aces_start: 2016,
            is_active: true
        };
        var user4 = {
            id: 4,
            first_name: 'Jonathon',
            last_name: 'Northcott',
            email: 'northcott.j@husky.neu.edu',
            auth_role: 'Student',
            pronouns: 'he',
            core_partner: 3,
            neu_start: 2013,
            aces_start: 2015,
            is_active: true
        };
        var authRoles = [{name: 'Student'}, {name: 'Peer Leader'}, {name: 'Administrator'}];


        // Returns the potential user Auth Roles
        function getAuthRoles() {
            return authRoles;
        }

        // Current Signed In User
        function getCurrentUser() {
            return $http({
                method: 'GET',
                url: '/api/current_user'});
        }

        // Get all users the current signed in user has access too
        function getUsers() {
            return $http({
                method: 'GET',
                url: '/api/all_users'
            });
        }

        // Saves the current user
        function upsertUser(user) {
            return $http({
                method: 'POST',
                url: '/api/update_user',
                data: {user: user}});
        }

        // Saves the current user
        function deleteUser(user) {
            return $http({
                method: 'POST',
                url: '/api/delete_user/' + user
            });
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