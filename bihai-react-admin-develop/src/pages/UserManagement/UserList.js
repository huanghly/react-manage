/** eslint-disable react/require-render-return,react/jsx-no-undef **/
/**
 * Created by liu 2015/5/14
 **/
import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Button, Modal, message, Checkbox} from 'antd';
import './UserList/user-list.css';
import TableView from '../../components/TableView'
import moment from 'moment'
import {
    userInfoList,
    kickDown,
    resetTradePwd,
    resetLoginPwd,
    resetGoogle, updatUeserStatus, userListExcel
} from '../../requests/http-req.js'
import Breadcrumb from '../../components/Breadcrumb.js'
import NewUserListSearch from '../../components/SearchView/UserListSearch.js'
import {Link} from 'react-router-dom'
import {FormattedMessage, injectIntl} from 'react-intl';

class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listData: [],
            showModal: false,
            isLoading: false,
            total: 0,
            pageNo: 0,
            disabledState: null, //禁用 状态 交易状态 0 禁用 1启动
            withdrawState: null, //提币状态
            tradeState: null,    //交易状态
            isTradeFee: null, //交易手续费
            isCashFee: null,  //提现手续费
            selectedRowKeys: [],
        }
    }

    selectedRowKeys = []

    componentWillMount() {
        this.setState({isLoading: true})
        //console.log(this.props)

    }

    componentDidMount() {
        this.getData({pageNo: 0, pageSize: 20})
        console.log(this);
    }

    onChangePagintion = (e) => {
        this.state.pageNo = e
        this.getData({pageNo: e, pageSize: 10})
    }

    onSelectedRowKeys = (selectedRowKeys) => {
        //    //console.log(selectedRowKeys)
        this.selectedRowKeys = selectedRowKeys
    }
    onKickDown = () => {
        // //console.log(this.selectedRowKeys)
        if (this.selectedRowKeys.length > 1 || this.selectedRowKeys.length == 0) {
            //message.warning(<FormattedMessage id='hello' />)
            message.warning('选择一个用户~')
        } else {
            const id = this.state.listData[this.selectedRowKeys[0]].userId
            kickDown(id).then((res) => {
                message.success('已经踹下线了')

            })
        }
    }
    onResetLogin = () => {

        if (this.selectedRowKeys.length > 1 || this.selectedRowKeys.length == 0) {
            message.warning('选择一个用户~')
        } else {
            const id = this.state.listData[this.selectedRowKeys[0]].userId
            let object = {userId: id}
            resetLoginPwd(JSON.stringify(object)).then((res) => {
                message.success('已重置')

            })
        }
    }
    onResetTrade = () => {

        if (this.selectedRowKeys.length > 1 || this.selectedRowKeys.length == 0) {
            message.warning('选择一个用户~')
        } else {
            const id = this.state.listData[this.selectedRowKeys[0]].userId
            let object = {userId: id}
            resetTradePwd(JSON.stringify(object)).then((res) => {
                message.success('已重置')

            })
        }
    }
    onResetGoogle = () => {
        if (this.selectedRowKeys.length > 1 || this.selectedRowKeys.length == 0) {
            message.warning('选择一个用户~')
        } else {
            const id = this.state.listData[this.selectedRowKeys[0]].userId
            let object = {userId: id}
            resetGoogle(JSON.stringify(object)).then((res) => {
                alert(123)
                message.success('已重置')
            })
        }
    }


    renderUserList = () => {
        return (
            <div style={{display: 'flex', flexDirection: 'column', margin: '10px auto 20px'}}>
                <div className='row-user'>
                    <Button onClick={this.showModal} style={{margin: '0 5px'}}>用户权限</Button>
                    <Button onClick={this.onKickDown} style={{margin: '0 5px'}}>踢下线</Button>
                    <Button onClick={this.onResetLogin} style={{margin: '0 5px'}}>重置登录密码</Button>
                    <Button onClick={this.onResetTrade} style={{margin: '0 5px'}}>重置支付密码</Button>
                    <Button onClick={this.onResetGoogle} style={{margin: '0 5px'}}>重置google</Button>
                    <Button onClick={this.exportMyExcel} style={{margin: '0 5px'}}>导出</Button>
                </div>
                <Spin spinning={this.state.isLoading}>
                    <TableView onChangePagintion={this.onChangePagintion} onSelectedRowKeys={this.onSelectedRowKeys}
                               columns={columns} data={this.state.listData} pageNo={this.state.pageNo}
                               minWidth={1800}
                               total={this.state.total}/>
                </Spin>
            </div>
        )
    }
    renderBreadcrumb = () => {
        const pathname = window.location.pathname
        return (
            <Breadcrumb data={pathname}/>
        )
    }

    showModal = () => {
        //必须选择一个用户
        if (this.selectedRowKeys.length > 1 || this.selectedRowKeys.length == 0) {
            message.warning('选择一个用户~')
        } else {
            let item = this.state.listData[this.selectedRowKeys[0]];
            this.setState({
                disabledState: item.isNormalLogin,
                withdrawState: item.isWithdrawCash,
                tradeState: item.isNormalTrade,
                isTradeFee: item.isTradeFee,
                isCashFee: item.isCashFee,
                showModal: !this.state.showModal
            })
        }
    }
    closeModal = () => {
        this.setState({showModal: !this.state.showModal})
        this.selectedRowKeys = []
        this.state.disabledState = null,
            this.state.withdrawState = null,
            this.state.tradeState = null
    }

    onChangeCheck = (e) => {
        if (e == 'disabledState') {
            this.setState({
                disabledState: !this.state.disabledState
            })
        } else if (e == 'withdrawState') {
            this.setState({
                withdrawState: !this.state.withdrawState
            })
        } else if (e == 'tradeState') {
            this.setState({
                tradeState: !this.state.tradeState
            })
        } else if (e == 'isTradeFee') {
            this.setState({
                isTradeFee: !this.state.isTradeFee
            })

        } else if (e == 'isCashFee') {
            this.setState({
                isCashFee: !this.state.isCashFee
            })
        }
    }
    changeStatus = () => {
        //修改状态
        let item = this.state.listData[this.selectedRowKeys[0]]
        if (item.isCashFee != this.state.isCashFee || item.isTradeFee != this.state.isTradeFee || item.isNormalLogin != this.state.disabledState || item.isWithdrawCash != this.state.withdrawState || item.isNormalTrade != this.state.tradeState) {
            updatUeserStatus({
                isCashFee: this.state.isCashFee ? 1 : 0,
                isNormalLogin: this.state.disabledState ? 1 : 0,
                isNormalTrade: this.state.tradeState ? 1 : 0,
                isTradeFee: this.state.isTradeFee ? 1 : 0,
                isWithdrawCash: this.state.withdrawState ? 1 : 0,
                userId: item.userId
            }).then(res => {
                res.status == 200 ? this.getData() : message.error('修改状态失败')
            })
        } else {
            message.success('没有修改')
        }
        // if (item.isNormalLogin != this.state.disabledState) {
        //     loginStatus({status: this.state.disabledState ? 1 : 0, userId: item.userId}).then(res => {
        //         res.status == 200 ? this.getData() : message.error('修改状态失败')
        //     })
        // }
        // if (item.isWithdrawCash != this.state.withdrawState) {
        //     withdrawStatus({status: this.state.withdrawState ? 1 : 0, userId: item.userId}).then(res => {
        //         res.status == 200 ? this.getData() : message.error('修改状态失败')
        //     })
        // }
        // if (item.isNormalTrade != this.state.tradeState) {
        //     tradeStatus({status: this.state.tradeState ? 1 : 0, userId: item.userId}).then(res => {
        //         res.status == 200 ? this.getData() : message.error('修改交易状态失败')
        //     })
        // }
        // if (item.isTradeFee != this.state.isTradeFee) {
        //     tradeFeeStatus({status: this.state.isTradeFee ? 1 : 0, userId: item.userId}).then(res => {
        //         res.status == 200 ? this.getData() : message.error('修改交易手续费失败')
        //     })
        // }
        // if (item.isCashFee != this.state.isCashFee) {
        //     cashFeeStatus({status: this.state.isCashFee ? 1 : 0, userId: item.userId}).then(res => {
        //         res.status == 200 ? this.getData() : message.error('修改提现手续费失败')
        //     })
        // }

        this.closeModal()
        //   this.changeNumber != 0 ? this.getData() : null

    }
    renderModal = () => {
        return (
            <Modal
                width={800}
                destroyOnClose={true}
                onCancel={this.closeModal}
                title="用户权限"
                visible={this.state.showModal}
                onChange={this.onChange}
                footer={null}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexDirection: 'columns'
                }}>
                    <div>
                        <Checkbox defaultChecked={!this.state.disabledState} disabled={false}
                                  onChange={() => this.onChangeCheck('disabledState')}>禁止登录</Checkbox>
                        <Checkbox defaultChecked={!this.state.withdrawState}
                                  onChange={() => this.onChangeCheck('withdrawState')}>禁止提币</Checkbox>
                        <Checkbox defaultChecked={!this.state.tradeState}
                                  onChange={() => this.onChangeCheck('tradeState')}>禁止交易</Checkbox>
                        <Checkbox defaultChecked={!this.state.isTradeFee}
                                  onChange={() => this.onChangeCheck('isTradeFee')}>免交易手续费</Checkbox>
                        <Checkbox defaultChecked={!this.state.isCashFee}
                                  onChange={() => this.onChangeCheck('isCashFee')}>免提现手续费</Checkbox>
                    </div>
                    <Button style={{width: '100px', marginLeft: '30px'}}
                            onClick={this.changeStatus}>确认</Button>
                </div>
            </Modal>
        )
    }
    handleSearch = (e, id) => {
        ////console.log(JSON.stringify(e))
        this.state.pageNo = 0
        //拼装请求格式
        this.searchData = e
        this.getData()

    }
    exportMyExcel = () => {
        if (!this.state.listData || this.state.listData.length == 0) {
            message.warning('没有数据')
            return
        }
        this.setState({isLoading: true})

        let data = this.searchData || []
        let startTime = data.date && data.date[0] ? JSON.stringify(data.date[0]).slice(1, 11) : null
        let endTime = data.date && data.date[1] ? JSON.stringify(data.date[1]).slice(1, 11) : null
        if (startTime) {
            startTime = startTime + ' 00:00:00'
        }
        if (endTime) {
            endTime = endTime + ' 23:59:59'
        }
        let req = {
            pageNo: 0,
            pageSize: 0,
            mobile: data.mobile && data.mobile.trim() || null,
            email: data.email && data.email.trim() || null,
            primaryAuth: data.primaryAuth || null,
            seniorAuth: data.seniorAuth || null,
            startTime: startTime,
            endTime: endTime,
        }
        let formData = new FormData()
        formData.append('mobile', data.mobile && data.mobile.trim() || null)
        formData.append('email', data.email && data.email.trim() || null)
        formData.append('primaryAuth', data.primaryAuth || null)
        formData.append('seniorAuth', data.seniorAuth || null)
        formData.append('startTime', startTime)
        formData.append('endTime', endTime)
        formData.append('pageNo', 0)
        formData.append('pageSize', 0)
        userListExcel(req).then(result => {
            if (result.status === 200) {
                var url = window.URL.createObjectURL(result.data);
                var a = document.createElement('a');
                a.href = url;
                a.download = moment().format('YYYYMMDD_HHMMSS') + ".xlsx";
                a.click();
            }
            this.setState({isLoading: false})
        }).catch(e => {
            if (e) {
                message.error('导出失败')
                this.setState({isLoading: false})

            }
        })
    }
    getData = () => {
        let data = this.searchData || []
        this.setState({isLoading: true})
        let startTime = data.date && data.date[0] ? JSON.stringify(data.date[0]).slice(1, 11) : null
        let endTime = data.date && data.date[1] ? JSON.stringify(data.date[1]).slice(1, 11) : null
        if (startTime) {
            startTime = startTime + ' 00:00:00'
        }
        if (endTime) {
            endTime = endTime + ' 23:59:59'
        }

        userInfoList({
            pageNo: this.state.pageNo,
            pageSize: 10,
            mobile: data.mobile && data.mobile.trim() || null,
            email: data.email && data.email.trim() || null,
            primaryAuth: data.primaryAuth || null,
            seniorAuth: data.seniorAuth || null,
            startTime: startTime,
            endTime: endTime,
        }).then((res) => {
            let listData = []
            let total = 0
            if (res.status == 200) {
                let temArr = res.data.data
                console.log(res.data.data);
                //let temArr = res.data.data
                total = res.data.total
                if (temArr.length == 0) {
                    message.info('没有查询到相关数据')
                }
                temArr.forEach((item, index) => {
                    //TODO 是否登录 提现
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1;
                    ////高级认证状态，0：未认证，1：待审核，2：未通过，3：通过
                    if (item.credentialsType == 0) {
                        item.credentialsType = "身份证"
                    } else if (item.credentialsType == 1) {
                        item.credentialsType = "护照"
                    }
                    if (item.primaryAuth == 1 || item.primaryAuth == true) {
                        item.primaryAuth = "已认证"
                    } else {
                        item.primaryAuth = "未认证"
                    }
                    if (item.seniorAuth == 0) {
                        item.seniorAuth = "未提交"
                    } else if (item.seniorAuth == 1) {
                        item.seniorAuth = "待审核"
                    } else if (item.seniorAuth == 2) {
                        item.seniorAuth = "未通过"
                    } else if (item.seniorAuth == 3) {
                        item.seniorAuth = "通过"
                    }
                    listData.push(item)
                })
            }

            //添加key 没有计算
            this.setState({
                listData: listData,
                isLoading: false,
                total
            })
        })
    }

    render() {
        return (
            <div className='center-user-list'>
                {this.renderModal()}
                {this.renderBreadcrumb()}

                {/*{this.renderSearchView()}*/}
                <NewUserListSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: '60px',
        fixed: 'left',
        key: 'index',
    }
    ,
    {
        title: '用户ID',
        dataIndex: 'userId',
        width: '60px',
        key: 'userId',
        // render: text => <a style={{color: 'red', fontSize: '10px'}} href="#">{text}</a>,
    }
    ,
    {
        title: '用户等级',
        dataIndex: 'userLevel',
        key: 'userLevel',
        //  sorter: (a, b) => a.mobie - b.mobie,
        //   sortOrder: null,
    }
    ,
    {
        title: '等级名称',
        dataIndex: 'levelName',
        key: 'levelName',
        //  sorter: (a, b) => a.mobie - b.mobie,
        //   sortOrder: null,
    }
    ,
    {
        title: '手机号',
        dataIndex: 'mobile',
        key: 'mobile',
        //  sorter: (a, b) => a.mobie - b.mobie,
        //   sortOrder: null,
    }
    , {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        //  sorter: (a, b) => a.mobie - b.mobie,
        //   sortOrder: null,
    }
    ,
    {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName'
    }
    , {
        title: '真实姓名',
        width: '110px',
        dataIndex: 'userName',
        key: 'loginName'
    }
    ,
    {
        title: '国籍',
        width: '60px',
        dataIndex: 'country',
        key: 'country',
    }
    ,
    {
        title: '证件类型',
        width: '100px',
        dataIndex: 'credentialsType',
        key: 'credentialsType',
    }
    ,
    {
        title: '证件号',
        width: '120px',
        dataIndex: 'credentialsCode',
        key: 'credentialsCode',
    },
    {
        title: '注册时间',
        dataIndex: 'regTime',
        key: 'regTime',
    }
    ,
    {
        title: '初级认证',
        dataIndex: 'primaryAuth',
        key: 'primaryAuth',
    }
    ,
    {
        title: '高级认证',
        dataIndex: 'seniorAuth',
        key: 'seniorAuth',
    }
    ,
    {
        title: '登录状态',
        dataIndex: 'isNormalLogin',
        key: 'isNormalLogin',
        render: (text, record) => (
            <div>{text ? '允许' : '禁用'}</div>
        )
    },
    {
        title: '提现状态',
        dataIndex: 'isWithdrawCash',
        key: 'isWithdrawCash',
        render: (text, record) => (
            <div>{text ? '允许' : '禁用'}</div>
        )
    }
    ,
    {
        title: '操作',
        key: 'operation0',
        fixed: 'right',
        width: 70,
        render: (text, record) => (
            <Link to={{pathname: '/index/user/userDetail', state: {data: record}}}>详情</Link>
        )
    }
];
export default injectIntl(UserList)