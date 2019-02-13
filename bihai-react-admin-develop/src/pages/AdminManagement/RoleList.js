/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Form, Button, Input, message, Modal, Switch, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {
    roleUpdate,
    resourcesById,
    roleList,
    getByName,
    roleCreate,
    deleteRole,
    roleResourcesAll
} from '../../requests/http-req.js'
import {
    Link
} from 'react-router-dom'

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

export default class RoleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            inputValue: '',
            showModal: false,
            total: 0,
            listData: [],
            editDescribe: null,
            editName: null,
            editState: 1
        }
    }

    editId = null
    onSelectedList = []

    componentDidMount() {
        //提现类型接口
        this.getData()
        this.getResourcesAll()
    }

    getResourcesAll = () => {
        roleResourcesAll().then(res => {
            //console.log(res)
        })
    }
    handleSearch = () => {
        // if (this.state.inputValue == '') {
        //     message.warning('输入角色名称')
        //     return
        // }

        getByName({name: this.state.inputValue.trim()}).then((req) => {
            //console.log(req)
            if (req.status == 200) {
                let tem = []
                req.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                    tem.push(item)
                })
                this.setState({
                    listData: tem,
                    pageNo: 0,
                    total: req.data.total
                }, () => {
                    //console.log(this.state.total)
                })
            }

            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                message.warning(e.data.message)
            }
        })
    }

    getData() {
        let temArr = {
            page: this.state.pageNo || 0,
            size: 10,
            // describe: data && data,
        }
        this.setState({showLoading: true})
        roleList(temArr).then((req) => {
            //console.log(req)
            if (req.status == 200) {
                let tem = []
                req.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                    tem.push(item)
                })
                this.setState({
                    listData: tem,
                    total: req.data.total
                }, () => {
                    //console.log(this.state.total)
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
    closeModal = () => {
        this.setState({editId: null, editDescribe: null, editName: null, showModal: false, editState: 1})
    }
    renderModal = () => {

        return (
            <Modal
                destroyOnClose={true}
                onCancel={this.closeModal}
                title={this.editId ? "修改角色" : "新建角色"}
                visible={this.state.showModal}
                onChange={this.closeModal}
                footer={null}
            >

                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>角色名称：</div>
                    <Input value={this.state.editName} onChange={(e) => {
                        this.setState({editName: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>角色描述：</div>
                    <Input value={this.state.editDescribe} onChange={(e) => {
                        this.setState({editDescribe: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>启动：</div>
                    <RadioGroup onChange={(e) => {
                        this.setState({
                            editState: e.target.value
                        })
                    }} value={this.state.editState}>
                        <Radio value={1}>启动</Radio>
                        <Radio value={0}>禁用</Radio>

                    </RadioGroup>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button style={{width: '100px', marginLeft: '30px'}}
                            onClick={() => this.postData()}>确认</Button>
                </div>
            </Modal>
        )
    }
    postData = () => {
        let formData = {
            name: this.state.editName,
            describe: this.state.editDescribe,
            role: this.state.editName,
            status: this.state.editState
        }
        // var formData = new FormData()
        // formData.append('name', this.state.editName)
        // formData.append('describe', this.state.editDescribe)
        if (this.editId) {
            //修改
            formData.id = this.editId
            roleUpdate(this.editId, formData).then((req) => {
                if (req.status == 200) {
                    message.success('成功')
                } else {
                    message.error('失败')

                }
                //console.log(req)
                this.setState({editId: null, editDescribe: null, editName: null, showModal: false, editState: 1})
                this.getData()
            })
        } else {
            //新建
            roleCreate(formData).then((req) => {
                //console.log(req)
                if (req.status == 200) {
                    message.success('成功')
                } else {
                    message.error('失败')

                }
                this.setState({editId: null, editDescribe: null, editName: null, editState: null, showModal: false})
                this.getData()

            })
        }
    }
    onSelectedRowKeys = (e) => {
        //console.log(e)
        this.onSelectedList = e
    }
    showModal = (e) => {
        //选择更新必须选中
        if (e) {
            if (this.onSelectedList.length == 0 || this.onSelectedList.length > 1) {
                message.warning('选择一个')
                return
            } else {
                let itemData = this.state.listData[this.onSelectedList[0]]
                this.editId = itemData.id
                this.setState({
                    showModal: true,
                    editDescribe: itemData.describe,
                    editName: itemData.name,
                    editState: itemData.status
                })
            }
        } else {
            this.onSelectedList = []
            this.editId = null

            this.setState({
                showModal: true,
            })
        }
    }
    delRole = () => {
        if (this.onSelectedList.length == 0 || this.onSelectedList.length > 1) {
            message.warning('请选择一个')
        } else {
            deleteRole(this.state.listData[this.onSelectedList[0]].id).then(res => {
                message.success('操作成功')
                this.getData()
            }).catch(e => {
                if (e) {
                    message.warning(e.data.message)
                }
            })
        }
    }

    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={() => this.showModal()} style={{marginRight: '5px', marginLeft: '5px'}}>新增</Button>

                    <Button onClick={() => this.showModal('update')}
                            style={{marginRight: '5px', marginLeft: '5px'}}>修改</Button>
                    <Button onClick={this.delRole}
                            style={{marginRight: '5px', marginLeft: '5px'}}>删除</Button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onSelectedRowKeys={this.onSelectedRowKeys}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }
    inputChange = (e) => {
        //console.log(e.target.value)
        let tem = e.target.value.replace(/(^\s*)|(\s*$)/g, "");
        this.setState({
            inputValue: tem
        })
    }
    renderSearch = () => {
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    paddingLeft: '20px',
                    paddingRight: '20px',
                    display: 'flex',
                    height: '60px',
                    width: '100%',
                    alignItems: 'center'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <FormItem
                    style={{margin: 'auto', flex: 1, paddingRight: '15px'}}
                    label="角色名称"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Input onChange={this.inputChange} value={this.state.inputValue} style={{width: '100%'}}/>
                </FormItem>
                <div style={{flex: 3}}/>

                <Button onClick={this.handleSearch} type="primary" icon="search" style={{
                    marginRight: '15px',
                }}>搜索
                </Button>
            </Form>
        )
    }

    render() {
        return (
            <div className='center-user-list'>
                {this.renderModal()}
                <Breadcrumb data={window.location.pathname}/>
                {this.renderSearch()}
                {this.renderUserList()}
            </div>
        )
    }
}
const columns = [
    {
        width: 70,
        title: '序号',
        fixed: 'left',
        dataIndex: 'index',
    },
    {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
    }
    ,
    {
        title: '角色名称',
        dataIndex: 'name',
        key: 'tradePrice',
    },
    {
        title: '描述',
        key: '提现地址',
        dataIndex: 'describe',
    },
    {
        title: "编辑",
        key: '权限',
        render: (text, record) => (
            <Link to={{
                pathname: '/index/AdminManagement/PermissionsEdit',
                state: {data: record, selectStep: 1}
            }}>权限</Link>
        )
    }

];
