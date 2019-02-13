/**
 * Created by liu 2018/6/5
 **/
import {Button, Steps, message} from 'antd';
import React, {Component} from 'react';
import Breadcrumb from '../../components/Breadcrumb.js'
import TableView from '../../components/TableView'
import {
    drawDetail, getDickey, cashNoPass, cashPass, exaNoPass,
    exaPass, verNoPass, verPass
} from '../../requests/http-req.js'
import ConfigNet, {StatusMap, seniorAuth, HandleTypeB} from '../../networking/ConfigNet'

import './ReviewPage/ReviewPage.css'
import Number from '../../utils/Number.js'

const Step = Steps.Step;

export default class ReviewPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 0,
            PageSize: 10,
            total: 0,
            itemData: {},
            listData: null,
            hiddenButton: false,
            selectStep: 0
        }
    }

    componentWillMount() {
        this.props.location.state.data && this.setState({
            itemData: this.props.location.state.data,
        }, () => {
            let tag = 0
            StatusMap.forEach((item, index) => {
                if (item.dicKey == this.state.itemData.coinDrawStatus) {
                    tag = index
                }
            })
            //设置进度及按钮状态
            if (tag > 2) {
                this.setState({
                    selectStep: StatusMap[tag].selectStep,
                    hiddenButton: true
                })
            } else {
                this.setState({
                    selectStep: StatusMap[tag].selectStep,
                })
            }
        })

    }


//coinCode=BTC&userId=12&pageNo=0&pageSize=10

    componentDidMount() {
        this.getListData()

    }

    getListData = () => {
        drawDetail({
            pageNo: this.state.pageNo,
            pageSize: 10,
            userId: this.state.itemData.userId,
            coinCode: this.state.itemData.coinCode
        }).then((req) => {
            req.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })
            this.setState({
                listData: req.data.data,
                total: req.data.total
            })
        })
    }

    onChangePagintion = (e) => {
        this.setState({
            pageNo: e
        }, () => {
            this.getListData()
        })

    }
    //获取进度状态
    getStatusText = (e) => {
        let tem = ''
        StatusMap.forEach((item) => {
            if (item.dicKey == e) {
                tem = item.dicName
            }
        })
        return tem

    }
    onClickButton = (isPass) => {
        const itemData = this.state.itemData
        if (isPass) {//通过
            if (itemData.coinDrawStatus == 10030005) { //待初审
                exaPass(itemData).then((req) => {
                    if (req.status == 200) {
                        let temItem = itemData
                        temItem.coinDrawStatus = 10030010
                        this.setState({
                            itemData: temItem,
                            selectStep: 1,
                            hiddenButton: true
                        })
                        message.success('操作成功')
                    }
                })
            } else if (itemData.coinDrawStatus == 10030010) { //待复审
                verPass(itemData).then((req) => {

                    if (req.status == 200) {
                        let temItem = itemData
                        temItem.coinDrawStatus = 10030015
                        this.setState({
                            itemData: temItem,
                            selectStep: 2,
                            hiddenButton: true
                        })
                        message.success('操作成功')
                    }
                })
            } else { //待出币
                cashPass(itemData).then((req) => {
                    if (req.status == 200) {
                        let temItem = itemData
                        temItem.coinDrawStatus = 10030020
                        this.setState({
                            itemData: temItem,
                            selectStep: 3,
                            hiddenButton: true
                        })
                        message.success('操作成功')
                    }
                })

            }
        } else {
            if (itemData.coinDrawStatus == 10030005) { //待初审
                exaNoPass(itemData).then((req) => {
                    this.request(req)
                })
            } else if (itemData.coinDrawStatus == 10030010) { //待复审
                verNoPass(itemData).then((req) => {
                    this.request(req)
                })
            } else { //待出币
                cashNoPass(itemData).then((req) => {
                    this.request(req)
                })
            }
        }
    }
    request = (req) => {
        if (req.status == 200) {
            this.setState({
                hiddenButton: true
            })
            message.success('操作成功')
        } else {
            message.success('操作失败')
        }
    }

    render() {
        const itemData = this.state.itemData
        return (
            <div className={'center-user-list'}>
                <div style={{minHeight: '350px'}}>
                    {/*<div style={{width:'500px'}}>{JSON.stringify(this.state.data)}</div>*/}
                    <Breadcrumb data={window.location.pathname}/>
                    <div style={{
                        display: 'flex',
                        flexDirection: 'row',
                        paddingRight: '20px',
                        paddingLeft: '20px',
                        marginBottom: '30px'
                    }}>
                        <h3 style={{flex: 1}}>提现单号:{itemData.drawId}</h3>
                        <Button disabled={this.state.hiddenButton} style={{marginRight: '15px'}}
                                onClick={() => this.onClickButton(true)}>通过</Button>
                        <Button disabled={this.state.hiddenButton}
                                onClick={() => this.onClickButton(false)}>不通过</Button>

                    </div>
                    <div className='row'>
                        <div className='list-item'>
                            <div className='list-key'>姓名：</div>
                            <div className='list-value'>{itemData.userName}</div>
                        </div>
                        <div className='list-item'>
                            <div className='list-key'>手机号：</div>
                            <div className='list-value'>{itemData.mobile}</div>
                        </div>
                        <div className='list-item'>
                            <div className='list-key'>邮箱：</div>
                            <div className='list-value'>{itemData.email}</div>
                        </div>
                        <div className='list-item'>
                            <div className='list-key'>初级认证：</div>
                            <div className='list-value'>{itemData.primaryAuth == 0 ? '未通过' : '已通过'}</div>
                        </div>
                        <div className='list-item'>
                            <div className='list-key'>高级认证：</div>
                            <div className='list-value'>{seniorAuth[itemData.seniorAuth]}</div>
                        </div>
                        <div className='list-item'>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='list-item'>
                            <div className='list-key'>币种：</div>
                            <div className='list-value'>{itemData.coinCode}</div>
                        </div>
                        <div className='list-item'>
                            <div className='list-key'>创建时间：</div>
                            <div className='list-value'>{itemData.createTime}</div>
                        </div>
                        <div className='list-item'>
                            <div className='list-key'>用户备注：</div>
                            <div className='list-value'>{itemData.mark || ''}</div>
                        </div>

                        <div className='list-item'>
                            <div className='list-key'>手续费：</div>
                            <div className='list-value'>{Number.scientificToNumber(itemData.poundageAmount)}</div>
                        </div>
                        <div className='list-item'>
                            <div className='list-key'>提现数量：</div>
                            <div className='list-value'>{itemData.drawAmount}</div>
                        </div>
                        <div className='list-item'>
                            <div className='list-key'>状态：</div>
                            <div className='list-value'>{this.getStatusText(itemData.coinDrawStatus)}</div>
                        </div>

                    </div>
                    <Steps style={{paddingLeft: '80px', paddingRight: '80px'}} current={this.state.selectStep}>
                        <Step title="待初审" description="待初审."/>
                        <Step title="待复审" description="待复审."/>
                        <Step title="待出币" description="待出币."/>
                        <Step title="放币中" description="放币中."/>
                        <Step title="出币成功" description="出币成功."/>
                    </Steps>
                </div>
                <TableView hiddenSelection={true} pageNo={this.state.pageNo} columns={columns}
                           data={this.state.listData} total={this.state.total}
                           onChangePagintion={this.onChangePagintion}/>
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
    }
    ,
    {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
    }
    ,
    {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
    }
    ,
    {
        title: '账户',
        dataIndex: 'handleType',
        key: 'handleType',
        render: (text, record) => getHandleType(text)
    }
    ,
    {
        title: '币种',
        dataIndex: 'coinCode',
        key: 'coinCode',
    },

    {
        title: '金额',
        dataIndex: 'amount',
        key: 'amount',
        render: (text, r) => <div>{Number.scientificToNumber(text)}</div>
    },
    {
        //10020005:平台转账;10020010:网络转出;10020015:账户划出
        title: '可用金额',
        dataIndex: 'aftAmount',
        key: 'aftAmount',
        render: (text, r) => <div>{Number.scientificToNumber(text)}</div>
    }

    ,
    {
        title: '冻结金额',
        dataIndex: 'frozenAmount',
        key: 'frozenAmount',
        render: (text, r) => <div>{Number.scientificToNumber(text)}</div>
    }
    ,
    {
        title: '总资产',
        dataIndex: 'totalAsset',
        key: 'totalAsset',
        render: (text, r) => <div>{Number.scientificToNumber(text)}</div>
    }
    ,
    {
        title: '更新时间',
        dataIndex: 'createTime',
        key: 'createTime',
    }
];
const getHandleType = (text) => {
    let tem = ''
    HandleTypeB.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}
