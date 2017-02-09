/**
 * Created by Administrator on 2017/1/17.
 * 控制器
 */

angular.module('login', ['ionic'])
/**
 *登录控制器
 */
    .controller('loginCtrl', ['$scope', '$state', 'service','$ionicLoading', function ($scope, $state, service,$ionicLoading) {
        //页面显示
        $scope.show = function () {
            $("#calt").css("display", "none");
        };
        $scope.hide = function () {
            $("#calt").css("display", "block");
        };
        $scope.todoSomething = function ($event) {
            if ($event.keyCode == 13) {//回车
                login();
            }
        };
        $scope.loadingShow = function (str) {
            $ionicLoading.show({
                template: str,
                showBackdrop: false
            });
            $timeout(function () {
                $ionicLoading.hide();
            }, 1500);
        };
        //调转主页
        $scope.goIndex = function () {
            $state.go("index-login");
        };
        //用户登录
        $scope.userLoginCtr = function () {
            var data = {
                phone: $scope.user.phone,
                password: $scope.user.password
            };
            service.userLoginService(data)
                .success(function (data) {
                    if (data.status == "登录成功") {
                        $scope.goIndex();
                    } else if(data.status=="密码错误") {
                        $scope.loadingShow("密码错误");
                    }else if(data.status=="用户不存在"){
                        $scope.loadingShow("用户不存在");
                    }
                })
                .error(function () {

                })
        };
    }])
    /**
     *主页控制器
     */
    .controller('MyIndexLoginCtrl', ['$scope', '$ionicHistory', 'service', function ($scope, $ionicHistory) {
        $scope.goBack = function () {
            $ionicHistory.goBack();
        };
        $scope.getList = function () {
            $http
        };

    }]);

