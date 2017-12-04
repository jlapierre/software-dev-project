(function () {
    'use strict';

    angular
        .module('app')
        .controller('CivicLogController', CivicLogController);

    function CivicLogController(UserService, PartnerService, ActivityService, $scope) {
        var vm = this;
        vm.showMenu = false;

        // Get current user and partners
        UserService.getCurrentUser().then(
            function success(resp) {
                vm.currentUser = resp.data;

                if (vm.partners) {
                    vm.setupActivities(vm.currentUser);
                }

            },
            function failure() {
                console.log('Error receiving user');
                vm.currentUser = {};
            }
        );

        vm.activityTypes = ActivityService.getActivityTypes();
        vm.civicCategories = ActivityService.getCivicCategories();

        PartnerService.getPartners().then(
            function success(resp) {
                vm.partners = resp.data;
                vm.getActivePartners();

                if (vm.currentUser) {
                    vm.setupActivities(vm.currentUser);
                }
            },
            function failure() {
                console.log('Error receiving partners');
                vm.partners = [];
            }
        );

        // Initialize partner list
        function getActivePartners() {
            vm.activePartners = [];

            for (var i = 0; i < vm.partners.length; i++) {
                if (vm.partners[i].is_active) {
                    vm.activePartners.push(vm.partners[i]);
                }
            }
        }
        vm.getActivePartners = getActivePartners;

        // Setup the correct dates for all of the activities
        function setupActivities(user) {
            if (!!user.activities) {
                for (var i in user.activities) {
                    if (user.activities[i].activity_type === 'Partner') {
                        user.activities[i].descriptionOptions = vm.activePartners;
                        user.activities[i].descriptionPlaceholder = 'Community Partner';
                        user.activities[i].descriptionNoOptions = 'No community partner matched your search';
                        user.activities[i].civic_category = undefined;
                        user.activities[i].locations = [];
                        user.activities[i].contacts = [];

                        if (!!user.activities[i].partner) {
                            var partner;

                            if (!!vm.partners && user.activities[i].partner) {
                                for (var n = 0; n < vm.partners.length; n++) {
                                    if (vm.partners[n]._id.$oid === user.activities[i].partner.$id.$oid) {
                                        partner = vm.partners[n];
                                    }
                                }
                            }

                            if (!!partner) {
                                for (var id in partner.locations) {
                                    var currLocation = partner.locations[id];
                                    currLocation.id = parseInt(id);

                                    if (currLocation.is_active) {
                                        user.activities[i].locations.push(currLocation);
                                    }

                                }


                                for (var id in partner.contacts) {
                                    var currContact = partner.contacts[id];
                                    currContact.id = parseInt(id);

                                    if (currContact.is_active) {
                                        user.activities[i].contacts.push(currContact);
                                    }
                                }
                            }
                        }
                    } else {
                        user.activities[i].descriptionOptions = vm.civicCategories;
                        user.activities[i].descriptionPlaceholder = 'Civic Category';
                        user.activities[i].descriptionNoOptions = 'No civic category matched your search';
                        user.activities[i].partner = undefined;
                        user.activities[i].location = undefined;
                        user.activities[i].contact = undefined;
                    }

                    if (user.activities[i].start_time) {
                        user.activities[i].startDate = new Date(user.activities[i].start_time.$date);

                        if (user.activities[i].activity_type != 'Partner') {
                            user.activities[i].endDate =  user.activities[i].startDate;
                        }
                    }

                    if (user.activities[i].end_time) {
                        if (user.activities[i].activity_type === 'Partner') {
                            user.activities[i].endDate = new Date(user.activities[i].end_time.$date);
                        }
                    }
                }
            }
        }
        vm.setupActivities = setupActivities;

        // Get the name of the partner for the given id
        function getDescriptionName(activity) {
            if (activity.activity_type === 'Partner') {
                if (!!vm.partners && activity.partner) {
                    for (var i = 0; i < vm.partners.length; i++) {
                        if (vm.partners[i]._id.$oid === activity.partner.$id.$oid) {
                            return vm.partners[i].name;
                        }
                    }
                }
            } else {
                return activity.civic_category;
            }


            return '';
        }
        vm.getDescriptionName = getDescriptionName;

        // Get location name
        function getLocationName(activity) {
            if (activity.activity_type === 'Partner') {
                var partner;
                if (!!vm.partners && activity.partner) {
                    for (var i = 0; i < vm.partners.length; i++) {
                        if (vm.partners[i]._id.$oid === activity.partner.$id.$oid) {
                            partner = vm.partners[i];
                        }
                    }
                }

                if (partner) {
                    for (var id in partner.locations) {
                        if (parseInt(id) === activity.location) {
                            return partner.locations[id].name;
                        }
                    }
                }
            }

            return '';
        }
        vm.getLocationName = getLocationName;

        // Get contact name
        function getContactName(activity) {
            if (activity.activity_type === 'Partner') {
                var partner;
                if (!!vm.partners && activity.partner) {
                    for (var i = 0; i < vm.partners.length; i++) {
                        if (vm.partners[i]._id.$oid === activity.partner.$id.$oid) {
                            partner = vm.partners[i];
                        }
                    }
                }

                if (partner) {
                    for (var id in partner.contacts) {
                        if (parseInt(id) === activity.contact) {
                            return partner.contacts[id].name;
                        }
                    }
                }
            }

            return '';
        }
        vm.getContactName = getContactName;

        // Selecting the type of activity
        function selectActivityType(selectedItem, activity) {
            activity.activity_type = selectedItem.name;

            if (activity.activity_type === 'Partner') {
                activity.descriptionOptions = vm.activePartners;
                activity.descriptionPlaceholder = 'Community Partner';
                activity.descriptionNoOptions = 'No community partner matched your search';
                activity.civic_category = undefined;
            } else {
                activity.descriptionOptions = vm.civicCategories;
                activity.descriptionPlaceholder = 'Civic Category';
                activity.descriptionNoOptions = 'No civic category matched your search';
                activity.partner = undefined;
                activity.location = undefined;
                activity.contact = undefined;
            }
        }
        vm.selectActivityType = selectActivityType;

        // UnSelecting the type of activity
        function unSelectActivityType(activity) {
            activity.activity_type = undefined;
            activity.descriptionOptions = [];
            activity.descriptionPlaceholder = 'Partner/Activity';
            activity.descriptionNoOptions = 'No activity type selected';
        }
        vm.unSelectActivityType = unSelectActivityType;

        // Select the description type and set up the next items
        function selectDescription(selectedItem, activity) {

            if (activity.activity_type === 'Partner') {
                activity.partner = {$id: {$oid: selectedItem._id.$oid}};

                activity.locations = [];
                for (var id in selectedItem.locations) {
                    var currLocation = selectedItem.locations[id];
                    currLocation.id = parseInt(id);

                    if (currLocation.is_active) {
                        activity.locations.push(currLocation);
                    }

                }

                activity.contacts = [];
                for (var id in selectedItem.contacts) {
                    var currContact = selectedItem.contacts[id];
                    currContact.id = parseInt(id);

                    if (currContact.is_active) {
                        activity.contacts.push(currContact);
                    }
                }

            } else {
                activity.civic_category = selectedItem.name;
            }
        }
        vm.selectDescription = selectDescription;

        // Select the description type and set up the next items
        function unSelectDescription(activity) {

            if (activity.activity_type === 'Partner') {
                activity.partner = undefined;
                activity.location = undefined;
                activity.contact = undefined;
                activity.locations = [];
                activity.contacts = [];
            } else {
                activity.civic_category = undefined;
            }
        }
        vm.unSelectDescription = unSelectDescription;

        // Select the location
        function selectLocation(selectedItem, activity) {
            activity.location = selectedItem.id;
        }
        vm.selectLocation = selectLocation;

        // Un-select Location
        function unSelectLocation(activity) {
            activity.location = undefined;
        }
        vm.unSelectLocation = unSelectLocation;

        // Select the contact
        function selectContact(selectedItem, activity) {
            activity.contact = selectedItem.id;
        }
        vm.selectContact = selectContact;

        // Un-select contact
        function unSelectContact(activity) {
            activity.contact = undefined;
        }
        vm.unSelectContact = unSelectContact;

        // Update End Date if start date updated
        function updateEndDate(activity) {
            if (!!activity.activity_type && activity.activity_type != 'Partner') {
                activity.endDate = activity.startDate;
            }
        }
        vm.updateEndDate = updateEndDate;

        function noop() {}
        vm.noop = noop;


        // Delete an activity
        function deleteActivity(id) {
            delete vm.currentUser.activities[id];
        }
        vm.deleteActivity = deleteActivity;

        // Add an activity
        function addActivity() {
            var activityId = 0;

            for (var id in vm.currentUser.activities) {
                var idInt = parseInt(id);

                if (activityId <= idInt) {
                    activityId = idInt + 1;
                }
            }

            vm.currentUser.activities[activityId] = {};
        }
        vm.addActivity = addActivity;

        // Clean all added parts of an activity and save the user
        function saveActivities() {
            for (var i in vm.currentUser.activities) {
                delete vm.currentUser.activities[i].descriptionOptions;
                delete vm.currentUser.activities[i].descriptionPlaceholder;
                delete vm.currentUser.activities[i].descriptionNoOptions;
                delete vm.currentUser.activities[i].locations;
                delete vm.currentUser.activities[i].contacts;
                delete vm.currentUser.activities[i].startDate;
                delete vm.currentUser.activities[i].endDate;
            }

            UserService.upsertUser(vm.currentUser);

            vm.setupActivities(vm.currentUser);
        }
        vm.saveActivities = saveActivities;

    }

})();