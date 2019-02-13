//10030005:待初审;10030010:待复审;10030015:待出币;10030020:已出币;10030025:已驳回;10030030:未成功
// noinspection JSAnnotator
const Status = {
    //First
    WAITING_FIRST_TRIAL_PAGE: 1003,
    WAITING_REVIEW_PAGE: 1003,
    WAITING_COIN_OUT_PAGE: 1003,
    ALREADY_COIN_OUT_PAGE: 1003,
    //转账类型 transfer
//加减币状态
    STATUS_ADD_: 1008,
    // STATUS_ADD_: 1006,
    TRANSFER_TYPE: 1002,
    MONEY_TYPE: 1001,//账户类型
    WAITING_FIRST_TRIAL: 10030005,
    WAITING_REVIEW: 10030010,
    WAITING_COIN_OUT: 10030015,
    ALREADY_COIN_OUT: 10030020,

}
//审核 提现 状态
export const StatusMap = [{
    dicKey: 10030005,
    dicName: '待初审',
    selectStep: 0
}, {
    dicKey: 10030010,
    dicName: '待复审',
    selectStep: 1

}, {
    dicKey: 10030015,
    dicName: '待出币',
    selectStep: 2

}, {
    dicKey: 10030020,
    dicName: '出币中',
    selectStep: 3

}, {
    dicKey: 10030025,
    dicName: '出币成功',
    selectStep: 4
}, {
    dicKey: 10030030,
    dicName: '出币失败',
    selectStep: null

}, {
    dicKey: 10030035,
    dicName: '已驳回',
    selectStep: null
}]
//类型
export const CoinDrawStatus = [
    {
        dicKey: 10020005,
        dicName: '平台转账',
    }, {
        dicKey: 10020010,
        dicName: '网络转出',

    }, {
        dicKey: 10020015,
        dicName: '账户划出',
    }]

//资金类型
export const HandleTypeB = [
    {
        dicKey: 10010005,
        dicName: '平台转入',
    }, {
        dicKey: 10010010,
        dicName: '网络转入',

    }, {
        dicKey: 10010015,
        dicName: '平台转出',
    }, {
        dicKey: 10010020,
        dicName: '网络转出',
    }, {
        dicKey: 10010025,
        dicName: '账户划入',

    }, {
        dicKey: 10010030,
        dicName: '账户划出',
    }, {
        dicKey: 10010035,
        dicName: '资金冻结',
    }, {
        dicKey: 10010040,
        dicName: '资金解冻',

    }, {
        dicKey: 10010045,
        dicName: '交易买入',
    }, {
        dicKey: 10010050,
        dicName: '交易卖出',
    }, {
        dicKey: 10010055,
        dicName: '交易手续费',

    }, {
        dicKey: 10010060,
        dicName: '提现手续费',
    }, {
        dicKey: 10010065,
        dicName: '活动赠送',

    }, {
        dicKey: 10010070,
        dicName: '特殊扣除',
    }, {
        dicKey: 10010075,
        dicName: '挖矿',
    }, {
        dicKey: 10010080,
        dicName: '返佣',
    }, {
        dicKey: 10010085,
        dicName: '分红',
    }, {
        dicKey: 10010090,
        dicName: '人工冻结',
    }, {
        dicKey: 10010095,
        dicName: '人工解冻',
    }, {
        dicKey: 10010100,
        dicName: '提现冻结',
    }, {
        dicKey: 10010105,
        dicName: '提现解冻',
    }
]
//充值资金列表
export const AddHandleType = [
    {
        dicKey: 10010005,
        dicName: '平台转入',

    }, {
        dicKey: 10010010,
        dicName: '网络转入',
    }, {
        dicKey: 10010025,
        dicName: '账户划入',

    }
]

export const HandleType = [
    {
        dicKey: 10050005,
        dicName: '平台转入',
    }, {
        dicKey: 10050010,
        dicName: '平台转出',

    }, {
        dicKey: 10050015,
        dicName: '交易买入',
    }, {
        dicKey: 10050020,
        dicName: '交易卖出',
    }, {
        dicKey: 10050025,
        dicName: '账户划入',

    }, {
        dicKey: 10050030,
        dicName: '账户划出',
    }, {
        dicKey: 10050035,
        dicName: '资金冻结',
    }, {
        dicKey: 10050040,
        dicName: '资金解冻',

    }, {
        dicKey: 10050045,
        dicName: '交易手续费',
    }

]
export const leverageTradeState = [
    {
        dicKey: 0,
        dicName: '委托中',
    }, {
        dicKey: 1,
        dicName: '部分成交',

    }, {
        dicKey: 2,
        dicName: '已成交',
    }, {
        dicKey: 3,
        dicName: '部分成交待撤',
    }, {
        dicKey: 4,
        dicName: '部分成交已撤',

    }
    , {
        dicKey: 5,
        dicName: '已撤',
    }
]
export const EntrusState = [
    {
        dicKey: 0,
        dicName: '委托中',
    }, {
        dicKey: 1,
        dicName: '部分成交',

    }, {
        dicKey: 2,
        dicName: '已成交',
    }, {
        dicKey: 3,
        dicName: '部分成交待撤',
    }, {
        dicKey: 4,
        dicName: '部分成交已撤',

    }, {
        dicKey: 5,
        dicName: '待撤',
    }
    , {
        dicKey: 6,
        dicName: '已撤',
    }
]
// 1 止损平仓，2 止盈平仓，3 风控平仓，4 用户平仓
export const HisState = {
    1: '止损平仓',
    2: '止盈平仓',
    4: '用户平仓',
    5: '管理平仓',
    3: '风控平仓',
}

//加减币状态
export const CoinHandleState = [
    {
        dicKey: 10080005,
        dicName: '待审核',
    }, {
        dicKey: 10080010,
        dicName: '待发放',

    }, {
        dicKey: 10080015,
        dicName: '已发放',
    }, {
        dicKey: 10080020,
        dicName: '已驳回',
    }
]
//balance
//加减币状态//"资产类型:10060005.币币账户;10060010.法币账户,10060015,杠杆账户",
export const CoinBalanceState = [
    {
        dicKey: 10060005,
        dicName: '币币账户',
    }, {
        dicKey: 10060010,
        dicName: '法币账户',

    }, {
        dicKey: 10060015,
        dicName: '杠杆账户',
    }
]
//资金类型
export const LeverState = [
    {
        dicKey: 10070005,
        dicName: '盈利',
    }, {
        dicKey: 10070010,
        dicName: '亏损',
    }, {
        dicKey: 10070015,
        dicName: '交易买入',
    }, {
        dicKey: 10070020,
        dicName: '交易卖出',
    }, {
        dicKey: 10070025,
        dicName: '账户划入',
    }, {
        dicKey: 10070030,
        dicName: '账户划出',
    }, {
        dicKey: 10070035,
        dicName: '资金冻结',
    }, {
        dicKey: 10070040,
        dicName: '资金解冻',
    }, {
        dicKey: 10070045,
        dicName: '交易手续费',
    }
]
//提现状态
export const WithdrawStatus = [
    {
        dicKey: 10060005,
        dicName: '币币账户',
    }, {
        dicKey: 10060010,
        dicName: '法币账户',

    }, {
        dicKey: 10060015,
        dicName: '杠杆账户',
    }
]

//提现类型
export const WithdrawType = [
    {
        dicKey: 10060005,
        dicName: '币币账户',
    }, {
        dicKey: 10060010,
        dicName: '法币账户',

    }, {
        dicKey: 10060015,
        dicName: '杠杆账户',
    }
]

//高级认证状态
export const seniorAuth = ['未认证', '待审核', '未通过', '已认证']

export default Status
//委托单状态: 0 委托中，1 部分成交，2 已成交，3 部分成交待撤，4 部分成交已撤，5 已撤

