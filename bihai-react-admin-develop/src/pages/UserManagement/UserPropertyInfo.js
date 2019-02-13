/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import Breadcrumb from '../../components/Breadcrumb.js'
import {balanceList, getCodeType, coinBalanceRecordlist, coinBalanceCorrect,getCoinStatus} from '../../requests/http-req.js'
import {Spin, Form, Select, DatePicker, Button, Modal, InputNumber, message} from 'antd';
import TableView from '../../components/TableView'
import {CoinBalanceState} from '../../networking/ConfigNet.js'
import CashBalanceListSearch from '../../components/SearchView/CashBalanceListSearch.js'
import moment from 'moment'

const Option = Select.Option;
const FormItem = Form.Item;
export default class UserPropertyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            balanceData: [],
            coinCode: null,
            selectTime: null,
            total: 0,
            showModal: false,
            listData: [],
            balanceTime: null,
            afterAmount: null,
            normalState: [],
            abnormalState: [],
        }
    }

    componentWillMount() {
        let userMsg = this.props.location.state.data;
        this.uId = userMsg.userId;
        this.uName = userMsg.userName;
        this.uMobile = userMsg.mobile;
        this.uEmail = userMsg.email;
        this.uhandleType = userMsg.handleType;
        this.itemData = this.props.location.state && this.props.location.state.data || null
        this.coinCode = this.itemData.coinCode
        this.balanceTime = moment(this.itemData.updateTime).add(-1, 'days').format('YYYY/MM/DD')
    }


    componentDidMount() {
        this.getData()
    }

    editItem = null            //选中的平衡表
    // balanceTimebalanceTime = moment().add(-1, 'days').format('YYYY/MM/DD')
    // coinCode = 'BTC'


    handleSearch = (values) => {//.slice(1, 11)
        this.state.pageNo = 0
        this.balanceTime = moment(values.balanceTime).format('L');
        this.coinCode = values.coinCode;
        //console.log(this.balanceTime)
        this.getData()
    }
    getStateArr = (data) => {
        let all = []
        let coin = []   //币币
        let fiat = []   //法币
        let leverage = [] //杠杆

        data.forEach(item => {
            if (item.handleType == 10060005) {
                coin.push(item.coinCode)
            }
            if (item.handleType == 10060010) {
                fiat.push(item.coinCode)
            }
            if (item.handleType == 10060015) {
                leverage.push(item.coinCode)
            }
        })
        all.push({type: '币币账户', state: coin})
        all.push({type: '法币账户', state: fiat})
        // all.push({type: '杠杆账户', state: leverage})
        return all
    }

    getStatus = () => {
        var that = this
        getCoinStatus({balanceTime: this.balanceTime}).then(res => {
            let resData = res.data.data//Normal abnormal
            let normalState = []    //正常
            let abnormalState = []  //异常
            Object.keys(resData).forEach(function (key) {

                if (key == 10100005) { // 正常的数据
                    normalState = that.getStateArr(resData[key])
                }
                if (key == 10100010) { // 异常的数据
                    abnormalState = that.getStateArr(resData[key])
                }
            });
            this.setState({
                normalState,
                abnormalState
            })
        })
    }

    getListData = () => {
        coinBalanceRecordlist({
            pageNo: this.state.pageNo,
            pageSize: 10,
            coinCode: this.coinCode,
            balanceTime: this.balanceTime,
            userId: this.itemData.userId,
            handleType: this.uhandleType
        }).then(res => {
            if (res.status == 200) {
                res.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    listData: res.data.data,
                    total: res.data.total && res.data.total
                })
            }
        })
    }

    getData() {
        this.setState({showLoading: true})
        balanceList({
            userId: this.itemData.userId,
            balanceTime: this.balanceTime,
            coinCode: this.coinCode
        }).then((res) => {
            let tem = []
            if (res.status == 200) {
                //console.log(res)
                if (res.data.data.length == 0) {
                    message.warning('没有查询到相关表数据')
                    this.setState({
                        balanceData: [],
                    })
                } else {
                    this.setState({
                        balanceData: res.data.data,
                    })
                }
                this.getListData()
                this.getStatus()
            }
            this.setState({showLoading: false})
        })
    }

    onChangePagintion = (e) => {
        this.setState({pageNo: e}, () => {
            this.getData()
        })
    }

    renderUserList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>

                <TableView columns={columns} data={this.state.listData} total={this.state.total}
                           pageNo={this.state.pageNo}
                           hiddenSelection={true}
                           pageSize={this.state.pageSize}
                           onChangePagintion={this.onChangePagintion}
                />
            </div>
        )
    }
    explainBar = () => {
        return (
            <div className='cb-explain'>
                {this.explainBarItem(this.state.normalState, '正常状态')}
                {this.explainBarItem(this.state.abnormalState, '异常状态')}
            </div>
        )
    }
    explainBarItem = (data, title) => {
        return <div key={title} className='cb-explain-item'>
            <divtitle style={{color: title == '异常状态' ? '#cc383d' : '#000'}}>{title}</divtitle>
            ：
            {data.map((items, index) => <div
                style={{
                    display: 'flex',
                    flexDirection: 'row'
                }}> {items.type}({items.state.map((i, index) =>
                <div key={items}
                     style={{
                         display: 'flex',
                         flexDirection: 'row'
                     }}>{i}{items.state.length - 1 == index ? null : `、`}</div>)}){data.length - 1 == index ? ' 。' : ` , `} </div>)}
        </div>
    }
    renderItemRow = (obj) => {
        return (
            <div key={obj.startTitle} className='cd-item-row'>
                <div className='cd-item-row-table'>
                    <div className='cb-item-text-lift'>{obj.startTitle}</div>
                    <div className='cb-item-text-right'>{obj.startData}</div>
                </div>
                <div className='cd-item-row-table'>
                    <div className='cb-item-text-lift'>{obj.endTitle}</div>
                    <div className='cb-item-text-right' style={{position: 'relative'}}>
                        <div style={{flex: 1}}>{obj.endData}</div>

                        {obj.item && obj.endTitle == '期末金额' &&
                        <a style={{
                            backgroundColor: '#fff',
                            color: '#2c3bfb',
                            flex: 1,
                            position: 'absolute',
                            right: '3px',
                            zIndex: 1000
                        }}
                           onClick={() => {
                               this.state.balanceData.forEach(item => {
                                   if (item.handleType == obj.index) {
                                       this.editItem = item
                                   }
                               })
                               this.setState({showModal: true})
                           }
                           }>更正</a>}
                    </div>
                </div>
            </div>
        )
    }

    renderTable = (items, index) => {
        let item = null
        items.forEach(i => {
            if (i.handleType == index) {
                item = i
            }
        })
        return (
            <div key={item + index} className='cb-table-view-item'
                // style={{marginLeft: index == 1 ? '20px' : '0px', marginRight: index == 1 ? '20px' : '0px'}}
            >
                {getCoinBalanceState(index)}
                {this.renderItemRow({
                    startTitle: '期初时间',
                    startData: this.balanceTime + ' 00:00:00',
                    endTitle: '期末时间',
                    endData: '23:59:59'
                })}
                {this.renderItemRow({
                    startTitle: '期初金额',
                    startData: item && item.beginAmount || 0,
                    endTitle: '期末金额',
                    endData: item && item.endAmount || 0,
                    index: item && item.handleType || 0,
                    item: item
                })}
                {this.renderItemRow({
                    startTitle: '',
                    startData: '',
                    endTitle: '实际金额',
                    endData: item && item.currentAmount || 0
                })}
                {this.renderItemRow({
                    startTitle: '',
                    startData: '',
                    endTitle: '资金偏差',
                    endData: item && item.deviationAmount || 0
                })}
                <div style={{height: '15px', backgroundColor: '#a8a8a8'}}></div>
                {this.renderItemRow({
                    startTitle: '网络转入',
                    startData: item && item.networkInAmount || 0,
                    endTitle: '网络转出',
                    endData: item && item.networkOutAmount || 0
                })}
                {this.renderItemRow({
                    startTitle: '平台转入',
                    startData: item && item.platformInAmount || 0,
                    endTitle: '平台转出',
                    endData: item && item.platformOutAmount || 0
                })}
                {this.renderItemRow({
                    startTitle: '交易买入',
                    startData: item && item.tradeBuyAmount || 0,
                    endTitle: '交易卖出',
                    endData: item && item.tradeSellAmount || 0
                })}
                {this.renderItemRow({
                    startTitle: '佣金',
                    startData: item && item.commisionAmount || 0,
                    endTitle: '手续费',
                    endData: item && item.poundageAmount || 0
                })}
                {this.renderItemRow({
                    startTitle: '账户划入',
                    startData: item && item.accountInAmount || 0,
                    endTitle: '账户划出',
                    endData: item && item.accountOutAmount || 0
                })}
                {this.renderItemRow({
                    startTitle: '解冻金额',
                    startData: item && item.unfreezeAmount || 0,
                    endTitle: '冻结金额',
                    endData: item && item.freezeAmount || 0
                })}
                {this.renderItemRow({
                    startTitle: '手工加币',
                    startData: item && item.mhAddAmount || 0,
                    endTitle: '手工减币',
                    endData: item && item.mhSubAmount || 0
                })}
            </div>
        )
    }
    close = () => {
        this.selectItemIndex = null
        this.setState({showModal: false})
    }
    renderModal = () => {
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={this.close}
                title={""}

                visible={this.state.showModal}
                onChange={this.close}
                footer={null}
            >
                <div className='cp-modal'>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div style={{marginRight: '15px',}}>更正:</div>
                        <InputNumber min={0} onChange={(e) => {
                            this.setState({afterAmount: e})
                        }}/>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button onClick={this.postData} style={{marginTop: '15px', marginRight: '15px'}}>确定</Button>
                        <Button onClick={this.close} style={{marginTop: '15px'}}>取消</Button>
                    </div>
                </div>
            </Modal>
        )

    }
    postData = () => {
        let time = this.balanceTime
        //console.log(this.balanceTime)
        time = time.replace('/', '-').replace('/', '-')
        //console.log(time)
        coinBalanceCorrect({
            afterAmount: this.state.afterAmount,
            balanceTime: time,
            coinCode: this.coinCode,
            id: this.editItem.id,
            beforeAmount: this.editItem.endAmount,
            version: this.editItem.version,
            handleType: this.editItem.handleType,
            userId: this.itemData.userId
        }).then(res => {
            message.success('修改成功')
            this.setState({
                showModal: false
            }, () => {
                this.getData()
            })
        })
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                <div style={{padding:"10px 20px",borderTop:"1px solid #d9d9d9"}}>
                    <span style={{marginRight:'30px'}}>用户ID：{this.uId}</span>
                    <span style={{marginRight:'30px'}}>姓名：{this.uName}</span>
                    <span style={{marginRight:'30px'}}>手机号码：{this.uMobile}</span>
                    <span style={{marginRight:'30px'}}>邮箱：{this.uEmail}</span>
                </div>
                <CashBalanceListSearch handleSearch={this.handleSearch} coinCode={this.coinCode}
                                       balanceTime={this.balanceTime}/>
                {this.renderModal()}
                {this.explainBar()}
                <Spin spinning={this.state.showLoading}>
                    <div className='cb-table-view'>
                        <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                            {this.renderTable(this.state.balanceData, 10060005)}
                            {this.renderTable(this.state.balanceData, 10060010)}
                        </div>
                        <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                            {this.renderTable(this.state.balanceData, 10060015)}
                            <view style={{flex: 1}}/>
                        </div>
                    </div>

                    {this.renderUserList()}
                </Spin>
            </div>
        )
    }
}
const getCoinBalanceState = (text) => {
    let state = ''
    CoinBalanceState.forEach(item => {
        if (text == item.dicKey) {
            state = item.dicName
        }
    })
    return state
}
const columns = [
    {
        width: 70,
        title: '序号',
        dataIndex: 'index',
    }
    ,
    {
        title: '更正后的金额',
        dataIndex: 'afterAmount',
        key: 'afterAmount',
    }
    ,
    {
        title: '结算日期',
        dataIndex: 'balanceTime',
        key: 'balanceTime',
    }
    ,
    {
        title: '更正前金额',
        dataIndex: 'beforeAmount',
        key: 'beforeAmount',
    }
    ,
    {
        title: '币种',
        dataIndex: 'coinCode',
        key: 'coinCode',

    }
    ,
    {
        title: '账户',
        dataIndex: 'handleType',
        key: 'handleType',
        render: (text, r) => {
            return <div>{getCoinBalanceState(text)}</div>
        }
    }

    ,
    {
        title: '操作人',
        dataIndex: 'operationName',
        key: 'operationName',
    }

];