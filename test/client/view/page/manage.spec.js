'use strict';

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
    id: 1,
    name: 'Partner 1',
    contacts: {1: contact1},
    locations: {1: location1, 2: location2},
    core_partner: true,
    is_active: true
};
var partner2 = {
    id: 2,
    name: 'Partner 2',
    contacts: {},
    locations: {3: location3},
    core_partner: false,
    is_active: true,
    added: true
};
var partner3 = {
    id: 3,
    name: 'Partner 3',
    contacts: {2: contact2, 3: contact3, 4: contact4},
    locations: {2: location2, 3: location3, 4: location4},
    core_partner: true,
    is_active: true
};
var partner4 = {
    id: 4,
    name: 'Partner 4',
    contacts: {2: contact2, 4: contact4},
    locations: {2: location2, 4: location4},
    core_partner: false,
    is_active: false
};
var partner5 = {
    id: 5,
    name: 'Partner 5',
    contacts: {4: contact4},
    locations: {1: location1, 3: location3},
    core_partner: true,
    is_active: false
};

// Example User Data
var user1 = {
    id: 1,
    first_name: 'Katherine',
    last_name: 'McDonough',
    email: 'mcdonough.kat@husky.neu.edu',
    peer_leaders: [2],
    auth_role: 'Student',
    pronouns: 'she',
    neu_start: 2013,
    aces_start: 2013,
    is_active: true
};
var user2 = {
    id: 2,
    first_name: 'Jennifer',
    last_name: 'LaPierre',
    email: 'lapierre.j@husky.neu.edu',
    auth_role: 'Peer Leader',
    pronouns: 'she',
    neu_start: 2014,
    aces_start: 2015,
    is_active: true
};
var user3 = {
    id: 3,
    first_name: 'Lawrence',
    last_name: 'Lim',
    email: 'lim.law@husky.neu.edu',
    auth_role: 'Administrator',
    pronouns: 'he',
    neu_start: 2016,
    aces_start: 2016,
    is_active: true
};
var user4 = {
    id: 4,
    first_name: 'Jonathon',
    last_name: 'Northcott',
    email: 'northcott.j@husky.neu.edu',
    auth_role: 'Student',
    pronouns: 'he',
    core_partner: 3,
    neu_start: 2013,
    aces_start: 2015,
    is_active: true
};
var user5 = {
    id: 5,
    first_name: 'Jennifer',
    last_name: 'McDonough',
    email: 'mcdonough.j@husky.neu.edu',
    auth_role: 'Peer Leader',
    pronouns: 'she',
    neu_start: 2014,
    aces_start: 2015,
    is_active: false
};

var vm, uploadCalled;
var updatePartnerCalled, deletePartnerCalled, addPartnerCalled;
var upsertUserCalled, deleteUserCalled;

describe('ManageController', function() {

  beforeEach(module('app'));

  beforeEach(inject(function ($controller, $q, $rootScope) {
    var dummyElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(dummyElement);

    function mockUpload () {
        uploadCalled = true;
        var deferred = $q.defer();
        deferred.resolve('Remote call result');
        return deferred.promise;
    }

    function mockGetUsers() {
        var deferred = $q.defer();
        deferred.resolve('Remote call result');
        return deferred.promise;
    }

    function mockGetPartners () {
        var deferred = $q.defer();
        deferred.resolve([]);
        return deferred.promise;
    }

    function mockUpdatePartner(partner) {
        updatePartnerCalled = partner;
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    }

    function mockDeletePartner(partner) {
        deletePartnerCalled = partner;
    }

    function mockAddPartner(partner) {
        addPartnerCalled = partner;
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    }

    function mockGetCurrentUser () {
        var deferred = $q.defer();
        deferred.resolve({});
        return deferred.promise;
    }

    function mockUpsertUser(user) {
        upsertUserCalled = user;

        var deferred = $q.defer();
        deferred.resolve('Remote call result');
        return deferred.promise;
    }

    function mockDeleteUser(user) {
        deleteUserCalled = user;
    }

    function mockGetAuthRoles() {
        return [{name: 'Student'}, {name: 'Peer Leader'}, {name: 'Administrator'}];
    }

    var mockPartnerService = {
        getPartners: mockGetPartners,
        addPartner: mockAddPartner,
        deletePartner: mockDeletePartner,
        updatePartner: mockUpdatePartner,
        uploadPartners: mockUpload
    }

    var mockUserService = {
        getCurrentUser: mockGetCurrentUser,
        getUsers: mockGetUsers,
        upsertUser: mockUpsertUser,
        deleteUser: mockDeleteUser,
        uploadStudents: mockUpload,
        uploadPeerLeaders: mockUpload,
        uploadAdministrators: mockUpload,
        getAuthRoles: mockGetAuthRoles
    }

    var scope = $rootScope.$new();

    vm = $controller('ManageController', {PartnerService: mockPartnerService,
                                          UserService: mockUserService,
                                          $scope: scope});

    uploadCalled = false;
    updatePartnerCalled = undefined;
    deletePartnerCalled = undefined;
    addPartnerCalled = undefined;
    upsertUserCalled = undefined;
    deleteUserCalled = undefined;

  }));

  it('when users are needed but undefined calls UserService.getUsers', inject(function($controller) {

    vm.setTab('Students');

    expect(vm.selectedTab).toBe('Students');

  }));

  it('when partners is selected add element adds a partner to the list', inject(function($controller) {

    vm.setTab('Community Partners');
    vm.partners = [partner1, partner2, partner3, partner4];

    vm.addElement();

    expect(vm.partners.length).toBe(5);
    expect(vm.partners[4]).toEqual({locations: {}, contacts: {}, added: true, expanded: true, is_active: true});

  }));

  it('when students is selected add student element to users list', inject(function($controller) {

    vm.setTab('Students');
    vm.users = [user1, user2, user3, user4];

    vm.addElement();

    expect(vm.users.length).toBe(5);
    expect(vm.users[4]).toEqual({auth_role: 'Student', expanded: true, is_active: true});

  }));

  it('when peer leaders is selected add peer leader element to users list', inject(function($controller) {

    vm.setTab('Peer Leaders');
    vm.users = [user1, user2, user3, user4];

    vm.addElement();

    expect(vm.users.length).toBe(5);
    expect(vm.users[4]).toEqual({auth_role: 'Peer Leader', expanded: true, is_active: true});

  }));

  it('when administrators is selected add administrator element to users list', inject(function($controller) {

    vm.setTab('Administrators');
    vm.users = [user1, user2, user3, user4];

    vm.addElement();

    expect(vm.users.length).toBe(5);
    expect(vm.users[4]).toEqual({auth_role: 'Administrator', expanded: true, is_active: true});

  }));

  it('toggles element expanded attribute', inject(function($controller) {
    var el = {};

    vm.expandElement(el);

    expect(el.expanded).toBe(true);

    vm.expandElement(el);

    expect(el.expanded).toBe(false);

  }));

  it('removePartnerLocation removes the location from the given partner', inject(function($controller) {
    vm.partners = [partner1, partner2, partner3, partner4];

    vm.removePartnerLocation(2,3)

    expect(vm.partners[3].locations[3]).toBe(undefined);

  }));

  it('removePartnerContact removes the contact from the given partner', inject(function($controller) {
    vm.partners = [partner1, partner2, partner3, partner4];

    vm.removePartnerContact(3,4)

    expect(vm.partners[3].contacts[4]).toBe(undefined);

  }));

  it('savePartner updates partner if not new', inject(function($controller) {
    vm.partners = [partner1, partner2, partner3, partner4];

    vm.savePartner(0);

    expect(updatePartnerCalled).toBe(partner1);
    expect(updatePartnerCalled.added).toBe(undefined);

  }));

  it('savePartner add partner if new and unmarks as new', inject(function($controller) {
    vm.partners = [partner1, partner2, partner3, partner4];

    vm.savePartner(1);

    expect(addPartnerCalled).toBe(partner2);
    expect(vm.partners[2].added).toBe(undefined);

  }));

  it('delete partner deletes the partner and removes from list', inject(function($controller) {
    vm.partners = [partner1, partner2, {_id: {$oid: 3}}, partner4];

    vm.deletePartner(2);

    expect(deletePartnerCalled).toBe(3);
    expect(vm.partners[2]).not.toBe(partner3);

  }));

  it('noLocations will return true if there are no locations in passed object', inject(function($controller) {

    var noLocations = vm.noLocations({});

    expect(noLocations).toBe(true);

  }));

  it('noLocations will return false if there are locations', inject(function($controller) {

    var noLocations = vm.noLocations(partner1.locations);

    expect(noLocations).toBe(false);

  }));

  it('addLocation will add a new empty location to the partner', inject(function($controller) {
    vm.partners = [partner1, partner2, partner3, partner4];

    vm.addLocation(3);

    expect(vm.partners[3].locations[2]).toBe(location2);
    expect(vm.partners[3].locations[4]).toBe(location4);
    expect(vm.partners[3].locations[5]).toEqual({is_active: true});

  }));

  it('addContact will add a new empty contact to the partner', inject(function($controller) {
    vm.partners = [partner1, partner2, partner3, partner4];

    vm.addContact(0);

    expect(vm.partners[0].contacts[1]).toBe(contact1);
    expect(vm.partners[0].contacts[2]).toEqual({is_active: true});

  }));

  it('saveUser will call UserService.upsertUser with the appropriate user', inject(function($controller) {

    vm.saveUser(user1);

    expect(upsertUserCalled).toBe(user1);

  }));

  it('saveUser will call UserService.upsertUser and switch the auth_role', inject(function($controller) {
    user3.newAuthRole = 'Student';

    vm.saveUser(user3);

    expect(upsertUserCalled).toBe(user3);
    expect(user3.auth_role).toBe('Student');

  }));

  it('selectNewAuthRole adds a new auth role to user', inject(function($controller) {

    vm.selectNewAuthRole({name: 'Administrator'}, user4);

    expect(user4.newAuthRole).toBe('Administrator');

  }));

  it('unSelectNewAuthRole sets auth_role to undefined', inject(function($controller) {

    vm.unSelectNewAuthRole(user4);

    expect(user4.newAuthRole).toBe(undefined);

  }));

  it('deleteUser will call UserService.deleteUser with the appropriate user', inject(function($controller) {
    vm.users = [user1, user2, user3, {_id: {$oid: 4}}, user5];

    vm.deleteUser({_id: {$oid: 4}});

    expect(deleteUserCalled).toBe(4);
    expect(vm.users.length).toBe(4);
    expect(vm.users[3]).not.toBe(user4);

  }));

  it('setCorePartners only updates the list with active core community partners', inject(function($controller) {
    var partners = [partner1, partner2, partner3, partner4, partner5];

    vm.setCorePartners(partners);

    expect(vm.corePartners.length).toBe(2);
    expect(vm.corePartners).toEqual([partner1, partner3]);

  }));

  it('setPeerLeaders only updates the list with active peer leaders', inject(function($controller) {
    var users = [user1, user2, user3, user4, user5];

    vm.setPeerLeaders(users);

    expect(vm.peerLeaders.length).toBe(1);
    expect(vm.peerLeaders).toEqual([user2]);

  }));

  it('setPeerLeaders adds a name field with both the first and last name', inject(function($controller) {
    var users = [user1, user2, user3, user4, user5];

    vm.setPeerLeaders(users);

    expect(vm.peerLeaders.length).toBe(1);
    expect(vm.peerLeaders).toEqual([user2]);
    expect(vm.peerLeaders[0].name).toBe('Jennifer LaPierre');

  }));

  it('returns the partner name for the given partner', inject(function($controller) {
    vm.partners = [partner1, partner2, partner3, partner4, partner5];

    var partnerName = vm.getPartnerName(4);

    expect(partnerName).toBe('Partner 4');

  }));

  it('returns the name of the peer leader with the given id', inject(function($controller) {
    vm.setPeerLeaders([user1, user2]);

    var peerLeaderName = vm.getPeerLeaderName(2);

    expect(peerLeaderName).toBe('Jennifer LaPierre');

  }));

  it('sets the student core community partner to id of given partner', inject(function($controller) {

    vm.selectCoreCommunityPartner(partner1, user1);

    expect(user1.core_partner).toBe(1);

  }));

  it('removes the student core community partner id', inject(function($controller) {

    vm.unSelectCoreCommunityPartner(user1);

    expect(user1.core_partner).toBe(undefined);

  }));

  it('sets the peer leader id in the given spot to the new id', inject(function($controller) {

    vm.selectPeerLeader(user5, user1, 0);

    expect(user1.peer_leaders).toEqual([5]);

  }));

  it('sets the peer leader id in the given spot to -1', inject(function($controller) {

    vm.unSelectPeerLeader(user1, 0);

    expect(user1.peer_leaders).toEqual([-1]);

  }));

  it('adds a peer leader with id -1 to peer leader list', inject(function($controller) {
    user1.peer_leaders = [1,2];

    vm.addPeerLeader(user1);

    expect(user1.peer_leaders).toEqual([1, 2, -1]);

  }));

  it('sets peer leader list when none exist', inject(function($controller) {

    vm.addPeerLeader(user4);

    expect(user4.peer_leaders).toEqual([-1]);

  }));

  it('removes peer leader from given position', inject(function($controller) {
    user1.peer_leaders = [1,2,3,4];

    vm.removePeerLeader(user1, 1);

    expect(user1.peer_leaders).toEqual([1,3,4]);

  }));

  it('when on partner tab uploads file to partners', inject(function($controller) {

    vm.selectedTab = 'Community Partners';

    vm.handleFileSelect({target: {files: []}});

    expect(uploadCalled).toBe(true);

  }));

  it('when on student tab uploads file to student', inject(function($controller) {

    vm.selectedTab = 'Students';

    vm.handleFileSelect({target: {files: []}});

    expect(uploadCalled).toBe(true);

  }));

  it('when on peer leader tab uploads file to peer leader', inject(function($controller) {

    vm.selectedTab = 'Peer Leaders';

    vm.handleFileSelect({target: {files: []}});

    expect(uploadCalled).toBe(true);

  }));
  
  it('when on administrator tab uploads file to administrator', inject(function($controller) {

    vm.selectedTab = 'Administrators';

    vm.handleFileSelect({target: {files: []}});

    expect(uploadCalled).toBe(true);

  }));

});