(function () {
    'use strict';

    angular
        .module('app')
        .controller('CheckInOutController', CheckInOutController);

    function CheckInOutController(UserService, PartnerService, ActivityService) {
        var vm = this;
        vm.showMenu = false;

        // Get current user and activity (if applicable)
        UserService.getCurrentUser().then(
            function success(resp) {
                vm.currentUser = resp.data;

                ActivityService.currentUserActivity(vm.currentUser._id).then (
                    function success(actResp) {
                        if (actResp.data != "null") {
                            vm.currentActivity = actResp.data;

                            if (vm.partners) {
                                vm.initCurrentActivity(vm.currentActivity);
                            }
                        } else {
                            vm.currentActivity = undefined;
                            vm.initCurrentActivity(vm.currentActivity);
                        }

                    }, function error() {
                        console.log('Error receiving activity');
                        vm.currentActivity = undefined;
                        vm.initCurrentActivity(vm.currentActivity);
                    }

                );
            },
            function failure() {
                console.log('Error receiving user');
                vm.currentUser = {};
            }
        );

        // Get all of the active partners
        PartnerService.getPartners().then(
            function success(resp) {
                vm.getActivePartners(resp.data);

                if (vm.currentActivity) {
                    vm.initCurrentActivity(vm.currentActivity);
                }
            },
            function failure() {
                console.log('Error receiving partners');
                vm.partners = [];
            }
        );

        // Initialize partner list
        function getActivePartners(partners) {
            vm.partners = [];

            for (var i = 0; i < partners.length; i++) {
                if (partners[i].is_active) {
                    vm.partners.push(partners[i]);
                }
            }
        }
        vm.getActivePartners = getActivePartners;

        // Initialize the map
        var defaultMapCenter = {lat: 42.360082, lng: -71.058880};
        var defaultMapZoom = 10;
        var map = new google.maps.Map(document.getElementById('map'), {});
        var marker = new google.maps.Marker({ map: map });

        // If there is currently an activity in process
        function initCurrentActivity(activity) {
            if (!!activity && activity.partner) {
                for (var i = 0; i < vm.partners.length; i++) {
                    if (vm.partners[i]._id.$oid === activity.partner.$id.$oid) {
                        vm.selectedPartner = vm.partners[i];
                        continue;
                    }
                }

                if (!!activity.location) {
                    vm.selectedLocation = vm.selectedPartner.locations[activity.location];
                    map.setCenter(vm.selectedLocation.location);
                    map.setZoom(17);
                    marker.setPosition(vm.selectedLocation.location);
                }

                if (!!activity.contact) {
                    vm.selectedContact = vm.selectedPartner.contacts[activity.contact];
                }

            } else {
                // Setting all of the elements to default
                partnerUnSelect();
            }
        }

        vm.initCurrentActivity = initCurrentActivity;

        // Determine the appropriate wording for the button
        function correctButton() {
            if (!vm.currentActivity) {
                return 'Check In';
            } else {
                return 'Check Out';
            }
        }
        vm.correctButton = correctButton;

        // Determine correct action for the button
        function checkInOrOut() {
            var location, contact;

            if (!vm.currentActivity) {
                vm.currentActivity = {
                    partner: vm.selectedPartner._id.$oid
                };

                if (vm.selectedLocation) {
                    location = vm.selectedLocation.id;
                    vm.currentActivity.location = location;
                }

                if (vm.selectedContact) {
                    contact = vm.selectedContact.id;
                    vm.currentActivity.contact = contact;
                }

                ActivityService.checkUserIn(vm.currentUser._id.$oid, vm.selectedPartner._id.$oid,
                                            location, contact);
            } else {
                vm.currentActivity = undefined;
                partnerUnSelect();

                ActivityService.checkUserOut(vm.currentUser._id.$oid);
            }
        }

        vm.checkInOrOut = checkInOrOut;

        // Functions needed for typeahead inputs
        // Partner Functions
        function onPartnerSelect(selectedItem) {
            vm.selectedPartner = selectedItem;
            vm.selectedLocation = undefined;
            vm.selectedContact = undefined;

            vm.locations = [];
            vm.contacts = [];

            for (var id in selectedItem.locations) {
                var currLocation = selectedItem.locations[id];
                currLocation.id = parseInt(id);

                if (currLocation.is_active) {
                    vm.locations.push(currLocation);
                }

            }

            for (var id in selectedItem.contacts) {
                var currContact = selectedItem.contacts[id];
                currContact.id = parseInt(id);

                if (currContact.is_active) {
                    vm.contacts.push(currContact);
                }
            }
        }

        function partnerUnSelect() {
            vm.selectedPartner = undefined;
            locationUnSelect();
            contactUnSelect();
        }

        // Setting Partner functions on controller
        vm.onPartnerSelect = onPartnerSelect;
        vm.partnerUnSelect = partnerUnSelect;

        // Location Functions
        function onLocationSelect(selectedItem) {
            vm.selectedLocation = selectedItem;
            map.setCenter(selectedItem.location);
            map.setZoom(17);
            marker.setPosition(selectedItem.location);
        }

        function locationUnSelect() {
            vm.selectedLocation = undefined;
            map.setCenter(defaultMapCenter);
            map.setZoom(defaultMapZoom);
            marker.setPosition(defaultMapCenter);
        }

        // Setting Location functions on controller
        vm.onLocationSelect = onLocationSelect;
        vm.locationUnSelect = locationUnSelect;

        // Contact Functions
        function onContactSelect(selectedItem) {
            vm.selectedContact = selectedItem;
        }

        function contactUnSelect() {
            vm.selectedContact = undefined;
        }

        // Setting Contact functions on controller
        vm.onContactSelect = onContactSelect;
        vm.contactUnSelect = contactUnSelect;

        vm.noop = function(){};

    }

})();