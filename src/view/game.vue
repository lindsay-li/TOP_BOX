<template>
  <div class="container" v-if="complated">
    <div class="bg"></div>
    <!-- 图片预加载 -->
    <div class="bgdownload1"></div>
    <div class="bgdownload2"></div>
    <div class="bgdownload3"></div>
    <div class="bgdownload4"></div>
    <img src="../assests/images/bear@2x.png" alt="" class="bgdownload5">
    <div class="box" v-show="!showCard" :style="'height:'+innerheight+'px;'" @touchstart="startPower"
      @touchend="endPower">
      <div class="down">
        <div class="move_box" :style="'transform:translateY(-'+move_distance+'px);background-image:url('+boxImg+');'">
        </div>
        <div class="bear" :class="[step!=1?step==2?'bear2':'bear3':'bear1']">
          <img v-show="step==3" src="../assests/images/bear@2x.png" alt="">
        </div>
        <div class="intro">
          <p>Press and hold any area of the screen. The longer you hold down, the higher the beaver will jump. </p>
          <p>Then release to make the beaver jump and push the box into the goal. </p>
        </div>
      </div>
      <div class="up">
        <div class="frequency" v-show="actLive">{{chance}} chances left in the hour</div>
        <div class="wheel_frame" :style="'margin-top:'+wheelHeight+'px'"></div>
      </div>
      <!-- 分数 -->
      <div class="score" v-if="showScore">
        <div class="score_icon">
          <img src="../assests/images/img_wow@2x.png" v-if="isHeightscore" alt="">
          <span v-else>{{score}}</span>
          <div class="star1"></div>
          <div class="star2"></div>
          <div class="star3"></div>
          <div class="star4"></div>
          <div class="star5"></div>
        </div>
      </div>
    </div>
    <div class="score_card" v-show="showCard">
      <div class="tits">Your Score</div>
      <div class="num">{{score}}</div>
      <div class="texts">Leaderboard</div>
      <div class="cards" v-if="result.compareRank&&actLive">
        <div class="left">
          <div class="ranking">
            <span>{{result.compareRank.rank>=1000?'999+':result.compareRank.rank}}</span>
          </div>
          <div class="avatar">
            <img :src="result.compareRank.app_user.avatar_icon" alt="">
          </div>
          <div class="name">{{result.compareRank.app_user.nickName}}</div>
          <div class="card-score">{{result.compareRank.highest_score}}</div>
        </div>
        <div class="right">
          <div class="ranking">
            <span>{{result.myRank.rank >=1000?'999+':result.myRank.rank}}</span>
          </div>
          <div class="avatar">
            <img :src="result.myRank.app_user.avatar_icon" alt="">
          </div>
          <div class="name">{{result.myRank.app_user.nickName}}</div>
          <div class="card-score">{{score}}</div>
        </div>
      </div>
      <div class="cards" v-if="!result.compareRank&&actLive">
        <div class="bg_card"></div>
        <div class="center">
          <div class="first"></div>
          <div class="avatar">
            <img :src="result.myRank.app_user.avatar_icon" alt="">
          </div>
          <div class="name">{{result.myRank.app_user.nickName}}</div>
          <div class="card-score">{{score}}</div>
        </div>
      </div>
      <div class="cards" v-if="!actLive">
        <div class="bg_card"></div>
        <div class="center">
          <div class="first"></div>
          <div class="avatar">
            <img :src="result.myRank.app_user.avatar_icon" alt="">
          </div>
          <div class="name">{{result.myRank.app_user.nickName}}</div>
          <div class="card-score">{{score}}</div>
        </div>
      </div>
      <div class="actions" v-if="chance==0 && share == 0&&actLive" @click="shareTo">
        <span>Share to get 10 more chances</span>
      </div>
      <div class="actions" v-if="chance > 0&&actLive" @click="closeCard">
        <span>Try Again</span>
      </div>
      <div class="actions" v-if="chance == 0 && share == 1&&actLive" @click="closeCard">
        <span>OK</span>
      </div>
      <div class="actions" v-if="!actLive" @click="closeCard">
        <span>Once Again</span>
      </div>
      <p class="underAgain" v-if="!actLive">The new phase of the activity has not started, this score is not included in
        the score.</p>
      <div class="close" @click="closeCard"></div>
    </div>
    <van-popup v-model="show" :close-on-click-overlay="false">
      <div class="popup">
        <div class="icon"></div>
        <div class="texts" v-if="share==0">
          <p>No more chances for this hour. Share to get 10 more chances. </p>
          <!-- <p>Let's go share and increase the game opportunities.</p> -->
        </div>
        <div class="texts" v-if="share == 1">
          <p>You've run out of chances. Come back in the next hour.</p>
          <!-- <p>Come back next hour.</p> -->
        </div>
        <div class="b_btn" @click="share==0?shareTo():closePop()"></div>
        <div class="btn" @click="share==0?shareTo():closePop()">
          <span v-text="share==0?'Share':'OK'"></span>
        </div>
        <div class="close" @click="closePop"></div>
      </div>

    </van-popup>
    <!-- 分享弹窗 -->
    <van-popup v-model="shareShow" round position="bottom">
      <div class="popupshare">
        <div class="tit">Share to:</div>
        <div class="icon">
          <div class="fb" @click="shareOther('fb')"></div>
          <!-- <div class="tw"  @click="shareOther('twitter')"></div> -->
        </div>
        <div class="handle" @click="closeShare">Cancel</div>
      </div>
    </van-popup>
  </div>
  <div v-else class="loadings">
    <van-loading color="#3ACCFE" size="48px" />
  </div>
</template>
<script>
  export default {
    name: 'game',
    data() {
      return {
        actLive: false, //是否在活动时间内
        timeStamp: 0, //按住时间
        startTime: 0, //开始时间
        endTime: 0, //结束时间
        step: 1, //游戏阶段 1、常规 2、蓄力  3、起跳
        boxMove: false, //移动状态
        move_distance: 0, //移动距离
        box_offset: 0, //盒子可以移动的距离
        boxOffsetTop: 0, //盒子初始离顶部距离
        wheelTOp: 0, //虚线框距离顶部的距离
        boxHeight: 0, //盒子==虚线框的高度
        score: 0, //分数
        showScore: false, //显示分数条
        showCard: false, //显示分数框
        show: false, //弹窗
        innerheight: 0, //innerHeight 高度
        wheelHeight: 0, //虚线框的移动范围
        no_frequency: false, //当前小时次数
        isHeightscore: false, //是否是高分
        activity_id: '',
        chance: '', //剩余次数
        user_log_id: "",
        boxpic: [], //盒子图片数组
        boxImg: '', //盒子图片
        flag: true, //游戏开关
        result: { //游戏结果
          compareRank: {
            highest_score: '',
            rank: '',
            app_user: {
              avatar_icon: '',
              nickName: ""
            }
          },
          myRank: {
            highest_score: '',
            rank: '',
            app_user: {
              avatar_icon: '',
              nickName: ""
            }
          }
        },
        share: 0, //分享次数
        shareShow: false, //分享弹窗
        complated: true,
        clientY: 0
      }
    },
    created() {
      this.innerheight = window.innerHeight
      this.activity_id = this.$route.query.id
      // this.getList(this.activity_id)
      this.getInitdata()
    },
    mounted() {
      // var metas = document.getElementsByTagName('meta')
      // metas['viewport'].setAttribute('content','width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover');
      this.disablePullRefresh()
      let imgData = [require('../assests/images/bear@2x.png'), require('../assests/images/img_wow@2x.png')];

      function imgload(n) {
        if (n <= imgData.length - 1) {
          let img = new Image();
          img.src = imgData[n]
          img.onload = function () {
            //图片首次加载完成，可以使用图片
            if (n < imgData.length) {
              imgload(n + 1)
            }
          };

        }
      }
      imgload(0)
      document.body.addEventListener('touchmove', function (e) {
        if (e._isScroller) return;
        e.preventDefault();
      }, {
        passive: false
      });
    },
    beforeDestroy() {
      document.body.removeEventListener('touchmove', function (e) {
        if (e._isScroller) return;
        e.preventDefault();
      }, {
        passive: false
      });
    },
    methods: {
      getList(id) {
        let data = {
          activity_id: id
        }
        this.$http('/api/box/gameIndex', 'POST', data)
          .then(res => {
            console.log(res)
            if (res.code == 0) {
              this.chance = res.data.chance
              this.user_log_id = res.data.user_log_id
              this.boxpic = res.data.box.data
              this.share = res.data.share
              this.changebox()
              this.complated = true
              this.getInitdata()
            } else {
              this.$toast(res.message)
            }
          })
      },
      getInitdata() {
        this.$nextTick(() => {
          let boxOffset = document.querySelector('.move_box')
          let topHeight = this.getElementTop(document.querySelector('.frequency')) + document.querySelector(
            '.frequency').clientHeight
          this.boxHeight = boxOffset.clientHeight
          this.boxOffsetTop = this.getElementTop(boxOffset)
          this.wheelHeight = this.getRoundNum(this.boxHeight / 2 - topHeight, this.boxOffsetTop - this.boxHeight -
            topHeight);
          this.box_offset = this.getElementTop(boxOffset) - 0;
          this.$nextTick(() => {
            this.wheelTOp = this.getElementTop(document.querySelector('.wheel_frame'))
          })
        })
        console.log(this.boxOffsetTop)
      },
      //向后台传送分数
      putScore(scores) {

        this.score = (this.actLive) ? this.score : 0;
        this.score = (isNaN(this.scores)) ? 0 : this.score;
        scores=this.score;
        let data = {
          score: scores,
          activity_id: this.activity_id,
          user_log_id: this.user_log_id
        }
        // this.$http('/api/box/game', 'POST', data)
        //   .then(res => {
        //     console.log(res)
        //     if (res.code == 0) {
        //       this.result = res.data.rank
        //       this.chance = (this.actLive) ? res.data.chance : 1000;
        //       console.log(this.chance);
        //       this.openCard()
        //     }
        //   })

      },
      //随机抽取一个盒子图片
      changebox() {
        let index = this.getRoundNum(0, this.boxpic.length - 1);
        this.boxImg = this.boxpic[index].box_pic

      },
      // 开始蓄力
      startPower(e) {
        e.preventDefault();
        // if (!this.flag) {
        //   return
        // }
        // if (this.chance == 0) {
        //   return
        // }
        console.log(e)
        this.startTime = e.timeStamp.toFixed(0)
        this.step = 2
        this.clientY = e.changedTouches[0].clientY
      },
      //松开手指
      endPower(e) {
        // if (!this.flag) {
        //   return
        // }
        // if (this.chance == 0) {
        //   this.show = true
        //   return
        // }
        console.log(e)
        let clientY = e.changedTouches[0].clientY - this.clientY
        if (clientY > 3) {
          this.step = 1
          return
        }
        this.timeStamp = e.timeStamp.toFixed(0) - this.startTime
        //小于300ms，等于点击，不弹跳
        if (this.timeStamp <= 300) {
          this.$toast('The power storage time is too short')
          this.step = 1
        } else {
          this.flag = false
          this.step = 3
          let timer = setTimeout(() => {
            this.step = 1
            clearTimeout(timer)
          }, 800)
          let timer2 = setTimeout(() => {
            this.getDistance()
            clearTimeout(timer2)
          }, 400)
        }
      },
      //计算移动距离
      getDistance() {
        let stage = this.box_offset / 3000;
        this.distance = this.timeStamp > 3000 ? 3000 : this.timeStamp
        this.move_distance = stage * this.timeStamp
        let timer3 = setTimeout(() => {
          let height = this.boxOffsetTop - this.move_distance
          //用虚线框距离顶部的高度跟盒子距离顶部的高度相比
          let distance = this.boxHeight - Math.abs(this.wheelTOp - height);
          if (distance >= 0) {
            this.score = ((distance / this.boxHeight) * 100).toFixed(2);
            if (this.score == 100) {
              this.score = 99.99;
            }
          } else {
            this.score = 0;
          }
          this.putScore(this.score)
          this.showScore = true
          if (this.score >= 90) {
            this.isHeightscore = true;
            let timer5 = setTimeout(() => {
              this.isHeightscore = false
              clearTimeout(timer5)
            }, 2000)
          }
          clearTimeout(timer3)

        }, 800)
      },
      openCard() {
        let timer4 = setTimeout(() => {
          this.showCard = true;
          this.showScore = false
          this.step = 1
          this.move_distance = 0
          this.flag = true
        }, 3000)
      },
      shareTo() {
        this.show = false
        this.showCard = false
        this.shareShow = true
      },
      closeCard() {
        this.showCard = false;
        this.getInitdata();
      },
      closePop() {
        this.show = false
      },
      closeShare() {
        this.shareShow = false
      },
      shareOther(type) {
        console.log('share___')
        this.shareShow = false
        let data = {
          user_log_id: this.user_log_id,
          activity_id: this.activity_id
        }
        this.$http('/api/box/share', 'POST', data)
          .then(res => {
            if (res.code == 0) {
              this.$router.go(0)
            }
          })
        let search = window.location.search && window.location.search.indexOf('activityId') >= 0 ? window.location
          .search : '/' + window.location.hash
        if (type == 'fb') {
          this.shareContent('facebook', `${window.location.href}`).then(res => {
            console.log(res);
            if (res === 'cancel') {
              console.log('分享失败!');

              window.open(
                `https://www.facebook.com/dialog/share?app_id=1150743805127638&display=page&href=http://${window.location.hostname}/boxh5${search}&redirect_uri=https://${window.location.hostname}/boxh5${search}`,
                '_blank');
            } else {
              console.log('分享成功');
            }
          }).catch((e) => {

          })
        }
        if (type == 'twitter') {
          let text = 'Quality Sleep On the Go';
          // window.open(`https://twitter.com/intent/tweet?url=http://${window.location.hostname}/boxh5${search}&text=${text}`);
          let url = `http://${window.location.hostname}/boxh5${search}`
          window.open('http://twitter.com/share?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text));
        }
      },
      //获取元素在屏幕的高度
      getElementTop(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;

        while (current !== null) {
          actualTop += current.offsetTop;
          current = current.offsetParent;
        }

        return actualTop;
      },
      //获取范围内的随机数
      getRoundNum(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
      }
    }
  }
</script>
<style lang="scss" scoped>
  .loadings {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    overflow: hidden;
  }

  .container {
    width: 100%;
    height: 100vh;
    background: #3ACCFE url("../assests/images/rule_bg@2x.png") 0 0 no-repeat;
    background-size: 100%;
    position: relative;
    overflow: hidden;

    .bg {
      width: 100%;
      height: 912px;
      /*background: linear-gradient(180deg,rgba(121,112,253,1) 0%,rgba(58,205,255,1) 100%);*/

    }

    .bgdownload1 {
      width: 0;
      height: 0;
      background: url("../assests/images/power@2x.png") 9999px 9999px no-repeat;
    }

    .bgdownload2 {
      width: 0;
      height: 0;
      background: url("../assests/images/conventional@2x.png") 9999px 9999px no-repeat;
    }

    .bgdownload3 {
      width: 0;
      height: 0;
      background: url("../assests/images/blink@2x.png") 9999px 9999px no-repeat;
    }

    .bgdownload4 {
      width: 0;
      height: 0;
      background: url("../assests/images/img_score_bg_top@2x.png") 9999px 9999px no-repeat;
    }

    .bgdownload5 {
      position: absolute;
      top: -9999px;
      left: -9999px;
    }

    .box {
      width: 100%;
      height: 100vh;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      /*display: flex;
        flex-direction: column;
        justify-content: space-between;*/

      .up {
        width: 100%;
        height: auto;
        /*margin-top: 20px;*/
        /*margin-top: 108px;*/
        position: absolute;
        top: 20px;
        left: 0;

        .frequency {
          margin: 0 auto;
          width: 510px;
          height: 50px;
          background-color: rgba(0, 0, 0, 0.3);
          border-radius: 25px;
          text-align: center;
          line-height: 50px;
          font-size: 28px;
          color: #fff;
        }

        .wheel_frame {
          width: 218px;
          height: 156px;
          background: url("../assests/images/img_box_area@2x.png") 0 0 no-repeat;
          background-size: 100%;
          margin: 130px auto 0;
          z-index: 100;
        }
      }

      .down {
        width: 100%;
        height: auto;
        /*margin-bottom: 52px;*/
        position: absolute;
        bottom: 14px;
        left: 0;

        .move_box {
          width: 218px;
          height: 156px;
          margin: 0 auto;
          // background: url("../assests/images/popup_sign_img@2x.png") 0 0 no-repeat;
          background: #fc0;
          background-size: 100%;
          transition-property: all;
          transition-duration: 0.8s;
          transition-timing-function: ease-out;
        }

        .bear {
          width: 240px;
          height: 440px;
          margin: 0 auto;
          position: relative;
          top: -5px;
        }

        .bear1 {
          background-image: url("../assests/images/conventional@2x.png");
          background-position: 0 0;
          background-repeat: no-repeat;
          background-size: 100%;
          animation: bian 3s step-start infinite;
        }

        .bear2 {
          background-image: url("../assests/images/power@2x.png");
          background-position: 0 0;
          background-repeat: no-repeat;
          background-size: 100%;
          animation: power 0.3s step-start infinite;
        }

        .bear3 {
          /*background-image: url("../assests/images/bear@2x.png") ;
                background-repeat: no-repeat;
                background-position: 0px 0px;
                background-size: 100%;*/
          overflow: hidden;

          img {
            width: 100%;
            height: auto;
            animation: jump 0.8s steps(19) forwards;
          }
        }

        .intro {
          width: 670px;
          margin: 40px auto 0;

          p {
            width: 100%;
            font-size: 28px;
            line-height: 28px;
            color: #fff;
            margin-bottom: 20px;
            text-align: center;
          }
        }

        @keyframes jump {

          /*from{background-position:    0px 0px; }
                to{background-position: 0px -4180px;}*/
          from {
            transform: translateY(0)
          }

          to {
            transform: translateY(-95%)
          }
        }

        @keyframes bian {
          0% {
            background-image: url("../assests/images/conventional@2x.png")
          }

          10% {
            background-image: url("../assests/images/blink@2x.png")
          }
        }

        @keyframes power {
          0% {
            background-image: url("../assests/images/power@2x.png")
          }

          75% {
            background-image: url("../assests/images/power2@2x.png")
          }
        }
      }

      .score {
        width: 100%;
        height: 160px;
        background-color: #29537E;
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        animation: heights 0.3s ease-in;
        display: flex;
        align-items: center;
        justify-content: center;

        .score_icon {
          width: 254px;
          height: 98px;
          color: #fff;
          text-align: center;
          line-height: 98px;
          font-size: 80px;
          font-weight: bold;
          position: relative;
          animation: zoomIns 1s ease-in;

          img {
            width: 254px;
            height: 98px;
            animation: zoomIns 0.9s ease-in;
          }

          .star1,
          .star2,
          .star3,
          .star4,
          .star5 {
            position: absolute;
          }

          .star1 {
            width: 80px;
            height: 80px;
            background: url("../assests/images/img_star_1@2x.png") 0 0 no-repeat;
            background-size: 100%;
            top: -50px;
            left: -92px;
          }

          .star2 {
            width: 88px;
            height: 86px;
            background: url("../assests/images/img_star_2@2x.png") 0 0 no-repeat;
            background-size: 100%;
            top: -56px;
            right: -80px;
          }

          .star3 {
            width: 48px;
            height: 48px;
            background: url("../assests/images/img_star_3@2x.png") 0 0 no-repeat;
            background-size: 100%;
            top: 52px;
            left: -62px;
          }

          .star4 {
            width: 40px;
            height: 40px;
            background: url("../assests/images/img_star_4@2x.png") 0 0 no-repeat;
            background-size: 100%;
            top: 20px;
            left: -36px;
          }

          .star5 {
            width: 56px;
            height: 56px;
            background: url("../assests/images/img_star_5@2x.png") 0 0 no-repeat;
            background-size: 100%;
            top: 56px;
            right: -40px;
          }
        }
      }

    }

    .score_card {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      animation: zoomIn 0.3s ease-in;

      .tits {
        width: 100%;
        font-size: 40px;
        color: #fff;
        line-height: 44px;
        margin-top: 120px;
        text-align: center;
      }

      .num {
        width: 100%;
        font-size: 80px;
        color: #fff;
        line-height: 88px;
        font-weight: bold;
        text-align: center;
        margin: 20px 0 68px;
      }

      .texts {
        width: 100%;
        font-size: 32px;
        color: #fff;
        line-height: 32px;
        text-align: center;
        margin-bottom: 32px;
      }

      .cards {
        margin: 0 auto 40px;
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        height: 400px;

        .left,
        .right,
        .center {
          width: 334px;
          height: 400px;
          border-radius: 8px;
          background-color: #fff;
          box-shadow: 0 0 2px #ccc;

          .ranking {
            width: 100%;
            text-align: center;
            font-size: 32px;
            line-height: 32px;
            color: #55A5FE;
            margin-top: 40px;

            &::before {
              content: '';
              display: inline-block;
              width: 34px;
              height: 26px;
              background: url("../assests/images/icon_home_leaderboard@2x.png") 0 0 no-repeat;
              background-size: 100%;
              margin-right: 12px;
              position: relative;
              top: 2px;
            }
          }

          .avatar {
            width: 120px;
            height: 120px;
            margin: 30px auto 20px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .name {
            width: 294px;
            text-align: center;
            margin: 0 auto 20px;
            font-size: 32px;
            color: #6384F4;
            line-height: 34px;
            @include ellipsis();
          }

          .card-score {
            width: 100%;
            text-align: center;
            font-size: 40px;
            line-height: 44px;
            color: #6384F4;
            font-weight: bold;
          }
        }

        .left {
          background-color: #DDECFE;
          margin-right: 2px;
        }

        .bg_card {
          width: 670px;
          height: 320px;
          background: url("../assests/images/img_score_bg_top@2x.png") 0 0 no-repeat;
          background-size: 100%;
        }

        .center {
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);

          .first {
            width: 40px;
            height: 56px;
            background: url("../assests/images/icon_home_leaderboard_gold@2x.png") 0 0 no-repeat;
            background-size: 100%;
            margin: 28px auto 0;
          }
        }
      }

      .actions {
        width: 670px;
        height: 88px;
        background-color: #6384F4;
        border-radius: 44px;
        text-align: center;
        line-height: 88px;
        font-size: 32px;
        color: #fff;
        margin: 0 auto;
      }

      .underAgain {
        min-height: 64px;
        font-size: 28px;
        font-family: ArialMT;
        color: rgba(255, 255, 255, 1);
        line-height: 32px;
        text-align: center;
        margin: 16px 40px -60px;
      }

      .close {
        width: 54px;
        height: 54px;
        background: url("../assests/images/icon_score_close@2x.png") 0 0 no-repeat;
        background-size: 100%;
        margin: 104px auto 0;
      }
    }

    .popup {
      width: 670px;
      height: 608px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      position: relative;
      overflow: hidden;

      .icon {
        width: 160px;
        height: 160px;
        background: url("../assests/images/myprize_no_date@2x.png") 0 0 no-repeat;
        background-size: 100%;
        margin: 80px auto 40px;
      }

      .texts {
        width: 590px;
        margin: 0 auto;

        p {
          font-size: 32px;
          color: #6384F4;
          line-height: 40px;
          text-align: center;
        }
      }

      .btn {
        width: 590px;
        height: 88px;
        background-color: #6384F4;
        line-height: 88px;
        border-radius: 44px;
        text-align: center;
        font-size: 32px;
        color: #fff;
        position: absolute;
        left: 50%;
        bottom: 80px;
        transform: translateX(-50%);
        cursor: pointer;

        &:active {
          background-color: #4A69BE;
        }
      }

      .b_btn {
        width: 590px;
        height: 88px;
        position: absolute;
        top: 360px;
        left: 40px;
      }

      .close {
        width: 26px;
        height: 26px;
        position: absolute;
        top: 20px;
        right: 20px;
        background: url("../assests/images/icon_popup_close@2x.png") 0 0 no-repeat;
        background-size: 100%;
        cursor: pointer;
      }
    }

    .popupshare {
      width: 100%;
      height: 440px;
      overflow: hidden;
      border-radius: 8px 8px 0px 0px;

      .tit {
        width: 100%;
        font-size: 32px;
        color: #666;
        line-height: 32px;
        margin: 40px 0 42px;
        text-align: center;
      }

      .icon {
        width: 100%;
        height: 120px;
        display: flex;
        margin-bottom: 110px;

        .fb,
        .tw {
          width: 120px;
          height: 120px;
          cursor: pointer;
        }

        .fb {
          background: url("../assests/images/share_icon_facebook_nor2x.png") 0 0 no-repeat;
          background-size: cover;
          margin: 0 60px 0 40px;
        }

        .tw {
          background: url("../assests/images/share_icon_twitter_nor2x.png") 0 0 no-repeat;
          background-size: cover;
        }
      }

      .handle {
        width: 100%;
        height: 88px;
        line-height: 88px;
        text-align: center;
        font-size: 32px;
        color: #333;
        border-top: 2px solid #DFDFDF;
      }
    }

    @keyframes zoomIn {
      0% {
        -webkit-transform: scale3d(.3, .3, .3);
        opacity: 0;
        transform: scale3d(.3, .3, .3)
      }

      50% {
        opacity: 1;
      }
    }

    @keyframes zoomIns {
      0% {
        transform: scale3d(.1, .1, .1)
      }

      60% {}
    }

    @keyframes heights {
      0% {
        height: 0
      }
    }
  }
</style>