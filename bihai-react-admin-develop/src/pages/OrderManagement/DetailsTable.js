/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2018/5/14
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, Modal, Table} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import CustomFormView from "../../components/CustomFormView";
import CoinHistorySearch from '../../components/SearchView/CoinHistorySearch.js'
import {tradeEntrustDetailList} from '../../requests/http-req.js'
import {EntrusState} from '../../networking/ConfigNet.js'
import Number from '../../utils/Number'

export default class DetailsTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: []
        }
    }

    componentWillMount() {
        this.item = this.props.item;
    }

    componentDidMount() {
        this.getData()
    }

    onChangePagintion = (e) => {
        this.state.pageNo = e
        this.setState({
            pageNo: e
        }, () => {
            this.getData()
        })
    }


    getData() {
        tradeEntrustDetailList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            orderNo: this.item.orderNo
        }).then((res) => {
            //console.log(res)
            if (res.status == 200) {
                res.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    showLoading: false,
                    total: res.data.total,
                    listData: res.data.data
                }, () => {
                    //console.log(this.state.listData)
                })
            }
        })
    }


    render() {
        return (
            <Table
                size='middle'
                pagination={{
                    pageSize: this.state.pageSize,
                    total: this.state.total,
                    onChange: this.onChangePagintion,
                    current: this.state.pageNo
                }}
                columns={this.columns}
                dataSource={this.state.listData}
            />
        )
    }

    showDetail = (item) => {
        alert(JSON.stringify(item))

    }

    columns = [
        {
            title: '序号',
            fixed: 'left',
            dataIndex: 'index',
        }
        ,
        {
            title: '订单号',
            dataIndex: 'orderNo',
            key: 'orderNo',

        },
        {
            title: '币对',
            key: 'coinCode',
            render: (text, r) => {
                return <div>{this.item.coinCode}</div>
            }
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
                //this.item.position == 1 ? '卖出' : '买入'
                return <div>{this.item.orderNo == r.orderNo ? (this.item.position == 1 ? '卖出' : '买入' ) : (this.item.position == 0 ? '卖出' : '买入' )}</div>
            }
        }
        ,
        {
            title: '成交价',
            dataIndex: 'aboveDealPrice',
            key: 'aboveDealPrice',
            render: (text, r) => {
                return <div>{r.lp == 'combo' ? r.underDealPrice : r.aboveDealPrice}</div>
            }
        },
        {
            title: '成交量',
            dataIndex: 'dealAmount',
            key: 'dealAmount',
        }
        ,
        {
            title: '成交总额', //dealAmount * 成交均价
            key: 'dealPrice',
            dataIndex: 'dealAmount',
            render: (text, r) => {
                // return <div>{r.lp == 'combo'?r.dealAmount * r.underDealPrice:r.dealAmount*r.aboveDealPrice}</div>
                return <div>{Number.mul(r.dealAmount, (r.lp == 'combo' ? r.underDealPrice : r.aboveDealPrice))}</div>
            }
        }
        ,
        {
            title: '成交时间',
            dataIndex: 'dealDateTime',
            key: 'dealDateTime',
        }
    ];
}
