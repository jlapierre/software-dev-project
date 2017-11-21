(function () {
    'use strict';

    angular
        .module('app')
        .controller('ManageController', ManageController);

    function ManageController(UserService) {
        var vm = this;
        vm.showMenu = false;

        // Get current user
        vm.currentUser = UserService.getCurrentUser();

    }

})();