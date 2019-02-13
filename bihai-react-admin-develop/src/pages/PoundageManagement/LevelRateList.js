/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Spin, Modal, message, Button, Form, Select, Input, Radio} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {levelRateList, getCodeType} from '../../requests/http-req.js'
import {Link} from 'react-router-dom'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

export default class LevelRateList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLoading: false,
            listData: [],
            showModal: false,
            pageNo: 0
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState({showLoading: true})
        levelRateList().then((req) => {
            //console.log(req)
            if (!req.data.data) {
                message.warning('暂无数据')
                this.setState({showLoading: false})
            }
            //console.log(req)
            req.data.data && req.data.data.forEach((item, index) => {
                item.index = this.state.pageNo == 0 ? (index + 1) : (this.state.pageNo - 1) * 10 + index + 1
            })

            if (req.status == 200) {
                if (req.data.length == 0) {
                    message.warning('没有符合的数据')
                }
                this.setState({
                    listData: req.data.data,
                })
            }
            this.setState({showLoading: false})
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
        })
    }

    renderUserList = () => {
        return (
            <Spin spinning={this.state.showLoading}>
                {/*<div className='row-user'>*/}
                {/*<Button onClick={this.showEditModal}*/}
                {/*style={{marginRight: '5px', marginLeft: '5px'}}>修改</Button>*/}
                {/*</div>*/}
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView minWidth={1500} columns={this.columns} data={this.state.listData}
                               onSelectedRowKeys={this.onSelectedRowKeys}/>
                </div>
            </Spin>
        )
    }
    close = () => {
        this.selectId = null,
            this.selectedRowKeys = []
        this.setState({
            showModal: false,
        })
    }
    postData = () => {
        let obj = {coinCode: this.state.editCinType, data: this.state.editData, status: this.state.editStatus,}
        // if (this.selectId) {
        //     obj.id = this.selectId
        //     withDrawRateUpdate(obj).then(req => {
        //         //console.log(req)
        //         message.success('操作成功')
        //         this.close()
        //         this.getData()
        //     })
        // } else {
        //     withDrawRateSave(obj).then(req => {
        //         //console.log(req)
        //         message.success('操作成功')
        //         this.close()
        //         this.getData()
        //     })
        // }
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
                    <Select placeholder="选择角色" style={{width: '100%'}} onChange={(e) => {
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
                    <Input value={this.state.editData} onChange={(e) => {
                        this.setState({editData: e.target.value})
                    }}/>
                </div>
                <div style={{display: 'flex', flexDirection: 'row', margin: '10px'}}>
                    <div style={{width: '120px'}}>状态：</div>
                    <RadioGroup value={
                        parseInt(this.state.editStatus)
                    } onChange={(e) => this.setState({editStatus: e.target.value})}>
                        <Radio value={1}>关闭</Radio>
                        <Radio value={0}>开启</Radio>
                    </RadioGroup>
                </div>


                <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                    <Button style={{width: '100px', marginLeft: '30px'}}
                            onClick={() => this.postData()}>确认</Button>
                </div>


            </Modal>
        )
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
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
            title: '每日提现额度',
            dataIndex: 'drawLimit',
            key: 'drawLimit',
        }
        ,
        {
            title: '用户等级',
            dataIndex: 'levelId',
            key: 'levelId',
        }
        ,
        {
            title: '等级名称',
            dataIndex: 'levelName',
            key: 'levelName',
        }
        ,
        {
            title: '杠杆交易量',
            dataIndex: 'leverageAmount',
            key: 'leverageAmount',
        }
        ,
        {
            title: '杠杆挂单手续费（比率）',
            dataIndex: 'leverageMakerRatio',
            key: 'leverageMakerRatio',
        }
        ,
        {
            title: '杠杆吃单手续费（比率）',
            dataIndex: 'leverageTakerRatio',
            key: 'leverageTakerRatio',
        }

        ,
        {
            title: '法币挂单手续费（比率）',
            dataIndex: 'otcMakerRatio',
            key: 'otcMakerRatio',
        }
        ,
        {
            title: '币币交易量',
            dataIndex: 'spotAmount',
            key: 'spotAmount',
        }
        ,
        {
            title: '币币挂单手续费（比率）',
            dataIndex: 'spotMakerRatio',
            key: 'spotMakerRatio',
        }
        ,
        {
            title: '币币吃单手续费（比率）',
            dataIndex: 'spotTakerRatio',
            key: 'spotTakerRatio',
        }
        ,
        {
            fixed: 'right',
            width: 60,
            title: '操作',
            key: 'spotTakerRatio1',
            render: (text, record) => (
                <Link to={{pathname: '/index/PoundageManagement/EditLevelRate', state: {data: record}}}>修改</Link>
            )
        }

    ];

}
