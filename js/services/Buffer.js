/**
 * Created by Veezilrab on 11/17/2015.
 */
define(['./module', 'THREE'], function (services, THREE) {
    'use strict';

    services.service('Buffer', [function() {
        var inv255 = .003921569;
        var Buffer = function () {
            // init large buffer geometry
            this.maxVertices = 40000; //31000;

            var geometry = new THREE.BufferGeometry();
            geometry.dynamic = true;
            geometry.addAttribute('position', Float32Array, this.maxVertices, 3);
            geometry.addAttribute('color', Float32Array, this.maxVertices, 3);

            this.positions = geometry.attributes.position.array;
            this.colors = geometry.attributes.color.array;
            this.currentVertex = 0;

            var material = new THREE.LineBasicMaterial({vertexColors: true});
            this.buffer = new THREE.Line(geometry, material, THREE.LinePieces);

            this.circleVertices = [];
            this.circleResolution = 5;
            this.initCircleVertices(this.circleVertices, this.circleResolution);

            this.particleVertices = [];
            this.particleResolution = 3;
            this.initCircleVertices(this.particleVertices, this.particleResolution);
        };
        
        Buffer.prototype = {
            constructor: Buffer,

            collapse: function() {
                var i = this.currentVertex * 3;
                for (; i < this.maxVertices * 3; i++) {
                    this.positions[i] = 0;
                    this.colors[i] = 0;
                }
            },
    
            insertLine: function(x1, y1, x2, y2, r, g, b) {
                var i = this.currentVertex;
                var threeI = i * 3;
                this.positions[threeI] = x1;
                this.positions[threeI + 1] = y1;
                this.positions[threeI + 2] = 0;
                this.colors[threeI] = r;
                this.colors[threeI + 1] = g;
                this.colors[threeI + 2] = b;
    
                i++;
                threeI = i * 3;
                this.positions[threeI] = x2;
                this.positions[threeI + 1] = y2;
                this.positions[threeI + 2] = 0;
                this.colors[threeI] = r;
                this.colors[threeI + 1] = g;
                this.colors[threeI + 2] = b;
                this.currentVertex += 2;
            },
    
    // TODO remove one of the muls
            insertCircleVertices: function(transform, radius, x, y, r, g, b) {
                var vertices = this.circleVertices;
                for (var i = 0; i < this.circleResolution; i++) {
                    var i4 = i * 4;
                    var v1 = new b2Vec2(vertices[i4] * radius + x, vertices[i4 + 1] * radius + y);
                    var v2 = new b2Vec2(vertices[i4 + 2] * radius + x, vertices[i4 + 3] * radius + y);
    
                    b2Vec2.Mul(v1, transform, v1);
                    b2Vec2.Mul(v2, transform, v2);
    
                    this.insertLine(v1.x, v1.y, v2.x, v2.y, r, g, b);
                }
            },
    
            insertParticleVertices: function(radius, x, y, r, g, b) {
                var vertices = this.particleVertices;
                for (var i = 0; i < this.particleResolution; i++) {
                    var i4 = i * 4;
                    var x1 = vertices[i4] * radius + x;
                    var y1 = vertices[i4 + 1] * radius + y;
                    var x2 = vertices[i4 + 2] * radius + x;
                    var y2 = vertices[i4 + 3] * radius + y;
    
                    this.insertLine(x1, y1, x2, y2, r, g, b);
                }
            },
    
            initCircleVertices: function(v, resolution) {
                var size = 360 / resolution;
    
                for (var i = 0; i < resolution; i++) {
                    var s1 = (i * size) * Math.PI / 180;
                    var s2 = ((i + 1) * size) * Math.PI / 180;
                    v.push(Math.cos(s1));
                    v.push(Math.sin(s1));
                    v.push(Math.cos(s2));
                    v.push(Math.sin(s2));
                }
            },
    
            transformAndInsert: function(v1, v2, transform, r, g, b) {
                var transformedV1 = new b2Vec2(),
                    transformedV2 = new b2Vec2();
    
                b2Vec2.Mul(transformedV1, transform, v1);
                b2Vec2.Mul(transformedV2, transform, v2);
                this.insertLine(transformedV1.x, transformedV1.y,
                    transformedV2.x, transformedV2.y,
                    r, g, b);
            },
    
            transformVerticesAndInsert: function(vertices, transform, r, g, b) {
                var vertexCount = vertices.length;
    
                for (var i = 1; i < vertexCount; i++) {
                    this.transformAndInsert(vertices[i - 1], vertices[i], transform,
                        r, g, b);
                }
            },
    
            drawParticleSystem: function(system) {
                var particles = system.GetPositionBuffer();
                var color = system.GetColorBuffer();
                var maxParticles = particles.length,
                    transform = new b2Transform();
                transform.SetIdentity();
    
                for (var i = 0, c = 0; i < maxParticles; i += 2, c += 4) {
                    this.insertParticleVertices(system.radius, particles[i], particles[i + 1],
                        color[c] * inv255, color[c + 1] * inv255, color[c + 2] * inv255, 3);
                }
            }
        };

        var _Buffer = new Buffer;

        //update some b2*Shape.draw functions
        b2CircleShape.prototype.draw = function (transform) {
            var circlePosition = this.position,
                center = new b2Vec2(circlePosition.x, circlePosition.y);
            // b2Vec2.Mul(center, transform, center);
            _Buffer.insertCircleVertices(transform, this.radius, center.x, center.y, 0, 0, 0, 5);
        };

        b2ChainShape.prototype.draw = function (transform) {
            _Buffer.transformVerticesAndInsert(this.vertices, transform, 0, 0, 0);
        };

        b2EdgeShape.prototype.draw = function (transform) {
            _Buffer.transformAndInsert(this.vertex1, this.vertex2, transform, 0, 0, 0);
        };

        b2PolygonShape.prototype.draw = function (transform) {
            var zPosition = _Buffer.currentVertex * 3;

            _Buffer.transformVerticesAndInsert(this.vertices, transform, 0, 0, 0);

            // create a loop
            var positions = _Buffer.positions;
            var last = (_Buffer.renderer.currentVertex - 1) * 3;
            _Buffer.insertLine(positions[last], positions[last + 1],
                positions[zPosition], positions[zPosition + 1],
                0, 0, 0);
        };

        return _Buffer;
    }]);
});