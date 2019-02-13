/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Form, Select, Input, Radio, Button, DatePicker, message} from 'antd';
import moment from 'moment'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}


class EditAPI extends Component {
    componentDidMount() {
        if (this.itemData) {

            this.props.form.setFieldsValue({
                apiKey: this.itemData.apiKey,
                apiSecretKey: this.itemData.apiSecretKey,
                id: this.itemData.apiSecretKey,
                ip: this.itemData.ip,
                status: this.itemData.status,
                userId: this.itemData.userId,

            })
        }
    }

    componentWillMount() {
        this.itemData = this.props.itemData || null
    }

    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.itemData) {
                    values.id = this.itemData.id
                }
                this.props.postData(values)
            }
        });
    }

    render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem label={`用户id`}   {...formItemLayout} >
                    {getFieldDecorator('userId', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'} placeholder=""/>
                    )}
                </FormItem>

                <FormItem
                    {...formItemLayout} label={`KEY`}>
                    {getFieldDecorator('apiKey', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout} label={`密钥`}>
                    {getFieldDecorator('apiSecretKey', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout} label={`IP`}>
                    {getFieldDecorator('ip', {
                        rules: [{message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'} placeholder="多个ip使用英文;分隔"/>
                    )}
                </FormItem>

                <FormItem  {...formItemLayout} label={`状态`}>
                    {getFieldDecorator('status', {
                        rules: [], initialValue: 0
                    })(
                        <Select
                            style={{width: '200px'}}
                            placeholder="状态"
                        >
                            <Option key='android' value={0}>启动</Option>
                            <Option key='ios' value={1}>禁用</Option>
                        </Select>
                    )}
                </FormItem>

                <div style={{display: 'flex', flex: 1, justifyContent: 'center'}}>
                    <Button
                        onClick={this.handleSubmit}
                        type="primary"
                        style={{marginRight: '20px'}}
                        disabled={hasErrors(getFieldsError())}
                    >
                        提交
                    </Button>
                    <Button onClick={this.props.onCancel}>返回 </Button>
                </div>
            </Form>
        )
    }

}

const NewEditAPI = Form.create()(EditAPI);
export default NewEditAPI
