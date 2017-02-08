var myapp = angular.module('myapp', ['ionic', 'login']);
myapp
  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {

    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the tabs directive
      .state('login', {//路由名称
        url: '/login',//路由url
        templateUrl: 'templates/login.html',//模板位置
        controller: 'loginCtrl'//模板对于的控制器名称，
      })
      .state('index-login', {//路由名称
          url: '/index-login',//路由url
          templateUrl: 'templates/index-login.html',//模板位置
          controller: 'MyIndexLoginCtrl'//模板对于的控制器名称，
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');

  });
