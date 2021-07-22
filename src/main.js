// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import { Button,Popup ,Swipe, SwipeItem,Rate,List,Toast,Overlay,Loading,Tab, Tabs ,Dialog ,CountDown} from 'vant';
import App from './App'
import router from './router'

/*解决移动端300毫秒延迟*/
// import FastClick from 'fastclick'
import VueClipboard from 'vue-clipboard2'
import utils from './common/utils.js'
Vue.use(VueClipboard)
import * as custom from './filter/index'

Object.keys(custom).forEach(key => {
  Vue.filter(key, custom[key])
})
// FastClick.attach(document.body);
Vue.config.productionTip = false
Vue.use(utils)
Vue.use(Button)
Vue.use(Popup)
Vue.use(Swipe).use(SwipeItem);
Vue.use(Rate);
Vue.use(List);
Vue.use(Toast);
Vue.use(Overlay);
Vue.use(Loading);
Vue.use(Dialog);
Vue.use(Tab).use(Tabs);
Vue.use(CountDown);


import {postData,axiosLogin} from './api/index'
Vue.prototype.$http = postData
Vue.prototype.$login = axiosLogin

/*每次初始化的时候清除localstorage*/
let accountId = localStorage.getItem('ACCOUNT_ID');
function getAccountID () {
  
      window.getAccountIDJs = (userid) => {
        if(userid){
          // alert(accountId+'=='+userid)
          if(accountId != userid){
            localStorage.removeItem('topboxs_token')
            localStorage.setItem('fix_id',undefined)
          }else{
            localStorage.setItem('fix_id',undefined)
          }
        }else{
          //h5环境或者游客 未登录
          localStorage.setItem('fix_id',1)
        }
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
}
getAccountID()
/* eslint-disable no-new */
let hash = window.location.hash;
      let search = window.location.search && window.location.search.indexOf('activityId') >= 0?window.location.search : hash
      // var shareUrl=`http://${window.location.hostname}/comodity${search}`;
var metas = document.getElementsByTagName('meta')
  let shareUrl = `http://${window.location.hostname}${window.location.pathname}${search}`;
  metas['fb:url'].setAttribute('content',shareUrl);
  metas['twitter:url'].setAttribute('content',shareUrl);
/*判断路由*/
window.addEventListener('popstate', function (e) {
  router.isBack = true
},false)


new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
