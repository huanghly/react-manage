import userFetch from './userFetch';
import appStore from '../appStore';
import axios from "axios/index";

function postUrlencoded() {
  return userFetch.postUrlencoded.apply(userFetch, arguments).then(res => {
    if(res.code === 0){
      return res;
    }else{
      return Promise.reject(res);
    }
  });
}

const userFetchActions = {
  /**
   * 获取用户资产
   * */
  getUserAssets: () => {
    return postUrlencoded(userFetch.createUrl('/v01/user/account/detail')).then(res => {
      let userAssets = {};
      userAssets.total = res.data.total;
      userAssets.list = res.data.list;
      appStore.set('userAssets', userAssets);
      return userAssets;
    });
  },
  /**
   * 生成红包
   * */
  generateRedPacket: (packetInfo) => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/generate'), packetInfo).then(res => {
      return res;
    });
  },
  /**
   * 获取红包基本信息
   * */
  getPacketInfoWithoutToken: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/info'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 获取红包详情
   * */
  getPacketDetail: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/receive/detail'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 获取红包领取详情
   * */
  getPacketReceiveDetail: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/receive/detail'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 获取红包详情无token
   * */
  getPacketReceiveDetailWithoutToken: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/receive/detail/no'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 打开红包
   * number
   * numberSig
   * */
  openPacket: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/open'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 在登录状态打开红包
   * number
   * numberSig
   * header: { Token }
   * */
  openPacketWithToken: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/openByToken'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 接受红包
   * */
  receivePacket: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/receive/get'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 访客发送红包的详情
   * */
  visitorSendDetail: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/person/send/detail'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 访客接收红包的详情
   * */
  visitorReceiveDetail: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/person/receive/detail'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 发送短信验证码
   * */
  snedSMSVerificaitonCode: params => {
    return postUrlencoded(userFetch.createUrl('/v01/verification-code/get'), params).then(res => {
      return res;
    });
  },
  /**
   * 检查手机验证码短信
   * */
  checkIsValidCode: params => {
    return postUrlencoded(userFetch.createUrl('/v01/verification-code/isValidCode'), params).then(res => {
      return res;
    });
  },
  fastLogin: params => {
    return postUrlencoded(userFetch.createUrl('/v01/user/fastLogin'), params).then(res => {
      return res.data;
    });
  },
  /**
   * 获取红包限额验证
   * **/
  fundLimit: params => {
    return postUrlencoded(userFetch.createUrl('/v01/luckyMoney/verify'), params).then(res => {
      return res.data;
    });
  }
};

export default userFetchActions;
