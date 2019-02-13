/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, message, Button} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import AdvertisingSearch from '../../components/SearchView/AdvertisingSearch.js'
import {advertisingUp, advertisingPages, advertisingDown, advertisingPagesExcel} from '../../requests/http-req.js'
import ConfigNet from '../../networking/ConfigNet'
import {
    Link
} from 'react-router-dom'
import moment from 'moment'

export default class AdvertisingPages extends Component {
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
            status: values.status,
            beginTime: beginTime,
            endTime: endTime
        }
        //console.log(tem)
        this.getData(tem)
    }

    getData(data) {
        let temArr = {
            page: this.state.pageNo || 0,
            size: 10,
            number: data && data.number,//广告号
            userId: data && data.userId || null,//广告状态（0下架，1上架）
            type: data && data.type || null,//广告类型（0购买，1出售）
            moneyType: data && data.moneyType || null,
            status: data && data.status || null,//广告状态（0下架，1上架）
        }
        //console.log(temArr)
        if (data && data.beginTime) {
            temArr.beginTime = data.beginTime
        }
        if (data && data.endTime) {
            temArr.endTime = data.endTime
        }
        //console.log(temArr)

        this.setState({showLoading: true})
        advertisingPages(temArr).then((req) => {
            if (!req.data.data) {
                message.warning('没有符合的数据')
                return
            }
            req.data.data && req.data.data.forEach((item, index) => {
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

    advertisingPagesExcel(data) {

        if (!this.state.listData || this.state.listData.length == 0) {
            message.warning('没有数据')
            return
        }
        let temArr = {
            page:  0,
            size: 0,
            number: data && data.number,//广告号
            userId: data && data.userId || null,//广告状态（0下架，1上架）
            type: data && data.type || null,//广告类型（0购买，1出售）
            moneyType: data && data.moneyType || null,
            status: data && data.status || null,//广告状态（0下架，1上架）
        }
        //console.log(temArr)
        if (data && data.beginTime) {
            temArr.beginTime = data.beginTime
        }
        if (data && data.endTime) {
            temArr.endTime = data.endTime
        }
        //console.log(temArr)

        this.setState({showLoading: true})
        advertisingPagesExcel(temArr).then(result => {
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
                            onClick={() => this.advertisingPagesExcel()}>导出</Button>


                    <TableView columns={this.columns} data={this.state.listData} total={this.state.total}
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
                <AdvertisingSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }

    columns = [
        {
            width: 70,
            title: '序号',
            dataIndex: 'index',
        }
        ,
        {
            title: '广告编号',
            dataIndex: 'number',
            key: 'number',
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
            title: '姓名',
            dataIndex: 'userName',
        }
        ,
        {
            title: '手机号',
            dataIndex: 'userPhone',
            key: 'userPhone',
        }
        ,
        {
            title: '邮箱',
            dataIndex: 'email',
            key: 'email',
        }
        ,
        {
            title: '地区',
            dataIndex: 'address',
        },
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
            title: '收付方式',
            dataIndex: 'paymentMethod',
            render: (text, record) => (<div>{text == 1 ? '支付宝' : '银联'}</div>)
        }
        ,
        {
            title: '溢价',
            dataIndex: 'premium',
            key: 'premium',
        },
        {
            title: '价格',
            key: 'price',
            dataIndex: 'price',
        },
        {
            title: '最低出售',
            key: 'lowestPrice',
            dataIndex: 'lowestPrice',
        },

        {
            title: '最小量',
            key: 'limitLowerMoney',
            dataIndex: 'limitLowerMoney',
        },
        {
            title: '最大量',
            key: 'limitUpperMoney',
            dataIndex: 'limitUpperMoney',
        },
        {
            title: '发布时间',
            key: 'createdAt',
            dataIndex: 'createdAt',
        },
        {
            title: '状态',
            key: 'status',
            dataIndex: 'status',
            render: (text, record) => (<div>{text == 1 ? '上架' : '下架'}</div>)

        },
        {
            title: '操作',
            key: 'createTime3',
            fixed: 'right',
            width: 120,
            // render: (text, record) => (<Link to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
            render: (text, record) => (
                <div style={{flexDirection: 'columns', display: 'flex'}}>
                    <Link style={{marginRight: '10px'}}
                          to={{
                              pathname: '/index/OrderManagement/AdvertisingPagesInfo',
                              state: {data: record}
                          }}>详情</Link>
                    <a onClick={() => this.advertisingState(record)}>{record.status == 1 ? '下架' : '上架'}</a>
                </div>
            )
        }
    ];
    advertisingState = (record) => {
        if (record.status == 1) {
            advertisingDown(record.id).then((req => {
                //console.log(req)
                if (req.status == 200) {
                    message.success('已下架')
                    this.getData()
                } else {
                    message.warning('操作失败')
                }

            })).catch(e => {
                if (e) {
                    message.error(e.data.message)
                }
            })
        } else {
            advertisingUp(record.id).then((req => {
                //console.log(req)
                if (req.status == 200) {
                    message.success('已上架')
                    this.getData()
                } else {
                    message.warning('操作失败')
                }

            })).catch(e => {
                if (e) {
                    message.error(e.data.message)
                }
            })
        }
    }
}
