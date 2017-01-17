//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    button: 'Hello World',
  },
  //事件处理函数
  scanCode: () =>{
    wx.scanCode({
      success: (res) => {
        console.log(res)
      }
    })
  },
  validaty:() => {
      wx.navigateTo({
      url: '../validation/validation'
    })
  },
  onLoad: () =>{

  }
})
