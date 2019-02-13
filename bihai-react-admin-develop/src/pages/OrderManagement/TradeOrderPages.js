/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, message,Button} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import NewTradeOrderPageSearch from '../../components/SearchView/TradeOrderPageSearch.js'
import {tradeOrderPage,tradeOrderPageExcel} from '../../requests/http-req.js'
import ConfigNet from '../../networking/ConfigNet'
import {
    Link
} from 'react-router-dom'
import Number from '../../utils/Number'
import moment from 'moment'
export default class TradeOrderPages extends Component {
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

        let beginTime = values.date && values.date[0] ? JSON.stringify(values.date[0]).slice(1, 11).replace(/-/g, '/') : null
        let endTime = values.date && values.date[1] ? JSON.stringify(values.date[1]).slice(1, 11).replace(/-/g, '/') : null
        if (beginTime) {
            beginTime = beginTime + ' 00:00:00'
        }
        if (endTime) {
            endTime = endTime + ' 23:59:059'
        }
        let tem = {
            number: values.number,
            userId: id,
            type: values.type,
            moneyType: values.moneyType,
            state: values.state,
            beginTime: beginTime,
            endTime: endTime
        }
        this.searchData = tem

        this.getData()
    }
    searchData = null

    getData() {
        let temArr = {
            page: this.state.pageNo || 0,
            size: 10,
            number: this.searchData && this.searchData.number,//广告号
            oneself: this.searchData && this.searchData.userId || null,//广告状态（0下架，1上架）
            type: this.searchData && this.searchData.type || null,//广告类型（0购买，1出售）
            moneyType: this.searchData && this.searchData.moneyType || null,
            adminStatus: this.searchData && this.searchData.state || null,//广告状态（0下架，1上架）
        }
        //console.log(temArr)
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }
        //console.log(temArr)

        this.setState({showLoading: true})
        tradeOrderPage(temArr).then((req) => {
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
    tradeOrderPageExcel() {
        if (!this.state.listData || this.state.listData.length == 0) {
            message.warning('没有数据')
            return
        }

        let temArr = {
            page:  0,
            size: 0,
            number: this.searchData && this.searchData.number,//广告号
            oneself: this.searchData && this.searchData.userId || null,//广告状态（0下架，1上架）
            type: this.searchData && this.searchData.type || null,//广告类型（0购买，1出售）
            moneyType: this.searchData && this.searchData.moneyType || null,
            adminStatus: this.searchData && this.searchData.state || null,//广告状态（0下架，1上架）
        }
        //console.log(temArr)
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }
        //console.log(temArr)

        this.setState({showLoading: true})
        tradeOrderPageExcel(temArr).then(result => {
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
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <Button style={{width: 65, marginBottom: 5, marginLeft: 5}}
                            onClick={() => this.tradeOrderPageExcel()}>导出</Button>
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
                <NewTradeOrderPageSearch handleSearch={this.handleSearch}/>
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
    }
    ,
    {
        title: '订单号',
        dataIndex: 'number',
        key: 'number',
        // sorter: (a, b) => a.mobie - b.mobie,
        sortOrder: null,
    },
    {
        title: '广告号',
        dataIndex: 'advertisingId',
        key: 'advertisingId',
        // sorter: (a, b) => a.mobie - b.mobie,
        sortOrder: null,
    }
    ,
    {
        title: '类型',
        dataIndex: 'type',
        key: 'type',
        render: (text, record) => (<div>{text == 1 ? '出售' : '购买'}</div>)
    }
    ,
    {
        title: '卖家手机号',
        dataIndex: 'sellPhone',
        key: 'sellPhone',
    }
    ,
    {
        title: '买家手机号',
        dataIndex: 'buyerPhone',
        key: 'buyerPhone',
    }

    ,
    {
        title: '货币',
        dataIndex: 'currency',
    }
    ,
    {
        title: '币种',
        dataIndex: 'moneyType',
        key: 'moneyType'
    }
    ,
    {
        title: '单价',
        dataIndex: 'unitPrice',
        key: 'unitPrice',
    }
    ,
    {
        title: '数量',
        dataIndex: 'quantity',
        key: 'quantity',
    }
    ,
    {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, r) => <div>{Number.scientificToNumber(text)}</div>
    }, {
        title: '手续费',
        dataIndex: 'poundageAmount',
        key: 'poundageAmount',
        render: (text, r) => <div>{Number.scientificToNumber(text)}</div>

    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
    }
    ,
    {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        render: (text, record) => (<div>{getStatus(text)}</div>)
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