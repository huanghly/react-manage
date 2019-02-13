/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Modal, message, Button, Form, Select, Input, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {
    logList,
} from '../../requests/http-req.js'
import history from '../../history.js'
import {Link} from 'react-router-dom'
import moment from 'moment'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

export default class ErrorLogList extends Component {
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
            name: null,
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()

    }

    getData() {
        this.setState({showLoading: true})
        logList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            type: this.state.type,
            name: 'logBuilder'
        }).then((res) => {
            if (!res.data.data) {
                message.warning('暂无数据')
                this.setState({showLoading: false})
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
        this.ids = []
        e.forEach((item, index) => {
            this.ids.push(this.state.listData[item].id)
        })

    }
    updateStatus = (status) => {
        let formData = new FormData()
        formData.append('status', status)
        formData.append('ids', this.ids)
        //

    }
    showModal = (tag) => {
        if (tag) {
            if (this.selectedRowKeys.length != 1) {
                message.warning('选择一个条目')
                return
            } else {
                this.itemData = this.state.listData[this.selectedRowKeys[0]]
            }
        } else {
            this.selectedRowKeys = []
            this.ids = []
        }
        this.setState({showModal: true})
    }

    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>

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

    setNewVersion = () => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('选择一个操作目标')
            return
        }

        let item = this.state.listData[this.selectedRowKeys[0]]
        if (item.status == 1) {
            message.warning('请先开启此版本')
            return
        }
        let newForm = new FormData()
        newForm.append('name', item.name)
        newForm.append('newestVersion', item.newestVersion)
        newForm.append('type', item.type)
        newForm.append('applicationMarket', item.applicationMarket)

    }

    // postData = (data) => {
    //     if (this.itemData) {
    //     if (this.itemData) {
    //         data.id = this.itemData.id
    //         data.updateTime = moment().format('YYYY-MM-DD h:mm:ss')
    //
    //         versionUpdata(data).then(res => {
    //             if (res.status == 200) {
    //                 message.success('成功')
    //                 this.colseModal()
    //                 this.getData()
    //             }
    //         }).catch(e => {
    //             if (e) {
    //                 message.warning(e.data.message)
    //             }
    //         })
    //     } else {
    //         data.status = 0
    //         saveAppVerison(data).then(res => {


    //             if (res.status == 200) {
    //                 message.success('成功')
    //                 this.colseModal()
    //                 this.getData()
    //             }
    //             this.selectedRowKeys = []
    //             this.ids = []
    //         }).catch(e => {
    //             if (e) {
    //                 message.warning(e.data.message)
    //             }
    //         })
    //     }
    //
    // }

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
                    label="排序"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Select
                        value={this.state.type}
                        placeholder="顺序"
                        onChange={(v) => {
                            this.setState({type: v})
                        }}
                    >
                        <Option key='android' value={0}>升序</Option>
                        <Option key='ios' value={1}>降序</Option>
                    </Select>
                </FormItem>
                {/*<FormItem*/}
                {/*style={{margin: 'auto', flex: 1, paddingRight: '15px'}}*/}
                {/*label="名称"*/}
                {/*//  hasFeedback*/}
                {/*//   validateStatus="warning"*/}
                {/*>*/}
                {/*<Input onChange={(e) => this.setState({name: e.target.value})}/>*/}
                {/*</FormItem>*/}
                <div style={{flex: 3}}/>

                <Button onClick={() => this.getData()} type="primary" icon="search" style={{
                    marginRight: '15px',
                }}>搜索
                </Button>
            </Form>
        )
    }
    colseModal = () => {
        this.selectedRowKeys = []
        this.itemData = null
        this.setState({showModal: false})
    }
    renderModal = () => {
        return (
            <Modal
                maskClosable={false}
                width={600}
                destroyOnClose={true}
                onCancel={this.colseModal}
                title={this.itemData ? '更新app版本信息' : '新建app版本'}
                visible={this.state.showModal}
                onChange={this.colseModal}
                footer={null}
            >
                <div> 9999999</div>
            </Modal>
        )

    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {this.renderSearch()}
                {this.renderModal()}
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
            title: '方法名称',
            dataIndex: 'invokeMethod',
            key: 'invokeMethod',
        }
        ,
        {
            title: '时间',
            dataIndex: 'createTime',
            key: 'createTime',
            render:(r,t)=>{
                return<div>
                    {moment(t).format('YYYY-MM-DD HH:MM:SS')}
                </div>
            }
        }
        ,
        {
            title: '错误信息',
            dataIndex: 'errorMessage',
            key: 'errorMessage',
        },
        {
            title: '参数',
            dataIndex: 'parameter',
            key: 'parameter',
            width: 300
        }
        ,
        {
            title: '方法描述',
            dataIndex: 'methodDesc',
            key: 'methodDesc',
        }
        ,
        {
            title: '端口',
            dataIndex: 'port',
            key: 'port',
        }
    ];

}
