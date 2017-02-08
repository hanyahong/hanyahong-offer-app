/**
 * Created by Administrator on 2017/1/17.
 */

angular.module('login', ['ionic'])
    .controller('loginCtrl', ['$scope', '$state','service', function ($scope,$state) {
        console.log(11111111);
        $scope.show = function () {
            $("#calt").css("display", "none");
        };
        $scope.hide = function () {
            $("#calt").css("display", "block");
        };
        $scope.delt = "我是帅哥"
        $scope.todoSomething = function ($event) {
            if ($event.keyCode == 13) {//回车
                login();
            }
        };
        $scope.goIndexLogin = function () {
          $state.go("index-login");
        };
    }])
    .controller('MyIndexLoginCtrl', ['$scope','$ionicHistory','service',function ($scope,$ionicHistory) {
        $scope.goBack = function () {
            $ionicHistory.goBack();
        };
        $scope.getList=function () {
                $http
        };

    }]);

