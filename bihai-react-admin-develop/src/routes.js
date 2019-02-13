/* eslint-disable react/react-in-jsx-scope */

import Index from './pages/Index'; // exact首页，默认指定首页
import UserList from './pages/UserManagement/UserList.js'
import LoginLog from './pages/UserManagement/LoginLog.js'
import UserProperty from './pages/UserManagement/UserProperty.js'
import UserPropertyInfo from './pages/UserManagement/UserPropertyInfo.js'
import Authentication from './pages/UserManagement/Authentication.js'
import UserWalletAddress from './pages/UserManagement/UserWalletAddress.js'
import LogoinBlackList from './pages/UserManagement/LoginBlackList.js'
import NewList from './pages/ContentManagement/NewList.js'
import UserDetail from './pages/UserManagement/UserDetail'
import TradeBlacklist from './pages/UserManagement/TradeBlacklist'
import WithdrawBlacklist from './pages/UserManagement/WithdrawBlacklist'
import AddCoinType from './pages/CoinManagement/AddCoinType'
import AddCoinTypeEdit from './pages/CoinManagement/AddCoinTypeEdit'
import TradeEntrust from './pages/OrderManagement/TradeEntrust'
import WaitingCoinOutList from './pages/MoneyManagement/WaitingCoinOutList'
import WaitingReviewList from './pages/MoneyManagement/WaitingReviewList'
import WaitingFirstrialList from './pages/MoneyManagement/WaitingFirstrialList'
import ReviewPage from './pages/MoneyManagement/ReviewPage.js'
import WithdrawInfo from './pages/MoneyManagement/WithdrawMoneyInfo.js'
import CoinMoneyInfo from './pages/MoneyManagement/CoinMoneyInfo.js'
import FiatMoneyInfo from './pages/MoneyManagement/FiatMoneyInfo.js'
import RoleList from './pages/AdminManagement/RoleList.js'
import PermissionsList from './pages/AdminManagement/PermissionsList.js'
import AdminList from './pages/AdminManagement/AdminList.js'
import AddAndSubtractAction from './pages/MoneyManagement/AddAndSubtractAction.js'
import LeverMoneyInfo from './pages/MoneyManagement/LeverMoneyInfo.js'
import AddAndSubtractDetail from './pages/MoneyManagement/AddAndSubtractDetail.js'
import CoinHistoryEntrustList from './pages/OrderManagement/CoinHistoryEntrustList.js'
import AdvertisingPages from './pages/OrderManagement/AdvertisingPages.js'
import AdvertisingPagesInfo from './pages/OrderManagement/AdvertisingPagesInfo.js'
import TradeOrderPages from './pages/OrderManagement/TradeOrderPages.js'
import OrderAppealPages from './pages/OrderManagement/OrderAppealPages.js'
import OrderAppealPagesInfo from './pages/OrderManagement/OrderAppealPagesInfo.js'
import ArticleList from './pages/ContentManagement/ArticleList.js'
import ArticleType from './pages/ContentManagement/ArticleType.js'
import HelpCenter from './pages/ContentManagement/HelpCenter.js'
import ArticleEditPage from './pages/ContentManagement/ArticleEditPage.js'
import WithDrawRateList from './pages/PoundageManagement/WithDrawRateList.js'
import TradeFeeWhiteList from './pages/UserManagement/TradeFeeWhiteList.js'
import CoinDoubleTrade from './pages/CoinManagement/CoinDoubleTrade.js'
import CoinDoubleTradeDetail from './pages/CoinManagement/CoinDoubleTradeDetail.js'
import CashFeeWhiteList from './pages/UserManagement/CashFeeWhiteList.js'
import AppVersionList from './pages/SystemManagement/AppVersionList.js'
import BannerManagement from './pages/ContentManagement/BannerManagement.js'
import NoticeManagement from './pages/ContentManagement/NoticeManagement.js'
import OtcCoinTrade from './pages/CoinManagement/OtcCoinTrade.js'
import CashBalanceList from './pages/MoneyManagement/CashBalanceList.js'
import RechargeMoneyInfo from './pages/MoneyManagement/RechargeMoneyInfo.js'
import WithdrawErrorList from './pages/MoneyManagement/WithdrawErrorList.js'
import PermissionsEdit from './pages/AdminManagement/PermissionsEdit.js'
import EditLevelRate from './pages/PoundageManagement/EditLevelRate.js'
import LevelRateList from './pages/PoundageManagement/LevelRateList.js'
import LeverageTradeHisList from './pages/OrderManagement/LeverageTradeHisList'
import LeverageTradeList from './pages/OrderManagement/LeverageTradeList'
import LeveragePosition from './pages/OrderManagement/LeveragePosition'
import UpstreamDeclaration from './pages/OrderManagement/UpstreamDeclaration'
import InviteManagement from './pages/SystemManagement/InviteManagement'
import APIManagement from './pages/SystemManagement/APIManagement'
import ErrorLogList from './pages/LogMangement/ErrorLogList'

// index 默认 重定向 跳转

import DigList from './pages/DigManagement/DigList'
import Setting from './pages/DigManagement/Setting'

// index 默认 重定向 跳转
export const routes = [
    {component: Setting, path: '/index/DigManagement/Setting'},
    {component: DigList, path: '/index/DigManagement/DigList'},
    {component: ErrorLogList, path: '/index/LogMangement/ErrorLogList'},
    {component: WithdrawErrorList, path: '/index/MoneyManagement/WithdrawErrorList'},
    {component: APIManagement, path: '/index/SystemManagement/APIManagement'},
    {component: NoticeManagement, path: '/index/ContentManagement/NoticeManagement'},
    {component: InviteManagement, path: '/index/SystemManagement/InviteManagement'},
    {component: UpstreamDeclaration, path: '/index/OrderManagement/UpstreamDeclaration'},
    {component: LeveragePosition, path: '/index/OrderManagement/LeveragePosition'},
    {component: LeverageTradeHisList, path: '/index/OrderManagement/LeverageTradeHisList'},
    {component: LeverageTradeList, path: '/index/OrderManagement/LeverageTradeList'},
    {component: PermissionsEdit, path: '/index/AdminManagement/PermissionsEdit'},
    {component: EditLevelRate, path: '/index/PoundageManagement/EditLevelRate'},
    {component: CashBalanceList, path: '/index/MoneyManagement/CashBalanceList'},
    {component: LevelRateList, path: '/index/PoundageManagement/LevelRateList'},
    {component: CoinHistoryEntrustList, path: '/index/OrderManagement/CoinHistoryEntrustList'},
    {component: OtcCoinTrade, path: '/index/CoinManagement/OtcCoinTrade'},
    {component: AppVersionList, path: '/index/SystemManagement/AppVersionList'},
    {component: TradeFeeWhiteList, path: '/index/user/TradeFeeWhiteList'},
    {component: RechargeMoneyInfo, path: '/index/MoneyManagement/RechargeMoneyInfo'},
    {component: CashFeeWhiteList, path: '/index/user/CashFeeWhiteList'},
    {component: WithDrawRateList, path: '/index/PoundageManagement/WithDrawRateList'},
    {component: ArticleEditPage, path: '/index/ContentManagement/ArticleEditPage'},
    {component: CoinDoubleTradeDetail, path: '/index/ContentManagement/CoinDoubleTradeDetail'},
    {component: BannerManagement, path: '/index/ContentManagement/BannerManagement'},
    {component: ArticleList, path: '/index/ContentManagement/ArticleList'},
    {component: ArticleType, path: '/index/ContentManagement/ArticleType'},
    {component: HelpCenter, path: '/index/ContentManagement/HelpCenter'},
    {component: OrderAppealPagesInfo, path: '/index/OrderManagement/OrderAppealPagesInfo'},
    {component: OrderAppealPages, path: '/index/OrderManagement/OrderAppealPages'},
    {component: TradeOrderPages, path: '/index/OrderManagement/TradeOrderPages'},
    {component: AdvertisingPagesInfo, path: '/index/OrderManagement/AdvertisingPagesInfo'},
    {component: AdvertisingPages, path: '/index/OrderManagement/AdvertisingPages'},
    {component: AdminList, path: '/index/AdminManagement/AdminList'},
    {component: AddAndSubtractDetail, path: '/index/MoneyManagement/AddAndSubtractDetail'},
    {component: LeverMoneyInfo, path: '/index/MoneyManagement/LeverMoneyInfo'},
    {component: PermissionsList, path: '/index/AdminManagement/PermissionsList'},
    {component: RoleList, path: '/index/AdminManagement/RoleList'},
    {component: UserWalletAddress, path: '/index/user/userWalletAddress'},
    {component: UserList, path: '/index/user/userList'},
    {component: UserDetail, path: '/index/user/userDetail'},
    {component: LogoinBlackList, path: '/index/user/logoinBlackList'},
    {component: NewList, path: '/index/newList'},
    {component: Authentication, path: '/index/user/authentication'},
    {component: TradeBlacklist, path: '/index/user/tradeBlacklist'},
    {component: WithdrawBlacklist, path: '/index/user/withdrawBlacklist'},
    {component: AddCoinType, path: '/index/CoinManagement/addCoinType'},
    {component: CoinDoubleTrade, path: '/index/CoinManagement/CoinDoubleTrade'},
    {component: TradeEntrust, path: '/index/OrderManagement/tradeEntrust'},
    {component: WaitingCoinOutList, path: '/index/MoneyManagement/WaitingCoinOutList'},
    {component: WaitingReviewList, path: '/index/MoneyManagement/WaitingReviewList'},
    {component: WaitingFirstrialList, path: '/index/MoneyManagement/WaitingFirstrialList'},
    {component: ReviewPage, path: '/index/MoneyManagement/ReviewPage'},
    {component: WithdrawInfo, path: '/index/MoneyManagement/WithdrawMoneyInfo'},
    {component: CoinMoneyInfo, path: '/index/MoneyManagement/CoinMoneyInfo'},
    {component: FiatMoneyInfo, path: '/index/MoneyManagement/FiatMoneyInfo'},
    {component: AddCoinTypeEdit, path: '/index/MoneyManagement/AddCoinTypeEdit'},
    {component: UserProperty, path: '/index/user/userProperty'}, //用户资产
    {component: UserPropertyInfo, path: '/index/user/UserPropertyInfo'}, //用户资产
    {component: LoginLog, path: '/index/user/LoginLog'},
    {component: AddAndSubtractAction, path: '/index/MoneyManagement/AddAndSubtractAction'},
]
export const routes_start = [
    {component: Index, path: '/index'},
]
export const breadcrumbNameMap = {
    '/index': '首页',
    '/index/PoundageManagement': '手续费管理',
    '/index/user/tradeBlacklist': '用户交易黑名单',
    '/index/OrderManagement/UpstreamDeclaration': '上游报单列表',
    '/index/LogMangement/ErrorLogList': '错误日志',
    '/index/LogMangement': '日志管理',

    '/index/DigManagement/DigList': '挖矿列表',
    '/index/DigManagement/Setting': '挖矿数据展示',
    '/index/DigManagement': '交易挖矿',
    '/index/OrderManagement/LeveragePosition': '杠杆持仓订单',
    '/index/OrderManagement/LeverageTradeHisList': '杠杆历史订单',
    '/index/OrderManagement/LeverageTradeList': '杠杆委托订单',
    '/index/AdminManagement/PermissionsEdit': '编辑权限',
    '/index/SystemManagement/InviteManagement': '邀请管理',
    '/index/PoundageManagement/EditLevelRate': '编辑手续费',
    '/index/AdminManagement/RoleList': '角色管理',
    '/index/CoinManagement/OtcCoinTrade': '法币交易币种',
    '/index/CoinManagement/CoinDoubleTrade': '币币交易对',
    '/index/MoneyManagement/RechargeMoneyInfo': '币币充值明细',
    '/index/ContentManagement/CoinDoubleTradeDetail': '编辑',
    '/index/PoundageManagement/LevelRateList': '费率标准',
    '/index/PoundageManagement/WithDrawRateList': '提现手续费',
    '/index/ContentManagement': '内容管理',
    '/index/ContentManagement/ArticleEditPage': '编辑文章',
    '/index/ContentManagement/ArticleList': '文章列表',
    '/index/ContentManagement/ArticleType': '文章类型',
    '/index/ContentManagement/HelpCenter': '帮助中心',
    '/index/OrderManagement': '订单管理',
    '/index/ContentManagement/NoticeManagement': '公告管理',
    '/index/OrderManagement/CoinHistoryEntrustList': '币币历史委托列表',
    '/index/OrderManagement/OrderAppealPagesInfo': '法币申诉列表详情',
    '/index/OrderManagement/OrderAppealPages': '法币申诉列表',
    '/index/OrderManagement/TradeOrderPages': '法币交易订单列表',
    '/index/OrderManagement/AdvertisingPages': '法币广告列表',
    '/index/OrderManagement/AdvertisingPagesInfo': '法币广告列表详细',
    '/index/MoneyManagement/WithdrawErrorList': '提现异常列表',
    '/index/MoneyManagement/AddAndSubtractDetail': '添加币',
    '/index/MoneyManagement/AddAndSubtractAction': '加减币操作',
    '/index/MoneyManagement/LeverMoneyInfo': '杠杆资金明细',
    '/index/MoneyManagement/FiatMoneyInfo': '法币资金明细',
    '/index/MoneyManagement/CoinMoneyInfo': '币币资金明细',
    '/index/user/LoginLog': '登录日志',
    '/index/user/userList': '用户列表',
    '/index/user/userDetail': '用户详细',
    '/index/user/userProperty': '用户资产',
    '/index/user/userPropertyInfo': '个人资金平衡列表',
    '/index/user/TradeFeeWhiteList': '交易白名单',
    '/index/user/CashFeeWhiteList': '交易白名单',
    '/index/user/authentication': '高级身份认证',
    '/index/user/logoinBlackList': '用户登录黑名单',
    '/index/user/withdrawBlacklist': "用户提现黑名单",
    '/index/CoinManagement': '币种管理',
    '/index/CoinManagement/addCoinType': '添加货币类型',
    '/index/OrderManagement/tradeEntrust': '币币委托订单',
    '/index/user': '用户管理',
    '/index/user/userWalletAddress': '用户钱包地址',
    '/index/MoneyManagement/WaitingCoinOutList': '待出币提现列表',
    '/index/MoneyManagement/WaitingFirstrialList': '待初审提现列表',
    '/index/MoneyManagement': '资金管理',
    '/index/MoneyManagement/WaitingReviewList': '待复审提现列表',
    '/index/MoneyManagement/ReviewPage': '提现审核',
    '/index/MoneyManagement/WithdrawMoneyInfo': '币币提现明细',
    '/index/MoneyManagement/AddCoinTypeEdit': '货币添加',
    '/index/AdminManagement/AdminList': '管理员列表',
    '/index/AdminManagement/PermissionsList': '权限列表',
    '/index/AdminManagement': '管理员管理',
    '/index/SystemManagement': '系统管理',
    '/index/SystemManagement/AppVersionList': 'app版本管理',
    '/index/SystemManagement/APIManagement': 'API量化',
    '/index/ContentManagement/BannerManagement': '轮播图管理',
    '/index/MoneyManagement/CashBalanceList': '资金平衡表'
};
export default routes;
