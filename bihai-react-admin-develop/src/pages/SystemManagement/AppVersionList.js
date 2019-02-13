/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Modal, message, Button, Form, Select, Input, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {
    appVerisonList,
    getCodeType,
    saveAppVerison,
    versionStatus,
    versionUpdata,
    newestVersion
} from '../../requests/http-req.js'
import history from '../../history.js'
import {Link} from 'react-router-dom'
import EditVersion from './EditAppVersion.js'
import moment from 'moment'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

export default class AppVersionList extends Component {
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
            appName: null,
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()
        getCodeType().then(((res) => {
            this.setState({
                codeType: res.data.data
            })
        }))
    }

    getData() {
        this.setState({showLoading: true})
        appVerisonList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            type: this.state.type,
            appName: this.state.appName && this.state.appName.trim()
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
        versionStatus(formData).then(res => {
            // versionStatus({status: status, ids: this.ids.join(',')}).then(res => {
            if (res.status == 200) {
                message.success('修改成功')
                this.selectedRowKeys = []
                this.ids = []
                this.getData()
            }
        }).catch(e => {
            if (e) {
                message.error(e.data.message)
                this.selectedRowKeys = []
                this.ids = []
            }
        })
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
                <div className='row-user'>
                    <Button onClick={() => this.setState({showModal: true})}
                            style={{marginRight: '5px', marginLeft: '5px'}}>添加</Button>
                    <Button onClick={() => this.showModal('upData')}
                            style={{marginRight: '5px', marginLeft: '5px'}}>更新</Button>
                    <Button onClick={() => this.updateStatus(0)}
                            style={{marginRight: '5px', marginLeft: '5px'}}>启动</Button>

                    <Button onClick={() => this.updateStatus(1)}
                            style={{marginRight: '5px', marginLeft: '5px'}}>停用</Button>
                    <Button onClick={this.setNewVersion}
                            style={{marginRight: '5px', marginLeft: '5px'}}>设置为最新版本</Button>

                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={this.columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               minWidth={1600}
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
        newForm.append('appName', item.appName)
        newForm.append('newestVersion', item.newestVersion)
        newForm.append('type', item.type)
        newForm.append('applicationMarket', item.applicationMarket)
        newestVersion(newForm).then(res => {
            if (res.status == 200) {
                message.success('设置成功')
                this.getData()
                this.selectedRowKeys = []
                this.ids = []
            }
        }).catch(e => {
            if (e) {
                message.error(e.data.message)
            }
        })
    }

    postData = (data) => {
        if (this.itemData) {
            data.id = this.itemData.id
            data.updateTime = moment().format('YYYY-MM-DD h:mm:ss')

            versionUpdata(data).then(res => {
                if (res.status == 200) {
                    message.success('成功')
                    this.colseModal()
                    this.getData()
                }
            }).catch(e => {
                if (e) {
                    message.warning(e.data.message)
                }
            })
        } else {
            data.status = 0
            saveAppVerison(data).then(res => {
                //console.log(res)
                if (res.status == 200) {
                    message.success('成功')
                    this.colseModal()
                    this.getData()
                }
                this.selectedRowKeys = []
                this.ids = []
            }).catch(e => {
                if (e) {
                    message.warning(e.data.message)
                }
            })
        }

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
                    label="选择平台"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Select
                        value={this.state.type}
                        placeholder="应用平台"
                        onChange={(v) => {
                            this.setState({type: v})
                        }}
                    >
                        <Option key={1232} value={null}>全部</Option>
                        <Option key='android' value='android'>android</Option>
                        <Option key='ios' value='ios'>ios</Option>
                    </Select>
                </FormItem>
                <FormItem
                    style={{margin: 'auto', flex: 1, paddingRight: '15px'}}
                    label="应用名称"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Input onChange={(e) => this.setState({appName: e.target.value})}/>
                </FormItem>
                <div style={{flex: 2}}/>

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
                <EditVersion itemData={this.itemData} postData={this.postData}
                             onCancel={this.colseModal}/>
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
            title: '应用名称',
            dataIndex: 'appName',
            key: 'appName',
        }
        ,
        {
            title: '应用市场',
            dataIndex: 'applicationMarket',
            key: 'applicationMarket',
        }
        ,
        {
            title: '最新版本',
            dataIndex: 'newestVersion',
            key: 'newestVersion',
        },
        {
            title: '当前版本',
            dataIndex: 'currentVersion',
            key: 'currentVersion',
        }
        ,
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
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
            title: '强升最低版本',
            dataIndex: 'forceUpdate',
            key: 'forceUpdate',
        },
        {
            title: '需要升级',
            dataIndex: 'needUpdate',
            key: 'needUpdate',
            render: (text, record) => <div>{text ? '是' : '否'}</div>
        },
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        },
        {
            title: '下载地址',
            dataIndex: 'url',
            key: 'maxPrice',
        },
        {
            title: '版本描述',
            dataIndex: 'versionDesc',
            key: 'versionDesc',
        }
        // ,
        //
        // {
        //     title: '操作',
        //     dataIndex: 'operation',
        //     key: 'operation',
        //     fixed: 'right',
        //     width: 100,
        //     render: (text, record) => (
        //         <Link to={{pathname: '/index/ContentManagement/CoinDoubleTradeDetail', state: {data: record}}}>详情</Link>
        //     )
        // }
    ];

}
