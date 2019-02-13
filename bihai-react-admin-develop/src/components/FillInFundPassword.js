import React, {Component} from 'react';
import { storeAware } from 'react-hymn';
import appStore from '../appStore';
import { Modal } from 'antd-mobile';
import history from '../history';

export default class FillInFundPassword extends Component {
  constructor(props) {
  	super(props)
  	this.state = {
  	  modal: false,
  	  fundPassword: [] // 资金密码
  	}
  }

  componentDidMount () {
  }

  checkoutEquipment () {
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
      return "phone";
    } else {
      return "pc";
    }
  }

  keyDown = (e) => {
    let keyCode = e.keyCode;
    if (keyCode == 229) return false; // prevent style confusion and 229 bug
    if (keyCode == 8) {
      this.state.fundPassword.length !== 0 && this.state.fundPassword.pop();
      this.setState({fundPassword: this.state.fundPassword}, () => {
        appStore.set('fundPassword', this.state.fundPassword)
      })
    };
  }

  _inputFundPassword = (e) => {
    var p = navigator.platform; // 获取平台信息
    let _value = e.target.value;
    _value && this.state.fundPassword.length < 6 && this.state.fundPassword.push(_value) && this.setState({fundPassword: this.state.fundPassword}, () => {
      appStore.set('fundPassword', this.state.fundPassword);
      e.target.value = "";
      if (this.state.fundPassword.length === 6) {
        let _fundPassword = appStore.get('fundPassword');
        _fundPassword = Array.isArray(_fundPassword) && _fundPassword.join('');
        this.props.returnPassword && this.props.returnPassword(_fundPassword);
        setTimeout(() => {
          this.setState({fundPassword: []}); // clean the fund password after input finish
          this.closeModal('modal')()
        }, 200)
      }
    });
  }

  componentDidUpdate () {
    if (this.state.modal) {
      let type = this.checkoutEquipment(); // on what device
      if (type === 'phone') {
        document.addEventListener('input', this._inputFundPassword);
        document.onkeydown = this.keyDown;
      } else {
        document.addEventListener('keypress', this._keypress);
        document.addEventListener('keydown', this._keydown);
      }
    } else {
      document.removeEventListener('keypress', this._keypress);
      document.removeEventListener('keydown', this._keydown);
    }
  }

  componentWillUnmount () {
  	let type = this.checkoutEquipment();
    if (type) {
      document.removeEventListener('input', this._inputFundPassword);
      document.onkeydown = null;
    } else {
      document.removeEventListener('keypress', this._keypress);
      document.removeEventListener('keydown', this._keydown);
    }
  }

  _returnNumber (keyCode) { // return keyboard input value
  	if ((keyCode >= 48 && keyCode <= 57)) {
  	  let realkey = String.fromCharCode(keyCode);
  	  return realkey;
  	}
  }

  _keypress = (e) => {
    let keyCode = e.which;
    let realkey = this._returnNumber(keyCode);
    realkey && this.state.fundPassword.length < 6 && this.state.fundPassword.push(realkey) && this.setState({fundPassword: this.state.fundPassword}, () => {
      appStore.set('fundPassword', this.state.fundPassword)
      if (this.state.fundPassword.length === 6) {
      	let _fundPassword = appStore.get('fundPassword');
      	_fundPassword = Array.isArray(_fundPassword) && _fundPassword.join('');
      	this.props.returnPassword && this.props.returnPassword(_fundPassword);
        setTimeout(() => {
          this.setState({fundPassword: []}); // clean the fund password after input finish
          this.closeModal('modal')()
        }, 200)
      }
    });
  }

  _keydown = (e) => {
    if (e.which == 9) return false; // prevent style confusion
    if (e.key === 'Backspace' || e.which == 8) {
      this.state.fundPassword.length !== 0 && this.state.fundPassword.pop();
      this.setState({fundPassword: this.state.fundPassword}, () => {
        appStore.set('fundPassword', this.state.fundPassword)
      })
    };
  }

  showModal = key => (e) => {
    e && e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  };

  closeModal = key => () => {
  	this.setState({
  	  [key]: false,
  	});
  };

  _renderSetFundPassword () {
  	let _fundPassword = this.state.fundPassword;
  	return (
  	  <div style={{backgroundColor: '#fff', paddingTop: 16, paddingBottom: 16}}>
  	  	<div style={{display: 'flex', justifyContent: 'space-between', paddingRight: 10, paddingLeft: 10}}>
  	      <span onClick={() => this.closeModal('modal')()} style={{fontSize: '0.24rem', color: '#666'}}>取消</span>
  	      <h3 style={{fontSize: '0.3rem', color: '#333'}}>输入资金密码</h3>
  	      <span style={{color: '#2eae83', fontSize: '0.24rem', visibility: 'hidden'}}>确定</span>
  	    </div>
  	  	<div style={{position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: 18}}>
          <input
						onFocus={()=>{
							setTimeout(()=>{
								document.documentElement.scrollTop=document.documentElement.scrollHeight;
								document.body.scrollTop=document.body.scrollHeight;
								{/*let userAgent =  window.navigator.userAgent;*/}
								{/*let isSafari = userAgent.indexOf("Safari") != -1 && userAgent.indexOf("Version") != -1;*/}
								{/*if(!isSafari){*/}
									{/*document.body.scrollTop=document.body.scrollHeight;*/}
									{/*document.documentElement.scrollTop=document.documentElement.scrollHeight;*/}
								{/*}*/}
							},300)
						}}
          type="number"
          style={{position: 'absolute', opacity: '0.0009', zIndex: '1', left: 0, top: 0, width: '400%', height: '100%', textIndent: '-999em', marginLeft: '-300%'}}
          />
  	      <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
  	      <div style={{display: _fundPassword[0] ? 'none' : 'block', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', textAlign: 'center'}}></div>
  	      <div style={{display: _fundPassword[0] ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', color: '#333'}}>
  	        ●
  	      </div>
  	      </div>
  	      <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
  	      <div style={{display: _fundPassword[1] ? 'none' : 'block', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', textAlign: 'center'}}></div>
  	      <div style={{display: _fundPassword[1] ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', color: '#333'}}>
  	        ●
  	      </div>
  	      </div>
  	      <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
  	      <div style={{display: _fundPassword[2] ? 'none' : 'block', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', textAlign: 'center'}}></div>
  	      <div style={{display: _fundPassword[2] ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', color: '#333'}}>
  	        ●
  	      </div>
  	      </div>
  	      <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
  	      <div style={{display: _fundPassword[3] ? 'none' : 'block', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', textAlign: 'center'}}></div>
  	      <div style={{display: _fundPassword[3] ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', color: '#333'}}>
  	        ●
  	      </div>
  	      </div>
  	      <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
  	      <div style={{display: _fundPassword[4] ? 'none' : 'block', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', textAlign: 'center'}}></div>
  	      <div style={{display: _fundPassword[4] ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', color: '#333'}}>
  	        ●
  	      </div>
  	      </div>
  	      <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
  	      <div style={{display: _fundPassword[5] ? 'none' : 'block', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', textAlign: 'center'}}></div>
  	      <div style={{display: _fundPassword[5] ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', width: '1.14rem', height: '0.87rem', borderLeft: '1px solid #ccc', borderRight: '1px solid #ccc', color: '#333'}}>
  	        ●
  	      </div>
  	      </div>
  	    </div>
  	    <p
					onClick={()=>{
						history.push('/funPasswordManage')
					}}
					style={{textAlign: 'right', marginTop: '0.24rem', paddingRight: 10, fontSize: '0.3rem', color: '#666'}}>忘记资金密码？</p>
  	  </div>
  	)
  }

  render() {
  	return (
  	  <div className="fundPassword-wrapper">
  	    <Modal
  	      popup
          visible={this.state.modal}
          maskClosable={true}
          animationType="slide-up"
  	    >
  	     {this._renderSetFundPassword()}
  	    </Modal>
  	  </div>
  	)
  }
}