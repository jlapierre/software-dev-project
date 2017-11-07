'use strict';

describe('HomeController', function() {

  beforeEach(module('app'));

  it('should have a list of four users', inject(function($controller) {
    var vm = $controller('HomeController');

    expect(vm.allUsers.length).toBe(4);
  }));

});