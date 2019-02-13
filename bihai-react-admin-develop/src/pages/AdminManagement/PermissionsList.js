/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Form, Button, Input, message, Modal} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {
    getPermissionsList,
    getByDescribe,
    updateResources,
    creatResources,
    delResources
} from '../../requests/http-req.js'

const FormItem = Form.Item;

export default class PermissionsList extends Component {
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
            editUrl: null
        }
    }

    editId = null
    onSelectedList = []

    componentDidMount() {
        //提现类型接口
        this.getData()
    }

    handleSearch = () => {
        this.state.pageNo = 0
        if (this.state.inputValue == '') {
            this.getData()
            return
        }
        let data = new FormData()
        data.append('describe', this.state.inputValue)
        getByDescribe(data).then((req) => {
            ////console.log(req)
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
                    ////console.log(this.state.total)
                })
            }
            this.setState({showLoading: false})
        })
    }

    getData() {
        let temArr = {
            page: this.state.pageNo || 0,
            size: 10,
            // describe: data && data,
        }
        this.setState({showLoading: true})
        getPermissionsList(temArr).then((req) => {
            ////console.log(req)
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
                    ////console.log(this.state.total)
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
    renderModal = () => {
        return (
            <Modal
                destroyOnClose={true}
                onCancel={() => this.setState({showModal: false})}
                title={this.editId ? "修改权限" : "新建权限"}
                visible={this.state.showModal}
                onChange={() => {
                    this.setState({showModal: false})
                }}
                footer={null}
            >
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>权限名称：</div>
                    <Input value={this.state.editDescribe} onChange={(e) => {
                        this.setState({editDescribe: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>访问地址：</div>
                    <Input value={this.state.editUrl} onChange={(e) => {
                        this.setState({editUrl: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button style={{width: '100px', marginLeft: '30px'}}
                            onClick={() => this.postData()}>确认</Button>
                </div>
            </Modal>
        )
    }
    postData = () => {
        let temObj = {describe: this.state.editDescribe, url: this.state.editUrl, method: 'POST'}

        if (this.editId) {
            //修改
            temObj.id = this.editId
            updateResources(this.editId, temObj).then((req) => {
                ////console.log(req)
                this.setState({editUrl: null, editDescribe: null, showModal: false})
                this.getData()

            })
        } else {
            //新建
            creatResources(temObj).then((req) => {
                ////console.log(req)
                this.setState({editUrl: null, editDescribe: null, showModal: false})
                this.getData()

            })
        }
    }
    onSelectedRowKeys = (e) => {
        ////console.log(e)
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
                    showModal: true, editDescribe: itemData.describe, editUrl: itemData.url
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
    onDel = () => {
        if (this.onSelectedList.length == 0 || this.onSelectedList.length > 1) {
            message.warning('选择一个')
            return
        } else {
            delResources(this.state.listData[this.onSelectedList[0]].id).then((req) => {
                if (req.status == 200) {
                    message.success('已干掉')
                    this.getData()
                } else {
                    message.success('没干掉，检查网络')
                }
            })
        }
    }
    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={() => this.showModal()} style={{marginRight: '5px', marginLeft: '5px'}}>新增</Button>
                    <Button onClick={this.onDel}
                            style={{marginRight: '5px', marginLeft: '5px'}}>删除</Button>
                    <Button onClick={() => this.showModal('update')}
                            style={{marginRight: '5px', marginLeft: '5px'}}>修改</Button>

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
        ////console.log(e.target.value)
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
                    minHeight: '60px',
                    height: '60px',
                    width: '100%',
                    alignItems: 'center'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <FormItem
                    style={{margin: 'auto', flex: 1, paddingRight: '15px'}}
                    label="权限名称"
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
        title: '权限名称',
        dataIndex: 'describe',
        key: 'tradePrice',
    },
    {
        title: '访问地址',
        key: '提现地址',
        dataIndex: 'url',
    }
];
