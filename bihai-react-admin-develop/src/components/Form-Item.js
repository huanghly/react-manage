import {Form, Input, Button, Radio, Select, DatePicker, Col, Row} from 'antd';
import React from 'react'
import ruleUtils from '../rules/ruleUtils';

const FormItem = Form.Item;
const checkPhone = (rule, value, callback) => {
    if (value!='') {
        callback();
        //console.log(`11111`)
        return;
    }
    //console.log(222)

    callback('');
}
const checkEmail = (rule, value, callback) => {
    if (ruleUtils.testEmail(value)) {
        callback();
        //console.log(`11111`)
        return;
    }
    //console.log(222)

    callback('');
}
export const FormItemPhone = (props) => {

    return (
        <FormItem style={{margin: 'auto'}} label={'手机号码·'}>
            {
                props.fieldDecorator('mobile', {
                    rules: [{validator: checkPhone}],

                })(
                    <Input placeholder="输入手机号"/>
                )}
        </FormItem>
    )
}

export const FormItemEmail = (props) => {
    return (
        <FormItem style={{margin: 'auto'}} label={'邮箱'}>
            {props.fieldDecorator(`email`, {
              //  rules: [{validator: checkEmail}]
            })(
                <Input placeholder="输入邮箱"/>
            )}
        </FormItem>
    )
}
