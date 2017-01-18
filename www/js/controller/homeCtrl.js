/**
 * Created by Administrator on 2017/1/17.
 */

angular.module('home', [])
  .controller('homeCtrl', ['$scope', 'service', function ($scope, service) {
    $scope.views = {
      slideData: [
        {
          img: './img/01.png'
        },
        {
          img: './img/02.png'
        },
        {
          img: './img/03.png'
        },
      ],
      listData: [],//列表中的数据
      getList: function () {
        service.getList().then(function (res) {
            if (res.status === 200 && res.data) {
              $scope.views.listData = res.data.records;// 复制
            }
          }, function (res) {
            //接口调用失败以后
          });
      }
    };
    $scope.views.getList();//执行方法
  }]);

