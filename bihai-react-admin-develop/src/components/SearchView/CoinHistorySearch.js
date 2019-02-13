import {Form, Input, Tooltip, Icon, Select, DatePicker, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SearchModal from '../../components/modal/SearchModal.js'
import {getCodeType} from '../../requests/http-req.js'

moment.locale('zh-cn');

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class CoinHistorySearch extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
        showSearchModal: false,
        phone: '',
        email: ''

    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                if (this.props && this.props.handleSearch) {
                    this.props.handleSearch(values, this.selectUserId)
                }
            }
        });
    }

    componentDidMount() {
        getCodeType().then(((res) => {
            this.setState({
                codeType: res.data.data
            })
        }))
    }


    handleSelectChange() {
    }

    selectRow = (e) => {
        this.setState({phone: e.mobile, email: e.email || ''})
        this.selectUserId = e.userId
    }

    onCancel = () => {
        this.setState({
            showSearchModal: false
        })
    }
    onFocu = () => {
        this.selectUserId = null
        this.setState({showSearchModal: true})
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    display: 'flex',
                    minHeight: '120px',
                    paddingLeft: '15px',
                    paddingRight: '15px'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <SearchModal showModal={this.state.showSearchModal} closeSearchModal={this.onCancel}
                             onSelectRow={this.selectRow}/>
                <div style={{display: 'flex', width: '100%', alignItems: 'center', flex: 1}}>
                    <Row gutter={24} style={{width: '100%'}}>
                        <Col span={6} key={1}>
                            <FormItem style={{margin: 'auto'}} label={'单号'}>
                                {getFieldDecorator('orderNo', {
                                    rules: [{
                                        message: '请输入单号!',
                                    }],
                                })(
                                    <Input placeholder="订单号"/>
                                )}
                            </FormItem>
                        </Col>

                        <Col span={6} key={4}>
                            <FormItem style={{margin: 'auto'}} label={`币种`}>
                                {getFieldDecorator(`coinCode`, {})(
                                    <Select
                                        placeholder="请选择币种"
                                    >
                                        <Option value={null}>全部</Option>

                                        {
                                            this.state.codeType && this.state.codeType.map((item, index) => {
                                                return <Option key={index} value={item}>{item}</Option>
                                            })
                                        }
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} key={5}>
                            {/*买卖方向 0 买入 1 卖出*/}
                            <FormItem style={{margin: 'auto'}} label={`方向`}>
                                {getFieldDecorator(`position`, {})(
                                    <Select
                                        placeholder="选择方向"
                                        //  onChange={this.handleSelectChange}
                                    >

                                        <Option value={null}>全部</Option>
                                        <Option value={'0'}>买入</Option>
                                        <Option value={'1'}>卖出</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                        <Col span={6} key={6}>
                            <FormItem style={{margin: 'auto'}} label={`状态`}>
                                {getFieldDecorator(`tradeStatus`, {})(
                                    <Select
                                        placeholder="状态"
                                        //  onChange={this.handleSelectChange}
                                    >
                                        <Option value={null}>全部</Option>
                                        <Option value={'2'}>已成交</Option>
                                        <Option value={'4'}>部分成交已撤</Option>
                                        <Option value={'6'}>已撤</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} key={99}>
                            <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={'查询用户'}>
                                {getFieldDecorator('phoneNo', {
                                    rules: [{
                                        message: '选择用户',
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
                        </Col>

                    </Row>
                </div>
                <Button htmlType="submit" type="primary" icon="search" style={{
                    marginLeft: '10px', marginTop: '23px'
                }}>搜索
                </Button>
            </Form>
        );
    }
}

const NewCoinHistorySearch = Form.create()(CoinHistorySearch);
export default NewCoinHistorySearch;
