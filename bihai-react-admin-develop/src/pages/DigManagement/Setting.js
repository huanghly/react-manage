/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Modal, message, Button, Form, Select, Input, Radio, DatePicker, Upload, Table} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {
    findDisplay, saveDisplay, updateDisplay
} from '../../requests/http-req.js'
import history from '../../history.js'
import {Link} from 'react-router-dom'
import moment from 'moment'
import SettingEdit from './SettingEdit'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

export default class Setting extends Component {
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
            date: moment().format(),
            time: '00',
            fileList: []
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState({showLoading: true})
        findDisplay().then((res) => {
            console.log(res)
            if (!res.data.data) {
                message.warning('暂无数据')
            }

            if (res.status == 200) {
                let arr = []
                arr.push(res.data.data)

                this.setState({
                    listData: arr,
                    // total: res.data.total,
                })
            }
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                this.setState({showLoading: false})
                // message.error(e.data.message)
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

    showModal = (tag) => {

    }
    addItem = () => {
        //添加
        this.setState({
            showModal: true
        })

    }

    renderUserList = () => {

        return (
            <Spin spinning={this.state.showLoading}>

                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <div className='row-user'>
                        {
                            this.state.listData.length == 0 ?
                                <Button onClick={this.addItem}
                                        style={{marginRight: '5px', marginLeft: '5px'}}>增加</Button>
                                : null
                        }
                    </div>
                    <Table pagination={false} columns={this.columns} dataSource={this.state.listData}/>
                </div>
            </Spin>
        )
    }


    colseModal = () => {
        this.selectedRowKeys = []
        this.itemData = null
        this.setState({showModal: false})
    }
    postData = (e) => {
        if (this.state.listData.length == 0) {
            saveDisplay(e).then(res => {
                message.success('新建成功')
                this.colseModal()
                this.getData()
            }).catch(e => {
                message.error(e.data.message)
            })
        } else {
            e.id = this.state.listData[0].id
            updateDisplay(e).then(res => {
                message.success('更新成功')
                this.colseModal()
                this.getData()
            }).catch(e => {
                message.error(e.data.message)
            })
        }

    }
    renderModal = () => {
        return (
            <Modal
                maskClosable={false}
                width={600}
                destroyOnClose={true}
                onCancel={this.colseModal}
                title={this.state.listData.length == 0 ? "新建" : "更新"}
                visible={this.state.showModal}
                //  style={{display: 'flex', alignItems: 'center', justifyContent: 'center',width:800}}
                onChange={this.colseModal}
                footer={null}
            >
                <SettingEdit postData={this.postData}
                             itemData={this.state.listData.length == 0 ? null : this.state.listData[0]}/>
            </Modal>
        )
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {this.renderModal()}
                {this.renderUserList()}
            </div>
        )
    }

    columns = [

        {
            title: 'TMT流通总量',
            key: 'totalAmount',
            dataIndex: 'totalAmount',
        }
        ,
        {
            title: 'TMT二级市场流通量',
            key: 'totalAmountSecond',
            dataIndex: 'totalAmountSecond',
        },
        {
            title: '每百万TMT日分红折合USDT',
            key: 'bonusDayUsdt',
            dataIndex: 'bonusDayUsdt',
        },
        {
            title: 'TMT日分红率(比率)',
            key: 'bonusRate',
            dataIndex: 'bonusRate',
        },
        {
            title: '挖矿释放TMT文字',
            key: 'miningTmt',
            dataIndex: 'miningTmt',
        },
        {
            title: '挖矿释放TMT数字',
            key: 'miningTmtAmount',
            dataIndex: 'miningTmtAmount',
        },
        {
            title: '创建时间',
            key: 'createTime',
            dataIndex: 'createTime',
            render: (t, r) => {
                return <div>{moment(t).format('YYYY-MM-DD HH:MM:SS')}</div>
            }
        },
        {
            title: '更新时间',
            key: 'updateTime',
            dataIndex: 'updateTime',
            render: (t, r) => {
                return <div>{moment(t).format('YYYY-MM-DD HH:MM:SS')}</div>
            }
        }
        ,


        {
            title: '操作',
            dataIndex: 'operation',
            key: 'operation',
            fixed: 'right',
            width: 70,
            render: (text, record) => (
                <a onClick={() => {
                    this.setState({showModal: true})
                }}>修改</a>
            )
        }
    ];

}
