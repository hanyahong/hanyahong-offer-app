angular.module('app.services', [])
    .service('$data', ['$rootScope', '$http', '$window', '$cordovaCamera', '$cordovaFileTransfer', '$cordovaImagePicker','$state',
        function ($rootScope, $http, $window, $cordovaCamera, $cordovaFileTransfer, $cordovaImagePicker,$state) {
            // var ip = "http://192.168.1.110:8094/";
            // $rootScope.ip ="http://192.168.1.110:8094/";
            var ip = "http://101.201.62.255:8094/";
            $rootScope.ip = "http://101.201.62.255:8094/";
            $rootScope.ossHost = "http://cloud-offer-user.oss-cn-beijing.aliyuncs.com";
            $rootScope.ossPlatformHost = "http://cloud-offer-p-manager.oss-cn-beijing.aliyuncs.com";
            $rootScope.analytics=AV.analytics({
                appId: "lHx8aI269D5iqjHs09FOMQWH-gzGzoHsz",
                appKey: "ur2sfSuyvNgvAhX8zGanE3K7",
                version: '1.2.1'
            });
            $rootScope.state=$state;
            var savedData = null;

            function set(data) {
                savedData = data;
            }

            function get() {
                return savedData;
            }

            function getObject(key) {
                return angular.fromJson($window.localStorage[key] || '{}');
            }

            return {
                log: function (string) {
                    //测试时用的输出
                    console.log(string);
                },
                login: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "public/login",
                        data: data,
                        timeout: 5000
                    });
                },
                getCode: function (phone) {
                    return $http({
                        method: "POST",
                        url: ip + "public/phoneVerfication/" + phone,
                        data: {},
                        timeout: 5000
                    });
                },
                verification: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "public/sendSMS",
                        data: data,
                        timeout: 5000
                    });
                },
                getForgetPasswordCode: function (phone) {
                    return $http({
                        method: "POST",
                        url: ip + "public/sendPhoneSMS/" + phone,
                        data: {},
                        timeout: 5000
                    });
                },
                //忘记密码页面
                PasswordCode: function (phone) {
                    return $http({
                        method: "POST",
                        url: ip + "public/forgetPwd/" + phone,
                        data: {},
                        timeout: 5000
                    });
                },
                //忘记密码页面
                Password: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "public/forgetPwd",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                //修改手机号
                ModifyMobile: function (data) {
                    return $http({
                        method: "PUT",
                        url: ip + "user/update/phone",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                resetPassword: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "user/forgetuserpwd",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                register: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "public/register",
                        data: data,
                        timeout: 5000
                    });
                },
                getUserInformation: function (oid) {
                    return $http({
                        method: "POST",
                        url: ip + "user/userinfo/" + oid,
                        data: {},
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateUserInformation: function (data) {
                    return $http({
                        method: "PUT",
                        url: ip + "user/userinfo",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateUserImage: function (filePath) {
                    var url = ip + "user/upload/" + getObject("user").oid;
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.upload(url, filePath, options);
                },
                /**
                 * @brief: 创建公司
                 */
                addCompany: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "company/",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 解散公司
                 */
                deleteCompany: function (oid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "company/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateCompany: function (oid, data) {
                    return $http({
                        method: "PUT",
                        url: ip + "company/" + oid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 查看公司信息
                 */
                getCompany: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "company/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 检测公司员工是否存在
                 */
                getCompanyMember: function (oid, data) {
                    return $http({
                        method: "POST",
                        url: ip + "company/" + oid + "/emp/invite",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 检测公司员工是否存在
                 */
                getCompanyMemberList: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "/company/" + oid + "/emp",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 邀请员工
                 */
                addMember: function (oid, data) {
                    return $http({
                        method: "POST",
                        url: ip + "company/" + oid + "/emp",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 邀请员工
                 */
                addMessage: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "message/",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 邀请员工
                 */
                updateMessage: function (oid, data) {
                    return $http({
                        method: "PUT",
                        url: ip + "message/" + oid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 修改权限
                 */
                updateMemberPermission: function (oid, data) {
                    return $http({
                        method: "PUT",
                        url: ip + "permission/" + oid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 获取权限
                 */
                getMemberPermission: function (uid) {
                    return $http({
                        method: "GET",
                        url: ip + "permission/" + uid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 删除员工
                 */
                deleteMember: function (empoid, oid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "company/" + empoid + "/emp/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 我的消息
                 */
                getMessageList: function () {
                    return $http({
                        method: "GET",
                        url: ip + "message/",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 检测版本更新
                 */
                getVersion: function () {
                    return $http({
                        method: "GET",
                        url: ip + "appVersion/android",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 版本更新
                 */
                updateApp: function (url, targetPath) {
                    var trustHosts = true;
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.download(url, targetPath, options, trustHosts);
                },
                /**
                 * @brief: 搜索自己的客户
                 */
                getSearchContactsList: function (content, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "client/search/" + content + "/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getContactsList: function () {
                    return $http({
                        method: "GET",
                        url: ip + "client/0/100",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getBasicsContactsList: function (page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "client/list/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getContacts: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "client/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                addContacts: function (data,cid) {
                    return $http({
                        method: "POST",
                        url: ip + "client/" + cid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                deleteContacts: function (oid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "client/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateContacts: function (data,cid,cmid) {
                    return $http({
                        method: "PUT",
                        url: ip + "client/"  + cid + "/" + cmid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateContact:function (data,cid) {
                    return $http({
                        method: "PUT",
                        url: ip + "client/"  + cid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateContactsImage: function (oid, filePath) {
                    var url = ip + "clientone/upload/" + oid;
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.upload(url, filePath, options);
                },
                /**
                 * @brief: 搜索自己的场地
                 */
                getSearchFieldList: function (content, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "location/searchAll/" + content + "/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 搜索百度地图
                 */
                getSearchBaiduFieldList: function (content) {
                    return $http({
                        method: "GET",
                        url: ip + "location/findName/" + content,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 增加百度搜索场地
                 */
                addSearchBaiduFieldList: function (content) {
                    return $http({
                        method: "POST",
                        url: ip + "location/insertName/" + content,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 得到平台场地
                 */
                getPlatformFieldList: function (page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "plocation/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 搜索平台的场地
                 */
                getSearchPlatformFieldList: function (content, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "plocation/search/" + content + "/" + page + "/" + size + "/",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getFieldList: function () {
                    return $http({
                        method: "GET",
                        url: ip + "location/0/100",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getBasicsFieldList: function (page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "location/list/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getField: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "location/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                addField: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "location",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateField: function (data) {
                    return $http({
                        method: "PUT",
                        url: ip + "location/" + data.oid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateFieldImages: function (oid, filePath) {
                    var url = ip + "location/" + oid + "/image";
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.upload(url, filePath, options);
                },
                updateRoomImages: function (fieldOid, roomOid, filePath) {
                    var url = ip + "location/house/" + fieldOid + "/image/" + roomOid;
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.upload(url, filePath, options);
                },
                updateCaseImages: function (fieldOid, roomOid, filePath) {
                    var url = ip + "location/house/" + fieldOid + "/case/" + roomOid;
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.upload(url, filePath, options);
                },
                deleteField: function (oid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "location/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 获取设备分类
                 */
                getEquipmentTypeList: function () {
                    return $http({
                        method: "GET",
                        url: ip + "resources/types",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 增加设备分类
                 */
                addEquipmentType: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "resources/type",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 删除设备分类
                 */
                deleteEquipmentType: function (oid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "resources/type/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 修改设备分类
                 */
                updateEquipmentType: function (data) {
                    return $http({
                        method: "PUT",
                        url: ip + "resources/type",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief:排序设备分类
                 */
                updateEquipmentTypeSort: function (data) {
                    return $http({
                        method: "PUT",
                        url: ip + "resources/sort",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 获取平台设备分类
                 */
                getPlatformEquipmentTypeList: function () {
                    return $http({
                        method: "GET",
                        url: ip + "presources/type",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 获取平台设备
                 */
                getPlatformEquipmentList: function (oid, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "presources/" + oid + "/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 搜索平台设备
                 */
                getSearchPlatformEquipmentList: function (content, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "presources/search/" + content + "/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 搜索自己的设备
                 */
                getSearchEquipmentList: function (content, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "resources/search/" + content + "/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 搜索平台和自己的设备
                 */
                getSearchAllEquipmentList: function (oid, content, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "resources/searchUnin/" + oid + "/" + content + "/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 从平台增加设备
                 */
                addPlatformEquipment: function (data, type) {
                    return $http({
                        method: "POST",
                        url: ip + "resources/pushpresource/" + type,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 设备排序
                 */
                updateEquipmentList: function (data, oid) {
                    return $http({
                        method: "POST",
                        url: ip + "resources/batchlist/" + oid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 所有设备
                 */
                getAllEquipmentList: function (page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "resources/list/null/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 安状态查询设备
                 */
                getEquipmentList: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "resources/classification/" + oid + "/0/100",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 独立设备列表
                 */
                getBasicsEquipmentList: function (oid, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "resources/list/" + oid + "/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 查看自己库的设备详情
                 */
                getEquipment: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "resources/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 查看平台库的设备详情
                 */
                getPlatformEquipment: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "presources/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 增加设备
                 */
                addEquipment: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "resources",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 更新设备
                 */
                updateEquipment: function (data) {
                    return $http({
                        method: "PUT",
                        url: ip + "resources/" + data.oid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateEquipmentImages: function (oid, filePath) {
                    var url = ip + "resources/image/" + oid;
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.upload(url, filePath, options);
                },
                deleteEquipment: function (oid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "resources/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                addQuotation: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "projectoffer",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 搜索报价单模糊查询
                 */
                getSearchQuotationList: function (content, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "projectoffer/search/" + content + "/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getQuotationList: function (status, page, size) {
                    if (status == null) {
                        return $http({
                            method: "GET",
                            url: ip + "projectoffer/" + page + "/" + size,
                            headers: {
                                'token': getObject("user").token
                            },
                            timeout: 5000
                        });
                    } else {
                        return $http({
                            method: "GET",
                            url: ip + "projectoffer/status/" + status + "/" + page + "/" + size,
                            headers: {
                                'token': getObject("user").token
                            },
                            timeout: 5000
                        });
                    }

                },
                getWorkplaceQuotationList: function (status, page, size) {
                    if (status == null) {
                        return $http({
                            method: "GET",
                            url: ip + "projectoffer/workplace/" + page + "/" + size,
                            headers: {
                                'token': getObject("user").token
                            },
                            timeout: 5000
                        });
                    } else {
                        return $http({
                            method: "GET",
                            url: ip + "projectoffer/status/" + status + "/" + page + "/" + size,
                            headers: {
                                'token': getObject("user").token
                            },
                            timeout: 5000
                        });
                    }

                },
                getQuotation: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "projectoffer/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 置顶
                 */
                updateQuotationTop: function (oid) {
                    return $http({
                        method: "PUT",
                        url: ip + "projectoffer/date/" + oid,
                        data: {},
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 用户名验证接口
                 */
                postUser: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "public/usernameVerfication",
                        headers: {
                            'token': getObject("user").token
                        },
                        data: data,
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 修改用户名接口
                 */
                putUser: function (data) {
                    return $http({
                        method: "PUT",
                        url: ip + "user/update/username",
                        headers: {
                            'token': getObject("user").token
                        },
                        data: data,
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 平台一级分类获取全部列表接口
                 */
                getFicationall: function (type, sectype, page, size) {
                    return $http({
                        method: "GET",
                        url: ip + "presources/" + type + "/" + sectype + "/" + page + "/" + size,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 得到默认报价单
                 */
                getDefaultQuotation: function () {
                    var quotation = {
                        "date":"",
                        "last_author_oid":"",
                        "last_update_time":"",
                        "name": "", /* 项目报价名  */
                        "oid": null, /* id  */
                        "uid": getObject("user").oid,
                        "gid": getObject("user").gid,
                        "offer": {
                            "status": 0, /*报价状态：0-报价中,1-执行中,2-完美,3-一般,4-放弃*/
                            /* 报价子文档  */
                            "client": {
                                /* 客户  */
                                "name": "", /*  客户姓名 */
                                "company": "", /*  客户公司 */
                                "oid": "", /*  客户ID */
                                "tel": "", /* 客户电话  */
                                "email": ""/*客户邮箱*/
                            },
                            "oid": null, /*  报价单ID  */
                            "resourcetypes": [
                                {
                                    "oid": "other",
                                    "name": "其他", /*  分类名称 */
                                    "selectedresources": []/*明细类别下的所选资源*/
                                },
                                {
                                    "oid": "personnel-transport",
                                    "name": "人员/运输", /*  分类名称 */
                                    "selectedresources": [
                                        {
                                            "name": "运输",
                                            "simplename": "运输",
                                            "amount": 0,
                                            "unit": "车次",
                                            "days": 1,
                                            "unitprice": 500,
                                            "remarks": "",
                                            "edit": true
                                        },
                                        {
                                            "name": "技术人员",
                                            "simplename": "技术人员",
                                            "amount": 0,
                                            "unit": "人",
                                            "days": 1,
                                            "unitprice": 200,
                                            "remarks": "",
                                            "edit": true
                                        }, {
                                            "name": "视频师",
                                            "simplename": "视频师",
                                            "amount": 0,
                                            "unit": "人",
                                            "days": 1,
                                            "unitprice": 200,
                                            "remarks": "",
                                            "edit": true
                                        }, {
                                            "name": "灯光师",
                                            "simplename": "灯光师",
                                            "amount": 0,
                                            "unit": "人",
                                            "days": 1,
                                            "unitprice": 200,
                                            "remarks": "",
                                            "edit": true
                                        }, {
                                            "name": "音响师",
                                            "simplename": "音响师",
                                            "amount": 0,
                                            "unit": "人",
                                            "days": 1,
                                            "unitprice": 200,
                                            "remarks": "",
                                            "edit": true
                                        }
                                    ]/*明细类别下的所选资源*/
                                }
                            ], /* 资源类型 {"name": "", "selectedresources": [] }*/
                            "tax": "", /*税率*/
                            "totalnotax": 0, /*报价总计，此值应该动态计算*/
                            "totaltax": 0, /*报价总价，此值应该动态计算*/
                            "discount": "", /*优惠价*/
                            "proportion": 0/*税金*/
                        },
                        "project": {
                            "images": [], /*效果图 {"imageoid": "string","name": "string","url": "string"}*/
                            "oid": null, /*   */
                            "requirement": "", /*项目要求*/
                            "startplantime": "", /* 预计开始时间  */
                            "prepareplantime": "", /*  预计进场时间 */
                            "leaveplantime": "", /*  预计离开时间 */
                            "location": {
                                "oid": null, /*   */
                                "name": "", /* 地址名称  */
                                "address": "", /* 进场地址  */
                                "address_pinyin": "",
                                "contacts": "",
                                "gid": getObject("user").gid,
                                "guide": "",
                                "guideFile": "",
                                "houses": [
                                    {
                                        "name": "", /* 会议室名称  */
                                        "oid": null, /*   */
                                        "caseimages": "",
                                        "images": "",
                                        "matching_equipment": "",
                                        "notes": "",
                                        "num_of_people": "",
                                        "switch_box": "",
                                    }
                                ],
                                "images": "",
                                "introduction": "",
                                "name_pinyin": "",
                                "pid": "",
                                "timeKey": "",
                                "uid": "",
                                "uname": ""
                            }
                        }
                    };
                    return quotation;
                },
                addQuotationTemplate: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "projectoffer/model/",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getQuotationTemplate: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "projectoffer/model/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getQuotationTemplateList: function () {
                    return $http({
                        method: "GET",
                        url: ip + "projectoffer/model/0/999999",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateQuotationTemplateStatus: function (data) {
                    return $http({
                        method: "PUT",
                        url: ip + "projectoffer/model/status/" + data.oid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                deleteQuotationTemplate: function (oid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "projectoffer/model/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getDefaultTemplateList: function () {
                    return $http({
                        method: "GET",
                        url: ip + "projectoffer/model/status/1/0/999999",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getExportTemplate: function () {
                    return $http({
                        method: "GET",
                        url: ip + "projectoffer/filemodel",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getExportTemplateList: function () {
                    return $http({
                        method: "GET",
                        url: ip + "projectoffer/filemodel/0/999999",
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                updateExportTemplate: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "projectoffer/filemodel/default",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 报价单预览
                 */
                getOnlinePreview: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "projectoffer/online",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 报价单下载
                 */
                downloadQuotation: function (oid, targetPath) {
                    var url = ip + "file/download/" + oid;
                    var trustHosts = true;
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.download(url, targetPath, options, trustHosts);
                },
                /**
                 * @brief: 发送报价单邮件
                 */
                sendEmail: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "projectoffer/email",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 任务单预览
                 */
                getTaskOnlinePreview: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "taskoffer/online",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 报价单下载
                 */
                downloadTask: function (oid, targetPath) {
                    var url = ip + "file/download/taskfile/" + oid;
                    var trustHosts = true;
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.download(url, targetPath, options, trustHosts);
                },
                updateQuotation: function (data) {
                    return $http({
                        method: "PUT",
                        url: ip + "projectoffer/" + data.oid,
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                uploadImages: function (images,ossParams) {
                    var url = $rootScope.ossHost;
                    var options = {};
                    options.params=ossParams;
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.upload(url, images.path, options);
                },
                updateQuotationStatus: function (status, data) {
                    data.status = status;
                    return $http({
                        method: "PUT",
                        url: ip + "projectoffer/" + data.oid + "/status",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                deleteImages: function (oid, ioid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "file/image/" + oid + "/" + ioid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                getImages: function (oid) {
                    return $http({
                        method: "GET",
                        url: ip + "file/image/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 创建公司客户列表
                 */
                postCompanyName: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "client/",
                        data: data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 获取公司一级列表
                 */
                getCompanyName: function () {
                    return $http({
                        method: "GET",
                        url: ip + "client/"  + 0 + "/" + 999,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },

                /**
                 * @brief: 删除公司客户列表
                 */
                Deleteompany: function (oid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "client/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 修改公司客户列表
                 */
                Modifycustomer: function (data,cid) {
                    return $http({
                        method: "PUT",
                        url: ip + "client/info/" +cid,
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 获取公司客户列表
                 */
                getcompanylist: function (cid) {
                    return $http({
                        method: "GET",
                        url: ip + "client/" + cid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 删除客户列表
                 */
                deletecompanylist: function (cid,cmid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "client/" + cid + "/" + cmid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 删除个人联系人
                 */
                DeletPersonaladdress: function (oid) {
                    return $http({
                        method: "DELETE",
                        url: ip + "clientone/" + oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 创建个人联系人
                 */
                postPersonaladdress: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "clientone/",
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 修改个人联系人
                 */
                putPersonaladdress: function (data,oid) {
                    return $http({
                        method: "PUT",
                        url: ip + "clientone/" + oid,
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 模糊搜索
                 */
                PrivateContacts: function (key) {
                    return $http({
                        method: "GET",
                        url: ip + "client/search/" + key +"/"+ 0 + "/" +999,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 公司二级上传头像
                 */
                Uploadtwopictures: function (cid,cmid, filePath) {
                    var url = ip + "client/upload/" + cid +"/"+ cmid;
                    var options = {};
                    options.headers = {
                        'token': getObject("user").token
                    };
                    return $cordovaFileTransfer.upload(url, filePath, options);
                },
                /**
                 * @brief: QQ登录验证接口
                 */
                UploadQQobject: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "public/login/verification/qq" ,
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: QQ登录二级登录
                 */
                QQTwointerfaceobject: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "public/login/qq" ,
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 微信登录验证接口
                 */
                Uploadwechatobject: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "public/login/verification/wechat" ,
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 微信登录二级验证
                 */
                Uploadwechatsecondlevel: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "public/login/wechat" ,
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 创建公司账户接口
                 */
                CompanyAccount: function (oid,data) {
                    return $http({
                        method: "POST",
                        url: ip + "company/" + oid + "/account/",
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 删除公司账户接口
                 */
                deleteCompanyAccount: function (oid,uid,data) {
                    return $http({
                        method: "DELETE",
                        url: ip + "company/" + oid + "/account/"+uid,
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 修改公司账户接口
                 */
                putCompanyAccount: function (oid,data) {
                    return $http({
                        method: "PUT",
                        url: ip + "company/" + oid + "/account/",
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 询价单发送接口
                 */
                PostquirySheet: function (data) {
                    return $http({
                        method: "POST",
                        url: ip + "inquiry",
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 询价单历史记录接口
                 */
                getInquiryRecord:function(poid){
                    return $http({
                        method: "GET",
                        url: ip + "inquiry/list/" + poid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 删除询价单历史记录
                 */
                deleteInquiryRecord:function(oid){
                    return $http({
                        method: "DELETE",
                        url: ip + "inquiry/"+ oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 查询询价单历史记录
                 */
                getInquirySheet:function(oid){
                    return $http({
                        method: "GET",
                        url: ip + "inquiry/"+ oid,
                        data:data,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 查询询价单单条记录
                 */
                getSingleQuery:function(oid){
                    return $http({
                        method: "GET",
                        url: ip + "inquiry/"+ oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 使用报价单接口
                 */
                postSheet:function(oid){
                    return $http({
                        method: "GET",
                        url: ip + "inquiry/use/"+oid,
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 模拟历史记录数据
                 */
                getRequestCompany: function () {
                    return $http({
                        method: "GET",
                        url: "json/data.json",
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 模拟单条数据
                 */
                getForeach: function () {
                    return $http({
                        method: "GET",
                        url: "json/data1.json",
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 相机
                 */
                Camera: function () {
                    var options = {
                        //相片质量0-100
                        quality: 50,
                        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                        destinationType: 1,
                        //从哪里选择图片：PHOTOLIBRARY=0，相机拍照CAMERA=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                        sourceType: 1,
                        //在选择之前允许修改截图
                        allowEdit: false,
                        //保存的图片格式： JPEG = 0, PNG = 1
                        encodingType: 0,
                        //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                        mediaType: 0,
                        //前后摄像头类型：Back= 0,Front-facing = 1
                        cameraDirection: 0,
                        //保存进手机相册
                        saveToPhotoAlbum: true
                    };
                    return $cordovaCamera.getPicture(options);
                },
                Picker: function () {
                    try{
                        var options = {
                            maximumImagesCount: 10,
                            width: 0,
                            height: 0,
                            quality: 50
                        };
                        return $cordovaImagePicker.getPictures(options);
                    }
                    catch (e){
                        $ionicPopup.alert({
                            title: '请在设置中开启权限',
                            template: content
                        });
                    }
                },
                setHeadPortrait: function (type) {
                    var options = {
                        //相片质量0-100
                        quality: 100,
                        //返回类型：DATA_URL= 0，返回作为 base64 編碼字串。 FILE_URI=1，返回影像档的 URI。NATIVE_URI=2，返回图像本机URI (例如，資產庫)
                        destinationType: 1,
                        //从哪里选择图片：PHOTOLIBRARY=0，相机拍照CAMERA=1，SAVEDPHOTOALBUM=2。0和1其实都是本地图库
                        sourceType: type,
                        //在选择之前允许修改截图
                        allowEdit: true,
                        //保存的图片格式： JPEG = 0, PNG = 1
                        encodingType: 0,
                        //照片宽度
                        targetWidth: 200,
                        //照片高度
                        targetHeight: 200,
                        //可选媒体类型：圖片=0，只允许选择图片將返回指定DestinationType的参数。 視頻格式=1，允许选择视频，最终返回 FILE_URI。ALLMEDIA= 2，允许所有媒体类型的选择。
                        mediaType: 0,
                        //前后摄像头类型：Back= 0,Front-facing = 1
                        cameraDirection: 0,
                        //保存进手机相册
                        saveToPhotoAlbum: true
                    };
                    return $cordovaCamera.getPicture(options);
                },
                /**
                 * @brief: 获取平台oss对象
                 */
                getOssPlatformObject: function (path) {
                    return $http({
                        method: "POST",
                        url: ip + "file/platform",
                        data: {},
                        headers: {
                            'token': getObject("user").token,
                            'path': path
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 获取oss对象
                 */
                getOssObject: function (path) {
                    return $http({
                        method: "POST",
                        url: ip + "file/oss",
                        data: {},
                        headers: {
                            'token': getObject("user").token,
                            'path': path
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 删除oss对象
                 */
                deleteOssObject: function (key) {
                    return $http({
                        method: "POST",
                        url: ip + "file/ossdelete",
                        data: [{"key": key}],
                        headers: {
                            'token': getObject("user").token
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 获取oss签名
                 */
                getOssSignature: function (uid) {
                    return $http({
                        method: "POST",
                        url: ip + "auth/policy",
                        data: {},
                        headers: {
                            'token': getObject("user").token,
                            'dir': uid + '/'
                        },
                        timeout: 5000
                    });
                },
                /**
                 * @brief: 获取用户头像oss上传路径
                 */
                getOssUserImageDir: function (uid) {
                    return uid + "/user/image/";
                },
                /**
                 * @brief: 获取用户头像oss上传路径
                 */
                getOssContactsImageDir: function (uid,oid) {
                    return uid + "/contacts/" + oid + "/image/";
                },
                /**
                 * @brief: 获取报价单效果图oss上传路径
                 */
                getOssQuotationImageDir: function (uid,oid) {
                    return uid + "/offer/" + oid + "/image/";
                },
                /**
                 * @brief: 获取报价项目要求oss上传路径
                 */
                getOssQuotationFileDir: function (uid,oid) {
                    return uid + "/offer/" + oid + "/file/";
                },
                /**
                 * @brief: 获取设备图片oss上传路径
                 */
                getOssEquipmentImageDir: function (uid,oid) {
                    return uid + "/equipment/" + oid + "/image/";
                },
                /**
                 * @brief: 获取场地图片oss上传路径
                 */
                getOssFieldImageDir: function (uid,oid) {
                    return uid + "/field/" + oid + "/image/";
                },
                /**
                 * @brief: 获取场地附件oss上传路径
                 */
                getOssFieldFileDir: function (uid,oid) {
                    return uid + "/field/" + oid + "/file/";
                },
                /**
                 * @brief: 获取会议室oss上传路径
                 */
                getOssHouseImageDir: function (uid,fieldOid, houseOid) {
                    return uid + "/field/" + fieldOid + "/house/" + houseOid + "/image/";
                },
                /**
                 * @brief: 获取随机数
                 */
                getRandomNumber: function () {
                    var chars = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
                    var res = "";
                    for (var i = 0; i < 8; i++) {
                        var id = Math.ceil(Math.random() * 35);
                        res += chars[id];
                    }
                    var timestamp = new Date().getTime();
                    return timestamp + res;
                },
                //存储单个属性
                setVar: function (key, value) {
                    $window.localStorage[key] = value;
                },
                //读取单个属性
                getVar: function (key, defaultValue) {
                    return $window.localStorage[key] || defaultValue;
                },
                //存储对象，以JSON格式存储
                setObject: function (key, value) {
                    $window.localStorage[key] = angular.toJson(value);
                },
                //读取对象
                getObject: function (key) {
                    return angular.fromJson($window.localStorage[key] || '{}');
                },
                //读取数组
                getArray: function (key) {
                    return angular.fromJson($window.localStorage[key] || '[]');
                },
                //删除
                remove: function (key) {
                    $window.localStorage.removeItem(key);
                },
                //删除
                clear: function () {
                    $window.localStorage.clear();
                },
                getPhoneType: function () {
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
                },
                getOS: function () {
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
                },
                set: set,
                get: get
            }
        }

    ]);
