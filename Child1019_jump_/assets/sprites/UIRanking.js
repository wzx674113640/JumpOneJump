

cc.Class({
    extends: cc.Component,

    properties: {
       ItemParent:cc.Node,
        MyItem:cc.Node,
        LablePage:cc.Label
    },

    onLoad () {
        this.currentPage = 0;
    },

    loadOnePageInfo(page,data)
    {
        this.data = data;
        if(page<0)
            return;
        var starDateIndex = page*7;
        if(starDateIndex >= data.length)
            return;
        this.currentPage = page;
        for(var i = 0;i < 7;i++)
        {
            var DateIndex = starDateIndex + i;
            if(DateIndex < data.length)
            {   
                var item = this.ItemParent.children[i];
                item.active = true;
                var obj = data[DateIndex];
                item.getComponent("RankItem").init(DateIndex,obj);
            }       
            else
            {
                this.ItemParent.children[i].active = false;
            }
        }
        var len = data.length;
        var value = ((len-len % 7)/7)+1;
        this.LablePage.string = (this.currentPage + 1) +"/"+ value;
    },
    
    BtnDown()
    {
        if(this.data == undefined)
            return;
        var page = this.currentPage+1;
        this.loadOnePageInfo(page,this.data);
    },  

    BtnUp()
    {
        if(this.data == undefined)
            return;
        var page = this.currentPage - 1;
        this.loadOnePageInfo(page,this.data);
    },
});
