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


export default class UserWalletAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentWillMount() {
    }

    componentDidMount() {
    }

    state = {
        textData: '',
        dataSource: [],
        status: false
    }

    renderUserList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
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
