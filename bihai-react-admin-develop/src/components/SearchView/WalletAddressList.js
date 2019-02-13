import {Form, Input, Tooltip, Icon, Select, DatePicker, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';

moment.locale('zh-cn');
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class UserListSearch extends React.Component {
    state = {
        confirmDirty: false,
        autoCompleteResult: [],
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if (this.props && this.props.goto) {
                    this.props.goto(values)
                }
            }
        });
    }

    componentWillMount() {

    }


    handleSelectChange() {

    }

    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{flexDirection: 'row', display: 'flex'}}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <div style={{display: 'flex', width: '100%', flex: 1}}>
                    <Row gutter={24}>
                        <Col span={6} key={1}>
                            <FormItem style={{margin: 'auto'}} label={'手机号'}>
                                {getFieldDecorator('phoneNo', {
                                    rules: [{
                                        required: true,
                                        message: '请输入手机号!',
                                    }],
                                })(
                                    <Input placeholder="输入手机号"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} key={2}>
                            <FormItem style={{margin: 'auto'}} label={'邮箱'}>
                                {getFieldDecorator(`email`, {
                                    rules: [{
                                        required: true,
                                        message: '请输入邮箱!',
                                    }],
                                })(
                                    <Input placeholder="输入邮箱"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} key={3}>
                            <FormItem style={{margin: 'auto'}} label={`地址`}>
                                {getFieldDecorator(`name`, {})(
                                    <Input placeholder="输入钱包地址"/>
                                )}
                            </FormItem>
                        </Col>
                        <Col span={6} key={4}>
                            <FormItem style={{margin: 'auto'}} label={`币种`}>
                                {getFieldDecorator(`field`, {})(
                                    <Select
                                        placeholder=""
                                        //  onChange={this.handleSelectChange}
                                    >
                                        <Option value={null}>全部</Option>
                                        <Option value="male">btc</Option>
                                        <Option value="female">eth</Option>
                                    </Select>
                                )}
                            </FormItem>
                        </Col>

                    </Row>
                </div>
                <Button htmlType="submit" type="primary" icon="search" style={{
                    marginLeft: '10px', marginTop: '4px'
                }}>搜索
                </Button>
            </Form>
        );
    }
}

const NewUserListSearch = Form.create()(UserListSearch);
export default NewUserListSearch;
// {
//     validator: this.validateToNextPassword,
// }