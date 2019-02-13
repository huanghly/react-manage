/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2015/5/14
 **/
import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Button, Modal, message, Checkbox} from 'antd';
import './UserList/user-list.css';
import TableView from '../../components/TableView'
import {
    seniorUserist, seniorUseristExcel
} from '../../requests/http-req.js'
import Breadcrumb from '../../components/Breadcrumb.js'
import AuthenticationSearch from '../../components/SearchView/AuthenticationSearch.js'
import {Link} from 'react-router-dom'
import moment from 'moment'

export default class Authentication extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            isLoading: false,
            total: 0,
            pageNo: 0,
            selectedRowKeys: [],
        }
    }

    selectedRowKeys = []

    componentWillMount() {
        this.setState({isLoading: true})
    }

    componentDidMount() {
        this.getData()
    }

    onChangePagintion = (e) => {
        this.state.pageNo = e
        this.getData()
    }

    onSelectedRowKeys = (selectedRowKeys) => {
        //console.log(selectedRowKeys)
        this.selectedRowKeys = selectedRowKeys
    }

    renderUserList = () => {
        return (
            <Spin spinning={this.state.isLoading}
                  style={{display: 'flex', flexDirection: 'column', marginBottom: '20px'}}>
                <Button style={{width: 65, marginBottom: 5, marginLeft: 5, marginTop: '10px'}}
                        onClick={() => this.seniorUseristExcel()}>导出</Button>
                <TableView onChangePagintion={this.onChangePagintion} onSelectedRowKeys={this.onSelectedRowKeys}
                           columns={columns} data={this.state.listData} pageNo={this.state.pageNo}
                           total={this.state.total}/>
            </Spin>

        )
    }
    renderBreadcrumb = () => {
        const pathname = window.location.pathname
        return (
            <Breadcrumb data={pathname}/>
        )
    }

    handleSearch = (e) => {
        this.state.pageNo = 0

        let startTime = e.date && e.date[0] ? JSON.stringify(e.date[0]).slice(1, 11) + ' 00:00:00' : null
        let endTime = e.date && e.date[1] ? JSON.stringify(e.date[1]).slice(1, 11) + ' 23:59:59' : null
        e.startTime = startTime
        e.endTime = endTime

        this.seachData = e
        //拼装请求格式
        this.getData(e)
    }

    getData = (e) => {
        this.setState({isLoading: true})

        // seniorAuth == 'all' ? seniorAuth = null : seniorAuth
        seniorUserist({
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
            mobile: this.seachData && this.seachData.mobile || null,
            email: this.seachData && this.seachData.email && this.seachData.email.trim() || null,
            seniorAuth: this.seachData && this.seachData.seniorAuth || 1,
            startTime: this.seachData && this.seachData.startTime || null,
            endTime: this.seachData && this.seachData.endTime || null,
        }).then((res) => {
            let listData = []
            let total = 0
            if (res.status == 200) {
                let temArr = res.data.data
                total = res.data.total
                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                }
                temArr.forEach((item, index) => {
                    //TODO 是否登录 提现
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                    if (item.credentialsType == 0) {
                        item.credentialsType = "身份证"
                    } else if (item.credentialsType && item.credentialsType == 1) {
                        item.credentialsType = "护照"
                    }
                    //高级认证状态，0：未认证，1：待审核，2：未通过，3：通过

                    if (item.seniorAuth == 0) {
                        item.seniorAuth = "未认证"
                    } else if (item.seniorAuth == 1) {
                        item.seniorAuth = "待审核"
                    } else if (item.seniorAuth == 2) {
                        item.seniorAuth = "未通过"
                    } else if (item.seniorAuth == 3) {
                        item.seniorAuth = "通过"
                    }

                    listData.push(item)
                })
            }
            //添加key 没有计算
            this.setState({
                listData: listData,
                isLoading: false,
                total
            })
        })
    }
    seniorUseristExcel = (e) => {
        if (!this.state.listData || this.state.listData.length == 0) {
            message.warning('没有数据')
            return
        }
        this.setState({isLoading: true})

        // seniorAuth == 'all' ? seniorAuth = null : seniorAuth
        seniorUseristExcel({
            pageNo:  0,
            pageSize: 0,
            mobile: this.seachData && this.seachData.mobile || null,
            email: this.seachData && this.seachData.email && this.seachData.email.trim() || null,
            seniorAuth: this.seachData && this.seachData.seniorAuth || 1,
            startTime: this.seachData && this.seachData.startTime || null,
            endTime: this.seachData && this.seachData.endTime || null,
        }).then(result => {
            if (result.status === 200) {
                var url = window.URL.createObjectURL(result.data);
                var a = document.createElement('a');
                a.href = url;
                a.download = moment().format('YYYYMMDD_HHMMSS') + ".xlsx";
                a.click();
            }
            this.setState({isLoading: false})
        }).catch(e => {
            if (e) {
                message.error('导出失败')
                this.setState({isLoading: false})

            }
        })
    }

    render() {
        return (
            <div className='center-user-list'>
                {this.renderBreadcrumb()}
                <AuthenticationSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}
const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '60px',
        key: 'index',
        // render: text => <a style={{color: 'red', fontSize: '10px'}} href="#">{text}</a>,
    }

    ,
    {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        //  sorter: (a, b) => a.mobie - b.mobie,
        //   sortOrder: null,
    }
    , {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        //  sorter: (a, b) => a.mobie - b.mobie,
        //   sortOrder: null,
    }
    ,
    {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName'
    }
    , {
        title: '真实姓名',
        width: '110px',
        dataIndex: 'userName',
        key: 'userName'
    }
    ,
    {
        title: '国籍',
        width: '60px',
        dataIndex: 'country',
        key: 'country',
    }
    ,
    {
        title: '证件类型',
        width: '100px',
        dataIndex: 'credentialsType',
        key: 'credentialsType',
    }
    ,
    {
        title: '证件号',
        width: '120px',
        dataIndex: 'credentialsCode',
        key: 'credentialsCode',
    },
    {
        title: '注册时间',
        dataIndex: 'regTime',
        key: 'regTime',
    }
    ,
    {
        title: '审核状态',
        dataIndex: 'seniorAuth', //高级认证状态，0：未认证，1：待审核，2：未通过，3：通过
        key: 'isWithdrawCash',
    }
    ,
    {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: (text, record) => (
            <Link to={{pathname: '/index/user/userDetail', state: {data: record}}}>详情</Link>
        )
    }
];