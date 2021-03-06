'use strict';

describe('TypeaheadController', function() {

  beforeEach(module('app'));

  var option1 = {name: "Option 1"};
  var option2 = {name: "Option 2"};
  var option3 = {name: "Option 3"};
  var option4 = {name: "Option 4"};

  it('handleSelection should set the selectedText to the name', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.handleSelection(option1);

    expect(vm.selectedText).toBe("Option 1");
  }));

  it('handleSelection sets selected to true', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.handleSelection(option1);

    expect(vm.selected).toBe(true);
  }));

  it('handleSelection calls the scope onSelect function and passes the item', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var onSelectCalled = false
    var selectedItem = undefined;
    scope.onSelect = function(selected) {
        onSelectCalled = true;
        selectedItem = selected.selectedItem;
    };

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.handleSelection(option1);

    expect(onSelectCalled).toBe(true);
    expect(selectedItem).toBe(option1);
  }));

  it('unSelect sets selected to false', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var unSelectCalled = false
    scope.unSelect = function() {
        unSelectCalled = true;
    };

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.unSelect();

    expect(vm.selected).toBe(false);
  }));

  it('unSelect calls the parent unSelect fuction', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var unSelectCalled = false
    scope.unSelect = function() {
        unSelectCalled = true;
    };

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.unSelect();

    expect(unSelectCalled).toBe(true);
  }));

  it('onNoOptions calls the function from the parent', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var onNoOptionsCalled = false;
    scope.onNoOptions = function() { onNoOptionsCalled = true; };

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.onNoOptions();

    expect(onNoOptionsCalled).toBe(true);
  }));

  it('updateText will change the selected text with the selected item', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var selectedText = 'selected';
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.updateText(selectedText);

    expect(vm.selectedText).toBe('selected');
  }));

  it('updateText will change the selected text if it was undefined', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var selectedText = '';
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.updateText(selectedText);

    expect(vm.selectedText).toBe('');
  }));

  it('clearText will set the text to nothing if no options', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var selectedText = 'selected';
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.updateText(selectedText);
    vm.clearText([]);

    expect(vm.selectedText).toBe('');
  }));

  it('clearText will not change the text if options are not defined', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var selectedText = 'selected';
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.updateText(selectedText);
    vm.clearText(undefined);

    expect(vm.selectedText).toBe('selected');
  }));

  it('clearText will not change the text if options are longer that 0', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var selectedText = 'selected';
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.updateText(selectedText);
    vm.clearText(['option']);

    expect(vm.selectedText).toBe('selected');
  }));

});