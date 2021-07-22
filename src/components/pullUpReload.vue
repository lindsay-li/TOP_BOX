<template lang="html">
  <div class="loadMoudle" @touchstart="touchStart($event)" @touchmove="touchMove($event)" @touchend="touchEnd($event)" :style="{transform: 'translateY(-' + scrollY + 'px)'}">
    <slot></slot>
    <footer class="load-more">
      <slot name="load-more">
        <!-- <div class="moreData-tip" v-if="pullUpState==1">
          <span class="moreData-tip-text">{{pullUpStateText.moreDataTxt}}</span>
        </div>
        <div class="loadingMoreData-tip" v-if="pullUpState==2">
          <span class="icon-loading"></span>
          <span class="loadingMoreData-tip-text">{{pullUpStateText.loadingMoreDataTxt}}</span>
        </div>
        <div class="noMoreData-tip" v-if="pullUpState==3">
          <span class="connectingLine"></span>
          <span class="noMoreData-tip-text">{{pullUpStateText.noMoreDataTxt}}</span>
          <span class="connectingLine"></span>
        </div> -->
        <div class="mare" :style="'height:'+allHeight+'px'" v-show="parentPullUpState != 2">
            <p>More</p>
            <div class="dian" v-show="pullStatus == 1">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="pull-dian" :style="'height:'+moreHeight+'px'" v-show="pullStatus == 2">
                <span></span>
                <span></span>
                <span></span>
            </div>
            <div class="load" v-show="pullStatus == 3">
                <van-loading color="#55A5FE"  size="22px"/>
            </div>
        </div>
        <div class="nomare" v-show="parentPullUpState == 2">No More</div>
      </slot>
    </footer>
  </div>
</template>

<script>
export default {
  props: {
    parentPullUpState: {
      default: 0
    },
    onInfiniteLoad: {
      type: Function,
      require: false
    }
  },
  data () {
    return {
      top: 0,
      startY: 0,
      scrollY:0,
      pullStatus:1,
      moreHeight:0,
      allHeight:40,
      pullUpState: 0, // 1:上拉加载更多, 2:加载中……, 3:我是有底线的
      isLoading: false, // 是否正在加载
      pullUpStateText: {
        moreDataTxt: '上拉加载更多',
        loadingMoreDataTxt: '加载中...',
        noMoreDataTxt: '我是有底线的'
      }
    }
  },
  methods: {
    touchStart (e) {
      this.startY = e.targetTouches[0].pageY
    },
    touchMove (e) {
    if(!this.judgeScrollBarToTheEnd()){
        return
    }
      if(e.targetTouches[0].pageY < this.startY){
          this.scrollY = this.startY - e.targetTouches[0].pageY ;
          this.moreHeight = this.scrollY + 20
          this.allHeight = this.scrollY + 38
          if(this.scrollY >= 30){
              this.scrollY = 30
              this.moreHeight =50
              this.allHeight = 68
          }
          this.pullStatus = 2
      }
      console.log(this.scrollY)
    },
    touchEnd(e){
        if (e.changedTouches[0].pageY < this.startY) { // 上拉
        console.log('上拉')
        this.scrollY = 0
        
        this.moreHeight = 22
        this.allHeight = 40
        if(this.judgeScrollBarToTheEnd()){
           this.pullStatus = 3
           this.$emit('on-infinite-load')
          //  setTimeout(()=>{
          //    this.pullStatus = 1
          //  },2000)
        }
        // this.judgeScrollBarToTheEnd()
      }
    },
    // 判断滚动条是否到底
    judgeScrollBarToTheEnd () {
      let innerHeight = document.querySelector('.container').clientHeight
      // 变量scrollTop是滚动条滚动时，距离顶部的距离
      let scrollTop = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop
      // 变量scrollHeight是滚动条的总高度
      let scrollHeight = document.documentElement.clientHeight || document.body.scrollHeight
      // 滚动条到底部的条件
      if (scrollTop + scrollHeight >= innerHeight) {
        if (this.pullStatus !== 3) {
          return true
        }else{
            return false
        }
      }else{
          return false
      }
    },
  },
  watch: {
    parentPullUpState (curVal, oldVal) {
      if(curVal == 0){
        this.pullStatus = 1
      }else if(curVal == 2){
        this.pullStatus = 3
      }
      
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.load-more {
  width: 100%;
  position: relative;
}
.moreData-tip,
.loadingMoreData-tip,
.noMoreData-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 150px;
}
.loadMoudle{
    transition: transform 0.1s ease-in;
}
.loadMoudle .icon-loading {
  display: inline-flex;
  width: 35px;
  height: 35px;
  /* background: url(../../assets/images/refreshAndReload/loading.png) no-repeat; */
  background-size: cover;
  margin-right: 5px;
  animation: rotating 2s linear infinite;
}
@keyframes rotating {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(1turn);
  }
}
.connectingLine {
  display: inline-flex;
  width: 150px;
  height: 2px;
  background: #ddd;
  margin-left: 20px;
  margin-right: 20px;
}
.mare{
    width: 74px;
    margin: 0 auto 0;
    height: 80px;
}
.mare p{
    font-size:32px;
    color:#55A5FE;
}
.mare .dian,
.mare .pull-dian,.load{
    width: 100%;
    min-height:44px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: absolute;
    bottom: 0;
    left: 0;
}
.mare .pull-dian{
    margin-top: 5px;
}
.mare .dian span:first-child{
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: #55A5FE;
}
.mare .dian span:nth-child(2){
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: #55A5FE;
}
.mare .dian span:last-child{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #55A5FE;
}
.mare .pull-dian span{
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: #55A5FE;
}
.nomare{
  font-size:32px;
  color:#55A5FE;
  text-align: center;
  height: 110px;
  line-height: 110px;
}
</style>