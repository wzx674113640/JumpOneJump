var Helper = require("Helper");

var WXRequ = require("WXRequ");

cc.Class({
    extends: cc.Component,

    properties: {
        Name:cc.Label,
        Title:cc.Label,
        MySprite:cc.Sprite,
    },

    
    setImgItem(data)
    {
        Helper.Instance.createAppImage(data.img,this.MySprite);
        this.Name.string = data.title;
        //this.Title.string = data.des.length>5? data.des.slice(0,5)+"...":data.des;
        this.Title.string = data.click + "万人在玩";
        this.node.targetOff(this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event)
        {
            WXRequ.Instance.CG2_AppReqCount(data.id);
            WXRequ.Instance.associatedProgram(data.appid,data.url,data.id);
        },this);
    }


});
