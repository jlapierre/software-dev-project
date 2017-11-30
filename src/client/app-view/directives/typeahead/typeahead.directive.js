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
                placeholder: '=',
                noOptions: '=',
                options: '=',
                selectedText: '@',
                onSelect: '&',
                unSelect: '&',
                onNoOptions: '&',
                disabled: '=',
                relaxed: '='
            },
            templateUrl: 'app-view/directives/typeahead/typeahead.view.html',
            controller: 'TypeaheadController as vm'
        };
    }

    function TypeaheadController($scope) {
        var vm = this;

        vm.selected = true; // hides list initially

        // Update the text displayed when the selection changes
        // or is cleared
        function updateText(selectedText) {
            if (selectedText) {
                vm.selectedText = selectedText;
            } else {
                vm.selectedText = '';
            }
        }

        // Clear the text if there are 0 options
        function clearText(options) {
            if (!!options && options.length == 0) {
                updateText('');
            }
        }

        $scope.$watch('selectedText', updateText);
        $scope.$watch('options', clearText);

        function handleSelection(selectedItem) {
            vm.updateText(selectedItem.name);
            vm.selected = true;
            $scope.onSelect({selectedItem: selectedItem});
        }

        function unSelect() {
            vm.selected = false;
            $scope.unSelect();
        }

        vm.updateText = updateText;
        vm.clearText = clearText;
        vm.handleSelection = handleSelection;
        vm.unSelect = unSelect;
        vm.onNoOptions = $scope.onNoOptions;

    }

})();