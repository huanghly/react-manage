/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Modal, message, Button, Form, Select, Input, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {
    inviteAdd, inviteUpdate, inviteList,
    bannerPages,
    getCodeType,
    saveAppVerison,
    bannerSave,
    bannerDelete,
    bannerUpdata
} from '../../requests/http-req.js'
import InviteEdit from './InviteEdit.js'
//        ,
//          {
//            "title": "邀请管理",
//            "key": "/index/SystemManagement/InviteManagement",
//            "path": "v1/invite/**"
//          }

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

export default class InviteManagement extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
            showModal: false,
            showLoading: false,
            type: null,
            bannerName: null,
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()

    }

    getData() {
        this.setState({showLoading: true})
        inviteList().then((res) => {
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
                    // pageNo: res.data.pages,
                    // total: res.data.total,
                })
            }
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {

                // message.warning(e.data.message)
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

        inviteUpdate(e).then(res => {
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

    createInvite = (e) => {

        inviteAdd(e).then(res => {
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

    postData = (data) => {
        saveAppVerison(data).then(res => {

            if (res.status == 200) {
                message.success('成功')
                this.setState({
                    showModal: false,
                })
            }
            this.selectedRowKeys = []
        })
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
                <InviteEdit onSave={this.createInvite} upData={this.updateStatus}
                            itemData={this.selectedRowKeys.length == 1 ? this.state.listData[this.selectedRowKeys[0]] : null}/>
            </Modal>
        )

    }

    //  https://lltalk-bucket.oss-cn-hangzhou.aliyuncs.com/img/2960-1440-3.jpg?Expires=1531726736&OSSAccessKeyId=TMP.AQH9YcG-UN3vxKojrgqWgKrTOu6zANxi4Cpp90l7lYvcxHUnTPTYGNNTnDWmADAtAhQDb6-iBMxYP9Q77_64h34USzkRhQIVAJEYnRja8pVuKy_HtIMpeg54tUAU&Signature=nP1gqhFXTV6Xq3UFQlmCBs3706k%3D

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
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
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        }
        ,
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',

        }
        ,
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
        }
        ,
        {
            title: '链接地址',
            dataIndex: 'linkUrl',
            key: 'linkUrl',
        }
        ,
        {
            title: 'logo地址',
            dataIndex: 'logo',
            key: 'logo',
        },
        {
            title: '标题',
            dataIndex: 'title',
            key: 'title',
        },
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        }
    ];

}
