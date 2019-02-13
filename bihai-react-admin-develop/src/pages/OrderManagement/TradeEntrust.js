/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/14
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message, Button} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import CustomFormView from "../../components/CustomFormView";
import TradeEntrustSearch from '../../components/SearchView/TradeEntrustSearch.js'
import {tradeEntrustList, tradeOrderListExcel} from '../../requests/http-req.js'
import {EntrusState} from '../../networking/ConfigNet.js'
import Number from '../../utils/Number.js'
import math from 'mathjs'
import moment from 'moment'

var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null


const columns = [
    {
        width: 70,
        title: '序号',
        fixed: 'left',
        dataIndex: 'index',
    },
    {
        title: '用户ID',
        key: 'left',
        dataIndex: 'userId',
    }
    ,
    {
        title: '币对',
        dataIndex: 'coinCode',
        key: 'coinCode',
        render: (text, r) => {
            return <div>{text.toUpperCase()}</div>
        }
    },
    {
        title: '订单号',
        dataIndex: 'orderNo',
        key: 'orderNo',

    },
    {
        title: '类型',
        dataIndex: 'tradeType',
        render: (text, r) => {
            return <div>{text == 1 ? '限价' : '市价'}</div>
        }
    }
    ,
    {
        title: '方向',
        dataIndex: 'position',
        key: 'position',
        render: (text, r) => {
            return <div>{text == 1 ? '卖出' : '买入'}</div>
        }
    }
    ,
    {
        title: '状态',
        dataIndex: 'status',
        render: (text, r) => {
            return <div>{getEntrusStateText(text)}</div>
        }
    }
    ,
    {
        title: '交易手续费',
        dataIndex: 'poundageAmount',
        key: 'poundageAmount',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }
    },
    {
        title: '委托价格',
        dataIndex: 'tradePrice',
        key: 'tradePrice',
    },
    {
        title: '委托量', //
        dataIndex: 'tradeAmount',
        key: 'tradeAmount',
    },
    {
        title: '委托总额', //价格*数量
        key: 'bwithdrawCash',
        render: (text, r) => {


            return <div>{Number.mul(r.tradeAmount, r.tradePrice)}</div>
            // return <div>{Number.scientificToNumber(math.multiply(parseFloat(r.tradeAmount), parseFloat(r.tradePrice)))}</div>
        }
    },
    {
        title: '已成交',
        dataIndex: 'dealAmount',
        key: 'dealAmount',
    },
    {
//未成交数量
        title: '未成交',//交易总量-成交量
        dataIndex: 'unDealAmount',
        key: 'unDealAmount',
        render: (text, r) => {
            // return <div>{r.tradeAmount - r.dealAmount}</div>
            return <div>{Number.sub(r.tradeAmount, r.dealAmount)}</div>
        }
    }
    ,
    {
        title: '成交均价',
        dataIndex: 'dealPrice',
        key: 'dealPrice',
    },
    {
        title: '成交总额', //dealAmount * 成交均价
        dataIndex: 'AllDealAmount',
        key: 'AllDealAmount',
        render: (text, r) => {
            return <div>{Number.mul(r.dealPrice, r.dealAmount)}</div>
            // return <div>{math.multiply(parseFloat(r.dealPrice), parseFloat(r.dealAmount))}</div>
        }
    }
    ,
    {
        title: '更新时间',
        dataIndex: 'updateTime',
        key: 'updateTime',
    },
    {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'createTime',
    }

];
const getEntrusStateText = (text) => {
    let tem = '00'
    EntrusState.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem


}
const data = null

export default class TradeEntrust extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            data: []
        }
    }

    componentWillMount() {
        this.state.showLoading = true;
    }

    componentDidMount() {
        this.getData()
    }


//tradeEntrust
    renderSearchView = () => {
        return (
            <CustomFormView/>
        )
    }

    onChangePagintion = (e) => {
        this.setState({pageNo: e}, () => {
            this.getData()
        })
    }
    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <Button style={{width: 65, marginBottom: 5, marginLeft: 5}}
                            onClick={() => this.tradeOrderListExcel()}>导出</Button>
                    <TableView minWidth={2100} columns={columns} data={this.state.data} total={this.state.total}
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
    handleSearch = (values, id) => {
        //console.log(values)
        this.state.pageNo = 0

        // let beginTime = values.date && values.date[0] ? JSON.stringify(values.date[0]).slice(1, 11).replace(/-/g, '/') : null
        // let endTime = values.date && values.date[1] ? JSON.stringify(values.date[1]).slice(1, 11).replace(/-/g, '/') : null

        // values.beginTime = beginTime
        // values.endTime = endTime
        values.userId = id
        this.searchData = values
        //console.log(values)
        this.getData()
    }

    getData() {
        tradeEntrustList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            orderNo: this.searchData && this.searchData.orderNo && this.searchData.orderNo.trim() || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            position: this.searchData && this.searchData.position || null,
            status: this.searchData && this.searchData.tradeStatus || null,
            beginTime: this.searchData && this.searchData.beginTime || null,
            endTime: this.searchData && this.searchData.endTime || null,
        }).then((req) => {
            //console.log(req)
            if (req.status == 200) {
                req.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    showLoading: false,
                    total: req.data.total,
                    data: req.data.data
                }, () => {
                    //console.log(this.state.data)
                })
            }
        })

    }

    tradeOrderListExcel() {
        if (!this.state.data || this.state.data.length == 0) {
            message.warning('没有数据')
            return
        }

        tradeOrderListExcel({
            pageNo: 0,
            pageSize: 0,
            orderNo: this.searchData && this.searchData.orderNo && this.searchData.orderNo.trim() || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            position: this.searchData && this.searchData.position || null,
            status: this.searchData && this.searchData.tradeStatus || null,
            beginTime: this.searchData && this.searchData.beginTime || null,
            endTime: this.searchData && this.searchData.endTime || null,
        }).then(result => {
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


    render() {
        return (
            <div className='center-user-list'>
                {this.renderBreadcrumb()}
                <TradeEntrustSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}
