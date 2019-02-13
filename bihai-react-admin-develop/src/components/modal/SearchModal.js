import React, {Component} from 'react';
import {Modal, Table, InputNumber, Button, Input} from 'antd';
import {searchUser} from '../../requests/http-req.js'

export default class SearchModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            listData: [],
            loading: false,
            phone: null,
            email: null,
            total: 0,
            pageSize: 5
        };
    };


    componentDidMount() {

    }

    componentWillMount() {
        this.state.showModal = this.props.showModal
    }


    onCancel = () => {
        this.props.closeSearchModal && this.props.closeSearchModal()
    }

    componentWillReceiveProps(props) {
        this.setState({
            showModal: props.showModal
        })
    }

    onClickSearchBtn = () => {
        //1 校验数据 2 发送请求

        this.getData()

    }

    getData = (pageNo = 0, pageSize = 5) => {
        this.setState({loading: true})
        searchUser({
            pageNo: pageNo,
            pageSize: pageSize,
            mobile: this.state.phone,
            email: this.state.email
        }).then((req) => {
            console.log(req)
            if (req.status == 200) {
                this.setState({
                    listData: req.data.data,
                    total: req.data.total,
                    loading: false
                }, () => {
                    console.log(this.state.listData)
                })
            }
        })

    }
    selectRow = (record) => {
        this.props.onSelectRow && this.props.onSelectRow(record)
        this.onCancel()

    }
    onChangePagintion = (e) => {
        this.getData(e, 5)
    }

    render() {
        return (
            <Modal title="用户搜索"
                   visible={this.state.showModal}
                   closable={true}
                   width={950}
                   onCancel={this.onCancel}
                   footer={null}>
                <div style={{display: 'flex', flexDirection: 'row', marginBottom: '20px'}}>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginLeft: '10px',
                        marginRight: '10px',
                        flex: 3
                    }}>
                        <div style={{width: '100px'}}>手机号码：</div>
                        <InputNumber style={{width: '300px'}} min={0} onChange={(e) => {
                            this.setState({phone: e})
                        }}/>
                    </div>
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginLeft: '10px',
                        marginRight: '10px',
                        flex: 3,

                    }}>
                        <div style={{width: '100px'}}>邮箱地址：</div>
                        <Input onChange={(e) => {
                            this.setState({email: e.target.value})
                        }}/>
                    </div>
                    <Button type="primary" loading={this.state.loading} onClick={this.onClickSearchBtn}>
                        搜索
                    </Button>
                </div>
                <Table pagination={{
                    pageSize: this.state.pageSize,
                    total: this.state.total,
                    onChange: this.onChangePagintion
                }}
                       columns={columns} dataSource={this.state.listData} onRow={(record) => ({
                    onClick: () => {
                        this.selectRow(record);
                    },
                })}/>
            </Modal>
        )
    }
}
const columns = [{
    title: 'ID',
    dataIndex: 'userId',
    key: 'userId',
}, {
    title: '手机',
    dataIndex: 'mobile',
    key: 'mobile',
}, {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
}, {
    title: '昵称',
    dataIndex: 'nickName',
    key: 'nickName',
}, {
    title: '姓名',
    dataIndex: 'userName',
    key: 'userName',
}, {
    title: '国籍',
    dataIndex: 'country',
    key: 'country',
}, {
    title: '证件类型',
    dataIndex: 'credentialsType',
    key: 'credentialsType',
    render: (text, record) => (<div>{text == 0 ? '身份证' : (text == 1 ? '护照' : '')}</div>)


}, {
    title: '证件号',
    dataIndex: 'credentialsCode',
    key: 'credentialsCode',
}];
