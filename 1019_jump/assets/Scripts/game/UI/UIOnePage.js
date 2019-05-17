
var Init = require("Init");
var WXRequ = require("WXRequ");
var Hint = require("Hint");
cc.Class({
    extends: cc.Component,

    properties: {
        SoundBtnSprite:
        {
            type:cc.Sprite,
            default:null,
        },
        SpriteList:
        {
            type:cc.SpriteFrame,
            default:[],
        },

        MyUI: cc.Node,
        SoundBtnNode: cc.Node,

        ChatBtnNode: cc.Node,
        
        MoreCoinNode: cc.Node,

        UIAwardBtn:cc.Node,

        ImgAddCoin: cc.Node,

        ImgCountAddCoin :cc.Node,

        UINeedHides:
        {
            default:[],
            type: cc.Node
        },

        _time:0,
        _isfirst: true
    },

    onLoad()
    {
        this.UIrotation();
        if(!CC_WECHATGAME)
            return;
        this.AdpativeUI();
        var mean =  wx.getMenuButtonBoundingClientRect();
        this.GameClub = wx.createGameClubButton({
            icon:"light",
            style:
            {
                left:75,
                top: mean.top - 5,
                width:40,
                height:40
            }
        });
        window.GameClub = this.GameClub;
    },

    IsShowShareUI()
    {
        var active = WXRequ.Instance.playInfo.is_status == 0 ? false:true;
        for(var i = 0;i<this.UINeedHides.length;i++)
        {
            this.UINeedHides[i].active = active;
        }
        this.ImgAddCoin.getComponent(cc.Sprite).enabled = active;
        this.ImgAddCoin.getChildByName("Label").getComponent(cc.Label).enabled = active;
    },

    AdpativeUI()
    {
        if(this.IsAdpative==undefined)
        {
            var wxy = WXRequ.Instance.wx_y;
                //需要适配
            this.SoundBtnNode.setPosition(-306,wxy);
            this.ChatBtnNode.setPosition(-222.2,695);
            
            this.IsAdpative = true;
        }
        
    },

    CustomerServicesBtn()
    {
        Init.Instance.SoundNode[0].play();
        if(!CC_WECHATGAME)
            return;
        window.wx.openCustomerServiceConversation({
            success: (res) => {
            }
        });
    },

    start () {
        Init.Instance.InstantPrefabs();
    },

    BtnsStartClick()
    {
        Init.Instance.ShowUIGaming();
        

        Init.Instance.SoundNode[0].play();
    },
    
    OnSharaBtn()
    {
        //Init.Instance.SoundNode[0].play();
        WXRequ.Instance.onShareBtn(
            ()=>{
                WXRequ.Instance.playInfo.CoinAdd = 1.5;
                //UI更改
                this.ImgCountAddCoin.active = true;
                this.ImgAddCoin.active = false;
            }
        );
    },

    OnAllShare()
    {
        //Init.Instance.SoundNode[0].play();
        WXRequ.Instance.onShareBtn(
            ()=>{
                Init.Instance.ShowUIRanking();
        });
    },

    OnSoundBtn()
    {
        Init.Instance.SoundNode[0].play();
        var sound = cc.sys.localStorage.getItem("Sound");
       
        if(sound === ""|| sound == "1"|| sound == null)
        {
            Init.Instance.SoundControl(false);
            cc.sys.localStorage.setItem("Sound",0); 
            this.SoundBtnSprite.spriteFrame = this.SpriteList[1];
        }
        else if(sound == "0")
        {
            Init.Instance.SoundControl(true);
            cc.sys.localStorage.setItem("Sound",1); 
            this.SoundBtnSprite.spriteFrame = this.SpriteList[0];
        }
        
    },

    BtnsRankingClick()
    {
        Init.Instance.SoundNode[0].play();
        Init.Instance.ShowUIRanking();
    },
    
    onEnable()
    {
        if(this.GameClub != undefined)
        {
            this.GameClub.show();
        }
        WXRequ.Instance.ShowHideButton(true);
        this.ImgCountAddCoin.active = false;
        this.ImgAddCoin.active = true;
        WXRequ.Instance.playInfo.CoinAdd = 1;

        var sound = cc.sys.localStorage.getItem("Sound");
        if(sound === ""|| sound == "1"|| sound == null)
        {
            this.SoundBtnSprite.spriteFrame = this.SpriteList[0];
            if(this._isfirst)
            {
                Init.Instance.SoundControl(true);
                this._isfirst =false;
            }
                
        }
        else if(sound == "0")
        {
            this.SoundBtnSprite.spriteFrame = this.SpriteList[1];
            if(this._isfirst)
            {
                Init.Instance.SoundControl(false);
                this._isfirst =false;
            }
        }
        if(!Init.Instance.IsEnbaleFunction)
            return;
        Init.Instance.BtnOne.active = false;
        
    },

    onDisable()
    {
        this.GameClub.hide();
        WXRequ.Instance.ShowHideButton(false);
        if(!Init.Instance.IsEnbaleFunction)
            return;
        Init.Instance.BtnOne.active = true;
    },
    
    OnWorking()
    {
        Init.Instance.SoundNode[0].play();
        this.WXTopUI("开发中...");
    },

    WXTopUI(TXT)
    {
        if(cc.CC_WECHATGAME)
        {
            wx.showToast({
                title: TXT,
                icon: 'success',
                duration: 800
              })
        }
    },

    //清理缓存
    clearItem()
    {
        cc.sys.localStorage.removeItem("Teach");
        cc.sys.localStorage.removeItem("nickName")
        cc.sys.localStorage.removeItem("avatarUrl")
        cc.sys.localStorage.removeItem("gender")
    },

    ShowCoinPanel()
    {
        Init.Instance.SoundNode[0].play();
        Init.Instance.ShowUIMoreCoin();
    },

    ShowUISkin()
    {
        if(WXRequ.Instance.playInfo.is_status == 1)
        {
            Init.Instance.SoundNode[0].play();
            Init.Instance.ShowUISkin();
        }
        else
        {
            Hint.Instance.ShowPop("开发中...");
        }
    },

    ShowUIAward()
    {
        Init.Instance.SoundNode[0].play();
        Init.Instance.ShowUIAward();
    },

    ShowUISgin()
    {
        Init.Instance.SoundNode[0].play();
        Init.Instance.ShowUISgin();
    },
    
    ShowUIResur()
    {
        Init.Instance.SoundNode[0].play();
        Init.Instance.ShowUIResurt();
    },
    
    UIrotation()
    {
        return;
        var left = cc.rotateTo(0.5,-15);
        var right = cc.rotateTo(0.5,15);
        var seq = cc.sequence(left,right);
        var rep = cc.repeatForever(seq);
        this.UIAwardBtn.runAction(rep);
    },

    update(dt)
    { 
        //this._time += 0.1*dt;
        //this.UIAwardBtn.rotation += Math.sin(this._time);
        //cc.log(this.UIAwardBtn.rotation);
    },
    
    KF()
    {
        wx.openCustomerServiceConversation()
    }
});
