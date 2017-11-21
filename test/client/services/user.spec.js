'use strict';

describe('UserService', function() {

  beforeEach(module('app'));


  it('service should contain a function called signOutUser', inject(function($injector) {
    var UserService = $injector.get('UserService');

    expect(UserService.signOutUser).not.toBe(undefined);
    expect(typeof UserService.signOutUser).toBe('function');

  }));

});