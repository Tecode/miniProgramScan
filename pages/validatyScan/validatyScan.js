
let {globalData, request} = getApp();

Page({
  data: {
    price: "0",
    rdata: {},
    state:''
  },
  validatyAgin: function () {
    wx.showToast({
      title: "正在验证",
      icon: "loading",
      duration: 10000
    })
    let self = this;
    request({
      url: globalData.apiUrl.validation,
      postdata: {
        user: globalData.user,
        trade_no: self.data.rdata.trade_no,
        pageindex: 0
      }, callback: ({data}) => {
        wx.hideToast();
        if (data.code == 0) {
          this.setData({
            rdata: data.data.rdata[0],
          });
        } else {
          wx.showModal({
            title: "",
            content: data.msg,
            showCancel: false,
            confirmText: "确定"
          })
        }
      }, header: {
        'Authorization': globalData.Authorization
      }
    })
  },
  backToPay: function () {
      wx.redirectTo({
        url: '../index/index'
      })
  },
  onLoad: function ({price}) {
    this.setData({
      price: price,
    });
    try {
      var value = wx.getStorageSync('cacheData')
      if (value) {
        console.info(value)
        this.setData({
          rdata: value
        });
        this.validatyAgin();
      }
    } catch (e) {
      // Do something when catch error
    }
  }
})


