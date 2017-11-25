(function () {
    'use strict';

    angular
        .module('app')
        .directive('acesMenu', AcesMenu)
        .controller('MenuController', MenuController);

    function AcesMenu() {
        return {
            restrict: 'E',
            scope: {
                hideMenu: '='
            },
            templateUrl: 'app-view/directives/menu/menu.view.html',
            controller: 'MenuController as vm'
        }
    }

    function MenuController(UserService) {
        var vm = this;

        function noop() {}

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
            onClick: noop
        };
        var checkIn = {
            name: 'Service Check In',
            onClick: noop
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
            onClick: noop
        };
        var signOut = {
            name: 'Sign Out',
            onClick: UserService.signOutUser
        };

        vm.pages = [reports, students, manage, checkIn, activities, overview, log, signOut];

    }

})();