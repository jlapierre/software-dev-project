'use strict';

var vm, upsertUserCalled;

describe('CivicLogController', function() {

  beforeEach(module('app'));

  beforeEach(inject(function ($controller, $rootScope, $q) {

    function mockGetCurrentUser() {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    }

    function mockGetPartners() {
        var deferred = $q.defer();
        deferred.resolve([]);
        return deferred.promise;
    }

    function mockUpsertUser(user) {
        upsertUserCalled = user;
    }

    function mockGetActivityTypes() {
        return [];
    }

    function mockGetCivicCategories() {
        return [];
    }

    var mockPartnerService = {
        getPartners: mockGetPartners
    }

    var mockUserService = {
        getCurrentUser: mockGetCurrentUser,
        upsertUser: mockUpsertUser
    }

    var mockActivityService = {
        getActivityTypes: mockGetActivityTypes,
        getCivicCategories: mockGetCivicCategories
    }

    var scope = $rootScope.$new();

    vm = $controller('CivicLogController', {PartnerService: mockPartnerService,
                                            UserService: mockUserService,
                                            ActivityService: mockActivityService,
                                            $scope: scope});

    upsertUserCalled = undefined;

  }));

  it('setupActivities does not change anything if there are no activities', inject(function($controller) {
    vm.currentUser = {};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser).toEqual({});

  }));

  it('setupActivities if the activity is a partner sets up the proper description lookups', inject(function($controller) {
    vm.activePartners = [{name: 'partner'}];
    vm.currentUser = {activities: {1: {activity_type: 'Partner'}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].descriptionOptions).toEqual([{name: 'partner'}]);
    expect(vm.currentUser.activities[1].descriptionPlaceholder).toEqual('Community Partner');
    expect(vm.currentUser.activities[1].descriptionNoOptions).toEqual('No community partner matched your search');
    expect(vm.currentUser.activities[1].civic_category).toEqual(undefined);
    expect(vm.currentUser.activities[1].locations).toEqual([]);
    expect(vm.currentUser.activities[1].contacts).toEqual([]);

  }));

  it('setupActivities if the activity is a partner sets up correct locations', inject(function($controller) {
    var locations = {1: {is_active: true}, 2: {is_active: false}};
    vm.partners = [{name: 'partner1', _id: {$oid: 1}}, {name: 'partner2', _id: {$oid: 2}, locations: locations}];
    vm.currentUser = {activities: {1: {activity_type: 'Partner', partner: 2}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].locations).toEqual([{is_active: true, id: 1}]);

  }));

  it('setupActivities if the activity is a partner sets up correct contacts', inject(function($controller) {
    var contacts = {1: {is_active: true}, 2: {is_active: false}};
    vm.partners = [{name: 'partner1', _id: {$oid: 1}}, {name: 'partner2', _id: {$oid: 2}, contacts: contacts}];
    vm.currentUser = {activities: {1: {activity_type: 'Partner', partner: 2}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].contacts).toEqual([{is_active: true, id: 1}]);

  }));

  it('setupActivities if the activity is not a partner sets up the proper description lookups', inject(function($controller) {
    vm.civicCategories = ['category1', 'category2'];
    vm.currentUser = {activities: {1: {activity_type: 'Civic'}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].descriptionOptions).toEqual(['category1', 'category2']);
    expect(vm.currentUser.activities[1].descriptionPlaceholder).toEqual('Civic Category');
    expect(vm.currentUser.activities[1].descriptionNoOptions).toEqual('No civic category matched your search');
    expect(vm.currentUser.activities[1].partner).toEqual(undefined);
    expect(vm.currentUser.activities[1].location).toEqual(undefined);
    expect(vm.currentUser.activities[1].contact).toEqual(undefined);

  }));

  it('setupActivities with a start time will add a start date will not add end date if partner', inject(function($controller) {
    vm.currentUser = {activities: {1: {activity_type: 'Partner', start_time: {$date: 1510837200000}}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].startDate).not.toBe(undefined);
    expect(vm.currentUser.activities[1].endDate).toBe(undefined);

  }));

  it('setupActivities with a start time will add a start date and end date if type not partner', inject(function($controller) {
    vm.currentUser = {activities: {1: {activity_type: 'Civic', start_time: {$date: 1510837200000}}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].startDate).not.toBe(undefined);
    expect(vm.currentUser.activities[1].endDate).not.toBe(undefined);

  }));

  it('setupActivities with a end time will add a end date if type partner', inject(function($controller) {
    vm.currentUser = {activities: {1: {activity_type: 'Partner', end_time: {$date: 1510837200000}}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].endDate).not.toBe(undefined);

  }));

  it('setupActivities with a end time will not add a end date if type not partner', inject(function($controller) {
    vm.currentUser = {activities: {1: {activity_type: 'Civic', end_time: {$date: 1510837200000}}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].endDate).toBe(undefined);

  }));

  it('getDescription name will give empty string if type partner but no id', inject(function($controller) {
    vm.partners = [{name: 'partner1', _id: {$oid: 1}}, {name: 'partner2', _id: {$oid: 2}}];

    var name = vm.getDescriptionName({activity_type: 'Partner'});

    expect(name).toBe('');

  }));

  it('getDescription name will give partner name if type partner', inject(function($controller) {
    vm.partners = [{name: 'partner1', _id: {$oid: 1}}, {name: 'partner2', _id: {$oid: 2}}];

    var name = vm.getDescriptionName({activity_type: 'Partner', partner: 2});

    expect(name).toBe('partner2');

  }));


  it('getDescription name will give civic category if type not partner', inject(function($controller) {

    var name = vm.getDescriptionName({activity_type: 'Civic', civic_category: 'Voting'});

    expect(name).toBe('Voting');

  }));

  it('location name will return empty string if location does not exist', inject(function($controller) {
    var locations = {1: {is_active: true}, 2: {is_active: false}};
    vm.partners = [{name: 'partner1', _id: {$oid: 1}}, {name: 'partner2', _id: {$oid: 2}, locations: locations}];

    var name = vm.getLocationName({activity_type: 'Partner', partner: 2, location: 3});

    expect(name).toBe('');

  }));

  it('location name will return location name', inject(function($controller) {
    var locations = {1: {is_active: true}, 2: {is_active: false, name: 'location2'}};
    vm.partners = [{name: 'partner1', _id: {$oid: 1}}, {name: 'partner2', _id: {$oid: 2}, locations: locations}];

    var name = vm.getLocationName({activity_type: 'Partner', partner: 2, location: 2});

    expect(name).toBe('location2');

  }));

  it('contact name will return empty string if contact does not exist', inject(function($controller) {
    var contacts = {1: {is_active: true}, 2: {is_active: false}};
    vm.partners = [{name: 'partner1', _id: {$oid: 1}}, {name: 'partner2', _id: {$oid: 2}, contacts: contacts}];

    var name = vm.getContactName({activity_type: 'Partner', partner: 2, contact: 3});

    expect(name).toBe('');

  }));

  it('contact name will return contact name', inject(function($controller) {
    var contacts = {1: {is_active: true}, 2: {is_active: false, name: 'contact2'}};
    vm.partners = [{name: 'partner1', _id: {$oid: 1}}, {name: 'partner2', _id: {$oid: 2}, contacts: contacts}];

    var name = vm.getContactName({activity_type: 'Partner', partner: 2, contact: 2});

    expect(name).toBe('contact2');

  }));

  it('selectActivityType sets up descriptions options for type Partner', inject(function($controller) {
    var activity = {};
    var selectedItem = {name: 'Partner'};
    vm.activePartners = [{name: 'partner'}];

    vm.selectActivityType(selectedItem, activity)

    expect(activity.descriptionOptions).toEqual([{name: 'partner'}]);
    expect(activity.descriptionPlaceholder).toEqual('Community Partner');
    expect(activity.descriptionNoOptions).toEqual('No community partner matched your search');
    expect(activity.civic_category).toEqual(undefined);

  }));

  it('selectActivityType sets up descriptions options for type not Partner', inject(function($controller) {
    var activity = {};
    var selectedItem = {name: 'Civic'};
    vm.civicCategories = ['category1', 'category2'];

    vm.selectActivityType(selectedItem, activity)

    expect(activity.descriptionOptions).toEqual(['category1', 'category2']);
    expect(activity.descriptionPlaceholder).toEqual('Civic Category');
    expect(activity.descriptionNoOptions).toEqual('No civic category matched your search');
    expect(activity.partner).toEqual(undefined);
    expect(activity.location).toEqual(undefined);
    expect(activity.contact).toEqual(undefined);

  }));

  it('unSelectActivityType sets type and descriptions to defaults', inject(function($controller) {
    var activity = {
        activity_type: 'Civic',
        descriptionOptions: ['category1', 'category2'],
        descriptionPlaceholder: 'Civic Category',
        descriptionNoOptions: 'No civic category matched your search'
    };

    vm.unSelectActivityType(activity)

    expect(activity.activity_type).toBe(undefined);
    expect(activity.descriptionOptions).toEqual([]);
    expect(activity.descriptionPlaceholder).toEqual('Partner/Activity');
    expect(activity.descriptionNoOptions).toEqual('No activity type selected');

  }));

  it('selectDescription choosing a partner will set up the partner elements', inject(function($controller) {
    var activity = { activity_type: 'Partner' };
    var selectedItem = {
        _id: {$oid: 1},
        locations: {1: {is_active: true}, 2: {is_active: false}},
        contacts: {3: {is_active: false}, 4: {is_active: true}}
    }

    vm.selectDescription(selectedItem, activity);

    expect(activity.partner).toEqual(1);
    expect(activity.locations).toEqual([{id: 1, is_active: true}]);
    expect(activity.contacts).toEqual([{id: 4, is_active: true}]);

  }));

  it('selectDescription choosing a activity sets the activity', inject(function($controller) {
    var activity = { activity_type: 'Civic' };
    var selectedItem = { name: 'Voting' };

    vm.selectDescription(selectedItem, activity);

    expect(activity.civic_category).toBe('Voting');

  }));

  it('unSelectDescription undefine all partner elements for partner type', inject(function($controller) {
    var activity = {
        activity_type: 'Partner',
        partner: 1,
        location: 2,
        contact: 3,
        locations: [{is_active: true}],
        contacts: [{is_active: true}]
    };

    vm.unSelectDescription(activity);

    expect(activity.partner).toBe(undefined);
    expect(activity.location).toBe(undefined);
    expect(activity.contact).toBe(undefined);
    expect(activity.locations).toEqual([]);
    expect(activity.contacts).toEqual([]);

  }));

  it('unSelectDescription undefine civic category for not partner type', inject(function($controller) {
    var activity = { civic_category: 'Voting' };

    vm.unSelectDescription(activity);

    expect(activity.civic_category).toBe(undefined);

  }));

  it('selectLocation sets location id', inject(function($controller) {
    var selectedItem = {id: 1};
    var activity = {};

    vm.selectLocation(selectedItem, activity);

    expect(activity.location).toBe(1);

  }));

  it('unSelectLocation unsets location id', inject(function($controller) {
    var activity = {location: 1};

    vm.unSelectLocation(activity);

    expect(activity.location).toBe(undefined);

  }));

  it('selectContact sets contact id', inject(function($controller) {
    var selectedItem = {id: 1};
    var activity = {};

    vm.selectContact(selectedItem, activity);

    expect(activity.contact).toBe(1);

  }));

  it('unSelectContact unsets contact id', inject(function($controller) {
    var activity = {contact: 1};

    vm.unSelectContact(activity);

    expect(activity.contact).toBe(undefined);

  }));

  it('updateEndDate does not update end Date if type partner', inject(function($controller) {
    var startDate = new Date(0);
    var endDate = new Date(1);
    var activity = {startDate: startDate, endDate: endDate, activity_type: 'Partner'};

    vm.updateEndDate(activity);

    expect(activity.endDate).toBe(endDate);

  }));

  it('updateEndDate only updates the endDate if type not partner', inject(function($controller) {
    var startDate = new Date(0);
    var endDate = new Date(1);
    var activity = {startDate: startDate, endDate: endDate, activity_type: 'Civic'};

    vm.updateEndDate(activity);

    expect(activity.endDate).toBe(startDate);

  }));

  it('deleteActivity removes the activity with the given id', inject(function($controller) {
    vm.currentUser = {activities: {1: {}, 2: {}, 3: {}}};

    vm.deleteActivity(2);

    expect(vm.currentUser.activities).toEqual({1: {}, 3: {}});

  }));

  it('addActivity adds a new activity with the next id', inject(function($controller) {
    vm.currentUser = {activities: {1: {}, 2: {}, 3: {}}};

    vm.addActivity();

    expect(vm.currentUser.activities).toEqual({1: {}, 2: {}, 3: {}, 4: {}});

  }));

  it('saveActivities will save all of the activity changes by calling upsertUser', inject(function($controller) {
    vm.currentUser = {activities: {1: {}, 2: {}, 3: {}}};

    vm.saveActivities();

    expect(upsertUserCalled).toEqual(vm.currentUser);

  }));

  it('getActivePartners places only active partners on the active partner list', inject(function($controller) {
    vm.partners = [partner1, partner2, partner3, partner4];
    vm.getActivePartners();

    expect(vm.activePartners.length).toBe(3);
    expect(vm.activePartners[0]).toBe(partner1);
    expect(vm.activePartners[1]).toBe(partner2);
    expect(vm.activePartners[2]).toBe(partner3);

  }));


});