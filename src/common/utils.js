export default {
    install(Vue, options) {

        //页面跳转
        Vue.prototype.jumInterfaceWith = (url, title, bool) => {
            let appVersion = parseInt(document.querySelector('#vesync_app_version').value);
            //App版本号大于等于2.4.7
            appVersion>=247 ? jumInterfaceWithNew(url, title, bool) : jumInterfaceWithOld(url, title);
        };


        Vue.prototype.jumpNative = (url, title, bool) => {
            var cururl = '';
            url.indexOf("http")!= -1 ?  cururl = url : cururl = `http://${window.location.host}${url}`;
            try {
                window.webkit.messageHandlers.jumInterfaceWith.postMessage({
                    url: cururl,
                    title: title,
                    isShowCloseBtn:bool
                })
            }
            catch (e) {
                try {
                    window.AndroidDiscoverMethods.jumpInterfaceWith(cururl, title, bool);
                } catch (e) {
                    window.location.href = url;
                }
            }
        }

        //跳转至原生app登录页
        Vue.prototype.login = () => {
            try {
                window.webkit.messageHandlers.login.postMessage({})
            }
            catch (e) {
                try {
                    window.AndroidDiscoverMethods.login();
                } catch (e) {
                    window.location.href = '';
                }
            }
        };

        //获取地址栏参数
        Vue.prototype.getSearchString = (key) => {
            let href = window.location.href.substr(window.location.href.lastIndexOf('?'))
            let str = href.split('?')[1];
            if(!str){return undefined}
            let arr = str.split("&");
            var obj = new Object();
            for (let i = 0; i < arr.length; i++) {
                let tmp_arr = arr[i].split("=");
                obj[decodeURIComponent(tmp_arr[0])] = decodeURIComponent(tmp_arr[1]);
            }
            return obj[key];
        }

        //得到用户ID
        Vue.prototype.getAccountID = () => {
            let _this = this;
            return new Promise((resolve, reject) => {
                window.getAccountIDJs = (userid) => {
                    //_this.userid = userid;
                    resolve(userid);
                }
                try {
                    window.webkit.messageHandlers.getAccountID.postMessage('');
                } catch (e) {
                    try {
                        window.AndroidDiscoverMethods.getAccountID();
                    } catch (e) {
                        //window.getAccountIDJs('1256562');
                        //window.getAccountIDJs('1260947');
                        //window.getAccountIDJs('1287080'); //游客
                        window.getAccountIDJs('');
                    }
                }
            });
        }


        
        //得到用户token
        Vue.prototype.getAccountToken = () => {
            let _this = this;
            return new Promise((resolve, reject) => {
                window.getAccountTokenJs = (token, platform) => {
                    //_this.token = token;
                    // _this.platform = platform;
                    // resolve(token, platform);
                    resolve(token);

                };
                try {
                    window.webkit.messageHandlers.getAccountToken.postMessage('');
                } catch (e) {
                    try {
                        window.AndroidDiscoverMethods.getAccountToken();
                    } catch (e) {
                        //window.getAccountTokenJs('Pc3AS9n-CYv5MINFsj2rB9sMhNBTjvCJMskg58oGnKw2Yw==', 'browser');
                        //window.getAccountTokenJs('VhxN9RZ88qO18LweUB59Su7YtMyom0syZa3RvBDxgH4VlA==', 'browser');
                        //window.getAccountTokenJs('iZ9-VEzW0IdOivKSl_4CYLADGm1b4xSLu9T5HHDNLVf4Tw==', 'browser'); //游客
                        window.getAccountTokenJs('', 'browser');
                    }
                }
            });
        }

        //禁用原生下拉刷新
        Vue.prototype.disablePullRefresh = () => {
            try {
                window.webkit.messageHandlers.disablePullRefresh.postMessage({})
            }
            catch (e) {
                try {
                    window.AndroidDiscoverMethods.disablePullRefresh()
                } catch (e) {
                    window.console.log('disablePullRefresh');
                }
            }
        }


        //复制到粘贴板; status==1 复制成功 app>=2.3.8有效
        Vue.prototype.copyString = (code) => {
            var _this = this;
            return new Promise((resolve, reject) => {
                window.copyStringJs = function (status) {
                    //_this.copy_status = status;
                    resolve(status);
                }
                try {
                    window.webkit.messageHandlers.copyString.postMessage({code: code});
                } catch (e) {
                    try {
                        window.AndroidDiscoverMethods.copyString(code);
                    } catch (e) {
                        window.copyStringJs(0);
                        resolve();
                    }
                }
            });
        }

        Vue.prototype.getWalkCount = () =>{
            try {
                window.AndroidDiscoverMethods.getStepCounter('stepCountCallback');
            } catch(e) {
                try {
                    window.webkit.messageHandlers.getStepCounter.postMessage({
                        "body":"getStepCount"
                    })
                } catch(e) {
                    console.log('walkfuck')
                }          
            }
        }

        //判断是否安装 APP；  platforms : facebook , amazon;  isInstall ： '1'为安装了，'0' 为未安装
        Vue.prototype.isAppInstall = (platforms) => {
            var _this = this;
            return new Promise((resolve, reject) => {
                window.isAppInstallJs = function (platform, isInstal) {
                    //_this.platform = platform;
                    //_this.isInstal = isInstal;
                    resolve(isInstal);
                };
                try {
                    window.webkit.messageHandlers.isAppInstall.postMessage({
                        platform:platforms
                    })
                }catch(e) {
                    try{
                        window.AndroidDiscoverMethods.isAppInstall(platforms);
                    }catch(e){
                        window.isAppInstallJs('fb','-1');
                    }
                }
            })
        }

        //跳转到亚马逊app，app>=2.3.8有效 没有app直接跳转到网页
        Vue.prototype.openAmazon = (url) => {
            try {
                window.webkit.messageHandlers.openAmazon.postMessage({
                    amazonUrl: url
                })
            }
            catch (e) {
                try {
                    window.AndroidDiscoverMethods.openAmazon(url);
                } catch (e) {
                    window.location.href = url;
                }
            }
        },

            //分享内容； err 为 cancel 时 为用户取消了分享 ，其他为一些错误信息
            Vue.prototype.shareContent = (platforms, urls) => {
                var _this = this;
                return new Promise((resolve, reject) => {
                    window.shareContentJs = function (platform, err) {
                        //_this.platform = platform;
                        //_this.err = err;
                        resolve(err);
                    };
                    try {
                        window.webkit.messageHandlers.shareContent.postMessage({
                            platform: platforms,
                            url: urls
                        })
                    } catch (e) {
                        try {
                            window.AndroidDiscoverMethods.shareContent(platforms, urls);
                        } catch (e) {
                            window.shareContentJs('fb', 'cancel');
                        }
                    }
                })
            }

    }
}

//app 原生2.4.2以下版本页面跳转
let jumInterfaceWithOld = (url, title) => {
    var cururl = '';
    url.indexOf("http")!= -1 ?  cururl = url : cururl = `http://${window.location.host}${url}`;
    try {
        window.webkit.messageHandlers.jumInterfaceWith.postMessage({
            url: cururl,
            title: title,
        })
    }
    catch (e) {
        try {
            window.AndroidDiscoverMethods.jumpInterfaceWith(cururl, title);
        } catch (e) {
            window.location.href = url;
        }
    }
}
//app 原生2.4.2以上版本页面跳转
let jumInterfaceWithNew  = (url, title, bool) => {
    var cururl = '';
    url.indexOf("http")!= -1 ?  cururl = url : cururl = `http://${window.location.host}${url}`;
    try {
        window.webkit.messageHandlers.jumInterfaceWith.postMessage({
            url: cururl,
            title: title,
            isShowCloseBtn:bool
        })
    }
    catch (e) {
        try {
            window.AndroidDiscoverMethods.jumpInterfaceWith(cururl, title, bool);
        } catch (e) {
            window.location.href = url;
        }
    }
}