export default {
  testPhone: function (phone, warnMsg) {
    if(!/^[1][3,4,5,7,8][0-9]{9}$/.test(phone)) {
      return warnMsg;
    };
  },
  testPassword: function (password, warnMsg) {
    password = password || '';
    if (!(password.length > 5 && password.length < 13 && /^[0-9a-z]/i.test(password) && /\d/.test(password) && /[a-z]/i.test(password))) {
      return warnMsg;
    }
  },
  testIdCard: function (idCard, warnMsg) {
    if (!/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(idCard)) {
      return warnMsg;
    }
  },
  testBankCard: function (bankCard, warnMsg) {
    if (!/^\d{15,19}$/.test(bankCard)) {
      return warnMsg;
    }
  },
  testRealName: function (name, warnMsg) {
    if (!/^[^0-9]{1,100}$/.test(name)) {
      return warnMsg;
    }
  },
  testNickName: function (name, warnMsg) {
    if (!/^[0-9a-zA-Z\u4e00-\u9fa5_]{3,8}$/.test(name)) {
      return warnMsg;
    }
  },
  testHMPassport: function (idCard, warnMsg) {
    if (!/^[HMhm]{1}([0-9]{10}|[0-9]{8})$/.test(idCard)) {
      return warnMsg;
    }
  },
  testTAIWAN1: function (idCard, warnMsg) {
    if (!/^[0-9]{8}$/.test(idCard)) {
      return warnMsg;
    }
  },
  testTAIWAN2: function (idCard, warnMsg) {
    if (!/^[0-9]{10}$/.test(idCard)) {
      return warnMsg;
    }
  },
  testInpour: function (money, warnMsg) {
    return /^[1-9][0-9]{0,3}$/.test(money);
  },
  testWithDraw: function (money, warnMsg) {
    return /^[1-9][0-9]{0,8}(\.[0-9]{1,2})?$/.test(money);
  },
};