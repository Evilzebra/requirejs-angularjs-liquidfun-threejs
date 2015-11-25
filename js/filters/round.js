define(['./module'], function (filters) {
    'use strict';

    return filters.filter('round', function() {
        return function(input) {
            return Math.round(input);
        };
    });
});
