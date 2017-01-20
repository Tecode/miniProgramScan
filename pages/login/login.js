
let {getUserOpenId, globalData, request} = getApp();

Page({
  data: {
    userName: '',
    passWord: '',
    dialog: {
      title: '',
      content: '',
      hidden: true
    }
  },
  //事件处理函数
  bindPassWord: function (e) {
    this.data.passWord = e.detail.value;
  },
  bindUserName: function (e) {
    this.data.userName = e.detail.value;
  },
  bindSubmit: function () {
    let {userName, passWord} = this.data;
    if (userName.length === 0) {
      this.setData({
        'dialog.hidden': false,
        'dialog.title': '',
        'dialog.content': '请输入正确的账号！'
      })
    } else if (passWord.length === 0) {
      this.setData({
        'dialog.hidden': false,
        'dialog.title': '',
        'dialog.content': '密码不能为空！'
      })
    } else {
      wx.showToast({
        title: "loading",
        icon: "loading",
        duration: 10000
      })
      request({
        url: globalData.apiUrl.bindApp,
        postdata: {
          userName: this.data.userName,
          passWord: this.data.passWord,
          openid: globalData.openid,
        }, callback: ({data}) => {
          wx.hideToast();
          if (data.code == -1) {
            wx.showModal({
              title: "出错啦！",
              content: data.msg,
              showCancel: false,
              confirmText: "确定"
            })
          } else if (data.code == 0) {
            wx.redirectTo({
              url: '../index/index'
            })
          }
        }
      });
    }
  },
  confirm: function () {
    this.setData({
      'dialog.hidden': true,
      'dialog.title': '',
      'dialog.content': ''
    })
  },
  onLoad: function () {

  }
})