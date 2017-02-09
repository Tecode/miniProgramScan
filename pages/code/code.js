
let {globalData, request} = getApp();

Page({
  data: {
    price: "0",
    codeUrl: "",
    trade_no: ""
  },
  onLoad: function ({price}) {
    this.setData({
      price: price
    });
    try {
      var value = wx.getStorageSync('scanCodeData')
      if (value) {
        this.setData({
          codeUrl: value.codeurl,
          trade_no: value.trade_no
        });
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  backToPay:function(){
        wx.redirectTo({
          url: '../index/index'
        })
  },
  validation: function () {
    wx.showToast({
      title: "正在验证",
      icon: "loading",
      duration: 10000
    })
    request({
      url: globalData.apiUrl.validation,
      postdata: {
        userName: globalData.user,
        trade_no: this.data.trade_no,
        pageindex: 0
      }, callback: ({data}) => {
        wx.hideToast();
        if (data.code == 0) {
          try {
            wx.setStorageSync('cacheData', data.data.tradeList[0])
          } catch (e) {
          }
          wx.navigateTo({
            url: '../validatyPay/validatyPay?rdata=3&price=' + this.data.price
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

})