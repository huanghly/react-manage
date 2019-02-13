import axios from 'axios';
import simpleUrl from 'simple-url';
import appStore, {logoutClearPairs} from '../appStore';
import history from '../history';
import {message} from 'antd';
import ENV from '../config/appConfig';


axios.defaults.retry = 1;
axios.defaults.retryDelay = 100;
axios.defaults.headers['Content-Type'] = 'application/json;UTF-8'
axios.defaults.timeout = 6000;

axios.interceptors.request.use(function (config) {
    // Do something before request is sent
    // console.log('axios request', config);
    return config;
}, function (error) {
    // Do something with request error
    // console.log('axios request error', error);
    return Promise.reject(error);
});

//const header = {'Content-Type': 'application/json', 'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token}


axios.interceptors.response.use(function (response) {

    return response;
}, function (err) {
    var config = err.config,
        status = err.response && err.response.data && err.response.data.status || null;
    // If the status code is 401, jump to login
    if (status === 401) {
        window.localStorage.setItem('user', null)
        // Object.keys(logoutClearPairs).forEach(key => {
        //     appStore.set(key, logoutClearPairs[key]);
        // });
        message.warning('登陆失效，请重新登陆！')
        history.push('/');
    }
    if (status === 403) {
        message.warning('没访问权限')
    }
    // If config does not exist or the retry option is not set, reject
    if (!config || !config.retry) return Promise.reject(err);

    // Set the variable for keeping track of the retry count
    config.__retryCount = config.__retryCount || 0;

    // Check if we've maxed out the total number of retries
    if (config.__retryCount >= config.retry) {
        // Reject with the error
        return Promise.reject(err.response);
    }

    // Increase the retry count
    config.__retryCount += 1;

    // Create new promise to handle exponential backoff
    var backoff = new Promise(function (resolve) {
        setTimeout(function () {
            resolve();
        }, config.retryDelay || 1);
    });

    // Return the promise in which recalls axios to retry the request
    return backoff.then(function () {
        return axios(config);
    });
    // Do something with response error
    // console.log('axios response error', error);
    // return Promise.reject(error);
});

//http://192.168.100.100:8080/article/list?pageNo=1&pageSize=10 ///swagger-ui.html
function createUrl(path, query, hash) { // 用户接口
    return simpleUrl.create({
        protocol: 'http',
        host: ENV.getENV().httpApi,  // 测试
        pathname: path,
        query: query,
        hash: hash
    });
}

// JSON.parse(window.localStorage.getItem('user')).token
/**
 * 用户列表  用户信息列表
 * **/
export function userInfoList(req) {
    //console.log(JSON.parse(window.localStorage.getItem('user')).token)
    // appStore.get(['user', 'token'])
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/user/userList', req),
        url: createUrl('/bihai/user/user_list', req),
        method: 'get'
    });
}


/**
 * 钱包地址  需要对接
 * **/
export function walletAddress(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/walletAddress', req),
        method: 'get'
    });
}

/**
 * 登录黑名单  需要对接
 * **/
export function blackList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/blackList', req),
        method: 'get'
    });
}

/**
 * 提现黑名单  需要对接
 * **/
export function withdrawBlacklist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/withdrawBlacklist', req),
        method: 'get'
    });
}

/**
 * 交易黑名单   需要对接
 * **/
export function tradeBlacklist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/tradeBlacklist', req),
        method: 'get'
    });
}

/**
 * 禁止提币  需要对接
 * **/
export function lockWithdrawCash(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/lockWithdrawCash', req),
        method: 'get'
    });
}

/**
 * 启动提币  需要对接
 * **/
export function unlockWithdrawCash(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/unlockWithdrawCash', req),
        method: 'get'
    });
}

/**
 * 禁止交易  需要对接
 * **/
export function lockTrade(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/lockTrade', req),
        method: 'get'
    });
}

/**
 * 解锁交易  需要对接
 * **/
export function unlockTrade(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/unlockTrade', req),
        method: 'get'
    });
}

/**
 * 修改用户信息  需要对接
 * **/
export function editUserInfo(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/editUserInfo', req),
        method: 'get'
    });
}

/**
 * 手机重置密码  需要对接
 * **/
export function resetLoginPwdForMobile(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/resetLoginPwdForMobile', req),
        //url: createUrl('/v1/bihai/user/reset_login_pwd', req),
        method: 'get'
    });
}

/**
 * 谷歌重置密码  需要对接
 * **/
export function resetGoogle(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/user/reset_google'),
        data: req,
        method: 'put'
    });
}

/**
 * 邮箱重置登录密码 需要对接
 * **/
export function resetLoginPwdForEmail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/resetLoginPwdForEmail', req),
        method: 'get'
    });
}

//手机重置资金密码  需要对接
export function resetTradePwdForMobile(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/resetTradePwdForMobile', req),
        //url: createUrl('/bihai/user/reset_trade_pwd', req),
        method: 'get'
    });
}

/**
 * 邮件重置资金密码  需要对接
 * **/
export function resetTradePwdForEmail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/resetTradePwdForEmail', req),
        method: 'get'
    });
}


/**
 *
 查询用户信息  需要对接
 * **/
export function queryUser(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/queryUser', req),
        method: 'get'
    });
}

/**
 *
 查询登录黑名单  需要对接
 * **/
export function queryLoginBlackUser(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/admin/queryLoginBlackUser', req),
        method: 'get'
    });
}


/**
 *查询文章列表
 * **/
export function articleList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/article/list', req),
        url: createUrl('/bihai/misc/article/list/', req),
        method: 'get'
    });
}

/**
 *查询文章列表  根据id查询文章  需要对接
 * **/
export function articleInfo(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/v1/article/info/', req),
        method: 'get'
    });
}

/**
 *新增文章
 * **/
export function articleSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/article/save'),
        url: createUrl('/bihai/misc/article/save'),
        data: req,
        method: 'post'
    });
}

/**
 *  修改文章状态///v1/article/status/{id}/{status}
 * 删除 服用 状态0 启动 1：停用 文章状态: 1停用 0 启用
 * **/
 //修改文章状态
export function articleStatus(id) {
    //let newPath = '/v1/article/status/' + id + '/1'
    let newPath = '/bihai/misc/article/statu/' + id + '/1'
    return axios({
        // headers:{'Content-Type': 'application/json', 'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token},
        url: createUrl(newPath),
        method: 'get'
    });
}


/**
 v1/article/update
更新文章信息
 **/
export function articleUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/article/update'),
        url: createUrl('/bihai/misc/article/update'),
        data: req,
        method: 'post'
    });
}

/**
 获取全部文章类型列表
 **/
export function articleTypeGetAll(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/articletype/getall', req),
        url: createUrl('/bihai/misc/article/type/getall', req),
        method: 'get'
    });
}

/**
 文章类型列表
 查询文章列表
 **/

//分页查询文章类型列表
export function articleTypeList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/articletype/list', req),
        url: createUrl('/bihai/misc/article/type/list', req),
        method: 'get'
    });
}

//删除文章类型
export function articleRemote(id) {
    //let newPath = '/v1/articletype/remote/' + id
    let newPath = 'bihai/misc/article/type/remote/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}


//创建文章类型
export function articleTypeSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/bihai/misc/article/type/save'),
        data: req,
        method: 'post'
    });
}


/**
 * 修改
 /v1/articletype/remote/{}  修改文章类型
 **/
export function articleTypeUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/articletype/update'),
        url: createUrl('/bihai/misc/article/type/update'),
        data: req,
        method: 'post'
    });
}


/**
 *交易明细查询  需要对接
 **/
export function tradeEntrustDetailList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/bihai/entrust/history/detail/list', req),
        method: 'get'
    });
}


/**
 *v1/tradeEntrust/list
 币币委托单列表   需要对接
 */
export function tradeEntrustList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/bihai/entrust/list', req),
        method: 'get'
    });
}

//交易详情列表  彬彬  交易标的
/**
 *v1/tradeInfo/getById/{id}    根据id查询币币交易对
 * */
export function tradeInfoById(id) {
    //let newPath = '/v1/tradeInfo/getById' + id
    let newPath = '/bihai/symbol/get_by_id/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}

/**
 *v1/tradeInfo/list  分页加载列表 关键字查询  需要对接
 * */
export function tradeInfoList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/bihai/symbol/list', req),
        method: 'get'
    });
}


/**
 *v1/tradeInfo/save 生成交易标的  生成币币交易对
 * */
export function tradeInfoSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/tradeInfo/save'),
        url: createUrl('/bihai/symbol/save'),
        data: req,
        method: 'post'
    });
}


/**
 *v1/tradeInfo/update 修改交易标的  修改币币交易对
 * */
export function tradeInfoUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/tradeInfo/update'),
        //url: createUrl('/bihai/match/update'),
        url: createUrl('/bihai/symbol/update'),
        data: req,
        method: 'post'
    });
}

//修改币币交易对状态
export function tradeInfoupdateStatus(id, status) {
    //let newPath = '/v1/tradeInfo/updateStatus/' + id + `/` + status
    let newPath = '/bihai/symbol/update_status/' + id + `/` + status
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put'
    });
}

//v1/coindraw/list
//状态查前4位
//查询列表8位
//v1/coindraw/list coinDrawStatus：//1003 0005:待初审;10030010:待复审;10030015:待出币;10030020:已出币;10030025:已驳回;10030030:未成功
//查询  币币账户提现明细
export function coindrawList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coindraw/list', req),
        url: createUrl('/bihai/account/coindraw/list', req),
        method: 'get'
    });
}

/**
 * 状态字典 ///v1/dictionary/getdickey/{dicNo}  根据dicNo获取对应字典值
 * */
export function getDickey(id) {
    let dicNo = id
    //let newPath = '/v1/dictionary/getdickey/' + id
    let newPath = '/bihai/account/dictionary/get_dickey/'+dicNo
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}

/**
 * 对应状态列表 /v1/dictionary/list  分页查询字典值
 * */
export function dickeyList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/dictionary/list', req),
        url: createUrl('/bihai/account/dictionary/list', req),
        method: 'get'
    });
}

//获取币种类型对应的名称
export function getCodeType() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coininfo/getcode'),
        url: createUrl('/bihai/account/coininfo/getcode'),
        method: 'get'
    });
}

//提现审核页面-资金流水
export function drawDetail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/trade/detail/draw', req),
        url: createUrl('/bihai/account/detail/draw', req),
        method: 'get'
    });
}

/**
 *新增加币种
 * */
export function coininfoSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coininfo/save'),
        url: createUrl('/bihai/account/coininfo/save'),
        data: req,
        method: 'post'
    });
}

/**
 *新增加币种  分页查询币种信息
 * */
export function coininfoList(req) {
    //console.log(appStore.get(['token']))
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coininfo/list', req),
        url: createUrl('/bihai/account/coininfo/list', req),
        data: req,
        method: 'get'
    });
}

/**
 *踢下线 /v1/user/kick_down_line/{userId}
 * */
export function kickDown(id) {
    let userId = id
    //let newPath = '/v1/user/kick_down_line/' + id
    let newPath = '/bihai/user/kick_down_line/'+userId
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put'
    });
}

//重置登录密码
export function resetLoginPwd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/user/reset_login_pwd'),
        url: createUrl('/bihai/user/reset_login_pwd'),
        data: req,
        method: 'put'
    });
}

//重置交易密码
export function resetTradePwd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/user/reset_trade_pwd'),
        url: createUrl('/bihai/user/reset_trade_pwd'),
        data: req,
        method: 'put'
    });
}

/**
 *根基手机号和邮箱搜索用户
 * */
export function searchUser(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/user/search_user', req),
        url: createUrl('/bihai/user/search/search_user', req),
        method: 'get'
    });
}

/**
 *黑名单 loginStatus tradeStatus withdrawStatus userIds 白名单  
获取用户状态
 * */
export function prohibitStatusList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        // url: createUrl('/v1/user_status/user_status_list', req),
        url: createUrl('/bihai/user/status/user_status_list', req),
        method: 'get'
    });
}

//用户详情信息

export function userDetail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/user/userDetail', req),
        url: createUrl('/bihai/user/userDetail', req),
        method: 'get'
    });
}

/**
 *设置用户登录状态
 * */

export function loginStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/user_status/update_login_status'),
        url: createUrl('/bihai/user/status/update_login_status'),
        method: 'put'
    });
}

/**
 *设置用户交易状态
 * */

export function tradeStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/user_status/update_trade_status'),
        url: createUrl('/bihai/user/status/update_trade_status'),
        method: 'put'
    });
}

/**
 *设置用户提现状态
 * */

export function withdrawStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/user_status/update_withdraw_status'),
        url: createUrl('/bihai/user/status/update_withdraw_status'),
        method: 'put'
    });
}


/**
 *出币未通过
 * */

export function cashNoPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coindraw/cash_pass/no'),
        url: createUrl('/bihai/account/coindraw/cash_pass/no'),
        method: 'post'
    });
}


/**
 *出币通过
 * */

export function cashPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coindraw/cash_pass/yes'),
        url: createUrl('/bihai/account/coindraw/cash_pass/yes'),
        method: 'post'
    });
}

/**
 *初审未通过
 * */

export function exaNoPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coindraw/pass_first/no'),
        url: createUrl('/bihai/account/coindraw/pass_first/no'),
        method: 'post'
    });
}

/**
 *初审通过
 * */

export function exaPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coindraw/pass_first/yes'),
        url: createUrl('/bihai/account/coindraw/pass_first/yes'),
        method: 'post'
    });
}

/**
 *复审未通过
 * */

export function verNoPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coindraw/pass_second/no'),
        url: createUrl('/bihai/account/coindraw/pass_second/no'),
        method: 'post'
    });
}

/**
 *复审通过
 * */

export function verPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coindraw/pass_second/yes'),
        url: createUrl('/bihai/account/coindraw/pass_second/yes'),
        method: 'post'
    });
}

/**
 *登录日志
 * */
export function loginLogList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/user/login_log_list', req),
        url: createUrl('/bihai/login/login_log_list', req),
        method: 'get'
    });
}

//币币资金明细  币币账户资金明细
export function tradeDetailList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/trade/detail/list', req),
        url: createUrl('/bihai/account/detail/list', req),
        method: 'get'
    });
}

//币种信息  分页查询币种信息
export function coinOtcList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coin/otc/list', req),
        url: createUrl('/bihai/account/coin/otc/list', req),
        method: 'get'
    });
}

//用户资产  (列表)
export function tradeDetailAll(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        // url: createUrl('/v1/trade/detail/all', req),
        url: createUrl('/bihai/account/position/all', req),
        method: 'get'
    });
}


//法币账户资金明细
export function detailOtcList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/trade/detail/otc/list', req),
        url: createUrl('/bihai/account/detail/otc/list', req),
        method: 'get'
    });
}

//权限列表  获取资源列表
export function getPermissionsList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('v1/resources/get', req),
        url: createUrl('/bihai/security/resources/get', req),
        method: 'get'
    });
}

//查询权限列表  根据资源描述查询
export function getByDescribe(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl(' /v1/resources/get_by_describe'),
        url: createUrl(' /bihai/security/resources/get_by_describe'),
        method: 'post'
    });
}

//更新 资源信息接口  更新信息
export function updateResources(id, req) {
    //let newPath = ' /v1/resources/update/' + id
    let newPath = '/bihai/security/resources/update/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        url: createUrl(newPath),
        method: 'put'
    });
}

//新增 创建资源
export function creatResources(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl(' /v1/resources/create'),
        url: createUrl(' /bihai/security/resources/create'),
        method: 'post'
    });
}

//权限删除  /v1/resources/delete/{id}  删除资源信息
export function delResources(id) {
    //let newPath = ' /v1/resources/delete/' + id
    let newPath = ' /bihai/security/resources/delete/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'delete'
    });
}

//角色删除  /v1/role/delete/{id}  删除角色信息
export function deleteRole(id) {
    //let newPath = '/v1/role/delete/' + id
    let newPath = '/bihai/security/role/delete/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'delete'
    });
}

//创建角色
export function roleCreate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/role/create'),
        url: createUrl('/bihai/security/role/create'),
        data: req,
        method: 'post'
    });
}

//角色修改   /v1/role/update/{id}
export function roleUpdate(id, req) {
    //let newPath = '/v1/role/update/' + id
    let newPath = '/bihai/security/role/update/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put',
        data: req
    });
}

//角色查询  /v1/role/get_role_resources  根据角色名称查询
export function getByName(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/role/get_by_name', req),
        url: createUrl('/bihai/security/role/get_by_name', req),
        method: 'get'
    });
}

//角色列表  /v1/role/get   需要对接
export function roleList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl('/bihai/security/role/get', req),
        method: 'get'
    });
}

// 分页 杠杆账户资金明细
export function hlList(req) {

    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/bihai/trade/detail/hl/list', req),
        url: createUrl('/bihai/account/detail/hl/list', req),
        method: 'get'
    });
}

/**
 * 加减币相关
 *
 */
//列表 && 查询  分页查询加减币单据

export function mHList(req) {

    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coin/mh/list', req),
        url: createUrl('/bihai/account/coin/mh/list', req),
        method: 'get'
    });
}

//新增币
export function mhSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coin/mh/save'),
        url: createUrl('/bihai/account/coin/mh/save'),
        method: 'post'
    });
}

//初审 不通过
export function auditeNoPass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coin/mh/audite/nopass'),
        url: createUrl('/bihai/account/coin/mh/audite/nopass'),
        method: 'post'
    });
}

//初审 通过
export function auditePass(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coin/mh/audite/pass'),
        url: createUrl('/bihai/account/coin/mh/audite/pass'),
        method: 'post'
    });
}

//发放 通过
export function cashPassCoin(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coin/mh/cash/pass'),
        url: createUrl('/bihai/account/coin/mh/cash/pass'),
        method: 'post'
    });
}

//发放 不通过
export function cashNoPassCoin(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coin/mh/cash/nopass'),
        url: createUrl('/bihai/account/coin/mh/cash/no_pass'),
        method: 'post'
    });
}

//删除加减币
export function mhDelete(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coin/mh/delete'),
        url: createUrl('/bihai/account/coin/mh/delete'),
        method: 'post'
    });
}

//高级认证列表
export function seniorUserist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/senior/senior_user_List', req),
        url: createUrl('/bihai/user/senior/senior_user_List', req),
        method: 'get'
    });
}

//高级认证审核
export function updateSeniorStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/senior/update_senior_status'),
        url: createUrl('/bihai/user/senior/update_senior_status'),
        method: 'put'
    });
}

//法币广告列表  广告后台管理接口 分页
export function advertisingPages(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/advertising/pages', req),
        url: createUrl('/bihai/c2c/advertising/pages', req),
        method: 'get'
    });
}


//上传图片  需要对接
export function upLoad(req, onUploadProgress) {
    return axios({
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        onUploadProgress: onUploadProgress,
        data: req,
        url: `http://${ENV.getENV().uploadAPI}/v1/upload`, // 地址栏之后换成配置
        method: 'post'
    });
}


//币种基本信息  更新 启动 禁用 更新
export function coininfoUpload(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coininfo/update'),
        url: createUrl('/bihai/account/coininfo/update'),
        method: 'post'
    });
}

// 后台管理订单接口  法币交易订单分页
export function tradeOrderPage(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/trade_order/pages', req),
        url: createUrl('/bihai/c2c/trade/order/pages', req),
        method: 'get'
    });
}

//后台管理订单申诉接口 分页
export function orderAppealPages(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/order_appeal/pages', req),
        url: createUrl('/bihai/c2c/order/appeal/pages', req),
        method: 'get'
    });
}

//下架 /v1/advertising/down/{id} 下架广告
export function advertisingDown(id) {
    //let newPath = '/v1/advertising/down/' + id
    let newPath = '/bihai/c2c/advertising/down/{id}'
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put'
    });
}

//上架 /v1/advertising/down/{id}  上架广告
export function advertisingUp(id) {
    //let newPath = '/v1/advertising/up/' + id
    let newPath = '/bihai/c2c/advertising/up/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'put'
    });
}


//上架 /v1/advertising/down/{id}  后台申诉处理
export function orderAppealOperation(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/order_appeal/operation'),
        url: createUrl('/bihai/c2c/order/appeal/operation'),
        method: 'put'
    });
}

//上架 /v1/advertising/down/{id}  帮助中心目录树
export function coArticleCategoryetAll() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('v1/coArticleCategory/getAll'),
        url: createUrl('/bihai/misc/co/article/category/get_all'),
        method: 'get'
    });
}

//添加中心目录
//v1/coArticleCategory/add
export function coArticleCategoryetAdd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coArticleCategory/add'),
        url: createUrl('/bihai/misc/co/article/category/add'),
        method: 'post'
    });
}

//删除中心目录  根据id删除帮助中心目录
///v1/coArticleCategory/remove/{id}
export function coArticleCategoryetRemove(id) {
    //let newPath = '/v1/coArticleCategory/remove/' + id
    let newPath = 'bihai/misc/co/article/category/remove/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}

//新建文章  增加帮助中心文章
export function coArticleAdd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coArticle/add'),
        url: createUrl('/bihai/misc/co/article/add'),
        method: 'post'
    });
}

//更新文章 增加帮助中心文章
export function coArticleUpdata(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coArticle/update'),
        url: createUrl('/bihai/misc/co/article/add'),
        method: 'post'
    });
}

//删除文章 /v1/coArticle/remove/{id}  根据id删除帮助中心文章
export function coArticleRemove(id) {
    //let newPath = '/v1/coArticle/remove/' + id
    let newPath = '/bihai/misc/co/article/remove/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'get'
    });
}

//提现手续费列表
export function withDrawRate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/withDrawRate/list', req),
        url: createUrl('/bihai/misc/withdraw/rate/list', req),
        method: 'get'
    });
}

//创建提现手续费
export function withDrawRateSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/withDrawRate/save'),
        url: createUrl('/bihai/misc/withdraw/rate/save'),
        method: 'post'
    });
}

//修改提现手续费
export function withDrawRateUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/withDrawRate/update'),
        url: createUrl('/bihai/misc/withdraw/rate/update'),
        method: 'post'
    });
}

///v1/user/update_cash_fee_status 0白名单 1 ：收取手续费 //
// 设置用户提现手续费状态

export function cashFeeStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/user_status/update_cash_fee_status'),
        url: createUrl('/bihai/user/update_cash_fee_status'),
        method: 'put'
    });
}

// 设置用户交易手续费状态

export function tradeFeeStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/user_status/update_trade_fee_status'),
        url: createUrl('/bihai/user/update_trade_fee_status'),
        method: 'put'
    });
}

// 设置全部状态 5+ id  设置用户所有状态

export function updatUeserStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/user/update_user_status'),
        url: createUrl('/bihai/user/update_user_status'),
        method: 'put'
    });
}


//app版本列表  分页查询版本列表

export function appVerisonList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/app/version/list', req),
        url: createUrl('/bihai/misc/app/version/list', req),
        method: 'get'
    });
}


//新增 创建应用版本
export function saveAppVerison(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/app/version/save'),
        url: createUrl('/bihai/misc/app/version/save'),
        data: req,
        method: 'post'
    });
}

//修改状态 修改应用状态(1停用 0启用),可批量
export function versionStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/app/version/status'),
        url: createUrl('/bihai/misc/app/version/status'),
        data: req,
        method: 'post'
    });
}

//获取图形验证码
export function getImageCode(req) {
    return axios({
        //47.97.118.31 18779
        // url: 'http://47.97.118.31:18779/auth/imageCode?width=80&height=30',
        url: createUrl('/bihai/privilege/auth/image_code', req),
        method: 'get'
    });
}

//登录鉴权接口
export function userLogin(req) {
    //console.log(window.localStorage.getItem('user'))
    return axios({
        //url: createUrl('/auth/authorize'),
        url: createUrl('/bihai/privilege/auth/authorize'),
        data: req,
        method: 'put'
    });
}


//检查应用是否需要更新
export function checkVersion(req) {
    //console.log(appStore.get(['token']))
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },

        //url: createUrl('v1/app/version/check', req),
        url: createUrl('/bihai/misc/app/version/check', req),
        method: 'get'
    });
}

///v1/banner/pages
//轮播图分页
export function bannerPages(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/banner/pages', req),
        url: createUrl('/bihai/misc/banner/pages', req),
        method: 'get'
    });
}

// 币币账户充值明细
export function rechargeDetail(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/trade/detail/recharge', req),
        url: createUrl('/bihai/account/detail/recharge', req),
        method: 'get'
    });
}

// 添加轮播图
export function bannerSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/banner/'),
        url: createUrl('/bihai/misc/banner/'),
        data: req,
        method: 'post'
    });
}

// 修改轮播图
export function bannerUpdata(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/banner/'),
        url: createUrl('/bihai/misc/banner/'),
        data: req,
        method: 'put'
    });
}


// 删除轮播图
export function bannerDelete(id) {
    //let newPath = '/v1/banner/' + id
    let newPath = '/bihai/misc/banner/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        //DELETE
        method: 'delete'
    });
}

// 法币交易币种 新增币种
export function coinOtcSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coin/otc/save'),
        url: createUrl('/bihai/account/coin/otc/save'),
        data: req,
        method: 'post'

    });
}

/**
 *v1/coin/otc/update  修改币种
 */
export function otcUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coin/otc/update'),
        url: createUrl('/bihai/account/coin/otc/update'),
        method: 'post'
    });
}


// 委托单列表
export function tradeOrderList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/tradeOrder/list', req),
        url: createUrl('/bihai/entrust/list', req),
        method: 'get'
    });
}


/**
 *v1/tradeEntrustHis/list
 历史委托单列表
 */
export function tradeEntrustHisList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/tradeEntrustHis/list', req),
        url: createUrl('/bihai/entrust/history/list', req),
        method: 'get'
    });
}


/**
 *v1/coin/otc/update
 获取全部用户等级费率
 */
export function levelRateList() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/rate/level_rate_list'),
        url: createUrl('/bihai/user/rate/level_rate_list'),
        method: 'get'
    });
}

/**
 *交易对推荐 非推荐  修改币对推荐位状态
 */
export function updateRecommend(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/tradeInfo/updateRecommend'),
        url: createUrl('/bihai/symbol/update_recommend'),
        method: 'post'
    });
}

/**
 *修改手续费  设置用户等级费率
 */
export function updateLevelRate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/rate/update_level_rate'),
        url: createUrl('/bihai/user/rate/update_level_rate'),
        method: 'put'
    });
}

// 用户账户 资金平衡表 分页查询资产平衡
export function balanceList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/balance/coin/list', req),
        url: createUrl('/bihai/account/balance/coin/list', req),
        method: 'get'
    });
}

// 查询对应币种资产平衡
export function totalBalanceList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/balance/total/list', req),
        url: createUrl('/bihai/account/balance/total/list', req),
        method: 'get'
    });
}

// 币种账户 资金平衡表 分页查询更改记录
export function balanceRecordlist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/balance/total/recordlist', req),
        url: createUrl('/bihai/account/balance/total/record_list', req),
        method: 'get'
    });
}

// 资金平衡表个人记录
export function coinBalanceRecordlist(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/balance/coin/recordlist', req),
        url: createUrl('/bihai/account/balance/coin/record_list', req),
        method: 'get'
    });
}

// 币种 更改资金平衡
export function balanceCorrect(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/balance/total/correct'),
        url: createUrl('/bihai/account/balance/total/correct'),
        data: req,
        method: 'post'
    });
}

// 用户 更改个人资金平衡表更改资金平衡
export function coinBalanceCorrect(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/balance/coin/correct'),
        url: createUrl('/bihai/account/balance/coin/correct'),
        data: req,
        method: 'post'
    });
}

// 更改app版本 更新版本信息
export function versionUpdata(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/app/version/update'),
        url: createUrl('/bihai/misc/app/version/update'),
        data: req,
        method: 'post'
    });
}


//获取所有权限
export function roleResourcesAll() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/role/resources'),
        url: createUrl('/bihai/security/role/resources'),
        method: 'get'
    });
}

// 全部的权限 用户编辑用户权限 获取资源列表  需要对接 
export function resourcesAll() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/resources/all'),
        url: createUrl('/bihai/security/resources/get'),
        method: 'get'
    });
}

// 删除角色信息  需要对接
export function roleDelete() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/role/delete/'),
        url: createUrl('/bihai/security/role/delete'),
        method: 'get'
    });
}

// 全部的权限 用户编辑用户权限  根据角色Id获取权限
export function resourcesById(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/role/resources_by_id', req),
        url: createUrl('/bihai/security/role/resources_by_id', req),
        method: 'get'
    });
}

// 全部的权限 用户编辑用户权限  增加或者修改权限
export function addResources(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/role/add_resources'),
        url: createUrl('/bihai/security/role/add_resources'),
        method: 'post'
    });
}

// 获取管理员列表
export function getAdministrators(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/administrators/get', req),
        url: createUrl('/bihai/security/administrators/get', req),
        method: 'get'
    });
}

// 增加管理员
export function administratorsAdd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/administrators/add'),
        url: createUrl('/bihai/security/administrators/add'),
        method: 'post'
    });
}

// 更新管理员  修改密码
export function updatePwd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/administrators/update_pwd'),
        url: createUrl('/bihai/security/administrators/update_pwd'),
        method: 'put'
    });
}

// 管理员  修改角色
export function updateRole(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/administrators/update_role'),
        url: createUrl('/bihai/security/administrators/update_role'),
        method: 'put'
    });
}

// 删除管理员 /v1/administrators/delete/{id}

export function administratorsDelete(id) {
    //let newPath = '/v1/administrators/delete/' + id
    let newPath = '/bihai/security/administrators/delete/' + id
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        url: createUrl(newPath),
        method: 'delete'
    });
}

// 获取所有角色
export function roleAll(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/role/role_all', req),
        url: createUrl('/bihai/security/role/role_all', req),
        method: 'get'
    });
}

// 杠杆订单
export function leverageTradeHisList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/leverageTradeHis/list', req),
        url: createUrl('/bihai/leverage/history/list', req),
        method: 'get'
    });
}

// 杠杆历史订单
export function leverageTradeList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/leverageTrade/list', req),
        url: createUrl('/bihai/leverage/history/list', req),
        method: 'get'
    });
}

// 杠杆持仓列表
export function leverageHoldList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        timeout: 3000,
        //url: createUrl('/v1/leverageTrade/holdList', req),
        url: createUrl('/bihai/leverage/hold_list', req),
        method: 'get'
    });
}


// 平仓
export function leverageEveningUp(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data:req,
        //url: createUrl('/v1/leverageTrade/eveningUp'),
        url: createUrl('/bihai/leverage/evening_up'),
        method: 'post'
    });
}

//待初审列表  币币账户提待初审列表
export function passFirst(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coindraw/pass_first/list', req),
        url: createUrl('/bihai/account/coindraw/pass_first/list', req),
        method: 'get'
    });
}


//待复审列表  币币账户提待复审列表
export function passSecond(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coindraw/pass_second/list', req),
        url: createUrl('/bihai/account/coindraw/pass_second/list', req),
        method: 'get'
    });
}


//待出币列表  币币账户提待出币列表
export function cashPassList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coindraw/cash_pass/list', req),
        url: createUrl('/bihai/account/coindraw/cash_pass/list', req),
        method: 'get'
    });
}

//待出币列表  查询币种资金平衡正常异常信息
export function getCoinStatus(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/balance/total/getCoinStatus', req),
        url: createUrl('/bihai/account/balance/total/get_coin_status', req),
        method: 'get'
    });
}

//获取邀请注册列表
export function inviteList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/invite/list', req),
        url: createUrl('/bihai/misc/invite/list', req),
        method: 'get'
    });
}

//添加邀请注册信息
export function inviteAdd(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/invite/add', req),
        url: createUrl('/bihai/misc/invite/add', req),
        method: 'post'
    });
}

//修改邀请注册信息
export function inviteUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/invite/update', req),
        url: createUrl('/bihai/misc/invite/update', req),
        method: 'post'
    });
}

//新增公告
export function announcementSave(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/announcement/save'),
        url: createUrl('/bihai/misc/announcement/save'),
        method: 'post'
    });
}

//删除公告
export function announcementRemove(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/announcement/remove', req),
        url: createUrl('/bihai/misc/announcement/remove', req),
        method: 'get'
    });

}

//列表 获取公告列表
export function announcementList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/announcement/list', req),
        url: createUrl('/bihai/misc/announcement/list', req),
        method: 'get'
    });
}

//修改公告
export function announcementUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/announcement/update'),
        url: createUrl('/bihai/misc/announcement/update'),
        method: 'post'
    });
}

//adminapi-eoe2.ichainsoft.com/v1/tradeEntrustHis/aboveOrderList?pageNo=1&pageSize=10


//上游订单列表
export function aboveOrderList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('v1/tradeEntrustHis/aboveOrderList', req),
        url: createUrl('bihai/entrust/history/aboveOrderList', req),
        method: 'get'
    });
}

//添加量化接口
export function addQuanUser(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/quantizationAuth/addQuanUser'),
        url: createUrl('/bihai/quantization/auth/add_quan_user'),
        method: 'post'
    });
}

//添加量化列表
export function quanUserList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/quantizationAuth/list', req),
        url: createUrl('/bihai/quantization/auth/list', req),
        method: 'get'
    });
}

//添加量化列表
export function quanUpdate(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/quantizationAuth/update'),
        url: createUrl('/bihai/quantization/auth/update'),
        method: 'post'
    });
}

//设置最新版本
export function newestVersion(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/app/version/newestVersion'),
        url: createUrl('/bihai/misc/app/version/newestVersion'),
        method: 'post'
    });
}


//日志列表
export function logList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/log/list', req),
        url: createUrl('/bihai/log/list', req),
        method: 'get'
    });
}

//挖矿列表  需要对接
export function digList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //  data: req,
        url: createUrl('/v1/excel/listExcel', req),
        method: 'get'
    });
}

//导出 EXCEL导出
export function exportExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //  'responseType':'blob',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        data: req,
        //url: createUrl('/v1/excel/exportExcel'),
        url: createUrl('/bihai/statistics/export_excel'),
        method: 'post'
    });
}

//导出 EXCEL导出
export function exportTestExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //  'responseType':'blob',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        data: req,
        //url: createUrl('/v1/excel/testExcel'),
        url: createUrl('/bihai/statistics/test_excel'),
        method: 'post'
    });
}

//导入  EXCEL导入
export function importExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/excel/importExcel'),
        url: createUrl('/bihai/statistics/import_excel'),
        method: 'post'
    });
}

//提现异常  币币账户异常列表
export function errorList(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/coindraw/error/list', req),
        url: createUrl('/bihai/account/coindraw/error/list', req),
        method: 'get'
    });
}

//未出币 修改异常数据-已驳回
export function cashPassNo(req) {
    return axios({
        headers: {
            //  'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coindraw/error/no'),
        url: createUrl('/bihai/account/coindraw/error/no'),
        method: 'post'
    });
}

//drawId
//出币通过 修改异常数据-出币成功
export function cashPassYes(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        //url: createUrl('/v1/coindraw/error/yes'),
        url: createUrl('/bihai/account/coindraw/error/yes'),
        method: 'post'
    });
}

// 查询首页展示数据
export function findDisplay() {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/index/findDisplay'),
        url: createUrl('/bihai/index/find'),
        method: 'get'
    });
}

// 添加首页展示数据 
export function saveDisplay(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/index/saveDisplay', req),
        url: createUrl('/bihai/index/save', req),
        method: 'get'
    });
}

// 修改首页展示数据
export function updateDisplay(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        //url: createUrl('/v1/index/updateDisplay',req),
        url: createUrl('/bihai/index/update',req),
        method: 'get'
    });
}

// 查询展示  用户信息列表导出
export function userListExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        // data:req,g
        //url: createUrl('/v1/user/userListExcel', req),
        url: createUrl('/bihai/user/user_list_excel', req),
        method: 'get'
    });
}

//用户资产  可能需要修改
export function tradeDetailAllExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        // url: createUrl('/v1/trade/detail/all', req),
        url: createUrl('/bihai/account/position/all_excel', req),
        method: 'get'
    });
}

//高级认证列表导出
export function seniorUseristExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        //url: createUrl('/v1/senior/senior_user_List_Excel', req),
        url: createUrl('/bihai/user/senior/senior_user_List_Excel', req),
        method: 'get'
    });
}


// 分页查询杠杆资金流水  杠杆账户资金明细导出
export function hlListExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        //url: createUrl('/v1/trade/detail/hl/listExcel', req),
        url: createUrl('/bihai/account/detail/hl/list_excel', req),
        method: 'get'
    });
}

//币币账户提现明细导出
export function coindrawListExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        //url: createUrl('/v1/coindraw/listExcel', req),
        url: createUrl('/bihai/account/coindraw/list_excel', req),
        method: 'get'
    });
}

// 充值明细列表  币币账户充值明细
export function rechargeDetailExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        //url: createUrl('/v1/trade/detail/rechargeExcel', req),
        url: createUrl('/bihai/account/detail/recharge', req),
        method: 'get'
    });
}

//币币资金明细  币币账户充值明细导出
export function tradeDetailListExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        //url: createUrl('/v1/trade/detail/listExcel', req),
        url: createUrl('/bihai/account/detail/recharge_excel', req),
        method: 'get'
    });
}

//法币账户资金明细导出
export function detailOtcListExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        //url: createUrl('/v1/trade/detail/otc/listExcel', req),
        url: createUrl('/bihai/account/detail/otc/list_excel', req),
        method: 'get'
    });
}

// 委托单列表   委托单列表导出
export function tradeOrderListExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        //url: createUrl('/v1/tradeOrder/listExcel', req),
        url: createUrl('/bihai/entrust/list_excel', req),
    });
}

//法币交易订单导出
export function tradeOrderPageExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        //url: createUrl('/v1/trade_order/pagesExcel', req),
        url: createUrl('/bihai/c2c/trade/order/pages_excel', req),
        method: 'get'
    });
}

//广告后台管理接口  需要对接
export function advertisingPagesExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        data: req,
        responseType: 'blob',
        url: createUrl('/v1/advertising/pagesExcel', req),
        method: 'get'
    });
}

// 杠杆订单  杠杆持仓列表导出
export function leverageHoldListExcel(req) {
    return axios({
        headers: {
            'Content-Type': 'application/json',
            'Authorization-admin': `Bearer ` + JSON.parse(window.localStorage.getItem('user')).token
        },
        responseType: 'blob',
        timeout: 6000,
        //url: createUrl('/v1/leverageTrade/holdListExcel', req),
        url: createUrl('/bihai/leverage/hold_list_excel', req),
        method: 'get'
    });
}
