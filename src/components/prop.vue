<template>
    <div class="wrapper">
        <van-popup
        v-model="show"
        :close-on-click-overlay="false"
        >
            <div class="popup" v-if="award && awardata.product.product_type==2">
                <div class="icon">
                    <div class="icons1" v-if="step == 1"></div>
                    <div class="icons2" v-if="step == 2"></div>
                    <div class="icons3" v-if="step == 3"></div>
                    <div class="icond" v-if="step >3"></div>
                </div>
                <div class="title">Congratulations!</div>
                <div class="text">Your rank: </div>
                <div class="ranking">{{step}}^{{stepds(step)}}</div>
                <div class="coupon">You've won a {{awardata.product.coupon_discount}} OFF Discount</div>
                <div class="tit">Here's your Amazon code:</div>
                <div class="code">{{awardata.code}}</div>
                <div class="btn" @click="goAmazon(awardata.product.link)" v-clipboard:copy="awardata.product.group_code"
                    v-clipboard:success="onCopy"
                    v-clipboard:error="onError">
                    <span>Use</span>
                </div>
                <div class="intro">Your prize has been added to "My Prizes." Use it before it expires!</div>
                <div class="time">Available until {{awardata.expired_end_at?awardata.expired_end_at.substr(0,10):"*"}}</div>
                <div class="close" @click="close"></div>
            </div>
            <div class="popup propForm" v-if="award && awardata.product.product_type==1">
                <div class="icon">
                    <div class="icons1" v-if="step == 1"></div>
                    <div class="icons2" v-if="step == 2"></div>
                    <div class="icons3" v-if="step == 3"></div>
                    <div class="icond" v-if="step >3"></div>
                </div>
                <div class="title">Congratulations!</div>
                <div class="text">Your rank:</div>
                <div class="ranking">{{step}}^{{stepds(step)}}</div>
               
                <div class="tit">You've won a:</div>
                <div class="code">{{awardata.product.product_name}}</div>
                <div class="infos">Please enter your information, so you can receive your prize as soon as possible.</div>
                <div class="forms">
                    <div class="input">
                        <input type="text" ref="inputEmail" name="inputEmail" @blur="emailBlur" v-model="inputValue.email" placeholder="Email">
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
                <div class="btn" :class="[flag?'subBtn':'']" @click="sendValue(awardata.id)">
                    Submit
                </div>
                <div class="intro">Your prize has been added to "My Prizes." Use it before it expires!</div>
                <div class="time">Available until {{awardata.expired_end_at?awardata.expired_end_at.substr(0,10):"*"}}</div>
                <div class="close" @click="close"></div>
            </div>
            <div class="popup popbox" v-if="!award"> 
                <div class="title">Maybe Next Time</div>
                <div class="text">Your Rank:</div>
                <div class="ranking">{{step}}^{{stepds(step)}}</div>
                <div class="tit">Keep playing to win a prize!</div>
                <div class="btn" @click="close">OK</div>
                <div class="encourage">Check out next week's prizes</div>
                <div class="close" @click="close"></div>
            </div>
       </van-popup>
    </div>
</template>
<script>
export default {
    name:'prop',
    props:['show','step','awardata','award'],
    data(){
        return{
            inputValue:{
                email:'',
                first_name:"",
                last_name:"",
                address:""
            },
            amazon_url:'',
            flag:false,
            timer:null
        }
    },
    created(){
        console.log(this.award)
        console.log(this.awardata)
    },
    methods:{
        stepds(n){
            if(n){
                let num = ''
                if(n==1){
                    num = 'st'
                }else if(n==2){
                    num = 'nd'
                }else if(n==3){
                    num = 'sd'
                }else{
                    num = 'th'
                }
                return num
            }
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
        sendValue(id){
            let data = this.inputValue;
            if(!data.email || !data.address || !data.first_name || !data.last_name){
                this.$toast('Not completing all required fields')
                return
            }
            this.$http(`api/box/deliverySave/${id}`,'POST',data)
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
                    this.$emit('closeBtn',{close:false,code:false}) 
                }else{
                    this.$toast('Submission failure')
                }
            })
            .catch((err)=>{
                this.$toast('Submission failure')
            })
        },
        goAmazon(amazon_url){
            this.amazon_url = amazon_url;
        },
        close(){
            this.$emit('closeBtn',{close:false,code:false}) 
            clearInterval(this.timer)
        },
        onCopy(e){
            this.$toast({
                message:'Successfully copied!',
                duration:2000
            });
            let timer = setTimeout(()=>{
                clearTimeout(timer)
                this.$emit('closeBtn',{close:false,code:false}) 
                this.turnToAmazon(this.amazon_url)
            },2000)
        },
        onError(e){
            this.$toast('Copy failed!',{

                duration:1000
            });
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
       
    }
}
</script>
<style lang="scss" scoped>
.popup{
    width:670px;
    height:930px;
    background:rgba(255,255,255,1);
    border-radius:8px; 
    position: relative;
    overflow: scroll;
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
    .btn{
        width: 400px;
        height:88px;
        border-radius: 44px;
        background-color: #6384F4;
        text-align: center;
        line-height: 88px;
        margin: 40px auto;
        font-size: 32px;
        color: #fff;
        &:active{
            background-color: #4A69BE;
        }
        span{
            &::after{
                content:'';
                display: inline-block;
                width: 40px;
                height: 16px;
                background: url("../assests/images/icon_arrow@2x.png") 0 0 no-repeat;
                background-size: 100%;
                margin-left: 6px;
                position: relative;
                top: -2px;
            }
        } 
    }
    
    .intro{
        width: 590px;
        margin: 0 auto 20px;
        font-size: 28px;
        color: #999;
        line-height: 28px;
    }
    .time{
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
}
.propForm{
    height: 1300px;
    
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
        background-color: #DFDFDF;
    }
    .subBtn{
        background-color: #6384F4;
        &:active{
            background-color: #4A69BE;
        }
    }
}
.popbox{
    height: 650px;
    .title{
        margin-top: 80px;
    }
    .btn{
        margin-top: 80px;
    }
    .encourage{
        font-size: 28px;
        color: #6384F4;
        text-align: center;
    }
}
</style>
