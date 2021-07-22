<template>
    <div class="container" v-if="complated">
        <div class="prize-list" v-if="prize_list.length>0">
            <div class="prize-item" v-for="(item,index) in prize_list" :key="index">
                <div class="title">{{item.product_title}}</div>
                <div class="content">
                    <div class="pic">
                        <img :src="item.product_pic" alt="">
                    </div>
                    <div class="info" v-if="item.product_type==2">
                        <div class="tit">Amazon Code:</div>
                        <p>{{item.code}}</p>
                        <div class="coupon">Discount: {{item.coupon_discount}}</div>
                        <div class="time">Availablle until {{item.expired_end_at.substr(0,10)}}</div>
                    </div>
                    <div class="info" v-if="item.product_type==1 && item.delivery == 1">
                        <div class="intro">Any questions? Let us know.</div>
                        <div class="tit">Email:</div>
                        <div class="email">support@vesync.com</div>
                    </div>
                    <div class="info" v-if="item.product_type==1 && item.delivery == 0" @click="goProduct(item.link)">
                        <div class="intro intros">Please fill in your mailing address, so you can receive your prize. </div>
                        <div class="time">Availablle until {{item.expired_end_at?item.expired_end_at.substr(0,10):'*'}}</div>
                    </div>
                </div>
                <div class="btn" v-if="item.product_type==2" @click="goAmazon(item.link)" v-clipboard:copy="item.code"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">
                    <span>Use</span>
                    
                </div>
                <div class="btn" @click="fillInfo(item)" v-if="item.product_type==1 && item.delivery == 0">
                    <i>Mailing Address</i>
                </div>
                <div class="btn" @click="goProduct(item.link)" v-if="item.product_type==1 && item.delivery == 1">
                    <span>Product Details</span>
                </div>
            </div>
        </div>
        <div class="no-prize" :style="'height:'+innerheight+'px;'" v-else>
            <div class="icon">
                <img src="../assests/images/myprize_no_date@2x.png" alt="">
                <span>No prizes yet</span>
            </div>
            <div class="action">
                <p>Let's start the game</p>
                <div class="btn" @click="goGame">
                    <span>Play Now</span>
                </div>
                <div class="pmtt"></div>
            </div>
        </div>
        
        <van-popup
        v-model="show"
        :close-on-click-overlay="false"
        >
            <div class="popup" >
                <div class="icon">
                    <div class="icons1" v-if="productInfo.rank == 1"></div>
                    <div class="icons2" v-if="productInfo.rank == 2"></div>
                    <div class="icons3" v-if="productInfo.rank == 3"></div>
                    <div class="icond" v-if="productInfo.rank >3"></div>
                </div>
                <div class="title">Congratulations!</div>
                <div class="text">Your ranking in the {{productInfo.activity_no}}st issue of event settlement</div>
                <div class="ranking">NO.{{productInfo.rank}}</div>
                
                <div class="tit">You have got:</div>
                <div class="code">{{productInfo.product_name}}</div>
                <div class="infos">Please fill in the following information truthfully in order to deliver the goods as soon as possible.</div>
                <div class="forms">
                    <div class="input">
                        <input type="text" ref="inputEmail" name="inputEmail" @blur="emailBlur" v-model.trim="inputValue.email" placeholder="Email">
                    </div>
                    <div class="names">
                        <div class="name">
                            <input type="text" v-model="inputValue.first_name" placeholder="First Name">
                        </div>
                        <div class="name">
                            <input type="text" v-model="inputValue.last_name"  placeholder="Last Name">
                        </div>
                    </div>
                    <div class="input">
                        <input type="text" v-model="inputValue.address"  placeholder="Adress">
                    </div>
                </div>
                <div class="btn" :class="[flag?'subBtn':'']" @click="sendValue">
                    Submit
                </div>
                <div class="p_intro">It has been put into "My Prize". The prize is valid for 10 working days from the date of winning the prize. Please deal with it as soon as possible.</div>
                <div class="times">Available before {{productInfo.expired_end_at?productInfo.expired_end_at.substr(0,10):"*"}}</div>
                
                <div class="close" @click="close"></div>
            </div>
        </van-popup>
        <!-- 游客登录确认弹窗 -->
       <van-popup
        v-model="loginShow"
        :close-on-click-overlay="false"
        >
            <div class="popup_log" v-if="!download">
                <div class="empt_log"></div>
                <div class="title">Hi there</div>
                <div class="tit">Create an account to play.</div>
                <div class="pic">
                    <img src="../assests/images/popup_sign_img@2x.png" alt="">
                </div>
                <div class="btn_log" @click="goLog">Sign Up</div>
                <div class="close" @click="closeLog"></div>
            </div>
            <div class="popup_down" v-else>
                <div class="title">This activity is only open to VeSync users. Please download the VeSync app to particpate. </div>
                <div class="btn_down" @click="goLog">Download Now</div>
                <div class="close" @click="closeLog"></div>
            </div>
       </van-popup>
    </div>
    <div v-else class="loadings">
        <van-loading color="#3ACCFE" size="48px"/>
    </div>  
</template>
<script>
export default {
    name:'myprize',
    data(){
        return{
            prize_list:[],
            numbers:'',
            activity_id:'',
            flag:false,
            inputValue:{
                email:'',
                first_name:"",
                last_name:"",
                address:""
            },
            timer:null,
            show:false,
            amazon_url:'',
            id:'',
            complated:false,
            innerheight:0,
            productInfo:{},
            loginShow:false,
            download:false,
            user_type:1,    // 1 app  2 游客
        }
    },
    created(){
        this.activity_id = this.$route.query.activity_id
        this.user_type = localStorage.getItem('user_types')
        this.getList(this.activity_id)
        this.innerheight = window.innerHeight
        // this.complated = true
    },
    mounted(){
        (function()
            {
                var agent = navigator.userAgent.toLowerCase();        //检测是否是ios
                var iLastTouch = null;                               //缓存上一次tap的时间
                if (agent.indexOf('iphone') >= 0 || agent.indexOf('ipad') >= 0)
                {
                    document.body.addEventListener('touchend', function(event)
                    {
                        var iNow = new Date()
                            .getTime();
                        iLastTouch = iLastTouch || iNow + 1 /** 第一次时将iLastTouch设为当前时间+1 */ ;
                        var delta = iNow - iLastTouch;
                        if (delta < 500 && delta > 0)
                        {
                            event.preventDefault();
                            return false;
                        }
                        iLastTouch = iNow;
                    }, false);
                }
            
            })();

    },
    methods:{
        getList(id){
            let data = {activity_id:id}
            this.$http('/api/box/myAwardLog','POST',data)
            .then(res=>{
                console.log(res)
                if(res.code == 0){
                    this.prize_list = res.data.awardLog
                    this.complated = true
                }else{
                    this.$toast(res.message)
                }
            })
        },
        fillInfo(obj){
            this.id = obj.id
            this.productInfo = obj
            this.show = true
        },
        emailBlur(e){
            if(this.inputValue.email){
                let reg = /^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/;
                if(!reg.test(this.inputValue.email)){
                    this.$toast('Incorrect format')
                    this.$refs['inputEmail'].focus()
                }
            }else{
                this.$toast('Incorrect format')
                this.$refs['inputEmail'].focus()
            }
            this.examination()
        },
        examination(){
            this.timer = setInterval(() => {
               if(this.inputValue.email && this.inputValue.address && this.inputValue.first_name && this.inputValue.last_name){
                    this.flag = true
                }else{
                    this.flag = false
                }
            }, 300);
        },
        sendValue(){
            let data = this.inputValue;
            if(!data.email || !data.address || !data.first_name || !data.last_name){
                this.$toast('Not completing all required fields')
                return
            }
            this.$http(`api/box/deliverySave/${this.id}`,'POST',data)
            .then(res=>{
                console.log(res)
                if(res.code == 0){
                    clearInterval(this.timer)
                    this.$toast('Submitted successfully')
                    this.inputValue = {
                        email:'',
                        first_name:"",
                        last_name:"",
                        address:""
                    }
                    this.show = false
                }else{
                    this.$toast('Submission failure')
                }
            })
            .catch((err)=>{
                this.$toast('Submission failure')
            })
        },
        close(){
            this.show = false
            clearInterval(this.timer)
        },
        closeLog(){
            this.loginShow = false
        },
        goLog(){
            this.loginShow = false
            let fix_id = localStorage.getItem('fix_id')
            if(fix_id=='1'){
                window.location.href='http://www.vesync.com'
            }else{
                this.login()
            }
        },
        goAmazon(url){
            this.amazon_url = url
        },
        goGame(){
            if(this.user_type == '1'){
                this.jumpNative(`${location.origin}${location.pathname}#/game?id=${this.activity_id}`,'Surprise Box',true)
            }else{
                // 游客的话就让注册app并登录
                let fix_id = localStorage.getItem('fix_id')
                if(fix_id=='1'){
                    this.download = true
                }else{
                    this.download = false
                }
                this.loginShow = true
            }
        },
        onCopy(e){
            this.$toast({
                message:'Successfully copied!',
                duration:2000
            });
            let timer = setTimeout(()=>{
                clearTimeout(timer)
                this.turnToAmazon(this.amazon_url)
            },2000)
        },
        onError(e){
            this.$toast('Copy failed!',{

                duration:1000
            });
        },
        goProduct(amazon_url){
            this.turnToAmazon(amazon_url)
        },
        //跳转到亚马逊
        turnToAmazon(amazon_url) {
            setTimeout(() => {
                let appUrl = 'com.amazon.mobile.shopping.web://' + amazon_url;
                let webUrl = 'http://' + amazon_url;
                this.isAppInstall('amazon').then(isInstall => {
                    isInstall === '1' ? this.openAmazon(appUrl) : this.openAmazon(webUrl);
                })
            }, 300)
        },
    },
    beforeDestroy(){
        clearInterval(this.timer)
    }
}
</script>
<style lang="scss" scoped>
.loadings{
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    overflow: hidden;
}
.container{
   width: 100%;
   height: 100%;
   .prize-list{
       width: 100%;
       overflow: scroll;
       .prize-item{
           width: 670px;
           height: 432px;
           background-color: #fff;
           margin: 40px auto;
           border-radius: 8px;
           box-shadow: 0 0 2px #ccc;
           .title{
               width: 100%;
               height: 72px;
               background-color: #F1FAFE;
               border-radius: 8px 8px 0px 0px;
               line-height: 72px;
               text-align: center;
               padding: 0 20px;
               font-size: 32px;
               color: #333;
               @include ellipsis();
           }
           .content{
               width: 100%;
               height: 280px;
               display: flex;
               align-items: center;
               justify-content: space-between;
               .pic{
                   width: 200px;
                   height: 200px;
                   margin: 0 40px;
                   img{
                       width: 100%;
                       height: 100%;
                       border-radius: 8px;
                   }
               }
               .info{
                   width: 350px;
                   margin-right: 40px;
                   .tit{
                       width: 100%;
                       font-size: 24px;
                       line-height: 24px;
                       color: #999;
                       margin-bottom: 10px;
                   }
                   p{
                       width: 100%;
                       font-size: 24px;
                       color: #333;
                       line-height: 24px;
                       margin-bottom: 24px;
                       @include ellipsis();
                   }
                   .coupon{
                       width: 100%;
                       font-size: 36px;
                       color: #333;
                       line-height: 36px;
                       margin-bottom: 58px;
                       @include ellipsis();
                   }
                   .time{
                       width: 100%;
                       font-size: 24px;
                       color: #999;
                       line-height: 24px;
                   }
                   .intro,.email{
                       width: 100%;
                       font-size: 28px;
                       color: #333;
                       line-height: 28px;
                   }
                   .intro{
                       margin-bottom: 42px;
                   }
                   .intros{
                       margin-bottom: 54px;
                   }
               }
           }
           .btn{
               width: 100%;
               height: 80px;
               background-color: #6384F4;
               line-height: 80px;
               text-align: center;
               border-radius: 0px 0px 8px 8px;
               span{
                   font-size: 32px;
                   color: #fff;
                   &::after{
                       content:'';
                       display: inline-block;
                       width: 40px;
                       height: 16px;
                       background: url("../assests/images/icon_arrow@2x.png") 0 0 no-repeat;
                       background-size:100%;
                       margin-left: 20px;
                       position: relative;
                       top: -3px;
                   }
               }
               i{
                   font-style: normal;
                   font-size: 32px;
                   color: #fff;
               }
           }
       }
   }
   .no-prize{
      width: 100%;
      height: 100vh;
      position: relative;
      overflow: hidden;
      .icon{
          margin: 160px auto 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          img{
              width: 240px;
              height: 240px;
              margin-bottom: 40px;
          }
          span{
              font-size: 30px;
              color: #666;
              line-height: 32px;
              text-align: center;
          }
      }
      .action{
          width: 670px;
          position: absolute;
          bottom: 40px;
          left: 50%;
          transform: translateX(-50%);
          p{
              width: 100%;
              font-size: 30px;
              color: #666;
              line-height: 32px;
              text-align: center;
              margin-bottom: 20px;
          }
          .btn{
              width: 100%;
              height: 88px;
              text-align: center;
              line-height: 88px;
              background-color: #6384F4;
              box-shadow:0px 4px 8px 0px rgba(43,141,183,0.5);
              border-radius:44px;
              font-size: 32px;
              color: #fff;
          }
      }
   }
   .popup{
        width:670px;
        height: 1300px;
        background:rgba(255,255,255,1);
        border-radius:8px; 
        position: relative;
        .icon{
            width: 100%;
            height: 206px;
            overflow: hidden;
            .icons1, .icons2, .icons3{
                width: 112px;
                height: 166px;
                margin: 0 auto;
            }
            .icons1{
                background: url("../assests/images/icon_settlement_gold@2x.png") 0 0 no-repeat;
                background-size: 100%;
            }
            .icons2{
                background: url("../assests/images/icon_settlement_silver@2x.png") 0 0 no-repeat;
                background-size: 100%;
            }
            .icons3{
                background: url("../assests/images/icon_settlement_copper@2x.png") 0 0 no-repeat;
                background-size: 100%;
            }
            .icond{
                width: 178px;
                height: 162px;
                background: url("../assests/images/icon_popup_congrats@2x.png") 0 0 no-repeat;
                background-size: 100%;
                margin: 34px auto 0;
            }
        }
        .title{
            width: 100%;
            font-size: 40px;
            line-height: 40px;
            color: #6384F4;
            text-align: center;
            margin-bottom: 40px;
        }
        .text{
            width: 590px;
            margin: 0 auto;
            font-size: 28px;
            color: #999;
            line-height: 28px;
        }
        .ranking{
            width: 590px;
            margin: 10px auto 40px;
            font-size:40px;
            color: #6384F4;
            line-height: 40px;
        }
        .coupon{
            width: 590px;
            margin: 0 auto;
            font-size: 28px;
            color: #6384F4;
            line-height: 28px;
            @include ellipsis();
        }
        .tit{
            width: 590px;
            margin: 40px auto 10px;
            font-size: 28px;
            color: #999;
            line-height: 28px;
        }
        .code{
            width: 590px;
            margin: 0 auto;
            font-size: 40px;
            color: #6384F4;
            line-height: 40px;
        } 
        .p_intro{
            width: 590px;
            margin: 0 auto 20px;
            font-size: 28px;
            color: #999;
            line-height: 28px;
        }
        .times{
            width: 590px;
            margin: 0 auto;
            color: #FF3669;
            font-size: 28px;
            line-height: 28px;
            height: 28px;
        }
        .close{
            width: 26px;
            height: 26px;
            position: absolute;
            top: 20px;
            right: 20px;
            background: url('../assests/images/icon_popup_close@2x.png') 0 0 no-repeat;
            background-size: 100%;
        }
        .infos{
            width: 590px;
            margin: 40px auto 20px;
            font-size: 28px;
            color: #999;
            line-height: 28px;
        }
       .forms{
            width: 590px;
            margin: 0 auto;
            .input{
                width: 100%;
                /*height: 80px;*/
                background:rgba(241,250,254,1);
                border-radius:8px;
                /*border:2px solid rgba(99,132,244,1);*/
            }
            .names{
                width: 100%;
                display: flex;
                justify-content: space-between;
                margin: 20px 0;
                .name{
                    width:286px;
                    /*height: 80px;*/
                    border-radius: 8px;
                    background:rgba(241,250,254,1);
                    /*border:2px solid rgba(99,132,244,1);*/
                }
            }
            input{
                background-color: transparent;
                outline: none;
                border:2px solid rgba(99,132,244,1);
                font-size:28px;
                color: #333;
                width: 100%;
                padding: 40px 20px;
                height: 28px;
                /*line-height: 80px;*/
                border-radius: 8px;
                &::placeholder{
                    font-size: 28px;
                    color: #999;
                }
                &:focus{
                    background-color: #fff;
                    
                }
            }
        }
        
        .btn{
            
            width: 400px;
            height:88px;
            border-radius: 44px;
            background-color: #DFDFDF;
            text-align: center;
            line-height: 88px;
            margin: 40px auto;
            font-size: 32px;
            color: #fff;
        }
        .subBtn{
            background-color: #6384F4;
            &:active{
                background-color: #4A69BE;
            }
        }
        .close{
            width: 26px;
            height: 26px;
            position: absolute;
            top: 20px;
            right: 20px;
            background: url('../assests/images/icon_popup_close@2x.png') 0 0 no-repeat;
            background-size: 100%;
        }
   }
    .popup_log{
        width:670px;
        height:608px;
        background:rgba(255,255,255,1);
        border-radius:8px; 
        position: relative;
        overflow: hidden;
        .empt_log{
            width: 100%;
            height: 80px;
        }
        .title{
            width: 590px;
            font-size: 40px;
            line-height: 40px;
            text-align: center;
            color: #6384F4;
            margin: 0 auto 20px;
        }
        .tit{
            width: 590px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            color: #6384F4;
            font-size: 32px;
            margin: 0 auto 50px;
        }
        .pic{
            width: 218px;
            height: 156px;
            margin:  0 auto;
            img{
                width: 100%;
            }
        }
        .btn_log{
            width: 590px;
            height: 88px;
            background:rgba(99,132,244,1);
            box-shadow:0px 4px 8px 0px rgba(0,0,0,0.2);
            border-radius:44px;
            font-size: 32px;
            color: #fff;
            line-height: 88px;
            text-align: center;
            margin: 54px auto 0;
            &:active{
                background-color: #4A69BE;
            }
        }
        .close{
            width: 26px;
            height: 26px;
            position: absolute;
            top: 20px;
            right: 20px;
            background: url('../assests/images/icon_popup_close@2x.png') 0 0 no-repeat;
            background-size: 100%;
        }
    }
    .popup_down{
        width:670px;
        height:568px;
        background:rgba(255,255,255,1);
        border-radius:8px; 
        position: relative;
        overflow: hidden;
        .title{
            width: 590px;
            height: 80px;
            font-size: 28px;
            color: #6384F4;
            line-height: 40px;
            margin: 160px auto;
        }
        .btn_down{
            width: 400px;
            height:88px;
            border-radius: 44px;
            background-color: #6384F4;
            text-align: center;
            line-height: 88px;
            margin: 0 auto;
            font-size: 32px;
            color: #fff;
            &:active{
                background-color: #4A69BE;
            }
        }
        .close{
            width: 26px;
            height: 26px;
            position: absolute;
            top: 20px;
            right: 20px;
            background: url('../assests/images/icon_popup_close@2x.png') 0 0 no-repeat;
            background-size: 100%;
        }
    }
    @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio:3) {
    .pmtt{
        width: 100%;
        height: 17px !important;
    }
  }

}
</style>