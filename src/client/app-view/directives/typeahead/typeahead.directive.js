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
                placeholder: '@',
                noOptions: '@',
                options: '=',
                selectedItem: '=',
                onSelect: '&',
                onNoOptions: '&'
            },
            templateUrl: 'app-view/directives/typeahead/typeahead.view.html',
            controller: 'TypeaheadController as vm'
        };
    }

    function TypeaheadController($scope) {
        var vm = this;

        vm.placeholder = $scope.placeholder;
        vm.noOptions = $scope.noOptions;

        vm.selected = true; // hides list initially
        vm.selectedText = '';

        function handleSelection(selectedItem) {
            vm.selectedText = selectedItem.name;
            $scope.selectedItem = selectedItem;

            vm.selected = true;
            $scope.onSelect();
        }

        function unSelect() {
            vm.selected = false;
            $scope.selectedItem = undefined;
        }

        vm.handleSelection = handleSelection;
        vm.unSelect = unSelect;
        vm.onNoOptions = $scope.onNoOptions;

    }

})();