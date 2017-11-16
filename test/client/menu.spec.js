'use strict';

describe('MenuController', function() {

  beforeEach(module('app'));

  it('should have a list of seven pages', inject(function($controller) {
    var vm = $controller('MenuController');

    expect(vm.pages.length).toBe(7);
  }));

});