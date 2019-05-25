
 var Init = require("Init");
 var WXRequ = require("WXRequ");
 
cc.Class({
    extends: cc.Component,

    properties: {
        LeftAppNodeList:cc.Node,
        Down:cc.Node,
        MianUI:cc.Node,
        ResurPanel:cc.Node
    },
    
    
    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        if(WXRequ.Instance.bannerAd)
        {
            WXRequ.Instance.bannerAd.hide();
        }
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
    
    

    Res_Game()
    {
        this.UIgameing.getComponent("GameContorl").game_Resur();
        Init.Instance.closeAllTop();
        this.UIgameing.getComponent("GameContorl").ScoreHideOrShow(true);
    },

    AskFriendClick()
    {
        this.MianUI.active = false;
        this.ResurPanel.active = true;
        Init.Instance.SoundNode[0].play();
    },

    SeeVedioClick()
    {
        Init.Instance.SoundNode[0].play();
        WXRequ.Instance.SeeVideo(()=>
        {
            wx.showToast({
                title: '已复活',
                icon: 'success',
                duration: 800
                })
            this.Res_Game();
        });
       
    },

    SkipUIClick()
    {
        Init.Instance.SoundNode[0].play();
        //跳转到第二个UI界面
        Init.Instance.ShowUIEndTwo();
        //关闭开放域画布
        if(CC_WECHATGAME)
        {
            window.wx.postMessage({
                messageType: 4,
                MAIN_MENU_NUM: "x1"
            });
        }
    },
});
