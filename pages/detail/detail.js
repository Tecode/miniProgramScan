// pages/detail/detail.js

Page({
  data:{
    info:{}
  },
  onLoad:function(options){
    try {
      const data = wx.getStorageSync('cacheData');
      if (data) {
        this.setData({
          info: data,
        });
        // Do something with return value
      }
    } catch (e) {
      // Do something when catch error
    }
  },
  onReady:function(){
    // 页面渲染完成
  },
  onShow:function(){
    // 页面显示
  },
  onHide:function(){
    // 页面隐藏
  },
  onUnload:function(){
    // 页面关闭
  }
})