/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Modal, message, Button, Form, Select, Input, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {coinOtcList, getCodeType, coinOtcSave, otcUpdate} from '../../requests/http-req.js'
import OtcCoinEdit from './OtcCoinEdit'
import Number from '../../utils/Number.js'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

export default class OtcCoinTrade extends Component {
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
            type: null,
            bannerName: null,
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()
        getCodeType().then(((res) => {
            this.setState({
                codeType: res.data.data
            })
        })).catch(e => {
            if (e) {
                message.warning(e.data.message)
            }
        })
    }

    getData() {
        this.setState({showLoading: true})
        coinOtcList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            coinCode: this.state.type
        }).then((res) => {
            this.setState({showLoading: false})
            if (!res.data.data) {
                message.warning('暂无数据')
            }
            res.data.data && res.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })

            if (res.status == 200) {
                if (res.data.length == 0) {
                    message.warning('没有符合的数据')
                }
                this.setState({
                    listData: res.data.data,
                    total: res.data.total,
                })
            }
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                this.setState({showLoading: false})

                message.warning(e.data.message)
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
    onSelectedRowKeys = (e) => {
        this.selectedRowKeys = e
    }

    onUpdata = () => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('选择一个条目')
            return
        } else {
            this.setState({
                showModal: true
            })
        }

    }
    updateStatus = (e) => {
        otcUpdate(e).then(res => {
            if (res.status == 200) {
                message.success('成功')
                this.selectedRowKeys = []
                this.setState({showModal: false})
                this.getData()
            } else {
                message.warning('失败')
            }
        })
    }

    onSave = (e, img) => {
        coinOtcSave(e).then(res => {
            if (res.status == 200) {
                message.success('成功')
                this.selectedRowKeys = []
                this.setState({showModal: false})
                this.getData()
            } else {
                message.warning('失败')
            }
        }).catch(e => {
            if (e) {
                message.warning(e.data.message)

            }
        })
        //console.log(img)
    }

    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={() => {
                        this.selectedRowKeys = []
                        this.setState({showModal: true})
                    }}
                            style={{marginRight: '5px', marginLeft: '5px'}}>添加</Button>
                    <Button onClick={this.onUpdata}
                            style={{marginRight: '5px', marginLeft: '5px'}}>修改</Button>

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


    renderModal = () => {
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={() => this.setState({showModal: false})}
                title={this.selectedRowKeys.length == 1 ? "更新" : '新建'}
                visible={this.state.showModal}
                onChange={() => {
                    this.setState({showModal: false})
                }}
                footer={null}
            >
                <OtcCoinEdit codeType={this.state.codeType} onSave={this.onSave} upData={this.updateStatus}
                             itemData={this.selectedRowKeys.length == 1 ? this.state.listData[this.selectedRowKeys[0]] : null}/>
            </Modal>
        )
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
                    label="币种选择"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Select
                        value={this.state.type}
                        placeholder="币种选择"
                        onChange={(v) => {
                            this.setState({type: v})
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
                {this.renderModal()}
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
            title: '排序',
            dataIndex: 'sortNo',
            key: 'sortNo',
        }
        ,
        {
            title: '币种',
            dataIndex: 'coinCode',
            key: 'coinCode',
        }
        ,
        {
            title: '交易状态',
            dataIndex: 'tradeStatus',
            key: 'tradeStatus',
            render: (text, r) => {
                return <div>{text == 1 ? '启动' : '停用'}</div>
            }
        }
        ,
        {
            title: '广告呈现最低量',
            dataIndex: 'advertMin',
            key: 'advertMin',
        }
        ,
        {
            title: '最低交易金额',
            dataIndex: 'tradeMin',
            key: 'tradeMin',
            render: (text, r) => <div>{Number.scientificToNumber(text)}</div>

        }
        ,
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',

        }
    ];
}


