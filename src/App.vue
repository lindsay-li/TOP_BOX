<template>
  <div id="app">
    <transition :name="transitionName">
    <router-view/>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      transitionName: 'slide-right', //初始过渡动画方向
    }
  },
  watch: {
    $route(to, from) {
        // 切换动画
        let isBack = this.$router.isBack // 监听路由变化时的状态为前进还是后退
        if (isBack) {
          this.transitionName = 'slide-left'
        } else {
          this.transitionName = 'slide-right'
        }
        this.$router.isBack = false
      }
    },
    created(){
      // this.disablePullRefresh()
      // this.getWalkCount()
    },
    mounted(){
      // document.body.addEventListener('touchmove', function(e) {
      //       if(e._isScroller) return;
      //       e.preventDefault();
      //   }, {
      //       passive: false
      //   });

      // document.body.addEventListener('touchmove', function (e) {
      //   if(e)   {
      //   if(!hasParent(e.target, "#app")){ 
      //            e.preventDefault();    
      //    }  
      //   } 
      //   }, {passive: false});
      //   function hasParent(element, parentClass){ 
      //     //  var ele = $(element);
      //     console.log(element.tagName)
      //     //  var ele = document.querySelector(element)
      //     //  console.log(ele)
      //     while(!(element.tagName == "body")){ 
      //          if(element.contains(document.querySelector(parentClass))){  
      //                 return true; 
      //           }  
      //         element = element.parentNode;  
      //       }  
      //      return false;
      //   }

    },
    beforeDestroy(){
        // document.body.removeEventListener('touchmove', function(e) {
        //     if(e._isScroller) return;
        //     e.preventDefault();
        // }, {
        //     passive: false
        // });
    },
}
</script>

<style lang="scss">
html,body{
    height:100%;
}

#app{
  width: 100%;
  overflow: scroll;
  font-family: Arial, Helvetica, sans-serif;
  position: relative;
}
.loadings{
  animation: fadeOut 0.2s linear;
}
@keyframes fadeOut{0%{opacity:1}to{opacity:0}}
.van-popup--bottom.van-popup--round{
  border-radius:8px 8px 0px 0px;
}
.van-popup{
  border-radius: 8px;
}

/*toast*/
.van-toast--text{
  padding: 24px 40px;
  font-size: 32px;
}
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .5s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(750px);
  opacity: 0;
}

/**************/
  .slide-left-enter,
  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }

  .slide-left-leave-active,
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(100%, 0 ,0);
  }
  .slide-left-enter,
  .slide-right-leave-active,
  .slide-left-leave-active,
  .slide-right-enter{
    position: absolute;
    height: 100%;
    transition: all .377s ease;
    will-change: transform;
    top: 0;
    backface-visibility: hidden;
    perspective: 1000;
  }
  /*list*/
   .van-hairline--top-bottom:after{
     border-width: 0;
   }
  
  .van-tab{
    font-size: 32px;
  }
  .van-tab--active{
    font-weight: bold;
    font-size: 40px;
  }
  .van-tabs--line .van-tabs__wrap{
    height:50px;
  }
</style>
