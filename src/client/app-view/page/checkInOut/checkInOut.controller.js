(function () {
    'use strict';

    angular
        .module('app')
        .controller('CheckInOutController', CheckInOutController);

    function CheckInOutController(PartnerService, ActivityService) {
        var vm = this;

        vm.showMenu = true;

        // Initialize partner list
        vm.partners = PartnerService.getPartners();

        // Initialize the map
        var defaultMapCenter = {lat: 42.360082, lng: -71.058880};
        var defaultMapZoom = 10;
        var map = new google.maps.Map(document.getElementById('map'), {});
        var marker = new google.maps.Marker({ map: map });

        // Set the button to begin with check in
        vm.checkInOutButton = "Check In";

        // Setting all of the elements to default
        partnerUnSelect();

        // Partner Functions
        function onPartnerSelect(selectedItem) {
            vm.selectedPartner = selectedItem;
            vm.locations = [];
            vm.contacts = [];

            for (var id in selectedItem.locations) {
                vm.locations.push(selectedItem.locations[id]);
            }

            for (var id in selectedItem.contacts) {
                vm.contacts.push(selectedItem.contacts[id]);
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

        vm.buttonClick = function(){
            if (!!vm.selectedPartner) {
                ActivityService.checkUserIn(userId, selectedPartner, selectedLocation, selectedContact);
            }
        }
    }

})();