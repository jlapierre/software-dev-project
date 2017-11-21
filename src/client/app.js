(function () {
    'use strict';

    angular
        .module('app', ['ngRoute'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/', {
                controller: 'CheckInOutController',
                templateUrl: 'app-view/page/checkInOut/checkInOut.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/' });
    }

    run.$inject = ['$rootScope', '$location', '$http'];
    function run($rootScope, $location, $http) {}

})();