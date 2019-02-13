/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/30
 **/
import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Input, Menu, Dropdown, Button, Icon, message, Layout, DatePicker} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import BlackListSearch from '../../components/SearchView/BlackListSearch.js'
import {
    loginLogList
} from '../../requests/http-req.js'

var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        key: 'userId0'
    }
    ,
    {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'mobie'
    }
    ,
    {
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName'
    }
    ,
    {
        title: '手机',
        dataIndex: 'mobile',
        key: 'mobile',
    }
    ,
    {
        title: 'email',
        dataIndex: 'email',
        key: 'email',
    }
    ,
    {
        title: 'Ip地址',
        dataIndex: 'lastLoginIp',
    }
    ,
    {
        title: '最后登录时间',
        dataIndex: 'lastLoginTime'
    }
];


export default class LoginLog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 0,
            listData: [],
            total: 0
        }
    }

    handleSearch = (id) => {
        this.id = id  ;      
        this.state.pageNo=0
        this.getData()
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        loginLogList({
            pageNo: this.state.pageNo,
            pageSize: 10,
            userIds: this.id || null
        }).then((res) => {
            res.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })
            this.setState({
                listData: res.data.data,
                total: res.data.total
            })
        })
    }

    state = {
        textData: '',
        dataSource: [],
        status: false

    }
    onChangePagintion = (e) => {
        this.setState({
            pageNo: e
        }, () => {
            this.getData()
        })
    }

    renderUserList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                <TableView onChangePagintion={this.onChangePagintion} o
                           columns={columns} data={this.state.listData}
                           total={this.state.total} pageNo={this.state.pageNo}
                /></div>
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
                <BlackListSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}
