/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Modal, message, Button, Form, Select, InputNumber, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {withDrawRate, getCodeType, withDrawRateUpdate, withDrawRateSave} from '../../requests/http-req.js'
import history from '../../history.js'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

export default class WithDrawRateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
            codeType: [],
            coinCode: null,
            showModal: false,
            editCinType: null,
            editData: null,
            editStatus: 0
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()

        getCodeType().then(((res) => {
            this.setState({
                codeType: res.data.data
            })
        }))
    }

    getData() {
        this.setState({showLoading: true})
        //console.log(this.state.coinCode)
        withDrawRate({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            coinCode: this.state.coinCode ? this.state.coinCode : null
        }).then((res) => {
            //console.log(res)
            if (!res.data.data) {
                message.warning('暂无数据')
                this.setState({showLoading: false})
            }
            //console.log(res)
            res.data.data && res.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })

            if (res.status == 200) {
                if (res.data.length == 0) {
                    message.warning('没有符合的数据')
                }
                this.setState({
                    listData: res.data.data,
                    total: res.data.total,
                }, () => {
                    //console.log(this.state.listData)
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
    onSelectedRowKeys = (e) => {
        this.selectedRowKeys = e
    }

    selectId = null
    showEditModal = () => {
        if (this.selectedRowKeys.length != 1) {
            message.warning('请选择一个')
            return
        }
        //console.log(this.selectedRowKeys)
        let item = this.state.listData[this.selectedRowKeys[0]]
        this.selectId = item.id
        this.setState({
            showModal: true,
            editCinType: item.coinCode,
            editData: item.data,
            editStatus: item.status,
        })
    }

    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                <div className='row-user'>
                    <Button onClick={this.showEditModal}
                            style={{marginRight: '5px', marginLeft: '5px'}}>修改手续费</Button>
                    <Button onClick={() => this.setState({showModal: true, editState: 0})}
                            style={{marginRight: '5px', marginLeft: '5px'}}>新增</Button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={this.columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               pageSize={this.state.pageSize}
                               onSelectedRowKeys={this.onSelectedRowKeys}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }
    close = () => {
        this.selectId = null,
            this.selectedRowKeys = []
        this.setState({
            showModal: false,
            editCinType: null,
            editData: null,
            editStatus: 0,
        })

    }
    postData = () => {

        if (typeof this.state.editData == 'undefined' || this.state.editData == '') {
            message.error('请输入大于0的手续费')
            return
        }
        if (parseFloat(this.state.editData) > parseFloat(100000000)) {
            message.error('不能超过99999999')
            this.setState({
                editData: 99999999
            })
            return
        }
        let obj = {coinCode: this.state.editCinType, data: this.state.editData, status: this.state.editStatus,}
        if (this.selectId) {
            obj.id = this.selectId
            withDrawRateUpdate(obj).then(res => {
                //console.log(res)
                message.success('操作成功')
                this.close()
                this.getData()
            }).catch(e => {
                if (e) {
                    message.error('服务异常')
                }
            })
        } else {
            withDrawRateSave(obj).then(res => {
                //console.log(res)
                message.success('操作成功')
                this.close()
                this.getData()
            }).catch(e => {
                if (e) {
                    message.error('币种已存在')
                }
            })
        }
    }
    renderModalView = () => {
        return (
            <Modal
                maskClosable={false}
                destroyOnClose={true}
                onCancel={this.close}
                title={this.selectId ? "修改" : "新增"}
                visible={this.state.showModal}
                onChange={this.close}
                footer={null}
            >
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>选择币种：</div>
                    <Select placeholder="选择角色" style={{width: '120px'}} disabled={this.selectId ? true : false}
                            onChange={(e) => {
                                this.setState({editCinType: e})
                            }} value={this.state.editCinType}>
                        {
                            this.state.codeType && this.state.codeType.map((item, index) => {
                                return <Option key={index} value={item}>{item}</Option>
                            })
                        }
                    </Select>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>手续费：</div>
                    <InputNumber style={{width: '100px'}} min={0} value={this.state.editData}
                                 onChange={(e) => {
                                     this.setState({editData: e})
                                 }}/>
                </div>
                {/*<div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>*/}
                {/*<div style={{width: '120px'}}>状态：</div>*/}
                {/*<RadioGroup style={{width: '100px'}} value={*/}
                {/*parseInt(this.state.editStatus)*/}
                {/*} onChange={(e) => this.setState({editStatus: e.target.value})}>*/}
                {/*<Radio value={0}>停用</Radio>*/}
                {/*<Radio value={1}>启用</Radio>*/}
                {/*</RadioGroup>*/}
                {/*</div>*/}


                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button style={{width: '100px', marginLeft: '30px'}}
                            onClick={() => this.postData()}>确认</Button>
                </div>


            </Modal>
        )
    }
    renderSearch = () => {
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    paddingLeft: '20px',
                    display: 'flex',
                    height: '60px',
                    minHeight: '60px',
                    width: '100%',
                    alignItems: 'center'
                }}
                className="ant-advanced-search-form"
            >
                <FormItem
                    style={{margin: 'auto', flex: 1, paddingRight: '15px'}}
                    label="选择币种"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Select
                        value={this.state.coinCode}
                        placeholder="选择币种"
                        onChange={(v) => {
                            this.setState({coinCode: v})
                        }}
                    >
                        <Option key={1232} value={null}>全部</Option>
                        {
                            this.state.codeType && this.state.codeType.map((item, index) => {
                                return <Option key={index} value={item}>{item}</Option>
                            })
                        }
                    </Select>
                </FormItem>
                <div style={{flex: 3}}/>

                <Button onClick={() => this.getData()} type="primary" icon="search" style={{
                    marginRight: '15px',
                }}>搜索
                </Button>
            </Form>
        )
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {this.renderSearch()}
                {this.renderUserList()}
                {this.renderModalView()}
            </div>
        )
    }

    columns = [
        {
            width: 70,
            title: '序号',
            dataIndex: 'index',
        }
        ,
        {
            title: '简称',
            dataIndex: 'coinCode',
            key: 'coinCode',
        }
        // ,
        // {
        //     title: '状态',
        //     dataIndex: 'status',
        //     key: 'status',
        //     render: (text, r) => {
        //         return <div>{text == 0 ? '停用' : '启用'}</div>
        //     }
        // }
        ,
        {
            title: '手续费（笔）',
            dataIndex: 'data',
            key: 'data',
            render: (text, r) => {
                return <div>{scientificToNumber(text)}</div>
            }
        }
        ,
        {
            title: '更新时间',
            dataIndex: 'updateTime',
            key: 'updateTime',
        }
    ];
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
