define(['./module', 'THREE'], function (services, THREE) {
    'use strict';

    services.service('Renderer', ['World', 'Buffer', 'Scene', function(World, Buffer, Scene){
        var Renderer = function(){
            //setup some basic stuff
            this.timeStep = 1.0 / 60.0;
            this.velocityIterations = 8;
            this.positionIterations = 3;

            //add buffer & start it all up
            Scene.scene.add(Buffer.buffer);
            this.render();
        };

        Renderer.prototype = {
            constructor: Renderer,

            draw: function () {
                //draw rigid bodies
                for (var i = 0, max = World.bodies.length; i < max; i++) {
                    var body = World.bodies[i];
                    var maxFixtures = body.fixtures.length;
                    var transform = body.GetTransform();
                    for (var j = 0; j < maxFixtures; j++) {
                        var fixture = body.fixtures[j];
                        fixture.shape.draw(transform);
                    }
                }

                // draw particle systems
                for (i = 0, max = World.particleSystems.length; i < max; i++) {
                    Buffer.drawParticleSystem(World.particleSystems[i]);
                }

                Buffer.collapse();

                Buffer.buffer.geometry.attributes.position.needsUpdate = true;
                Buffer.buffer.geometry.attributes.color.needsUpdate = true;
            },

            render: function(){
                // bring objects into world
                Buffer.currentVertex = 0;
                this.Step();
                this.draw();

                Scene.render();

                requestAnimationFrame(this.render.bind(this));
            },

            Step: function(){
                World.Step(this.timeStep, this.velocityIterations, this.positionIterations);
            },

            reset: function(){
                if (World !== null) {
                    while (World.joints.length > 0) {
                        World.DestroyJoint(World.joints[0]);
                    }

                    while (World.bodies.length > 0) {
                        World.DestroyBody(World.bodies[0]);
                    }

                    while (World.particleSystems.length > 0) {
                        World.DestroyParticleSystem(World.particleSystems[0]);
                    }
                }

                Scene.reset();
            }
        };

        return new Renderer;
    }]);
});
