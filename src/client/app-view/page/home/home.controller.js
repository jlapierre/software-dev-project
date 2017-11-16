(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    function HomeController() {
        var vm = this;

        vm.user = 'Katherine';
        vm.allUsers = ['Katherine', 'Jonathon', 'Lawerence', 'Jenny'];
    }

})();