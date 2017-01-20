var ip = "http://localhost:8011";
myapp
  .factory('service', ['$http', function ($http) {
    var factory = {};
    factory.getList = function () {
      $http.get(ip + "/test")
        .success(function (response) {
          console.log(response);
        });
    };
    return factory;
  }]);
