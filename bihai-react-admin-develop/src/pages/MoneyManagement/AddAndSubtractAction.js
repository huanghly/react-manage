/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Modal, message, Button, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import AddAndSubteactSearch from '../../components/SearchView/AddAndSubteactSearch.js'
import {
    mHList,
    getDickey,
    getCodeType,
    auditeNoPass,
    auditePass,
    cashNoPassCoin,
    cashPassCoin, mhDelete
} from '../../requests/http-req.js'
import History from '../../history'
import {CoinHandleState} from '../../networking/ConfigNet.js'

const RadioGroup = Radio.Group;

const confirm = Modal.confirm;

export default class AddAndSubtractAction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
            showCheckItemModal: false,
            showCashItemModal: false,
            editSelect: null
        }
    }

    selectedRowKeys = []


    componentDidMount() {
        this.getData()
    }

    handleSearch = (values, id) => {
        this.state.pageNo = 0
        let tem = {
            mhId: values.mhId && values.mhId.trim(),
            userId: id,
            coinCode: values.coinCode,
            mhStatus: values.mhStatus,
        }
        this.searchData = tem

        this.getData()
    }

    getData() {
        let temArr = {
            pageNo: this.state.pageNo || 0,
            pageSize: 10,
            mhId: this.searchData && this.searchData.mhId && this.searchData.mhId.trim() || null,
            userId: this.searchData && this.searchData.userId || null,
            coinCode: this.searchData && this.searchData.coinCode || null,
            mhStatus: this.searchData && this.searchData.mhStatus || null,
        }

        this.setState({showLoading: true})
        mHList(temArr).then((req) => {
            if (req.status == 200) {
                req.data.data.forEach((item, index) => {
                    item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
                })
                this.setState({
                    listData: req.data.data,
                    total: req.data.total,
                    showLoading: false
                })
            } else {
                this.setState({showLoading: false})

            }

        }).catch(e => {
            if (e) {
                message.error('服务异常')
                this.setState({showLoading: false})
            }

        })
    }

    onChangePagintion = (e) => {
        this.setState({
            pageNo: e
        }, () => {
            this.getData()
        })
    }
    ///index/MoneyManagement/AddAndSubtractDetail
    gotoDetail = () => {
        History.push('/index/MoneyManagement/AddAndSubtractDetail')
    }
    //审核
    checkItem = () => {
        if (!this.checkSelectRow()) return
        console.log(this.itemData)
        if (this.itemData.mhStatus == 10080005) {
            this.setState({
                showCheckItemModal: true,
                editSelect: null
            })
        } else if (this.itemData.mhStatus == 10080010) {
            message.warning('已通过审核')
        } else {
            message.warning('不支持操作')
        }
    }

    reqCheckItem = () => {
        if (!this.state.editSelect) {
            message.warning('选择状态')
            return
        }
        if (this.state.editSelect == 1) { //通过
            auditePass(this.itemData).then((req) => {
                ////console.log(req)
                this.itemData = null
                this.setState({
                    showCheckItemModal: false
                })
                this.getData()
            }).catch(e => {
                if (e) {
                    message.error('服务异常')
                }
            })
        } else {//不通过
            auditeNoPass(this.itemData).then((req) => {
                ////console.log(req)
                this.itemData = null
                this.setState({
                    showCheckItemModal: false
                })
                this.getData()
            })
        }
    }

    reqCashItem = () => {
        if (!this.state.editSelect) {
            message.warning('选择状态')
            return
        }
        //console.log(this.itemData)
        if (this.state.editSelect == 1) { //通过
            cashPassCoin(this.itemData).then((req) => {
                //console.log(req)

                if (req.status == 200) {
                    this.itemData = null
                    this.setState({
                        showCashItemModal: false
                    })
                    this.getData()
                } else {
                    //console.log(req)
                }

            }).catch(e => {
                if (e) {
                    //console.log(e)

                    message.error('操作失败，余额不足')
                }
            })
        } else {//不通过
            cashNoPassCoin(this.itemData).then((req) => {
                ////console.log(req)
                this.itemData = null
                this.setState({
                    showCashItemModal: false
                })
                this.getData()
            })
        }
    }
    renderCheckItemModal = () => {
        return (
            <Modal
                destroyOnClose={true}
                onCancel={() => {
                    this.setState({showCheckItemModal: false})
                    this.selectedRowKeys = []
                }
                }

                title={"审核操作"}
                visible={this.state.showCheckItemModal}
                onChange={() => {
                    this.setState({showCheckItemModal: false})
                    this.selectedRowKeys = []
                }}
                footer={null}
            >
                <RadioGroup onChange={(e) => this.setState({editSelect: e.target.value})} value={this.state.editSelect}>
                    <Radio value={1}>通过</Radio>
                    <Radio value={2}>不通过</Radio>
                </RadioGroup>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button onClick={this.reqCheckItem} style={{width: '100px', marginLeft: '30px'}}>确认</Button>
                </div>
            </Modal>
        )
    }
    renderCashItemModal = () => {
        return (
            <Modal
                destroyOnClose={true}
                onCancel={() => {
                    this.setState({showCashItemModal: false})
                    this.selectedRowKeys = []
                }}
                title={"发放冻结"}
                visible={this.state.showCashItemModal}
                onChange={() => {
                    this.setState({showCashItemModal: false})
                    this.selectedRowKeys = []
                }}
                footer={null}
            >
                <RadioGroup onChange={(e) => this.setState({editSelect: e.target.value})} value={this.state.editSelect}>
                    <Radio value={1}>通过</Radio>
                    <Radio value={2}>不通过</Radio>
                </RadioGroup>
                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button onClick={this.reqCashItem} style={{width: '100px', marginLeft: '30px'}}>确认</Button>
                </div>
            </Modal>
        )
    }

    //冻结发行
    cashItem = () => {
        if (!this.checkSelectRow()) return
        if (this.itemData.mhStatus == 10080010) {
            this.setState({
                showCashItemModal: true,
                editSelect: null
            })
        } else if (this.itemData.mhStatus == 10080005) {
            message.warning('请先审核')
        } else {
            message.warning('不支持此操作')
        }
    }

    //删除
    delItem = () => {
        // if (!this.checkSelectRow()) return
        let sunArr = []
        let canDel = true
        if (this.selectedRowKeys.length == 0) {
            message.warning('请选择删除的条目')
            return
        }
        this.selectedRowKeys.forEach(item => {
            //console.log(this.state.listData[item].mhStatus)

            if (this.state.listData[item].mhStatus == "10080015" || this.state.listData[item].mhStatus == '10080020') {
                canDel = false
            }
            sunArr.push(this.state.listData[item])
        })
        if (canDel) {
            //console.log(sunArr)
            mhDelete(sunArr).then((req) => {
                ////console.log(req)
                this.itemData = []
                if (req.status == 200) {
                    message.success('操作成功~')
                    this.selectedRowKeys = []
                    this.getData()
                }
            })
        } else {
            message.warning('已发放、已驳回的条目不能删除')
        }


        // if (this.itemData.mhStatus == '已发放' || this.itemData.mhStatus == '已驳回') {
        //     message.warning('选择的条目不能删除')
        // } else {
        //     ////console.log(this.itemData)
        //     let arr=[]
        //
        //     mhDelete(this.itemData).then((req) => {
        //         ////console.log(req)
        //         this.itemData = []
        //         if (req.status == 200) {
        //             message.success('ok')
        //             this.getData()
        //         }
        //     })
        // }
    }

    onSelectedRowKeys = (e) => {
        console.log(e)
        this.selectedRowKeys = e
    }
    checkSelectRow = () => {
        if (this.selectedRowKeys && this.selectedRowKeys.length == 0 || this.selectedRowKeys.length > 1) {
            message.warning('请选择一个操作目标')
            return false
        } else {
            this.itemData = this.state.listData[this.selectedRowKeys[0]]
            console.log(this.itemData)
            return true
        }
    }
    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={this.gotoDetail} style={{marginRight: '5px', marginLeft: '5px'}}>增加</Button>
                    <Button onClick={this.checkItem}
                            style={{marginRight: '5px', marginLeft: '5px'}}>审核</Button>
                    <Button onClick={this.cashItem} style={{marginRight: '5px', marginLeft: '5px'}}>发放冻结</Button>
                    <Button onClick={this.delItem} style={{marginRight: '5px', marginLeft: '5px'}}>删除</Button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onChangePagintion={this.onChangePagintion}
                               onSelectedRowKeys={this.onSelectedRowKeys}
                    />
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
                {this.renderCheckItemModal()}
                {this.renderCashItemModal()}
                {this.renderBreadcrumb()}
                <AddAndSubteactSearch handleSearch={this.handleSearch}/>
                {this.renderUserList()}
            </div>
        )
    }
}
const columns = [
    {
        width: 70,
        title: '序号',
        fixed: 'left',
        dataIndex: 'index'

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
        title: '单号',
        dataIndex: 'mhId',
        key: 'mhId',
    }
    ,
    {
        title: '数量',
        dataIndex: 'mhAmount',
        key: 'mhAmount', render: (text, r) => {
        return <div>{scientificToNumber(text)}</div>
    }
    },
    {
        title: '类型',
        dataIndex: 'mhType',
        render: (text, r) => {
            return <div>{text == '10090005' ? '加币' : '减币'}</div>
        }
    },
    {
        title: '姓名',
        dataIndex: 'userName',
    }
    ,
    {
        title: '币种',
        dataIndex: 'coinCode',
    },
    {
        title: '状态',
        dataIndex: 'mhStatus',
        key: 'position1',
        render: (t, r) => {
            return <div>{getCoinHandleState(t)}</div>
        }
    }
];
const getCoinHandleState = (t) => {
    t
    let tem = '00'
    CoinHandleState.forEach(item => {
        if (item.dicKey == t) {
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