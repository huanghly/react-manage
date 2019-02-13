import {Form, message, Upload, Input, InputNumber, Button, Radio, Select} from 'antd';
import React, {Component} from 'react';
import {updateLevelRate} from '../../requests/http-req.js';
import history from '../../history.js'

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class EditLevelRate extends Component {
    state = {
        image: null
    };
    handleSubmit = (e) => {

        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //console.log(values)
                updateLevelRate(JSON.stringify(values)).then(req => {
                    //console.log(req)
                    message.success('更新成功')
                })
            }
        });
    }


    componentDidMount() {
        if (this.itemData) {
            //console.log(this.itemData)
            this.props.form.setFieldsValue({
                drawLimit: this.itemData.drawLimit,
                levelId: this.itemData.levelId,
                levelName: this.itemData.levelName,
                leverageAmount: this.itemData.leverageAmount,
                leverageMakerRatio: this.itemData.leverageMakerRatio,
                leverageTakerRatio: this.itemData.leverageTakerRatio,
                otcAmount: this.itemData.otcAmount,
                otcMakerRatio: this.itemData.otcMakerRatio,
                otcTakerRatio: this.itemData.otcTakerRatio,
                spotAmount: this.itemData.spotAmount,
                spotMakerRatio: this.itemData.spotMakerRatio,
                spotTakerRatio: this.itemData.spotTakerRatio,
            })

        }
    }

    componentWillMount() {
        this.itemData = this.props.location.state && this.props.location.state.data
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: {span: 8},
            },
        };

        return (
            <div className='center-user-list'>
                <Form onSubmit={this.handleSubmit} style={{paddingBottom: '20px', justifyContent: 'center'}}
                >
                    <FormItem
                        {...formItemLayout}
                        label="每日提现额度"
                    >
                        {getFieldDecorator('drawLimit', {
                            rules: [{
                                required: true, message: '每日提现额度!',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="用户等级ID"
                    >
                        {getFieldDecorator('levelId', {
                            rules: [{
                                required: true, message: '用户等级ID!',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="等级名称"
                    >
                        {getFieldDecorator('levelName', {
                            rules: [{
                                required: true, message: '等级名称',
                            }, {whitespace: true, message: '不能为空'}],
                        })(
                            <Input style={{width: '100px'}}/>
                        )}
                    </FormItem>


                    <FormItem
                        {...formItemLayout}
                        label="杠杆交易量"
                    >
                        {getFieldDecorator('leverageAmount', {
                            rules: [{
                                required: true, message: '交易状态',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>


                    <FormItem
                        {...formItemLayout}
                        label="杠杆挂单手续费"
                    >
                        {getFieldDecorator('leverageMakerRatio', {
                            rules: [{
                                required: true, message: '杠杆挂单手续费',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="杠杆吃单手续费"
                    >
                        {getFieldDecorator('leverageTakerRatio', {
                            rules: [{
                                required: true, message: '杠杆挂单手续费',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>

                    <FormItem
                        {...formItemLayout}
                        label="法币交易量"
                    >
                        {getFieldDecorator('otcAmount', {
                            rules: [{
                                required: true, message: '法币交易量',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="法币挂单手续费"
                    >
                        {getFieldDecorator('otcMakerRatio', {
                            rules: [{
                                required: true, message: '法币交易量',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="法币吃单手续费"
                    >
                        {getFieldDecorator('otcTakerRatio', {
                            rules: [{
                                required: true, message: '法币交易量',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="币币交易量"
                    >
                        {getFieldDecorator('spotAmount', {
                            rules: [{
                                required: true, message: '法币交易量',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="币币挂单手续费"
                    >
                        {getFieldDecorator('spotMakerRatio', {
                            rules: [{
                                required: true, message: '币币挂单手续费',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>
                    <FormItem
                        {...formItemLayout}
                        label="币币吃单手续费"
                    >
                        {getFieldDecorator('spotTakerRatio', {
                            rules: [{
                                required: true, message: '币币吃单手续费',
                            }],
                        })(
                            <InputNumber min={0}/>
                        )}
                    </FormItem>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        height: '60px',
                        justifyContent: 'center',
                        marginBottom: '30px'
                    }}>
                        <Button htmlType="submit">{'修改'}</Button>
                        <Button style={{marginLeft: '30px'}} onClick={() => history.go(-1)}>{'返回'}</Button>
                    </div>
                </Form>
            </div>
        );
    }
}

const NewEditLevelRate = Form.create()(EditLevelRate);
export default NewEditLevelRate;
