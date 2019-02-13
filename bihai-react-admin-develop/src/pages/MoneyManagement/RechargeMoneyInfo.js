/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker, message, Button} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import RechargeMoneyInfoSearch from '../../components/SearchView/RechargeMoneyInfoSearch.js'
import {rechargeDetail, rechargeDetailExcel} from '../../requests/http-req.js'
import {AddHandleType} from '../../networking/ConfigNet'

import moment from 'moment'

export default class RechargeMoneyInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
        }
    }

    componentDidMount() {
        this.state.pageNo = 0

        this.getData()
    }

    handleSearch = (values, id) => {//.slice(1, 11)
        let beginTime = values.date && values.date[0] ? JSON.stringify(values.date[0]).slice(1, 11).replace(/-/g, '/') : null
        let endTime = values.date && values.date[1] ? JSON.stringify(values.date[1]).slice(1, 11).replace(/-/g, '/') : null
        if (beginTime) {
            beginTime = beginTime + ' 00:00:00'
        }
        if (endTime) {
            endTime = endTime + ' 23:59:059'
        }
        let tem = {
            userId: id,
            coinCode: values.coinCode,
            handleType: values.handleType,
            beginTime: beginTime,
            endTime: endTime,
            coinDrawStatus: values.coinDrawStatus
        }
        this.searchData = tem
        this.getData(tem)
    }

    getData() {
        if (!this.state.listData || this.state.listData.length == 0) {
            message.warning('没有数据')
            return
        }
        let temArr = {
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            handleType: this.searchData && this.searchData.handleType || null,
        }
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }

        this.setState({showLoading: true})
        rechargeDetail(temArr).then((res) => {
            let tem = []
            if (res.status == 200) {
                res.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    listData: res.data.data,
                    total: res.data.total
                })
            }
            this.setState({showLoading: false})
        })
    }

    rechargeDetailExcel() {

        if (!this.state.listData || this.state.listData.length == 0) {
            message.warning('没有数据')
            return
        }
        let temArr = {
            pageNo: 0,
            pageSize: 0,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            handleType: this.searchData && this.searchData.handleType || null,
        }
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }

        this.setState({showLoading: true})
        rechargeDetailExcel(temArr).
        then(result => {
            if (result.status === 200) {
                var url = window.URL.createObjectURL(result.data);
                var a = document.createElement('a');
                a.href = url;
                a.download = moment().format('YYYYMMDD_HHMMSS') + ".xlsx";
                a.click();
            }
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                message.error('导出失败')
                this.setState({showLoading: false})

            }
        })
    }


    onChangePagintion = (e) => {
        this.setState({pageNo: e}, () => {
            this.getData()
        })
    }
    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '10px', marginBottom: '20px'}}>
                    <Button style={{width: 65, marginBottom: 5, marginLeft: 5}}
                            onClick={() => this.rechargeDetailExcel()}>导出</Button>


                    <TableView columns={columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               minWidth={2000}
                               pageSize={this.state.pageSize}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }
    renderBreadcrumb = () => {
        const pathname = window.location.pathname
        return (
            <Breadcrumb data={pathname}/>
        )
    }


    render() {
        return (
            <div className='center-user-list'>
                {this.renderBreadcrumb()}
                <RechargeMoneyInfoSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}


const columns = [
    {
        width: 50,
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
    },
    {
        title: '昵称',
        dataIndex: 'nickName',
        key: 'nickName',
    },
    {
        width: 70,
        title: '姓名',
        dataIndex: 'userName',
        key: 'userName',
    }
    ,
    {
        title: '币种',
        dataIndex: 'coinCode',
        key: 'coinCode',
    },
    {
        title: '充值类型',
        dataIndex: 'handleType',
        key: 'handleType',
        render: (text, record) => {
            return <div>{getHandleType(text)}</div>
        }
    }

    ,
    {
        title: '数量',
        dataIndex: 'amount',
        key: 'amount', render: (text, r) => {
        return <div>{scientificToNumber(text)}</div>
    }
    }
    ,
    {
        title: 'TXID',
        dataIndex: 'txid',
        key: 'txid',
    }
    ,

    {
        title: '入账时间',
        dataIndex: 'createTime',
        key: 'rechargeTime',
        // render: (text, record) => (<Link to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
    },

    {
        title: '充值地址',
        dataIndex: 'rechargeAdd',
        key: 'rechargeAdd',
        // render: (text, record) => (<Link to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
    }

];
const getHandleType = (text) => {
    let tem = ''
    AddHandleType.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}

function scientificToNumber(num) {
    var str = num.toString();
    var reg = /^(\d+)(e)([\-]?\d+)$/;
    var arr, len,
        zero = '';

    /*6e7或6e+7 都会自动转换数值*/
    if (!reg.test(str)) {
        return num;
    } else {
        /*6e-7 需要手动转换*/
        arr = reg.exec(str);
        len = Math.abs(arr[3]) - 1;
        for (var i = 0; i < len; i++) {
            zero += '0';
        }
        return '0.' + zero + arr[1];
    }
}