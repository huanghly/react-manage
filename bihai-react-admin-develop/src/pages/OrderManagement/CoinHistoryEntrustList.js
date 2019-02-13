/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/14
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, Modal, message} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import CustomFormView from "../../components/CustomFormView";
import CoinHistorySearch from '../../components/SearchView/CoinHistorySearch.js'
import {tradeEntrustHisList} from '../../requests/http-req.js'
import {EntrusState} from '../../networking/ConfigNet.js'
import DetailsTable from './DetailsTable.js'
import Number from '../../utils/Number.js'
import math from 'mathjs'
import {Decimal} from 'decimal.js';

var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null

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

export default class CoinHistoryEntrustList extends Component {
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
                    <TableView minWidth={2000} columns={this.columns} data={this.state.data} total={this.state.total}
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
        values.beginTime = beginTime
        values.endTime = endTime
        values.userId = id
        this.searchData = values
        //console.log(values)
        this.getData()
    }

    getData() {
        tradeEntrustHisList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            orderNo: this.searchData && this.searchData.orderNo && this.searchData.orderNo.trim() || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            position: this.searchData && this.searchData.position || null,
            status: this.searchData && this.searchData.tradeStatus || null,
            beginTime: this.searchData && this.searchData.beginTime || null,
            endTime: this.searchData && this.searchData.endTime || null,

        }).then((res) => {
            //console.log(res)
            if (res.status == 200) {
                res.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    showLoading: false,
                    total: res.data.total,
                    data: res.data.data
                }, () => {
                    //console.log(this.state.data)
                })
            }
        }).catch(e => {
            this.setState({
                showLoading: false,
            })
            if (e) {
                message.warning(e.deta.message)
            }
        })
    }

    close = () => {
        this.setState({
            showModal: false
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
                {this.renderBreadcrumb()}
                <CoinHistorySearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
                {this.renderModal()}
            </div>
        )
    }

    showDetail = (item) => {
        this.item = item
        this.setState({
            showModal: true
        })
    }

    columns = [
        {
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
            key: 'tradeType1',
            render: (text, r) => {
                return <div>{text == 1 ? '限价' : '市价'}</div>
            }
        }
        // ,
        // {
        //     title: '撮合类型',
        //     dataIndex: 'tradeType2',
        //     render: (text, r) => {
        //         //return <div>{text == 1 ? 'Ok' : '火币'}</div>
        //         return <div>{'doing'}</div>
        //     }
        // }
        // ,
        // {
        //     title: '报单通道',
        //     dataIndex: 'tradeType3',
        //     render: (text, r) => {
        //         // return <div>{text == 1 ? '本地' : '上游'}</div>
        //         return <div>{'doing'}</div>
        //     }
        // }
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
        },
        {
            title: '交易手续费',
            dataIndex: 'poundageAmount',
            render: (text, r) => {
                return <div>{Number.scientificToNumber(text)}</div>
            }

        }
        ,
        {
            title: '委托价格',
            dataIndex: 'tradePrice',
            key: 'tradePrice',
            render: (text, r) => {
                //市价不显示
                if (r.tradeType == 0) {
                    return <div>—</div>
                } else {
                    return <div>{text}</div>
                }
            }
        },

        {
            title: '委托量', //
            dataIndex: 'tradeAmount',
            key: 'tradeAmount',
            render: (text, r) => {
                if (r.tradeType == 0) { //市价格
                    if (r.position == 1) {// 卖出
                        return <div>{Number.scientificToNumber(text)}</div>
                    } else {//买入
                        return <div>—</div>
                    }
                } else {
                    return <div>{Number.scientificToNumber(text)}</div>
                }
            }
        },
        {//市家 卖出 -
            title: '委托总额', //价格*数量
            key: 'bwithdrawCash',
            render: (text, r) => {
                if (r.tradeType == 0) { //市价格
                    if (r.position == 1) {// 卖出
                        return <div>—</div>
                    } else {//买入
                        return <div>{Number.scientificToNumber(r.tradeAmount)}</div>
                    }
                } else { //限价格
                    return <div>{Number.scientificToNumber(Number.mul(parseFloat(r.tradeAmount), parseFloat(r.tradePrice)))}</div>
                }
            }
        },

        {
            title: '已成交',
            dataIndex: 'dealAmount',
            key: 'dealAmount',
            render: (text, r) => {
                return <div>{Number.scientificToNumber(text)}</div>
            }
        },
        {
//未成交数量
            title: '未成交',//委托总额 - 以成交
            dataIndex: 'unDealAmount',
            key: 'unDealAmount',
            render: (text, r) => {
                if (r.tradeType == 0) { //市价格
                    if (r.position == 1) {// 卖出 委托量-已成交
                        return <div>{Number.scientificToNumber(r.tradeAmount - r.dealAmount)}</div>
                    } else {//买入  委托总额-已成交
                        return <div>{(r.tradeAmount - r.dealAmount)}</div>
                    }
                } else { //限价格
                    return <div>{Number.scientificToNumber(Number.mul(r.tradeAmount, r.tradePrice) - Number.mul(r.dealAmount, r.tradePrice))}</div>
                }
            }
        }
        ,
        {
            title: '成交均价',
            dataIndex: 'dealPrice',
            key: 'dealPrice',
            render: (text, r) => {
                return <div>{Number.scientificToNumber(text)}</div>
            }
        },
        {
            title: '成交总额', //dealAmount * 成交均价
            dataIndex: 'AllDealAmount',
            key: 'AllDealAmount',
            render: (text, r) => {
                if (r.tradeType == 0) { //市价格
                    if (r.position == 1) {// 卖出
                        return <div>{Number.scientificToNumber(r.tradeAmount)}</div>
                    } else {//买入
                        return <div>{Number.scientificToNumber(r.dealAmount)}</div>
                    }
                } else { //限价格
                    return <div>{Number.scientificToNumber(Number.mul(r.dealPrice, r.dealAmount))}</div>
                }
            }
        }

        ,
        {
            title: '成交时间',
            dataIndex: 'dealTime',
            key: 'dealTime',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '操作',
            fixed: 'right',
            key: 'ww',
            width: 65,
            render: (text, r) => {
                return <a onClick={() => this.showDetail(r)}>详情</a>
            }
        }
    ];
}