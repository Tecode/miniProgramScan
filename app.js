//app.js
App({
  globalData: {
    apiUrl: {
      appApi: "https://pay.51byod.cn/webapi/apiapp/weapppaysapi",//获取appid
      bindApp: "https://pay.51byod.cn/webapi/apiapp/weapppaysapi?value=weapp",//绑定用户
      scanApp: "https://pay.51byod.cn/webapi/apiapp/payswxApi",//扫一扫
      scanQRcode: "https://pay.51byod.cn/webapi/apiapp/payswxapi?code=pays",//二维码
      validation: "https://pay.51byod.cn/webapi/apiapp/paywxrecordapi?tradeno=no",//验证支付状态
      listInfo: "https://pay.51byod.cn/webapi/apiapp/paywxrecordapi",//获取交易流水
      loginOut: "https://pay.51byod.cn/webapi/apiapp/weapppaysapi?value1=10&value2=09"//退出登录
    },
    hasLogin: false,
    openid: null,
    user: "",
    Authorization: ""
  },
  request: function ({url, postdata, callback, header}) {
    let self = this;
    wx.request({
      url: url,
      data: postdata,
      method: "post",
      success: function (res) {
        callback.call(this, res);
        console.info(res);
      },
      header: header,
      fail: function (res) {
        callback.call(this, res);
        console.log('拉取失败，将无法正常使用开放接口等服务', res)
      }
    })
  },
  getUserOpenId: function (fn) {
    let self = this;
    wx.login({
      success: function (data) {
        self.request({
          url: self.globalData.apiUrl.appApi,//获取数据
          postdata: { code: data.code },
          callback: (res) => {
            if (res.data.code == 0) {
              console.log('拉取openid成功', res);
              self.globalData.user = res.data.data.user;
              self.globalData.Authorization = res.data.data.uAuthorization;
            }
            self.globalData.openid = res.data.data.userOpenid;
            fn(res);
          }
        });
      },
      fail: function (err) {
        console.log('wx.login 接口调用失败，将无法正常使用开放接口等服务', err)
        fn(err)
      }
    })
  },
  bind: function ({userName,passWord}) {
      this.request({
        url: this.globalData.apiUrl.bindApp,
        postdata: {
          userName: userName,
          passWord: passWord,
          openid:this.globalData.openid,
        }, callback: ({data}) => {
          wx.hideToast();
          if (data.code !=0) {
            wx.showModal({
              content: data.msg,
              showCancel: false,
              confirmText: "确定",
              confirmColor:'#028bff'
            })
          } else if (data.code == 0) {
              this.globalData.user = data.data.user;
              this.globalData.Authorization = data.data.uAuthorization;
            wx.redirectTo({
              url: '../index/index'
            })
          }
        }
      });
  },
  onLaunch: function () {
    try {
      const data = wx.getStorageSync('cacheData');
      if (data) {
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    };

    this.getUserOpenId(({data}) => {
      if (data.code == 0) {
        wx.redirectTo({
          url: '/pages/index/index'
        })
      } else {
        wx.redirectTo({
          url: '/pages/login/login'
        })
      }
    });
  },
  onShow: function () {
    // 页面初始化 options为页面跳转所带来的参数
    // this.getUserOpenId(({data}) => {
    //   if (data.code == 0) {
    //     wx.redirectTo({
    //       url: '/pages/index/index'
    //     })
    //   } else {
    //     wx.redirectTo({
    //       url: '/pages/login/login'
    //     })
    //   }
    // });
  }
})