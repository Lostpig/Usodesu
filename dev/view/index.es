import models from '../models/models';
let remote = window.remote = require('remote');

window.log = (msg) => { console.log(msg); };
window.error = (msg) => { console.log(msg); };
window.warn = (msg) => { console.log(msg); };

window.models = models;
window.observer = require('./apiObserver');
window.App = require('../libs/app');

window.BASEPATH = remote.getGlobal('BASEPATH');
window.DISTPATH = remote.getGlobal('DISTPATH');
window.DEFAULTCONFIG = remote.getGlobal('DEFAULTCONFIG');
window.USERCONFIG = remote.getGlobal('USERCONFIG');

let usodesu = window.usodesu = angular
    .module('usodesu', [
        'ui.router',
        'ngRoute',
        require('./module/toolbar').name,
        require('./module/decks').name,
        require('./module/common').name,
        require('./module/addons').name
    ])
    .config(['$stateProvider',
        '$httpProvider',
        '$routeProvider',
        function($stateProvider, $httpProvider, $routeProvider) {
            $stateProvider
                .state('horizontal', {
                    url        : '/horizonal',
                    templateUrl: 'static/views/horizontal.html'
                })
                .state('vertical', {
                    url        : '/vertical',
                    templateUrl: 'static/views/vertical.html'
                });
        }
    ])
    .controller('appCtrl', ['$scope', '$state', '$window', function ($scope, $state, $window) {
        let self = this;
        self.layout = 'horizonal';
        self.showModuleName = 'Decks';
        self.setLayout = (layout) => {
            self.layout = layout;
            $state.transitionTo( $state.current, {}, { reload: false, inherit: true, notify: false } );
        };
        self.close = () => {
            $window.App.quit();
        };
        self.devtool = (event) => {
            $window.App.devTool(1);
        };
    }]);

require('./directive/ship');

angular.element().ready(() => {
    angular.bootstrap(document, ['usodesu']);
});

window.kanView = document.querySelector('#kanView');
