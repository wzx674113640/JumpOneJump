 
var  Helper = require("Helper");
var WXRequ = require("WXRequ");
cc.Class({
    extends: cc.Component,

    properties: {
        Img:cc.Sprite,
        //Img1:cc.Sprite,
        IsImg1:true,
    },

    start () {
       this.urlList = [];
       this.sFlist = [];
    },
    
    setItem(appInfo)
    {
        this.node.active = true;
        if(!this.IsImg1)
        {
            Helper.Instance.createAppImage(appInfo.img,this.Img);
        }
        else
        {
            Helper.Instance.createAppImage(appInfo.img1,this.Img)
        }
        var self = this;
    
        this.Img.node.targetOff(this);
        this.Img.node.on(cc.Node.EventType.TOUCH_END, function(event)
        {
            WXRequ.Instance.CG2_AppReqCount(appInfo.id);
            WXRequ.Instance.associatedProgram(appInfo.appid,appInfo.url,appInfo.id);
        },this);
    },   
    
});
