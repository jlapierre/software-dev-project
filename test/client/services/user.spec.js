'use strict';

describe('UserService', function() {

  beforeEach(module('app'));


  it('service should contain a function called signOutUser', inject(function($injector) {
    var UserService = $injector.get('UserService');

    expect(UserService.signOutUser).not.toBe(undefined);
    expect(typeof UserService.signOutUser).toBe('function');

  }));

  it('service should contain a function called getCurrentUser', inject(function($injector) {
    var UserService = $injector.get('UserService');

    expect(UserService.getCurrentUser).not.toBe(undefined);
    expect(typeof UserService.getCurrentUser).toBe('function');

  }));

  it('getCurrentUser should return a user object', inject(function($injector) {
    var UserService = $injector.get('UserService');
    var user = UserService.getCurrentUser();

    expect(typeof user).toBe('object');
  }));

});