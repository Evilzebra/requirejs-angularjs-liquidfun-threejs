define(['./module'], function (controllers) {
    'use strict';

    return controllers.controller('MainCtrl', [
    '$scope', '$uibModal', 'Renderer', 'World', 'Scene',
    function ($scope, $uibModal, Renderer, World, Scene) {
        $scope.particleCount = 0;
        $scope.settings = {
            groupRadius: 0.5, //size of group spawned on click
            flags: [] //this is handled by another controller
        };

        //open modal function
        $scope.openManageFlags = function () {
            var modalInstance = $uibModal.open({
                templateUrl: 'partials/ManageFlags.html',
                controller: 'ManageFlagsCtrl',
                resolve: {
                    flags: function () {
                        return $scope.settings.flags;
                    }
                }
            });

            modalInstance.result.then(function(newFlags) {
                $scope.settings.flags = newFlags;
            });
        };

        // setup a particle system
        var psd = new b2ParticleSystemDef;
        psd.radius = 0.1; //size of particles
        $scope.particleSystem = World.CreateParticleSystem(psd);

        $scope.spawnSomeParticles = function(event){
            //create shape for particle group
            var circle = new b2CircleShape;
            circle.radius = $scope.settings.groupRadius;
            circle.position = Scene.getMouseCoords(event);

            //create particle group
            var particleGroupDef = new b2ParticleGroupDef;
            particleGroupDef.shape = circle;

            //set flags
            particleGroupDef.flags = 0;
            for(var i = 0, l = $scope.settings.flags.length; i < l; i++){
                if($scope.settings.flags[i].enabled) {
                    particleGroupDef.flags |= $scope.settings.flags[i].enum;
                }
            }

            //set to a random color and create group
            particleGroupDef.color.Set(Math.random()*255, Math.random()*255, Math.random()*255);
            var particleGroup = $scope.particleSystem.CreateParticleGroup(particleGroupDef);

            //update particle count
            $scope.particleCount = 0;
            for (var i = 0, max = World.particleSystems.length; i < max; i++) {
                $scope.particleCount += World.particleSystems[i].GetParticleCount();
            }
            $scope.$apply();
        };

        //set the container so we can actually see what is rendered
        //Scene.edges is not calculated until there is a container so that is why I am adding walls inside here
        $scope.setContainer = function($element) {
            Scene.setContainer($element); //this is crucial @TODO - is there a more elegant way to handle this?

            Scene.container.on('mouseup', $scope.spawnSomeParticles);

            //create some walls
            var outerWall = World.CreateBody(new b2BodyDef);
            //outerWall.restitution = 1.0;

            var outerWallFixture = new b2ChainShape,
                padding = 0.25;
            outerWallFixture.vertices.push(new b2Vec2(Scene.edges.left+padding,  Scene.edges.top-padding));
            outerWallFixture.vertices.push(new b2Vec2(Scene.edges.right-padding, Scene.edges.top-padding));
            outerWallFixture.vertices.push(new b2Vec2(Scene.edges.right-padding, Scene.edges.bottom+padding));
            outerWallFixture.vertices.push(new b2Vec2(Scene.edges.left+padding,  Scene.edges.bottom+padding));
            outerWallFixture.CreateLoop();
            outerWall.CreateFixtureFromShape(outerWallFixture, 0.0);
        };
    }]);
});
