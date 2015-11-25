define(['./module'], function (directives) {
    'use strict';

    //this directive grabs the container which will contain the THREE renderer
    //the attribute is currently just on the body tag for the sake of simplicity
    directives.directive("renderContainer", function () {
        return {
            restrict: "A",
            controller:function($scope, $element){
                $scope.setContainer($element);
            }
        };
    })
});
