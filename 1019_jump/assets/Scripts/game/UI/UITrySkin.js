var Init = require("Init");

cc.Class({
    extends: cc.Component,

    properties: {
        Layout:cc.Node,
        Toggle:cc.Toggle
    },

    BtnRandomLock()
    {
        var index = Math.floor(Math.random()*4);
        this.Layout.children[index].getComponent("OnceSkin").BtnSeeVideo();
    },
    
    BtnClose()
    {
        this.node.active = false;
        var value = this.Toggle.isChecked ? 1:0;
        cc.sys.localStorage.setItem("SkinToggle",value);
    },

    onDisable()
    {
        if(!Init.Instance.IsEnbaleFunction)
            return;
        GameControl.TeachUI.getComponent("TeachUI").TeachJump();
    }
});
