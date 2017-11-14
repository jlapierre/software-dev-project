(function () {
    'use strict';

    angular
        .module('app')
        .directive('acesHeader', AcesHeader)
        .controller('HeaderController', HeaderController);

    function AcesHeader() {
        return {
            restrict: 'E',
            scope: {
                hideMenu: '='
            },
            templateUrl: 'app-view/directives/header/header.view.html',
            controller: 'HeaderController as vm'
        }
    }

    function HeaderController($scope) {
        var vm = this;

        vm.toggleMenu = function() {
            $scope.hideMenu = !$scope.hideMenu;
        }
    }

})();