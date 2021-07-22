
import axios from 'axios'

// import router from '../router';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 20000 ,                 // 请求超时时间
  headers:{
    'Accept':'application/json'
  }
});

// request拦截器
service.interceptors.request.use(config => {
  // Do something before request is sent
  return config;
}, error => {
  // Do something with request error
  console.log(error); // for debug
  Promise.reject(error);
})
let that = this;
// respone拦截器
service.interceptors.response.use(
  response => response,
  error => {
    console.log('err' + error);// for debug
    // Dialog({ message: 'server error' });
    return Promise.reject(error);
  }
)
export function postData(api,method,obj){
  const token = localStorage.getItem('topboxs_token');
    return new Promise((resolve,reject)=>{
            service({
                url: api,
                method: method,
                headers:{
                  'Authorization':`Bearer ${token?token:''}`
                },
                data:obj
            }).then(res=>{  //axios返回的是一个promise对象
                resolve(res.data)  //resolve在promise执行器内部 
            }).catch(err=>{
                console.log(err,'异常');
                let str=`${err}`
                if(str.slice(-3)=='401') {
                  //如果没有登录让他登录
                  let fix_id=localStorage.getItem('fix_id');
                  this.getAccountToken().then(app_token=>{
                   
                    this.getAccountID().then(accountId=>{
                      
                        if(fix_id == 'undefined'){
                          
                          this.$login('/api/login','POST',{
                            accountId: fix_id=='1'?'1411893':accountId,
                            token:fix_id=='1'?'coqJr3YylkuQmkM5oOdXtQDVnmL9KP-ZlkZgz00h3J0gJQ==':app_token
                          }).then((res)=>{
                            
                            if(res.code===0) {
                              localStorage.setItem('ACCOUNT_ID',accountId);
                              localStorage.setItem('topboxs_token',res.data.token)
                              // this.$router.go(0)
                              window.location.reload()
                            }
                          })
                          .catch(errs=>{
                            
                            //跳转app登录页
                            let strs=`${errs}`
                            if(strs.slice(-3)=='401') {
                              this.$dialog.alert({
                                message: 'Login expired'
                              }).then(()=>{
                                this.login()
                              })
                            } 
                          })
                        }else{
                           this.$login('/api/login','POST',{
                          accountId: '1190033',
                          token:'pZJA6bFmdz04Mrw3XwswCBSHOY7gRdQhxhlezJ4FAxxm4qPBcw=='
                        }).then((res)=>{
                          console.log(res)
                          if(res.code===0) {
                            localStorage.setItem('topboxs_token',res.data.token)
                            this.$router.go(0)
                          }
                        })
                        }
                    })
                  })
                        // this.$login('/api/login','POST',{
                        //   accountId: '1411893',
                        //   token:'coqJr3YylkuQmkM5oOdXtQDVnmL9KP-ZlkZgz00h3J0gJQ=='
                        // }).then((res)=>{
                        //   console.log(res)
                        //   if(res.code===0) {
                        //     localStorage.setItem('topboxs_token',res.data.token)
                        //     this.$router.go(0)
                        //   }
                        // })
                }
                reject(err);
            })  
    })    
}
export function axiosLogin(api,method,obj) {
  return new Promise((resolve,reject)=>{
      service({
          url: api,
          method: method,
          data:obj
      }).then(res=>{  //axios返回的是一个promise对象
          resolve(res.data)  //resolve在promise执行器内部 
      }).catch(err=>{
          console.log(err,'异常');
          reject(err);
      })

  })
}