var Init = require("Init");
var WXRequ = require("WXRequ");
cc.Class({
    extends: cc.Component,

    properties: {
        SkinID:0, 
        TitleName:cc.Label,
        SkinImg:cc.Sprite,
        Toggle:cc.Toggle
    },  

    onLoad () {
        this.TitleName.string =  Init.Instance._SkinStrings[this.SkinID];
        this.SkinImg.spriteFrame = Init.Instance._SkinPics[this.SkinID];
    },

    BtnSeeVideo()
    {
        WXRequ.Instance.SeeVideo(()=>
        {   
            Player.SetOnceSkin(this.SkinID);
            this.node.parent.parent.active = false;
            var value = this.Toggle.isChecked ? 1:0;
            cc.sys.localStorage.setItem("SkinToggle",value);
        });
    }
});
