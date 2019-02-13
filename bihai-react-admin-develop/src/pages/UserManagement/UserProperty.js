/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message, Button} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import UserPropertySearch from '../../components/SearchView/UserPropertySearch.js'
import {coindrawList, getDickey, tradeDetailAll, tradeDetailAllExcel} from '../../requests/http-req.js'
import ConfigNet from '../../networking/ConfigNet'
import {
    Link
} from 'react-router-dom'
import moment from 'moment';
import Number from '../../utils/Number.js'

var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null


const data = null

export default class UserProperty extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
        }
        this.searchData = null
    }

    componentDidMount() {
        //账户类型接口
        getDickey(ConfigNet.MONEY_TYPE).then((res) => {
            if (res.status == 200) {
                this.setState({
                    statusMap: res.data.data
                }, () => {
                    this.getData()
                })
            }
        })
    }

    handleSearch = (values, id) => {
        //    //console.log(values)
        let tem = {
            handleType: values.handleType,
            userId: id,
            coinCode: values.coinCode
        }
        this.state.pageNo = 0
        this.searchData = tem
        this.getData()
    }

    searchData = null

    getData() {
        let aaa = {
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
            userId: this.searchData && this.searchData.userId || null,
            handleType: this.searchData && this.searchData.handleType || null,
            coinCode: this.searchData && this.searchData.coinCode
        }

        this.setState({showLoading: true})
        tradeDetailAll(aaa).then((res) => {
            let tem = []
            if (res.status == 200) {
                let listData = []
                let temArr = res.data.data
                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                } else {
                    temArr.forEach((item, index) => {
                        item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                        listData.push(item)
                    })
                }
                this.setState({
                    listData: listData,
                    total: res.data.total || 0
                }, () => {
                    //  //console.log( this.state.listData)
                })
            }
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                message.warning('服务异常')
                this.setState({showLoading: false})

            }
        })
    }

    searchData = null

    tradeDetailAllExcel() {
        if (!this.state.listData || this.state.listData.length == 0) {
            message.warning('没有数据')
            return
        }
        let aaa = {
            pageNo: 0,
            pageSize: 0,
            userId: this.searchData && this.searchData.userId || null,
            handleType: this.searchData && this.searchData.handleType || null,
            coinCode: this.searchData && this.searchData.coinCode
        }
        this.setState({showLoading: true})
        tradeDetailAllExcel(aaa).then(result => {
            if (result.status === 200) {
                var url = window.URL.createObjectURL(result.data);
                var a = document.createElement('a');
                a.href = url;
                a.download = moment().format('YYYYMMDD_HHMMSS') + ".xlsx";
                a.click();
            }
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                message.error('导出失败')
                this.setState({showLoading: false})
            }
        })
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
            <Spin spinning={this.state.showLoading}>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: '20px'}}>
                    <Button style={{width: 65, marginBottom: 5, marginLeft: 5}}
                            onClick={() => this.tradeDetailAllExcel()}>导出</Button>
                    <TableView columns={columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
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
                <UserPropertySearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}
const columns = [
    {
        width: 70,
        title: '序号',
        fixed: 'left',
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
        key: 'email',
    }
    ,
    {
        title: '账户',
        dataIndex: 'handleType',
        key: 'handleType',
        render: (text, record) => getTextStatus(text)

    }
    ,
    {
        title: '币种',
        dataIndex: 'coinCode',
        key: 'coinCode',
    },
    {
        //10020005:平台转账;10020010:网络转出;10020015:账户划出
        title: '可用金额',
        dataIndex: 'currentAmount',
        key: 'currentAmount',
        render: (text, r) => {
            return <div>{text}</div>
        }
    }
    ,
    {
        title: '冻结金额',
        dataIndex: 'frozenAmount',
        key: 'frozenAmount',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    }
    ,
    {
        title: '总资产',
        dataIndex: 'enableAmount',
        key: 'enableAmount',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    }
    ,
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
    }
    ,
    {
        title: ' 资金平衡表',
        key: 'operation',
        render: (text, record) => (
            <Link to={{pathname: '/index/user/userPropertyInfo', state: {data: record}}}>查看</Link>
        )
    }
];
const getTextStatus = (value) => {
    //  //console.log(value)
    if (value == '10060005') {
        return '币币账户'
    } else if (value == '10060010') {
        return '法币账户'
    } else if (value == '10060015') {
        return '杠杆账户'
    } else {
        return ""
    }
}



