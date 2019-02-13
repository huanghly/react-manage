/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Spin, Modal, message, Button, Form, Select, Input, Radio, DatePicker, Upload} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {
    digList, importExcel, exportExcel,exportTestExcel
} from '../../requests/http-req.js'
import history from '../../history.js'
import {Link} from 'react-router-dom'
import moment from 'moment'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;
const timeArr = [
    {value: '01', time: '00.00-01.59'},
    {value: '02', time: '01.00-01.59'},
    {value: '03', time: '02.00-02.59'},
    {value: '04', time: '03.00-03.59'},
    {value: '05', time: '04.00-04.59'},
    {value: '06', time: '05.00-05.59'},
    {value: '07', time: '06.00-06.59'},
    {value: '08', time: '07.00-07.59'},
    {value: '09', time: '08.00-08.59'},
    {value: '10', time: '09.00-09.59'},
    {value: '11', time: '10.00-10.59'},
    {value: '12', time: '11.00-11.59'},
    {value: '13', time: '12.00-12.59'},
    {value: '14', time: '13.00-13.59'},
    {value: '15', time: '14.00-14.59'},
    {value: '16', time: '15.00-15.59'},
    {value: '17', time: '16.00-16.59'},
    {value: '18', time: '17.00-17.59'},
    {value: '19', time: '18.00-18.59'},
    {value: '20', time: '19.00-19.59'},
    {value: '21', time: '20.00-20.59'},
    {value: '22', time: '21.00-21.59'},
    {value: '23', time: '22.00-22.59'},
    {value: '24', time: '23.00-23.59'}
]
export default class DigList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            pageNo: 0,
            pageSize: 10,
            total: 0,
            listData: [],
            codeType: [],
            showModal: false,
            showLoading: false,
            date: moment().format(),
            time: '00',
            fileList: []
        }
    }

    selectedRowKeys = []

    componentDidMount() {
        this.getData()
    }

    getData() {
        this.setState({showLoading: true})
        digList({
            pageNo: this.state.pageNo,
            pageSize: this.state.pageSize,
            date: moment(this.state.date).format('YYYYMMDD'),
            time: this.state.time
        }).then((res) => {
            if (!res.data.data) {
                message.warning('暂无数据')
                this.setState({showLoading: false})
            }

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
                })
            }
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                this.setState({showLoading: false})
                message.error(e.data.message)
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

    showModal = (tag) => {

    }
    //导入
    importMyExcel = (e) => {
        //console.log(JSON.stringify(e))

        this.setState({showLoading: true})
        let fromData = new FormData()
        fromData.append('excelFile', e.file)
        importExcel(fromData).then(res => {
            if (res.status === 200) {
                message.success("导入成功")
            }
            this.getData()
            this.setState({showLoading: false})
        }).catch(e => {
            this.setState({showLoading: false})
            message.error(e.data.message)
        })
    }
    //导出
    exportMyExcel = () => {
        this.setState({showLoading: true})
        let obj = {date: moment(this.state.date).format('YYYYMMDD'), time: this.state.time}
        let formData = new FormData()
        formData.append("date", moment(this.state.date).format('YYYYMMDD'))
        formData.append("time", this.state.time)

        exportExcel(formData).then(res => {

            if (res.status === 201 || res.status === 200) {

                var url = window.URL.createObjectURL(res.data);
                var a = document.createElement('a');
                a.href = url;
                a.download = moment(this.state.date).format('YYYYMMDD') + `-` + this.state.time + ".xlsx";
                a.click();
            }
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                message.error(e.data.message)
            }
            this.setState({showLoading: false})
        })
    }
    exportTestExcel = () => {
        this.setState({showLoading: true})
        let obj = {date: moment(this.state.date).format('YYYYMMDD'), time: this.state.time}
        let formData = new FormData()
        formData.append("date", moment(this.state.date).format('YYYYMMDD'))
        formData.append("time", this.state.time)

        exportTestExcel(formData).then(res => {

            if (res.status === 201 || res.status === 200) {

                var url = window.URL.createObjectURL(res.data);
                var a = document.createElement('a');
                a.href = url;
                a.download = moment(this.state.date).format('YYYYMMDD') + `-` + this.state.time + ".xlsx";
                a.click();
            }
            this.setState({showLoading: false})
        }).catch(e => {
            if (e) {
                message.error(e.data.message)
            }
            this.setState({showLoading: false})
        })
    }

    renderUserList = () => {
        const props = {
            customRequest: (e) => {
                this.importMyExcel(e)
            },
            beforeUpload: (file) => {
                const isLt1M = file.size / 1024 / 1024 < 2;
                if (!isLt1M) {
                    message.warning('文件不能超过2M')
                    return false
                }
                ////console.log(file)
                let arr = file.name.split('.')
                let imgs = ['xlsx', 'xls', 'xlsm']
                if (imgs.indexOf(arr[1]) == -1) {
                    message.warning('只能选择excel文件')
                    return false
                } else {
                    return true;
                }
            }
        };
        return (
            <Spin spinning={this.state.showLoading}>
                <div style={{display: 'flex', flexDirection: 'row', marginTop: '15px'}}>
                    <Upload {...props} fileList={this.state.fileList}>
                        <Button type='file'//onClick={this.importExcel}
                                style={{marginRight: '5px', marginLeft: '5px'}}>导入</Button>
                    </Upload>
                    <Button onClick={this.exportMyExcel}
                            style={{marginRight: '5px', marginLeft: '5px'}}>导出</Button>
                </div>
                <div style={{display: 'flex', flexDirection: 'column', marginTop: '20px', marginBottom: '20px'}}>
                    <TableView columns={this.columns} data={this.state.listData} total={this.state.total}
                               pageNo={this.state.pageNo}
                               hiddenSelection={true}
                               pageSize={this.state.pageSize}
                               onSelectedRowKeys={this.onSelectedRowKeys}
                               onChangePagintion={this.onChangePagintion}/>
                </div>
            </Spin>
        )
    }


    onChange = (e) => {
        this.setState({
            date: e
        })
    }
    handleSelectChange = (e) => {
        this.setState({
            time: e
        })
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
                    label="选择日期"
                >
                    <DatePicker format="YYYY-MM-DD" defaultValue={moment(this.state.date)} onChange={this.onChange}/>
                </FormItem>
                <FormItem
                    style={{margin: 'auto', flex: 1, paddingRight: '15px'}}
                    label="选择时段"
                    //  hasFeedback
                    //   validateStatus="warning"
                >
                    <Select
                        placeholder="请选择时段"
                        defaultValue={this.state.time}
                        onChange={this.handleSelectChange}
                    >
                        {timeArr.map(item => {
                            return <Option key={item.time} value={item.value}>{item.time}</Option>
                        })}
                    </Select>
                </FormItem>
                <div style={{flex: 2}}/>

                <Button onClick={() => this.getData()} date="primary" icon="search" style={{
                    marginRight: '15px',
                }}>搜索
                </Button>
            </Form>
        )
    }
    colseModal = () => {
        this.selectedRowKeys = []
        this.itemData = null
        this.setState({showModal: false})
    }
    renderModal = () => {
        return (
            <Modal
                maskClosable={false}
                width={600}
                destroyOnClose={true}
                onCancel={this.colseModal}
                title={'导入错误'}
                visible={this.state.showModal}
                onChange={this.colseModal}
                footer={null}
            >
                <div>展示错误信息</div>
            </Modal>
        )

    }

    render() {
        console.log(this.state.listData)
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {this.renderSearch()}
                {this.renderModal()}
                {this.renderUserList()}
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
            title: '用户Id',
            dataIndex: 'userId',
            key: 'userId',
        }
        ,
        {
            title: '交易日期',
            dataIndex: 'tradeDate',
            key: 'tradeDate',
        }
        ,
        {
            title: '交易小时',
            dataIndex: 'tradeHour',
            key: 'tradeHour',
            render: (t, r) => {
                console.log(t)
                let tmp =''
                    timeArr.forEach(item=>{
                    if (item.value==t){
                        tmp=item.time
                    }
                })
                return<div>{tmp}</div>
            }
        },
        {
            title: '挖矿产出总量',
            dataIndex: 'diggingAmount',
            key: 'diggingAmount',
        }
        ,
        {
            title: '手续费(USDT)',
            dataIndex: 'poundageAmountUsdt',
            key: 'poundageAmountUsdt',
        }
        ,
        {
            title: '创建时间',
            dataIndex: 'createTime;',
            key: 'createTime;',

        }
    ];

}
