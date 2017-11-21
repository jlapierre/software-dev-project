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
    phone: '6175550129'
};
var contact2 = {
    name: 'Jennifer LaPierre',
    email: 'lapierre.j@husky.neu.edu',
    phone: '6175558726'
};
var contact3 = {
    name: 'Lawrence Lim',
    email: 'lim.law@husky.neu.edu',
    phone: '6175558217'
};
var contact4 = {
    name: 'Jonathon Northcott',
    email: 'northcott.j@husky.neu.edu',
    phone: '6175552625'
};

// Example Locations
var location1 = {
    street: '165 Hemenway Street',
    city: 'Boston',
    state: 'MA',
    zipcode: '02115',
    location: {lat: 42.341423, lng: -71.091129},
    name: '165 Hemenway Street, Boston MA, 02115'
};
var location2 = {
    street: '171 Hemenway Street',
    city: 'Boston',
    state: 'MA',
    zipcode: '02115',
    location: {lat: 42.341309, lng: -71.091202},
    name: '171 Hemenway Street, Boston MA, 02115'
};
var location3 = {
    street: '360 Huntington Ave',
    city: 'Boston',
    state: 'MA',
    zipcode: '02115',
    location: {lat: 42.340496, lng: -71.087897},
    name: '360 Huntington Ave, Boston MA, 02115'
};
var location4 = {
    street: '633 Clark Street',
    city: 'Evanston',
    state: 'IL',
    zipcode: '60208',
    location: {lat: 42.050626, lng: -87.679727},
    name: '633 Clark Street, Evanston IL, 60208'
};

// Example Partners
var partner1 = {
    id: 1,
    name: 'Partner 1',
    contacts: {1: contact1},
    locations: {1: location1, 2: location2},
    core: true
};
var partner2 = {
    id: 2,
    name: 'Partner 2',
    contacts: {},
    locations: {3: location3},
    core: false
};
var partner3 = {
    id: 3,
    name: 'Partner 3',
    contacts: {2: contact2, 3: contact3, 4: contact4},
    locations: {2: location2, 3: location3, 4: location4},
    core: true
};

// Activity Examples
var activity3 = {
    type: 'Partner',
    partnerId: 3,
    contactId: 3,
    locationId: 3,
    startTime: 1510833600,
    endTime: 1510840800,
    manual: true,
    comment: 'Assisted with organization of an event'
};

describe('CheckInOutController', function() {

  beforeEach(module('app'));

  it('onPartnerSelect sets the selected partner to the given item', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onPartnerSelect(partner1);

    expect(vm.selectedPartner).toBe(partner1);
  }));

  it('onPartnerSelect sets locations to the locations of the partner', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onPartnerSelect(partner1);

    expect(vm.locations.length).toBe(2);
    expect(vm.locations[0]).toBe(location1);
    expect(vm.locations[1]).toBe(location2);
  }));

  it('onPartnerSelect sets contacts to the contacts of the partner', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onPartnerSelect(partner3);

    expect(vm.contacts.length).toBe(3);
    expect(vm.contacts[0]).toBe(contact2);
    expect(vm.contacts[1]).toBe(contact3);
    expect(vm.contacts[2]).toBe(contact4);

  }));

  it('partnerUnSelect unsets the selected partner', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onPartnerSelect(partner3);
    vm.partnerUnSelect();

    expect(vm.selectedPartner).toBe(undefined);

  }));

  it('onLocationSelect sets the selected location to the given item', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onLocationSelect(location1);

    expect(vm.selectedLocation).toBe(location1);

  }));

  it('onLocationSelect gives Google the appropriate values', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onLocationSelect(location1);

    expect(googleCenter).toBe(location1.location);
    expect(googleZoom).toBe(17);
    expect(googlePosition).toBe(location1.location);

  }));

  it('locationUnSelect unsets the selected location', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onLocationSelect(location1);
    vm.locationUnSelect();

    expect(vm.selectedLocation).toBe(undefined);

  }));

  it('locationUnSelect gives Google the appropriate values', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onLocationSelect(location1);
    vm.locationUnSelect();

    expect(googleCenter.lat).toBe(42.360082);
    expect(googleCenter.lng).toBe(-71.058880);
    expect(googleZoom).toBe(10);
    expect(googlePosition.lat).toBe(42.360082);
    expect(googlePosition.lng).toBe(-71.058880);

  }));

  it('onContactSelect sets the selected contact to the given item', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onContactSelect(contact1);

    expect(vm.selectedContact).toBe(contact1);

  }));

  it('contactUnSelect unsets the selected contact', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.onContactSelect(contact1);
    vm.contactUnSelect();

    expect(vm.selectedContact).toBe(undefined);

  }));

  it('can set up an current activity correctly', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.initCurrentActivity(activity3);

    expect(vm.selectedPartner.id).toBe(3);
    expect(vm.selectedLocation.name).toBe('360 Huntington Ave, Boston MA, 02115');
    expect(vm.selectedContact.name).toBe('Lawrence Lim');

  }));

  it('can set up an current activity correctly with the Google map', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.initCurrentActivity(activity3);

    expect(googleCenter.lat).toBe(42.340496);
    expect(googleCenter.lng).toBe(-71.087897);
    expect(googleZoom).toBe(17);
    expect(googlePosition.lat).toBe(42.340496);
    expect(googlePosition.lng).toBe(-71.087897);

  }));

  it('when there is no current activity correct button is check in', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.currentActivity = undefined;

    var correctButton = vm.correctButton();

    expect(correctButton).toBe('Check In');

  }));

  it('when there is a current activity correct button is check ouy', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.currentActivity = activity3;

    var correctButton = vm.correctButton();

    expect(correctButton).toBe('Check Out');

  }));

  it('when there is no current activity current activity is created when checked in', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.currentActivity = undefined;
    vm.onPartnerSelect(partner3);
    vm.onLocationSelect(location3);
    vm.onContactSelect(contact3);

    vm.checkInOrOut();

    expect(vm.currentActivity).not.toBe(undefined);
    expect(vm.currentActivity.partnerId).toBe(3);
    expect(vm.currentActivity.locationId).toBe(3);
    expect(vm.currentActivity.contactId).toBe(3);

  }));

  it('when there is a current activity current activity cleared', inject(function($controller) {
    var vm = $controller('CheckInOutController');

    vm.currentActivity = activity3;

    vm.checkInOrOut();

    expect(vm.currentActivity).toBe(undefined);

  }));

});