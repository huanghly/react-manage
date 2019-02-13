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


class EditForm extends Component {
    componentDidMount() {
        if (this.itemData) {
            let forceUpdate = this.itemData.forceUpdate

            this.props.form.setFieldsValue({
                appName: this.itemData.appName,
                applicationMarket: this.itemData.applicationMarket,
                currentVersion: this.itemData.currentVersion,
                forceUpdate: forceUpdate,
                type: this.itemData.type,
                url: this.itemData.url,
                versionDesc: this.itemData.versionDesc,
                isNewestVersion: this.itemData.newestVersion == this.itemData.currentVersion ? 1 : 0,
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
            labelCol: {span: 6},
            wrapperCol: {span: 14},
        };
        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem label={`应用名称`}   {...formItemLayout} >
                    {getFieldDecorator('appName', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'} placeholder=""/>
                    )}
                </FormItem>


                <FormItem
                    {...formItemLayout} label={`应用市场`}>
                    {getFieldDecorator('applicationMarket', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'} placeholder="多个使用，隔开"/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout} label={`当前版本`}>
                    {getFieldDecorator('currentVersion', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'}/>
                    )}
                </FormItem>
                <FormItem    {...formItemLayout} label={`强升最低版本`}>
                    {getFieldDecorator('forceUpdate', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'}/>
                    )}
                </FormItem>

                <FormItem  {...formItemLayout} label={`应用平台`}>
                    {getFieldDecorator('type', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Select
                            style={{width: '200px'}}
                            placeholder="应用平台"
                        >
                            <Option key='android' value='android'>android</Option>
                            <Option key='ios' value='ios'>ios</Option>
                        </Select>
                    )}
                </FormItem>
                {!this.itemData &&
                <FormItem  {...formItemLayout} label={`最新版本`}>
                    {getFieldDecorator('isNewestVersion', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Select
                            style={{width: '200px'}}
                            placeholder="最新版本"
                        >
                            <Option key='android' value={1}>是</Option>
                            <Option key='ios' value={0}>否</Option>
                        </Select>
                    )}
                </FormItem>
                }

                <FormItem  {...formItemLayout} label={`下载链接`}>
                    {getFieldDecorator('url', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'}/>
                    )}
                </FormItem>
                <FormItem  {...formItemLayout} label={`版本描述`}>
                    {getFieldDecorator('versionDesc', {
                        rules: [{required: true, message: '不能为空'}],
                    })(
                        <Input className={'edit-input-view'}/>
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

const EditVersion = Form.create()(EditForm);
export default EditVersion
