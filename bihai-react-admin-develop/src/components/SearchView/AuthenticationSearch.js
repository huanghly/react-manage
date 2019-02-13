import {Form, Input, Button, Radio, Select, DatePicker, Col, Row} from 'antd';
import React, {Component} from 'react';
import 'moment/locale/zh-cn';
import {FormItemPhone, FormItemEmail} from '../Form-Item.js'

const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;

const Option = Select.Option;
const RadioGroup = Radio.Group;

// 初级认证，0:未认证，1：已认证  高级认证，0:未提交，1：待审核，2：未通过，3：通过


class AuthenticationSearch extends React.Component {
    state = {
        seniorAuth: '1',
        primaryAuth: '0',

    };
    handleSearch = (e) => {

        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (this.props && this.props.handleSearch) {
                this.props.handleSearch(values)
            }
        });
    }

    componentWillMount() {
        // this.props.form.setFieldsValue({
        //     seniorAuth: '1',
        // })
    }

    componentDidMout() {

    }

    primaryAuthSelectChange = (value) => {
        this.setState({
            primaryAuth: value
        })
    }


    seniorAuthSelectChange = (value) => {
        this.setState({
            seniorAuth: value,
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    display: 'flex',
                    height: '60px',
                    minHeight: '60px',
                    paddingLeft: '15px',
                    paddingRight: '15px'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <div style={{display: 'flex', width: '100%', flex: 1, alignItems: 'center'}}>
                    <Row gutter={24}>
                        <Col span={5} key={2}>
                            <FormItemPhone fieldDecorator={getFieldDecorator}/>
                        </Col>
                        <Col span={5} key={22}><FormItemEmail fieldDecorator={getFieldDecorator}/></Col>

                        <Col span={5} key={5}>
                            <FormItem style={{margin: 'auto'}} label={`高级认证`}>
                                {getFieldDecorator(`seniorAuth`, {initialValue: '1'})(
                                    <Select
                                        onChange={this.seniorAuthSelectChange}
                                    >
                                        {/*<Option key={1232} value={null}>全部</Option>*/}
                                        <Option key={2} value="1">待审核</Option>
                                        <Option key={12332} value="2">未通过</Option>
                                        <Option key={14232} value="3">已通过</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={9} key={6}>
                            <FormItem style={{margin: 'auto'}} label={`注册时间`}>
                                {getFieldDecorator('date')(
                                    <RangePicker format="YYYY-MM-DD"/>
                                )}
                            </FormItem>
                        </Col>
                    </Row>
                </div>
                <div style={{height: '100%', display: 'flex',}}>
                    <Button htmlType="submit" type="primary" icon="search" style={{
                        margin: 'auto',
                        paddingRight: '15px'
                    }}>
                        搜索
                    </Button>
                </div>

            </Form>
        );
    }
}

const NewAuthenticationSearch = Form.create()(AuthenticationSearch);
export default NewAuthenticationSearch;
// {
//     validator: this.validateToNextPassword,
// }