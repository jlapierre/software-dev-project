'use strict';

describe('HeaderController', function() {

  beforeEach(module('app'));

  it('expect toggleMenu to swap hideMenu to true', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var vm = $controller('HeaderController', {$scope: scope});

    expect(scope.hideMenu).toBe(undefined);

    vm.toggleMenu();

    expect(scope.hideMenu).toBe(true);
  }));

  it('expect toggleMenu to swap hideMenu to false', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var vm = $controller('HeaderController', {$scope: scope});

    expect(scope.hideMenu).toBe(undefined);

    vm.toggleMenu();

    expect(scope.hideMenu).toBe(true);

    vm.toggleMenu();

    expect(scope.hideMenu).toBe(false);
  }));
});