/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, message} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import NewTradeOrderPageSearch from '../../components/SearchView/TradeOrderPageSearch.js'
import {aboveOrderList} from '../../requests/http-req.js'
import ConfigNet from '../../networking/ConfigNet'
import {
    Link
} from 'react-router-dom'
import Number from '../../utils/Number'

export default class UpstreamDeclaration extends Component {
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
        //提现类型接口
        // getCodeType().then((req) => {
        //     if (req.status == 200) {
        //         this.setState({
        //             statusMap: req.data.data
        //         }, () => {
        //             this.getData()
        //         })
        //     }
        // })
        this.getData()
    }

    handleSearch = (values, id) => {
        this.state.pageNo = 0

        this.getData()
    }
    searchData = null

    getData() {
        let temArr = {
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
        }


        this.setState({showLoading: true})
        aboveOrderList(temArr).then((req) => {

            req.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })
            if (req.status == 200) {
                if (req.data.data.length == 0) {
                    message.warning('没有符合的数据')
                }
                this.setState({
                    listData: req.data.data,
                    total: req.data.total

                })
            }
            this.setState({showLoading: false})
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
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {/*<NewTradeOrderPageSearch handleSearch={this.handleSearch}/>*/}
                {this.renderUserList()}
            </div>
        )
    }
}
const columns = [
    {
        width: 70,
        title: '序号',
        dataIndex: 'index',
    },
    {
        title: '上游交易所id',
        dataIndex: 'lp',
        key: 'lp',
    }
    ,
    {
        title: '上游成交单id',
        dataIndex: 'aboveOrderId',
        key: 'aboveOrderId',
    }
    ,
    {
        title: '上游成交价',
        dataIndex: 'aboveDealPrice',
        key: 'aboveDealPrice',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    }
    ,
    {
        title: '成交数量',
        dataIndex: 'dealAmount',
        key: 'dealAmount',
    }
    ,
    {
        title: '成交时间',
        dataIndex: 'dealDateTime',
        key: 'dealDateTime',
    }


    ,
    {
        title: '交易对手单号',
        dataIndex: 'lpOrderId',
        key: 'lpOrderId'
    }
    ,
    {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',
    }, {
        title: '订单类型',
        dataIndex: 'tradeType',
        key: 'tradeType',
        render: (text, r) => {
            return <div>{text == 0 ? '市价单' : '限价单'}</div>
        }
    }
    ,
    {
        title: '手续费',
        dataIndex: 'poundageAmount',
        key: 'poundageAmount',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    }
   ,
    {
        title: '本地成交价',
        dataIndex: 'underDealPrice',
        key: 'underDealPrice',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    }

];
const getStatus = (e) => {
    if (e == 1) {
        return '待付款 '
    } else if (e == 2) {
        return '放币 '

    } else if (e == 3) {
        return '已完成'

    } else if (e == 4) {
        return '已取消'

    } else if (e == 5) {
        return '申诉中 '

    } else {
        return ''
    }
}