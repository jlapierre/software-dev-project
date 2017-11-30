(function () {
    'use strict';

    angular
        .module('app')
        .controller('CivicLogController', CivicLogController);

    function CivicLogController(UserService, PartnerService, ActivityService, $scope) {
        var vm = this;
        vm.showMenu = false;

        // Get current user and partners
        vm.currentUser = UserService.getCurrentUser();
        vm.activityTypes = ActivityService.getActivityTypes();
        vm.civicCategories = ActivityService.getCivicCategories();

        vm.partners = PartnerService.getPartners();
        vm.activePartners = [];

        for (var i = 0; i < vm.partners.length; i++) {
            if (vm.partners[i].active) {
                vm.activePartners.push(vm.partners[i]);
            }
        }

        vm.name = vm.currentUser.firstName;

        // Setup the correct dates for all of the activities
        function setupActivities(user) {
            if (!!user.activities) {
                for (var i in user.activities) {
                    if (user.activities[i].type === 'Partner') {
                        user.activities[i].descriptionOptions = vm.activePartners;
                        user.activities[i].descriptionPlaceholder = 'Community Partner';
                        user.activities[i].descriptionNoOptions = 'No community partner matched your search';
                        user.activities[i].civicCategory = undefined;
                        user.activities[i].locations = [];
                        user.activities[i].contacts = [];

                        if (!!user.activities[i].partnerId) {
                            var partner;

                            if (!!vm.partners) {
                                for (var n = 0; n < vm.partners.length; n++) {
                                    if (vm.partners[n].id === user.activities[i].partnerId) {
                                        partner = vm.partners[n];
                                    }
                                }
                            }

                            if (!!partner) {
                                for (var id in partner.locations) {
                                    var currLocation = partner.locations[id];
                                    currLocation.id = parseInt(id);

                                    if (currLocation.active) {
                                        user.activities[i].locations.push(currLocation);
                                    }

                                }


                                for (var id in partner.contacts) {
                                    var currContact = partner.contacts[id];
                                    currContact.id = parseInt(id);

                                    if (currContact.active) {
                                        user.activities[i].contacts.push(currContact);
                                    }
                                }
                            }
                        }
                    } else {
                        user.activities[i].descriptionOptions = vm.civicCategories;
                        user.activities[i].descriptionPlaceholder = 'Civic Category';
                        user.activities[i].descriptionNoOptions = 'No civic category matched your search';
                        user.activities[i].partnerId = undefined;
                        user.activities[i].locationId = undefined;
                        user.activities[i].contactId = undefined;
                    }

                    if (user.activities[i].startTime) {
                        user.activities[i].startDate = new Date(user.activities[i].startTime);

                        if (user.activities[i].type != 'Partner') {
                            user.activities[i].endDate =  user.activities[i].startDate;
                        }
                    }

                    if (user.activities[i].endTime) {
                        if (user.activities[i].type === 'Partner') {
                            user.activities[i].endDate = new Date(user.activities[i].endTime);
                        }
                    }
                }
            }
        }
        vm.setupActivities = setupActivities;
        vm.setupActivities(vm.currentUser);

        // Get the name of the partner for the given id
        function getDescriptionName(activity) {
            if (activity.type === 'Partner') {
                if (!!vm.partners) {
                    for (var i = 0; i < vm.partners.length; i++) {
                        if (vm.partners[i].id === activity.partnerId) {
                            return vm.partners[i].name;
                        }
                    }
                }
            } else {
                return activity.civicCategory;
            }


            return '';
        }
        vm.getDescriptionName = getDescriptionName;

        // Get location name
        function getLocationName(activity) {
            if (activity.type === 'Partner') {
                var partner;
                if (!!vm.partners) {
                    for (var i = 0; i < vm.partners.length; i++) {
                        if (vm.partners[i].id === activity.partnerId) {
                            partner = vm.partners[i];
                        }
                    }
                }

                if (partner) {
                    for (var id in partner.locations) {
                        if (parseInt(id) === activity.locationId) {
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
            if (activity.type === 'Partner') {
                var partner;
                if (!!vm.partners) {
                    for (var i = 0; i < vm.partners.length; i++) {
                        if (vm.partners[i].id === activity.partnerId) {
                            partner = vm.partners[i];
                        }
                    }
                }

                if (partner) {
                    for (var id in partner.contacts) {
                        if (parseInt(id) === activity.contactId) {
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
            activity.type = selectedItem.name;

            if (activity.type === 'Partner') {
                activity.descriptionOptions = vm.activePartners;
                activity.descriptionPlaceholder = 'Community Partner';
                activity.descriptionNoOptions = 'No community partner matched your search';
                activity.civicCategory = undefined;
            } else {
                activity.descriptionOptions = vm.civicCategories;
                activity.descriptionPlaceholder = 'Civic Category';
                activity.descriptionNoOptions = 'No civic category matched your search';
                activity.partnerId = undefined;
                activity.locationId = undefined;
                activity.contactId = undefined;
            }
        }
        vm.selectActivityType = selectActivityType;

        // UnSelecting the type of activity
        function unSelectActivityType(activity) {
            activity.type = undefined;
            activity.descriptionOptions = [];
            activity.descriptionPlaceholder = 'Partner/Activity';
            activity.descriptionNoOptions = 'No activity type selected';
        }
        vm.unSelectActivityType = unSelectActivityType;

        // Select the description type and set up the next items
        function selectDescription(selectedItem, activity) {

            if (activity.type === 'Partner') {
                activity.partnerId = selectedItem.id;

                activity.locations = [];
                for (var id in selectedItem.locations) {
                    var currLocation = selectedItem.locations[id];
                    currLocation.id = parseInt(id);

                    if (currLocation.active) {
                        activity.locations.push(currLocation);
                    }

                }

                activity.contacts = [];
                for (var id in selectedItem.contacts) {
                    var currContact = selectedItem.contacts[id];
                    currContact.id = parseInt(id);

                    if (currContact.active) {
                        activity.contacts.push(currContact);
                    }
                }

            } else {
                activity.civicCategory = selectedItem.name;
            }
        }
        vm.selectDescription = selectDescription;

        // Select the description type and set up the next items
        function unSelectDescription(activity) {

            if (activity.type === 'Partner') {
                activity.partnerId = undefined;
                activity.locationId = undefined;
                activity.contactId = undefined;
                activity.locations = [];
                activity.contacts = [];
            } else {
                activity.civicCategory = undefined;
            }
        }
        vm.unSelectDescription = unSelectDescription;

        // Select the location
        function selectLocation(selectedItem, activity) {
            activity.locationId = selectedItem.id;
        }
        vm.selectLocation = selectLocation;

        // Un-select Location
        function unSelectLocation(activity) {
            activity.locationId = undefined;
        }
        vm.unSelectLocation = unSelectLocation;

        // Select the contact
        function selectContact(selectedItem, activity) {
            activity.contactId = selectedItem.id;
        }
        vm.selectContact = selectContact;

        // Un-select contact
        function unSelectContact(activity) {
            activity.contactId = undefined;
        }
        vm.unSelectContact = unSelectContact;

        // Update End Date if start date updated
        function updateEndDate(activity) {
            if (!!activity.type && activity.type != 'Partner') {
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