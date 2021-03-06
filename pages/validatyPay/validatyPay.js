
let {globalData, request} = getApp();

Page({
  data: {
    price: "0",
    rdata: {}
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
        userName: globalData.user,
        trade_no: (() =>{
          if(typeof(self.data.rdata.trade_no)!="undefined"){
            return self.data.rdata.trade_no
          }else{
            return self.data.rdata.tradeNum 
          }
        })(),
        pageindex: 0
      }, callback: ({data}) => {
        wx.hideToast();
        if (data.code == 0) {
          this.setData({
            rdata: data.data.tradeList[0],
          });
          //清理缓存缓存
        } else {
          wx.showModal({
            title: "出错了",
            content: "验证失败",
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
        this.setData({
          rdata: value,
        });
        this.validatyAgin();
      }
    } catch (e) {
      // Do something when catch error
    }
  }
})


