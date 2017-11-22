(function () {
    'use strict';

    angular
        .module('app')
        .controller('CheckInOutController', CheckInOutController);

    function CheckInOutController(UserService, PartnerService, ActivityService) {
        var vm = this;
        vm.showMenu = false;

        // Get current user and activity (if applicable)
        vm.currentUser = UserService.getCurrentUser();
        vm.currentActivity = ActivityService.currentUserActivity(vm.currentUser.id);

        // Initialize partner list
        function getActivePartners() {
            var partners = PartnerService.getPartners();
            vm.partners = [];

            for (var i = 0; i < partners.length; i++) {
                if (partners[i].active) {
                    vm.partners.push(partners[i]);
                }
            }
        }
        vm.getActivePartners = getActivePartners;
        vm.getActivePartners();

        // Initialize the map
        var defaultMapCenter = {lat: 42.360082, lng: -71.058880};
        var defaultMapZoom = 10;
        var map = new google.maps.Map(document.getElementById('map'), {});
        var marker = new google.maps.Marker({ map: map });

        // If there is currently an activity in process
        function initCurrentActivity(activity) {
            if (!!activity) {
                for (var i = 0; i < vm.partners.length; i++) {
                    if (vm.partners[i].id === activity.partnerId) {
                        vm.selectedPartner = vm.partners[i];
                        continue;
                    }
                }

                if (!!activity.locationId) {
                    vm.selectedLocation = vm.selectedPartner.locations[activity.locationId];
                    map.setCenter(vm.selectedLocation.location);
                    map.setZoom(17);
                    marker.setPosition(vm.selectedLocation.location);
                }

                if (!!activity.contactId) {
                    vm.selectedContact = vm.selectedPartner.contacts[activity.contactId];
                }

            } else {
                // Setting all of the elements to default
                partnerUnSelect();
            }
        }

        vm.initCurrentActivity = initCurrentActivity;

        vm.initCurrentActivity(vm.currentActivity);

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
            if (!vm.currentActivity) {
                vm.currentActivity = {
                    partnerId: vm.selectedPartner.id,
                    locationId: vm.selectedLocation.id,
                    contactId: vm.selectedContact.id
                };

                ActivityService.checkUserIn(vm.currentUser.id, vm.selectedPartner.id,
                                            vm.selectedLocation.id, vm.selectedContact.id);
            } else {
                vm.currentActivity = undefined;
                partnerUnSelect();

                ActivityService.checkUserOut(vm.currentUser.id);
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

                if (currLocation.active) {
                    vm.locations.push(currLocation);
                }

            }

            for (var id in selectedItem.contacts) {
                var currContact = selectedItem.contacts[id];
                currContact.id = parseInt(id);

                if (currContact.active) {
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