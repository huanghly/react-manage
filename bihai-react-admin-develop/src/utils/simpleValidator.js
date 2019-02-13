function SimpleValidator () {
	this.strategy = {}; // 规则存放地区
	this.rules = []; // 存放验证的规则
	this.errMsg = []; // 错误信息
}

SimpleValidator.prototype = {
	addRule (strategy) {
		Object.assign(this.strategy, strategy);
		console.log(this.strategy)
	},
	add (domNode, ruleArr) {
		let self = this;
		for (let i = 0, rule; rule = ruleArr[i++];) {
			(function(rule){
				let strategyArr = rule.strategy.split(':'),
					warnMsg = rule.warnMsg;
				self.rules.push(function () {
					let tempArr = strategyArr.concat();
					let ruleName = tempArr.shift();
					tempArr.unshift(domNode)
					tempArr.push(warnMsg)
					return self.strategy[ruleName].apply(null, [domNode, warnMsg]);
				});
			})(rule)
		}
		return this;
	},
	start () {
		for (let i = 0, vldFn; vldFn = this.rules[i++];) {
			var warnMsg = vldFn();
			if (warnMsg) {
				this.errMsg.push(warnMsg)
				break;
			}
		}
		if (this.errMsg.length !== 0) {
			let msg = this.errMsg[0];
			return msg;
		}
	},
	clear () {
		this.rules = []; // 存放验证的规则
		this.errMsg = []; // 错误信息
	}
}

module.exports = SimpleValidator;