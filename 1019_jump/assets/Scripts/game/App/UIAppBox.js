
var TitleList = [
    "每周推荐",
    "最新上架",
    "必玩精品"];

cc.Class({
    extends: cc.Component,

    properties: {
       Content: cc.Node,
       Item:cc.Node,
       TopImg:cc.Node,
       LeftBtns: cc.Node,
       View:cc.Node
    },
    
    onLoad()
    {
        this.getSystemInfo();
        this.node.y = this.screenHeight * this.ipx /2;
        //var startH = this.TopImg.height;
        //this.TopImg.height = startH * this.ipx;
        // this.titlePoor = this.TopImg.height - startH;
        if(this.MeansButtonInfo != null)
        {
            this.LeftBtns.y =  -this.ipx * (this.MeansButtonInfo.top + this.MeansButtonInfo.height/2) ;
            var TopWidth = this.screenHeight * this.ipx /2 - this.MeansY + 64;
            this.widthOffs = TopWidth - this.TopImg.height ;
            this.TopImg.height = TopWidth;
            this.View.y -= this.widthOffs;
        }
    },

    onEnable()
    {
        GameClub.hide();
    },

    onDisable()
    {
        GameClub.show();
    },

    getSystemInfo()
    {
        if(!CC_WECHATGAME)
            return;
        var sysInfo = window.wx.getSystemInfoSync();
        this.MeansButtonInfo = wx.getMenuButtonBoundingClientRect();
       
        this.sysInfo = sysInfo;
        this.screenWidth = sysInfo.screenWidth;
        this.screenHeight = sysInfo.screenHeight;
        this.ipx = 750/this.screenWidth;
        this.MeansY = (this.screenHeight/2 - this.MeansButtonInfo.top - this.MeansButtonInfo.height/2) * this.ipx;
    },

    //展示盒子内容
    ShowBox(dataList)
    {
        var ItemTotalHeight = 0;
        var index = 0;
        for(var key in dataList)
        {
            var data = dataList[key];
            if(this.Content.children.length <= index)
            {
                var ins_Item = cc.instantiate(this.Item);
                ins_Item.parent = this.Content; 
            }
            else
            {
                var ins_Item = this.Content.children[index];
            }
            var ins_ItemHeight =  ins_Item.getComponent("BoxItem").setBoxItem(data,TitleList[index]);
            ItemTotalHeight += ins_ItemHeight;
            index++;
        }
        this.Content.height = 35*10 + ItemTotalHeight + index * 30;
        this.node.active = false;
    },

    BtnClose()
    {
        this.node.active = false;
    },

    BtnHome()
    {  
        this.node.active = false;
    }
});
