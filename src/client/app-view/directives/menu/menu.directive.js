(function () {
    'use strict';

    angular
        .module('app')
        .directive('acesMenu', AcesMenu)
        .controller('MenuController', MenuController);

    function AcesMenu() {
        return {
            restrict: 'E',
            templateUrl: 'app-view/directives/menu/menu.view.html',
            controller: 'MenuController as vm',
            scope: {
                authRole: '=',
                pageName: '@'
            }
        }
    }

    function MenuController(UserService, $scope, $location) {
        var vm = this;

        // Set the pages to the pages appropriate for the user
        function setPages(auth_role) {
            if (auth_role === 'Administrator') {
                vm.pages = [reports, students, manage, signOut];
            } else if (auth_role === 'Peer Leader') {
                vm.pages = [checkIn, activities, overview, log, reports, students, manage, signOut];
            } else {
                vm.pages = [checkIn, activities, overview, log, signOut];
            }
        }

        vm.setPages = setPages;

        function noop() {};

        // Function for the action on clicking a selection on the menu
        function changeLocation(path) {
            return function() {
                $location.path(path);
            };
        }

        vm.changeLocation = changeLocation;

        // Pages
        var reports = {
            name: 'Reports',
            onClick: noop
        };
        var students = {
            name: 'Students',
            onClick: noop
        };
        var manage = {
            name: 'Manage',
            onClick: vm.changeLocation('/manage')
        };
        var checkIn = {
            name: 'Service Check In',
            onClick: vm.changeLocation('/checkInOut')
        };
        var activities = {
            name: 'Civic Activities',
            onClick: noop
        };
        var overview = {
            name: 'Overview',
            onClick: noop
        };
        var log = {
            name: 'Civic Log',
            onClick: vm.changeLocation('/civicLog')
        };
        var signOut = {
            name: 'Sign Out',
            onClick: UserService.signOutUser
        };

        $scope.$watch('authRole', vm.setPages);
    }

})();