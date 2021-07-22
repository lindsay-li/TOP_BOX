<template>
  <div class="container" v-if="completed">
    <headers titles="Surprise Box" v-if="showTitle"></headers>
    <div class="bg">
      <img :src="activityInfo.background_h5" alt="">
      <div class="rule" @click="goRule">Rule</div>
      <div class="share" @click="openShare">Share</div>
      <!-- <div class="title">See What's Inside</div> -->
      <!-- <div class="count_down">
               <van-count-down :time="count_time">
                    <template v-slot="timeData">
                        <span class="cout_tit">Time Left:</span>
                        <span class="count_item">{{ timeData.days>=10?timeData.days:'0'+timeData.days }}</span>
                        <span class="cout_tit">Days</span>
                        <span class="count_item">{{ timeData.hours>=10?timeData.hours:'0'+timeData.hours }}</span>
                        <span class="count_d">:</span>
                        <span class="count_item">{{ timeData.minutes>=10?timeData.minutes:'0'+timeData.minutes }}</span>
                        <span class="count_d">:</span>
                        <span class="count_item">{{ timeData.seconds>=10?timeData.seconds:'0'+timeData.seconds }}</span>
                    </template>
               </van-count-down>
           </div> -->
      <!-- palyer now -->
      <div class="sur_prize">
        <div class="prize_icon">
          <img src="../assests/images/home_bg_gift@2x.png" alt="">
        </div>
        <div class="prize-list">
          <div class="prize-title">Mystery Prize</div>
          <!-- <div class="prize-intro">
                    <p>The top {{topNumber}} winners can win prizes. The prize will be automatically added to "my prize". Please check it in time.</p>
                    <p>The top {{topNumber}} users will be rewarded with prizes provided by Levoit, Cosori, and Etekcity. Tap "My Prize" to see your winnings. Make sure you use them before it expires. </p>
               </div> -->
          <div class="prize-all" v-if="activity_award.length<3" :class="activity_award.length>2?'prize-all-more':''">
            <div class="prize-item" v-for="(item,index) in activity_award" :key="index">
              <div class="left">
                <img :src="item.award_pic" alt="">
                <div class="bottom">
                  {{item.rank_start}}{{item.rank_start==1?'st':'th'}}~{{item.rank_end}}{{item.rank_start &lt; 2?'rd':'th'}}
                </div>
              </div>
              <div class="right" :class="activity_award.length==2?'right-38':''"><span>{{item.product_name}}</span>
              </div>
              <!-- <div class="left">
            {{item.rank_start}}{{item.rank_start==1?'st':'th'}}~{{item.rank_end}}{{item.rank_start <= 2?'sd':'th'}}
          </div>
          <div class="center">
            <img :src="item.award_pic" alt="">
          </div>
          <div class="right"><span>{{item.product_name}}</span></div> -->
            </div>
          </div>
          <div class="prize-all" v-if="activity_award.length>2" :class="activity_award.length>2?'prize-all-more':''">
            <div class="prize-item" v-for="(item,index) in activity_award" :key="index"
              :class="(index==0&&activity_award.length==3)?'item-3':''">
              <div class="left">
                <img :src="item.award_pic" alt="">
                <div class="bottom">
                  {{item.rank_start}}{{item.rank_start==1?'st':'th'}}~{{item.rank_end}}{{item.rank_start &lt;= 2?'rd':'th'}}
                </div>
                <p>{{item.product_name}}</p>
              </div>
            </div>
          </div>
          <div class="myprize" @click="goMyprize">
            <span>My Prizes</span>
            <div class="right"></div>
          </div>
        </div>
      </div>

    </div>
    <div class="count_down" v-show="actLive">
      <van-count-down :time="count_time">
        <template v-slot="timeData">
          <span class="cout_tit">Time Left:</span>
          <span class="count_item">{{ timeData.days>=10?timeData.days:'0'+timeData.days }}</span>
          <span class="cout_tit">Days</span>
          <span class="count_item">{{ timeData.hours>=10?timeData.hours:'0'+timeData.hours }}</span>
          <span class="count_d">:</span>
          <span class="count_item">{{ timeData.minutes>=10?timeData.minutes:'0'+timeData.minutes }}</span>
          <span class="count_d">:</span>
          <span class="count_item">{{ timeData.seconds>=10?timeData.seconds:'0'+timeData.seconds }}</span>
        </template>
      </van-count-down>
    </div>
    <div class="play" @click="goGames">Play {{actLive?'Now':'Game'}}</div>
    <!-- 排行榜 -->
    <div class="top-list">
      <div class="list-title">
        <span>Leaderboard</span>
      </div>
      <div class="tab">
        <van-tabs @click="onClick" :line-width="30" color="#55A5FE" title-active-color="#55A5FE"
          title-inactive-color="#666666">
          <van-tab title="Now"></van-tab>
          <van-tab title="All"></van-tab>
        </van-tabs>
      </div>
      <p class="underNow" v-show="!actLive">The new phase of the activity has not started, this score is not included in
        the score.</p>
      <div class="self">
        <div class="left">
          <div class="ranking">{{rankInfo.rank>=1000?'999+':rankInfo.rank}}</div>
          <div class="avatar">
            <img :src="rankInfo.app_user.avatar_icon" alt="" v-if="rankInfo.app_user">
          </div>
          <div class="name">{{rankInfo.app_user?rankInfo.app_user.nickName:""}}</div>
        </div>
        <div class="right" v-if="rankInfo.highest_score">{{tab=='Now'?rankInfo.highest_score:rankInfo.total}}</div>
        <div class="right" v-else>{{rankInfo.total}}</div>
      </div>
      <pullup-reload @on-infinite-load="onInfiniteLoad" :parent-pull-up-state="infiniteLoadData.pullUpState">
        <div class="item" v-for="(item,index) in rankdata" :key="index" v-show="rankdata.length>0">
          <div class="left">
            <div class="ranking" v-show="item.rank>3">{{item.rank}}</div>
            <div class="medal" v-show="item.rank<=3">
              <div class="img">
                <img src="../assests/images/icon_home_leaderboard_gold@2x.png" alt="" v-if="item.rank == 1">
                <img src="../assests/images/icon_home_leaderboard_silver@2x.png" alt="" v-else-if="item.rank == 2">
                <img src="../assests/images/icon_home_leaderboard_copper@2x.png" alt="" v-else>
              </div>
            </div>
            <div class="avatar">
              <img :src="item.app_user.avatar_icon" alt="">
            </div>
            <div class="name">{{item.app_user.nickName}}</div>
          </div>
          <div class="right">{{tab=='Now'?item.highest_score:item.total}}</div>
        </div>
        <div class="list-data" v-show="rankdata.length==0">No Data</div>
      </pullup-reload>
    </div>

    <!-- 返回顶部 -->
    <div class="backTop" v-if="btnFlag" @click="backTop">
      <div class="icons"></div>
    </div>
    <!-- 分享弹窗 -->
    <van-popup v-model="show" round :close-on-click-overlay="false" position="bottom">
      <div class="popup">
        <div class="tit">Share to:</div>
        <div class="icon">
          <div class="fb" @click="shareOther('fb')"></div>
          <!-- <div class="tw"  @click="shareOther('twitter')"></div> -->
        </div>
        <div class="handle" @click="closeShare">Cancel</div>
      </div>
    </van-popup>
    <!-- 游客登录确认弹窗 -->
    <van-popup v-model="loginShow" :close-on-click-overlay="false">
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
        <div class="title">This activity is only open to VeSync users. Please download the VeSync app to particpate.
        </div>
        <div class="btn_down" @click="goLog">Download Now</div>
        <div class="close" @click="closeLog"></div>
      </div>
    </van-popup>
    <!-- 弹窗前的等待 -->
    <transition name="fade">
      <div class="modes" v-show="overlay">
        <van-loading color="#3ACCFE" type="spinner" size="48px" />
      </div>
    </transition>
    <!-- 弹窗 -->
    <prop :show="openModel" :step="rank" :awardata="awardObj" :award="award" @closeBtn="closeModel"></prop>
  </div>
  <div v-else class="loadings">
    <van-loading color="#3ACCFE" size="48px" v-show="!no_data" />
    <div class="no-active" v-show="no_data">No open events</div>
  </div>
</template>
<script>
  import prop from '../components/prop'
  import headers from '../components/header'
  import pullupReload from '../components/pullUpReload'
  export default {
    components: {
      headers,
      prop,
      pullupReload
    },
    data() {
      return {
        show: false, //分享弹窗 
        openModel: false, //获取code结果弹窗
        isCongrat: true, //是否获取到
        btnFlag: false, //回到顶部显示
        overlay: false, //等待弹窗
        showTitle: false, //是否显示导航栏
        isloading: false, //loading
        scrollTop: 0, //滚动距离
        actLive: false, //是否在活动时间内
        // 上拉加载的设置
        infiniteLoadData: {
          initialShowNum: 3, // 初始显示多少条
          everyLoadingNum: 3, // 每次加载的个数
          pullUpState: 0, // 子组件的pullUpState状态
          pullUpList: [], // 上拉加载更多数据的数组
          showPullUpListLength: this.initialShowNum // 上拉加载后所展示的个数
        },
        popup: null,
        activityInfo: {},
        activity_award: [],
        rank: 1,
        awardObj: {
          activity_no: '',
          product: {
            product_type: '',
            group_code_end_at: '',
            coupon_discount: '',
            group_code: '',
            product_name: '',
            link: ''
          }
        },
        rankInfo: {
          app_user: {
            avatar_icon: '',
            nickName: ''
          }
        },
        rankdata: [],
        nowInfo: {},
        nowdata: [],
        historyInfo: {},
        historydata: [],
        tab: 'Now',
        nowPage: 1,
        historyPage: 1,
        first: true,
        completed: true,
        topNumber: 1,
        award: false,
        user_log_id: '',
        no_data: false,
        user_type: 1, // 1 app  2 游客
        loginShow: false,
        download: false,
        topList_info: {},
        userInfo_list: {},
        count_time: 0
      }
    },
    created() {
      // this.getList()
      // this.getUser()
    },
    mounted() {
      window.addEventListener('scroll', this.scrollToTop)
    },
    methods: {
      getList() {
        this.$http('/api/box/activityInfo', 'POST', {})
          .then(res => {
            console.log(res)
            if (res.code == 0) {

              this.activityInfo = res.data.activity
              this.activity_award = res.data.activity_award
              this.count_time = res.data.activity.end_at
              this.gettop(this.activityInfo.id)
              this.getToplist(this.activityInfo.id, this.nowPage, 'highest', 1)
              this.getToplist(this.activityInfo.id, this.historyPage, 'total', 2)
              let arr = []
              for (let i = 0; i < this.activity_award.length; i++) {
                arr.push(this.activity_award[i].rank_end)
              }
              this.topNumber = Math.max(...arr);
              this.completed = true
              this.no_data = false
            } else if (res.code == 400003) {
              this.$toast('No open events')
              this.no_data = true
            }
          })
          .catch(err => {

          })
      },
      getUser() {
        this.$http('api/box/activityUser', 'POST', {})
          .then(res => {
            console.log(res)

            if (res.code == 0) {
              this.popup = res.data.popup
              this.user_log_id = res.data.user_log_id
              this.user_type = res.data.user.user_type
              this.openAward()
              localStorage.setItem('user_types', this.user_type)
            }
          })
          .catch(err => {

            this.user_type = 2
            localStorage.setItem('user_types', this.user_type)
          })
      },
      gettop(id) {
        let data = {
          activity_id: id
        }
        this.$http('/api/box/myIndexRank', 'POST', data)
          .then(res => {
            console.log(res)
            // alert('user'+JSON.stringify(res))
            if (res.code == 0) {
              this.topList_info = res.data
              if (this.tab == 'Now') {
                this.rankInfo = this.topList_info.highest_rank ? this.topList_info.highest_rank : {
                  app_user: {
                    avatar_icon: '',
                    nickName: ''
                  }
                }
              } else {
                this.rankInfo = this.topList_info.total_rank ? this.topList_info.total_rank : {
                  app_user: {
                    avatar_icon: '',
                    nickName: ''
                  }
                }
              }
            }
          })
          .catch(err => {
            // alert('err'+JSON.stringify(err))
            this.rankInfo = {
              app_user: {
                avatar_icon: '',
                nickName: ''
              }
            }
          })
      },
      openAward() {
        if (this.popup) {

          this.rank = this.popup.rank.rank
          // this.rank = 2
          // this.awardObj = this.popup.activity
          this.award = this.popup.award ? true : false
          // this.award = true
          this.awardObj = Object.assign(this.popup.activity, this.popup.award)
          this.openModel = true
          // this.awardObj =  {
          //     "activity_no": 1,
          //     "activity_name": "第一期活动",
          //     "id": 4,
          //     "user_id": 6,
          //     "activity_id": 1,
          //     "game_log_id": 103,
          //     "product_id": 5,
          //     "award_rank": 1,
          //     "code": "kk01232-dd13545",
          //     "popup": 0,
          //     "expired_end_at":"2019-09-21 00:00:00",
          //     "created_at": "1970-01-01 00:00:00",
          //     "updated_at": "1970-01-01 00:00:00",
          //     "product": {
          //         "id": 5,
          //         "unique_code": "DHZ201908280005",
          //         "asin": "zzz1115",
          //         "product_type": 1,
          //         "product_name": "iphone",
          //         "award_pic": null,
          //         "product_pic": "tupiandizhi.png",
          //         "product_title": "标题标题标题标题",
          //         "product_des": "描述描述",
          //         "entity_amount": 50,
          //         "entity_use": null,
          //         "coupon_discount": "$20-off",
          //         "link": "www.baidu.com",
          //         "code_type": "",
          //         "group_code": "DASKD-136SDASD-DSD",
          //         "group_code_amount": 0,
          //         "group_code_use": 0,
          //         "group_code_start_at": null,
          //         "group_code_end_at": '2019.9.16',
          //         "operator": "cloudy",
          //         "enabled": 1,
          //         "created_at": "1567064157",
          //         "updated_at": "1567064157",
          //         "deleted_at": null
          //     }
          // }

        }
      },
      getToplist(id, page, str, flag) {
        let data = {
          rank_type: str,
          activity_id: id
        }
        this.infiniteLoadData.pullUpState = 1
        this.$http(`/api/box/indexRank/${page}/15`, 'POST', data)
          .then(res => {
            console.log(res)
            this.infiniteLoadData.pullUpState = 0
            if (res.code == 0) {
              if (flag == 1) {
                //实时
                if (res.data.rank.length < 15) {
                  this.infiniteLoadData.pullUpState = 2
                  if (res.data.rank.length == 0) {
                    if (this.nowPage > 1) {
                      this.nowPage--
                    }

                  }
                }
                this.nowdata.push(...res.data.rank)
              } else if (flag == 2) {
                //历史
                if (res.data.rank.length < 15) {
                  this.infiniteLoadData.pullUpState = 2
                  if (res.data.rank.length == 0) {
                    if (this.historyPage > 1) {
                      this.historyPage--
                    }

                  }
                }
                this.historydata.push(...res.data.rank)
              }
              this.rankdata = []
              if (this.tab == 'Now') {
                this.rankdata.push(...this.nowdata)
                if (this.rankdata.length % 15 == 0) {
                  this.infiniteLoadData.pullUpState = 0
                } else {
                  this.infiniteLoadData.pullUpState = 2
                }

              } else {
                this.rankdata.push(...this.historydata)
              }
            }
          })
      },
      onClick(name, title) {
        this.tab = title
        this.rankdata = []
        if (this.tab == 'Now') {
          // this.rankInfo = this.nowInfo

          this.rankdata.push(...this.nowdata)

          this.rankInfo = this.topList_info.highest_rank ? this.topList_info.highest_rank : {
            app_user: {
              avatar_icon: '',
              nickName: ''
            }
          }

        } else {
          // this.rankInfo = this.historyInfo
          this.rankdata.push(...this.historydata)
          this.rankInfo = this.topList_info.total_rank ? this.topList_info.total_rank : {
            app_user: {
              avatar_icon: '',
              nickName: ''
            }
          }

        }
        if (Object.values(this.topList_info).length == 0) {
          this.rankInfo = {
            app_user: {
              avatar_icon: '',
              nickName: ''
            }
          }
        }
        if (this.rankdata.length % 15 == 0) {
          this.infiniteLoadData.pullUpState = 0
        } else {
          this.infiniteLoadData.pullUpState = 2
        }
      },
      openShare() {
        this.show = true
      },
      closeShare() {
        this.show = false
      },
      closeModel() {
        this.openModel = false
      },
      closeLog() {
        this.loginShow = false
      },
      goLog() {
        this.loginShow = false
        let fix_id = localStorage.getItem('fix_id')
        if (fix_id == '1') {
          window.location.href = 'http://www.vesync.com'
        } else {
          this.login()
        }
      },
      // 上拉加载
      onInfiniteLoad() {
        console.log(this.infiniteLoadData.pullUpState)
        if (this.infiniteLoadData.pullUpState === 0) {
          this.getPullUpMoreData()
        }
      },
      // 上拉一次加载更多的数据
      getPullUpMoreData() {
        // 异步更新数据
        console.log(this.tab)
        setTimeout(() => {
          if (this.tab == 'Now') {
            this.nowPage += 1
            this.getToplist(this.activityInfo.id, this.nowPage, 'highest', 1)
          } else {
            this.historyPage += 1
            this.getToplist(this.activityInfo.id, this.historyPage, 'total', 2)
          }

        }, 500);
      },
      // 点击图片回到顶部方法，加计时器是为了过渡顺滑
      backTop() {
        const that = this
        let timer = setInterval(() => {
          let ispeed = Math.floor(-that.scrollTop / 5)
          document.documentElement.scrollTop = document.body.scrollTop = that.scrollTop + ispeed
          if (that.scrollTop === 0) {
            clearInterval(timer)
          }
        }, 16)
      },
      // 为了计算距离顶部的高度，当高度大于60显示回顶部图标，小于60则隐藏
      bgscroll(e) {
        this.scrollTop = e.target.scrollTop;
        if (this.scrollTop > 120) {
          this.btnFlag = true
        } else {
          this.btnFlag = false
        }
      },
      goMyprize() {
        this.jumpNative(`${location.origin}${location.pathname}#/myprize?activity_id=${this.activityInfo.id}`,
          'My Prize', true)
      },
      goRule() {
        this.jumpNative(`${location.origin}${location.pathname}#/rule?id=${this.activityInfo.id}`, 'Rule', true)
      },
      goGames() {
        if (this.user_type == 1) {
          this.jumpNative(`${location.origin}${location.pathname}#/game?id=${this.activityInfo.id}`, 'Surprise Box',
            true)
        } else {
          // 游客的话就让注册app并登录
          let fix_id = localStorage.getItem('fix_id')
          if (fix_id == '1') {
            this.download = true
          } else {
            this.download = false
          }
          this.loginShow = true
        }

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
      scrollToTop() {
        this.scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        if (this.scrollTop > 120) {
          this.btnFlag = true
        } else {
          this.btnFlag = false
        }
      },
      shareOther(type) {
        console.log('share___')
        let data = {
          user_log_id: this.user_log_id,
          activity_id: this.activityInfo.id
        }
        this.$http('/api/box/share', 'POST', data)
          .then(res => {
            console.log(res)
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
    },
    destroyed() {
      window.removeEventListener('scroll', this.scrollToTop);
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

    s .no-active {
      font-size: 30px;
      color: #999;
      text-align: center;
    }
  }

  .container {
    width: 100%;
    background-color: #3ACCFE;

    .bg {
      width: 100%;
      // height: 982px;
      position: relative;
      overflow: hidden;

      img {
        width: 100%;
      }

      .rule {
        width: 108px;
        height: 50px;
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        border-radius: 25px 0px 0px 25px;
        line-height: 50px;
        text-align: center;
        font-size: 28px;
        position: absolute;
        top: 130px;
        left: 642px;
      }

      .share {
        width: 108px;
        height: 50px;
        background-color: rgba(0, 0, 0, 0.3);
        color: #fff;
        border-radius: 25px 0px 0px 25px;
        line-height: 50px;
        text-align: center;
        font-size: 28px;
        position: absolute;
        top: 220px;
        left: 642px;

        .share-ic {
          width: 40px;
          height: 40px;
          background: url("../assests/images/icon_share@2x.png") 0 0 no-repeat;
          background-size: 100%;
        }
      }



      .title {
        width: 100%;
        height: 94px;
        text-align: center;
        font-size: 80px;
        color: #fff;
        font-weight: bold;
        line-height: 94px;
        text-shadow: 0px 16px 4px #5E80EF;
        overflow: hidden;
        position: absolute;
        top: 138px;
        left: 50%;
        transform: translateX(-50%);
        font-family: Roboto-Bold, Roboto;
      }
    }

    .sur_prize {
      width: 100%;
      margin-top: -1290px;

      .prize_icon {
        width: 576px;
        height: 154px;
        margin: -30px auto 0;

        img {
          width: 100%;
          height: 100%;
        }
      }
    }

    .prize-list {
      width: 670px;
      // height: 328px;
      max-height: 408px;
      margin: 0 auto 0;
      background-color: #fff;
      border-radius: 8px;
      position: relative;
      top: -50px;

      .prize-title {
        width: 280px;
        height: 80px;
        border-radius: 40px;
        background-color: #fff;
        line-height: 80px;
        text-align: center;
        font-size: 32px;
        color: #6384F4;
        position: relative;
        top: -40px;
        margin: 0 auto;
      }

      .prize-intro {
        width: 630px;
        height: 128px;

        margin: 0px auto 40px;

        p {
          font-size: 28px;
          color: #030303;
          line-height: 32px;
          font-family: ArialMT;
        }
      }

      .prize-banner {
        width: 630px;
        height: 200px;
        border-radius: 8px;
        background-color: #F1FAFE;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;

        .left {
          width: 160px;
          height: 32px;
          text-align: center;
          line-height: 32px;
          font-size: 32px;
          color: #6384F4;
        }

        .center {
          width: 160px;
          height: 160px;
          margin: 0 20px;

          img {
            width: 100%;
            height: 100%;
            border-radius: 8px;
          }
        }

        .right {
          width: 230px;
          height: 160px;
          color: #333;
          font-size: 28px;
          line-height: 32px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;

          span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }
        }
      }

      .prize-all {
        width: 590px;
        height: 200px;
        margin: -40px auto 32px;
        background: rgba(241, 250, 254, 1);

        border-radius: 8px;
        display: flex;
        align-items: center;
        // justify-content: center;
        overflow: scroll;
        position: relative;
        // top: -50px;
      }

      .prize-all-more {
        height: 280px;
        margin-top: -40px;
        width: 630px;
        padding-left: 20px;

        .prize-item {
          height: 240px;
          align-items: start;
          margin-left: 0;
          width: 160px;
          margin-right: 18px;

          p {
            margin-top: 8px;
            min-height: 72px;
            line-height: 24px;
            font-size: 24px;
            text-align: center;
          }
        }

        .item-3 {
          margin-left: 35px;
        }
      }

      .prize-item {
        width: 550px;
        height: 160px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 20px 20px;

        .left {
          width: 160px;
          height: 160px;
          color: #6384F4;
          position: relative;
          flex-shrink: 0;
          border-radius: 8px;

          .bottom {
            text-align: center;
            line-height: 40px;
            font-size: 28px;
            width: 160px;
            height: 40px;
            background: rgba(229, 229, 229, 1);
            border-radius: 0px 0px 8px 8px;
            position: absolute;
            top: 120px;
          }

          p {
            margin-left: 8px
          }
        }


        .right {
          flex-grow: 1;
          width: 160px;
          height: 120px;
          color: #333;
          font-size: 28px;
          line-height: 28px;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          margin-left: 20px;

          span {
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 4;
            -webkit-box-orient: vertical;
          }

        }

        .right-38 {
          margin-right: 38px;
        }
      }

      .empt {
        height: 22px;
        width: 100%;

      }

      .myprize {
        width: 100%;
        line-height: 24px;
        text-align: center;
        position: relative;
        // top: -50px;
        padding-bottom: 32px;

        span {
          font-size: 24px;
          color: #55A5FE;
          margin-right: 8px;
          // &::after {
          //   content: '';
          //   display: inline-block;
          //   width: 8px;
          //   height: 18px;
          //   // background: url("../assests/images/icon_arrow@2x.png") 0 0 no-repeat;
          //   // background-size: 100%;
          //   margin-left: 4px;
          //   // position: relative;
          //   // top: -4px;
          // }
        }

        .right {
          width: 10px;
          height: 18px;
          background: url("../assests/images/icon_arrow_right@2x.png") no-repeat;
          background-size: 100%;
          display: inline-block;
          position: relative;
          top: 2px;

        }

        // i {
        //   border: solid #D8D8D8;
        //   border-width: 0 2px 2px 0;
        //   display: inline-block;
        //   padding: 3px;
        //   width: 15px;
        //   height: 15px;
        //   position: relative;
        //   top: -1px;
        // }

        //   .right {
        //     transform: rotate(-45deg);
        //     -webkit-transform: rotate(-45deg);
        //   }
      }
    }

    .count_down {
      margin: 40px auto;
      height: 50px;
      // width: 454px;
      display: flex;
      align-items: center;
      justify-content: center;

      .cout_tit {
        font-size: 28px;
        color: #6384F4;
        margin-right: 20px;
      }

      .count_item {
        display: inline-block;
        width: 44px;
        height: 50px;
        background-color: #6384F4;
        border-radius: 8px;
        line-height: 50px;
        text-align: center;
        color: #fff;
        font-size: 28px;
      }

      .count_d {
        font-size: 28px;
        color: #6384F4;
      }
    }

    .play {
      width: 670px;
      height: 88px;
      border-radius: 44px;
      background: rgba(99, 132, 244, 1);
      box-shadow: 0px 4px 12px 0px rgba(43, 141, 183, 0.5);
      color: #fff;
      line-height: 88px;
      text-align: center;
      font-size: 32px;
      margin: 0 auto;
      // position: absolute;
      // left: 50%;
      // top: 864px;
      // transform: translateX(-50%);

      &:active {
        background-color: #455CAA;
      }
    }

    .top-list {
      width: 670px;
      /*height: 1676px;*/
      margin: 80px auto 0;
      background-color: #fff;
      border-radius: 8px 8px 0 0;

      .list-title {
        width: 280px;
        height: 80px;
        line-height: 80px;
        text-align: center;
        position: relative;
        top: -40px;
        background-color: #fff;
        border-radius: 40px;
        margin: 0 auto;

        span {
          font-size: 32px;
          color: #6384F4;

          &::before {
            content: '';
            display: inline-block;
            width: 34px;
            height: 26px;
            background: url("../assests/images/icon_home_leaderboard@2x.png") 0 0 no-repeat;
            background-size: 100%;
            margin-right: 4px;
            position: relative;
            top: 2px;
          }
        }
      }

      .tab {
        margin-top: 30px;
        margin-bottom: 64px;
      }

      .underNow {
        min-height: 64px;
        margin: -44px 40px 40px;
        font-size: 28px;
        font-family: ArialMT;
        color: rgba(153, 153, 153, 1);
        line-height: 32px;
        text-align: center;
      }

      .self {
        width: 100%;
        height: 120px;
        margin-bottom: 40px;
        background-color: #55A5FE;
        display: flex;
        align-items: center;
        justify-content: space-between;

        .left {
          flex: none;
          display: flex;
          align-items: center;

          .ranking {
            width: 120px;
            height: 32px;
            font-size: 32px;
            color: #fff;
            line-height: 32px;
            text-align: center;
          }

          .avatar {
            width: 80px;
            height: 80px;
            margin-right: 20px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .name {
            width: 230px;
            height: 32px;
            line-height: 32px;
            font-size: 32px;
            color: #fff;
            @include ellipsis();
          }
        }

        .right {
          font-size: 40px;
          color: #fff;
          width: 170px;
          margin-right: 40px;
          text-align: right;
          @include ellipsis();
        }
      }

      .item {
        width: 100%;
        height: 120px;
        display: flex;
        align-items: center;
        justify-content: space-between;

        &:nth-child(2n) {
          background-color: #F9F9F9;
        }

        .left {
          flex: none;
          display: flex;
          align-items: center;

          .ranking {
            width: 120px;
            height: 32px;
            font-size: 32px;
            color: #333;
            line-height: 32px;
            text-align: center;
          }

          .medal {
            width: 120px;
            height: 80px;
            flex: none;
            display: flex;
            align-items: center;
            justify-content: center;

            .img {
              width: 40px;
              height: 56px;

              img {
                width: 100%;
                height: 100%;
              }
            }
          }

          .avatar {
            width: 80px;
            height: 80px;
            margin-right: 20px;

            img {
              width: 100%;
              height: 100%;
              border-radius: 50%;
            }
          }

          .name {
            width: 230px;
            height: 32px;
            line-height: 32px;
            font-size: 32px;
            color: #030303;
            @include ellipsis();
          }
        }

        .right {
          font-size: 40px;
          color: #FF3669;
          width: 170px;
          margin-right: 40px;
          text-align: right;
          @include ellipsis();
        }
      }

      .list-data {
        width: 100%;
        height: 120px;
        line-height: 120px;
        text-align: center;
        font-size: 32px;
        color: #999;
      }
    }

    .popup {
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

    .popup_log {
      width: 670px;
      height: 608px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      position: relative;
      overflow: hidden;

      .empt_log {
        width: 100%;
        height: 80px;
      }

      .title {
        width: 590px;
        font-size: 40px;
        line-height: 40px;
        text-align: center;
        color: #6384F4;
        margin: 0 auto 20px;
      }

      .tit {
        width: 590px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        color: #6384F4;
        font-size: 32px;
        margin: 0 auto 50px;
      }

      .pic {
        width: 218px;
        height: 156px;
        margin: 0 auto;

        img {
          width: 100%;
        }
      }

      .btn_log {
        width: 590px;
        height: 88px;
        background: rgba(99, 132, 244, 1);
        box-shadow: 0px 4px 8px 0px rgba(0, 0, 0, 0.2);
        border-radius: 44px;
        font-size: 32px;
        color: #fff;
        line-height: 88px;
        text-align: center;
        margin: 54px auto 0;

        &:active {
          background-color: #4A69BE;
        }
      }

      .close {
        width: 26px;
        height: 26px;
        position: absolute;
        top: 20px;
        right: 20px;
        background: url('../assests/images/icon_popup_close@2x.png') 0 0 no-repeat;
        background-size: 100%;
      }
    }

    .popup_down {
      width: 670px;
      height: 568px;
      background: rgba(255, 255, 255, 1);
      border-radius: 8px;
      position: relative;
      overflow: hidden;

      .title {
        width: 590px;
        height: 80px;
        font-size: 28px;
        color: #6384F4;
        line-height: 40px;
        margin: 160px auto;
      }

      .btn_down {
        width: 400px;
        height: 88px;
        border-radius: 44px;
        background-color: #6384F4;
        text-align: center;
        line-height: 88px;
        margin: 0 auto;
        font-size: 32px;
        color: #fff;

        &:active {
          background-color: #4A69BE;
        }
      }

      .close {
        width: 26px;
        height: 26px;
        position: absolute;
        top: 20px;
        right: 20px;
        background: url('../assests/images/icon_popup_close@2x.png') 0 0 no-repeat;
        background-size: 100%;
      }
    }

    .pmt {
      width: 100%;
      height: 70px;
    }

    .backTop {
      width: 64px;
      height: 64px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 4px 8px 0px rgba(7, 87, 55, 0.3);
      border-radius: 32px;
      position: fixed;
      right: 40px;
      bottom: 372px;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 51;

      &:active {
        background-color: #DEE0DF;
      }

      .icons {
        width: 34px;
        height: 18px;
        background: url("../assests/images/icon_home_up@2x.png") 0 0 no-repeat;
        background-size: 100%;
      }
    }

    .modes {
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .fade-enter-active,
    .fade-leave-active {
      transition: opacity .3s;
    }

    .fade-enter,
    .fade-leave-to

    /* .fade-leave-active below version 2.1.8 */
      {
      opacity: 0;
    }
  }

  @media only screen and (device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio:3) {
    .pmt {
      height: 40px !important;
    }
  }
</style>