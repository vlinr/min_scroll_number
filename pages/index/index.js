//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    couponNumber: 0,  //最后停止的值
    nowCouponNumber: 500,  //现在的值
    scrollNumberIsEnd: true,  //滚动是否结束
 
  },
  onShareAppMessage() {

  },
  executeCallBack(e) {
    let self = this;
    self.setData({
      scrollNumberIsEnd: true
    })
  },
  //获取随机数
  getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  handleNumberScroll() {
    let self = this;
    let scrollNumber = this.selectComponent('#numberScroll');
    let timer = setInterval(() => {
      if (self.data.scrollNumberIsEnd) { //如果执行结束
        let rnd = self.getRandom(3, 8);
        let now = this.data.nowCouponNumber - rnd;
        if (now <= this.data.couponNumber) {
          now = this.data.couponNumber;
          clearInterval(timer); //清除计时器
        }
        self.setData({
          scrollNumberIsEnd: false,
          nowCouponNumber: now
        });
        scrollNumber.startScroll();
      }
    }, 3500);
  },
  onLoad: function () {
    this.handleNumberScroll();
  }
})