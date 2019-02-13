import {Form, Spin, message, Input, Button, Select, Modal, InputNumber, Radio} from 'antd';
import React, {Component} from 'react';
import {errorList, coininfoUpload, cashPassYes, cashPassNo} from '../../requests/http-req'
import Breadcrumb from '../../components/Breadcrumb.js'
import TableView from '../../components/TableView'
import history from '../../history.js'
import {CoinDrawStatus, StatusMap} from '../../networking/ConfigNet'
import Number from '../../utils/Number.js'
import WithdrawErrorListSearch from '../../components/SearchView/WithdrawErrorListSearch'

const RadioGroup = Radio.Group;
const Option = Select.Option;

const FormItem = Form.Item;

export default class WithdrawErrorList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 0,
            total: 0,
            pageSize: 10,
            listData: [],
            drawId: null,
            showModal: false,
            userId: null,
            isLoading: false,
            results: null
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()
    }

    getData = () => {
        this.setState({isLoading: true})
        errorList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            userId: this.searchData && this.searchData.userId ? this.searchData.userId : null,
            drawId: this.searchData && this.searchData.drawId ? this.searchData.drawId : null
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
            this.setState({isLoading: false})

        }).catch(e => {
            if (e) {
                message.warning('获取失败')
                this.setState({isLoading: false})

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
    onSelectedRowKeys = (e) => {
        this.selectedRowKeys = e
    }


    handleSearch = (values, id) => {
        this.state.pageNo = 0
        let tem = {
            drawId: values.drawId && values.drawId.trim(),
            userId: id,
        }
        this.searchData = tem

        this.getData()
    }
    close = () => {
        this.itemData = null
        this.setState({
            showModal: false,
            results: null
        })
    }
    onChange = (e) => {
        this.setState({
            results: e.target.value
        })
    }

    postData = () => {
        if (!this.state.results) {
            message.warning('选择操作')
            return
        } else {
            // let formData = {coinDrawDTO: this.itemData}
            // //let formData = new FormData()
            // // formData.append('coinDrawDTO', this.itemData)
            // //console.log(formData)
            //驳回
            if (this.state.results == 1) {
                cashPassNo(this.itemData).then(res => {
                    if (res.status == 200) {
                        message.warning('操作成功')
                    }
                    this.close()
                    this.getData()

                }).catch(e => {
                    message.error(e.data.message)
                    // this.close()
                })
            } else { //通过
                cashPassYes(this.itemData).then(res => {
                    if (res.status == 200) {
                        message.warning('操作成功')
                    }
                    this.close()
                    this.getData()
                }).catch(e => {
                    message.error(e.data.message)
                    // this.close()
                })
            }
        }
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
                        <RadioGroup onChange={this.onChange} value={this.state.results}>
                            <Radio value={1}>驳回</Radio>
                            <Radio value={2}>通过</Radio>
                        </RadioGroup>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <Button onClick={this.postData} style={{marginTop: '15px', marginRight: '15px'}}>确定</Button>
                        {/*<Button onClick={this.close} style={{marginTop: '15px'}}>取消</Button>*/}
                    </div>
                </div>
            </Modal>
        )
    }

    render() {
        return (
            <div className='center-user-list'>
                <Spin spinning={this.state.isLoading} style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                    <Breadcrumb data={window.location.pathname}/>
                    <WithdrawErrorListSearch handleSearch={this.handleSearch}/>
                    {this.renderModal()}
                    <TableView onChangePagintion={this.onChangePagintion} onSelectedRowKeys={this.onSelectedRowKeys}
                               columns={this.columns} data={this.state.listData}
                               pageNo={this.state.pageNo}
                               minWidth={2100}
                               total={this.state.total}/>
                </Spin>
            </div>
        )
    }

    columns = [
        {
            title: '序号',
            dataIndex: 'index',
        }
        ,
        {
            title: '姓名',
            key: 'userName',
            dataIndex: 'userName',
        },
        {
            title: '手机',
            key: 'mobile',
            dataIndex: 'mobile',
        },
        {
            title: '手续费',
            key: 'poundageAmount',
            dataIndex: 'poundageAmount',
        }
        ,
        {
            title: '提现单号',
            dataIndex: 'drawId',
            key: 'logoUrl',

        },
        {
            title: '提现类型',
            dataIndex: 'drawType',
            key: 'drawType',
            render: (text, record) => {
                return <div>{this.getCoinDrawStatus(text)}</div>
            }
        }
        ,
        {
            title: '提现数量',
            dataIndex: 'drawAmount',
            key: 'drawAmount',
        },
        {
            title: '提现前数量',
            dataIndex: 'preAmount',
            key: 'preAmount',
        },
        {
            title: '提现时间',
            dataIndex: 'drawTime',
            key: 'drawTime',
        },
        {
            title: '币种',
            dataIndex: 'coinCode',
            key: 'coinCode',
        },
        {
            title: '失败原因',
            dataIndex: 'cause',
            key: 'cause',
        }
        ,
        {
            title: '提现状态',
            key: 'coinDrawStatus',
            dataIndex: 'coinDrawStatus',
            render: (text, record) => {
                return <div>{this.getStatusMap(text)}</div>
            }
        },
        {
            title: '用户备注',
            key: 'mark',
            dataIndex: 'mark',
        },
        {
            title: '创建时间',
            dataIndex: 'createTime',
            key: 'createTime',
        },
        {
            title: '修改时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        }
        ,
        // {
        //     title: '初审时间',
        //     dataIndex: 'examineTime',
        //     key: 'examineTime',
        // },
        // {
        //     title: '初审人',
        //     dataIndex: 'examineId',
        //     key: 'examineId',
        // },

        // {
        //     title: '核对人',
        //     key: 'verifyId',
        //     dataIndex: 'verifyId'
        // }
        // ,
        {
            title: '核对时间',
            key: 'verifyTime',
            dataIndex: 'verifyTime',
        },
        {
            title: '操作',
            key: 'coinDrawStatus',
            dataIndex: 'coinDrawStatus',
            fixed: 'right',
            width: 70,
            // <Link to={{pathname: '/index/MoneyManagement/AddCoinTypeEdit', state: {data: record}}}>详情</Link>
            render: (text, record) => (
                <a onClick={() => {
                    this.itemData = record
                    this.setState({showModal: true})
                }}>修改</a>
            )
        }

    ];
    //类型
    getCoinDrawStatus = (text) => {
        let tem = ''
        CoinDrawStatus.forEach(item => {
            if (item.dicKey == text) {
                tem = item.dicName
            }
        })
        return tem
    }
    //状态
    getStatusMap = (text) => {
        let tem = ''
        StatusMap.forEach(item => {
            if (item.dicKey == text) {
                tem = item.dicName
            }
        })
        return tem
    }
}

