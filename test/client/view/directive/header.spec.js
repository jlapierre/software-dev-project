'use strict';

describe('HeaderController', function() {

  beforeEach(module('app'));

  it('expect toggleMenu to swap hideMenu to true', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var vm = $controller('HeaderController', {$scope: scope});

    expect(scope.showMenu).toBe(undefined);

    vm.toggleMenu();

    expect(scope.showMenu).toBe(true);
  }));

  it('expect toggleMenu to swap hideMenu to false', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var vm = $controller('HeaderController', {$scope: scope});

    expect(scope.showMenu).toBe(undefined);

    vm.toggleMenu();

    expect(scope.showMenu).toBe(true);

    vm.toggleMenu();

    expect(scope.showMenu).toBe(false);
  }));
});