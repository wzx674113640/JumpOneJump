

cc.Class({
    extends: cc.Component,

    properties: {
       MaskList:
       {
           type:cc.Node,
           default:[]
       }
    },

    onLoad()
    {
        window.TeachUI = this;
    },
   
    start () {
        this.CurrentMask = null;
        this.TeachCount = 4;
    },

   

    TeachJump()
    {
        var color =  GameControl.AllBoxs[Player.AllBoxIndex+1].getComponent("Box").My_Color;
        switch(color)
        {
            case "红色":
                 this.ShowMask(0);
                break;
            case "橙色":
                this.ShowMask(1);
                break;
            case "紫色":
                this.ShowMask(2);
                break;
            case "绿色":
                this.ShowMask(3);
                break;
        }
        this.TeachCount--;
        if(this.TeachCount < 0)
        {
            Player.GameingState = "GameingReady";
            if(this.CurrentMask)
            {
                this.CurrentMask.active= false;
            }
            this.node.active = false;
            cc.sys.localStorage.setItem("Teach","1");
        }
    },

    ShowMask(index)
    {
        if(this.CurrentMask)
        {
            this.CurrentMask.active = false;
        }
        this.CurrentMask = this.MaskList[index];
        this.CurrentMask.active = true;
    }
});
