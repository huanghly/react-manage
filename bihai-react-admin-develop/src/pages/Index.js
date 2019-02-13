import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {routes} from '../routes.js'
import {Layout, Menu, Icon, LocaleProvider, Modal} from 'antd';
import appStore from '../appStore';
import './index/index.css';
import MenuView from '../components/MenuView'
import history from '../history';
import PropTypes from 'prop-types';
import {Route, Switch} from 'react-router-dom';
import {} from '../requests/http-req.js'
import zhCN from 'antd/lib/locale-provider/zh_CN';
import appConfig from '../config/appConfig.js'

const {Sider, Footer, Content} = Layout;

const showDialog = () => {
    Modal.confirm({
        title: '退出登陆',
        okText: '确认',
        cancelText: '取消',
        onOk: () => {
            history.push('/')
        },
    });
}
if(window.localStorage.getItem('user') == null){
    history.push('/')
}
const HeadView = (props) => {
    return (
        <div style={{
            height: '50px',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            padding: '0 60px',
            backgroundColor: '#202a41'
        }}>
            <img style={{width: '90px', height: '30px'}} src={appConfig.getENV().logo_w}/>
            <a style={{marginLeft: '10px', fontSize: '16px', color: '#FFF'}}>
                交易所管理后台
            </a>
            <div style={{display: 'flex', flex: 1}}></div>
            <a onClick={showDialog} style={{fontSize: '16px', color: '#FFF'}}>
                {JSON.parse(window.localStorage.getItem('user')).username}
            </a>
            {/*style={{fontSize: '16px', color: '#FFF'}}>{appStore.get(['user', 'username'])}</a>*/}
        </div>
    )
}
const de = () => {
    return (<h3>空</h3>
    )
}

class Index extends Component {
    static contextTypes = {
        showMessageModalBox: PropTypes.func.isRequired,
    };

    state = {
        collapsed: false,
        currentViewKey: 0
    }

    componentDidMount() {
        window.document.querySelector('title').textContent = "后台管理系统";
    }

    _onItemClick = (data) => {

        //如果当前一直是
        if (window.location.pathname == data.key) {
            history.go(0)
        } else {
            history.push(data.key)
        }
    }


    onCollapse = (collapsed) => {
        // //console.log(collapsed);
        this.setState({collapsed});
    }

    initRouter = () => {
        return routes.map((item) => {
            return <Route path={item.path} key={item.path} component={item.component}/>
        })

    }
    changeLanguage = () => {

        window.localStorage.setItem('language','en-1')
        history.go(0)
    }

    render() {
        //  //console.log(this.props)
        return (
            <LocaleProvider locale={zhCN}>
                <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                    <HeadView onLanguage={this.changeLanguage}/>
                    <div style={{display: 'flex', flexDirection: 'row', height: '100%'}}>
                        <Layout key={0} style={{minHeight: '100vh'}}>
                            <Sider
                                style={{overflow: 'auto', height: '100vh',}}
                                // collapsible
                                // collapsed={this.state.collapsed}
                                // onCollapse={this.onCollapse}
                            >
                                {/*<a>后台模板logo</a>*/}
                                <MenuView onItemClick={this._onItemClick}/>
                            </Sider>
                        </Layout>
                        {/*<div style={{flex: 1}}>*/}
                        <Switch>
                            <Route exact path={this.props.match.url} render={de}/>
                            {this.initRouter()}
                        </Switch>
                        {/*</div>*/}
                    </div>
                </div>
            </LocaleProvider>
        )
    }
}

export default storeAware(appStore, props => {
    return {
        store: 'store',
        user: 'user'
    };
})(Index);
var scientificToNumber = (num) => {
    var str = num.toString();
    var reg = /^(\d+)(e)([\-]?\d+)$/;
    var arr, len,
        zero = '';

    /*6e7或6e+7 都会自动转换数值*/
    if (!reg.test(str)) {
        return num;
    } else {
        /*6e-7 需要手动转换*/
        arr = reg.exec(str);
        len = Math.abs(arr[3]) - 1;
        for (var i = 0; i < len; i++) {
            zero += '0';
        }
        return '0.' + zero + arr[1];
    }
}