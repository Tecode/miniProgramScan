
let {globalData, request} = getApp();


Page({
  data: {
    scrollH: 0,
    listData: [],
    pageindex: 0,
    pagecount: '',
    payState: true,
    payTime: true,
    timeShow: true,
    mask: true,
    startTime: '2016-05-06',
    endTime: '2017-06-09',
    tradeState: '',
  },
  goBack: () => {
    wx.navigateBack({
      delta: 1
    })
  },
  loadMore: function () {
    let {pagecount, pageindex} = this.data;
    if (++pageindex < pagecount) {
      this.setData({
        pageindex: pageindex,
        scrollTop: this.data.scrollTop + 100,
      });
      wx.showToast({
        title: "数据加载中",
        icon: "loading",
        duration: 5000
      })
      request({
        url: globalData.apiUrl.listInfo, postdata: {
          userName: globalData.user,
          tradeState: "",
          startTime: "",
          endTime: "",
          pageIndex: pageindex
        }, callback: ({data}) => {
          wx.hideToast();
          if (data.code == 0) {
            this.setData({
              listData: [...this.data.listData, ...data.data.tradeList]
            });
          }
        }, header: {
          'Authorization': globalData.Authorization
        }
      })
    }
  },
  payStateControl: function () {
    this.setData({
      payState: false,
      mask: false,
      payTime: true,
      timeShow: true,
    });
  },
  payTimeControl: function () {
    this.setData({
      payTime: false,
      mask: false,
      payState: true,
      timeShow: true,
    });
  },
  hiddenMask: function () {
    this.setData({
      payTime: true,
      mask: true,
      payState: true,
      timeShow: true,
    });
  },
  timePeriod: function (e) {
    const {value} = e.target.dataset;
    const {timeShow, mask} = this.data;
    this.setData({
      timeShow: timeShow ? false : true,
      payTime: true,
      mask: false,
      payState: true,
    });
    if (value == "isOK") {
      let {startTime, endTime, tradeState} = this.data;
      this.getStateDate(tradeState, startTime, endTime);
        this.setData({
          mask: true,
        });
    }else if(value == "cancel"){
        this.setData({
          mask: true,
        });
    }
  },
  choiceState: function (e) {
    const { state } = e.target.dataset;
    this.setData({
      timeShow: true,
      payTime: true,
      payState: true,
      mask: true,
      tradeState: state,
    });
    const {startTime, endTime, tradeState} = this.data;
    this.getStateDate(tradeState, startTime, endTime);
  },
  choiceMonth: function (e) {
    const { month } = e.target.dataset;
    this.setData({
      timeShow: true,
      payTime: true,
      mask: true,
      payState: true,
      startTime: this.getTime(-parseInt(month) * 30),
      endTime: this.getTime(0),
    });
    const {startTime, endTime, tradeState} = this.data;
    this.getStateDate(tradeState, startTime, endTime);
  },
  bindDateStart: function (e) {
    this.setData({
      startTime: e.detail.value
    })
  },
  bindDateEnd: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },
  infoDetail: function (e) {
    const {data} = e.target.dataset;
    if (typeof (data) != "undefined") {
      try {
        wx.setStorageSync('cacheData', data)
      } catch (e) {
      }
    }
    wx.navigateTo({
      url: '../detail/detail'
    });
  },
  getTime: timeStamp => {
    const dateTime = new Date((new Date()).getTime() + timeStamp * 24 * 3600 * 1000);
    return dateTime.getFullYear() + '-' +
      (() => {
        if (dateTime.getMonth() + 1 < 10) {
          return "0" + (dateTime.getMonth() + 1)
        } else {
          return dateTime.getMonth() + 1
        }
      })()
      + '-' +
      (() => {
        if (dateTime.getDate() < 10) {
          return "0" + dateTime.getDate()
        } else {
          return dateTime.getDate()
        };
      })()
  },
  onLoad: function () {
    this.setData({
      startTime: this.getTime(0),
      endTime: this.getTime(1),
    })

    wx.getSystemInfo({
      success: (res) => {
        let wh = res.windowHeight;
        let scrollH = wh;
        this.setData({
          scrollH: scrollH,
        });
      }
    })
    this.getStateDate("", "", "");
  },
  getStateDate: function (tradeState, startTime, endTime) {
    request({
      url: globalData.apiUrl.listInfo, postdata: {
        userName: globalData.user,
        tradeState: tradeState,
        startTime: startTime,
        endTime: endTime,
        pageindex: 0
      }, callback: ({data}) => {
        if (data.code == 0 && data.data.tradeList != null) {
          this.setData({
            listData: data.data.tradeList,
            pagecount: data.data.pagecount
          });
        } else {
          this.setData({
            listData: []
          });
        }
      }, header: {
        'Authorization': globalData.Authorization
      }
    })
  }
})