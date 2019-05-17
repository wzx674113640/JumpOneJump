
 var Init = require("Init");
 var WXRequ = require("WXRequ");
 
cc.Class({
    extends: cc.Component,

    properties: {
        LeftAppNodeList:cc.Node,
        MoreGame:cc.Node,
        Down:cc.Node
    },
    
    
    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        if(WXRequ.Instance.bannerAd)
        {
            WXRequ.Instance.bannerAd.hide();
        }
        this.GetGold();
        var AppIDInfoList = WXRequ.Instance._AppIDInfoList;
        var Applength = AppIDInfoList.length;
        AppIDInfoList.sort(function() {
            return (0.5-Math.random());
        })
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
        if(Applength<=0)
            return;
        var index = Math.floor(Math.random()*Applength);
        this.MoreGame.targetOff(this);
        this.MoreGame.on(cc.Node.EventType.TOUCH_END, function(event)
        {
            WXRequ.Instance.CG2_AppReqCount(AppIDInfoList[index].id);
            WXRequ.Instance.associatedProgram(AppIDInfoList[index].appid,AppIDInfoList[index].url,AppIDInfoList[index].id);
        },this);

        this.Down.y = WXRequ.Instance.startClosePos;
        WXRequ.Instance.ShowOrHideAdervert(true,()=>
        {
            this.Down.y = this.StartPosY;
        });
    },

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        WXRequ.Instance.ShowOrHideAdervert(false);
    },

    onLoad () 
    {
        this.UIgameing = Init.Instance.GetUINode("UIGameing");
        this.game = this.UIgameing.getComponent("GameContorl");
        this.StartPosY = this.Down.y;
    },
    
    GetGold()
    {
        try {
            if(CC_WECHATGAME)
            {
                var coinAdd =  WXRequ.Instance.playInfo.CoinAdd;
                var coin1 = this.game.curCoin * coinAdd;
                var coin = Math.ceil(coin1);
                WXRequ.Instance.C2G_GameOver(coin,this.game.curScore,
                 ()=>
                 {
                     WXRequ.Instance.playInfo.coin += coin;
                     WXRequ.Instance.playInfo.CoinAdd = 1;
                 }
                 );
            }
            this.game.curCoin = 0;
        } 
        catch (error) 
        {
            console.error(error);
        }
    },

    GameNext()
    {
        Init.Instance.SoundNode[0].play();
        //跳转到游戏重新开始
        this.UIgameing.getComponent("GameContorl").game_Next();
        Init.Instance.closeAllTop();
    },

    BtnOnePage()
    {
        window.BtnOnePage.ReturnMianMenuClick();
    },
    
    BtnShare()
    {
        WXRequ.Instance.onShareBtn();
    }
});
