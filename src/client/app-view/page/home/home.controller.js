(function () {
    'use strict';

    angular
        .module('app')
        .controller('HomeController', HomeController);

    function HomeController() {
        var vm = this;

        vm.showMenu = true;

        vm.user = 'Katherine';
        vm.allUsers = ['Katherine', 'Jonathon', 'Lawerence', 'Jenny'];

        vm.partners = [{name: 'Partner1'}, {name: 'PCommunity2'}, {name: 'Paul3'}];

        vm.noop = function(){};
    }

})();