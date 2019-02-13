import ruleUtils from './ruleUtils';

export default {
  inPour: function(money, success, failure) {
    if(ruleUtils.testInpour(money)){
      success();
    }else if(money === ''){
      failure('请输入充值金额！');
    }else{
      failure('请输入正确的充值金额！');
    }
  },
  withdraw: function (money, success, failure) {
    if(ruleUtils.testWithDraw(money)){
      success();
    }else{
      failure('请输入正确的提现金额！');
    }
  },
  // withdrawLimit: function (moneyAndLimit, success, failure) {
  //   if(moneyAndLimit[0] <= moneyAndLimit[1]){
  //     success();
  //   }else{
  //     failure("账户余额不足，请重新尝试！");
  //   }
  // }
};
