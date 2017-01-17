
Page({
  data: {
    button: 'Hello World',
  },
  visibleCode:() => {
      wx.navigateTo({
      url: '../code/code'
    })
  },
  onLoad: () =>{

  }
})
