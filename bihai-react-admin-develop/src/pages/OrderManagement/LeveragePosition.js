/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/14
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message, Button, Modal} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import LeveragePositionListSearch from '../../components/SearchView/LeveragePositionListSearch.js'
import {leverageHoldList, leverageEveningUp, leverageHoldListExcel} from '../../requests/http-req.js'
import {leverageTradeState} from '../../networking/ConfigNet.js'
import moment from "moment"
import {Decimal} from 'decimal.js';
import Number from '../../utils/Number';
import DetailsTable from './DetailsTable.js'

var {MonthPicker, RangePicker} = DatePicker;

const getEntrusStateText = (text) => {
    let tem = ''
    leverageTradeState.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}

export default class LeveragePosition extends Component {
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
    selectedRowKeys = []
    //平仓
    eveningUp = () => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('选择一个目标')
            return
        }
        let tem = {
            orderNo: this.state.data[this.selectedRowKeys[0]].orderNo,
            userId: this.state.data[this.selectedRowKeys[0]].userId
        }
        //判断选择
        leverageEveningUp(JSON.stringify(tem)).then(res => {
            if (res.status == 200) {
                message.success('操作成功')
                this.getData()
                this.selectedRowKeys = []
            }
        }).catch(e => {
            if (e) {
                this.selectedRowKeys = []
                message.warning(e.data.message)
            }
        })
    }
    LeveragePosition = []
    onSelectedRowKeys = (e) => {
        this.selectedRowKeys = e
    }
    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={this.eveningUp} style={{marginRight: '5px', marginLeft: '5px'}}>平仓</Button>
                    {/*<Button onClick={this.eveningUp} style={{marginRight: '5px', marginLeft: '5px'}}>全部平仓</Button>*/}
                    <Button onClick={this.leverageHoldListExcel}
                            style={{marginRight: '5px', marginLeft: '5px'}}>导出</Button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={this.columns} data={this.state.data} total={this.state.total}
                               pageNo={this.state.pageNo}
                               minWidth={2122}
                               pageSize={this.state.pageSize}
                               onSelectedRowKeys={this.onSelectedRowKeys}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }

    handleSearch = (values, id) => {
        this.state.pageNo = 0

        let beginTime = values.date && values.date[0] ? JSON.stringify(values.date[0]).slice(1, 11).replace(/-/g, '/') : null
        let endTime = values.date && values.date[1] ? JSON.stringify(values.date[1]).slice(1, 11).replace(/-/g, '/') : null

        if (beginTime) {
            beginTime = beginTime + ' 00:00:00'
            endTime = endTime + ' 23:59:59'
        }
        values.beginTime = beginTime
        values.endTime = endTime
        values.userId = id
        this.searchData = values
        console.log(this.searchData)
        this.getData()
    }

    getData() {
        this.setState({showLoading: true})
        leverageHoldList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            orderNo: this.searchData && this.searchData.orderNo && this.searchData.orderNo.trim() || null,
            userId: this.searchData && this.searchData.userId || null,
            coin: this.searchData && this.searchData.coinCode || null,
            position: this.searchData && this.searchData.position || null,
            tradeType: this.searchData && this.searchData.tradeStatus || null,
            startTime: this.searchData && this.searchData.beginTime || null,
            endTime: this.searchData && this.searchData.endTime || null,
        }).then((req) => {
            console.log(req)
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
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                message.warning(e.data.message)
                this.setState({showLoading: false})

            }
        })

    }

    leverageHoldListExcel = () => {
        if (!this.state.data || this.state.data.length == 0) {
            message.warning('没有数据')
            return
        }
        this.setState({showLoading: true})

        leverageHoldListExcel({
            pageNo: 0,
            pageSize: 0,
            orderNo: this.searchData && this.searchData.orderNo && this.searchData.orderNo.trim() || null,
            userId: this.searchData && this.searchData.userId || null,
            coin: this.searchData && this.searchData.coinCode || null,
            position: this.searchData && this.searchData.position || null,
            tradeType: this.searchData && this.searchData.tradeStatus || null,
            startTime: this.searchData && this.searchData.beginTime || null,
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
    close = () => {
        this.setState({
            showModal: false
        })
    }
    showDetail = (item) => {
        this.item = item
        this.setState({
            showModal: true
        })
    }
    renderModal = () => {
        return (
            <Modal
                width={1100}
                maskClosable={false}
                destroyOnClose={true}
                onCancel={this.close}
                title={"详情列表"}
                visible={this.state.showModal}
                onChange={this.close}
                footer={null}
            >
                <DetailsTable item={this.item}></DetailsTable>
            </Modal>
        )
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                <LeveragePositionListSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
                {this.renderModal()}
            </div>
        )
    }

    columns = [
        {
            width: 70,
            title: '序号',
            fixed: 'left',
            dataIndex: 'index',
        }
        ,
        {
            title: '开仓单号',
            dataIndex: 'orderNo',
            key: 'orderNo',

        },

        {
            title: '开仓方向',
            render: (text, r) => {
                return <div>{r.tradeType == 1 ? '限价' : '市价'}{r.position == 1 ? '卖' : '买'}</div>
            }
        }
        ,
        {
            title: '币对',
            dataIndex: 'coinCode',
            key: 'coinCode',

        }
        ,

        {
            title: '订单状态',
            dataIndex: 'status',
            render: (text, r) => {
                return <div>{getEntrusStateText(text)}</div>
            }
        }
        ,
        {
            title: '开仓均价',
            dataIndex: 'dealPrice',
            key: 'dealPrice',
            render: (t, r) => {
                let arr = r.coinCode.split('/')
                return <div>{t}{`(` + arr[1] + `)`}</div>
            }

        },
        {
            title: '开仓数量', //
            dataIndex: 'dealAmount',
            key: 'dealAmount',
            render: (t, r) => {
                //{record.tradeType===0 && record.position===0 ? record.dealAmount / record.openDealPrice : record.dealAmount} {record.targetCoin}
                //总额除均价
                let arr = r.coinCode.split('/')
                let coin = `(` + arr[0] + `)`
                return <div>{r.tradeType == 0 && r.position == 0 ? (Number.scientificToNumber(Number.div(r.dealAmount, r.dealPrice)) + coin) : (Number.scientificToNumber(t) + coin)}</div>
            }
        },

        {
            title: '开仓总额',
            key: 'tradeSum',
            dataIndex: 'tradeSum',
            render: (t, record) => {

                return <div>{Number.scientificToNumber(record.tradeType === 0 && record.position === 0 ? record.dealAmount : record.dealAmount * record.dealPrice)}
                    ({record.sourceCoin})</div>
            }
        }
        ,
        {
            title: '委托时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '委托价格',
            dataIndex: 'tradePrice',
            key: 'tradePrice',
            render: (t, r) => {
                if (r.tradeType == 0 && r.position == 0) {
                    return <div>—</div>
                } else {
                    return <div>{t}({r.tradeType === 0 ? '' : r.position === 0 ? r.targetCoin : r.sourceCoin})</div>

                }
            }
        },
        {
            title: '委托量', //
            dataIndex: 'tradeAmount',
            key: 'tradeAmount',//如果是市家买 就是交易量
            render: (t, r) => {
                if (r.tradeType == 0 && r.position == 0) {
                    return <div>—</div>
                } else {
                    return <div>{t}({r.targetCoin})</div>

                }
            }
        },
        {
            title: '委托总额', //价格*数量
            key: 'bwithdrawCash',
            render: (t, record) => {
                return ( <span>{
                    record.tradeType === 0 ?
                        '—' :
                        record.position === 0 ?
                            record.tradePrice * record.tradeAmount :
                            record.tradePrice * record.tradeAmount}

                    {record.tradeType === 0 ? '' : `(` + record.sourceCoin + `)`}</span> )
            }
        }, {
            title: '止盈',
            dataIndex: 'stopProfit',
            key: 'stopProfit',
            render: (t, r) => {
                return <div>{t || '—'}</div>
            }
        }, {
            title: '止损',
            dataIndex: 'stopLoss',
            key: 'stopLoss',
            render: (t, r) => {
                return <div>{t || '—'}</div>
            }
        },
        {
            title: '保证金',
            dataIndex: 'deposit',
            key: 'deposit',
            render: (text, record) => {

                return <div>{Number.scientificToNumber(text)}({record.position === 0 ? record.sourceCoin : record.targetCoin})</div>
            }
        },
        {
            title: '开仓手续费',
            dataIndex: 'poundageAmount',
            key: 'poundageAmount',
            render: (text, r) => {
                let arr = r.coinCode.split('/')
                let coin = ''
                if (r.position == 0) {//买
                    coin = `(` + arr[0] + `)`
                } else {
                    coin = `(` + arr[1] + `)`
                }
                //如果是买
                return <div>{Number.scientificToNumber(text)}{coin}</div>
            }
        },
        {
            title: '开仓时间',
            dataIndex: 'dealTime',
            key: 'dealTime',
        }

    ];

    // getTtradeSum = (r) => {
    //     //除了市价买入
    //     if (r.tradeType == 0 && r.position == 0) {
    //         let res = Number.div(r.dealPrice, r.dealAmount)
    //         console.log('价格：' + r.dealPrice + "  " + "数量：" + r.dealAmount)
    //         console.log(res)
    //         return res
    //     } else {
    //         return Number.mul(r.dealPrice, r.dealAmount)
    //     }
    // }
}
