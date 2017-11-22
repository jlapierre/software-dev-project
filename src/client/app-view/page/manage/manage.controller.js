(function () {
    'use strict';

    angular
        .module('app')
        .controller('ManageController', ManageController);

    function ManageController(UserService, PartnerService) {
        var vm = this;
        vm.showMenu = false;

        // Get current user
        vm.currentUser = UserService.getCurrentUser();

        function setTab(tab) {
            vm.selectedTab = tab;

            if (vm.selectedTab === 'Community Partners' && !vm.partners) {
                vm.partners = PartnerService.getPartners();
            } else if (!vm.users) {
                vm.users = UserService.getUsers();
            }
        }
        vm.setTab = setTab;

        // Initialize view to partners
        vm.setTab('Community Partners');

        // Expand an element
        function expandElement(el) {
            el.expanded = !el.expanded;
        }
        vm.expandElement = expandElement;

        // Add an element
        function addElement() {
            if (vm.selectedTab === 'Community Partners') {
                vm.partners.push({locations: {}, contacts: {}, added: true, expanded: true, active: true});
            }
        }
        vm.addElement = addElement;

        // Functions for managing a partner

        // Check if there are locations
        function noLocations(locations) {
            var noLocations = true;

            for (var id in locations) {
                noLocations = false;
            }

            return noLocations;

        }
        vm.noLocations = noLocations;

        // Add a location
        function addLocation(pIndex) {
            var partner = vm.partners[pIndex];
            var locId = 0;

            for (var id in partner.locations) {
                var idInt = parseInt(id);

                if (locId <= idInt) {
                    locId = idInt + 1;
                }
            }

            partner.locations[locId] = {active: true};

            vm.partners[pIndex] = partner;
        }

        // Add a contact
        function addContact(pIndex) {
            var partner = vm.partners[pIndex];
            var contactId = 0;

            for (var id in partner.contacts) {
                var idInt = parseInt(id);

                if (contactId <= idInt) {
                    contactId = idInt + 1;
                }
            }

            partner.contacts[contactId] = {active: true};

            vm.partners[pIndex] = partner;
        }

        // Remove a location
        function removePartnerLocation(pIndex, locationId) {
            var partner = vm.partners[pIndex];
            delete partner.locations[locationId];

            vm.partners[pIndex] = partner;
        }

        // Remove a contact
        function removePartnerContact(pIndex, contactId) {
            var partner = vm.partners[pIndex];
            delete partner.contacts[contactId];

            vm.partners[pIndex] = partner;
        }

        // Save the changes to a partner
        function savePartner(pIndex) {
            var partner = vm.partners[pIndex];

            if (partner.added) {
                delete partner.added;
                PartnerService.addPartner(partner);
            } else {
                PartnerService.updatePartner(partner);
            }

        }

        // Deletes a partner
        function deletePartner(pIndex) {
            var partner = vm.partners[pIndex];

            PartnerService.deletePartner(partner);
            vm.partners.splice(pIndex, 1);
        }

        vm.addLocation = addLocation;
        vm.addContact = addContact;
        vm.removePartnerLocation = removePartnerLocation;
        vm.removePartnerContact = removePartnerContact;
        vm.savePartner = savePartner;
        vm.deletePartner = deletePartner;

        // Uploading Excel Files
        document.getElementById('files').addEventListener('change', handleFileSelect);

        function handleFileSelect(evt) {
            var filePromise;

            vm.file = evt.target.files[0];

            // Upload the file to the correct type of data
            if (vm.selectedTab === 'Community Partners') {
                filePromise = PartnerService.uploadPartners(vm.file);
            } else if (vm.selectedTab === 'Students') {
                filePromise = UserService.uploadStudents(vm.file);
            } else if (vm.selectedTab === 'Peer Leaders') {
                filePromise = UserService.uploadPeerLeaders(vm.file);
            } else if (vm.selectedTab === 'Administrators') {
                filePromise = UserService.uploadAdministrators(vm.file);
            }

          filePromise.then(function success(message) {
                vm.type = message.data.type;
            }, function error(message) {
                return message.data;
            });

            this.value = null;

            return false;
        }

        vm.handleFileSelect = handleFileSelect;

    }

})();