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

    function MenuController() {
        var vm = this;

        vm.pages = ['Reports', 'Students', 'Manage', 'Service Check In', 'Civic Activities', 'Overview', 'Civic Log'];

    }

})();