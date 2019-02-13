import {Form, Input, Tooltip, Icon, Select, DatePicker, Col, Checkbox, Button, AutoComplete} from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SearchModal from '../../components/modal/SearchModal.js'
import {getCodeType, getDickey} from '../../requests/http-req.js'

moment.locale('zh-cn');
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;


class UserPropertySearch extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        showSearchModal: false,
        phone: '',
        email: '',
        codeType: null
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
        getDickey(1006).then((req) => {
            if (req.status == 200) {
                console.log(req.data)
                // this.setState({
                //     withdrawArr: req.data.data
                // })
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
            phone: e.mobile || '',
            email: e.email || '',
        })
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    display: 'flex',
                    minHeight: '60px',
                    height: '60px',
                    width: '100%',
                    alignItems: 'center',
                    paddingRight: '20px',
                    paddingLeft: '20px'
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

                        <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={`币种`}>
                            {getFieldDecorator(`coinCode`, {})(
                                <Select
                                    placeholder="选择币种"
                                >
                                    <Option key={1232} value={null}>全部</Option>
                                    {
                                        this.state.codeType && this.state.codeType.map((item, index) => {
                                            return <Option key={index}
                                                           value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={`账户类型`}>
                            {getFieldDecorator(`handleType`, {})(
                                <Select
                                    defaultValue="10060005"
                                    //   onChange={this.handleSelectChange}
                                >
                                    {/*<Option key={33} value={null}>全部</Option>*/}
                                    <Option key={10060005} value="10060005">币币账户</Option>
                                    <Option key={10060010} value="10060010">法币账户</Option>
                                    <Option key={10060015} value="10060015">杠杆账户</Option>
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
                                            onClick={this.onFocu}>{this.state.phone != '' ? this.state.phone : this.state.email}</Button>
                                    {
                                        this.state.email != '' || this.state.phone != '' ?
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
                        <div style={{flex: 1}}></div>
                    </div>
                </div>
                <Button htmlType="submit" type="primary" icon="search" style={{
                    marginLeft: '10px',
                }}>搜索
                </Button>
            </Form>
        );
    }
}

const NewUserPropertySearch = Form.create()(UserPropertySearch);
export default NewUserPropertySearch;
