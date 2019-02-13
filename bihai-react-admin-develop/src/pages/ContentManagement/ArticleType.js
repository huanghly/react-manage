/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Radio, Form, message, Button, Modal, Input} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import AdvertisingSearch from '../../components/SearchView/AdvertisingSearch.js'
import {articleTypeList, articleTypeSave, articleRemote} from '../../requests/http-req.js'

const FormItem = Form.Item;

const RadioGroup = Radio.Group;

export default class ArticleType extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
            showModal: false,
            keyWords: null,
            searchKewWord: null,
            language: 'zh',
            typeName: null,
            id: null,
            description: null
        }
    }

    selectedRowKeys = null

    componentDidMount() {
        this.getData()
    }


    getData() {
        this.setState({showLoading: true})
        articleTypeList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            keyWords: this.state.searchKewWord
        }).then((req) => {
            //console.log(req)
            if (!req.data.data) {
                message.warning('暂无数据')
                this.setState({showLoading: false})
                return
            }
            //console.log(req)
            req.data.data && req.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })

            if (req.status == 200) {
                if (req.data.length == 0) {
                    message.warning('没有符合的数据')
                }
                this.setState({
                    listData: req.data.data,
                    pageNo: req.data.data.pages,
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

    onAdd = () => {
        if (this.state.keyWords && this.state.keyWords == '' || this.state.language && this.state.language == '' || this.state.typeName && this.state.typeName == '') {
            message.warning('检查')
            return;
        }
        articleTypeSave({
            keyWords: this.state.keyWords,
            language: this.state.language,
            typeName: this.state.typeName,
            id: this.state.id,
            description: this.state.editDescribe
        }).then(req => {
            //console.log(req)
            if (req.status == 200) {
                message.success('成功')
                this.setState({
                    showModal: false,
                    keyWords: null,
                    language: 'zh',
                    typeName: null,
                    id: null,
                    editDescribe: ''
                })
                this.getData()
            }

        })
    }

    onDel = () => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('选择一个')
        }
        let id = this.state.listData[this.selectedRowKeys[0]].id
        articleRemote(id).then(req => {
            message.success('删除')
            //console.log(req)
            this.getData()
        })
    }

    onSelectedRowKeys = (e) => {
        this.selectedRowKeys = e
    }


    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={() => this.setState({showModal: true})}
                            style={{marginRight: '5px', marginLeft: '5px'}}>增加</Button>
                    <Button onClick={this.onDel}
                            style={{marginRight: '5px', marginLeft: '5px'}}>删除</Button>

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
            >
                <FormItem
                    style={{margin: 'auto', flex: 1, paddingRight: '15px'}}
                    label="名称"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Input onChange={(e) => {
                        this.setState({searchKewWord: e.target.value})
                    }} value={this.state.searchKewWord} style={{width: '100%'}}/>
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
                <Modal
                    destroyOnClose={true}
                    onCancel={() => this.setState({showModal: false})}
                    title={"新增类型"}
                    visible={this.state.showModal}
                    onChange={() => {
                        this.setState({showModal: false})
                    }}
                    footer={null}
                >
                    <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                        <div style={{width: '120px'}}>类型名称：</div>
                        <Input value={this.state.typeName} onChange={(e) => {
                            this.setState({typeName: e.target.value})
                        }}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                        <div style={{width: '120px'}}>类型ID：</div>
                        <Input value={this.state.id} onChange={(e) => {
                            this.setState({id: e.target.value})
                        }}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                        <div style={{width: '120px'}}>语言：</div>
                        <RadioGroup onChange={(e) => this.setState({language: e})} value={this.state.language}>
                            <Radio value={'zh'}>中文</Radio>
                            <Radio value={'en'}>英文</Radio>
                        </RadioGroup>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                        <div style={{width: '120px'}}>关键词：</div>
                        <Input value={this.state.keyWords} onChange={(e) => {
                            this.setState({keyWords: e.target.value})
                        }}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                        <div style={{width: '120px'}}>描述：</div>
                        <Input value={this.state.editDescribe} onChange={(e) => {
                            this.setState({editDescribe: e.target.value})
                        }}/>
                    </div>
                    <div
                        style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                        <Button style={{width: '100px', marginLeft: '30px'}}
                                onClick={() => this.onAdd()}>保存
                        </Button>
                        <Button style={{width: '100px', marginLeft: '30px'}}
                                onClick={() => this.setState({showModal: false})}>取消
                        </Button>
                    </div>
                </Modal>
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
            title: '类型名称',
            dataIndex: 'typeName',
            key: 'typeName',
        }
        ,
        {
            title: '类型ID',
            dataIndex: 'id',
            key: 'id',
        }
        ,
        {
            title: '关键词',
            dataIndex: 'keyWords',
            key: 'keyWords'
        }
        ,
        {
            title: '描述',
            dataIndex: 'description',
            key: 'description',
        }
        ,
        {
            title: '语言',
            dataIndex: 'language',
            key: 'language',
            render: (t, r) => <div>{t == 'zh' ? '中文' : '英文'}</div>
        }
        ,
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        }

    ];

}
