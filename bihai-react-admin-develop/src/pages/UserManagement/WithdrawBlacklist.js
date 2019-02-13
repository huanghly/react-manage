/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/30 提现黑名单
 **/
import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Layout, DatePicker, message} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import BlackListSearch from '../../components/SearchView/BlackListSearch.js'
import {
    prohibitStatusList, withdrawStatus
} from '../../requests/http-req.js'


var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null


export default class WithdrawBlacklist extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            pageSize: 0,
            pageNo: 0,
            onSelectedRowKeys: []
        }
    }

    outB = (e) => {
        // //console.log(e)
        withdrawStatus({userId: e.userId, isWithdrawCash: 1}).then((res) => {
            if (res.status == 200) {
                this.getData()
            } else {
                message.error('失败')
            }
        })
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
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
            title: '昵称',
            dataIndex: 'nickName',
        }
        ,
        {
            title: '姓名',
            dataIndex: 'userName',
        }
        ,
        {
            title: '移入时间',
            dataIndex: 'withdrawCashTime',
        }
        ,
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => (
                <span>
      <a onClick={() => this.outB(record)}>移出黑名单</a>
    </span>
            )
        }
    ];

    componentDidMount() {
        this.getData()
    }

    getData(id) {

        prohibitStatusList({
            pageSize: 10,
            pageNo: this.state.pageNo || 0,
            userIds: id || null,
            withdrawStatus: 0
        }).then((res) => {
            // //console.log(res)
            res.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })
            if (res.status == 200) {
                this.setState({
                    listData: res.data.data
                }, () => {
                    //console.log(this.state.listData)
                })
            }
        })
    }

    onChangePagintion = (e) => {
        this.state.pageNo = e
        this.getData({pageSize: 10, pageNo: e})
    }
    onSelectedRowKeys = (onSelectedRowKeys) => {
        this.setState({
            onSelectedRowKeys: onSelectedRowKeys
        })
    }
    renderUserList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                <TableView onChangePagintion={this.onChangePagintion} onSelectedRowKeys={this.onSelectedRowKeys}
                           columns={this.columns} data={this.state.listData}
                           hiddenSelection={true}
                           total={this.state.total} pageNo={this.state.pageNo}
                />
            </div>
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

        this.getData(e)
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
