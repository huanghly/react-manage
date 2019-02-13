const MenuData =
    {
        "data": {
            "menuList": [
                {
                    "title": "用户管理",
                    "key": "用户管理",
                    "icon": require('../resources/imgs/user_icon1.png'),
                    "data": [

                        {
                            "title": "用户列表",
                            "key": "/index/user/userList",
                            "path": "/bihai/user/**"
                        },
                        {
                            "title": "用户资产",
                            "key": "/index/user/userProperty",
                            "path": "/bihai/account/position/**"
                        },
                        {
                            "title": "高级身份认证",
                            "key": "/index/user/authentication",
                            "path": "/bihai/user/senior/**"
                        },
                        {
                            "title": "用户登录黑名单",
                            "key": "/index/user/logoinBlackList",
                            "path": "/bihai/user_status/**"
                        },
                        {
                            "title": "用户提现黑名单",
                            "key": "/index/user/withdrawBlacklist",
                            "path": "/bihai/user_status/**"
                        },
                        {
                            "title": "用户交易黑名单",
                            "key": "/index/user/tradeBlacklist",
                            "path": "/bihai/user_status/**"
                        },
                        {
                            "title": "提现手续费白名单",
                            "key": "/index/user/CashFeeWhiteList",
                            "path": "/bihai/user_status/**"
                        },
                        {
                            "title": "交易手续费白名单",
                            "key": "/index/user/TradeFeeWhiteList",
                            "path": "/bihai/user_status/**"
                        },
                        {
                            "title": "登录日志",
                            "key": "/index/user/LoginLog",
                            "path": "/bihai/login/**"
                        }
                    ]
                },
                {
                    "title": "币种管理",
                    "key": "币种管理",
                    "icon": require('../resources/imgs/coin_icon1.png'),
                    "data": [
                        {
                            "title": "添加货币类型",
                            "key": "/index/CoinManagement/addCoinType",
                            "path": "/bihai/account/coininfo/**"
                        },
                        {
                            "title": "币币交易对",
                            "key": "/index/CoinManagement/CoinDoubleTrade",
                            "path": "/bihai/symbol/**"
                        },
                        {
                            "title": "法币交易币种",
                            "key": "/index/CoinManagement/OtcCoinTrade",
                            "path": "/bihai/account/coin/otc/**"
                        }
                    ]
                },
                {
                    "title": "手续费管理",
                    "key": "手续费管理",
                    "icon": require('../resources/imgs/charge_icon1.png'),
                    "data": [
                        {
                            "title": "费率标准",
                            "key": "/index/PoundageManagement/LevelRateList",
                            "path": "/bihai/user/rate/**"
                        },
                        {
                            "title": "提现手续费",
                            "key": "/index/PoundageManagement/WithDrawRateList",
                            "path": "/bihai/misc/withdraw/rate/**"
                        }
                    ]
                },
                {
                    "title": "资金管理",
                    "key": "资金管理",
                    "icon": require('../resources/imgs/monery_icon1.png'),
                    "data": [
                        {
                            "title": "待初审提现列表",
                            "key": "/index/MoneyManagement/WaitingFirstrialList",
                            "path": "/bihai/account/coindraw/pass_first/**"
                        },
                        {
                            "title": "待复审提现列表",
                            "key": "/index/MoneyManagement/WaitingReviewList",
                            "path": "/bihai/account/coindraw/pass_second/**"
                        },
                        {
                            "title": "待出币提现列表",
                            "key": "/index/MoneyManagement/WaitingCoinOutList",
                            "path": "/bihai/account/coindraw/cash_pass/**"
                        }
                        ,
                        {
                            "title": "提现异常列表",
                            "key": "/index/MoneyManagement/WithdrawErrorList",
                            "path": "/bihai/coindraw/error/**"
                        }, {
                            "title": "杠杆账户资金明细",
                            "key": "/index/MoneyManagement/LeverMoneyInfo",
                            "path": "/bihai/trade/detail/**"
                        },

                        {
                            "title": "币币账户提现明细",
                            "key": "/index/MoneyManagement/WithdrawMoneyInfo",
                            "path": "/bihai/coindraw/list"
                        },
                        {
                            "title": "币币账户充值明细",
                            "key": "/index/MoneyManagement/RechargeMoneyInfo",
                            "path": "/bihai/trade/detail/**"
                        },
                        {
                            "title": "币币账户资金明细",
                            "key": "/index/MoneyManagement/CoinMoneyInfo",
                            "path": "/bihai/trade/detail/**"
                        },
                        {
                            "title": "法币账户资金明细",
                            "key": "/index/MoneyManagement/FiatMoneyInfo",
                            "path": "/bihai/trade/detail/**"
                        },
                        {
                            "title": "加减币操作",
                            "key": "/index/MoneyManagement/AddAndSubtractAction",
                            "path": "/bihai/account/coin/mh/**"
                        },
                        {
                            "title": "资金平衡表",
                            "key": "/index/MoneyManagement/CashBalanceList",
                            "path": "/bihai/account/balance/**"
                        }
                    ]
                },
                {
                    "title": "订单管理",
                    "key": "订单管理",
                    "icon": require('../resources/imgs/order_icon1.png'),

                    "data": [
                        {
                            "title": "币币委托列表",
                            "key": "/index/OrderManagement/tradeEntrust",
                            "path": "/bihai/entrust/**"
                        },
                        {
                            "title": "币币历史委托列表",
                            "key": "/index/OrderManagement/CoinHistoryEntrustList",
                            "path": "/bihai/entrust/history/**"
                        },
                        {
                            "title": "法币交易广告列表",
                            "key": "/index/OrderManagement/AdvertisingPages",
                            "path": "/bihai/c2c/advertising/**"
                        },
                        {
                            "title": "法币交易订单列表",
                            "key": "/index/OrderManagement/TradeOrderPages",
                            "path": "/bihai/c2c/trade/order/**"
                        },
                        {
                            "title": "法币交易申诉订单",
                            "key": "/index/OrderManagement/OrderAppealPages",
                            "path": "/bihai/c2c/order/appeal/**"
                        }
                        ,
                        {
                            "title": "杠杆持仓订单",
                            "key": "/index/OrderManagement/LeveragePosition",
                            "path": "/bihai/leverage/**"
                        },
                        {
                            "title": "杠杆委托订单",
                            "key": "/index/OrderManagement/LeverageTradeList",
                            "path": "/bihai/leverage/**"
                        }
                        ,
                        {
                            "title": "杠杆历史订单",
                            "key": "/index/OrderManagement/LeverageTradeHisList",
                            "path": "/bihai/leverage/history/**"
                        },
                        {
                            "title": "上游报单列表",
                            "key": "/index/OrderManagement/UpstreamDeclaration",
                            "path": "bihai/tradeEntrustHis/aboveOrderList"
                        }
                    ]
                },
                {
                    "title": "交易挖矿",
                    "key": "交易挖矿",
                    "icon": require('../resources/imgs/system_icon1.png'),
                    "data": [
                        {
                            "title": "挖矿列表",
                            "key": "/index/DigManagement/DigList",
                            "path": "/bihai/excel/**"
                        },
                        {
                            "title": "挖矿数据展示",
                            "key": "/index/DigManagement/Setting",
                            "path": "/bihai/index/**"
                        },
                    ]
                },
                {
                    "title": "内容管理",
                    "key": "内容管理",
                    "icon": require('../resources/imgs/content_icon1.png'),
                    "data": [
                        {
                            "title": "帮助中心",
                            "key": "/index/ContentManagement/HelpCenter",
                            "path": "/bihai/coArticleCategory/**"
                        },
                        {
                            "title": "文章列表",
                            "key": "/index/ContentManagement/ArticleList",
                            "path": "/bihai/misc/article/**"
                        },
                        {
                            "title": "文章类型",
                            "key": "/index/ContentManagement/ArticleType",
                            "path": "/bihai/misc/article/type/**"
                        },
                        {
                            "title": "Banner管理",
                            "key": "/index/ContentManagement/BannerManagement",
                            "path": "/bihai/misc/banner/**"
                        },
                        {
                            "title": "公告管理",
                            "key": "/index/ContentManagement/NoticeManagement",
                            "path": "/bihai/misc/announcement/**"
                        }
                    ]
                },
                {
                    "title": "管理员管理",
                    "key": "管理员管理",
                    "icon": require('../resources/imgs/admin_icon1.png'),
                    "data": [
                        {
                            "title": "角色管理",
                            "key": "/index/AdminManagement/RoleList",
                            "path": "/bihai/security/role/**"
                        },
                        {
                            "title": "管理员管理",
                            "key": "/index/AdminManagement/AdminList",
                            "path": "/bihai/security/administrators/**"
                        }
                    ]
                },
                {
                    "title": "日志管理",
                    "key": "日志管理",
                    "icon": require('../resources/imgs/log_icon1.png'),
                    "data": [
                        {
                            "title": "错误日志列表",
                            "key": "/index/LogMangement/ErrorLogList",
                            "path": "/bihai/log/**"
                        }
                    ]
                },
                {
                    "title": "系统管理",
                    "key": "系统管理",
                    "icon": require('../resources/imgs/system_icon1.png'),
                    "data": [
                        {
                            "title": "App版本",
                            "key": "/index/SystemManagement/AppVersionList",
                            "path": "/bihai/misc/app/version/**"
                        },
                        {
                            "title": "API管理",
                            "key": "/index/SystemManagement/APIManagement",
                            "path": "/bihai/misc/quantizationAuth/**"
                        },
                        {
                            "title": "邀请注册",
                            "key": "/index/SystemManagement/InviteManagement",
                            "path": "/bihai/misc/invite/**"
                        }
                    ]
                }
            ]
        }
    }
export default MenuData

