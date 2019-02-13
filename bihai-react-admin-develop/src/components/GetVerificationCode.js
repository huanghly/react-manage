import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './components-css/getVerificationCode.css';
import CommonModal from './CommonModal';

export default class GetVerificationCode extends Component {
  constructor(props) {
  	super(props)
  	this.timer = null; // 初始化定时器
  	this.isFirstTime = true; // 第一次获取控制文本显示
  	this.state = {
  	  count: 0, // 倒计时数初始
  	};
  }

  static defaultProps = {
    precheck: () => { return true },
  	verificaitonCodeFunc: () => {},
    callback: () => {},
    successMsg: '验证码已经发送',
  };

  _countDown () { // 倒计时
  	let count = 60;
  	this.timer = setInterval(() => {
  	  this.setState({count: --count})
  	}, 1000)
  	setTimeout(() => {
  	  this.timer && clearInterval(this.timer);
  	  this.timer = null;
  	}, count * 1000)
  }

  async _getVerificaitonCode () {
  	let {verificaitonCodeFunc, precheck, successMsg} = this.props;
    let _precheck = await precheck();
    if (!_precheck) return void 0; // 预检查是否通过，默认返回true通过
  	if (this.timer) return void 0;
    verificaitonCodeFunc().then(res => { // 如果有错误信息返回，未完成版本
      if (res.data.code === 0) {
        this._countDown(); // 成功调用接口执行倒计时函数
        this.isFirstTime = false;
        this.commonModal && this.commonModal.sendQuickTip(successMsg);
      } else {
        this.commonModal && this.commonModal.sendQuickTip(res.data.msg);
      }
    }).catch(err => {
      let _errMsg = err.data.error;
      this.commonModal && this.commonModal.sendQuickTip(_errMsg);
    });
  }

  render() {
  	let {wrapperStyle} = this.props;
  	let {count} = this.state;
    return (
      <div className="verification-code-wrapper" style={{borderColor: count ? '#ccc' : '#4671fe', ...wrapperStyle}}>
        <CommonModal ref={ref => this.commonModal = ref}></CommonModal>
        {
          count ?
          <div style={{cursor: 'pointer', color: '#ccc'}}>{`重新发送(${count}秒)`}</div> :
          <div onClick={() => this._getVerificaitonCode()} style={{cursor: 'pointer'}}>{this.isFirstTime ? '获取验证码' : '再次获取验证码'}</div>
        }
      </div>
    )
  }
}