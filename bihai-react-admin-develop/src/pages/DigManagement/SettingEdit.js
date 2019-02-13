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


class SettingEdit extends Component {
    componentDidMount() {
        if (this.itemData) {
            console.log(this.itemData)
            this.props.form.setFieldsValue({
                totalAmount: this.itemData.totalAmount,
                totalAmountSecond: this.itemData.totalAmountSecond,
                bonusDayUsdt: this.itemData.bonusDayUsdt || 0,
                bonusRate: this.itemData.bonusRate || 0,
                miningTmt: this.itemData.miningTmt || 0,
                miningTmtAmount: this.itemData.miningTmtAmount || 0,
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
                    values.status = this.itemData.status
                }
                this.props.postData(values)
            }
        });
    }


    render() {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 9},
            wrapperCol: {span: 14},
        };
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem label={`流通总量`}   {...formItemLayout} >
                    {getFieldDecorator('totalAmount', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input placeholder=""/>
                    )}
                </FormItem>


                <FormItem
                    {...formItemLayout} label={`二级市场流通量`}>
                    {getFieldDecorator('totalAmountSecond', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout} label={`每百万TMT日分红折合USDT`}>
                    {getFieldDecorator('bonusDayUsdt', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input/>
                    )}
                </FormItem>
                <FormItem    {...formItemLayout} label={`TMT日分红率`}>
                    {getFieldDecorator('bonusRate', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input/>
                    )}
                </FormItem>

                <FormItem  {...formItemLayout} label={`挖矿释放TMT文字`}>
                    {getFieldDecorator('miningTmt', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input/>
                    )}
                </FormItem>

                <FormItem  {...formItemLayout} label={`挖矿释放TMT数字`}>
                    {getFieldDecorator('miningTmtAmount', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input/>
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

const nSettingEdit = Form.create()(SettingEdit);
export default nSettingEdit
