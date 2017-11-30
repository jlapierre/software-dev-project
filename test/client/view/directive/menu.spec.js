'use strict';

describe('MenuController', function() {

  beforeEach(module('app'));

  it('authRole: Administrator should have four pages', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var authRole = 'Administrator';

    var vm = $controller('MenuController', {$scope: scope});

    vm.setPages(authRole);

    expect(vm.pages.length).toBe(4);
  }));

  it('authRole: Student should have five pages', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var authRole = 'Student';

    var vm = $controller('MenuController', {$scope: scope});

    vm.setPages(authRole);

    expect(vm.pages.length).toBe(5);
  }));

  it('authRole: Peer Leader should have eight pages', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var authRole = 'Peer Leader';

    var vm = $controller('MenuController', {$scope: scope});

    vm.setPages(authRole);

    expect(vm.pages.length).toBe(8);
  }));

  it('if authRole not passed should have five pages', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();

    var vm = $controller('MenuController', {$scope: scope});

    vm.setPages();

    expect(vm.pages.length).toBe(5);
  }));

  it('changeLocation should create a new function', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var location = {path: function(){}};

    var vm = $controller('MenuController', {$scope: scope, $location: location});

    var onClick = vm.changeLocation('/manage');

    expect(typeof onClick).toBe('function');
  }));

  it('changeLocation function passes location to path', inject(function($controller, $rootScope) {
    var scope = $rootScope.$new();
    var newLocation = '';
    var location = {path: function(loc){ newLocation = loc; }};

    var vm = $controller('MenuController', {$scope: scope, $location: location});

    var onClick = vm.changeLocation('/manage');
    onClick();

    expect(newLocation).toBe('/manage');
  }));


});