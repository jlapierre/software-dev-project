'use strict';

describe('ActivityService', function() {

  beforeEach(module('app'));


  it('service should contain a function called currentUserActivity', inject(function($injector) {
    var ActivityService = $injector.get('ActivityService');

    expect(ActivityService.currentUserActivity).not.toBe(undefined);
    expect(typeof ActivityService.currentUserActivity).toBe('function');

  }));

  it('service should contain a function called checkUserIn', inject(function($injector) {
    var ActivityService = $injector.get('ActivityService');

    expect(ActivityService.checkUserIn).not.toBe(undefined);
    expect(typeof ActivityService.checkUserIn).toBe('function');

  }));

  it('service should contain a function called checkUserOut', inject(function($injector) {
    var ActivityService = $injector.get('ActivityService');

    expect(ActivityService.checkUserOut).not.toBe(undefined);
    expect(typeof ActivityService.checkUserOut).toBe('function');

  }));

  it('currentUserActivity should return an activity object', inject(function($injector) {
    var ActivityService = $injector.get('ActivityService');
    var activity = ActivityService.currentUserActivity();

    expect(typeof activity).toBe('object');

  }));

});