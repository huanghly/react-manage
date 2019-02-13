import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import appStore from '../appStore';
import {Modal} from 'antd-mobile';
import CommonModal from './CommonModal';
import userFetchActions from '../networking/userFetchActions';

export default class FillInSMSVerification extends Component {
    constructor(props) {
        super(props);
        this.state = {
            count: 0,
            mobile: '', // 手机号
            modal: false,
            fundPassword: [] // 资金密码
        }
    }

    static defaultProps = {
        mobile: ''
    };

    componentDidMount() {
        let mobile = appStore.get('mobile');
        mobile && this.setState({mobile: mobile});
    }

    checkoutEquipment() {
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
        }
        ;
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

    componentDidUpdate() {
        if (this.state.modal) {
            let type = this.checkoutEquipment();
            if (type) {
                document.removeEventListener('input', this._inputFundPassword);
                document.onkeydown = null;
            } else {
                document.removeEventListener('keypress', this._keypress);
                document.removeEventListener('keydown', this._keydown);
            }
        } else {
            document.removeEventListener('keypress', this._keypress);
            document.removeEventListener('keydown', this._keydown);
        }
    }

    componentWillUnmount() {
        let type = this.checkoutEquipment();
        if (type) {
            document.removeEventListener('input', this._inputFundPassword);
            document.onkeydown = null;
        } else {
            document.removeEventListener('keypress', this._keypress);
            document.removeEventListener('keydown', this._keydown);
        }
    }

    _returnNumber(keyCode) { // return keyboard input value
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
        }
        ;
    }

    showModal = key => (e) => {
        e && e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    }

    closeModal = key => () => {
        this.setState({
            [key]: false,
        });
    }

    _getCount() {
        if (!this.countdownInterval) {
            let countDown = 60;
            this.countdownInterval = setInterval(() => {
                this.setState({
                    count: countDown--
                })
            }, 1000);
            setTimeout(() => {
                this.countdownInterval && clearInterval(this.countdownInterval)
                this.countdownInterval = null;
                this.setState({count: 0})
            }, (countDown + 1) * 1000)
        }
    }

    getVerificationCodew() {
        if (this.countdownInterval) return false;
        console.log(this.state.mobile)
        this._getCount(); // 开启倒计时器
        let req = {};
        req.mobile = this.state.mobile;
        req.type = 4; // 4-红包验证
        userFetchActions.snedSMSVerificaitonCode(req).then(res => {
            if (res.data.code === 0) {
                this.refs.commonModal && this.refs.commonModal.sendQuickTip('验证码已发送');
            } else {
                this.refs.commonModal && this.refs.commonModal.sendQuickTip(res.data.msg);
            }
        })
    }

    _renderSetFundPassword() {
        let _fundPassword = this.state.fundPassword;
        const button_base_css = {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: '0.6rem',
            color: '#fff',
            margin: "0.38rem 2rem 0",
            height: '0.88rem',
            lineHeight: '0.88rem',
            backgroundColor: '#2eae83',
            fontSize: '0.32rem',
        }
        return (
            <div style={{backgroundColor: '#fff', paddingTop: 16, paddingBottom: 16}}>
                <div style={{display: 'flex', justifyContent: 'space-between', paddingRight: 10, paddingLeft: 10}}>
                    <span onClick={() => this.closeModal('modal')()}
                          style={{fontSize: '0.24rem', color: '#666'}}>取消</span>
                    <h3 style={{fontSize: '0.3rem', color: '#333'}}>输入短信验证码</h3>
                    <span style={{color: '#2eae83', fontSize: '0.24rem', visibility: 'hidden'}}>确定</span>
                </div>
                <div style={{position: 'relative', display: 'flex', justifyContent: 'center', paddingTop: 18}}>
                    <input
                        type="number"
                        style={{
                            position: 'absolute',
                            opacity: '0.0009',
                            zIndex: '1',
                            left: 0,
                            top: 0,
                            width: '400%',
                            height: '100%',
                            textIndent: '-999em',
                            marginLeft: '-300%'
                        }}
                    />
                    <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
                        <div style={{
                            display: _fundPassword[0] ? 'none' : 'block',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            textAlign: 'center'
                        }}></div>
                        <div style={{
                            display: _fundPassword[0] ? 'flex' : 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            color: '#333'
                        }}>
                            ●
                        </div>
                    </div>
                    <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
                        <div style={{
                            display: _fundPassword[1] ? 'none' : 'block',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            textAlign: 'center'
                        }}></div>
                        <div style={{
                            display: _fundPassword[1] ? 'flex' : 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            color: '#333'
                        }}>
                            ●
                        </div>
                    </div>
                    <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
                        <div style={{
                            display: _fundPassword[2] ? 'none' : 'block',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            textAlign: 'center'
                        }}></div>
                        <div style={{
                            display: _fundPassword[2] ? 'flex' : 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            color: '#333'
                        }}>
                            ●
                        </div>
                    </div>
                    <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
                        <div style={{
                            display: _fundPassword[3] ? 'none' : 'block',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            textAlign: 'center'
                        }}></div>
                        <div style={{
                            display: _fundPassword[3] ? 'flex' : 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            color: '#333'
                        }}>
                            ●
                        </div>
                    </div>
                    <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
                        <div style={{
                            display: _fundPassword[4] ? 'none' : 'block',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            textAlign: 'center'
                        }}></div>
                        <div style={{
                            display: _fundPassword[4] ? 'flex' : 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            color: '#333'
                        }}>
                            ●
                        </div>
                    </div>
                    <div style={{position: 'relative', borderTop: '1px solid #ccc', borderBottom: '1px solid #ccc'}}>
                        <div style={{
                            display: _fundPassword[5] ? 'none' : 'block',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            borderRight: '1px solid #ccc',
                            textAlign: 'center'
                        }}></div>
                        <div style={{
                            display: _fundPassword[5] ? 'flex' : 'none',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '1.14rem',
                            height: '0.87rem',
                            borderLeft: '1px solid #ccc',
                            borderRight: '1px solid #ccc',
                            color: '#333'
                        }}>
                            ●
                        </div>
                    </div>
                </div>
                {
                    this.state.count ?
                        <div style={button_base_css}>{`重新获取(${this.state.count}秒)`}</div> :
                        <div onClick={() => this.getVerificationCodew()} style={button_base_css}>获取手机验证码</div>
                }
            </div>
        )
    }

    render() {
        //41.8 坚持创新 商业模式 铁人三项 感动人心 价格厚道 硬件产品 新零售 电商 互联网服务 联合创始人
        // miui 用过了 就回不去了 全面屏纵向  小爱同学 ai
        return (
            <div className="fundPassword-wrapper">
                <CommonModal
                    ref="commonModal"
                >
                </CommonModal>
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