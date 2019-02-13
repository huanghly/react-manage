/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Form, Button, Input, message, Modal, Select} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {
    getAdministrators,
    roleAll,
    administratorsAdd,
    updatePwd,
    updateRole,
    administratorsDelete
} from '../../requests/http-req.js'

const Option = Select.Option;

const FormItem = Form.Item;

export default class AdminList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            inputValue: '',
            showPassWordModal: false,
            showRoleModal: false,
            showModal: false,
            total: 0,
            listData: [],
            editDescribe: null,
            editName: null,
            userPhone: null,
            userEmail: null,
            editRole: null,
            password: null,
            passwordA: null,
            roleAll: []
        }
    }

    editId = null
    onSelectedList = []
    selectRoleChange = null

    componentDidMount() {

        this.getData()
        this.getRoleAll()
    }

    getRoleAll = () => {
        roleAll().then(res => {
            if (res.status == 200) {
                this.setState({
                    roleAll: res.data.data
                })
            }
        })
    }
    handleSearch = () => {
        this.state.pageNo = 0
        this.getData()
    }

    getData() {
        let temArr = {
            page: this.state.pageNo || 0,
            size: 10,
            userName: this.state.inputValue.trim(),
        }
        this.setState({showLoading: true})
        getAdministrators(temArr).then((res) => {
            //console.log(res)
            if (res.status == 200) {
                let tem = []
                res.data.data.forEach((item, index) => {
                    item.status == 1 ? item.status = "正常" : item.status = "非正常"
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                    tem.push(item)
                })
                this.setState({
                    listData: tem,
                    total: res.data.total
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
    handleSelectChange = (value) => {
        //console.log(value)
        this.selectRoleChange = value
    }
    renderModal = () => {
        return (
            <Modal
                destroyOnClose={true}
                onCancel={() => this.setState({showModal: false})}
                title={"新建管理员"}
                visible={this.state.showModal}
                onChange={() => {
                    this.setState({showModal: false})
                }}
                footer={null}
            >
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>名称：</div>
                    <Input value={this.state.editName} onChange={(e) => {
                        this.setState({editName: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>密码：</div>
                    <Input value={this.state.password} type={'password'} onChange={(e) => {
                        this.setState({password: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>重复密码：</div>
                    <Input value={this.state.passwordA} type={'password'} onChange={(e) => {
                        this.setState({passwordA: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>手机号：</div>
                    <Input value={this.state.userPhone} onChange={(e) => {
                        this.setState({userPhone: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>邮箱地址：</div>
                    <Input value={this.state.userEmail} onChange={(e) => {
                        this.setState({userEmail: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>选择角色：</div>
                    <Select placeholder="选择角色" onChange={this.handleSelectChange} style={{width: '100%'}}>
                        {
                            this.state.roleAll.map((item, index) => {
                                return <Option key={item.createTime} value={item.id}>{item.name}</Option>
                            })
                        }
                    </Select>
                </div>


                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button style={{width: '100px', marginLeft: '30px'}}
                            onClick={() => this.postData()}>确认</Button>
                </div>
            </Modal>
        )
    }
    renderPasswordModal = () => {
        return (
            <Modal
                destroyOnClose={true}
                onCancel={() => this.setState({showPassWordModal: false})}
                title={"修改密码"}
                visible={this.state.showPassWordModal}
                onChange={() => {
                    this.setState({showPassWordModal: false})
                }}
                footer={null}
            >
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>密码：</div>
                    <Input value={this.state.password} onChange={(e) => {
                        this.setState({password: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>重复密码：</div>
                    <Input value={this.state.passwordA} onChange={(e) => {
                        this.setState({passwordA: e.target.value})
                    }}/>
                </div>

                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button style={{width: '100px', marginLeft: '30px'}}
                            onClick={this.changePassWord}>确认</Button>
                </div>
            </Modal>
        )
    }

    renderoleModal = () => {
        return (
            <Modal
                destroyOnClose={true}
                onCancel={() => this.setState({showRoleModal: false})}
                title={"修改角色"}
                visible={this.state.showRoleModal}
                onChange={() => {
                    this.setState({showRoleModal: false})
                }}
                footer={null}
            >
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>修改角色：</div>
                    <Select placeholder="选择角色" onChange={this.handleSelectChange} style={{width: '100%'}}>
                        {
                            this.state.roleAll.map((item, index) => {
                                return <Option key={index} value={item.id}>{item.name}</Option>
                            })
                        }
                    </Select>
                </div>


                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button style={{width: '100px', marginLeft: '30px'}}
                            onClick={this.changeRole}>确认</Button>
                </div>
            </Modal>
        )
    }
    //修改密码
    changePassWord = () => {
        if (typeof this.state.password == 'undefined' || this.state.password.trim() == '' || this.state.password == null || this.state.password != this.state.passwordA) {
            message.warning('两次密码不一致')
            this.setState({password: null, passwordA: null})
            return
        } else {
            let uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
            if (!uPattern.test(this.state.password)) {
                message.warning('密码4到16位,不能有特殊字符')
                return
            }
            updatePwd({password: this.state.password, id: this.editId}).then(res => {
                if (res.status == 200) {
                    message.success('修改成功')
                    this.setState({
                        showPassWordModal: false
                    })
                }
            }).catch(e => {
                message.warning(e.data.message)
            })
        }
    }
    changeRole = () => {
        if (!this.selectRoleChange) {
            message.warning('选择角色')
            return
        }

        updateRole({userId: this.itemData.id, roleId: this.selectRoleChange}).then(res => {
            if (res.status == 200) {
                message.success('修改成功')
                this.setState({
                    showRoleModal: false
                })
            }
        }).catch(e => {
            if (e) {
                message.warning(e.data.message)
            }
        })

    }
    delAdmin = () => {
        if (this.onSelectedList.length == 0 || this.onSelectedList.length > 1) {
            message.warning('选择一个')
            return
        }
        if (this.state.listData[this.onSelectedList[0]].id == 1) {
            message.warning('不能删除管理员')
            return
        }
        administratorsDelete(this.state.listData[this.onSelectedList[0]].id).then(res => {
            if (res.status == 200) {
                message.success('已删除')
                this.onSelectedList = []
                this.getData()
            }
        }).catch(e => {
            if (e) {
                message.warning(e.data.message)
            }
        })
    }
    postData = () => {
        //校验
        let uPattern = /^[a-zA-Z0-9_-]{4,16}$/;
        if (!uPattern.test(this.state.password)) {
            message.warning('密码4到16位,不能有特殊字符')
            return
        }
        if (typeof this.state.password == 'undefined' || this.state.password.trim() == '' || this.state.password == null || this.state.password != this.state.passwordA) {
            message.warning('两次密码不一致')
            this.setState({password: null, passwordA: null})
            return
        }
        if (!this.selectRoleChange) {
            message.warning('选择角色')
            return
        }
        if (this.state.editName == '') {
            message.warning('填写名字')
            return
        }
        let myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
        if (!myreg.test(this.state.userPhone)) {
            message.warning('手机号不合法')
            return
        }


        let formData = {
            email: this.state.userEmail,
            mobile: this.state.mobile,
            password: this.state.password,
            userName: this.state.editName,
            mobile: this.state.userPhone,
            roleId: this.selectRoleChange
        }
        // var formData = new FormData()
        // formData.append('name', this.state.editName)
        // formData.append('describe', this.state.editDescribe)
        //新建
        administratorsAdd(formData).then((res) => {
            //console.log(res)
            if (res.status == 200) {
                message.success('成功')
                this.setState({
                    showModal: false
                })
                this.getData()

            } else {
                message.error('失败')

            }
        }).catch(e => {
            if (e) {
                message.warning(e.data.message)
            }
        })

    }
    onSelectedRowKeys = (e) => {
        //console.log(e)
        this.onSelectedList = e
    }

    //新建管理员
    showModal = () => {
        this.selectRoleChange = null
        this.setState({
            showModal: true, password: null, editName: null, passwordA: null, userEmail: null, userPhone: null
        })
    }
    showPasswordModal = () => {
        if (this.onSelectedList.length == 0 || this.onSelectedList.length > 1) {
            message.warning('选择一个')
            return
        }
        let itemData = this.state.listData[this.onSelectedList[0]]
        this.editId = itemData.id
        this.setState({
            showPassWordModal: true,
            password: '',
            passwordA: ''
        })
    }
    showRoleModal = () => {
        if (this.onSelectedList.length == 0 || this.onSelectedList.length > 1) {
            message.warning('选择一个')
            return
        }
        let itemData = this.state.listData[this.onSelectedList[0]]
        this.itemData = itemData
        this.selectRoleChange = null
        this.setState({
            showRoleModal: true
        })
    }

    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={() => this.showModal()} style={{marginRight: '5px', marginLeft: '5px'}}>新增</Button>

                    {/*<Button onClick={() => this.disableAdmin(true)}*/}
                    {/*style={{marginRight: '5px', marginLeft: '5px'}}>禁用</Button>*/}

                    <Button onClick={() => this.showPasswordModal()}
                            style={{marginRight: '5px', marginLeft: '5px'}}>修改密码</Button>
                    <Button onClick={() => this.showRoleModal()}
                            style={{marginRight: '5px', marginLeft: '5px'}}>修改角色</Button>
                    <Button onClick={this.delAdmin} style={{marginRight: '5px', marginLeft: '5px'}}>删除</Button>

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
                    label="管理员名称"
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
                {this.renderoleModal()}
                {this.renderPasswordModal()}
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
        title: '管理员名称',
        dataIndex: 'userName',
        key: 'userName',
    },

    {
        title: '角色',
        key: '提现地址',
        dataIndex: 'name',
    }
    ,

    {
        title: '手机号',
        key: '33',
        dataIndex: 'mobile',
    }
    ,

    {
        title: '邮箱',
        key: '433',
        dataIndex: 'email',
    },
    {
        title: '创建时间',
        key: 'createdtime',
        dataIndex: 'createdtime',
    }
];
