'use strict';

describe('TypeaheadController', function() {

  beforeEach(module('app'));

  var option1 = {name: "Option 1"};
  var option2 = {name: "Option 2"};
  var option3 = {name: "Option 3"};
  var option4 = {name: "Option 4"};

  it('handleSelection should should the selectedText to the name', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.handleSelection(option1);

    expect(vm.selectedText).toBe("Option 1");
  }));

  it('handleSelection should set the selected item', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.handleSelection(option1);

    expect(scope.selectedItem).toBe(option1);
  }));

  it('handleSelection sets selected to true', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    scope.onSelect = function() {};

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.handleSelection(option1);

    expect(vm.selected).toBe(true);
  }));

  it('handleSelection calls the scope onSelect function', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var onSelectCalled = false
    scope.onSelect = function() { onSelectCalled = true; };

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.handleSelection(option1);

    expect(onSelectCalled).toBe(true);
  }));

  it('unSelect sets selected to false', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.unSelect();

    expect(vm.selected).toBe(false);
  }));

  it('unSelect undefines the selectedItem', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.unSelect();

    expect(scope.selectedItem).toBe(undefined);
  }));

  it('unSelect undefines the selectedItem', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var onNoOptionsCalled = false;
    scope.onNoOptions = function() { onNoOptionsCalled = true; };

    var vm = $controller('TypeaheadController', {$scope: scope});

    vm.onNoOptions();

    expect(onNoOptionsCalled).toBe(true);
  }));
});