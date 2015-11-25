/**
 * configure RequireJS
 * prefer named modules to long paths, especially for version mgt
 * or 3rd party libraries
 */
require.config({
    paths: {
        'angular': './lib/angular/angular',
        'angular-route': './lib/angular-route/angular-route',
        'angular-bootstrap': './lib/angular-bootstrap/ui-bootstrap-tpls',

        'domReady': './lib/requirejs-domready/domReady',
        'THREE': './lib/three.js/build/three.min',
        'liquidfun': './lib/liquidfun/liquidfun'
    },

    /**
     * for libs that either do not support AMD out of the box, or
     * require some fine tuning to dependency mgt'
     */
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-route': {
            deps: ['angular']
        },
        'angular-bootstrap': {
            deps: ['angular']
        },

        'THREE':{
            exports: 'THREE'
        },
        'liquidfun': {
            deps: ['THREE']
        }
    },

    deps: [
        // kick start application... see bootstrap.js
        './bootstrap'
    ]
});