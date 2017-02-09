var app = angular.module('app', ['ionic', 'login']);
app.run(function ($ionicPlatform) {
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
//配置
    .config(function ($stateProvider, $urlRouterProvider, $httpProvider) {
        $stateProvider
        //登录
            .state('login', {//路由名称
                url: '/login',//路由url
                templateUrl: 'templates/login.html',//模板位置
                controller: 'loginCtrl'//模板对于的控制器名称，
            })
            //主页
            .state('index-login', {//路由名称
                url: '/index-login',//路由url
                templateUrl: 'templates/index-login.html',//模板位置
                controller: 'MyIndexLoginCtrl'//模板对于的控制器名称，
            });
        // 默认调转
        $urlRouterProvider.otherwise('/login');

        // $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    });
