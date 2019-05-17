
var AtuoJump =  cc.Class({
    extends: require("SkillBaseBox"),

    properties: {
        
    },

    SkillJump1()
    {
        
        var self  = this;
        var index = 0;
        this.player.IsOpenSkillAtomUI(true);
        this.schedule(function() {
            var color =  self.gameControl.AllBoxs[self.player.AllBoxIndex+1].getComponent("Box").My_Color;
            index++;
            switch(color)
            {
                case "紫色":
                     self.player.keyDown(cc.macro.KEY.a);
                    break;
                case "红色":
                    self.player.keyDown(cc.macro.KEY.s);
                    break;
                case "橙色":
                    self.player.keyDown(cc.macro.KEY.d);
                    break;
                case "绿色":
                    self.player.keyDown(cc.macro.KEY.f);
                    break;
            }
            if(index>=10)
            {
                self.gameControl._Skilling = false;
                self.gamecontorl.IsPause = true;
                self.player.IsOpenSkillAtomUI(false);
                self.node.destroy();
            }
        },0.3,10,0.3);
    }
});
