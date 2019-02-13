/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message, Button} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import LeverMoneyInfoSearch from '../../components/SearchView/LeverMoneyInfoSearch.js'
import {hlList, getDickey, hlListExcel} from '../../requests/http-req.js'
import ConfigNet, {LeverState} from '../../networking/ConfigNet'
import Number from '../../utils/Number'
import moment from 'moment'
//杠杆交易
export default class LeverMoneyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
        }
    }

    componentDidMount() {
        getDickey(ConfigNet.WAITING_FIRST_TRIAL_PAGE).then((req) => {
            if (req.status == 200) {
                this.setState({
                    statusMap: req.data.data
                }, () => {
                    this.getData()
                })
            }
        })
    }

    handleSearch = (values, id) => {//.slice(1, 11)
        this.state.pageNo = 0
        //console.log(values)
        let beginTime = values.date && values.date[0] ? JSON.stringify(values.date[0]).slice(1, 11).replace(/-/g, '/') : null
        let endTime = values.date && values.date[1] ? JSON.stringify(values.date[1]).slice(1, 11).replace(/-/g, '/') : null
        if (beginTime) {
            beginTime = beginTime + ' 00:00:00'
        }
        if (endTime) {
            endTime = endTime + ' 23:59:059'
        }
        let tem = {
            tradeId: values.tradeId,
            userId: id,
            coinCode: values.coinCode,
            handleType: values.handleType,
            beginTime: beginTime,
            endTime: endTime,
        }
        this.searchData = tem
        this.getData(tem)
    }
    searchData = null

    getData() {
        let temArr = {
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
            tradeId: this.searchData && this.searchData.tradeId || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            handleType: this.searchData && this.searchData.handleType || null,
        }
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }

        this.setState({showLoading: true})
        hlList(temArr).then((req) => {
            //console.log(req)
            if (req.status == 200) {
                let listData = []
                let temArr = req.data.data
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
                    total: req.data.total || 0
                })
            } else {
                message.info('网络异常')
            }
            this.setState({showLoading: false})
        })
    }

    hlListExcel() {
        if (!this.state.listData || this.state.listData.length == 0) {
            message.warning('没有数据')
            return
        }
        let temArr = {
            pageNo: 0,
            pageSize: 0,
            tradeId: this.searchData && this.searchData.tradeId || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            handleType: this.searchData && this.searchData.handleType || null,
        }
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }

        this.setState({showLoading: true})

        hlListExcel(temArr).then(result => {
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
        this.setState({pageNo: e}, () => {
            this.getData()
        })
    }
    renderUserList = () => {

        return (
            <Spin spinning={this.state.showLoading}>
                <Button style={{marginRight: '5px', marginLeft: '5px',marginTop:10}} onClick={() => this.hlListExcel()}>导出</Button>

                <div style={{display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: '20px'}}>
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
                <LeverMoneyInfoSearch handleSearch={this.handleSearch}/>
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
        title: '提现单号',
        dataIndex: 'tradeId',
        key: 'id',
        // sorter: (a, b) => a.mobie - b.mobie,
        sortOrder: null,
    }
    ,
    {
        title: '流水号',
        dataIndex: 'id',
        key: 'mobile',
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
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
    }
    ,
    {
        title: '币种',
        dataIndex: 'coinCode',
        key: 'coinCode',
    },
    {
        title: '资金类型',
        dataIndex: 'handleType',
        key: 'handleType',
        render: (text, r) => {
            return <div>{getLeverState(text)}</div>
        }
    }
    ,

    {
        title: '金额',
        dataIndex: 'amount',
        key: 'money',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    }
    ,
    {
        title: '当前可用余额',
        dataIndex: 'aftAmount',
        key: 'aftAmount',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    }
    ,
    {
        title: '当前冻结金额',
        dataIndex: 'frozenAmount',
        key: 'tradePrice', render: (text, r) => {
        return <div>{Number.scientificToNumber(text)}</div>
    }
    },

    {
        title: '总资产',
        dataIndex: 'totalAsset',

        key: 'createTime', render: (text, r) => {
        return <div>{Number.scientificToNumber(text)}</div>
    }
        // render: (text, record) => (<Link to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
    }
];
const getLeverState = (text) => {
    let tem = ''
    LeverState.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}
