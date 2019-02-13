/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, message} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {tradeOrderPage} from '../../requests/http-req.js'
import Number from '../../utils/Number.js'

export default class AdvertisingPagesInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
            itemData: null
        }
    }

    componentWillMount() {
        this.props.location.state.data && this.setState({
            itemData: this.props.location.state.data,
        })
    }

    componentDidMount() {
        this.getData()

    }


    getData() {
        let temArr = {
            page: this.state.pageNo || 0,
            size: 10,
            advertisingId: this.state.itemData.id
        }

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
                    listData: req.data.data
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

    renderItem = () => {
        const itemData = this.state.itemData
        //console.log(itemData)
        return (
            <div>
                <div className='row'>
                    <div className='list-item'>
                        <div className='list-key'>广告编号:</div>
                        <div className='list-value'>{itemData.number}</div>
                    </div>
                    <div className='list-item'>
                        <div className='list-key'>状态:</div>
                        <div className='list-value'>{itemData.type == 1 ? '出售' : '购买'}</div>
                    </div>
                    <div className='list-item'>
                        <div className='list-key'>发布时间:</div>
                        <div className='list-value'>{itemData.createdAt}</div>
                    </div>

                    <div className='list-item'>
                        <div className='list-key'>地区:</div>
                        <div className='list-value'>{itemData.address}</div>
                    </div>
                </div>
                <div className='row'>
                    <div className='list-item'>
                        <div className='list-key'>用户名:</div>
                        <div className='list-value'>{itemData.userName}</div>
                    </div>
                    <div className='list-item'>
                        <div className='list-key'>手机号:</div>
                        <div className='list-value'>{itemData.userPhone}</div>
                    </div>
                    <div className='list-item'>
                        <div className='list-key'>邮箱:</div>
                        <div className='list-value'>{itemData.email}</div>
                    </div>
                    <div className='list-item'>
                        <div className='list-key'>交易币种:</div>
                        <div className='list-value'>{itemData.moneyType}</div>
                    </div>

                </div>
                <div className='row'>
                    <div className='list-item'>
                        <div className='list-key'>最小量:</div>
                        <div className='list-value'>{itemData.limitLowerMoney}</div>
                    </div>
                    <div className='list-item'>
                        <div className='list-key'>最大量:</div>
                        <div className='list-value'>{itemData.limitUpperMoney}</div>
                    </div>
                    <div className='list-item'>
                        <div className='list-key'>结算币种:</div>
                        <div className='list-value'>{itemData.currency}</div>
                    </div>
                    <div className='list-item'>
                        <div className='list-key'>首付款方式:</div>
                        <div className='list-value'>{itemData.paymentMethod == 1 ? '支付宝' : '银联'}</div>
                    </div>
                </div>
                <div className='row'>
                    {itemData.type == 1 ? <div className='list-item'>
                        <div className='list-key'>最低价:</div>
                        <div className='list-value'>{itemData.lowestPrice}</div>
                    </div> : null}


                    <div style={{flex: 3}}></div>
                </div>
            </div>
        )
    }
    renderTable = () => {
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
                {this.renderItem()}
                <h3 style={{marginLeft: '15px'}}>关联订单</h3>
                {this.renderTable()}
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
    }
    ,
    {
        title: '广告状态',
        key: 'status',
        dataIndex: 'status',
        render: (text, record) => (<div>{text == 1 ? '上架' : '下架'}</div>)
    }
    ,
    {
        title: '卖家手机号',
        dataIndex: 'sellPhone',
        key: 'sellName',
    },
    {
        title: '买家手机号',
        dataIndex: 'buyerPhone',
        key: 'buyerName',
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
        key: 'quantity', render: (text, r) => {
        return <div>{Number.scientificToNumber(text)}</div>
    }
    }
    ,
    {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount', render: (text, r) => {
        return <div>{Number.scientificToNumber(text)}</div>
    }
    },
    {
        title: '创建时间',
        dataIndex: 'createdAt',
    }
    ,
    {
        title: '订单状态',
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