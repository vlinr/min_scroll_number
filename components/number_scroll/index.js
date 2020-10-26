Component({
  properties: { //组件属性
    endNumber: { //结束值
      type: Number,
    },
    startNumber: { //开始值
      type: Number
    },
    transition: {  //每一个数字过渡时间
      type: Number,
      value: 0.3
    },
    fontSize: {  //字体大小
      type: Number,
      value: 20
    },
    fontColor: {  //字体颜色
      type: String,
      value: '#333'
    },
    utilExecuteTime: { //是否是统一执行时间
      type: Boolean,
      value: false
    },
    delay:{ //延迟多久执行，针对自动执行首次有效
      type:Number,
      value:100
    },
    autoPlay:{  //是否自动开始
      type:Number,
      value:true
    },
    executeCallBack:{ //执行完毕回调
      type:Function
    }
  },
  data: { //内部属性
    numberList: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9], //数字的基准值
    executeTransition: 0, //过度时间
    executeArr: [],
    isStartRender: true, // 是否是渲染开始
    executeTransitionArr: [], //渲染所需要的时间
    startNumberArr:[],
    endNumberArr:[],
    fristExecute:false ,//是否是首次执行
  },
  ready() {},
  attached() {
    this.setFontRealHeight();
    this.checkParamsIsOk();
    this.initial(true);
    
  },
  
  methods: { //方法，内部
    //设置真实的高度
    setFontRealHeight(){
      const {windowWidth} = wx.getSystemInfoSync();
      let realSize = windowWidth / 375 * this.data.fontSize; //真实的大小
      this.setData({
        fontSize:realSize.toFixed(2)
      })
    },
    checkParamsIsOk(){
      if(this.data.startNumber == null || this.data.startNumber == undefined){
        throw new Error('startNumber is not value!');
        return;
      }
      if(this.data.endNumber == null || this.data.endNumber == undefined){
        throw new Error('endNumber is not value!');
        return;
      }
    },
    initial(first){
      //初始化展示
      //判断是增加还是减少
      let isUp = this.data.endNumber - this.data.startNumber >= 0;
      let startNumberArr = this.data.startNumber.toString().split(''); //开始数组
      let endNumberArr = this.data.endNumber.toString().split(''); //结束数组
      if (isUp) { //如果是上涨，并且位数不一样，证明start的时候有添加的0位置
        let reduce = endNumberArr.length - startNumberArr.length;
        if (reduce > 0) {
          //结束的位数超过了开始的位数
          for (let i = 0; i < reduce; ++i) {
            startNumberArr.unshift('0'); //向前面添加内容
          }
        }
      } else { //下降
        let reduce = startNumberArr.length - endNumberArr.length;
        if (reduce > 0) {
          for (let i = 0; i < reduce; ++i) {
            endNumberArr.unshift('0'); //向前面添加内容
          }
        }
      }
      //初始化显示
      this.setData({
        executeArr: startNumberArr,
        startNumberArr,
        endNumberArr,
        fristExecute:first
      })
      if(this.data.autoPlay)this.startScroll(); //自动开始
    },
    startScroll() {
      if(!this.data.autoPlay)this.initial(false);
      this.executeAnimation(this.data.startNumberArr,this.data.endNumberArr);
    },
    //配置执行过度
    executeAnimation(startNumberArr,endNumberArr) {
      let self = this;
      //加个延迟制作滚动
      setTimeout(() => {
        let executeTime = self.computedReduce(startNumberArr, endNumberArr);
        if (self.data.utilExecuteTime) {
          executeTime.fill(Math.max(...executeTime))
        }
        self.setData({
          executeArr: endNumberArr,
          executeTransitionArr: executeTime,
          executeTransition: self.data.transition
        })
        self.callback(endNumberArr,executeTime);
      }, self.data.fristExecute?self.data.delay:0);
    },
    callback(endNumberArr,executeTime){
      let self = this;
      //回调方法
      setTimeout(() => {
        self.triggerEvent('executeCallBack',{
          result:endNumberArr.join('')
        })
      }, Math.max(...executeTime) * self.data.executeTransition * 1000);
    },
    //计算差值
    computedReduce(startArr, endArr) {
      let result = [];
      for (let i = 0, len = startArr.length; i < len; i++) {
        let itemA = startArr[i];
        let itemB = endArr[i];
        result.push(Math.abs(itemA - itemB))
      }
      return result;
    }
  }

})