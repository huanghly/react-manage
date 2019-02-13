/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker,message,Button} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import WithdrwaInfoSearch from '../../components/SearchView/WithdrwaInfoSearch.js'
import {coindrawList,coindrawListExcel, getDickey, getCodeType} from '../../requests/http-req.js'
import ConfigNet, {StatusMap, CoinDrawStatus} from '../../networking/ConfigNet'
import {
    Link
} from 'react-router-dom'
import Number from '../../utils/Number.js'
import moment from 'moment'
var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null


export default class WithdrawMoneyInfo extends Component {
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

        this.getData()
    }

    handleSearch = (values, id) => {//.slice(1, 11)
        this.state.pageNo = 0
// //console.log(moment.format(values.date[0]))
        let beginTime = values.date && values.date[0] ? JSON.stringify(values.date[0]).slice(1, 11).replace(/-/g, '/') : null
        let endTime = values.date && values.date[1] ? JSON.stringify(values.date[1]).slice(1, 11).replace(/-/g, '/') : null
        if (beginTime) {
            beginTime = beginTime + ' 00:00:00'
        }
        if (endTime) {
            endTime = endTime + ' 23:59:059'
        }
        let tem = {
            drawId: values.drawId,
            userId: id,
            coinCode: values.coinCode,
            drawType: values.drawType,
            beginTime: beginTime,
            endTime: endTime,
            coinDrawStatus: values.coinDrawStatus
        }
        this.searchData = tem

        this.state.pageNo = 0
        this.getData(tem)

    }

    getData() {
        let temArr = {
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
            drawId: this.searchData && this.searchData.drawId || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            drawType: this.searchData && this.searchData.drawType || null,
            coinDrawStatus: this.searchData && this.searchData.coinDrawStatus || null,
        }
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }

        this.setState({showLoading: true})
        coindrawList(temArr).then((req) => {
            let tem = []
            if (req.status == 200) {
                req.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    listData: req.data.data,
                    total: req.data.total
                })
            }
            this.setState({showLoading: false})
        })
    }
    coindrawListExcel() {
        if (!this.state.listData || this.state.listData.length == 0) {
            message.warning('没有数据')
            return
        }
        let temArr = {
            pageNo: 0,
            pageSize: 0,
            drawId: this.searchData && this.searchData.drawId || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            drawType: this.searchData && this.searchData.drawType || null,
            coinDrawStatus: this.searchData && this.searchData.coinDrawStatus || null,
        }
        if (this.searchData && this.searchData.beginTime) {
            temArr.beginTime = this.searchData.beginTime
        }
        if (this.searchData && this.searchData.endTime) {
            temArr.endTime = this.searchData.endTime
        }

        this.setState({showLoading: true})
        coindrawListExcel(temArr).then(result => {
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
                            onClick={() => this.coindrawListExcel()}>导出</Button>
                    <TableView columns={columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               minWidth={1600}
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
                <WithdrwaInfoSearch handleSearch={this.handleSearch}/>
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
        title: '提现单号',
        dataIndex: 'drawId',
        key: 'drawId',

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
        title: '提现类型',
        dataIndex: 'drawType',
        key: 'drawType',
        render: (text, record) => {
            return <div>{getCoinDrawStatus(text)}</div>
        }
    }
    ,

    {
        title: '提现状态',
        dataIndex: 'coinDrawStatus',
        key: 'drawAmount',
        render: (text, record) => {
            return <div>{getDrawType(text)}</div>
        }
    }
    ,
    {
        title: '金额',
        dataIndex: 'drawAmount',
        key: 'drawAmount', render: (text, r) => {
        return <div>{Number.scientificToNumber(text)}</div>
    }
    }
    ,
    {
        title: '手续费',
        dataIndex: 'poundageAmount',
        key: 'poundageAmount', render: (text, r) => {
        return <div>{Number.scientificToNumber(text)}</div>
    }
    },

    {
        title: '申请时间',
        dataIndex: 'drawTime',
        key: 'drawTime',
        // render: (text, record) => (<Link to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
    }
    ,

    {
        title: '提现地址',
        dataIndex: 'drawAdd',
        key: 'drawAdd',
        // render: (text, record) => (<Link to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
    },

    {
        title: '操作',
        fixed: 'right',
        width:70,
        render: (record) => (
            <Link to={{pathname: '/index/MoneyManagement/ReviewPage', state: {data: record, selectStep: 1}}}>查看</Link>
        )
    }
];
const getDrawType = (text) => {
    let tem = ''
    StatusMap.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}
const getCoinDrawStatus = (text) => {
    let tem = '00'
    CoinDrawStatus.forEach(item => {
        if (item.dicKey == text) {
            tem = item.dicName
        }
    })
    return tem
}
