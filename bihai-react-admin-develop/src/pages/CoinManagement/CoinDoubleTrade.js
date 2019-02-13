/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Modal, message, Button, Form, Select, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {tradeInfoList, getCodeType, tradeInfoupdateStatus, updateRecommend} from '../../requests/http-req.js'
import history from '../../history.js'
import {Link} from 'react-router-dom'
import Number from '../../utils/Number.js'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

export default class CoinDoubleTrade extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
            codeType: [],
            showModal: false,
            showLoading: false,
            keyWords: null
        }
    }

    selectedRowKeys = []

    componentDidMount() {

        this.getData()
        getCodeType().then(((req) => {
            this.setState({
                codeType: req.data.data
            })
        }))
    }

    getData() {
        this.setState({showLoading: true})
        tradeInfoList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            keyWords: this.state.keyWords
        }).then((req) => {
            if (!req.data.data) {
                message.warning('暂无数据')
                this.setState({showLoading: false})
            }
            req.data.data && req.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })

            if (req.status == 200) {
                if (req.data.length == 0) {
                    message.warning('没有符合的数据')
                }
                this.setState({
                    listData: req.data.data,
                    total: req.data.total,
                }, () => {
                    //console.log(this.state.listData)
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
    onSelectedRowKeys = (e) => {
        this.selectedRowKeys = e
    }

    changeStatus = (tag) => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('选择一个！')
            return
        }
        let selectItem = this.state.listData[this.selectedRowKeys[0]]
        if (selectItem.tradeStatus == tag) {
            message.warning('已经是修改状态')
            return
        } else {
            tradeInfoupdateStatus(selectItem.id, tag).then(req => {
                if (req.status == 200) {
                    message.success('已修改~')
                    this.selectedRowKeys = []
                    this.getData()
                }
                //console.log(req)
            })
        }
    }

    updateRecommendState = (tag) => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('选择一个！')
            return
        }

        let selectItem = this.state.listData[this.selectedRowKeys[0]]

        if (selectItem.recommend == tag) {
            message.warning('已经是修改状态')
            return
        } else {
            updateRecommend({recommend: tag, id: selectItem.id}).then(req => {
                if (req.status == 200) {
                    message.success('已修改~')
                    this.selectedRowKeys = []
                    this.getData()
                }
                //console.log(req)
            })
        }
    }

    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={() => {
                        history.push('/index/ContentManagement/CoinDoubleTradeDetail')
                    }}
                            style={{marginRight: '5px', marginLeft: '5px'}}>添加</Button>
                    <Button onClick={() => this.changeStatus(0)}
                            style={{marginRight: '5px', marginLeft: '5px'}}>启动</Button>
                    <Button onClick={() => this.changeStatus(1)}
                            style={{marginRight: '5px', marginLeft: '5px'}}>禁用</Button>
                    <Button onClick={() => this.updateRecommendState(1)}
                        //0 否 1 是
                            style={{marginRight: '5px', marginLeft: '5px'}}>推荐</Button>
                    <Button onClick={() => this.updateRecommendState(0)}
                            style={{marginRight: '5px', marginLeft: '5px'}}>取消推荐</Button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={this.columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onSelectedRowKeys={this.onSelectedRowKeys}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }

    postData = () => {

    }
    renderSearch = () => {
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    paddingLeft: '20px',
                    display: 'flex',
                    height: '60px',
                    minHeight: '60px',
                    width: '100%',
                    alignItems: 'center'
                }}
                className="ant-advanced-search-form"
            >
                <FormItem
                    style={{margin: 'auto', flex: 1, paddingRight: '15px'}}
                    label="选择币种"

                >
                    <Select
                        value={this.state.keyWords}
                        placeholder="选择币种"
                        onChange={(v) => {
                            this.setState({keyWords: v})
                        }}
                    >
                        <Option key={1232} value={null}>全部</Option>
                        {
                            this.state.codeType && this.state.codeType.map((item, index) => {
                                return <Option key={item + index} value={item}>{item}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                <div style={{flex: 3}}/>
                <Button onClick={() => this.getData()} type="primary" icon="search" style={{
                    marginRight: '15px',
                }}>搜索
                </Button>
            </Form>
        )
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {this.renderSearch()}
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
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }
        ,
        {
            title: '币对',
            dataIndex: 'tradeCode',
            render: (text, r) => {
                return <div>{text.toUpperCase()}</div>
            }
        }
        ,
        {
            title: '排序',
            dataIndex: 'sort',
            key: 'sort',
        }
        ,
        {
            title: '状态',
            dataIndex: 'tradeStatus',
            key: 'tradeStatus',
            render: (text, constructor) => {
//0 启用 1 禁用
                return <div>{text == 0 ? '启动' : '禁用'}</div>
            }
        }
        ,
        {
            title: '推荐',
            dataIndex: 'recommend',
            key: 'recommend',//0 否 1 是
            render: (text, constructor) => {
                return <div>{text == 0 ? '否' : '是'}</div>

            }
        },
        {
            title: '委托单最小量',
            dataIndex: 'minQty',
            key: 'minQty',
        },
        {
            title: '委托单最大量',
            dataIndex: 'maxQty',
            key: 'maxQty',
        },
        {
            title: '委托单最低价',
            dataIndex: 'minPrice',
            key: 'minPrice',
        },
        {
            title: '委托单最高价',
            dataIndex: 'maxPrice',
            key: 'maxPrice',
        },
        {
            title: '委托单最小额', //最低价*最小量
            key: 'entrustMinAmount',
            dataIndex: 'entrustMinAmount',
            render: (text, record) => {

                return (
                    <div>{Number.scientificToNumber(text)}</div>
                )
            }
        },
        {
            title: '委托单最大额',
            dataIndex: 'entrustMaxAmount',
            key: 'entrustMaxAmount',
            render: (text, record) => {
                return (
                    <div>{Number.scientificToNumber(text)}</div>
                )
            },
        }
        // ,
        // {
        //     title: '杠杆倍数',
        //     render: (text, record) => {
        //         return (
        //             <div>{text.leverageTimes == '' ? '不支持' : text.leverageTimes}</div>
        //         )
        //     },
        //     key: 'up2dateTime',
        // }
        ,
        {
            title: '数量步长',
            dataIndex: 'stepSize',
            key: 'stepSize',
        },
        {
            title: '小数位数',
            dataIndex: 'decimalPlaces',
            key: 'decimalPlaces',
        },
        {
            title: '涨幅',
            dataIndex: 'increase',
            key: 'increase',
        },
        // ,
        // {
        //     title: '止盈',
        //     dataIndex: 'stopProfit',
        //     key: 'stopProfit',
        // },
        // {
        //     title: '止损',
        //     dataIndex: 'marketLock',
        //     key: 'marketLock',
        // }
        ,
        {
            title: '市价开关',
            dataIndex: 'marketLock',
            key: 'marketLock',
            render: (text, r) => {
                return <div>{text == 0 ? '开启' : '关闭'}</div>
            }
        },
        {
            title: '限价开关',
            dataIndex: 'limitLock',
            key: 'limitLock',
            render: (text, r) => {
                return <div>{text == 0 ? '开启' : '关闭'}</div>
            }
        },
        {
            title: '交易开关',
            dataIndex: 'conventionLock',
            key: 'conventionLock',
            render: (text, r) => {
                return <div>{text == 0 ? '开启' : '关闭'}</div>
            }
        },
        {
            title: '杠杆开关',
            dataIndex: 'leverageLock',
            key: 'leverageLock',
            render: (text, r) => {
                return <div>{text == 0 ? '开启' : '关闭'}</div>
            }
        },

        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right',
            width: 100,
            render: (text, record) => (
                <Link to={{pathname: '/index/ContentManagement/CoinDoubleTradeDetail', state: {data: record}}}>详情</Link>
            )
        }
    ];

}
