var WXRequ = require("WXRequ");
var Helper = require("Helper");

cc.Class({
    extends: cc.Component,

    properties: {
       Img:cc.Sprite,
       Name:cc.Label
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.AppIDInfoList = WXRequ.Instance._AppIDInfoList;
        this.setItem();
        this.coolTimer = 5;
        this.Timer = this.coolTimer;
    },

    setItem()
    {
        var AppIDInfoList = this.AppIDInfoList;
        var index = Math.floor(Math.random()*AppIDInfoList.length);
        Helper.Instance.createAppImage(AppIDInfoList[index].img,this.Img);
        let nick = AppIDInfoList[index].title.length <= 3 ?  AppIDInfoList[index].title :  AppIDInfoList[index].title.substr(0, 3) + "...";
        this.Name.string = nick;
        this.node.targetOff(this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event)
        {
            WXRequ.Instance.CG2_AppReqCount(AppIDInfoList[index].id);
            WXRequ.Instance.associatedProgram(AppIDInfoList[index].appid,AppIDInfoList[index].url,AppIDInfoList[index].id);
        },this);
    },

    update (dt) 
    {
        this.Timer -= dt;
        if(this.Timer<=0)
        {
            this.Timer = this.coolTimer;
            this.setItem();
        }
    },
});
