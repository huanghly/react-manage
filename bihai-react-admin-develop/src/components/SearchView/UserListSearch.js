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


class UserListSearch extends React.Component {
    state = {
        seniorAuth: '0',
        primaryAuth: '0',

    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (this.props && this.props.handleSearch) {
                console.log(values);
                this.props.handleSearch(values)
            }
        });
    }

    componentWillMount() {

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
                    height: '120px',
                    minHeight: '120px',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <div style={{display: 'flex', width: '100%', flex: 1, alignItems: 'center'}}>
                    <Row gutter={24}>
                        <Col span={6} key={2}>
                            <FormItemPhone fieldDecorator={getFieldDecorator}/>
                        </Col>
                        <Col span={6} key={22}><FormItemEmail fieldDecorator={getFieldDecorator}/></Col>

                        {/*<Col span={6} key={3}>*/}
                        {/*<FormItem style={{margin: 'auto'}} label={`姓名`}>*/}
                        {/*{getFieldDecorator(`name`, {})(*/}
                        {/*<Input placeholder="输入姓名"/>*/}
                        {/*)}*/}
                        {/*</FormItem>*/}
                        {/*</Col>*/}
                        <Col span={6} key={4}>
                            <FormItem style={{margin: 'auto'}} label={`初级认证`}>
                                {getFieldDecorator(`primaryAuth`, {})(
                                    <Select
                                        // value={this.state.primaryAuth}
                                        placeholder="请选择"
                                        onChange={this.primaryAuthSelectChange}
                                    >
                                        <Option key={1232} value={null}>全部</Option>
                                        <Option value="0">未认证</Option>
                                        <Option value="1">已认证</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} key={5}>
                            <FormItem style={{margin: 'auto'}} label={`高级认证`}>
                                {getFieldDecorator(`seniorAuth`, {})(
                                    <Select
                                        //  value={this.state.seniorAuth}
                                        placeholder="请选择"
                                        onChange={this.seniorAuthSelectChange}
                                    >
                                        <Option key={1232} value={null}>全部</Option>
                                        <Option value="0">未提交</Option>
                                        <Option value="1">待审核</Option>
                                        <Option value="2">未通过</Option>
                                        <Option value="3">通过</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={12} key={6}>
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
                        marginLeft: '10px', marginTop: '23px'
                    }}>
                        搜索
                    </Button>

                </div>

            </Form>
        );
    }
}

const NewUserListSearch = Form.create()(UserListSearch);
export default NewUserListSearch;
// {
//     validator: this.validateToNextPassword,
// }