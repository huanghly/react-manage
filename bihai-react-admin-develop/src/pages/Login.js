import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import appStore from '../appStore';
import BasicFragment from '../BasicFragment'
import LoginForm from '../components/SearchView/LoginForm.js'
import './Login/Login.css'
import {message, Spin, Row, Col, Button} from 'antd';
import {
    userLogin, getImageCode, checkVersion
} from '../requests/http-req.js'
import GetVerificationCode from '../components/GetVerificationCode.js';
import history from '../history.js'
import {Motion, spring, presets} from 'react-motion'
import appConfig from '../config/appConfig.js'
import {FormattedMessage} from 'react-intl';

// import {OrderInfoModal, InfoList} from '../components/modal/EditWordModal.js'

class Login extends BasicFragment {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        }
    }


    componentDidMount() {

    }

    componentWillUnmount() {
        // //保存
        // this.updatedStore(this.state, 'oneStore')
    }

    gotoLogin = (data, img) => {
        if (!img || img.imageToken == null) {
            message.error('验证码服务异常')
            return
        }
        let tem = {
            imageCode: data.imageCode,
            imageToken: img.imageToken,
            password: data.password,
            username: data.username
        }
        //appStore.set('token', null);
        window.localStorage.setItem('user', null)

        userLogin(JSON.stringify(tem)).then(req => {
            if (req.status == 200 && req.data.code) {
                // req.data.data.resourcesList.forEach(item => {
                //     arrList.push(item.url)
                // })
                let user = {username: tem.username, token: req.data.data.token, menuData: req.data.data.resourcesList}
                appStore.set('user', user);
                window.localStorage.setItem('user', JSON.stringify(user))
                message.success('登陆成功')
                //判断是否包含

                history.push('/index/user/userList')
            } else {
                message.error('错误验证!')
            }
        }).catch(e => {
            if (e) {
                if (e.data.error.indexOf('验证码输入错误') != -1) {
                    message.warning('验证码输入错误')
                } else {
                    message.warning('请检查用户名密码')
                }
            }
        })
    }


    render() {
        return (
            <div className='center justify-content-center'>
                <img className='login-img-bg' src={require('../resources/img/login-bg.png')}/>
                <div className='login-top-view'>
                    <img style={{height: '30px', width: '90px'}} src={appConfig.getENV().logo_w}/>
                    <div className='login-top-text'>交易所管理系统</div>
                </div>
                <div className='login-view'>
                    <LoginForm goto={this.gotoLogin}/>
                </div>

            </div>
        )
    }
}

export default storeAware(appStore, props => {
    return {
        store: 'store',
        user: 'user'
    };
})(Login);
