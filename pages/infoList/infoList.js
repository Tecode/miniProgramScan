
let {globalData, request} = getApp();


Page({
  data: {
    scrollH: 0,
    listData: [],
    pageindex: 0,
    pagecount: ''
  },
  goBack: () => {
    wx.navigateBack({
      delta: 1
    })
  },
  loadMore: function () {
    let {pagecount, pageindex} = this.data;
    if (++pageindex < pagecount) {
      this.setData({
        pageindex: pageindex,
        scrollTop:this.data.scrollTop+100,
      });
      wx.showToast({
        title: "数据加载中",
        icon: "loading",
        duration: 5000
      })
      request({
        url: globalData.apiUrl.listInfo, postdata: {
          userName: globalData.user,
          tradeState: "",
          startTime: "",
          endTime: "",
          pageIndex: pageindex
        }, callback: ({data}) => {
          wx.hideToast();
          if (data.code == 0) {
            this.setData({
              listData: [...this.data.listData,...data.data.tradeList]
            });
            console.info(this.data.listData.length)
            console.info(this.data.listData)
          }
        }, header: {
          'Authorization': globalData.Authorization
        }
      })
    }
  },
  infoDetail: function (e) {
    const {data} = e.target.dataset;
    if (typeof (data) != "undefined") {
      try {
        wx.setStorageSync('cacheData', data)
      } catch (e) {
      }
    }
    wx.navigateTo({
      url: '../detail/detail'
    });
  },
  onLoad: function () {
        wx.getSystemInfo({
            success: (res) => {
                let wh = res.windowHeight;
                let scrollH = wh;
                this.setData({
                    scrollH: scrollH,
                });
            }
        })
    request({
      url: globalData.apiUrl.listInfo, postdata: {
        userName: globalData.user,
        tradeState: "",
        startTime: "",
        endTime: "",
        pageindex: 0
      }, callback: ({data}) => {
        if (data.code == 0) {
          this.setData({
            listData: data.data.tradeList,
            pagecount: data.data.pagecount
          });
        }
      }, header: {
        'Authorization': globalData.Authorization
      }
    })
  }
})