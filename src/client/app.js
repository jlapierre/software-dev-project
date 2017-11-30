(function () {
    'use strict';

    angular
        .module('app', ['ngRoute'])
        .config(config)
        .run(run);

    config.$inject = ['$routeProvider', '$locationProvider'];
    function config($routeProvider, $locationProvider) {
        $routeProvider
            .when('/checkInOut', {
                controller: 'CheckInOutController',
                templateUrl: 'app-view/page/checkInOut/checkInOut.view.html',
                controllerAs: 'vm'
            })
            .when('/manage', {
                controller: 'ManageController',
                templateUrl: 'app-view/page/manage/manage.view.html',
                controllerAs: 'vm'
            })
            .when('/civicLog', {
                controller: 'CivicLogController',
                templateUrl: 'app-view/page/civicLog/civicLog.view.html',
                controllerAs: 'vm'
            })

            .otherwise({ redirectTo: '/checkInOut' });
    }

    run.$inject = ['$rootScope', '$location', '$http'];
    function run($rootScope, $location, $http) {}

})();