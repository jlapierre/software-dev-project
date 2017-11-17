(function () {
    'use strict';

    angular
        .module('app')
        .directive('acesTypeahead', AcesTypeahead)
        .controller('TypeaheadController', TypeaheadController);

    function AcesTypeahead() {
        return {
            restrict: 'E',
            scope: {
                options: '=',
                selected: '='
            },
            templateUrl: 'app-view/directives/typeahead/typeahead.view.html',
            controller: 'TypeaheadController as vm'
        };
    }

    function TypeaheadController($scope) {
        var vm = this;

        vm.showOptions = false;

        $scope.watch('searchText', function() {
            if ($scope.searchText.length > 0) {
                vm.showOptions = true;
            } else {
                vm.showOptions = false;
            }
        });





    }

})();