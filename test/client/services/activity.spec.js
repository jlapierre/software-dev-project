'use strict';

describe('ActivityService', function() {

  beforeEach(module('app'));

  it('service should contain a function called getActivityTypes', inject(function($injector) {
    var ActivityService = $injector.get('ActivityService');

    expect(ActivityService.getActivityTypes).not.toBe(undefined);
    expect(typeof ActivityService.getActivityTypes).toBe('function');

  }));

  it('getActivityTypes should return the predefined activity types', inject(function($injector) {
    var ActivityService = $injector.get('ActivityService');

    var activityTypes = ActivityService.getActivityTypes();

    expect(activityTypes).toEqual([{name: 'Partner'}, {name: 'Civic'}, {name: 'Alliance'}, {name: 'Civic/Alliance'}]);
  }));

  it('service should contain a function called getCivicCategories', inject(function($injector) {
    var ActivityService = $injector.get('ActivityService');

    expect(ActivityService.getCivicCategories).not.toBe(undefined);
    expect(typeof ActivityService.getCivicCategories).toBe('function');

  }));

  it('getCivicCategories should return the predefined civic categories', inject(function($injector) {
    var ActivityService = $injector.get('ActivityService');

    var civicCategories = ActivityService.getCivicCategories();

    expect(civicCategories).toEqual([{name: 'Voting'}, {name: 'Rally'}, {name: 'Community Meeting'}, {name: 'Other'}]);
  }));


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
    var activity = ActivityService.currentUserActivity(1);

    expect(typeof activity).toBe('object');

  }));

});