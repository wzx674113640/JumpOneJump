var WXRequ = require("WXRequ");

cc.Class({
    extends: cc.Component,

    properties: {   
        BtnSpriteFrame: 
        {
            default:[],
            type:cc.SpriteFrame,
        },
        
        BtnAppList:cc.Node,
        LeftAppNodeList:cc.Node
    },

  

    start () {
        this.btnState = "close"; 

        this.BtnAppList.on(cc.Node.EventType.TOUCH_END, function(event)
        {
            this.BtnMove();
        },this);
    },

    BtnMove()
    {
        if(this.btnState == "close")
        {
            this.btnState = "open";
            var m = cc.moveBy(0.3,cc.v2(595,0));
            this.node.runAction(m);
            this.BtnAppList.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[0];
        }
        else 
        {
            this.btnState = "close";
            var m = cc.moveBy(0.3,cc.v2(-595,0));
            this.node.runAction(m);
            this.BtnAppList.getComponent(cc.Sprite).spriteFrame = this.BtnSpriteFrame[1];
        }
    },

    
    ShowApp(AppIDInfoList)
    {
        var Applength = AppIDInfoList.length;
        for(var i = 0;i < this.LeftAppNodeList.children.length;i++)
        {
            if(Applength > i)
            {
                this.LeftAppNodeList.children[i].getComponent("AppItem").setItem(AppIDInfoList[i]);
            }
            else
            {
                this.LeftAppNodeList.children[i].active = false;
            }
        }
    }
});
