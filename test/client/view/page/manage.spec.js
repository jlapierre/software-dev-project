'use strict';

describe('ManageController', function() {

  beforeEach(module('app'));

  it('when on partner tab uploads file to partners', inject(function($controller, $q) {
    var dummyElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(dummyElement);

    var uploadPartnersCalled = false;
    var mockPartnerService = {
        uploadPartners: function () {
            uploadPartnersCalled = true;
            var deferred = $q.defer();
            deferred.resolve('Remote call result');
            return deferred.promise;
        }
    };

    var vm = $controller('ManageController', {PartnerService: mockPartnerService});

    vm.selectedTab = 'Community Partners';

    vm.handleFileSelect({target: {files: []}});

    expect(uploadPartnersCalled).toBe(true);
  }));

  it('when on student tab uploads file to student', inject(function($controller, $q) {
    var dummyElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(dummyElement);

    var uploadStudentsCalled = false;
    var mockUserService = {
        uploadStudents: function () {
            uploadStudentsCalled = true;
            var deferred = $q.defer();
            deferred.resolve('Remote call result');
            return deferred.promise;
        },
        getCurrentUser: function () {}
    };

    var vm = $controller('ManageController', {UserService: mockUserService});

    vm.selectedTab = 'Students';

    vm.handleFileSelect({target: {files: []}});

    expect(uploadStudentsCalled).toBe(true);
  }));

  it('when on peer leader tab uploads file to peer leader', inject(function($controller, $q) {
    var dummyElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(dummyElement);

    var uploadPeerLeadersCalled = false;
    var mockUserService = {
        uploadPeerLeaders: function () {
            uploadPeerLeadersCalled = true;
            var deferred = $q.defer();
            deferred.resolve('Remote call result');
            return deferred.promise;
        },
        getCurrentUser: function () {}
    };

    var vm = $controller('ManageController', {UserService: mockUserService});

    vm.selectedTab = 'Peer Leaders';

    vm.handleFileSelect({target: {files: []}});

    expect(uploadPeerLeadersCalled).toBe(true);
  }));
  
  it('when on administrator tab uploads file to administrator', inject(function($controller, $q) {
    var dummyElement = document.createElement('div');
    spyOn(document, 'getElementById').and.returnValue(dummyElement);

    var uploadAdministratorsCalled = false;
    var mockUserService = {
        uploadAdministrators: function () {
            uploadAdministratorsCalled = true;
            var deferred = $q.defer();
            deferred.resolve('Remote call result');
            return deferred.promise;
        },
        getCurrentUser: function () {}
    };

    var vm = $controller('ManageController', {UserService: mockUserService});

    vm.selectedTab = 'Administrators';

    vm.handleFileSelect({target: {files: []}});

    expect(uploadAdministratorsCalled).toBe(true);
  }));  


});