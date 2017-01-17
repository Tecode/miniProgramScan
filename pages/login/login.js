Page({
  data: {
    motto: 'Hello World',
    userInfo: {}
  },
  //事件处理函数
  bindViewTap: () =>{
      wx.navigateTo({
      url: '../index/index'
    })
  },
  onLoad: () =>{
    console.log('onLoad')
    var that = this
    //调用应用实例的方法获取全局数据
    app.getUserInfo(() =>{
              //更新数据
      that.setData({
        userInfo:userInfo
      })
    })
  }
  })