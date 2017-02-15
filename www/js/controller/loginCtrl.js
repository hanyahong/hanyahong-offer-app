/**
 * Created by Administrator on 2017/1/17.
 * 控制器
 */

angular.module('login', ['ionic'])
/**
 *登录控制器
 */
    .controller('loginCtrl', ['$scope', '$state', 'service', '$ionicLoading', '$timeout',
        function ($scope, $state, service, $ionicLoading, $timeout) {
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

            /**
             * 调转主页面
             */
            $scope.goMain = function () {
                $state.go("tab.main");
            };
            //提示框
            $scope.loadingShow = function (str) {
                $ionicLoading.show({
                    template: str,
                    showBackdrop: false
                });
                $timeout(function () {
                    $ionicLoading.hide();
                }, 700);
            };
            /**
             * 用户登录
             */
            $scope.userLoginCtr = function () {
                if ($scope.user.phone == "" || $scope.user.phone == null) {
                    $scope.loadingShow("电话不能为空");
                    console.log("dddddd");
                } else if ($scope.user.password == "" || $scope.user.password == null) {
                    $scope.loadingShow("密码不能为空");
                } else {
                    var data = {
                        phone: $scope.user.phone,
                        password: $scope.user.password
                    };
                    service.userLoginService(data)
                        .success(function (data) {
                            if (data.status == "登录成功") {
                                $scope.goMain("main");
                            } else if (data.status == "密码错误") {
                                $scope.loadingShow("密码错误");
                            } else if (data.status == "用户不存在") {
                                $scope.loadingShow("用户不存在");
                            }
                        })
                        .error(function () {
                            $scope.loadingShow("网络连接失败");
                        })
                }
            };

        }])
    .controller('mainCtrl', ['$scope', '$state', 'service', '$ionicLoading',
        function ($scope, $state, service, $ionicLoading) {

        }
    ]);


