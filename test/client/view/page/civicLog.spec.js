'use strict';

var vm, upsertUserCalled;

describe('CivicLogController', function() {

  beforeEach(module('app'));

  beforeEach(inject(function ($controller, $rootScope) {

    function mockGetCurrentUser() {
        return {};
    }

    function mockGetPartners() {
        return [];
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
    vm.currentUser = {activities: {1: {type: 'Partner'}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].descriptionOptions).toEqual([{name: 'partner'}]);
    expect(vm.currentUser.activities[1].descriptionPlaceholder).toEqual('Community Partner');
    expect(vm.currentUser.activities[1].descriptionNoOptions).toEqual('No community partner matched your search');
    expect(vm.currentUser.activities[1].civicCategory).toEqual(undefined);
    expect(vm.currentUser.activities[1].locations).toEqual([]);
    expect(vm.currentUser.activities[1].contacts).toEqual([]);

  }));

  it('setupActivities if the activity is a partner sets up correct locations', inject(function($controller) {
    var locations = {1: {id: 1, active: true}, 2: {id: 2, active: false}};
    vm.partners = [{name: 'partner1', id: 1}, {name: 'partner2', id: 2, locations: locations}];
    vm.currentUser = {activities: {1: {type: 'Partner', partnerId: 2}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].locations).toEqual([{id: 1, active: true}]);

  }));

  it('setupActivities if the activity is a partner sets up correct contacts', inject(function($controller) {
    var contacts = {1: {id: 1, active: true}, 2: {id: 2, active: false}};
    vm.partners = [{name: 'partner1', id: 1}, {name: 'partner2', id: 2, contacts: contacts}];
    vm.currentUser = {activities: {1: {type: 'Partner', partnerId: 2}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].contacts).toEqual([{id: 1, active: true}]);

  }));

  it('setupActivities if the activity is not a partner sets up the proper description lookups', inject(function($controller) {
    vm.civicCategories = ['category1', 'category2'];
    vm.currentUser = {activities: {1: {type: 'Civic'}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].descriptionOptions).toEqual(['category1', 'category2']);
    expect(vm.currentUser.activities[1].descriptionPlaceholder).toEqual('Civic Category');
    expect(vm.currentUser.activities[1].descriptionNoOptions).toEqual('No civic category matched your search');
    expect(vm.currentUser.activities[1].partnerId).toEqual(undefined);
    expect(vm.currentUser.activities[1].locationId).toEqual(undefined);
    expect(vm.currentUser.activities[1].contactId).toEqual(undefined);

  }));

  it('setupActivities with a start time will add a start date will not add end date if partner', inject(function($controller) {
    vm.currentUser = {activities: {1: {type: 'Partner', startTime: 1510837200000}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].startDate).not.toBe(undefined);
    expect(vm.currentUser.activities[1].endDate).toBe(undefined);

  }));

  it('setupActivities with a start time will add a start date and end date if type not partner', inject(function($controller) {
    vm.currentUser = {activities: {1: {type: 'Civic', startTime: 1510837200000}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].startDate).not.toBe(undefined);
    expect(vm.currentUser.activities[1].endDate).not.toBe(undefined);

  }));

  it('setupActivities with a end time will add a end date if type partner', inject(function($controller) {
    vm.currentUser = {activities: {1: {type: 'Partner', endTime: 1510837200000}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].endDate).not.toBe(undefined);

  }));

  it('setupActivities with a end time will not add a end date if type not partner', inject(function($controller) {
    vm.currentUser = {activities: {1: {type: 'Civic', endTime: 1510837200000}}};

    vm.setupActivities(vm.currentUser);

    expect(vm.currentUser.activities[1].endDate).toBe(undefined);

  }));

  it('getDescription name will give empty string if type partner but no id', inject(function($controller) {
    vm.partners = [{name: 'partner1', id: 1}, {name: 'partner2', id: 2}];

    var name = vm.getDescriptionName({type: 'Partner'});

    expect(name).toBe('');

  }));

  it('getDescription name will give partner name if type partner', inject(function($controller) {
    vm.partners = [{name: 'partner1', id: 1}, {name: 'partner2', id: 2}];

    var name = vm.getDescriptionName({type: 'Partner', partnerId: 2});

    expect(name).toBe('partner2');

  }));


  it('getDescription name will give civic category if type not partner', inject(function($controller) {

    var name = vm.getDescriptionName({type: 'Civic', civicCategory: 'Voting'});

    expect(name).toBe('Voting');

  }));

  it('location name will return empty string if location does not exist', inject(function($controller) {
    var locations = {1: {id: 1, active: true}, 2: {id: 2, active: false}};
    vm.partners = [{name: 'partner1', id: 1}, {name: 'partner2', id: 2, locations: locations}];

    var name = vm.getLocationName({type: 'Partner', partnerId: 2, locationId: 3});

    expect(name).toBe('');

  }));

  it('location name will return location name', inject(function($controller) {
    var locations = {1: {id: 1, active: true}, 2: {id: 2, active: false, name: 'location2'}};
    vm.partners = [{name: 'partner1', id: 1}, {name: 'partner2', id: 2, locations: locations}];

    var name = vm.getLocationName({type: 'Partner', partnerId: 2, locationId: 2});

    expect(name).toBe('location2');

  }));

  it('contact name will return empty string if contact does not exist', inject(function($controller) {
    var contacts = {1: {id: 1, active: true}, 2: {id: 2, active: false}};
    vm.partners = [{name: 'partner1', id: 1}, {name: 'partner2', id: 2, contacts: contacts}];

    var name = vm.getContactName({type: 'Partner', partnerId: 2, contactId: 3});

    expect(name).toBe('');

  }));

  it('contact name will return contact name', inject(function($controller) {
    var contacts = {1: {id: 1, active: true}, 2: {id: 2, active: false, name: 'contact2'}};
    vm.partners = [{name: 'partner1', id: 1}, {name: 'partner2', id: 2, contacts: contacts}];

    var name = vm.getContactName({type: 'Partner', partnerId: 2, contactId: 2});

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
    expect(activity.civicCategory).toEqual(undefined);

  }));

  it('selectActivityType sets up descriptions options for type not Partner', inject(function($controller) {
    var activity = {};
    var selectedItem = {name: 'Civic'};
    vm.civicCategories = ['category1', 'category2'];

    vm.selectActivityType(selectedItem, activity)

    expect(activity.descriptionOptions).toEqual(['category1', 'category2']);
    expect(activity.descriptionPlaceholder).toEqual('Civic Category');
    expect(activity.descriptionNoOptions).toEqual('No civic category matched your search');
    expect(activity.partnerId).toEqual(undefined);
    expect(activity.locationId).toEqual(undefined);
    expect(activity.contactId).toEqual(undefined);

  }));

  it('unSelectActivityType sets type and descriptions to defaults', inject(function($controller) {
    var activity = {
        type: 'Civic',
        descriptionOptions: ['category1', 'category2'],
        descriptionPlaceholder: 'Civic Category',
        descriptionNoOptions: 'No civic category matched your search'
    };

    vm.unSelectActivityType(activity)

    expect(activity.type).toBe(undefined);
    expect(activity.descriptionOptions).toEqual([]);
    expect(activity.descriptionPlaceholder).toEqual('Partner/Activity');
    expect(activity.descriptionNoOptions).toEqual('No activity type selected');

  }));

  it('selectDescription choosing a partner will set up the partner elements', inject(function($controller) {
    var activity = { type: 'Partner' };
    var selectedItem = {
        id: 1,
        locations: {1: {id: 1, active: true}, 2: {id: 2, active: false}},
        contacts: {3: {id: 3, active: false}, 4: {id: 4, active: true}}
    }

    vm.selectDescription(selectedItem, activity);

    expect(activity.partnerId).toBe(1);
    expect(activity.locations).toEqual([{id: 1, active: true}]);
    expect(activity.contacts).toEqual([{id: 4, active: true}]);

  }));

  it('selectDescription choosing a partner will set up the partner elements', inject(function($controller) {
    var activity = { type: 'Civic' };
    var selectedItem = { name: 'Voting' };

    vm.selectDescription(selectedItem, activity);

    expect(activity.civicCategory).toBe('Voting');

  }));

  it('unSelectDescription undefine all partner elements for partner type', inject(function($controller) {
    var activity = {
        type: 'Partner',
        partnerId: 1,
        locationId: 2,
        contactId: 3,
        locations: [{id: 1, active: true}],
        contacts: [{id: 4, active: true}]
    };

    vm.unSelectDescription(activity);

    expect(activity.partnerId).toBe(undefined);
    expect(activity.locationId).toBe(undefined);
    expect(activity.contactId).toBe(undefined);
    expect(activity.locations).toEqual([]);
    expect(activity.contacts).toEqual([]);

  }));

  it('unSelectDescription undefine civic category for not partner type', inject(function($controller) {
    var activity = { civicCategory: 'Voting' };

    vm.unSelectDescription(activity);

    expect(activity.civicCategory).toBe(undefined);

  }));

  it('selectLocation sets location id', inject(function($controller) {
    var selectedItem = {id: 1};
    var activity = {};

    vm.selectLocation(selectedItem, activity);

    expect(activity.locationId).toBe(1);

  }));

  it('unSelectLocation unsets location id', inject(function($controller) {
    var activity = {locationId: 1};

    vm.unSelectLocation(activity);

    expect(activity.locationId).toBe(undefined);

  }));

  it('selectContact sets contact id', inject(function($controller) {
    var selectedItem = {id: 1};
    var activity = {};

    vm.selectContact(selectedItem, activity);

    expect(activity.contactId).toBe(1);

  }));

  it('unSelectContact unsets contact id', inject(function($controller) {
    var activity = {contactId: 1};

    vm.unSelectContact(activity);

    expect(activity.contactId).toBe(undefined);

  }));

  it('updateEndDate does not update end Date if type partner', inject(function($controller) {
    var startDate = new Date(0);
    var endDate = new Date(1);
    var activity = {startDate: startDate, endDate: endDate, type: 'Partner'};

    vm.updateEndDate(activity);

    expect(activity.endDate).toBe(endDate);

  }));

  it('updateEndDate only updates the endDate if type not partner', inject(function($controller) {
    var startDate = new Date(0);
    var endDate = new Date(1);
    var activity = {startDate: startDate, endDate: endDate, type: 'Civic'};

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



});