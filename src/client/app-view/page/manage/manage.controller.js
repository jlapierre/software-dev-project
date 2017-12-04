(function () {
    'use strict';

    angular
        .module('app')
        .controller('ManageController', ManageController);

    function ManageController(UserService, PartnerService, $scope) {
        var vm = this;
        vm.showMenu = false;

        // Get current user and activity (if applicable)
        UserService.getCurrentUser().then(
            function success(resp) {
                vm.currentUser = resp.data;
            },
            function failure() {
                console.log('Error receiving user');
                vm.currentUser = {};
            }
        );

        // Get Partners
        PartnerService.getPartners().then(
            function success(resp) {
                vm.partners = resp.data;
            },
            function failure() {
                console.log('Error receiving partners');
                vm.partners = [];
            }
        );

        UserService.getUsers().then(
            function success(resp) {
                vm.users = resp.data;
            },
            function failure() {
                console.log('Error receiving users');
                vm.users = [];
            }
        );

        // Get potential user auth roles
        vm.auth_roles = UserService.getAuthRoles();

        function setTab(tab) {
            vm.selectedTab = tab;
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
                vm.partners.push({locations: {}, contacts: {}, added: true, expanded: true, is_active: true});
            } else if (vm.selectedTab === 'Students') {
                vm.users.push({auth_role: 'Student', expanded: true, is_active: true});
            } else if (vm.selectedTab === 'Peer Leaders') {
                vm.users.push({auth_role: 'Peer Leader', expanded: true, is_active: true});
            } else if (vm.selectedTab === 'Administrators') {
                vm.users.push({auth_role: 'Administrator', expanded: true, is_active: true});
            }
        }
        vm.addElement = addElement;

        // Functions for managing a partner
        vm.addLocation = addLocation;
        vm.addContact = addContact;
        vm.removePartnerLocation = removePartnerLocation;
        vm.removePartnerContact = removePartnerContact;
        vm.savePartner = savePartner;
        vm.deletePartner = deletePartner;

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

            partner.locations[locId] = {is_active: true};

            vm.partners[pIndex] = partner;
        }

        // Add a contact
        function addContact(pIndex) {
            var partner = vm.partners[pIndex];
            var contact = 0;

            for (var id in partner.contacts) {
                var idInt = parseInt(id);

                if (contact <= idInt) {
                    contact = idInt + 1;
                }
            }

            partner.contacts[contact] = {is_active: true};

            vm.partners[pIndex] = partner;
        }

        // Remove a location
        function removePartnerLocation(pIndex, location) {
            var partner = vm.partners[pIndex];
            delete partner.locations[location];

            vm.partners[pIndex] = partner;
        }

        // Remove a contact
        function removePartnerContact(pIndex, contact) {
            var partner = vm.partners[pIndex];
            delete partner.contacts[contact];

            vm.partners[pIndex] = partner;
        }

        // Save the changes to a partner
        function savePartner(pIndex) {
            var partner = vm.partners[pIndex];
            delete partner.expanded;

            if (partner.added) {
                delete partner.added;
                PartnerService.addPartner(partner).then(
                    function success(resp) {
                        vm.partners[pIndex] = resp.data;
                    }
                );
            } else {
                PartnerService.updatePartner(partner).then(
                    function success(resp) {
                        vm.partners[pIndex] = resp.data;
                    }
                );
            }
        }

        // Deletes a partner
        function deletePartner(pIndex) {
            var partner = vm.partners[pIndex];

            if (partner._id) {
                PartnerService.deletePartner(partner._id.$oid);
            }

            vm.partners.splice(pIndex, 1);
        }

        // Functions for managing all users
        vm.saveUser = saveUser;
        vm.deleteUser = deleteUser;
        vm.selectNewAuthRole = selectNewAuthRole;
        vm.unSelectNewAuthRole = unSelectNewAuthRole;

        // Save changes to a user
        function saveUser(user) {
            if (user.newAuthRole) {
                user.auth_role = user.newAuthRole
                delete user.newAuthRole;
            }

            delete user.expanded;
            UserService.upsertUser(user).then(
                function success(resp) {
                    user = resp.data;
                }
            );
        }

        // Delete a user
        function deleteUser(user) {
            var uIndex = vm.users.indexOf(user);

            if (user._id) {
                UserService.deleteUser(user._id.$oid);
            }

            vm.users.splice(uIndex, 1);
        }

        function selectNewAuthRole(selectedItem, user) {
            user.newAuthRole = selectedItem.name;
        }

        function unSelectNewAuthRole(user) {
            user.newAuthRole = undefined;
        }

        // Functions for managing a student and peer leaders

        // Functions Needed for typeaheads

        // Functions for setting the lists for the options
        // for core partners and peer leaders
        vm.setCorePartners = setCorePartners;
        vm.setPeerLeaders = setPeerLeaders;

        $scope.$watch('vm.partners', vm.setCorePartners, true);
        $scope.$watch('vm.users', vm.setPeerLeaders, true);

        // Compile list of active core partners
        function setCorePartners(partners) {
            vm.corePartners = [];

            if (!!partners) {
                for (var i = 0; i < partners.length; i++) {
                    if (partners[i].is_active && partners[i].core_partner) {
                        vm.corePartners.push(partners[i]);
                    }
                }
            }
        }

        // Compile list of active peer leaders
        function setPeerLeaders(users) {
            vm.peerLeaders = [];

            if (!!users) {
                for (var i = 0; i < users.length; i++) {
                    if (users[i].auth_role === 'Peer Leader' && users[i].is_active) {
                        var peerLeader = users[i];
                        peerLeader.name = peerLeader.first_name.concat(" ".concat(peerLeader.last_name));
                        vm.peerLeaders.push(peerLeader);
                    }
                }
            }
        }

        // Functions for displaying the selected item name
        // in the typeaheads for community partners and peer leaders
        vm.getPartnerName = getPartnerName;
        vm.getPeerLeaderName = getPeerLeaderName;

        // Get the name of the partner with the given id
        function getPartnerName(partner) {
            if (!!vm.partners && partner) {
                for (var i = 0; i < vm.partners.length; i++) {
                    if (vm.partners[i]._id.$oid === partner.$id.$oid) {
                        return vm.partners[i].name;
                    }
                }
            }

            return '';
        }

        // Get the name of the peer leader with the given id
        function getPeerLeaderName(peerLeaderId) {
            var name = '';

            if (!!vm.peerLeaders) {
                for (var i = 0; i < vm.peerLeaders.length; i++) {
                    if (vm.peerLeaders[i]._id.$oid === peerLeaderId.$id.$oid) {
                        name = vm.peerLeaders[i].name;
                    }
                }
            }

            return name;
        }

        // Functions for when an option is selected
        // in the typeaheads for community partners and peer leaders
        vm.selectCoreCommunityPartner = selectCoreCommunityPartner;
        vm.unSelectCoreCommunityPartner = unSelectCoreCommunityPartner;
        vm.selectPeerLeader = selectPeerLeader;
        vm.unSelectPeerLeader = unSelectPeerLeader;

        // Set the core partner id for the given student
        function selectCoreCommunityPartner(selectedItem, student) {
            student.core_partner = {$id: {$oid: selectedItem._id.$oid}};
        }

        // Remove the core partner selected
        function unSelectCoreCommunityPartner(student) {
            student.core_partner = undefined;
        }

        // Update the peer leader at the specific location in the list
        function selectPeerLeader(selectedItem, student, peerLeaderIndex) {
            student.peer_leaders[peerLeaderIndex] = {$id: {$oid: selectedItem._id.$oid}};
        }

        // Place an empty peer leader at that place in the group
        function unSelectPeerLeader(student, peerLeaderIndex) {
            student.peer_leaders[peerLeaderIndex] = -1;
        }

        // Functions for adding and deleting peer leaders to a student
        vm.addPeerLeader = addPeerLeader;
        vm.removePeerLeader = removePeerLeader;

        // Add an empty peer leader to the peer leader list or make one
        function addPeerLeader(student) {
            if (!student.peer_leaders) {
                student.peer_leaders = [-1];
            } else {
                student.peer_leaders.push(-1);
            }
        }

        // Remove the peer leader from the peer leader list
        function removePeerLeader(student, peerLeaderIndex) {
           student.peer_leaders.splice(peerLeaderIndex,1);
        }

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

        function noop() {}
        vm.noop = noop;

    }

})();