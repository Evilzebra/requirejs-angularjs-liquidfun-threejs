define(['./module'], function (services) {
    'use strict';

    services.service('World', function () {
        var gravity = new b2Vec2(0, -10),
            world = new b2World(gravity);
        window.world = world; //liquidfun hack

        return world;
    });
});