import ruleUtils from './ruleUtils';

export default {
  phone: function(phone, success, failure) {
    if(phone === '19912340001' || phone === '19912340002'){
      success();
    }else if(ruleUtils.testPhone(phone)){
      success();
    }else {
      failure('电话号码格式不正确！');
    }
  },
  password: function (password, success, failure) {
    if(ruleUtils.testPassword(password)){
      success();
    }else{
      failure('密码必须为6-12位数字和字母的组合');
    }
  },
  idCard: function (idCard, success, failure) {
    if(ruleUtils.testIdCard(idCard)){
      success();
    }else{
      failure('身份证号码格式不正确！');
    }
  },
  bankCard: function (bankCard, success, failure) {
    if(ruleUtils.testBankCard(bankCard)){
      success();
    }else{
      failure('银行卡格式不正确！');
    }
  },
  realName: function (name, success, failure) {
    if(ruleUtils.testRealName(name)){
      success();
    }else{
      failure('姓名中不能包含数字！');
    }
  }
};
