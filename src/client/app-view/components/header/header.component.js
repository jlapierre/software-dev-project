(function () {
    'use strict';

    angular
        .module('app')
        .component('acesHeader', AcesHeader());

    function AcesHeader() {
        return {
            templateUrl: 'app-view/components/header/header.view.html'
        }
    }

})();