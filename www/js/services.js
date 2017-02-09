app.service('service', ['$http', function ($http) {
    var ip = "http://localhost:8011";
    var service = {};//预制空对象

    return {
        /**
         * 用户登录
         * @param data
         * @returns {*}
         */
        userLoginService: function (data) {
            return $http({
                    method: "POST",
                    url: ip + "/user/login",
                    data:data,
                }
            );
        },
        /**
         * 用户注册
         * @param data
         * @returns {*}
         */
        userRegisterService: function (data) {
            return $http({
                method: "POST",
                url: ip + "/user/register",
                data: data,
                timeout: 6000
            });
        }
    }
        ;
}]);
