'use strict';

// Example Data to check the functions

// Function for mocking google object
var googleCenter, googleZoom, googlePosition;

function setCenter(center) {
    googleCenter = center;
}

function setZoom(zoom) {
    googleZoom = zoom;
}

function setPosition(position) {
    googlePosition = position;
}

var google = {
    maps: {
        Map: function() { return {setCenter: setCenter, setZoom: setZoom}; },
        Marker: function() { return {setPosition: setPosition}; }
    }
}

// Example Contacts
var contact1 = {
    name: 'Katherine McDonough',
    email: 'mcdonough.kat@husky.neu.edu',
    phone: '6175550129',
    is_active: true
};
var contact2 = {
    name: 'Jennifer LaPierre',
    email: 'lapierre.j@husky.neu.edu',
    phone: '6175558726',
    is_active: false
};
var contact3 = {
    name: 'Lawrence Lim',
    email: 'lim.law@husky.neu.edu',
    phone: '6175558217',
    is_active: true
};
var contact4 = {
    name: 'Jonathon Northcott',
    email: 'northcott.j@husky.neu.edu',
    phone: '6175552625',
    is_active: true
};

// Example Locations
var location1 = {
    street: '165 Hemenway Street',
    city: 'Boston',
    state: 'MA',
    zipcode: '02115',
    location: {lat: 42.341423, lng: -71.091129},
    name: '165 Hemenway Street, Boston MA, 02115',
    is_active: true
};
var location2 = {
    street: '171 Hemenway Street',
    city: 'Boston',
    state: 'MA',
    zipcode: '02115',
    location: {lat: 42.341309, lng: -71.091202},
    name: '171 Hemenway Street, Boston MA, 02115',
    is_active: true
};
var location3 = {
    street: '360 Huntington Ave',
    city: 'Boston',
    state: 'MA',
    zipcode: '02115',
    location: {lat: 42.340496, lng: -71.087897},
    name: '360 Huntington Ave, Boston MA, 02115',
    is_active: true
};
var location4 = {
    street: '633 Clark Street',
    city: 'Evanston',
    state: 'IL',
    zipcode: '60208',
    location: {lat: 42.050626, lng: -87.679727},
    name: '633 Clark Street, Evanston IL, 60208',
    is_active: false
};

// Example Partners
var partner1 = {
    _id: {$oid: 1},
    name: 'Partner 1',
    contacts: {1: contact1},
    locations: {1: location1, 2: location2},
    core_partner: true,
    is_active: true
};
var partner2 = {
    _id: {$oid: 2},
    name: 'Partner 2',
    contacts: {},
    locations: {3: location3},
    core_partner: false,
    is_active: true
};
var partner3 = {
    _id: {$oid: 3},
    name: 'Partner 3',
    contacts: {2: contact2, 3: contact3, 4: contact4},
    locations: {2: location2, 3: location3, 4: location4},
    core_partner: true,
    is_active: true
};
var partner4 = {
    _id: {$oid: 4},
    name: 'Partner 4',
    contacts: {2: contact2, 4: contact4},
    locations: {2: location2, 4: location4},
    core_partner: false,
    is_active: false
};

// Activity Examples
var activity3 = {
    type: 'Partner',
    partner: {$id: {$oid: 3}},
    contact: 3,
    location: 3,
    start_time: 1510833600,
    end_time: 1510840800,
    manual: true,
    comment: 'Assisted with organization of an event'
};

var vm;

describe('CheckInOutController', function() {

  beforeEach(module('app'));

  beforeEach(inject(function ($rootScope, $controller, $q) {

    function mockGetPartners () {
        var deferred = $q.defer();
        deferred.resolve([partner1, partner2, partner3, partner4]);
        return deferred.promise;
    }

    var mockPartnerService = {
        getPartners: mockGetPartners
    }

    function mockGetCurrentUser () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    }

    var mockUserService = {
        getCurrentUser: mockGetCurrentUser
    }

    function mockGetCurrentActivity () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    }

    function mockCheckUserIn() {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    }

    function mockCheckUserOut() {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    }

    var mockActivityService = {
        getCurrentActivity: mockGetCurrentActivity,
        checkUserIn: mockCheckUserIn,
        checkUserOut: mockCheckUserOut
    }

    var scope = $rootScope.$new();
    vm = $controller('CheckInOutController', {PartnerService: mockPartnerService,
                                              UserService: mockUserService,
                                              ActivityService: mockActivityService});

  }));

  it('getActivePartners only returns the list of active partners', inject(function($controller) {

    vm.getActivePartners([partner1, partner2, partner3, partner4]);

    expect(vm.partners.length).toBe(3);
    expect(vm.partners[0]).toBe(partner1);
    expect(vm.partners[1]).toBe(partner2);
    expect(vm.partners[2]).toBe(partner3);

  }));

  it('onPartnerSelect sets the selected partner to the given item', inject(function($controller) {

    vm.onPartnerSelect(partner1);

    expect(vm.selectedPartner).toBe(partner1);
  }));

  it('onPartnerSelect sets locations to the locations of the partner', inject(function($controller) {

    vm.onPartnerSelect(partner1);

    expect(vm.locations.length).toBe(2);
    expect(vm.locations[0]).toBe(location1);
    expect(vm.locations[1]).toBe(location2);

  }));

  it('onPartnerSelect sets locations only to active locations of the partner', inject(function($controller) {

    vm.onPartnerSelect(partner3);

    expect(vm.locations.length).toBe(2);
    expect(vm.locations[0]).toBe(location2);
    expect(vm.locations[1]).toBe(location3);

  }));

  it('onPartnerSelect sets contacts to the contacts of the partner', inject(function($controller) {

    vm.onPartnerSelect(partner1);

    expect(vm.contacts.length).toBe(1);
    expect(vm.contacts[0]).toBe(contact1);

  }));

  it('onPartnerSelect sets contacts only to active contacts of the partner', inject(function($controller) {

    vm.onPartnerSelect(partner3);

    expect(vm.contacts.length).toBe(2);
    expect(vm.contacts[0]).toBe(contact3);
    expect(vm.contacts[1]).toBe(contact4);

  }));

  it('partnerUnSelect unsets the selected partner', inject(function($controller) {

    vm.onPartnerSelect(partner3);
    vm.partnerUnSelect();

    expect(vm.selectedPartner).toBe(undefined);

  }));

  it('onLocationSelect sets the selected location to the given item', inject(function($controller) {

    vm.onLocationSelect(location1);

    expect(vm.selectedLocation).toBe(location1);

  }));

  it('onLocationSelect gives Google the appropriate values', inject(function($controller) {

    vm.onLocationSelect(location1);

    expect(googleCenter).toBe(location1.location);
    expect(googleZoom).toBe(17);
    expect(googlePosition).toBe(location1.location);

  }));

  it('locationUnSelect unsets the selected location', inject(function($controller) {

    vm.onLocationSelect(location1);
    vm.locationUnSelect();

    expect(vm.selectedLocation).toBe(undefined);

  }));

  it('locationUnSelect gives Google the appropriate values', inject(function($controller) {

    vm.onLocationSelect(location1);
    vm.locationUnSelect();

    expect(googleCenter.lat).toBe(42.360082);
    expect(googleCenter.lng).toBe(-71.058880);
    expect(googleZoom).toBe(10);
    expect(googlePosition.lat).toBe(42.360082);
    expect(googlePosition.lng).toBe(-71.058880);

  }));

  it('onContactSelect sets the selected contact to the given item', inject(function($controller) {

    vm.onContactSelect(contact1);

    expect(vm.selectedContact).toBe(contact1);

  }));

  it('contactUnSelect unsets the selected contact', inject(function($controller) {

    vm.onContactSelect(contact1);
    vm.contactUnSelect();

    expect(vm.selectedContact).toBe(undefined);

  }));

  it('can set up an current activity correctly', inject(function($controller) {
    vm.partners = [{_id: {$oid: 3}, contacts: {3: contact3}, locations: {3: location3}}];

    vm.initCurrentActivity(activity3);

    expect(vm.selectedPartner._id.$oid).toBe(3);
    expect(vm.selectedLocation.name).toBe('360 Huntington Ave, Boston MA, 02115');
    expect(vm.selectedContact.name).toBe('Lawrence Lim');

  }));

  it('can set up an current activity correctly with the Google map', inject(function($controller) {
    vm.partners = [{_id: {$oid: 3}, contacts: {3: contact3}, locations: {3: location3}}];

    vm.initCurrentActivity(activity3);

    expect(googleCenter.lat).toBe(42.340496);
    expect(googleCenter.lng).toBe(-71.087897);
    expect(googleZoom).toBe(17);
    expect(googlePosition.lat).toBe(42.340496);
    expect(googlePosition.lng).toBe(-71.087897);

  }));

  it('when there is no current activity correct button is check in', inject(function($controller) {

    vm.currentActivity = undefined;

    var correctButton = vm.correctButton();

    expect(correctButton).toBe('Check In');

  }));

  it('when there is a current activity correct button is check ouy', inject(function($controller) {

    vm.currentActivity = activity3;

    var correctButton = vm.correctButton();

    expect(correctButton).toBe('Check Out');

  }));

  it('when there is no current activity current activity is created when checked in', inject(function($controller) {
    vm.currentUser = {_id: {$oid: 1}};

    vm.currentActivity = undefined;
    vm.onPartnerSelect({_id: {$oid: 3},contacts: {3: contact3}, locations: {3: location3}});
    vm.onLocationSelect({id: 3, location: [0,0]});
    vm.onContactSelect({id: 3});

    vm.checkInOrOut();

    expect(vm.currentActivity).not.toBe(undefined);
    expect(vm.currentActivity.partner).toBe(3);
    expect(vm.currentActivity.location).toBe(3);
    expect(vm.currentActivity.contact).toBe(3);

  }));

  it('when there is a current activity current activity cleared', inject(function($controller) {
    vm.currentUser = {_id: {$oid: 1}};

    vm.currentActivity = activity3;

    vm.checkInOrOut();

    expect(vm.currentActivity).toBe(undefined);

  }));

});