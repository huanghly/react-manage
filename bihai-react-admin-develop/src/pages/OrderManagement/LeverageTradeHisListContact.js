/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/14
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import LeverageTradeListSearch from '../../components/SearchView/LeverageTradeListSearch.js'
import {leverageTradeHisList} from '../../requests/http-req.js'
import {EntrusState} from '../../networking/ConfigNet.js'
import Number from '../../utils/Number.js'

var {MonthPicker, RangePicker} = DatePicker;

const getEntrusStateText = (text) => {
    let tem = ''
    EntrusState.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}

export default class LeverageTradeHisListContact extends Component {
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
    }

    componentDidMount() {
        this.getData()
    }

    onChangePagintion = (e) => {
        this.setState({pageNo: e}, () => {
            this.getData()
        })
    }

    getData() {
        this.setState({showLoading: true})
        leverageTradeHisList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
        }).then((req) => {
            //console.log(req)
            if (req.status == 200) {
                req.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    total: req.data.total,
                    data: req.data.data
                }, () => {
                    //console.log(this.state.data)
                })
            }
            this.setState({showLoading: false})

        }).catch(e => {
            if (e) {
                message.warning(e.data.message)
                this.setState({showLoading: false})

            }
        })
    }


    render() {
        return (
            <Spin spinning={this.state.showLoading}>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={columns} data={this.state.data} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
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
        title: '币对',
        dataIndex: 'coinCode',
        key: 'coinCode',
        render: (text, r) => {
            return <div>{text.toUpperCase()}</div>
        }
    },
    {
        title: '开仓单号',
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
        title: '开仓均价',
        dataIndex: 'openDealPrice',
        key: 'openDealPrice',
    },
    {
        title: '开仓数量', //
        dataIndex: 'dealAmount',
        key: 'dealAmount',
    },
    {
        title: '开仓时间',
        key: 'bwithdrawCash',
        render: (text, r) => {
            return <div>{r.tradeAmount * r.tradePrice}</div>
        }
    },
    {
        title: '保证金',
        dataIndex: 'deposit',
        key: 'deposit',
    },
    {
        title: '手续费',
        dataIndex: 'poundageAmount',
        key: 'poundageAmount', render: (text, r) => {
        return <div>{scientificToNumber(text)}</div>
    }
    },
    {
        title: '止盈',
        dataIndex: 'stopProfit',
        key: 'stopProfit',
    }
    ,
    {
        title: '止损',
        dataIndex: 'stopLoss',
        key: 'stopLoss',
    }
    ,
    {
        title: '平仓价',
        dataIndex: 'dealAmount',
        key: 'dealAmount',
    },
    {
        title: '平仓量',
        dataIndex: 'dealPrice',
        key: 'dealPrice',
    },
    {
        title: '平仓总额',
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, r) => <div>{Number.scientificToNumber(r.dealPrice * r.dealAmount)}</div>
    }
    ,
    {
        title: '平仓时间',
        dataIndex: 'createTime',
        key: 'createTime',
    },

    {
        title: '操作',
        width: 60,
        dataIndex: 'createTime',
        key: 'createTime',
        render: (text, r) => <div>详情</div>

    },

];

function scientificToNumber(num) {
    var str = num.toString();
    var reg = /^(\d+)(e)([\-]?\d+)$/;
    var arr, len,
        zero = '';

    /*6e7或6e+7 都会自动转换数值*/
    if (!reg.test(str)) {
        return num;
    } else {
        /*6e-7 需要手动转换*/
        arr = reg.exec(str);
        len = Math.abs(arr[3]) - 1;
        for (var i = 0; i < len; i++) {
            zero += '0';
        }
        return '0.' + zero + arr[1];
    }
}
