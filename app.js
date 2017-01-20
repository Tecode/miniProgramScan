//app.js
App({
  globalData: {
    apiUrl: {
      appApi: "https://pay.51byod.cn/webapi/apiapp/weapppaysapi",//获取appid
      bindApp: "https://pay.51byod.cn/webapi/apiapp/weapppaysapi?value=weapp",//绑定用户
      scanApp: "https://pay.51byod.cn/webapi/apiapp/payswxApi",//扫一扫
      scanQRcode: "https://pay.51byod.cn/webapi/apiapp/payswxapi?code=pays",//二维码
      validation: "https://pay.51byod.cn/webapi/apiapp/paywxrecordapi?tradeno=no",//验证支付状态
      listInfo: "https://pay.51byod.cn/webapi/apiapp/paywxrecordapi"//获取交易流水
    },
    hasLogin: false,
    openid: null,
    user: "",
    Authorization: ""
  },
  request: function ({url, postdata, callback,header}) {
    let self = this;
    wx.request({
      url: url,
      data: postdata,
      method: "post",
      success: function (res) {
        callback.call(this, res);
        console.info(res);
      },
      header:header,
      fail: function (res) {
        callback.call(this, res);
        console.log('拉取失败，将无法正常使用开放接口等服务', res)
      }
    })
  },
  getUserOpenId: function (fn) {
    let self = this;
    if (self.globalData.openid) {
      fn(null, self.globalData.openid)
    } else {
      wx.login({
        success: function (data) {
          console.info(data.code)
          self.request({
            url: self.globalData.apiUrl.appApi,//获取数据
            postdata: { code: data.code },
            callback: (res) => {
              console.log('拉取openid成功', res);
              self.globalData.user = res.data.data.user;
              self.globalData.Authorization = res.data.data.uAuthorization;
              fn(res);
              self.globalData.openid = res.data.data.userOpenid;
            }
          });

        },
        fail: function (err) {
          console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
          fn(err)
        }
      })
    }
  },
  onLaunch: function () {
    try {
      const data = wx.getStorageSync('cacheData');
      if (data) {
        console.info(data)
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }

    this.getUserOpenId(({data}) => {
      if (data.code == 0) {
        wx.redirectTo({
          url: '/pages/index/index'
        })
      }
    });
  },
})