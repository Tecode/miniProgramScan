
let {globalData} = getApp();

Page({
  data: {
    price: globalData.price,
  },
  visibleCode:() => {
      wx.navigateTo({
      url: '../code/code'
    })
  },
  onLoad: () =>{

  }
})
