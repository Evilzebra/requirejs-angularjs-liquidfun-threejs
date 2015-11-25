/**
 * Defines the main routes in the application.
 * The routes you see here will be anchors '#/' unless specifically configured otherwise.
 */

define(['./app'], function (app) {
    'use strict';
    return app.config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/Main', {
            templateUrl: 'views/MainCtrl.html',
            controller: 'MainCtrl'
        });

        /*$routeProvider.when('/view2', {
            templateUrl: 'views/your_view.html',
            controller: 'YourCtrl'
        });*/

        $routeProvider.otherwise({
            redirectTo: '/Main'
        });
    }]);
});