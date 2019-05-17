

var Init = require("Init");

var WXRequ = require("WXRequ");

cc.Class({
    extends: cc.Component,

    properties: {
        CurScore: cc.Label,
        TimeLable:cc.Label,

        BtnShara:cc.Node,
        _IsBtnSee : true,

        ResurPanel: cc.Node,
        
        MianUI:cc.Node,
        BtnClose:cc.Node,
        WidgetClose: cc.Widget
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
        this.isStop = true;
        this.node.parent.parent.Rank.HideChild();
        Init.Instance.SoundNode[0].play();
        /*
        WXRequ.Instance.onShareBtn(
            ()=>{
                wx.showToast({
                    title: '已复活',
                    icon: 'success',
                    duration: 800
                  })
                  this.Res_Game();
            }
        );
        */
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

    onLoad()
    {
       this.isStop =  false; 
       this.BtnCloseY = this.BtnClose.y;
    },
    
    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        this.node.Instance = this;
        var active  = WXRequ.Instance.is_open == 0? false:true;
        this.BtnShara.active = active;
        
        this.isStop = false;
        Init.Instance.GetUINode("BtnOnePage").active = false;
        this.timeOnce = 1;
        this.StartTime = 8;
        this.TimeLable.string = this.StartTime;
        this.node.parent.parent.Rank.ShowChild(false);
        this.UIgameing = Init.Instance.GetUINode("UIGameing");
        this.UIgameing.getComponent("GameContorl").ScoreHideOrShow(false);
        var bestScore = this.UIgameing.getComponent("GameContorl").curScore;;
        this.CurScore.string = bestScore;
        if(CC_WECHATGAME)
        {
            if( bestScore > WXRequ.Instance.bestscore)
            {
                WXRequ.Instance.bestscore = bestScore;
            }
            this.BtnClose.y = WXRequ.Instance.startClosePos;
            WXRequ.Instance.ShowOrHideAdervert(true,()=>
            {
                this.BtnClose.y = this.BtnCloseY;
            });
        }
    },

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        Init.Instance.GetUINode("BtnOnePage").active = true;
        this.node.parent.parent.Rank.HideChild();
        WXRequ.Instance.ShowOrHideAdervert(false);
    },


    update(dt)
    {
        if(this.isStop)
            return;
        this.timeOnce -=dt;
        if(this.timeOnce <=0)
        {
            this.timeOnce = 1;
            this.StartTime--;
            this.TimeLable.string = this.StartTime;
            if(this.StartTime <= 0)
            {
                this.SkipUIClick();
            }
        }
    }

});
