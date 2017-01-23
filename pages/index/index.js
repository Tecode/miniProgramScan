//index.js
//获取应用实例
let {globalData, request} = getApp();
Page({
  data: {
    numbers: [1, 2, 3, 4, 5, 6, 7, 8, 9, ".", 0],
    total: "0"
  },
  //事件处理函数
  scanCode: function () {
    const {total} = this.data;
    if (total == 0) {
      wx.showModal({
        title: "",
        content: "请输入大于0的数字",
        showCancel: false,
        confirmText: "确定"
      })
    } else {
      wx.scanCode({
        success: (res) => {
          wx.showToast({
            title: "微信支付",
            icon: "loading",
            duration: 5000
          })
          if (res.errMsg == "scanCode:ok") {
            console.info(11111111111);
            console.info(res);
            request({
              url: globalData.apiUrl.scanApp,
              postdata: {
                goodsDes: "小程序扫码",
                authCode: res.result.replace("http://", ""),
                goodsPrice: total * 100,
                userName: globalData.user,
              }, callback: ({data}) => {
                wx.hideToast();
                if (data.code == 0) {
                  wx.navigateTo({
                    url: '../validatyPay/validatyPay?price=' + parseFloat(total).toFixed(2)
                  });
                  //定义缓存
                  try {
                    wx.setStorageSync('cacheData', data.data)
                  } catch (e) {
                  }
                } else {
                  wx.showModal({
                    title: "出错啦",
                    content: "获取数据失败",
                    showCancel: false,
                    confirmText: "确定"
                  })
                }
              }, header: {
                'Authorization': globalData.Authorization
              },
            });
          }
        }
      })
    }
  },
  keyDown: function (e) {
    const {num} = e.target.dataset;
    let {total, numbers} = this.data;
    let flot = () => total.slice(total.indexOf(".")).length;
    switch (num) {
      case ".":
        if (total.indexOf(".") < 0) {
          this.setData({
            total: [...total, num].join('')
          })
        }
        break;
      case 0:
        if ((total.charAt(0) != 0 || total.indexOf(".") >= 0) && flot() < 3) {
          this.setData({
            total: [...total, num].join('')
          })
        }
        break;
      default:
        total = total === "0" ? "" : total;
        if (flot() < 3) {
          this.setData({
            total: [...total, num].join('')
          })
        }
    }
  },
  deletNumber: function () {
    let {total} = this.data;
    total = total.length == 1 ? "0" : total.substring(0, total.length - 1);
    this.setData({
      total: total,
    })
  },
  validaty: function () {
    const {total} = this.data;
    if (total == 0) {
      wx.showModal({
        title: "",
        content: "请输入大于0的数字",
        showCancel: false,
        confirmText: "确定"
      })
    } else {
      wx.showToast({
        title: "微信支付",
        icon: "loading",
        duration: 5000
      })
      request({
        url: globalData.apiUrl.scanQRcode,
        postdata: {
          goodsDes: "小程序扫码",
          goodsPrice: total * 100,
          userName: globalData.user,
        }, callback: ({data}) => {
          wx.hideToast();
          if (data.code == 0) {
            wx.navigateTo({
              url: '../code/code?price=' + parseFloat(total).toFixed(2)
            });
            //定义缓存
            try {
              wx.setStorageSync('scanCodeData', data.data)
            } catch (e) {
            }
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
        },
      });
    }
  },
  // 退出登录
  loginOut: function () {
    wx.showModal({
      content: "点击确定按钮会解除绑定并回到登录页面",
      confirmText: "确定",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: "正在退出",
            icon: "loading",
            duration: 5000
          })
          request({
            url: globalData.apiUrl.loginOut,
            postdata: {
              openid: globalData.openid,
            }, callback: ({data}) => {
              wx.hideToast();
              if (data.code == 0) {
                wx.redirectTo({
                  url: '../login/login'
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
            },
          });
        }
      }
    })

  }
})
