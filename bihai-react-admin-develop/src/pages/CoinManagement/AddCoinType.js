import {Form, Spin, message, Input, Button, Select} from 'antd';
import React, {Component} from 'react';
import {coininfoList, coininfoUpload} from '../../requests/http-req'
import Breadcrumb from '../../components/Breadcrumb.js'
import TableView from '../../components/TableView'
import history from '../../history.js'
import {
    Link
} from 'react-router-dom'
import Number from '../../utils/Number.js'

const Option = Select.Option;


const FormItem = Form.Item;

export default class AddCoinTypeEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 0,
            total: 0,
            pageSize: 10,
            listData: [],
            coinCode: null,
            coinStatus: null,
            isLoading: false
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()
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
                //  onSubmit={() => this.handleSearch}
            >
                <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label="币种名称"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Input onChange={(e) => {this.setState({coinCode: e.target.value})
                    }} value={this.state.coinCode} style={{width: '100%'}}/>
                </FormItem>
                <FormItem
                    style={{margin: 'auto', flex: 1, paddingRight: '15px'}}
                    label="币种状态"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Select onChange={(e) => this.setState({coinStatus: e})} value={this.state.coinStatus}>
                        <Option key={1232} value={null}>全部</Option>
                        <Option value="1">启用</Option>
                        <Option value="0">禁用</Option>
                    </Select>
                </FormItem>
                <div style={{flex: 2}}/>
                <Button onClick={() => this.getData()} type="primary" icon="search" style={{marginRight: '15px',}}>搜索</Button>
            </Form>
        )
    }
    getData = () => {
        this.setState({isLoading: true})
        coininfoList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            coinStatus: this.state.coinStatus,
            coinCode: this.state.coinCode && this.state.coinCode.trim(),
        }).then((req) => {
            //console.log(req)
            if (req.status == 200) {
                let temArr = null
                req.data.data.forEach(((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                    item.coinStatus == 1 ? item.coinStatus = '启动' : item.coinStatus = '禁止'
                    item.isdraw == 1 ? item.isdraw = '是' : item.isdraw = '否'         //提现
                    item.isrecharge == 1 ? item.isrecharge = '是' : item.isrecharge = '否'//充值
                    item.istrade == 1 ? item.isrecharge = '是' : item.istrade = '否' //交易
                }))
                this.setState({
                    listData: req.data.data,
                    total: req.data.total,
                    isLoading: false
                })
            }
        }).catch(e => {
            if (e) {
                message.warning('获取失败')
                this.setState({isLoading: false})
            }
        })
    }

    componentWillUnmount() {
    }

    addCoin = () => {
        history.push('/index/MoneyManagement/AddCoinTypeEdit')
    }
    onChangePagintion = (e) => {
        this.setState({
            pageNo: e
        }, () => {
            this.getData()
        })
    }
    onSelectedRowKeys = (e) => {
        this.selectedRowKeys = e
    }
    startCoin = (e) => {
        if (this.selectedRowKeys.length == 1) {
            let itemData = this.state.listData[this.selectedRowKeys[0]]
            itemData.isdraw = itemData.isdraw == '是' ? 1 : 0
            itemData.isrecharge = itemData.isrecharge == '是' ? 1 : 0
            itemData.istrade = itemData.istrade == '是' ? 1 : 0

            itemData.coinStatus = e ? 1 : 0
            itemData.logoUrl=null
            coininfoUpload(itemData).then((req) => {
                if (req.status == 200) {
                    //console.log(req)
                    message.success('更新成功')
                    this.getData()
                }
                this.selectedRowKeys = []
            })
        } else {
            message.error('请选择一个条目')
        }

    }


    render() {
        return (
            <div className='center-user-list'>
                <Spin spinning={this.state.isLoading} style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                    <Breadcrumb data={window.location.pathname}/>
                    {this.renderSearch()}
                    <div style={{display: 'flex', flexDirection: 'row', padding: '20px'}}>
                        <Button onClick={this.addCoin} style={{marginRight: '15px'}}>添加币种</Button>
                        <Button onClick={() => this.startCoin(true)} style={{marginRight: '15px'}}>启动</Button>
                        <Button onClick={() => this.startCoin(false)} style={{marginRight: '15px'}}>禁用</Button>
                    </div>
                    <TableView onChangePagintion={this.onChangePagintion} onSelectedRowKeys={this.onSelectedRowKeys}
                               columns={columns} data={this.state.listData}
                               pageNo={this.state.pageNo}
                               total={this.state.total}/>
                </Spin>
            </div>
        )
    }
}
const columns = [
    {
        title: '序号',
        dataIndex: 'index',

    }
    ,
    {
        title: 'logo',
        dataIndex: 'logoUrl',
        key: 'logoUrl',
        render: (text, record) => (
            <img src={text} style={{backgroundColor: '#42dbfb', height: '15px', width: '15px'}}></img>
        )
    },
    {
        title: '币种',
        dataIndex: 'coinCode',
        key: 'coinCode',
    },
    {
        title: '排序',
        dataIndex: 'sortNo',
        key: 'sortNo',
    }
    ,
    {
        title: '全称',
        dataIndex: 'coinFullName',
        key: 'coinFullName',
    }
    ,
    {
        title: '状态',
        dataIndex: 'coinStatus',
        key: 'coinStatus',
    }
    ,
    {
        title: '市场货币',
        dataIndex: 'isMarketCoin',
        key: 'isMarketCoin',
        render: (text, r) => <div>{text == 1 ? '是' : '否'}</div>
    },
    {
        title: '所属种类',
        dataIndex: 'coinKind',
        key: 'coinKind',
    }
    ,
    {
        title: '是否可充值',
        dataIndex: 'isrecharge',
        key: 'isrecharge',
    }
    ,
    {
        title: '是否可提现',
        dataIndex: 'isdraw',
        key: 'isdraw',
    }
    ,
    {
        title: '最小提现',
        dataIndex: 'drawMin',
        key: 'drawMin',
        render: (text, r) => <div>{Number.scientificToNumber(text)}</div>
    }
    ,
    {
        title: '最大提现',
        dataIndex: 'drawMax',
        key: 'drawMax',
    }
    ,
    {
        title: '操作',
        key: 'createTime3',
        fixed: 'right',
        width: 70,
        // render: (text, record) => (<Link to={'/index/MoneyManagement/ReviewPage'}>操作</Link>)
        render: (text, record) => (
            <Link to={{pathname: '/index/MoneyManagement/AddCoinTypeEdit', state: {data: record}}}>详情</Link>
        )
    }

];