angular.module('app.controllers', ['offer-controller', 'project-controller', 'my-controller', 'resources-controller'])
    .controller('StartCtrl', ['$scope', '$data', '$state', '$timeout', function ($scope, $data, $state, $timeout) {
        /**
         * @brief: 初始化数据
         */
        $scope.initData = function () {
            $data.getFicationall(0,null, 0, 99999)
                .success(function (data, status, headers, config) {
                    $data.setObject("p-equipment", data);
                });
        };
        /**
         * @brief: 初始化数据
         */
        $scope.init = function () {
            $timeout(function () {
                if ($data.getVar("INSTALLED_FIRST", "YES") != "YES") {
                    if ($data.getVar("LOGIN", "NO") == "YES") {
                        $state.go("tab.offer");
                    } else {
                        $state.go("login");
                    }

                } else {
                    $state.go("welcome");
                }
            }, 1000);
            $scope.initData();
        };
        /**
         * @brief: 初始化数据
         */
        $scope.init();
    }])
    .controller('WelcomeCtrl', ['$scope', '$data', '$state',
        function ($scope, $data, $state) {
            $scope.goIndex = function () {
                $data.setVar("INSTALLED_FIRST", "NO");
                $state.go("login");
            }
        }])
    .controller('GuidePageCtrl', ['$scope', '$data', '$state',
        function ($scope, $data, $state) {
            /**
             * @brief: 隐藏
             */
            $scope.hideImage=function (className) {
             $("."+className).hide();
            };
            /**
             * @brief: 跳转首页
             */
            $scope.goIndex = function () {
                $state.go("tab.offer");
            }
        }])
    .controller('LoginCtrl', ['$scope', '$rootScope','$data', '$state', '$ionicLoading', '$timeout','$ionicPopup','$cordovaFileOpener2',
        function ($scope,$rootScope, $data, $state, $ionicLoading, $timeout) {
            $scope.listImg = function () {
                /**
                 * @brief: 登录页删除input内容
                 */
                $scope.deletesContents = function () {
                    $scope.user.key = "";
                };
                $scope.deletePasswords = function () {
                    $scope.user.passwords = "";
                };
                /**
                 * @brief: 失去焦点 获取焦点
                 */
                $scope.LoseFocus = function () {
                    $("#Contents").hide();
                    $(".eight").css("display","block");
                };
                $scope.PasswordLoseFocus = function () {
                    $("#Passwords").hide();
                    $("#btr").css("marginTop", "40px");
                    $(".eight").css("display","block");
                };
                $scope.ObtainFocus = function () {
                    $("#Contents").show();
                    $(".eight").css("display","none");
                };
                $scope.PasswordFocus = function () {
                    $("#Passwords").show();
                    $("#btr").css("marginTop", "30px");
                    $(".eight").css("display","none");
                };
            };
            /**
             * @brief: 初始化
             */
            $scope.int = function () {
                $scope.listImg();
            };
            $scope.int();
            $scope.user = {
                "password": "",
                "key": $data.getObject("user").key
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
            $scope.verification = function () {
                var key = $("#login-phone").val();
                var password = $("#login-password").val();
                if (key == null || key.length == 0 || password == null || password.length == 0) {
                    $scope.loadingShow("手机号用户名或密码不能为空");
                    return;
                }
                $scope.user.key = key;
                $scope.user.password = password;
                $data.login($scope.user)
                    .success(function (data, status, headers, config) {
                        if (data.status == "用户不存在") {
                            $scope.loadingShow("用户不存在");
                        } else if (data.status == "密码错误") {
                            $scope.loadingShow("密码错误");
                        } else if (data.status == "未授权") {
                            $scope.loadingShow("未授权");
                        } else if (data.status == "登录成功") {
                            data.key = key;
                            $data.setObject("user", data);
                            $scope.login();
                        } else {
                            $scope.loadingShow("登录失败，请重试");
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $scope.loadingShow("网络连接失败");
                    });
            };
            $scope.login = function () {
                $data.setVar("LOGIN", "YES");
                $state.go("tab.offer");
            };
            $scope.goVerification = function () {
                $state.go("verification");
            };
            $scope.goForget = function () {
                $state.go("forget-password-verification");
            };
            /**
             * @brief: QQ登录
             */
            $scope.QQLogin=function () {
                var checkClientIsInstalled = 1;
                YCQQ.ssoLogin(function(args){
                    JSON.stringify(args);
                    $scope.Qobj = {
                        "access_token":args.access_token,
                        "qq_user_id":args.userid,
                        "timestemp":args.expires_time
                    };
                    $data.UploadQQobject($scope.Qobj)
                        .success(function (data, status, headers, config) {
                            if(data.status == 'login_successful'){
                                $data.setObject("user", data);
                                $data.setVar("LOGIN", "YES");
                                $state.go("tab.offer");
                                $scope.loadingShow("登录成功");
                            }else if(data.status == 'not_register'){
                                $state.go("Tencentbinding",{
                                    obj: $scope.Qobj,
                                    utr: args.userid
                                });
                            }else if(data.status == 'access_token_error'){
                                $scope.loadingShow("参数错误");
                            }else if(data.status == 'access_token_exception'){
                                $scope.loadingShow("网络连接失败");
                            }
                        })
                        .error(function (data, status, headers, config) {

                        });
                },function(failReason){
                    $scope.loadingShow("绑定失败");
                },checkClientIsInstalled);
            };
            /**
             * @brief: 微信登录
             */
            $scope.wechatLogin = function () {
                var scope = "snsapi_userinfo",
                    state = "_" + (+new Date());
                Wechat.auth(scope, state, function (response) {
                    JSON.stringify(response);
                    $scope.wechatobj = {
                        "code":response.code,
                        "state":response.state
                    };
                    $data.Uploadwechatobject($scope.wechatobj)
                        .success(function (data, status, headers, config) {
                            if(data.status == 'successful'){
                                $data.setObject("user", data);
                                $data.setVar("LOGIN", "YES");
                                $state.go("tab.offer");
                                $scope.loadingShow("登录成功");
                            }else if(data.status == 'not_register'){
                                $state.go("WeChatbinding",{
                                    obj:data
                                });
                            }else if(data.status == 'access_token_error'){
                                $scope.loadingShow("参数错误");
                            }
                        })
                        .error(function (data, status, headers, config) {

                        });
                }, function (reason) {
                    $scope.loadingShow("绑定失败");
                });
            };
        }])
    /**
     * @brief: 微信验证页面
     */
    .controller('MyWeChatbinDingCtrl', ['$scope', '$data', '$state','$stateParams', '$ionicHistory', '$ionicLoading', '$timeout',
        function ($scope, $data, $state,$stateParams, $ionicHistory,$ionicLoading, $timeout) {
            $scope.codes = $stateParams.obj;
            /**
             * @brief: 提示
             */
            $scope.loadingShow = function (str) {
                $ionicLoading.show({
                    template: str,
                    showBackdrop: false
                });
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1500);
            };
            /**
             * @brief: 返回
             */
            $scope.goBack = function () {
                $ionicHistory.goBack();
            };
            /**
             * @brief: 手机号码实时监听
             */
            $scope.chengephone = function(){
                $scope.Monitphone = $("#Monitorphone").val();
                if ($scope.Monitphone >= 11) {
                    $scope.Monitphone = $scope.Monitphone.slice(0, 11);
                    $("#Monitorphone").val($scope.Monitphone);
                }
                var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
                $scope.Monitphone = $("#Monitorphone").val();
                if(!reg.test($scope.Monitphone)){
                    return;
                }
                $data.getCode($scope.Monitphone)
                    .success(function (data, status, headers, config) {
                        if(data.info =="该电话已被注册"){
                            $(".Public").show();
                            $(".Publics").hide();
                            $("#passwordb").hide();
                            setTimeout(function(){
                                $scope.loadingShow("该手机号可以绑定");
                            },500);
                        }else if(data.info =="发送成功"){
                            $(".Publics").show();
                            $("#passwordb").show();
                            $("#passwordA").hide();
                            $("#passwordc").hide();
                            $scope.loadingShow("验证码发送成功");
                        }
                    })
                    .error(function (data, status, headers, config) {

                    });
            };
            /**
             * @brief: 手机号确后与密码提交后台微信二级验证
             */
            $scope.Uploadwechatsecondlevel = function(){
                var passwordB = $("#fication-code").val();
                var phone = $("#Monitorphone").val();
                $scope.watchobj = {
                    "access_token": $scope.codes.access_token,
                    "code":  $scope.codes.code,
                    "openid": $scope.codes.wechat_openid,
                    "password": passwordB,
                    "phone": phone
                };
                $data.Uploadwechatsecondlevel($scope.watchobj)
                    .success(function (data, status, headers, config) {
                        if(data.status == "successful"){
                            $data.setObject("user", data);
                            $data.setVar("LOGIN", "YES");
                            $state.go("tab.offer");
                            $scope.loadingShow("登录成功");
                        }else if(data.status == "binding_error"){
                            $scope.loadingShow("参数错误");
                            $scope.goBack();
                        }else if(data.status == "password_error"){
                            $scope.loadingShow("密码错误");
                        }else if(data.status == "register_error"){
                            $scope.loadingShow("绑定失败");
                            $scope.goBack();
                        }else if(data.status == "binding_exception"){
                            $scope.loadingShow("网络连接失败");
                            $scope.goBack();
                        }
                    })
                    .error(function (data, status, headers, config) {

                    });
            };
            /**
             * @brief: 验证手机和验证码
             */
            $scope.Verifyphone = function(){
                var phone = $("#Monitorphone").val();
                var phonecode = $("#VerificationCode").val();
                $scope.verifobj = {
                    "code": phonecode,
                    "phone": phone
                };
                $data.verification($scope.verifobj)
                    .success(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        if (data.status == "验证成功") {
                            $state.go("register",{
                                phone:$scope.verifobj.phone,
                                obj:$scope.codes,
                                srt:'2'
                            });
                        } else {
                            $scope.loadingShow("验证码错误");
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        $scope.loadingShow("网络连接失败");
                    });
            };
        }])
    /**
     * @brief: QQ验证页面
     */
    .controller('MyTenCenBindingCtrl', ['$scope', '$data', '$state','$stateParams', '$ionicHistory', '$ionicLoading', '$timeout',
        function ($scope, $data, $state,$stateParams, $ionicHistory,$ionicLoading, $timeout) {
            $scope.codes = $stateParams.obj;
            $scope.QQuid = $stateParams.utr;
            /**
             * @brief: 提示
             */
            $scope.loadingShow = function (str) {
                $ionicLoading.show({
                    template: str,
                    showBackdrop: false
                });
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1500);
            };
            /**
             * @brief: 返回
             */
            $scope.goBack = function () {
                $ionicHistory.goBack();
            };
            /**
             * @brief: 手机号码实时监听
             */
            $scope.chengephone = function(){
                $scope.Monitphone = $("#Monitorphone").val();
                if ($scope.Monitphone >= 11) {
                    $scope.Monitphone = $scope.Monitphone.slice(0, 11);
                    $("#Monitorphone").val($scope.Monitphone);
                }
                var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
                $scope.Monitphone = $("#Monitorphone").val();
                if(!reg.test($scope.Monitphone)){
                    return;
                }
                $data.getCode($scope.Monitphone)
                    .success(function (data, status, headers, config) {
                        if(data.info =="该电话已被注册"){
                            $(".Public").show();
                            $(".Publics").hide();
                            $("#passwordb").hide();
                            setTimeout(function(){
                                $scope.loadingShow("该手机号可以绑定");
                            },500);
                        }else if(data.info =="发送成功"){
                            $(".Publics").show();
                            $("#passwordb").show();
                            $("#passwordA").hide();
                            $("#passwordc").hide();
                            $scope.loadingShow("验证码发送成功");
                        }
                    })
                    .error(function (data, status, headers, config) {

                    });
            };
            /**
             * @brief: 手机号确后与密码提交后台二级验证
             */
            $scope.QQTwointerfaceobject = function(){
                var passwordB = $("#fication-code").val();
                var phone = $("#Monitorphone").val();
                $scope.QQobj = {
                    "access_token": $scope.codes.access_token,
                    "qq_user_id": $stateParams.utr,
                    "password": passwordB,
                    "phone": phone
                };
                $data.QQTwointerfaceobject($scope.QQobj)
                    .success(function (data, status, headers, config) {
                        if(data.status == "successful"){
                            $data.setObject("user", data);
                            $data.setVar("LOGIN", "YES");
                            $state.go("tab.offer");
                            $scope.loadingShow("登录成功");
                        }else if(data.status == "binding_error"){
                            $scope.loadingShow("参数错误");
                            $scope.goBack();
                        }else if(data.status == "password_error"){
                            $scope.loadingShow("密码错误");
                        }else if(data.status == "register_error"){
                            $scope.loadingShow("绑定失败");
                            $scope.goBack();
                        }else if(data.status == "binding_exception"){
                            $scope.loadingShow("网络连接失败");
                            $scope.goBack();
                        }
                    })
                    .error(function (data, status, headers, config) {

                    });
            };
            /**
             * @brief: 验证手机和验证码
             */
            $scope.Verifyphones = function(){
                var phone = $("#Monitorphone").val();
                var phonecode = $("#VerificationCode").val();
                $scope.verifobj = {
                    "code": phonecode,
                    "phone": phone
                };
                $data.verification($scope.verifobj)
                    .success(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        if (data.status == "验证成功") {
                            $state.go("register",{
                                phone:$scope.verifobj.phone,
                                QQobj:$scope.codes,
                                srt:'3',
                                QQid:$scope.QQuid
                            });
                        } else {
                            $scope.loadingShow("验证码错误");
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        $scope.loadingShow("网络连接失败");
                    });
            };
        }])
    /**
     * @brief: 验证
     */
    .controller('VerificationCtrl', ['$scope', '$data', '$state', '$ionicHistory', '$interval', '$timeout', '$ionicLoading',
        function ($scope, $data, $state, $ionicHistory, $interval, $timeout, $ionicLoading) {
            $scope.paracont = "获取验证码";
            $scope.paraclass = "changeReSend";
            $scope.nextclass = "sextStep2";
            $scope.phone = "";
            $scope.p = "";
            var second = 60,
                timePromise = undefined;
            $scope.loadingShow = function (str) {
                $ionicLoading.show({
                    template: str,
                    showBackdrop: false
                });
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1500);
            };
            $scope.inputChange = function () {
                $scope.phone = $("#verification-phone").val();
                if ($scope.phone.length >= 11) {
                    $scope.phone = $scope.phone.slice(0, 11);
                    $("#verification-phone").val($scope.phone);
                }
            };
            $scope.getCode = function () {
                if ($scope.paracont != "获取验证码" && $scope.paracont != "重新获取") {
                    return;
                }
                var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
                $scope.phone = $("#verification-phone").val();
                if (!reg.test($scope.phone)) {
                    $scope.loadingShow("请输入正确的手机号");
                    return;
                }
                $scope.paracont = "(" + second + ")";
                $scope.paraclass = "reSend";
                $scope.nextclass = "sextStep";
                timePromise = $interval(function () {
                    if (second <= 0) {
                        $interval.cancel(timePromise);
                        timePromise = undefined;
                        second = 60;
                        $scope.paracont = "重新获取";
                        $scope.paraclass = "changeReSend";
                    } else {
                        $scope.paracont = "(" + second + ")";
                        $scope.paraclass = "reSend";
                        second--;
                    }
                }, 1000);
                $data.getCode($scope.phone)
                    .success(function (data, status, headers, config) {
                        if (data.info == "发送成功") {
                            $scope.loadingShow("发送成功");
                            $scope.getFocus();
                        } else if (data.info == "该电话已被注册") {
                            $scope.loadingShow("手机已被注册");
                            $interval.cancel(timePromise);
                            timePromise = undefined;
                            second = 60;
                            $scope.paracont = "重新获取";
                            $scope.paraclass = "changeReSend";
                            $scope.nextclass = "sextStep2";
                        } else if (data.info == "发送失败") {
                            $scope.loadingShow("发送失败");
                            $interval.cancel(timePromise);
                            timePromise = undefined;
                            second = 60;
                            $scope.paracont = "重新获取";
                            $scope.paraclass = "changeReSend";
                            $scope.nextclass = "sextStep2";
                        } else {

                        }
                    })
                    .error(function (data, status, headers, config) {
                        $scope.loadingShow("网络连接失败");
                        $interval.cancel(timePromise);
                        timePromise = undefined;
                        second = 60;
                        $scope.paracont = "重新获取";
                        $scope.paraclass = "changeReSend";
                        $scope.nextclass = "sextStep2";
                    });
            };
            //获取焦点
            $scope.getFocus = function () {
                $("#verification-code").focus();
            };

            $scope.verification = function () {
                if ($scope.paracont == "获取验证码" || $scope.paracont == "重新获取") {
                    $scope.nextclass = "sextStep2";
                    return;
                }
                var code = $("#verification-code").val();
                if (code == null || code.length == 0) {
                    $scope.loadingShow("验证码格式错误");
                    return;
                }
                $ionicLoading.show();
                var data = {
                    "code": code,
                    "phone": $scope.phone
                };
                $data.verification(data)
                    .success(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        if (data.status == "验证成功") {
                            $scope.goRegister();
                        } else {
                            $scope.loadingShow("验证码错误");
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        $scope.loadingShow("网络连接失败");
                    });
            };
            $scope.goRegister = function () {
                $state.go("register", {
                    phone: $scope.phone,
                    srt:'1'
                });
            };
            $scope.goBack = function () {
                $ionicHistory.goBack();
            };
        }])
    /**
     * @brief: 注册成功
     */
    .controller('RegisterCtrl', ['$scope', '$data', '$state', '$ionicHistory', '$stateParams', '$ionicLoading', '$timeout',
        function ($scope, $data, $state, $ionicHistory, $stateParams, $ionicLoading, $timeout) {
            $scope.phone = $stateParams.phone;
            $scope.objs = $stateParams.obj;
            $scope.srt = $stateParams.srt;
            $scope.QQobj = $stateParams.QQobj;
            $scope.loadingShow = function (str) {
                $ionicLoading.show({
                    template: str,
                    showBackdrop: false
                });
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1500);
            };
            $scope.register = function (user) {
                $data.register(user)
                    .success(function (data, status, headers, config) {
                        $scope.loadingShow("注册成功，正在登陆...");
                        data.key = user.phone;
                        $data.setObject("user", data);
                        $scope.goGuide();
                    })
                    .error(function (data, status, headers, config) {
                        $scope.loadingShow("网络连接失败");
                    });
            };
            /**
             * @brief: 手机注册
             */
            $scope.verification = function () {
                var passwordP = $("#register-password-1").val();
                var passwordB = $("#register-password-2").val();
                var username = $("#username").val();
                var emails = $("#emails").val();
                if (passwordP == null || passwordB.length == 0 || passwordB == null || passwordB.length == 0) {
                    $scope.loadingShow("密码不能为空");
                    return;
                }
                if (passwordP != passwordB) {
                    $scope.loadingShow("密码不一致");
                    return;
                }
                // var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                // if (!reg.test(passwordP)) {
                //     $scope.loadingShow("密码格式不正确");
                //     return;
                // }
                var data = {
                    "password": passwordP,
                    "phone": $scope.phone,
                    "username": username,
                    "email": emails
                };
                $scope.register(data);
            };
            /**
             * @brief: 微信注册绑定验证
             */
            $scope.verificationS = function () {
                var passwordPP = $("#register-password-11").val();
                var passwordBB = $("#register-password-22").val();
                var username = $("#username").val();
                if (passwordPP == null || passwordBB.length == 0 || passwordPP == null || passwordBB.length == 0) {
                    $scope.loadingShow("密码不能为空");
                    return;
                }
                if (passwordPP != passwordBB) {
                    $scope.loadingShow("密码不一致");
                    return;
                }
                $scope.Uploadwechatsecondlevel();
            };
            /**
             * @brief: 手机号确后与密码提交后台微信二级验证
             */
            $scope.Uploadwechatsecondlevel = function(){
                var passwordPP = $("#register-password-11").val();
                $scope.watchobj = {
                    "access_token": $scope.objs.access_token,
                    "code":  $scope.objs.code,
                    "openid": $scope.objs.wechat_openid,
                    "password": passwordPP,
                    "phone": $scope.phone
                };
                $data.Uploadwechatsecondlevel($scope.watchobj)
                    .success(function (data, status, headers, config) {
                        if(data.status == "successful"){
                            $scope.loadingShow("注册成功，正在登陆...");
                            $data.setObject("user", data);
                            $data.setVar("LOGIN", "YES");
                            $state.go("tab.offer");
                            $scope.goGuide();
                        }else if(data.status == "binding_error"){
                        }else if(data.status == "password_error"){
                        }else if(data.status == "register_error"){
                        }else if(data.status == "binding_exception"){
                        }
                    })
                    .error(function (data, status, headers, config) {

                    });
            };
            /**
             * @brief: QQ注册绑定验证
             */
            $scope.QQverificationS = function () {
                var passwordCC = $("#register-password-111").val();
                var passwordDD = $("#register-password-221").val();
                if (passwordCC == null || passwordCC.length == 0 || passwordDD == null || passwordDD.length == 0) {
                    $scope.loadingShow("密码不能为空");
                    return;
                }
                if (passwordCC != passwordDD) {
                    $scope.loadingShow("密码不一致");
                    return;
                }
                $scope.QQTwointerfaceobject();
            };
            /**
             * @brief: QQ手机号确后与密码提交后台二级验证
             */
            $scope.QQTwointerfaceobject = function(){
                var passwordCC = $("#register-password-111").val();
                $scope.QQobj = {
                    "access_token": $scope.QQobj.access_token,
                    "qq_user_id": $stateParams.QQid,
                    "password": passwordCC,
                    "phone": $scope.phone
                };
                $data.QQTwointerfaceobject($scope.QQobj)
                    .success(function (data, status, headers, config) {
                        if(data.status == "successful"){
                            $data.setObject("user", data);
                            $data.setVar("LOGIN", "YES");
                            $state.go("tab.offer");
                            $scope.loadingShow("登录成功");
                        }else if(data.status == "binding_error"){
                            $scope.loadingShow("参数错误");
                            $scope.goBack();
                        }else if(data.status == "password_error"){
                            $scope.loadingShow("密码错误");
                        }else if(data.status == "register_error"){
                            $scope.loadingShow("绑定失败");
                            $scope.goBack();
                        }else if(data.status == "binding_exception"){
                            $scope.loadingShow("网络连接失败");
                            $scope.goBack();
                        }
                    })
                    .error(function (data, status, headers, config) {

                    });
            };
            $scope.content = "";
            $scope.$watch('content', function (newValue, oldValue, scope) {
                if ($scope.content.length > 2) {
                    $(".weak").css({
                        "background": "red"
                    })
                } else {
                    $(".weak").css({
                        "background": "#ddd"
                    })
                }
                if ($scope.content.length > 5) {
                    $(".secondary").css({
                        "background": "green"
                    })
                } else {
                    $(".secondary").css({
                        "background": "#ddd"
                    })
                }
                if ($scope.content.length > 11) {
                    $(".powerful").css({
                        "background": "blue"
                    })
                } else {
                    $(".powerful").css({
                        "background": "#ddd"
                    })
                }
            });
            $scope.goBack = function () {
                $ionicHistory.goBack(-2);
            };
            $scope.goGuide = function () {
                $data.setVar("LOGIN", "YES");
                $state.go("guide-page");
            };
        }])
    /**
     * @brief: 忘记密码
     */
    .controller('ForgetPasswordVerificationCtrl', ['$interval', '$scope', '$data', '$state', '$ionicHistory', '$stateParams', '$ionicLoading', '$timeout',
        function ($interval, $scope, $data, $state, $ionicHistory, $stateParams, $ionicLoading, $timeout) {
            $scope.paracont = "获取验证码";
            $scope.paraclass = "changeReSend";
            $scope.nextclass = "sextStep2";
            $scope.phone = "";
            $scope.p = "";
            var second = 60,
                timePromise = undefined;
            $scope.loadingShow = function (str) {
                $ionicLoading.show({
                    template: str,
                    showBackdrop: false
                });
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1500);
            };
            $scope.inputChange = function () {
                $scope.phone = $("#verification-phone").val();
                if ($scope.phone.length >= 11) {
                    $scope.phone = $scope.phone.slice(0, 11);
                    $("#verification-phone").val($scope.phone);
                }
            };
            $scope.getCode = function () {
                if ($scope.paracont != "获取验证码" && $scope.paracont != "重新获取") {
                    return;
                }
                var reg = /^0?1[3|4|5|8][0-9]\d{8}$/;
                $scope.phone = $("#verification-phone").val();
                if (!reg.test($scope.phone)) {
                    $scope.loadingShow("请输入正确的手机号");
                    return;
                }
                $scope.paracont = "(" + second + ")";
                $scope.paraclass = "reSend";
                $scope.nextclass = "sextStep";
                timePromise = $interval(function () {
                    if (second <= 0) {
                        $interval.cancel(timePromise);
                        timePromise = undefined;
                        second = 60;
                        $scope.paracont = "重新获取";
                        $scope.paraclass = "changeReSend";
                    } else {
                        $scope.paracont = "(" + second + ")";
                        $scope.paraclass = "reSend";
                        second--;
                    }
                }, 1000);
                $data.PasswordCode($scope.phone)
                    .success(function (data, status, headers, config) {
                        $scope.loadingShow("发送成功");
                        $scope.getFocus();
                    })
                    .error(function (data, status, headers, config) {
                        $scope.loadingShow("获取失败");
                        $interval.cancel(timePromise);
                        timePromise = undefined;
                        second = 60;
                        $scope.paracont = "重新获取";
                        $scope.paraclass = "changeReSend";
                        $scope.nextclass = "sextStep2";
                    });
            };
            //获取焦点
            $scope.getFocus = function () {
                $("#verification-code").focus();
            };

            $scope.verification = function () {
                if ($scope.paracont == "获取验证码" || $scope.paracont == "重新获取") {
                    $scope.nextclass = "sextStep2";
                    return;
                }
                var code = $("#verification-code").val();
                if (code == null || code.length == 0) {
                    $scope.loadingShow("验证码格式错误");
                    return;
                }
                $ionicLoading.show();
                var data = {
                    "code": code,
                    "phone": $scope.phone
                };
                $data.Password(data)
                    .success(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        if (data.status == "y") {
                            var user = {
                                token: ""
                            };
                            user.token = data.token;
                            $data.setObject("user", user);
                            $scope.goForgetPasswordReset();
                        } else {
                            $scope.loadingShow("验证码错误");
                        }
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        $scope.loadingShow("网络连接失败");
                    });
            };
            $scope.goForgetPasswordReset = function () {
                $state.go("forget-password-reset", {
                    phone: $scope.phone
                });
            };
            $scope.goBack = function () {
                $ionicHistory.goBack();
            };
        }])
    .controller('ForgetPasswordResetCtrl', ['$scope', '$data', '$state', '$ionicHistory', '$stateParams', '$ionicLoading', '$timeout',
        function ($scope, $data, $state, $ionicHistory, $stateParams, $ionicLoading, $timeout) {
            $scope.phone = $stateParams.phone;
            $scope.loadingShow = function (str) {
                $ionicLoading.show({
                    template: str,
                    showBackdrop: false
                });
                $timeout(function () {
                    $ionicLoading.hide();
                }, 1500);
            };
            $scope.resetPassword = function (data) {
                $data.resetPassword(data)
                    .success(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        $scope.loadingShow("设置成功,请用新密码登录");
                        $scope.goBack();
                    })
                    .error(function (data, status, headers, config) {
                        $ionicLoading.hide();
                        $scope.loadingShow("网络连接失败");
                    });
            };
            $scope.verification = function () {
                var passwordP = $("#register-password-1").val();
                var passwordB = $("#register-password-2").val();
                if (passwordP == null || passwordB.length == 0 || passwordB == null || passwordB.length == 0) {
                    $scope.loadingShow("密码不能为空");
                    return;
                }

                if (passwordP != passwordB) {
                    $scope.loadingShow("密码不一致");
                    return;
                }
                // var reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,16}$/;
                // if (!reg.test(passwordP)) {
                //     $scope.loadingShow("密码格式不正确");
                //     return;
                // }
                var data = {
                    "newpwd": passwordP,
                    "phone": $scope.phone
                };
                $scope.resetPassword(data);
            };
            $scope.content = "";
            $scope.$watch('content', function (newValue, oldValue, scope) {
                if ($scope.content.length > 2) {
                    $(".weak").css({
                        "background": "red"
                    })
                } else {
                    $(".weak").css({
                        "background": "#ddd"
                    })
                }
                if ($scope.content.length > 5) {
                    $(".secondary").css({
                        "background": "green"
                    })
                } else {
                    $(".secondary").css({
                        "background": "#ddd"
                    })
                }
                if ($scope.content.length > 11) {
                    $(".powerful").css({
                        "background": "blue"
                    })
                } else {
                    $(".powerful").css({
                        "background": "#ddd"
                    })
                }
            });


            $scope.goBack = function () {
                $ionicHistory.goBack(-2);
            };
        }]);
