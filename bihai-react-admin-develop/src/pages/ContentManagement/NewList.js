/* eslint-disable react/require-render-return,react/jsx-no-undef */
/**
 * Created by liu 2018/5/14
 */

import {articleList, articleUpdate} from '../../requests/http-req.js'

import E from 'wangeditor'
import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Input, Menu, DatePicker, Button, Icon, message, Layout} from 'antd';
import './NewList/new-list.css';
import TableView from '../../components/TableView'

import Breadcrumb from '../../components/Breadcrumb.js'
import EditWordModal from '../../components/modal/EditWordModal.js'

var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null

const columns = [
    {
        width: 100,
        title: '用户ID',
        fixed: 'left', dataIndex: 'userId',
        render: text => <a style={{color: 'red', fontSize: '10px'}} href="#">{text}</a>,
    }
    ,
    {
        title: '电话号码',
        dataIndex: 'mobie',
        key: 'mobie',
        sorter: (a, b) => a.mobie - b.mobie,
        sortOrder: null,
    }
    ,
    {
        title: '昵称',
        dataIndex: 'nickName',
    }
    ,
    {
        title: '国籍',
        dataIndex: 'country',
    }
    ,
    {
        title: '证件类型',
        dataIndex: 'credentialsType',
    }
    ,
    {
        title: '证件号',
        dataIndex: 'credentialsCode',
    },
    {
        title: '注册时间',
        dataIndex: 'regTime',
    }
    ,
    {
        title: '初级认证',
        dataIndex: 'bprimaryAuthen',
    }

    ,
    {

        title: '高级认证',
        dataIndex: 'bseniorAuthen',
    }

    ,
    {
        title: '会员等级',
        dataIndex: 'userLevel',
    },
    {
        title: '资金密码状态',
        dataIndex: 'paypwd_Interval',
    },
    {
        title: '提币状态',
        dataIndex: 'bwithdrawCash',
    },
    {

        title: '提现状态',
        dataIndex: 'bwithdrawCash',
    },
    {

        title: '上次登录时间',
        dataIndex: 'LastLoginTime',
    }
    ,
    {
        title: '操作',
        dataIndex: 'operation',
        fixed: 'right',
        width: 100,
    }

];

const data = [{
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
    "operation": <div style={{color: 'blue'}}>详情</div>
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
    "operation": <div style={{color: 'blue'}}>详情</div>
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
    "operation": <div style={{color: 'blue'}}>详情</div>
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
    "operation": <div style={{color: 'blue'}}>详情</div>
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
    "operation": <div style={{color: 'blue'}}>详情</div>
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
    "operation": <div style={{color: 'blue'}}>详情</div>
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
    "operation": <div style={{color: 'blue'}}>详情</div>
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
    "operation": <div style={{color: 'blue'}}>详情</div>
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
    "operation": <div style={{color: 'blue'}}>详情</div>
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
    "operation": <div style={{color: 'blue'}}>详情</div>
}];

function handleMenuClick(e) {
    message.info('Click on menu item.');
    //console.log('click', e);
}

const dateFormat = 'YYYY/MM/DD';
const menu = (
    <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">1st menu item</Menu.Item>
        <Menu.Item key="2">2nd menu item</Menu.Item>
        <Menu.Item key="3">3rd item</Menu.Item>
    </Menu>
);
export default class NewList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            pageNo: 1,
            pageSize: 10
        }
    }

    componentWillMount() {

    }

    initEdit = () => {
        const elem = this.refs.editorElem
        const editor = new E(elem)
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        editor.customConfig.onchange = html => {
            this.setState({
                editorContent: html
            })
        }
        editor.create()
        //console.log('初始化完成')
    }

    componentDidMount() {
        // articleList({
        //     pageNo: this.state.pageNo,
        //     pageSize: this.state.pageSize,
        // }).then(res => {
        //     //console.log(res)
        // })
        let body = {
            articleResource: "币硬中国",
            content: "文章内容",
            createTim: "创建时间",
            id: null,
            keyWords: "币硬发布会",
            publisher: "管理员",
            showClient: "ios",
            status: "文章状态",
            title: "币硬发布会",
            type: "通知",
            updateTime: "修改时间"
        }
        articleUpdate(JSON.stringify(body)).then(res => {
            //console.log(res)
        })

        // axios.post('http://192.168.100.100:8080/v1/article/update', null, this.headers).then(res => {
        //         //console.log(res)
        //     }
        // )

    }

    renderSearchView = () => {
        return (
            <div className='search-view-user'>
                <div className='row-view-user'>
                    <div className='row-item'>
                        <div className='text-margin'>关键字</div>
                        <Input className='input'></Input>
                    </div>
                    <div className='row-item'>
                        <div className='text-margin'>文章类型</div>
                        <Input className='input'></Input>
                    </div>
                    <div className='row-item'>
                        <div className='text-margin'>客户端</div>
                        <Input className='input'></Input>
                    </div>
                    <Button htmlType="submit"> 查询 </Button>
                </div>
            </div>
        )
    }

    renderUserList = () => {
        return (
            <scrollview style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                <div className='row-user'>
                    <Button onClick={this.addOnClick}>新增</Button>
                    <Button>删除</Button>
                    <Button>修改</Button>
                    <Button>重置redis</Button>
                </div>
                <TableView columns={columns} data={data}/>
            </scrollview>
        )
    }
    renderBreadcrumb = () => {
        const pathname = window.location.pathname
        return (
            <Breadcrumb data={pathname}/>
        )
    }
    addOnClick = () => {
        //console.log('ddd')
        this.setState({
            showModal: true
        })
    }

    closeModal = () => {
        this.setState({
            showModal: false
        })
    }

    render() {
        return (
            <div className='center-user-list'>
                <div>文章列表</div>
                {this.renderBreadcrumb()}
                {this.renderSearchView()}
                {this.renderUserList()}
                {this.state.showModal && <EditWordModal onChange={this.onChange} onClose={this.closeModal}/>}
            </div>
        )
    }
}
