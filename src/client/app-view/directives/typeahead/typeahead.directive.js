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
                unSelect: '&',
                onNoOptions: '&',
                disabled: '='
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

        // Update the text displayed when the selection changes
        // or is cleared
        function updateText(selectedItem) {
            if (selectedItem) {
                vm.selectedText = selectedItem.name;
            } else {
                vm.selectedText = '';
            }
        }

        $scope.$watch('selectedItem', updateText);

        function handleSelection(selectedItem) {
            vm.updateText(selectedItem);
            vm.selected = true;
            $scope.onSelect({selectedItem: selectedItem});
        }

        function unSelect() {
            vm.selected = false;
            $scope.unSelect();
        }

        vm.updateText = updateText;
        vm.handleSelection = handleSelection;
        vm.unSelect = unSelect;
        vm.onNoOptions = $scope.onNoOptions;

    }

})();