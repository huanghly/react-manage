/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/14
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message, Modal} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import LeveragePositionListSearch from '../../components/SearchView/LeveragePositionListSearch.js'
import {leverageTradeHisList} from '../../requests/http-req.js'
import {HisState} from '../../networking/ConfigNet.js'
import Number from '../../utils/Number.js'
import NumberP from '../../utils/numberPortal.js'
import DetailsTable from './DetailsTable.js'

var {MonthPicker, RangePicker} = DatePicker;

export default class LeverageTradeHisList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            data: [],
            showModal: false
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
    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView minWidth={2650} columns={this.columns} data={this.state.data} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }

    handleSearch = (values, id) => {
        //console.log(values)
        this.state.pageNo = 0

        let beginTime = values.date && values.date[0] ? JSON.stringify(values.date[0]).slice(1, 11).replace(/-/g, '/') : null
        let endTime = values.date && values.date[1] ? JSON.stringify(values.date[1]).slice(1, 11).replace(/-/g, '/') : null

        values.beginTime = beginTime
        values.endTime = endTime
        values.userId = id
        this.searchData = values
        //console.log(values)
        this.getData()
    }

    getData() {
        this.setState({showLoading: true})

        leverageTradeHisList({
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
            key: 'index',
            fixed: 'left',
            dataIndex: 'index',
        }
        ,
        {
            title: '币对',
            dataIndex: 'coinCode',
            key: 'coinCode',
            render: (text, r) => {
                return <div>{text && text.toUpperCase()}</div>
            }
        },
        {
            title: '开仓单号',
            dataIndex: 'orderNo',
            key: 'orderNo',
            render: (t, r) => {
                return <div>{t ? t : '—'}</div>
            }

        },
        // {
        //     title: '类型',
        //     dataIndex: 'tradeType',
        //     render: (text, r) => {
        //         return <div>{text == 1 ? '限价' : '市价'}</div>
        //     }
        // }
        // ,
        {
            title: '开仓方向',
            dataIndex: 'position',
            key: 'position',
            render: (text, r) => {
                return <div>{r.tradeType == 1 ? '限价' : '市价'}{r.position == 0 ? '买入' : '卖出'}</div>
            }
        }
        ,
        {
            title: '状态',
            dataIndex: 'orderStatus',
            key: 'orderStatus',
            render: (text, r) => {
                console.log(HisState)
                return <div>{HisState[r.orderStatus] ? HisState[r.orderStatus] : '—'}</div>
            }
        }
        ,
        {
            title: '开仓均价',
            dataIndex: 'openDealPrice',
            key: 'openDealPrice',
            render: (t, r) => {
                return <div>{t ? Number.scientificToNumber(t) : '—'}{t ? '(' + r.sourceCoin + ')' : ''}</div>
            }
        },
        {
            title: '开仓数量', //
            dataIndex: 'dealAmount',
            key: 'dealAmount',
            render: (t, record) => {
                return <div>{record.tradeType === 0 && record.position === 0 ? record.dealAmount / record.openDealPrice : record.dealAmount}
                    ({record.targetCoin})</div>
            }

        },
        {
            title: '开仓总额', //
            key: 'aaum',
            render: (t, record) => {
                return <div>{Number.scientificToNumber(record.tradeType === 0 && record.position === 0 ? record.dealAmount : record.dealAmount * record.openDealPrice)}
                    ({record.sourceCoin})</div>

            }
        },
        {
            title: '开仓时间',
            key: 'dealTime',
            dataIndex: 'dealTime',
            render: (t, r) => {
                return <div>{t ? t : '—'}</div>
            }

        },
        // {
        //     title: '保证金',
        //     dataIndex: 'deposit',
        //     key: 'deposit',
        //     render: (text, r) => {
        //         return <div>{Number.scientificToNumber(text)}</div>
        //     }
        // }
        // ,
        {
            title: '开仓手续费',
            dataIndex: 'openPoundageAmount',
            key: 'openPoundageAmount2',
            render: (text, r) => {
                return <div>{text && Number.scientificToNumber(text)}( {r.targetCoin})</div>
            }
        },
        {
            title: '止盈',
            dataIndex: 'stopProfit',
            key: 'stopProfit2',
            render: (t, r) => {
                return <div>{t ? Number.scientificToNumber(t) : '—'}</div>
            }
        }
        ,
        {
            title: '止损',
            dataIndex: 'stopLoss',
            key: 'stopLoss1',
            render: (t, r) => {
                return <div>{t ? t : '—'}</div>
            }
        },
        {
            title: '平仓方向',
            key: '平仓方向',
            render: (t, r) => {
                return <div>{r.position == 1 ? '市价买' : '市价卖'}</div>
            }
        }
        ,
        {
            title: '平仓均价',
            dataIndex: 'closeDealPrice',
            key: 'closeDealPrice11',
            render: (t, r) => {
                return <div>{r.closeDealPrice} ({r.sourceCoin})</div>

            }

        }, {
            title: '平仓手续费',
            dataIndex: 'closePoundageAmount',
            key: 'closePoundageAmount22',
            render: (t, r) => {
                return <div>{t ? r.closePoundageAmount : ""}({r.position === 0 ? r.sourceCoin : r.targetCoin})</div>
            }
        },
        {
            title: `平仓数量`, dataIndex: 'closeOutAmount', key: 'closeOutAmount',
            render: (text, record, index) => {

                return {
                    children: <span>
                                {
                                    record.tradeType === 0 ?
                                        record.position === 0 ?
                                            record.openDealPrice ? NumberP.precisionNoFixed(record.dealAmount / record.openDealPrice - record.openPoundageAmount, 8) : '0' :
                                            NumberP.precisionNoFixed((record.dealAmount * record.openDealPrice - record.openPoundageAmount) / record.closeDealPrice, 8) :
                                        record.position === 0 ?
                                            NumberP.precisionNoFixed(record.dealAmount - record.openPoundageAmount, 8) : // 限价买入平仓量
                                            record.closeDealPrice ? NumberP.precisionNoFixed((record.dealAmount * record.openDealPrice - record.openPoundageAmount) / record.closeDealPrice, 8) : '0' // 限价卖出平仓量
                                }

                        ( {record.targetCoin})
                              </span>,
                }

            }
        },
        {
            title: '平仓总额',
            key: 'sum',
            render: (text, record, index) => {

                return {
                    children: <span>
                      {
                          record.position === 0 ?
                              Number.scientificToNumber(((record.tradeType === 0 && record.position === 0 ? record.dealAmount / record.openDealPrice : record.dealAmount) - record.openPoundageAmount) * record.closeDealPrice, 8) :
                              Number.scientificToNumber((record.dealAmount * record.openDealPrice - record.openPoundageAmount), 8)
                      }

                        ({record.sourceCoin})
                    </span>,
                }
            }
            // render: (text, r) => <div>{this.getCloseSumAmount(r)}</div>
            // render: (text, r) => <div>{Number.scientificToNumber(r.dealPrice * r.dealAmount)}</div>
        }
        ,
        {
            title: '平仓时间',
            dataIndex: 'updateTime',
            key: 'updateTime1',
            render: (t, r) => {
                return <div>{t ? t : '—'}</div>
            }
        }
        ,
        {
            title: '委托价格',
            dataIndex: 'tradePrice',
            key: 'tradePrice',
            render: (t, r) => {
                console.log(r)
                let coin = r.tradeType === 0 ? '' : r.position === 0 ? r.targetCoin : r.sourceCoin
                if (r.tradeType == 0 && r.position == 0) {
                    return <div>—</div>
                } else {
                    return <div>{t}{t ? '' : '(' + coin + ')'}</div>
                    // return <div>{t}({r.tradeType === 0 ? '' : r.position === 0 ? r.targetCoin : r.sourceCoin})</div>

                }
            }
        },
        {
            title: '委托量', //
            dataIndex: 'tradeAmount',
            key: 'tradeAmoun2t',//如果是市家买 就是交易量
            render: (text, record) => {
                return ( <span>{text} ({record.targetCoin})</span> )
            }
        },
        {
            title: '委托总额', //价格*数量
            key: 'bwithdra3wCash',
            render: (text, record) => {
                return ( <span>{
                    record.tradeType === 0 ?
                        '—' :
                        record.position === 0 ?
                            Number.scientificToNumber(record.tradePrice * record.tradeAmount) :
                            Number.scientificToNumber(record.tradePrice * record.tradeAmount)}

                    {record.tradeType === 0 ? '' : `(${record.sourceCoin})`}
                    </span> )
            }
            //     (t, r) => {
            //     if (r.tradeType == 0 && r.position == 0) {
            //         return <div>{r.dealAmount}</div>
            //     } else {
            //         return 33
            //         return <div>{NumberP.precisionNoFixed(Number.mul(r.tradeAmount, r.tradePrice), 8)}</div>
            //
            //     }
            // }
        }, {
            title: '委托时间',
            dataIndex: 'createTime',
            key: 'createTim3e',
            render: (t, r) => {
                return <div>{t ? t : '—'}</div>
            }
        }, {
            title: '盈亏',
            dataIndex: 'breakeven',
            key: 'break2even',
            render: (t, r) => {

                // let tem = t
                // if (t) {
                //
                //     let arr = tem.split('.')
                //     if (arr[1].length > 9) {
                //         tem = arr[0] + arr[1].slice(0, 8)
                //     }
                // }else {
                //     tem='-'
                // }
                //{record.breakeven ? number.precisionNoFixed(record.breakeven, 6) : '--'}
                return <div>{r.breakeven ? Number.scientificToNumber(r.breakeven) : '--'}({r.breakeven ? r.position === 0 ? r.sourceCoin : r.targetCoin : ''})</div>
            }
        }


        // {
        //     title: '操作',
        //     fixed: 'right',
        //     width: 50,
        //     dataIndex: 'createTime',
        //     key: 'createTime',
        //     render: (text, r) =>{
        //         return <a onClick={() => this.showDetail(r)}>详情</a>
        //     }
        // },

    ];
    // 开仓量
    getDealAmount = (record) => {
        return <div>{record.tradeType === 0 && record.position === 0 ? record.dealAmount / record.openDealPrice : record.dealAmount}
            ({record.targetCoin})</div>
    }
    //开仓总额
    getTtradeSum = (r) => {
        // <span>{record.tradeType===0 && record.position===0 ? record.dealAmount : record.dealAmount * record.openDealPrice} {record.sourceCoin}
        //除了市价买入
        return
        // if (r.tradeType == 0 && r.position == 0) {
        //     return r.dealAmount
        // } else {
        //     return Number.mul(r.openDealPrice, r.dealAmount)
        // }
    }
    //平仓量
    getCloseAmount = (text, record, index) => {

        if (index % 2 !== 0) {
            return {
                children: <span></span>,
                props: {colSpan: 0},
            }
        } else {
            return {
                children: <span>
                                {
                                    record.tradeType === 0 ?
                                        record.position === 0 ?
                                            Number.scientificToNumber(record.dealAmount / record.openDealPrice - record.openPoundageAmount, 8) :
                                            Number.scientificToNumber((record.dealAmount * record.openDealPrice - record.openPoundageAmount) / record.closeDealPrice, 8) :
                                        record.position === 0 ?
                                            Number.scientificToNumber(record.dealAmount - record.openPoundageAmount, 8) : // 限价买入平仓量
                                            Number.scientificToNumber((record.dealAmount * record.openDealPrice - record.openPoundageAmount) / record.closeDealPrice, 8) // 限价卖出平仓量
                                }

                    {record.targetCoin}
                              </span>,
            }

        }
        // if (r.position == 1) { //卖
        //     //平仓总额/平仓均价
        //     return Number.div(this.getCloseSumAmount(r), r.closeDealPrice)
        // } else {//买
        //     //
        //     // 开仓总量-开仓续费
        //     return Number.sub(this.getTtradeSum(r), r.openPoundageAmount)
        // }
    }
//     //平仓总额
//     getCloseSumAmount = (r) => {
//         if (r.position == 1) { //卖
// //==开仓总额-开仓手续费
//             // return Number.sub(this.getTtradeSum(r), r.openPoundageAmount)
//             return 1
//         } else {//买
//             //平仓量*均价
//             return 1
//             // return Number.mul(this.getCloseAmount(r), r.closeDealPrice)
//         }
//
//     }
}
