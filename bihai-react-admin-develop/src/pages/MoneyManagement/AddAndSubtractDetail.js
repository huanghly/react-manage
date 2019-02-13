/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Select, InputNumber, Form, Button, message, Input} from 'antd';
import Breadcrumb from '../../components/Breadcrumb.js'
import {mHList, mhSave, getCodeType} from '../../requests/http-req.js'
import SearchModal from '../../components/modal/SearchModal.js'
import {CoinHandleState} from '../../networking/ConfigNet.js'
import history from '../../history.js'

const FormItem = Form.Item;
const Option = Select.Option;
export default class AddAndSubtractDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coinCode: null,
            userId: null,
            mhType: null,
            mhAmount: null,
            userName: null
        }
    }


    searchUser = {}

    componentDidMount() {
        //状态类型
        //TODO 1
        getCodeType().then(((req) => {
            this.setState({
                codeType: req.data.data
            })
        }))
    }

    postData() {
        let temArr = {
            coinCode: this.state.coinCode,
            mhType: this.state.mhType,
            userId: this.state.userId,
            mhAmount: this.state.mhAmount,
        }

        mhSave(temArr).then((req) => {
            //console.log(req)
            if (req.status == 200) {
                message.success('操作成功')

                this.setState({coinCode: null, mhType: null, mhAmount: null})
            }
        })
    }

    onCancel = () => {
        this.setState({showSearchModal: false})
    }
    selectRow = (e) => {
        //console.log(e)
        this.searchUser = e
        this.setState({
            userId: e.userId,
            userName: e.userName && e.userName.trim() != '' ? e.userName : (e.email && e.email.trim() != '' ? e.email : e.nickName)
        })

    }
    handleSubmit = () => {
        if (this.state.userId == null || this.state.mhAmount == null || this.state.mhType == null || this.state.coinCode == null) {
            message.warning('填完整再提交 ok？')
            return;
        } else {
            let mhAmount = parseFloat(this.state.mhAmount)
            //console.log(parseFloat(mhAmount))


            if (parseInt(mhAmount) > (100000000) || parseFloat(mhAmount) < parseFloat(0.00000001)) {
                this.setState({mhAmount: 0})
                message.warning('合法范围是99999999到0.00000001')
                return;
            }
            this.postData()
        }
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {this.state.showSearchModal &&
                <SearchModal showModal={this.state.showSearchModal} closeSearchModal={this.onCancel}
                             onSelectRow={this.selectRow}/>}
                <Form
                    style={{
                        flexDirection: 'column',
                        display: 'flex',
                        minHeight: '60px',
                        width: '100%',
                        height: '100%',
                        paddingTop: '15px',
                        paddingBottom: '15px',
                        alignItems: 'center',
                        backgroundColor: '#ffffff'
                    }}
                    className="ant-advanced-search-form"
                >
                    <FormItem style={{margin: 'auto', paddingRight: '15px', width: '360px', height: '60px'}}
                              label={'查询用户'}>

                        <Button style={{width: '100%'}}
                                onClick={() => {
                                    this.setState({showSearchModal: true})
                                }}>{this.state.userName}</Button>

                    </FormItem>
                    <FormItem style={{margin: 'auto', paddingRight: '15px', width: '360px', height: '60px'}}
                              label={`选择币种`}>
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

                    <FormItem style={{margin: 'auto', paddingRight: '15px', width: '360px', height: '60px'}}
                              label={`操作类型`}>
                        <Select
                            value={this.state.mhType}
                            placeholder="操作类型"
                            onChange={(v) => {
                                this.setState({mhType: v})
                            }}
                        >
                            <Option key={1232} value={null}>全部</Option>
                            <Option value="10090005">加币</Option>
                            <Option value="10090010">减币</Option>
                        </Select>
                    </FormItem>

                    <FormItem style={{margin: 'auto', paddingRight: '15px', width: '360px', height: '60px'}}
                              label={`操作数量`}>
                        <Input
                            type='number'
                            style={{width: '150px'}} max={100000000}
                            min={0}
                            value={this.state.mhAmount}
                            placeholder="最大100000000"
                            onChange={this.inputNumberChange}/>
                    </FormItem>
                    <div style={{display: 'flex', flexDirection: 'row'}}>
                        <Button onClick={this.handleSubmit}>确认
                        </Button>
                        <Button style={{marginLeft: '15px'}} onClick={() => history.go(-1)}>返回
                        </Button>
                    </div>
                    <div style={{flex: 1}}></div>
                </Form>

            </div>
        )
    }


    inputNumberChange = (value) => {
        // let temstr = ''
        // let str = new String(value)
        // let arr = str.split('.')
        // temstr = arr[1] || null
        // if (temstr && temstr.length > 8) {
        //     message.warning('精度为8，重新输入')
        //     this.setState({mhAmount: 0})
        //
        // } else {
        this.setState({mhAmount: value.target.value})
    }
// if (arr[1].length > 3) {
    //     alert(arr[1])
    // }
// }
}