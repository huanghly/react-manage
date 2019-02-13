/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/30
 **/
import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Input, Menu, Dropdown, Button, Icon, message, Layout, DatePicker} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import AuthenticationSearch from '../../components/SearchView/AuthenticationSearch.js'

var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null

const columns = [
    {
        title: '序号',
        dataIndex: 'userId',
        render: text => <a style={{color: 'red', fontSize: '14px'}} href="#">{text}</a>,
    }
    ,
    {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',

    }
    ,
    {
        title: '邮箱',
        dataIndex: 'email',
    }
    ,
    {
        title: '币种',
        dataIndex: 'country',
    }
    ,
    {
        title: '钱包地址',
        dataIndex: 'credentialsType',
    }
    ,
    {
        title: '创建时间',
        dataIndex: 'credentialsCode',
    }
];

const data = [{
    userId: 101,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",
    // "operation": <div onClick={userId => //console.log(userId)} style={{color: 'blue'}}>详情</div>
}, {
    "userId": 101,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",

}, {
    "userId": 101,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",

}, {
    "userId": 101,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",

}, {
    "userId": 101,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",

}, {
    "userId": 101,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",

}, {
    "userId": 101,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",

}, {
    "userId": 101,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",
    "operation": <div style={{color: 'blue'}}></div>
}, {
    "userId": 1011,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",

}, {
    "userId": 1044,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",

}, {
    "userId": 103,
    "mobie": 12345678999,
    "email": "i06B6sHj@KpnhF.wvn",
    "nickName": "nickname",
    "userName": "张三",
    "country": "4Ajb5cpa57",
    "credentialsType": "AlbUPr2BZx",
    "credentialsCode": "tA11qFoSY7",
    "regTime": "1526224250029",
    "bprimaryAuthen": true,
    "bseniorAuthen": "bseniorAuthen",
    "userLevel": "1LUQu7hAzd",
    "paypwd_Interval": 38994,
    "bwithdrawCash": "05fIzXjrz0",
    "bnormalTrade": true,
    "LastLoginTime": "1527038901588",

}];

export default class WalletAddressList extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentWillMount() {}

    componentDidMount() {}
    state = {
        textData: '',
        dataSource: [],
        status: false

    }

    renderUserList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                <TableView columns={columns} data={data}/>
            </div>
        )
    }
    renderBreadcrumb = () => {
        const pathname = window.location.pathname
        return (
            <Breadcrumb data={pathname}/>
        )
    }

    render() {
        return (
            <div className='center-user-list'>
                {this.renderBreadcrumb()}
                <AuthenticationSearch/>
                {this.renderUserList()}
            </div>
        )
    }
}
