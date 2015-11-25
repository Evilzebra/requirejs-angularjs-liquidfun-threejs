define(['./module'], function (controllers) {
    'use strict';

    return controllers.controller('ManageFlagsCtrl',
    ['$scope', '$uibModalInstance', 'flags',
    function ($scope, $uibModalInstance, flags) {
        $scope.flags = flags.length ? flags : [
            {
                name: 'b2_water',
                doc: 'Water particle.',
                enum: b2_waterParticle,
                enabled: false
            },

            {
                name: 'b2_zombie',
                doc: 'Removed after next simulation step.',
                enum: b2_zombieParticle,
                enabled: false
            },

            {
                name: 'b2_wall',
                doc: 'Zero velocity.',
                enum: b2_wallParticle,
                enabled: false
            },

            {
                name: 'b2_spring',
                doc: 'With restitution from stretching.',
                enum: b2_springParticle,
                enabled: false
            },

            {
                name: 'b2_elastic',
                doc: 'With restitution from deformation.',
                enum: b2_elasticParticle,
                enabled: false
            },

            {
                name: 'b2_viscous',
                doc: 'With viscosity.',
                enum: b2_viscousParticle,
                enabled: false
            },

            {
                name: 'b2_powder',
                doc: 'Without isotropic pressure.',
                enum: b2_powderParticle,
                enabled: false
            },

            {
                name: 'b2_tensile',
                doc: 'With surface tension.',
                enum: b2_tensileParticle,
                enabled: false
            },

            {
                name: 'b2_colorMixing',
                doc: 'Mix color between contacting particles.',
                enum: b2_colorMixingParticle,
                enabled: false
            },

            {
                name: 'b2_barrier',
                doc: 'Prevents other particles from leaking.',
                enum: b2_barrierParticle,
                enabled: false
            },

            {
                name: 'b2_staticPressure',
                doc: 'Less compressibility.',
                enum: b2_staticPressureParticle,
                enabled: false
            },

            {
                name: 'b2_reactive',
                doc: 'Makes pairs or triads with other particles.',
                enum: b2_reactiveParticle,
                enabled: false
            },

            {
                name: 'b2_repulsive',
                doc: 'With high repulsive force.',
                enum: b2_repulsiveParticle,
                enabled: false
            }
        ];

        $scope.save = function() {
            $uibModalInstance.close($scope.flags);
        };

        $scope.cancel = function () {
            $uibModalInstance.dismiss('cancel');
        };
    }]);
});
