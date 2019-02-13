/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Modal, message, Button, Form, Select, Input, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {
    quanUserList, addQuanUser, quanUpdate
} from '../../requests/http-req.js'
import EditAPI from './EditAPI'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

export default class APIManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
            showModal: false,
            showLoading: false,
            status: null,
        }
    }


    selectedRowKeys = []

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState({showLoading: true})
        quanUserList({
            pageNo: this.state.pageNo,
            pageSize: 10,
        }).then((res) => {

            if (!res.data.data) {
                message.warning('暂无数据')
                this.setState({showLoading: false})
            }
            res.data.data && res.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })

            if (res.status == 200) {
                if (res.data.data.length == 0) {
                    message.warning('没有符合的数据')
                }
                this.setState({
                    listData: res.data.data,
                    pageNo: res.data.data.pages,
                    total: res.data.total,
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
        // announcementUpdate(e).then(res => {
        //     if (res.status == 200) {
        //         message.success('成功')
        //         this.selectedRowKeys = []
        //         this.setState({showModal: false})
        //         this.getData()
        //     } else {
        //         message.warning('失败')
        //     }
        // })
    }
    bannerDel = () => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('选择一个删除的条目')
            return
        }
        let id = this.state.listData[this.selectedRowKeys[0]].id
        // announcementRemove({id: id}).then(res => {
        //     if (res.status == 200) {
        //         message.success('成功')
        //         this.getData()
        //         this.selectedRowKeys = []
        //     } else {
        //
        //         message.warning('失败')
        //         this.selectedRowKeys = []
        //
        //     }
        // })
    }
    createNotice = (e) => {

        e.url = "http://" + e.url
        // announcementSave(e).then(res => {
        //     if (res.status == 200) {
        //         message.success('成功')
        //         this.selectedRowKeys = []
        //         this.setState({showModal: false})
        //         this.getData()
        //     } else {
        //         message.warning('失败')
        //     }
        // })
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
                    {/*<Button onClick={this.bannerDel}*/}
                    {/*style={{marginRight: '5px', marginLeft: '5px'}}>删除</Button>*/}
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

    postData = (data) => {

        if (data.id) {
            quanUpdate(data).then(res => {
                if (res.status == 200) {
                    message.success('修改成功')
                    this.getData()
                }
                this.setState({
                    showModal: false
                })
                this.selectedRowKeys = []
            }).catch(e => {
                if (e) {
                    message.error(e.data.message)
                    this.setState({
                        showModal: false
                    })
                    this.selectedRowKeys = []
                }
            })
        } else {
            addQuanUser(data).then(res => {
                if (res.status == 200) {
                    message.success('添加成功')
                    this.getData()
                }
                this.setState({
                    showModal: false
                })
                this.selectedRowKeys = []
            }).catch(e => {
                if (e) {
                    message.error(e.data.message)
                    this.setState({
                        showModal: false
                    })
                    this.selectedRowKeys = []
                }
            })
        }

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
                <EditAPI postData={this.postData}
                         itemData={this.selectedRowKeys.length == 1 ? this.state.listData[this.selectedRowKeys[0]] : null}/>
            </Modal>
        )

    }
    //  https://lltalk-bucket.oss-cn-hangzhou.aliyuncs.com/img/2960-1440-3.jpg?Expires=1531726736&OSSAccessKeyId=TMP.AQH9YcG-UN3vxKojrgqWgKrTOu6zANxi4Cpp90l7lYvcxHUnTPTYGNNTnDWmADAtAhQDb6-iBMxYP9Q77_64h34USzkRhQIVAJEYnRja8pVuKy_HtIMpeg54tUAU&Signature=nP1gqhFXTV6Xq3UFQlmCBs3706k%3D
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
                    label="选择状态"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Select
                        value={this.state.status}
                        placeholder="状态"
                        onChange={(v) => {
                            this.setState({status: v})
                        }}
                    >
                        <Option key={1232} value={null}>全部</Option>
                        <Option key='android' value={0}>隐藏</Option>
                        <Option key='ios' value={1}>显示</Option>
                    </Select>
                </FormItem>

                <div style={{flex: 2}}/>

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
                {/*{this.renderSearch()}*/}
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
            title: 'KEY',
            dataIndex: 'apiKey',
            key: 'apiKey',
        }
        ,
        {
            title: '密钥',
            dataIndex: 'apiSecretKey',
            key: 'apiSecretKey',
        }
        ,
        {
            title: '量化ID',
            dataIndex: 'id',
            key: 'id',
        }
        ,
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: (text, constructor) => {
                return <div>{text == 0 ? '启用' : '停用'}</div>
            }
        }
        ,
        {
            title: 'IP',
            dataIndex: 'ip',
            key: 'ip',
        }
        ,
        {
            title: '用户ID',
            dataIndex: 'userId',
            key: 'userId',
        }
    ];

}
