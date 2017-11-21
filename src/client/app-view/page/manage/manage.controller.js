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

        // Initialize view to partners
        vm.selectedTab = 'Community Partners';

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