
var WXRequ = require("WXRequ");

var Init = require("Init");
cc.Class({
    extends: cc.Component,

    properties: {
      
        WRanking:
        {
            type: cc.Node,
            default:null,
        },
        
        PageNode:cc.Node,
        
        ItemRanking:
        {
            type:cc.Prefab,
            default:null,
        },

        myselfItem:
        {
            type:cc.Node,
            default:null,
        },

        FTol:
        {
            type:cc.Toggle,
            default:null,
        },

        TxtTol1: cc.Node,
       
        TxtTol2: cc.Node,
        
        LablePage:cc.Label
    },

    onLoad()
    {
        this.currentPage = 0;
        this.isLoadJson = false;
    },

    onEnable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        if(!this.FTol.ischecked)
        {
            this.FTol.check();
        }
        this.TxtTol2.color = new cc.Color(255,255,255,85);
        this.TxtTol1.color = new cc.Color(26,26,26,255);
        this.node.self = this;
        this.WRanking.active = false;
        this.PageNode.active = false;
        this.myselfItem.active = false;
        this.node.parent.parent.Rank.ShowChild();
        this.ShowHideOneUI(false);
    },

    ShowHideOneUI(IsShow)
    {
        var UIOnePage = Init.Instance.GetUINode("UIOnePage");
        if(UIOnePage.active == true)
        {
            UIOnePage.getComponent("UIOnePage").MyUI.active = IsShow;
        }
    },

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        var rank = this.node.parent.parent.Rank;
        rank.HideChild();
        rank.ClearRanking();
        this.WorldClearRanking();
        this.ShowHideOneUI(true);
        Init.Instance.IsGamingRank = false;
        this.isLoadJson = false;
        this.currentPage = 0;
    },
    
    WorldClearRanking()
    {
        /*
        var childrens = this.WNode.children;
        for(var i= 0;i<childrens.length;i++)
        {
            childrens[i].getComponent("ItemRanking").clear();
        }
        */
    },

    ShowFrienRank()
    {
        this.TxtTol2.color = new cc.Color(255,255,255,85);
        this.TxtTol1.color = new cc.Color(26,26,26,255);
        Init.Instance.SoundNode[0].play();
        this.WRanking.active = false;
        this.PageNode.active = false;
        this.myselfItem.active = false;
        var rank = this.node.parent.parent.Rank;
        rank.ShowChild(false);
        rank.RankingTop();
    },

    ShowWorldRank()
    {
        //Init.Instance.ShowPanelMask();
        this.TxtTol1.color = new cc.Color(255,255,255,85);
        this.TxtTol2.color = new cc.Color(26,26,26,255);
        Init.Instance.SoundNode[0].play();
        this.node.parent.parent.Rank.HideChild();
        var self = this;
        this.WRanking.active = true;
        
        this.PageNode.active = true;
        this.myselfItem.active = true;
        if(this.isLoadJson == false)
        {
            wx.request({
                url: 'https://tfk.qkxz.com/?act=paihang&openid={$openid}',
                data:
                {
                    openid:WXRequ.Instance.openid,
                },
                success (res) {
                    var obj = res.data.data.list;
                    var view = res.data.data.view;
                    self.data = obj;
                    self.loadOnePageInfo(self.currentPage);
                    self.myselfItem.getComponent("ItemRanking").setInfo(view.num, view.avatar_url,view.nick_name,view.score,true);
                    this.isLoadJson = true;
                }
            });
        }
        else
        {
            self.loadOnePageInfo(self.currentPage)
        }
        //Init.Instance.HidePanelMask(0);
    },
    
    loadOnePageInfo(page)
    {
        if(this.data == undefined)
            return;
        if(page<0)
            return;
        var starDateIndex = page*7;
        if(starDateIndex >= this.data.length)
            return;
        this.currentPage = page;
        for(var i = 0;i<7;i++)
        {
            var DateIndex = starDateIndex + i;
            if(DateIndex < this.data.length)
            {   
                var item = this.WRanking.children[i];
                item.active = true;
                var obj = this.data[DateIndex];
                item.getComponent("ItemRanking").setInfo(obj.num, obj.avatar_url,obj.nick_name,obj.score);
            }       
            else
            {
                this.WRanking.children[i].active = false;
            }
        }
        this.LablePage.string = (this.currentPage+1) +"/8";
    },

    BtnUp()
    {
        var page = this.currentPage - 1;
        this.loadOnePageInfo(page);
    },

    BtnDown()
    {
        var page = this.currentPage + 1;
        this.loadOnePageInfo(page);
    },

    StartGameClick()
    {
        Init.Instance.SoundNode[0].play();
        if(Init.Instance.GetUINode("UIGameing")._activeInHierarchy == true)
        {
            Init.Instance.GetUINode("UIGameing").getComponent("GameContorl").player.instance.startGame();
        }
        this.ShowHideOneUI(true);
        Init.Instance.ShowUIGaming();
        Init.Instance.GetUINode("UIGameing").getComponent("GameContorl").clearAndGameStart();
        Init.Instance.closeAllTop();
        
    },
    
    FlockRank()
    {
        //Init.Instance.SoundNode[0].play();
        //群排行分享
        WXRequ.Instance.onShareBtn();
    },
});
