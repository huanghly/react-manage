/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Layout, DatePicker} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import WaitingFirstrialListSearch from '../../components/SearchView/WaitingFirstrialListSearch.js'
import {getDickey, getCodeType, passFirst} from '../../requests/http-req.js'
import ConfigNet from '../../networking/ConfigNet'
import {
    Link
} from 'react-router-dom'
import moment from 'moment';
import Number from '../../utils/Number'

var {MonthPicker, RangePicker} = DatePicker;
var {Sider, Footer, Content} = Layout;
var sortedInfo = null


const data = null

export default class WaitingFirstrialList extends Component {
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
        //提现类型接口
        getDickey(ConfigNet.TRANSFER_TYPE).then((req) => {
            if (req.status == 200) {
                this.setState({
                    statusMap: req.data.data
                }, () => {
                    this.getData()
                })
            }
        })
    }

    handleSearch = (values, id) => {
        this.state.pageNo = 0

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
            endTime: endTime
        }
        this.getData(tem)
    }

    getData(data) {

        let temArr = {
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
            // coinDrawStatus: ConfigNet.WAITING_FIRST_TRIAL,
            drawId: data && data.drawId || null,
            userId: data && data.userId || null,
            coinCode: data && data.coinCode || null,
            drawType: data && data.drawType || null,
        }
        if (data && data.beginTime) {
            temArr.beginTime = data.beginTime
        }
        if (data && data.endTime) {
            temArr.endTime = data.endTime
        }
        //console.log(temArr)

        this.setState({showLoading: true})
        passFirst(temArr).then((req) => {
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


    onChangePagintion = (e) => {
        this.setState({
            pageNo: e
        }, () => {
            this.getData()
        })

    }
    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               minWidth={1658}
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
                <WaitingFirstrialListSearch handleSearch={this.handleSearch}/>
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
        //10020005:平台转账;10020010:网络转出;10020015:账户划出
        title: '提现类型',
        dataIndex: 'drawType',
        render: (text, record) => (<div>{getTextState(text)}</div>)

    }
    ,
    {
        title: '申请金额',
        dataIndex: 'drawAmount',
        key: 'drawAmount', render: (text, r) => {
        return <div>{scientificToNumber(text)}</div>
    }
    }
    ,
    {
        title: '手续费',
        dataIndex: 'poundageAmount',
        key: 'poundageAmount',
        render: (text, r) => {
            return <div>{Number.scientificToNumber(text)}</div>
        }

    }
    ,
    {
        title: '申请时间',
        dataIndex: 'drawTime',
        key: 'drawTime',
    },
    {
        title: '提现地址',
        key: 'drawAdd',
        dataIndex: 'drawAdd',
    },
    {
        title: '操作',
        key: 'createTime',
        width: 70,
        fixed: 'right',
        // render: (text, record) => (<s to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
        render: (text, record) => (
            <Link to={{pathname: '/index/MoneyManagement/ReviewPage', state: {data: record, selectStep: 0}}}>审核</Link>)
    }
];
const getTextState = (text) => {
    if (text == 10020005) {
        return '平台转账'
    } else if (text == 10020010) {
        return '网络转出'

    } else if (text == 10020015) {
        return '账户划出'

    } else {
        return ''

    }
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
