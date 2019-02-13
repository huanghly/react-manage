/* eslint-disable react/require-render-return */
/**
 * Created by liu 2018/5/14
 */
import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Select, Button, Menu, message, Table, Modal} from 'antd';
import './UserDetail/user-detail.css';
import {userDetail, updateSeniorStatus} from '../../requests/http-req.js'
import history from '../../history.js'
import img from '../../resources/1.png'

const Option = Select.Option;

export default class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemData: null,
            listData: '',
            pageSize: 10,
            pageNo: 0,
            status: null,
            hidden: false,
            showModal: false,
            disable: false,
            showImg: null
        }
    }

    componentWillMount() {
        this.state.itemData = this.props.location.state.data
        if (this.state.itemData.seniorAuth != '待审核') {
            this.state.hidden = true
        }
    }

    componentDidMount() {
        userDetail({
            pageSize: this.state.pageSize,
            pageNo: this.state.pageNo,
            userId: this.state.itemData.userId
        }).then((res) => {
            //console.log(res)
            if (res.status == 200) {
                res.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    listData: res.data.data
                })
            }
        })
    }

    selsctChange = (value) => {
        this.setState({
            status: value
        })
    }
    saveState = () => {
        // alert('0000')
        let obj = {
            seniorAuth: this.state.status,
            userId: this.state.itemData.userId
        }
        updateSeniorStatus(JSON.stringify(obj)).then((res) => {
            if (res.status == 200) {
                message.success('保存成功')
                this.setState({
                    disable: true
                }, () => {
                    history.go(-1)
                })

            } else {
                message.success('保持失败')
            }
        })
    }
    close = () => {
        this.setState({
            showModal: false
        })
    }
    renderModal = () => {
        return (
            <Modal
                maskClosable={true}
                destroyOnClose={true}
                onCancel={this.close}
                visible={this.state.showModal}
                onChange={this.close}
                footer={null}
                style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
            >
                <img style={{flex: 1, marginTop: 15, height: 400, width: 400}} src={this.state.showImg}></img>

            </Modal>
        )
    }

    render() {
        const {itemData} = this.state
        //console.log(itemData)
        return (
            <div className='center-user-list'
                 style={{overflow: 'auto', display: 'flex', flexDirection: 'columns', padding: '20px'}}>
                <div style={{display: 'flex', flexDirection: 'row', minHeight: '900px'}}>
                    <div style={{flex: 1, flexDirection: 'column'}}>
                        <h2>基本信息</h2>
                        <div style={{display: 'flex', flexDirection: 'column'}}>
                            <div className='detail-item'>
                                <div className='text-margin-d'>姓名:</div>
                                <div>{itemData.userName}</div>
                            </div>
                            <div className='detail-item'>
                                <div className='text-margin-d'>昵称:</div>
                                <div>{itemData.nickName}</div>
                            </div>
                            <div className='detail-item'>
                                <div className='text-margin-d'>手机号:</div>
                                <div>{itemData.mobile}</div>
                            </div>
                            <div className='detail-item'>
                                <div className='text-margin-d'>国籍:</div>
                                <div>{itemData.country}</div>
                            </div>
                            <div className='detail-item'>
                                <p className='text-margin-d'>注册时间:</p>
                                <div>{itemData.regTime}</div>
                            </div>
                        </div>
                    </div>
                    <div style={{flex: 1}}>
                        <h2>认证信息</h2>
                        <div>
                            <div className='detail-item'>
                                <p className='text-margin-d'>证件类型:</p>
                                <div>{itemData.credentialsType}</div>
                            </div>
                            <div className='detail-item'>
                                <div className='text-margin-d'>证件号:</div>
                                <div>{itemData.credentialsCode}</div>
                            </div>
                            <div className='detail-item'>
                                <p className='text-margin-d'>初级认证时间:</p>
                                <div>{itemData.primaryAuthenTime}</div>
                            </div>
                            <div className='detail-item'>
                                <p className='text-margin-d'>高级认证时间:</p>
                                <div>{itemData.seniorAuthenTime}</div>
                            </div>
                            <div className='detail-item'>
                                <p className='text-margin-d'>高级认证状态:</p>
                                <div>{itemData.seniorAuth}</div>
                            </div>
                        </div>
                        <div>
                            <div className='detail-item' style={{width: '360px'}}>
                                <p className='text-margin-d'>证件正面：</p>

                                <img onClick={() => this.setState({
                                    showModal: true,
                                    showImg: itemData.identityPictureOne ? itemData.identityPictureOne : img
                                })}
                                     src={itemData.identityPictureOne ? itemData.identityPictureOne : img}
                                     style={{width: '260px', height: '260px',}}></img>
                            </div>
                            <div className='detail-item' style={{width: '360px'}}>
                                <p className='text-margin-d'>证件反面：</p>
                                <img onClick={() => this.setState({
                                    showModal: true,
                                    showImg: itemData.identityPictureTwo ? itemData.identityPictureTwo : img
                                })}
                                     src={itemData.identityPictureTwo ? itemData.identityPictureTwo : img}
                                     style={{width: '260px', height: '260px',}}></img>
                            </div>
                            {/*<div className='detail-item' style={{width: '360px'}}>*/}
                            {/*<div className='text-margin-d'>手持证件：</div>*/}
                            {/*<img style={{width: '260px', height: '260px', backgroundColor: 'blue'}}></img>*/}
                            {/*</div>*/}
                        </div>
                        {this.state.hidden ?
                            null :
                            <div style={{flexDirection: 'columns', display: 'flex'}}>
                                <div className='detail-item'>
                                    <div className='text-margin-d'>审核操作</div>
                                    <Select disabled={this.state.disable} placeholder="审核操作"
                                        //2：未通过，3：通过
                                            value={this.state.status} style={{width: 120}} onChange={this.selsctChange}>
                                        <Option value="3">通过</Option>
                                        <Option value="2">不通过</Option>
                                    </Select>
                                </div>
                                <div className='detail-item'>
                                    <Button onClick={this.saveState} disabled={this.state.disable}
                                            style={{marginRight: '15px'}}>保存</Button>
                                    <Button onClick={() => history.goBack()}>返回</Button>
                                </div>
                            </div>
                        }
                    </div>
                </div>
                {this.renderModal()}
                <div style={{width: '100%', height: '400px'}}>
                    <h3>钱包列表</h3>
                    <Table dataSource={this.state.listData} columns={columns}/>
                </div>
            </div>
        )
    }
}


const columns = [{
    title: '序号',
    dataIndex: 'index',
    key: 'index',
}, {
    title: '币种',
    dataIndex: 'coinType',
    key: 'coinType',
}, {
    title: '钱包地址',
    dataIndex: 'rechargeAdd',
    key: 'rechargeAdd',
}, {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
}];


