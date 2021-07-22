<template>
    <div class="headers">
        <div class="back" @click="backTo"></div>
        <div class="title">{{titles}}</div>
        <div class="right"></div>
    </div>
</template>
<script>
export default {
    props:['titles'],
    methods:{
        backTo(){
            console.log(this.$route.name)
            if(this.$route.name == 'index'){

            }else{
                window.history.back()
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.headers{
    width: 100%;
    height: 88px;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    .back{
        width: 20px;
        height: 38px;
        background:url("../assests/images/icon_back.png") 0 0 no-repeat;
        background-size: cover;
        margin-left: 40px;
    }
    .title{
        color: #333;
        font-size: 36px;
    }
    .right{
        width: 20px;
        height: 38px;
    }
    
}
</style>
