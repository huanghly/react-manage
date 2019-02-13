/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Modal, message, Button} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import ArticleListSearch from '../../components/SearchView/ArticleListSearch.js'
import {articleList, articleTypeGetAll, articleStatus} from '../../requests/http-req.js'
import ArticleEditModal from '../../components/modal/ArticleEditModal.js'
import history from '../../history.js'

export default class ArticleList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
            showModal: false,
            type: []
        }
    }

    searchData = null
    selectedRowKeys = null

    componentDidMount() {
        this.getData()
        articleTypeGetAll().then(((req) => {
            //console.log(req)
            this.setState({
                type: req.data.data
            })
        }))
    }

    handleSearch = (values) => {
        this.state.pageNo = 0
        this.searchData = values
        this.getData()
    }

    getData() {
        this.setState({showLoading: true})
        articleList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            type: this.searchData && this.searchData.type,
            keyWords: this.searchData && this.searchData.keyWords && this.searchData.keyWords.trim() || null,
            showClient: this.searchData && this.searchData.showClient
        }).then((req) => {
            //console.log(req)
            if (!req.data.data) {
                message.warning('暂无数据')
                this.setState({showLoading: false})
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
    gotoEidt = () => {
        let data = {
            itemData: this.selectedRowKeys && this.selectedRowKeys.length == 1 ? this.state.listData[this.selectedRowKeys[0]] : null,
            type: this.state.type
        }
        history.push({
            pathname: '/index/ContentManagement/ArticleEditPage',
            data: data,
        })
    }
    onSelectedRowKeys = (e) => {
        this.selectedRowKeys = e
    }
    onDel = () => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('选择一个')
            return
        }
        //console.log(this.state.listData[this.selectedRowKeys[0]].id)
        articleStatus(this.state.listData[this.selectedRowKeys[0]].id).then(req => {
            //console.log(req)
            message.success('成功')
            this.selectedRowKeys = []
            this.getData()
        })
    }

    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={this.gotoEidt}
                            style={{marginRight: '5px', marginLeft: '5px'}}>增加</Button>
                    <Button onClick={this.gotoEidt}
                            style={{marginRight: '5px', marginLeft: '5px'}}>修改</Button>
                    {/*<Button onClick={this.onDel}*/}
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

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                <ArticleListSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }

    getText = (text) => {
        if (text == '1') {
            return '手机'
        } else if (text == '2') {
            return '电脑'
        } else if (text == '3') {
            return '全部'
        }
    }

    columns = [
        {
            width: 70,
            title: '序号',
            dataIndex: 'index',
        }
        ,
        {
            title: '标题',
            dataIndex: 'title',
            key: 'typeName',
        }
        ,
        {
            title: '类型',
            dataIndex: 'type',
            key: 'type',
        }
        ,
        {
            title: '状态',
            dataIndex: 'status',
            key: 'status',
            render: text => <div>{text == 0 ? "启用" : "停用"}</div>,
        }
        ,
        {
            title: '显示客户端',
            dataIndex: 'showClient',
            key: 'showClient',
            render: text => <div>{this.getText(text)}</div>,

        }
        ,
        {
            title: '关键词',
            dataIndex: 'keyWords',
            key: 'keyWords',
        }

        ,
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        }
        ,
        {
            title: '创建人',
            dataIndex: 'publisher',
            key: 'publisher',
        }
        ,

        {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        }
        // ,
        //
        // {
        //     title: '修改人',
        //     dataIndex: 'updateTime',
        //     key: 'updateTime',
        // }

    ];

}
