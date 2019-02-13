import {Form, message, Upload, InputNumber, Button, Radio, Select} from 'antd';
import React, {Component} from 'react';
import {getImageCode} from '../../requests/http-req.js';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class OtcCoinEdit extends Component {
    state = {
        image: null
    };
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {

                //console.log(values)
                //广告呈现最低额
                if (parseFloat(values.advertMin) < parseFloat(values.tradeMin)) {
                    message.warning('广告呈现最低量要大于最低交易金额')
                    return
                }
                if (this.itemData) { //更新
                    this.itemData.advertMin = values.advertMin
                    this.itemData.coinCode = values.coinCode
                    this.itemData.sortNo = values.sortNo
                    this.itemData.tradeMin = values.tradeMin
                    this.itemData.tradeStatus = values.tradeStatus
                    this.props.upData(this.itemData)
                } else {
                    this.props.onSave(values)
                }
            }
        });
    }

    componentDidMount() {
        if (this.itemData) {
            //console.log(this.itemData)
            this.props.form.setFieldsValue({
                advertMin: this.itemData.advertMin,
                coinCode: this.itemData.coinCode,
                tradeMin: this.itemData.tradeMin,
                tradeStatus: this.itemData.tradeStatus,
                sortNo: this.itemData.sortNo,
            })
        }

    }

    componentWillMount() {
        this.itemData = this.props.itemData || null

    }

    normFile = (e) => {
        //console.log('上传:', e);
        if (Array.isArray(e)) {
            return e;
        }
        return e && e.fileList;
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: {span: 8},
            },
        };


        return (
            <Form onSubmit={this.handleSubmit}>
                <FormItem
                    {...formItemLayout}
                    label="选择币种"
                >
                    {getFieldDecorator('coinCode', {
                        rules: [{
                            required: true, message: '选择币种!',
                        }],
                    })(
                        <Select
                            style={{width: 300}}
                            placeholder="选择币种"
                        >
                            {
                                this.props.codeType && this.props.codeType.map((item, index) => {
                                    return <Option key={item + index} value={item}>{item}</Option>
                                })
                            }
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="广告呈现最低量"
                >
                    {getFieldDecorator('advertMin', {
                        rules: [{
                            required: true, message: '广告呈现最低量!',
                        }],
                    })(
                        <InputNumber min={0} style={{width: 300}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="最低交易金额"
                >
                    {getFieldDecorator('tradeMin', {
                        rules: [{
                            required: true, message: '最低交易金额',
                        }],
                    })(
                        <InputNumber min={0} style={{width: 300}}/>
                    )}
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="排序"
                >
                    {getFieldDecorator('sortNo', {
                        rules: [{
                            required: true, message: '排序，同等数值按时间排序',
                        }],
                    })(
                        <InputNumber min={0} max={9999} style={{width: 300}}/>
                    )}
                </FormItem>


                <FormItem
                    {...formItemLayout}
                    label="状态"
                >
                    {getFieldDecorator('tradeStatus', {
                        rules: [{
                            required: true, message: '交易状态',
                        }],
                    })(
                        <RadioGroup onChange={this.onChange} value={this.state.value}>
                            <Radio value={1}>启用</Radio>
                            <Radio value={0}>停用</Radio>
                        </RadioGroup>
                    )}
                </FormItem>
                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Button htmlType="submit">{this.itemData ? '修改' : '保存'}</Button>
                </div>

            </Form>
        );
    }
}

const NewOtcCoinEdit = Form.create()(OtcCoinEdit);
export default NewOtcCoinEdit;
