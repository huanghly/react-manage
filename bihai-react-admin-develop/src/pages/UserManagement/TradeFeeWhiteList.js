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
    prohibitStatusList, tradeStatus, tradeFeeStatus
} from '../../requests/http-req.js'


var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null


export default class TradeFeeWhiteList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: null,
            pageSize: 0,
            pageNo: 0,
            onSelectedRowKeys: []
        }
    }

    outB = (e) => {
        //console.log(e)
        tradeFeeStatus({userId: e.userId, isTradeFee: 1}).then((res) => {
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
            sorter: (a, b) => a.mobie - b.mobie,
            sortOrder: null,
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
            dataIndex: 'tradeFeeTime',
        }
        ,
        {
            title: '操作',
            dataIndex: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => (
                <span>
      <a onClick={() => this.outB(record)}>移出白名单</a>
    </span>
            )
        }
    ];

    componentDidMount() {
        this.getData()
    }

    id = null

    getData() {
        prohibitStatusList({
            pageSize: 10,
            pageNo: this.state.pageNo || 0,
            userIds: this.id || null,
            tradeFeeStatus: 0
        }).then((res) => {
            // //console.log(res)
            if (res.status == 200) {
                res.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    listData: res.data.data
                }, () => {
                    //    //console.log(this.state.listData)
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
                           hiddenSelection={true}

                           columns={this.columns} data={this.state.listData}
                           total={this.state.total}/>
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
        this.id = e
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
