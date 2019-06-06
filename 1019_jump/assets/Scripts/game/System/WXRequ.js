
var Init = require("Init");
var PlayInfo = require("PlayInfo");

var getInfo = {code:null,nickName:null,avatarUrl:null,gender:null};

//var playInfo = {id:null, openid:null, nickName:null,avatar_url:null,score:null,total_amount:null};

var Hint = require("Hint");

var shareImgList = [
    'https://img.qkxz.com/xxx/fdsfsdg.png',
    'https://img.qkxz.com/xxx/u=89543684,1220416000&fm=173&app=25&f=JPEG.jpg',
    'https://img.qkxz.com/xxx/1.png',
    'https://img.qkxz.com/xxx/CEB1743975B030050FD&w=640&h=480&img.JPEG',
    'https://img.qkxz.com/xxx/8AC94EB2-90F1-4287-A3D1-EB338B35E5D5.png',
    'https://img.qkxz.com/xxx/u=8954311684,1220416000&fm=173&app=25&f=JPEG.png',
    'https://img.qkxz.com/xxx/102d38f22f45ec3ac7dff01547633570.jpg',
    'https://img.qkxz.com/xxx/1021beff7970a5efa3d8c01548921588.jpg',
    'https://img.qkxz.com/xxx/102d38f22f45ec3ac7dff01547633570.jpg',
    'https://img.qkxz.com/xxx/1021beff7970a5efa3d8c01548921588.jpg',
    'https://img.qkxz.com/xxx/102eb15c4e0df60de233d01548922417.jpg',
    'https://img.qkxz.com/xxx/1027cf4fbbc1d2f671ab801548922645.jp',
    'https://img.qkxz.com/xxx/10260bcbb0ce3bb558ac401548923558.jpg',
    'https://img.qkxz.com/xxx/102ff4288db93bf5aa96601548923596.jpg',
    'https://img.qkxz.com/xxx/102845328159aa003a7db01548925239.jpg'
  ];
  var shareTitleList = [
    '2018年平均工资出炉,这次您又被平均了吗?',
    '小学生又出“神造句”,语文老师笑了,家长被气哭!',
    '科学测试看到熊猫的视力都5.0',
    '99%的人都不会知道为什么A会是第一个死',
    '2019年中国房租最贵十大城市排名一览',
    '2019年1月1日期，这些新制度将开始实施',
    '女生必看!最新化妆品抽检结果出炉，这80批次都不合格',
    '看图你能看到多少只动物？',
    '2019年全年公休放假安排',
    '看图你能看到多少只动物？',
    '2019年全年公休放假安排',
    '12张色彩敏感测试图,只有1%的能人到第四关',
    '让999个老师吐血的神童试卷',
    "“神童”的考试卷火了,看到最后,网友:干的漂亮",
    '十二星座测试：你会选择下面哪一位做你未来的情人'
  ];

var WXRequ = cc.Class({
    extends: cc.Component,

    statics:
    {
        Instance:null
    },

    properties: {
        IsGetUserInfo: false,

        is_open: 0,

        playInfo:
        {
            type: PlayInfo,
            default: null,
            visible :true
        },
        
        Mask:cc.Node,
        
        AppNodeUI:cc.Node,

        BoxApp:cc.Node,

        _Sence:0,
        _version:129,
    },

    onLoad()
    { 
        this.ShareEvent = null;//分享的事件
        this.Init =  this.node.getComponent("Init");
        this.isfirstBanner = true;
        if (CC_WECHATGAME)
        {
            var obj = wx.getLaunchOptionsSync();
        
            this.key = obj.query.key == undefined? null:obj.query.key;
            var Sence = obj.query.scene==undefined? null:obj.query.scene;
            this._Sence = decodeURIComponent(Sence);

            this.SharaHideShow();
            this.C2G_GetUserInfo();
            this.aderHeight = 117 //广告高度
            this.height =  wx.getSystemInfoSync().screenHeight;
            this.width =  wx.getSystemInfoSync().screenWidth;
            this.ipx = 750/this.width;
            this.startClosePos = -(this.height * this.ipx)/2 + 150;
            this.Canvas = cc.find("Canvas");
            this.WXUIPos();
            this.AddMeanShare();

            this.videoAd = wx.createRewardedVideoAd({
                adUnitId: 'adunit-e60bf6df6539d093'
            });
            
            this.videoAd.onError(err => {
                this.Init.HidePanelMask(1);
            })
            
        }
    },

    //右上角菜单添加分享功能
    AddMeanShare()
    {
        var self = this;
        wx.onShareAppMessage(()=>{
            return {
                title: shareTitleList[self.randomSharePic()],
                imageUrl: shareImgList[self.randomSharePic()],
            }
        });
    },
    randomSharePic()
    {
        return Math.floor(Math.random()*shareImgList.length);
    },

    //适配微信右上角UI 
    WXUIPos()
    {
        var wxUIObject = wx.getMenuButtonBoundingClientRect;
        if(wxUIObject == undefined || wxUIObject == null)
        {
            this.wx_x = -307.5;
            this.wx_y = 615;
        }
        else
        {
            var wxUI = wxUIObject();
            this.wxTop = wxUI.top + wxUI.height/2;
            this.wx_y = (this.height/2 - this.wxTop) * this.ipx;
            this.wx_x =  -(this.width/2 -  (this.width  - wxUI.right) ) * this.ipx + 47.5;
            
        }
    },

    AdverRpxHeight(wight)
    {
        wight.enable = true;
        this.closeWight = wight ;
    },

    SharaHideShow()
    {
        wx.onHide(()=>
        {
            var timeDate = new Date();
            this.hideTime = timeDate.getTime();
        })

        wx.onShow(()=>
        {
            var timeDate = new Date();
            var showTime = timeDate.getTime();
            var value = showTime - this.hideTime;
            if(value>3000)
            {
                if(this.ShareEvent!= null)
                {
                    Hint.Instance.ShowPop("分享成功！");
                    this.ShareEvent();
                    this.ShareEvent = null;
                }
            }
            else if(value<3000)
            {
                if(this.ShareEvent!= null)
                {
                    Hint.Instance.ShowSharaFail();
                    this.ShareEvent = null;
                }
            }
        })
    },

    //获取游戏数值信息
    C2G_GameInfo(isclose = false,action = null)
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url:'https://tfk.qkxz.com/?act=user',
            data:
            {
                openid:self.playInfo.openid,
                uid:self.key,
                scene:self._Sence,
                version: self._version
            },
            success (res) 
            {
                var infodata =  res.data.data;
                self.playInfo.coin = Number(infodata.gold);
                self.playInfo.resurrectionCard = Number(infodata.card);
                self.playInfo.score = infodata.score;
                self.playInfo.is_status = infodata.is_status;
                self.playInfo.curSkin =  infodata.skin_id;
                self.Init.GetUINode("UIOnePage").getComponent("UIOnePage").IsShowShareUI();
                //self.C2G_AppID();
                //self.C2G_hzlist();
               
                if(action!=null)
                    action();
            },
            fail(res)
            {
                self.HidePanelMask();
                console.log("请求数据失败" + res);
            }
        });
    },

    //签到
    C2G_Sgin()
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        //this.mydata = null;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=signlist',
            data:
            {
                openid:self.openid,
                version: self._version,
            },
            success (res) 
            {
                //self.mydata = res.data.data;
                self.signData = res.data.data
                //action(res.data.data);

                self._isSign = self.signData.is_sign==1? true:false;
                if(!self._isSign)
                    self.Init.ShowUISgin();
                self.HidePanelMask();
            },
            fail(res)
            {
                self.HidePanelMask();
                console.error("请求数据失败" + res);
            }
        });
        
    },

    //领取签到奖励 0 单倍 1双倍
    C2G_GetSgin(num,action)
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=sign',
            data:
            {
                openid:self.openid,
                type:num,
                version: self._version,
            },
            success (res) 
            {
                action(res.data.data);
            }
        });
        
    },

    //皮肤列表
    C2G_Skin(action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=skinlist',
            data:
            {
                openid:self.openid,
                version: self._version,
            },
            success (res) 
            {
                action(res.data.data);
            }
        });
    },

    //买皮肤TODO
    C2G_BuySkin(skinID,action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=buy',
            data:
            {
                openid:self.openid,
                id:skinID,
                version: self._version,
            },
            success (res) 
            {
                action();
            }
        });
    },

    //使用皮肤
    C2G_UseSkin(skinID,action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=skinbut',
            data:
            {
                openid:self.openid,
                id:skinID,
                version: self._version,
            },
            success (res) 
            {
                action();
                //action(res.data.data);
            }
        });
    },
    //使用复活卡
    C2G_UseCard(action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=fuhuo',
            data:
            {
                openid:self.openid,
                id:self.gameID,
                version: self._version,
            },
            success (res) 
            {
                action();
            }
        });
    },

    //活动
    C2G_Activety(action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=activity',
            data:
            {
                openid:self.openid,
                version: self._version,
            },
            success (res) 
            {
                action(res.data.data);
            }
        });
    },

    C2G_GetActivety(action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({ 
            url:'https://tfk.qkxz.com/index.php?act=abut',
            data:
            {
                openid:self.openid,
                version: self._version,
            },
            success (res) 
            {
                action();
            }
        });
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
    
//获取后台信息
    C2G_GetUserInfo()
    {
        this.playInfo = new PlayInfo();
        if (!CC_WECHATGAME)
            return;
        this.ShowPanelMask();
        if(cc.sys.localStorage.getItem("nickName")!= "")
        {
            var self = this;
            getInfo.nickName = cc.sys.localStorage.getItem("nickName")
            getInfo.avatarUrl = cc.sys.localStorage.getItem("avatarUrl")
            getInfo.gender = cc.sys.localStorage.getItem("gender")
            self.Login(getInfo,self);
        }
        else{
            getInfo.nickName = "游客";
            getInfo.avatarUrl = null;
            getInfo.gender = 0;
            this.Login(getInfo,this);
            
            var self = this;
            let sysInfo = window.wx.getSystemInfoSync();
            let width = sysInfo.screenWidth;
            let height = sysInfo.screenHeight;

            var ipx = 750/width,
            _top = (height*ipx - (height*ipx/2 - 553)-48)/ipx, //553 y，48宽除以2
            _left = (width*ipx - (width*ipx/2+216.2)-48)/ipx; //216.2 x

            this.button = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: _left,
                    top: _top,
                    width: 96/ipx,
                    height: 96/ipx,
                    textAlign: 'center',
                }
            })
            this.button.onTap((res) => {
                var userInfo = res.userInfo
                if(userInfo != undefined)
                {
                    self.ShowPanelMask();
                    cc.sys.localStorage.setItem("nickName", userInfo.nickName);
                    cc.sys.localStorage.setItem("avatarUrl", userInfo.avatarUrl);
                    cc.sys.localStorage.setItem("gender", userInfo.gender);
                    getInfo.nickName = userInfo.nickName
                    getInfo.avatarUrl = userInfo.avatarUrl
                    getInfo.gender = userInfo.gender //Sex 0: unknown, 1: male, 2: female
                    self.button.destroy();
                    self.Login(getInfo,self);
                }
            })
    }
    },

    ShowHideButton(active)
    {
        if(this.button!=undefined&&this.button!= null)
        {
            if(active)
            {
                this.button.show();
            }
            else
            {
                this.button.hide();
            }
        }
    },
    
    Login(getInfo,self)
    {
        wx.login({
            success (res) {
                if (res.code) {
                getInfo.code = res.code
                //发起网络请求
                wx.request({
                    url: 'https://tfk.qkxz.com/index.php?act=userinfo',
                    data: {
                    code: getInfo.code,
                    nickName:getInfo.nickName,
                    avatarUrl: getInfo.avatarUrl,
                    gender:getInfo.gender,
                    scene:self._Sence,
                    version: self._version,
                    uid: self.key
                    },
                    success (res) {
                    var severuserinfo =  res.data.data;
                    //this.PlayInfo.curSkin = 0;
                    self.playInfo.openid = severuserinfo.openid,
                    self.openid = severuserinfo.openid;
                    self.playInfo.id = severuserinfo.id;
                    self.playInfo.nickName = severuserinfo.nickName;
                    self.playInfo.avatar_url = severuserinfo.avatar_url;
                    self.playInfo.score = severuserinfo.score;
                    self.bestscore = severuserinfo.score;
                    self.playInfo.total_amount = severuserinfo.total_amount;
                    self.IsGetUserInfo = true;
                    self.is_open = severuserinfo.is_open;
                    self.C2G_GameInfo(true);
                    self.C2G_Sgin();
                    self.C2G_AppID();
                    self.C2G_hzlist();
                    },
                    fail(res)
                    {
                        self.HidePanelMask();
                        Hint.Instance.ShowPop(res);
                    }
                })
                } else {
                    //console.log('登录失败！' + res.errMsg);
                    self.HidePanelMask();
                    Hint.Instance.ShowPop("登陆失败");
                }
            }
        })
    },

//C2G游戏开始
    C2G_GameStart(action)
    {
        if (!CC_WECHATGAME)
            return;
        var self =this;
        wx.request({
            url: 'https://tfk.qkxz.com/?act=index&openid={$openid}',
            data:
            {
                openid: self.playInfo.openid,
                version: self._version,
            },
            success (res) {
                self.gameID = res.data.data.id;
                self.playInfo.curSkin = res.data.data.skin_id;
                action();
            }
          })
    },

//C2G游戏结束
    C2G_GameOver(gold,Score,action)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({
            url: 'https://tfk.qkxz.com/?act=end&openid={$openid}',
            data:
            {
                openid:self.playInfo.openid,
                score: Score,
                id : self.gameID,
                gold: gold,
                version: self._version,
            },
            success (res) {
                action(); 
            }
          })
    },


    C2G_GameOver1(Score)
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({
            url: 'https://tfk.qkxz.com/?act=end&openid={$openid}',
            data:
            {
                openid:self.playInfo.openid,
                score: Score,
                id : self.gameID,
                gold: 0,
                version: self._version,
            },
            success (res) {
            }
          })
    },

//C2G世界排行榜
    C2G_WorldRank()
    {
        if (!CC_WECHATGAME)
        return;
        var self = this;
        wx.request({
            url: 'https://tfk.qkxz.com/?act=paihang&openid={$openid}',
            data:
            {
                openid:self.playInfo.openid,
                version: self._version,
            },
            success (res) {
              myjson = res.data.data;
            }
          })
    },


    ShowOrHideAdervert(Active , action = null)
    {
        if(Active)
        {
            var self = this;
            this.bannerAd = wx.createBannerAd({
                adUnitId: 'adunit-e8e30be4a0b05273',
                style: {
                    left: 0,
                    top: self.height-130,
                    width: 340,
                    height:200,
                }
            });

            this.bannerAd.onError(err => {
                console.log(err)
            })
            
            this.bannerAd.onLoad(() => {
                self.bannerAd.style.top = self.height-self.bannerAd.style.realHeight - 20;
                self.bannerAd.style.left = (self.width - self.bannerAd.style.realWidth )/2;
                self.isfirstBanner = false;
                self.bannerAd.show().then(()=>
                {
                    action();
                });
            })
        }
        else
        {
            this.bannerAd.destroy();
        }
    },

    onShareBtn(action=null){ //分享按钮
        var random = Math.floor(Math.random()*shareImgList.length);
        wx.shareAppMessage({
            title: shareTitleList[random],
            imageUrl: shareImgList[random],
        });
        this.ShareEvent = action;
      
    },
    //分享得复活卡
    onSharaResurtBtn(action = null)
    {
        var self = this;
        var random = Math.floor(Math.random()*shareImgList.length);
        
        wx.shareAppMessage({
            title: shareTitleList[random],
            imageUrl: shareImgList[random],
            query: 'key=' + self.playInfo.id,
        })

        if(action)
        {
            action(); 
        }
    },

    WXTopUI(TXT,State)
    {
        if(cc.CC_WECHATGAME)
        {
            wx.showToast({
                title: TXT,
                icon: State,
                duration: 800
              })
        }
    },

    onEnable()
    {
        WXRequ.Instance = this;
    },

    //关联程序
    associatedProgram(AppID,url,ID)
    {
        var self = this;
        wx.navigateToMiniProgram({
            appId: AppID,
            path: url,
            envVersion: 'release',
            success(res) {
                wx.request({
                    url: "https://tfk.qkxz.com/index.php?act=cgame",
                    data: {
                      openid: self.playInfo.openid,
                      id: ID,
                      appid:AppID,
                      version: self._version,
                    },
                  });
            }
        })
    }, 

    //告诉后台我打开了那个APP
    CG2_AppReqCount(ID)
    {
        if (!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url:'https://tfk.qkxz.com/index.php?act=game',
            data:
            {
                openid:self.playInfo.openid,
                id:ID,
                version: self._version,
            },
            success (res) 
            {
                
            }
        });
    },

    C2G_AppID()
    {
        if (!CC_WECHATGAME)
            return;
        var self =this; 
        wx.request({
            url: 'https://tfk.qkxz.com/index.php?act=gamelist',
            data:
            {
                openid: self.playInfo.openid,
                version: self._version,
            },
            success (res) 
            {
                var data = res.data.data;
                
                self._AppIDInfoList = data.gamelist;
                
               
                 //显示渠道
                self.AppNodeUI.getComponent("UIBtnNodeApp").ShowApp(self._AppIDInfoList);
                
                //ShareAndVideo.Instance.HidePanelMask(1);
            }
        })
    },

    C2G_hzlist()
    {
        if(!CC_WECHATGAME)
            return;
        var self = this;
        wx.request({
            url: 'https://tfk.qkxz.com/index.php?act=hzlist',
            data:
            {
                openid: self.playInfo.openid,
                version: self._version,
            },
            success (res) {
                self.BoxApp.getComponent("UIAppBox").ShowBox(res.data.data);
            }
        });
    },

    SeeVideo(action)
    {
        this.Init.ShowPanelMask();
        if(!CC_WECHATGAME)
            return;

        this.videoAd.load().then(() => 
        {
            this.Init.HidePanelMask(1);
            this.isStop = true;
            this.videoAd.show()
        });

        this.videoAd.onClose(res => {
            this.videoAd.offClose();
            if ( res && res.isEnded || res === undefined)
            {
               action();
            } 
        })
    }

});
module.exports = WXRequ;