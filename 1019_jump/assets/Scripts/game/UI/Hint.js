
var Hint =  cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance:null
    },

    properties: {
       UItype:
       {
           type:cc.Node,
           default: []
       },
       Panel:cc.Node,

       Mask:cc.Node,

       SharaFail:cc.Node,
    },

    ShowPop(string)
    {
        wx.showToast({
            title: string,
            icon: 'success',
            duration: 800
          })
    },

    ShowFail(string)
    {
        wx.showToast({
            title: string,
            icon: 'Fail',
            duration: 800
          })
    },

    ShowWorking()
    {
        this.ShowUI(0);
    },
   
    ShowBuy()
    {
        this.ShowUI(1);
    },
    
    ShowCoin()
    {
        this.ShowUI(2);
    },

    ShowGetDouble()
    {

    },
    ShowPanelMask()
    {
        this.Mask.active = true;
        wx.showLoading({
            //title: "",
          })
    },

    HidePanelMask()
    {
        this.Mask.active = false;
        wx.hideLoading();
    },
    
    ShowSharaFail()
    {
        this.SharaFail.active = true;
        this.scheduleOnce(function() {
            this.SharaFail.active = false;
        }, 0.8);
    },

    ShowUI(index)
    {
        this.Panel.active = true;
        for(var i= 0;i<this.UItype.length;i++)
        {
            if(i == index)
            {
                this.UItype[i].active = true;
            }
            else
            {
                this.UItype[i].active = false;
            }
        }
        this.scheduleOnce(function() {
            this.HideUI();
        }, 0.8);
    },

    HideUI()
    {
        this.Panel.active = false;
    },

    onEnable()
    {
        Hint.Instance = this;
    }
});
