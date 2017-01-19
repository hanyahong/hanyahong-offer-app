angular.module("app", ['ionic', 'app.controllers', 'app.services', 'app.directives'])
    .run(['$ionicPlatform', '$rootScope', '$location', '$ionicHistory', '$ionicPopup', '$data', '$ionicViewSwitcher',
        function ($ionicPlatform, $rootScope, $location, $ionicHistory, $ionicPopup, $data, $ionicViewSwitcher) {
            $ionicPlatform.ready(function ($rootScope) {
                if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                    cordova.plugins.Keyboard.disableScroll(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleLightContent();
                }
                // screen.lockOrientation('portrait');
            });
            // $rootScope.$on('$stateChangeSuccess',
            //     function (event, toState, toParams, fromState, fromParams) {
            //         // $ionicViewSwitcher.nextDirection("none");
            //     });
            /**
             * @brief: 返回键处理
             * @brief: 主页面显示退出提示框
             */
            $rootScope.isSend = false;
            $rootScope.isSave = false;
            /**
             * @brief: 删除空白
             */
            var deleteLastBlank = function () {
                for (var i = 0; i < $rootScope.quotation.offer.resourcetypes.length; i++) {
                    for (var j = 0; j < $rootScope.quotation.offer.resourcetypes[i].selectedresources.length; j++) {
                        if ($rootScope.quotation.offer.resourcetypes[i].selectedresources[j].simplename.length == 0) {
                            $rootScope.quotation.offer.resourcetypes[i].selectedresources.splice(j, 1);
                        }
                    }
                }
            };
            /**
             * @brief: 增加空白
             */
            var addBlank = function () {
                var obj = {
                    "name": "", /*资源名称*/
                    "simplename": "", /*资源简称*/
                    "amount": "", /*资源数量*/
                    "unit": "", /*资源单位*/
                    "days": "", /*资源天数*/
                    "unitprice": "", /*资源单价*/
                    "remarks": "", /*备注*/
                    "edit": true/*是否可以编辑*/
                };
                for (var i = 0; i < $rootScope.quotation.offer.resourcetypes.length; i++) {
                    var objCopy = angular.copy(obj);
                    var length = $rootScope.quotation.offer.resourcetypes[i].selectedresources.length;
                    if (length == 0 || $rootScope.quotation.offer.resourcetypes[i]
                            .selectedresources[length - 1].simplename.length != 0) {
                        $rootScope.quotation.offer.resourcetypes[i].selectedresources.push(objCopy);
                    }
                }
            };
            var trim = function (str) {
                return str.replace(/(^\s*)|(\s*$)/g, "");
            };
            /**
             * @brief: alert（警告） 对话框
             */
            var showAlert = function (content) {
                var alertPopup = $ionicPopup.alert({
                    title: '提示',
                    template: content
                });
            };
            /**
             * @brief: 验证字段
             */
            var verification = function () {
                if (trim($rootScope.quotation.name).length == 0) {
                    showAlert("项目名称不能为空");
                    return false;
                }
                if (trim($rootScope.quotation.offer.client.name).length == 0) {
                    showAlert("客户负责人不能为空");
                    return false;
                }
                if (trim($rootScope.quotation.project.location.address).length == 0) {
                    showAlert("进场地址不能为空");
                    return false;
                }
                for (var i = 0; i < $rootScope.quotation.offer.resourcetypes.length; i++) {
                    for (var j = 0; j < $rootScope.quotation.offer.resourcetypes[i].selectedresources.length; j++) {
                        if ($rootScope.quotation.offer.resourcetypes[i].selectedresources[j].amount.length == 0) {
                            showAlert("请在" + $rootScope.quotation.offer.resourcetypes[i].name + "分类下的第" + (j + 1) + "行输入有效的数量");
                            return false;
                        }
                        if ($rootScope.quotation.offer.resourcetypes[i].selectedresources[j].unit.length == 0) {
                            showAlert("请在" + $rootScope.quotation.offer.resourcetypes[i].name + "分类下的第" + (j + 1) + "行输入有效的单位");
                            return false;
                        }
                        if ($rootScope.quotation.offer.resourcetypes[i].selectedresources[j].days.length == 0) {
                            showAlert("请在" + $rootScope.quotation.offer.resourcetypes[i].name + "分类下的第" + (j + 1) + "行输入有效的天数");
                            return false;
                        }
                        if ($rootScope.quotation.offer.resourcetypes[i].selectedresources[j].unitprice.length == 0) {
                            showAlert("请在" + $rootScope.quotation.offer.resourcetypes[i].name + "分类下的第" + (j + 1) + "行输入有效的单价");
                            return false;
                        }
                    }
                }
                for (var i = 0; i < $rootScope.quotation.offer.resourcetypes.length; i++) {
                    if ($rootScope.quotation.offer.resourcetypes[i].selectedresources.length > 0) {
                        return true;
                    }
                    if (i == $rootScope.quotation.offer.resourcetypes.length - 1) {
                        showAlert("至少添加一种设备");
                        return false;
                    }
                }
                return true;
            };
            $ionicPlatform.registerBackButtonAction(function (e) {
                e.preventDefault();
                if ($location.path() == '/tab/offer'
                    || $location.path() == '/tab/project'
                    || $location.path() == '/tab/resource'
                    || $location.path() == '/tab/my'
                    || $location.path() == '/welcome'
                    || $location.path() == '/login'
                    || $location.path() == '/start-page'
                    || $location.path() == '/guide-page') {
                    ionic.Platform.exitApp();
                } else if ($location.path() == '/quotation') {
                    if ($rootScope.isSend) {
                        $rootScope.isSend = false;
                        return;
                    }
                    if ($(".calendar-mask").parent().hasClass('active')) {
                        $(".calendar-mask").parent().addClass('close');
                        setTimeout(function () {
                            $(".calendar-mask").parent().removeClass('active');
                            $(".calendar-mask").parent().removeClass('close');
                        }, 290);
                        document.getElementById("prepareplantime").blur();
                        document.getElementById("startplantime").blur();
                        document.getElementById("leaveplantime").blur();
                        return;
                    }
                    if (!$(".backgroundShowTime").hasClass('ng-hide')) {
                        $(".backgroundShowTime").addClass('ng-hide');
                        $(".time-selection").addClass('ng-hide');
                        return;
                    }
                    if ($rootScope.lastQuotation.name == $rootScope.quotation.name
                        && angular.toJson($rootScope.lastQuotation.offer.resourcetypes) == angular.toJson($rootScope.quotation.offer.resourcetypes)
                        && angular.toJson($rootScope.lastQuotation.offer.client) == angular.toJson($rootScope.quotation.offer.client)
                        && angular.toJson($rootScope.lastQuotation.project) == angular.toJson($rootScope.quotation.project)
                        && $rootScope.quotationImages.length == 0) {
                        $ionicHistory.goBack();
                        return;
                    }

                    $rootScope.hideDialog = function () {
                        popup.close();
                    };
                    var popup = $ionicPopup.show({
                        title: '提示',
                        template: '<i class="ion-close-circled bus" ng-click="hideDialog()"></i>',
                        subTitle: '<p style="font-size: 85px">是否保存修改?</p>',
                        scope: $rootScope,
                        buttons: [{
                            text: '取消',
                            onTap: function () {
                                $ionicHistory.goBack();
                            }
                        }, {
                            text: '确定',
                            onTap: function () {
                                deleteLastBlank();
                                if (!verification()) {
                                    addBlank();
                                    return;
                                }
                                if ($rootScope.quotation.oid == null) {
                                    $data.addQuotation($rootScope.quotation);
                                } else {
                                    $data.updateQuotation($rootScope.quotation);
                                }
                                $ionicHistory.goBack();
                            },
                            type: 'button-positive'
                        }]
                    });
                } else if ($location.path() == '/register') {
                    $ionicHistory.goBack(-2);
                } else {
                    // $rootScope.$viewHistory.backView.go();
                    $ionicHistory.goBack();
                }
                return false;
            }, 101);
        }])
    .factory('httpInterceptor', [ '$q', '$injector',function($q, $injector) {
        var httpInterceptor = {
            'responseError' : function(response) {
                if (response.status == 403) {
                    var rootScope = $injector.get('$rootScope');
                    rootScope.state.go("login");
                    alert("登录身份过期，请重新登录");
                    return $q.reject(response);
                } else if (response.status === 404) {
                    return $q.reject(response);
                }
            },
            'response' : function(response) {
                return response;
            }
        };
        return httpInterceptor;
    }])
    .config(function ($httpProvider, $stateProvider, $urlRouterProvider, $ionicConfigProvider) {
        $httpProvider.interceptors.push('httpInterceptor');
        function getPhoneType() {
            var pattern_phone = new RegExp("iPhone", "i");
            var pattern_android = new RegExp("android", "i");
            var userAgent = navigator.userAgent.toLowerCase();
            var isAndroid = pattern_android.test(userAgent);
            var isIphone = pattern_phone.test(userAgent);
            var phoneType = "phoneType";
            if (isAndroid) {
                var zh_cnIndex = userAgent.indexOf("-");
                var spaceIndex = userAgent.indexOf("build", zh_cnIndex + 4);
                var fullResult = userAgent.substring(zh_cnIndex, spaceIndex);
                phoneType = fullResult.split(";")[1];
            } else if (isIphone) {
                var wigth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
                if (wigth > 400) {
                    phoneType = "iPhone6 plus";
                } else if (wigth > 370) {
                    phoneType = "iphone6";
                } else if (wigth > 315) {
                    phoneType = "iphone5 or iphone5s";
                } else {
                    phoneType = "iphone 4s";
                }

            } else {
                phoneType = "PC";
            }
            return phoneType;
        }
        function getOS() {
            var browser = {
                versions: function () {
                    var u = navigator.userAgent,
                        app = navigator.appVersion;
                    return {
                        android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                        iPhone: u.indexOf('iPhone') > -1,
                        iPad: u.indexOf('iPad') > -1,
                        iPod: u.indexOf('iPod') > -1
                    };
                }(),
                language: (navigator.browserLanguage || navigator.language).toLowerCase()
            };
            if (browser.versions.iPhone) {
                return "iPhone";
            } else if (browser.versions.iPad) {
                return "iPad";
            } else if (browser.versions.iPod) {
                return "iPod";
            } else if (browser.versions.android) {
                return "android";
            } else {
                return "PC";
            }
        }

        $httpProvider.defaults.headers.common = {
            'version': '1.2.1',
            'phonemodel': getPhoneType(),
            'operatesystem': getOS()
        };
        $ionicConfigProvider.platform.ios.tabs.style('standard');
        $ionicConfigProvider.platform.ios.tabs.position('bottom');
        $ionicConfigProvider.platform.android.tabs.style('standard');
        $ionicConfigProvider.platform.android.tabs.position('standard');
        $ionicConfigProvider.platform.ios.navBar.alignTitle('center');
        $ionicConfigProvider.platform.android.navBar.alignTitle('left');
        $urlRouterProvider.otherwise('/start-page');
        $stateProvider
            .state('start-page', {
                url: '/start-page',
                templateUrl: 'templates/start-page.html',
                controller: 'StartCtrl'
            })
            .state('welcome', {
                url: '/welcome',
                templateUrl: 'templates/welcome.html',
                controller: 'WelcomeCtrl'
            })
            /**
             * @brief: 使用引导
             */
            .state('guide-page', {
                url: '/guide-page',
                templateUrl: 'templates/guide-page.html',
                controller: 'GuidePageCtrl'
            })
            .state('login', {
                url: '/login',
                templateUrl: 'templates/login.html',
                controller: 'LoginCtrl',
                cache: false
            })
            .state('verification', {
                url: '/verification',
                templateUrl: 'templates/verification.html',
                controller: 'VerificationCtrl',
                cache: false
            })
            .state('register', {
                url: '/register/:phone/:srt/:QQid',
                templateUrl: 'templates/register.html',
                controller: 'RegisterCtrl',
                cache: false,
                params: {
                    obj: null,
                    QQobj:null
                }
            })
            .state('forget-password-verification', {
                url: '/forget-password-verification',
                cache: false,
                templateUrl: 'templates/forget-password-verification.html',
                controller: 'ForgetPasswordVerificationCtrl'
            })
            .state('forget-password-reset', {
                url: '/forget-password-reset/:phone',
                cache: false,
                templateUrl: 'templates/forget-password-reset.html',
                controller: 'ForgetPasswordResetCtrl'
            })
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html'
            })
            .state('tab.offer', {
                url: '/offer',
                views: {
                    'tab-offer': {
                        templateUrl: 'templates/tab-offer.html',
                        controller: 'OfferCtrl'
                    }
                }
            })
            .state('tab.project', {
                url: '/project',
                views: {
                    'tab-project': {
                        templateUrl: 'templates/tab-project.html',
                        controller: 'ProjectCtrl'
                    }
                }

            })
            .state('tab.resource', {
                url: '/resource',
                views: {
                    'tab-resource': {
                        templateUrl: 'templates/tab-resource.html',
                        controller: 'ResourcesCtrl'
                    }
                }

            })
            .state('tab.my', {
                url: '/my',
                views: {
                    'tab-my': {
                        templateUrl: 'templates/tab-my.html',
                        controller: 'myCtrl'
                    }
                }

            })
            .state('tab-offer', {
                url: '/tab-offer',
                templateUrl: 'templates/tab-offer.html'
            })
            .state('quotation', {
                url: '/quotation',
                templateUrl: 'templates/quotation.html',
                controller: 'QuotationCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            .state('project-search', {
                url: '/project-search',
                templateUrl: 'templates/project-search.html',
                controller: 'ProjectSearchCtrl'
            })
            .state('contacts-search', {
                url: '/contacts-search',
                templateUrl: 'templates/contacts-search.html',
                controller: 'ContactsSearchCtrl'
            })
            .state('company-search', {
                url: '/company-search',
                templateUrl: 'templates/company-search.html',
                controller: 'CompanySearchCtrl'
            })
            .state('quotation-preview', {
                url: '/quotation-preview',
                templateUrl: 'templates/quotation-preview.html',
                controller: 'QuotationPreviewCtrl'
            })
            .state('quotation-images', {
                url: '/quotation-images',
                templateUrl: 'templates/quotation-images.html',
                controller: 'QuotationImagesCtrl'
            })
            .state('quotation-browse', {
                url: '/quotation-browse',
                templateUrl: 'templates/quotation-browse.html',
                controller: 'QuotationBrowseCtrl'
            })
            .state('user-information', {
                url: '/user-information/:oid',
                templateUrl: 'templates/user-information.html',
                controller: 'UserInformationCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 手机号验证
             */
            .state('Remove-binding', {
                url: '/Remove-binding/:phone',
                cache: false,
                templateUrl: 'templates/Remove-binding.html',
                controller: 'MyRemoveBindingCtrl'
            })
            /**
             * @brief: 修改手机号
             */
            .state('Modify-mobile', {
                url: '/Modify-mobile/:phone',
                cache: false,
                templateUrl: 'templates/Modify-mobile.html',
                controller: 'MyModifyMobileCtrl'
            })
            .state('field-search', {
                url: '/field-search',
                templateUrl: 'templates/field-search.html',
                controller: 'FieldSearchCtrl'
            })
            .state('max-images', {
                url: '/max-images/:index:oid',
                cache: false,
                templateUrl: 'templates/max-images.html',
                controller: 'MaxImagesCtrl',
                params: {
                    obj: null
                }
            })
            .state('max-images-Collection', {
                url: '/max-images-Collection/:index:oid',
                cache: false,
                templateUrl: 'templates/max-images-Collection.html',
                controller: 'MaxImagesCollectionCtrl',
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 我的
             */
            .state('my-set', {
                url: '/my-set',
                cache: false,
                templateUrl: 'templates/my-set.html',
                controller: 'MySetCtrl'
            })
            .state('my-cloud', {
                url: '/my-cloud',
                cache: false,
                templateUrl: 'templates/my-cloud.html',
                controller: 'MyCloudCtrl'
            })
            .state('my-help', {
                url: '/my-help',
                cache: false,
                templateUrl: 'templates/my-help.html',
                controller: 'MyHelpCtrl'
            })
            .state('my-novice', {
                url: '/my-novice',
                cache: false,
                templateUrl: 'templates/my-novice.html',
                controller: 'MyNoviceCtrl'
            })
            .state('my-company', {
                url: 'my-company',
                templateUrl: 'templates/my-company.html',
                controller: 'MyCompanyCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            .state('my-have-company', {
                url: 'my-have-company',
                templateUrl: 'templates/my-have-company.html',
                controller: 'MyHaveCompanyCtrl'
            })
            .state('my-invitation-member', {
                url: 'my-invitation-member/:oid/:useroid',
                templateUrl: 'templates/my-invitation-member.html',
                controller: 'MyInvitationMemberCtrl',
                params: {
                    creator: null
                }
            })
            .state('my-member', {
                url: 'my-member/:oid',
                templateUrl: 'templates/my-member.html',
                controller: 'MyMemberCtrl',
                params: {
                    obj: null
                }
            })
            .state('my-member-preview', {
                url: 'my-member-preview',
                templateUrl: 'templates/my-member-preview.html',
                controller: 'MyMemberPreviewCtrl',
                params: {
                    obj: null
                }
            })
            .state('my-contacts', {
                url: '/my-contacts',
                templateUrl: 'templates/my-contacts.html',
                controller: 'MyContactsCtrl'
            })
            .state('my-contacts-details', {
                url: '/my-contacts-details/:status',
                templateUrl: 'templates/my-contacts-details.html',
                controller: 'MyContactsDetailsCtrl',
                params: {
                    obj: null,
                    obt: null
                }
            })
            .state('my-news', {
                url: '/my-news',
                templateUrl: 'templates/my-news.html',
                controller: 'MyNewsCtrl',
                cache: false
            })
            .state('my-field-details', {
                url: '/my-field-details',
                templateUrl: 'templates/my-field-details.html',
                cache: false,
                controller: 'MyFieldDetailsCtrl',
                params: {
                    obj: null
                }
            })
            .state('my-room', {
                url: '/my-room/:index',
                templateUrl: 'templates/my-room.html',
                controller: 'MyRoomCtrl',
                params: {
                    obj: null
                }
            })
            .state('my-introduction', {
                url: '/my-introduction',
                cache: false,
                templateUrl: 'templates/my-introduction.html',
                controller: 'MyIntroductionCtrl'
            })
            .state('my-map', {
                url: '/my-map',
                cache: false,
                templateUrl: 'templates/my-map.html',
                controller: 'MyMapCtrl',
                params: {
                    obj: null
                }
            })
            .state('my-map-preview', {
                url: '/my-map-preview',
                cache: false,
                templateUrl: 'templates/my-map-preview.html',
                controller: 'MyMapPreviewCtrl',
                params: {
                    obj: null
                }
            })
            //意见反馈
            .state('my-feedback', {
                url: '/my-feedback',
                cache: false,
                templateUrl: 'templates/my-feedback.html',
                controller: 'MyFeedback'
            })
            .state('my-explanation', {
                url: '/my-explanation',
                cache: false,
                templateUrl: 'templates/my-explanation.html',
                controller: 'MyExplanationCtrl'
            })
            .state('my-use', {
                url: '/my-use',
                cache: false,
                templateUrl: 'templates/my-use.html',
                controller: 'MyUseCtrl'
            })
            /**
             * @brief: 项目要求页
             */
            .state('quotation-Requirement', {
                url: '/quotation-Requirement',
                cache: false,
                templateUrl: 'templates/quotation-Requirement.html',
                controller: 'MyQuotationRequirementCtrl'
            })
            /**
             * @brief: 用户名更改
             */
            .state('my-namechanged', {
                url: '/my-namechanged/:name',
                cache: false,
                templateUrl: 'templates/my-namechanged.html',
                controller: 'MyNameChangedCtrl'
            })
            /**
             * @brief: 修改用户名页面
             */
            .state('my-Modifyname', {
                url: '/my-Modifyname',
                cache: false,
                templateUrl: 'templates/my-Modifyname.html',
                controller: 'MyModifyNameCtrl'
            })
            /**
             * @brief: 我的模板
             */
            .state('my-template', {
                url: '/my-template',
                templateUrl: 'templates/my-template.html',
                controller: 'TemplateCtrl'
            })
            /**
             * @brief: 模板详情
             */
            .state('my-template-details', {
                url: '/my-template-details',
                templateUrl: 'templates/my-template-details.html',
                controller: 'TemplateDetailsCtrl'
            })
            /**
             * @brief: 模板预览
             */
            .state('my-template-preview', {
                url: '/my-template-preview',
                templateUrl: 'templates/my-template-preview.html',
                cache: false,
                controller: 'TemplatePreviewCtrl'

            })
            /**
             * @brief: 增加模板设备
             */
            .state('my-template-equipment', {
                url: '/my-template-equipment/:name',
                templateUrl: 'templates/my-template-equipment.html',
                controller: 'TemplateEquipmentCtrl'
            })
            /**
             * @brief: 设备搜索
             */
            .state('my-equipment-search', {
                url: '/my-equipment-search/:oid',
                templateUrl: 'templates/my-equipment-search.html',
                controller: 'MyEquipmentSearchCtrl'

            })
            /**
             * @brief: 设备增加
             */
            .state('my-equipment-add', {
                url: '/my-equipment-add/:oid',
                templateUrl: 'templates/my-equipment-add.html',
                controller: 'MyEquipmentAddCtrl'

            })
            /**
             * @brief: 我的设备
             */
            .state('my-equipment', {
                url: '/my-equipment',
                templateUrl: 'templates/my-equipment.html',
                controller: 'MyEquipmentCtrl'
            })
            /**
             * @brief: 我的设备选择
             */
            .state('my-equipment-choice', {
                url: '/my-equipment-choice/:oid:isname',
                templateUrl: 'templates/my-equipment-choice.html',
                controller: 'MyEquipmentChoiceCtrl',
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 报价单设备选择
             */
            .state('quotation-equipment', {
                url: '/quotation-equipment/:name',
                templateUrl: 'templates/quotation-equipment.html',
                controller: 'QuotationEquipmentCtrl'
            })
            /**
             * @brief: 设备详情页
             */
            .state('equipment', {
                url: '/equipment/:oid:type:isname',
                cache: false,
                templateUrl: 'templates/equipment.html',
                controller: 'EquipmentCtrl',
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 设备详情页
             */
            .state('equipment-preview', {
                url: '/equipment-preview/:oid',
                cache: false,
                templateUrl: 'templates/equipment-preview.html',
                controller: 'EquipmentPreviewCtrl'
            })
            /**
             * @brief: 设备分类
             */
            .state('my-equipment-classification', {
                url: '/my-equipment-classification',
                cache: false,
                templateUrl: 'templates/my-equipment-classification.html',
                controller: 'MyEquipmentClassification'
            })
            /**
             * @brief: 场地预览
             */
            .state('my-field-preview', {
                url: '/my-field-preview',
                cache: false,
                templateUrl: 'templates/my-field-preview.html',
                controller: 'MyFieldPreviewCtrl',
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 场地预览
             */
            .state('my-baidufield-preview', {
                url: '/my-baidufield-preview',
                cache: false,
                templateUrl: 'templates/my-baidufield-preview.html',
                controller: 'MyBaidufieldPreviewCtrl',
                params: {
                    obj: null
                }
            })    
            /**
             * @brief: 任务单预览
             */
            .state('task-list-preview', {
                url: '/task-list-preview',
                cache: false,
                templateUrl: 'templates/task-list-preview.html',
                controller: 'TaskFieldPreviewCtrl',
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 创建公司一级分类
             */
            .state('my-addCompany-list', {
                url: '/my-addCompany-list',
                templateUrl: 'templates/my-addCompany-list.html',
                controller: 'MyAddCompanyListCtrl',
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 公司客户联系人
             */
            .state('my-contacts-list', {
                url: '/my-contacts-list',
                templateUrl: 'templates/my-contacts-list.html',
                controller: 'MyContactsListCtrl',
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 创建公司账户
             */
            .state('my-company-account', {
                url: '/my-company-account/:oid',
                templateUrl: 'templates/my-company-account.html',
                controller: 'MyCompanyAccountCtrl',
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 微信绑定
             */
            .state('WeChatbinding', {
                url: '/WeChatbinding',
                templateUrl: 'templates/WeChatbinding.html',
                controller: 'MyWeChatbinDingCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            /**
             * @brief: QQ绑定
             */
            .state('Tencentbinding', {
                url: '/Tencentbinding/:utr',
                templateUrl: 'templates/Tencentbinding.html',
                controller: 'MyTenCenBindingCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 合同
             */
            .state('quotation-contract', {
                url: '/quotation-contract',
                templateUrl: 'templates/quotation-contract.html',
                controller: 'MyQuotationContractCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 询价单
             */
            .state('quotation-Inquirysheet', {
                url: '/quotation-Inquirysheet',
                templateUrl: 'templates/quotation-Inquirysheet.html',
                controller: 'MyQuotationInquirySheetCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 创建询价单
             */
            .state('quotation-Createinquirysheet', {
                url: '/quotation-Createinquirysheet',
                templateUrl: 'templates/quotation-Createinquirysheet.html',
                controller: 'MyQuotationCreateInquirySheetCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
            /**
             * @brief: 询价单详情
             */
            .state('quotation-details', {
                url: '/quotation-details/:oid',
                templateUrl: 'templates/quotation-details.html',
                controller: 'MyQuotationDetailsCtrl',
                cache: false,
                params: {
                    obj: null
                }
            })
    });

