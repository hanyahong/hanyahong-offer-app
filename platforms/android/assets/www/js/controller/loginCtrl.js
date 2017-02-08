/**
 * Created by Administrator on 2017/1/17.
 */

angular.module('login', [])
    .controller('loginCtrl', ['$scope', 'service', function ($scope) {
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
        }
        $scope.next = function ($event) {
            if ($event.keyCode == 13) {//回车
                next();
            }
        }
    }]);

