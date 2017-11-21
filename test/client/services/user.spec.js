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

  it('service should contain a function called uploadStudents', inject(function($injector) {
    var UserService = $injector.get('UserService');

    expect(UserService.uploadStudents).not.toBe(undefined);
    expect(typeof UserService.uploadStudents).toBe('function');

  }));

  it('uploadStudents should return a promise object', inject(function($injector) {
    var UserService = $injector.get('UserService');
    var promise = UserService.uploadStudents();

    expect(typeof promise).toBe('object');
  }));

  it('service should contain a function called uploadPeerLeaders', inject(function($injector) {
    var UserService = $injector.get('UserService');

    expect(UserService.uploadPeerLeaders).not.toBe(undefined);
    expect(typeof UserService.uploadPeerLeaders).toBe('function');

  }));

  it('uploadPeerLeaders should return a promise object', inject(function($injector) {
    var UserService = $injector.get('UserService');
    var promise = UserService.uploadPeerLeaders();

    expect(typeof promise).toBe('object');
  }));

  it('service should contain a function called uploadAdministrators', inject(function($injector) {
    var UserService = $injector.get('UserService');

    expect(UserService.uploadAdministrators).not.toBe(undefined);
    expect(typeof UserService.uploadAdministrators).toBe('function');

  }));

  it('uploadAdministrators should return a promise object', inject(function($injector) {
    var UserService = $injector.get('UserService');
    var promise = UserService.uploadAdministrators();

    expect(typeof promise).toBe('object');
  }));

});