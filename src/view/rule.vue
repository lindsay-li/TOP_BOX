<template>
    <div class="container" v-if="completed">
        <div class="content">
            <div class="logo"></div>
            <img :src="rule.rule_pic" alt="">
            <!-- <div class="empt"></div>
            <div class="title">How to get the prize</div>
            <div class="notice">
                <span>1.</span>
                <p>The number of prizes in each issue may be different. Remember to come in time to see if there are surprises.</p>
            </div>
            <div class="notice">
                <span>2.</span>
                <p>The leaderboard is updated at 0 o 'clock every day.</p>
            </div>
            <div class="notice">
                <span>3.</span>
                <p>The leaderboard is ranked by game score, starting with the highest score. If the user scores are the same, the first user to achieve the score is ranked first.</p>
            </div>
            <div class="notice">
                <span>4.</span>
                <p>The winning user will receive relevant notification when entering the game the next day, and the system will automatically push the winning notification, and the prize will be automatically put into "my prize", remember to check and use in time.</p>
            </div>
            <div class="notice">
                <span>5.</span>
                <p>Prize in kind, please fill in the real information to send the prize as soon as possible. The prize is valid for 10 working days after the prize is awarded. If you have any questions, please contact support@vesync.com.</p>
            </div>
            <div class="notice">
                <span>6.</span>
                <p>Prizes are provided by Levoit Cosori Etekcity.</p>
            </div>
            <div class="title" style="margin-top:40px">Access to Game Opportunities</div>
            <div class="notice">
                <span>1.</span>
                <p>Each user has 10 games per hour.</p>
            </div>
            <div class="notice">
                <span>2.</span>
                <p>After the use of 10 opportunities per hour, you can receive an additional 10 opportunities per hour.</p>
            </div>
            <div class="notice">
                <span>3.</span>
                <p>Stay tuned for more opportunities.</p>
            </div> -->
        </div>
    </div>
    <div v-else class="loadings">
        <van-loading color="#3ACCFE" size="48px"/>
    </div>  
</template>
<script>
export default {
    name:'rule',
    data(){
        return{
            rule:{},
            completed:false
        }
    },
    created(){
        let id = this.$route.query.id
        this.getPic(id)
    },
    methods:{
        getPic(id){
            let data = {activity_id:id}
            this.$http('/api/box/rule','POST',data)
            .then(res=>{
                console.log(res)
                if(res.code == 0){
                    this.rule = res.data
                    this.completed = true
                }else{
                    this.$toast(res.message)
                }
            })
        }
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
    background: #3ACCFE url("../assests/images/rule_bg@2x.png") 0 0 no-repeat;
    background-size: 100%;
    overflow: scroll;
    min-height: 100vh;
    .content{
        width: 670px;
        /*height: 1508px;*/
        margin: 172px auto 80px;
        background-color: #fff;
        border-radius: 8px;
        position: relative;
        .logo{
            width: 180px;
            height: 112px;
            background: url("../assests/images/rule_img_head@2x.png") 0 0 no-repeat;
            background-size: 100%;
            position: absolute;
            top: -92px;
            left: 50%;
            transform: translateX(-50%);
        }
        .empt{
            width: 100%;
            height: 40px;
        }
        .title{
            width: 590px;
            text-align: center;
            line-height: 40px;
            font-size: 40px;
            color: #6384F4;
            font-weight: bold;
            margin: 0px auto 40px;
        }
        .notice{
            width: 590px;
            margin:0 auto 20px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            span{
                font-size: 28px;
                color: #666;
                line-height: 36px;
            }
            p{
                width: 550px;
                flex: none;
                font-size: 28px;
                color: #666;
                line-height: 36px;
            }
        }
    }
}
</style>