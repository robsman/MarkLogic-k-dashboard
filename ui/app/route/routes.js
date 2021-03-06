(function () {
  'use strict';

  angular.module('app')
    .run(['loginService', function(loginService) {
      loginService.protectedRoutes(['root.search', 'root.create', 'root.profile']);
    }])
    .config(Config);

  Config.$inject = ['$stateProvider', '$urlMatcherFactoryProvider',
    '$urlRouterProvider', '$locationProvider'
  ];

  function Config(
    $stateProvider,
    $urlMatcherFactoryProvider,
    $urlRouterProvider,
    $locationProvider) {

    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    function valToFromString(val) {
      return val !== null ? val.toString() : val;
    }

    function regexpMatches(val) { // jshint validthis:true
      return this.pattern.test(val);
    }

    $urlMatcherFactoryProvider.type('path', {
      encode: valToFromString,
      decode: valToFromString,
      is: regexpMatches,
      pattern: /.+/
    });

    $stateProvider
      .state('root', {
        url: '',
        // abstract: true,
        templateUrl: 'app/root/root.html',
        controller: 'RootCtrl',
        controllerAs: 'ctrl',
        resolve: {
          user: function(userService) {
            return userService.getUser();
          }
        }
      })
      /*
      .state('root.landing', {
        url: '/',
        templateUrl: 'app/landing/landing.html',
        navLabel: {
          text: 'Home',
          area: 'dashboard',
          navClass: 'fa-home'
        }
      })*/
      .state('root.search', {
        url: '/',
        templateUrl: 'app/search/search.html',
        controller: 'SearchCtrl',
        controllerAs: 'ctrl',
        navLabel: {
          text: 'Search',
          area: 'dashboard',
          navClass: 'fa-search'
        }
      })
      /*
      .state('root.create', {
        url: '/create',
        templateUrl: 'app/create/create.html',
        controller: 'CreateCtrl',
        controllerAs: 'ctrl',
        navLabel: {
          text: 'Create',
          area: 'dashboard',
          navClass: 'fa-wpforms'
        },
        resolve: {
          stuff: function() {
            return null;
          }
        }
      })
      */
      .state('root.config', {
        url: '/config',
        templateUrl: 'app/config/config.html',
        controller: 'ConfigCtrl',
        controllerAs: 'ctrl',
        navLabel: {
          text: 'Config',
          area: 'dashboard',
          navClass: 'fa-gear'
        },
        resolve: {
          doc: function(MLRest) {
            var uri="/config/sources.json";
            return MLRest.getDocument(uri, { format: 'json' }).then(function(response) {
              return response;
            });
          }
        }
      })
      .state('root.view', {
        url: '/detail{uri:path}?q',
        params: {
          uri: {
            value: null
          },
          q: {
            array: true
          }
        },
        templateUrl: 'app/detail/detail.html',
        controller: 'DetailCtrl',
        controllerAs: 'ctrl',
        resolve: {
          doc: function(MLRest, $stateParams) {
            var uri = $stateParams.uri;
            return MLRest.getDocument(uri, { format: 'json' }).then(function(response) {
              return response;
            });
          }
        }
      })
      .state('root.profile', {
        url: '/profile',
        templateUrl: 'app/user/profile.html',
        controller: 'ProfileCtrl',
        controllerAs: 'ctrl'
      })
      .state('root.login', {
        url: '/login?state&params',
        templateUrl: 'app/login/login-full.html',
        controller: 'LoginFullCtrl',
        controllerAs: 'ctrl'
      });
  }
}());
