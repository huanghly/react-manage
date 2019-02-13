import {Form, Input, Tooltip, Icon, Select, DatePicker, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SearchModal from '../../components/modal/SearchModal.js'
import {getCodeType, getDickey} from '../../requests/http-req.js'
import ConfigNet from '../../networking/ConfigNet'

moment.locale('zh-cn');
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;


class FiatMoneySearch extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        showSearchModal: false,
        phone: '',
        email: '',
        codeType: null,
        withdrawArr: []
    };
    selectUserId = ''

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if (this.props.handleSearch) {
                    this.props.handleSearch(values, this.selectUserId)
                }
            }
        });
    }

    componentWillMount() {

    }

    componentDidMount() {
//获取币种类型 //获取提现类型的接口
        getCodeType().then(((req) => {
            this.setState({
                codeType: req.data.data
            })
        }))
        getDickey(1005).then((req) => {
            if (req.status == 200) {
                this.setState({
                    withdrawArr: req.data.data
                })
            }
        })
    }

    onFocu = () => {
        this.selectUserId = null
        this.setState({showSearchModal: true})

    }

    onCancel = () => {
        this.setState({
            showSearchModal: false
        })
    }

    selectRow = (e) => {
        console.log(e)
        this.selectUserId = e.userId
        this.setState({
            phone: e.mobile || null,
            email: e.email || null,
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    display: 'flex',
                    height: '120px',
                    minHeight: '120px',
                    width: '100%',
                    paddingRight: '15px',
                    paddingLeft: '15px'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <div style={{
                    display: 'flex',
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    {this.state.showSearchModal &&
                    <SearchModal showModal={this.state.showSearchModal} closeSearchModal={this.onCancel}
                                 onSelectRow={this.selectRow}/>}
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>

                        <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={'单号'}>
                            {getFieldDecorator('tradeId', {
                                rules: [{
                                    message: '请输入提现单号',
                                }],
                            })(
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '3px'
                                }}>
                                    <Input placeholder="请输入单号"/>
                                </div>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={`资金类型`}>
                            {getFieldDecorator(`handleType`, {})(
                                <Select
                                    placeholder="资金类型"
                                >
                                    <Option key={1232} value={null}>全部</Option>
                                    {
                                        this.state.withdrawArr && this.state.withdrawArr.map((item, index) => {
                                            console.log(item)
                                            return <Option key={index} value={item.dicKey}>{item.dicName}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={`币种`}>
                            {getFieldDecorator(`coinCode`, {})(
                                <Select
                                    placeholder="请选择币种"
                                    //   onChange={this.handleSelectChange}

                                >
                                    <Option key={1232} value={null}>全部</Option>
                                    {
                                        this.state.codeType && this.state.codeType.map((item, index) => {
                                            return <Option key={index} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={'查询用户'}>
                            {getFieldDecorator('phoneNo', {
                                rules: [{
                                    message: '请输入手机号!',
                                }],
                            })(
                                <div style={{
                                    width: '100%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                }}>
                                    <Button style={{marginTop: '4px', width: '100%'}}
                                            onClick={this.onFocu}>{this.state.phone ? this.state.phone : this.state.email}</Button>
                                    {this.state.phone != '' ?
                                        <img src={require('../../resources/imgs/del_icon.png')}
                                             onClick={() => {
                                                 this.selectUserId = ''
                                                 this.setState({phone: '', email: ''})
                                             }} style={{
                                            height: '10px',
                                            width: '10px',
                                            position: 'relative',
                                            right: '20px'
                                        }}/> : null
                                    }

                                </div>
                            )}
                        </FormItem>

                    </div>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>

                        <FormItem style={{margin: 'auto', flex: 1}} label={`时间`}>
                            {getFieldDecorator('date')(
                                <RangePicker format="YYYY-MM-DD"/>
                            )}
                        </FormItem>
                        <iew style={{flex: 3}}></iew>
                    </div>
                </div>
                <Button htmlType="submit" type="primary" icon="search" style={{
                    marginLeft: '10px', marginTop: '20px'
                }}>搜索


                </Button>
            </Form>
        );
    }
}

const NewFiatMoneySearch = Form.create()(FiatMoneySearch);
export default NewFiatMoneySearch;
