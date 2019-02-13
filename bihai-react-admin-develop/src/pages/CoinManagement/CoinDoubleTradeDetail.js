/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {Form, Select, InputNumber, Radio, Button, TimePicker, message, Input} from 'antd';
import Breadcrumb from '../../components/Breadcrumb.js'
import {tradeInfoSave, getCodeType, withDrawRateUpdate, tradeInfoUpdate} from '../../requests/http-req.js'
import './CoinDoubleTradeDetail/CoinDoubleTradeDetail.css'
import moment from 'moment';
import history from '../../history.js'

const RadioGroup = Radio.Group;
const Option = Select.Option;
const FormItem = Form.Item;

function hasErrors(fieldsError) {
    return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class CoinDoubleTradeDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeType: [],
            coinTwo: null,
            coinOne: null,
            openTime: '00:00:00',
            closeTime: '23:59:59'
        }
    }

    componentWillMount() {
        this.itemData = this.props.location.state && this.props.location.state.data

        if (this.itemData) {

            let arr = this.itemData.tradeCode.split(`/`)

            this.setState({
                coinOne: arr[0],
                coinTwo: arr[1],
                openTime: this.itemData.openTime,
                closeTime: this.itemData.closeTime
            })
        }

    }

    componentDidMount() {
        this.setFormValue()
        getCodeType().then(((res) => {
            this.setState({
                codeType: res.data.data
            })
        }))
    }

    setFormValue = () => {
        if (this.itemData) {

            if (typeof( this.itemData.recommend != undefined) && this.itemData.recommend == 0) {
                this.props.form.setFieldsValue({
                    recommend: 0
                })
            } else {
                this.props.form.setFieldsValue({
                    recommend: 1
                })
            }
            this.props.form.setFieldsValue({
                tradeName: this.itemData.tradeName,
                sort: this.itemData.sort,
                leverageTimes: this.itemData.leverageTimes,
                minQty: this.itemData.minQty,
                maxQty: this.itemData.maxQty,
                minPrice: this.itemData.minPrice,
                maxPrice: this.itemData.maxPrice,
                min: this.itemData.min,
                max: this.itemData.max,
                stepSize: this.itemData.stepSize,
                tickSize: this.itemData.tickSize,
                decimalPlaces: this.itemData.decimalPlaces,
                increase: this.itemData.increase,
                leverageLock: this.itemData.leverageLock,
                conventionLock: this.itemData.conventionLock,
                limitLock: this.itemData.limitLock,
                marketLock: this.itemData.marketLock,
                entrustMaxAmount: this.itemData.entrustMaxAmount || null,
                entrustMinAmount: this.itemData.entrustMinAmount || null,
                // baseLeverageLimit: this.itemData.baseLeverageLimit || null,
                quoteLeverageLimit: this.itemData.quoteLeverageLimit || null,
                // stopProfit: this.itemData.stopProfit || null,
                // stopLoss: this.itemData.stopLoss || null,
                merge: this.itemData.merge && parseInt(this.itemData.merge),
            })
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                if (this.state.coinTwo == this.state.coinOne) {
                    message.warning('选择币种不能相同')
                    return
                }

                if (moment('2018/01/01 ' + this.state.closeTime).isBefore('2018/01/01 ' + this.state.openTime)) {
                    message.warning('关闭时间不能在开启时间之前')
                    return
                }
                if (this.state.coinOne == '' || this.state.coinTwo == '') {
                    message.warning('交易币对不能为空')
                    return
                }
                //委托单
                if (parseFloat(values.minQty) > parseFloat(values.maxQty)) {
                    message.warning('最小委托单数量要小于最大委托单！')
                    return
                }
                if (parseFloat(values.minPrice) > parseFloat(values.maxPrice)) {
                    message.warning('最低委托单价格要小于最高委托单价格！')
                    return
                }
                if (parseFloat(values.entrustMinAmount) > parseFloat(values.entrustMaxAmount)) {
                    message.warning('最低委托额价格要小于最高委托额价格！')
                    return
                }
                //最小委托额
                if (parseFloat(values.entrustMinAmount) < (parseFloat(values.minQty) * parseFloat(values.minPrice))) {
                    message.warning('委托单最小额不在正确范围内')
                    return
                }
                //最大委托额
                if (parseFloat(values.entrustMaxAmount) > (parseFloat(values.maxPrice) * parseFloat(values.maxQty))) {
                    message.warning('委托单最大额不在正确范围内')
                    return
                }
                //console.log('Received values of form: ', values);
                //添加最小额 最大额 币对 拼接

                values.tradeCode = this.state.coinOne + '/' + this.state.coinTwo
                values.tradeName = (this.state.coinOne + '/' + this.state.coinTwo).toLowerCase()
                //提交时间
                values.openTime = this.state.openTime
                values.closeTime = this.state.closeTime

                this.postData(values)

            }
        });
    }
    //表单验证   币对选择、最小额，最大额

    renderFormView = () => {
        const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
        const formItemLayout = {
            labelCol: {span: 12}, // 24
            wrapperCol: {span: 12},
        };
        return (
            <Form onSubmit={this.handleSubmit}>

                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem
                        className='cdtc-form-item'
                        label={`币对`}>
                        {getFieldDecorator('tradeName', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            <div className='cdtc-input-width'>
                                <Select
                                    style={{marginBottom: '0px'}}

                                    value={this.state.coinOne}
                                    onChange={(v) => {
                                        this.props.form.setFieldsValue({tradeName: v})
                                        this.setState({coinOne: v})
                                    }}
                                >
                                    {
                                        this.state.codeType && this.state.codeType.map((item, index) => {
                                            return <Option key={item + index} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                                一
                                <Select
                                    style={{marginBottom: '0px'}}

                                    value={this.state.coinTwo}
                                    onChange={(v) => {
                                        this.setState({coinTwo: v})
                                    }}
                                >
                                    {
                                        this.state.codeType && this.state.codeType.map((item, index) => {
                                            return <Option key={item + index} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            </div>
                        )}
                    </FormItem>
                    <div className='cdtc-note'></div>
                </div>

                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem
                        className='cdtc-form-item'

                        label={`排序`}>
                        {getFieldDecorator('sort', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            < InputNumber min={0} id={'sort'} className='cdtc-input-width'/>
                        )}
                    </FormItem>


                    <div className='cdtc-note'>备注：币对在前台显示的顺序</div>

                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem
                        className='cdtc-form-item'
                        label={`杠杆倍数及强平线`}>
                        {getFieldDecorator('leverageTimes', {})(
                            <Input className='cdtc-input-width'/>
                        )}
                    </FormItem>
                    <div className='cdtc-note'>备注：杠杆倍数至少需要三级，使用`,`分隔；强平线使用`|`与杠杆倍数分离，例如1,2,3|3,2,1</div>
                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`委托单最小量`}>
                        {getFieldDecorator('minQty', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            < InputNumber min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>
                    <div className='cdtc-note'>备注：购买或卖出币种的最小数量</div>
                </div>

                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`委托单最大量`}>
                        {getFieldDecorator('maxQty', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            < InputNumber min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>
                    <div className='cdtc-note'>备注：购买或卖出币种的最大数量</div>
                </div>

                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`委托单最低价`}>
                        {getFieldDecorator('minPrice', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            < InputNumber min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>

                    <div className='cdtc-note'>备注：购买或卖出币种的最小交易价格</div>
                </div>

                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`委托单最高价`}>
                        {getFieldDecorator('maxPrice', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            < InputNumber min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>

                    <div className='cdtc-note'>备注：购买或卖出币种的最大交易价格</div>
                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`最小委托额`}>
                        {getFieldDecorator('entrustMinAmount', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            <Input type='number' min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>

                    <div className='cdtc-note'>备注：最小委托额＞=委托单最小量*委托单最低价</div>
                </div>

                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`最大委托额`}>
                        {getFieldDecorator('entrustMaxAmount', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            <Input type='number' min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>

                    <div className='cdtc-note'>备注：最大委托额＜=委托单最大量*委托单最高价</div>
                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`数量步长`}>
                        {getFieldDecorator('stepSize', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            < Input type='number' min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>

                    <div className='cdtc-note'>备注：交易数量的最大小数位数</div>
                </div>

                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`价格步长`}>
                        {getFieldDecorator('tickSize', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            <Input type='number' min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>

                    <div className='cdtc-note'>备注：交易价格的最大小数位数</div>
                </div>


                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`小数位`}>
                        {getFieldDecorator('decimalPlaces', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            < InputNumber min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>

                    <div className='cdtc-note'>备注：暂时无作用</div>
                </div>


                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`价格振幅`}>
                        {getFieldDecorator('increase', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            < InputNumber min={0} className='cdtc-input-width'/>
                        )}
                    </FormItem>

                    <div className='cdtc-note'>备注：控制下单价格的范围</div>
                </div>
                {/*<div className='cdtd-item-row'>*/}
                    {/*<div className='flex-1'/>*/}
                    {/*<FormItem className='cdtc-form-item' label={`交易货币杠杆限额`}>*/}
                        {/*{getFieldDecorator('baseLeverageLimit', {*/}
                            {/*rules: [{required: true, message: '不能为空'}],*/}
                        {/*})(*/}
                            {/*<InputNumber className='cdtc-input-width'/>*/}
                        {/*)}*/}
                    {/*</FormItem>*/}
                    {/*<div className='cdtc-note'>备注：最大持仓量</div>*/}
                {/*</div>*/}
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`计价货币杠杆限额`}>
                        {getFieldDecorator('quoteLeverageLimit', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            <InputNumber className='cdtc-input-width'/>
                        )}
                    </FormItem>

                    <div className='cdtc-note'>备注：市价买入时，支持的最大交易额</div>
                </div>
                {/*<div className='cdtd-item-row'>*/}
                {/*<div className='flex-1'/>*/}
                {/*<FormItem className='cdtc-form-item' label={`止盈`}>*/}
                {/*{getFieldDecorator('stopProfit', {*/}
                {/*rules: [{required: true, message: '不能为空'}],*/}
                {/*})(*/}
                {/*< InputNumber  className='cdtc-input-width'/>*/}
                {/*)}*/}
                {/*</FormItem>*/}

                {/*<div className='cdtc-note'></div>*/}
                {/*</div>*/}
                {/*<div className='cdtd-item-row'>*/}
                {/*<div className='flex-1'/>*/}
                {/*<FormItem className='cdtc-form-item' label={`止损`}>*/}
                {/*{getFieldDecorator('stopLoss', {*/}
                {/*rules: [{required: true, message: '不能为空'}],*/}
                {/*})(*/}
                {/*< InputNumber  className='cdtc-input-width'/>*/}
                {/*)}*/}
                {/*</FormItem>*/}

                {/*<div className='cdtc-note'></div>*/}
                {/*</div>*/}

                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`是否推荐`}>
                        {getFieldDecorator('recommend', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            <Select
                                style={{width: '250px'}}
                            >
                                <Option value={0}>不推荐</Option>
                                <Option value={1}>推荐</Option>
                            </Select>
                        )}
                    </FormItem>
                    <div className='cdtc-note'></div>
                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`板块选择`}>
                        {getFieldDecorator('merge', {
                            rules: [{required: true, message: '不能为空'}],
                        })(
                            <Select
                                style={{width: '250px'}}
                            >

                                <Option value={1}>淘金板块</Option>
                                <Option value={0}>标准板块</Option>
                                <Option value={2}>共识区板块</Option>
                                <Option value={3}>创新区板块</Option>
                            </Select>
                        )}
                    </FormItem>
                    <div className='cdtc-note'></div>
                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`开盘时间`}>
                        <TimePicker
                            className='cdtc-input-width'
                            onChange={(time, string) => this.changeTime(string, 'open')}
                            defaultValue={moment(this.state.openTime, 'HH:mm:ss')}/>
                    </FormItem>
                    <div className='cdtc-note'></div>
                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`收盘时间`}>

                        <TimePicker
                            className='cdtc-input-width'
                            onChange={(time, string) => this.changeTime(string, 'close')}
                            defaultValue={moment(this.state.closeTime, 'HH:mm:ss')}/>
                    </FormItem>
                    <div className='cdtc-note'></div>
                </div>


                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`市价开关`}>
                        {getFieldDecorator('marketLock', {
                            rules: [{required: true, message: '不能为空'}],
                            initialValue: 0
                        })(
                            <Select style={{width: 250}} className='cdtc-input-width'>
                                <Option key={124332} value={0}>开启</Option>
                                <Option key={2652} value={1}>关闭</Option>
                            </Select>
                        )}
                    </FormItem>

                    <div className='cdtc-note'></div>
                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`限价开关`}>
                        {getFieldDecorator('limitLock', {
                            rules: [{required: true, message: '不能为空'}],
                            initialValue: 0
                        })(
                            <Select style={{width: 250}} className='cdtc-input-width'>
                                <Option key={51232} value={0}>开启</Option>
                                <Option key={242} value={1}>关闭</Option>
                            </Select>
                        )}
                    </FormItem>

                    <div className='cdtc-note'></div>
                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`交易开关`}>
                        {getFieldDecorator('conventionLock', {
                            rules: [{required: true, message: '不能为空'}],
                            initialValue: 0
                        })(
                            <Select style={{width: 250}} className='cdtc-input-width'>
                                <Option key={11232} value={0}>开启</Option>
                                <Option key={222} value={1}>关闭</Option>
                            </Select>
                        )}
                    </FormItem>

                    <div className='cdtc-note'></div>
                </div>
                <div className='cdtd-item-row'>
                    <div className='flex-1'/>
                    <FormItem className='cdtc-form-item' label={`杠杆开关`}>
                        {getFieldDecorator('leverageLock', {
                            rules: [{required: true, message: '不能为空'}],
                            initialValue: 0
                        })(
                            <Select style={{width: 250}} className='cdtc-input-width'>
                                <Option key={1232} value={0}>开启</Option>
                                <Option key={22} value={1}>关闭</Option>
                            </Select>
                        )}
                    </FormItem>

                    <div className='cdtc-note'></div>
                </div>

                <div
                    style={{
                        display: 'flex',
                        flex: 1,
                        width: '100%',
                        justifyContent: 'center',
                        marginBottom: '20px',
                        marginTop: '20px'
                    }}>
                    <Button
                        onClick={this.handleSubmit}
                        type="primary"
                        style={{marginRight: '20px'}}
                        disabled={hasErrors(getFieldsError())}
                    >
                        {this.itemData ? '更新' : '保存'}
                    </Button>
                    <Button onClick={() => history.go(-1)}>返回</Button>
                </div>
            </Form>
        )
    }
    changeTime = (time, tag) => {
        tag == 'open' ? this.setState({openTime: time}) : this.setState({closeTime: time})
    }

    postData = (values) => {

        //  //console.log(moment(values.closeTime).format('HH:mm:ss'))
        // values.closeTime = values.closeTime ? moment(values.closeTime).format('HH:mm:ss') : '00:00:00'
        // values.openTime = values.closeTime ? moment(values.closeTime).format('HH:mm:ss') : '23:59:59'

        //console.log(values)
        //更新 新增加
        if (this.itemData) {
            values.id = this.itemData.id
            values.tradeStatus = this.itemData.tradeStatus

            tradeInfoUpdate(values).then(res => {
                if (res.status = "0") {
                    message.success('更新成功')
                    history.go(-1)
                } else {
                    message.success('操作失败')
                }
            }).catch(e => {
                //console.log(e)
                if (e) {
                    message.warning('保存失败')
                }
            })
        } else {
            tradeInfoSave(values).then(res => {
                if (res.status == 200) message.success('保存成功')
                history.go(-1)
            }).catch(e => {
                //console.log(e)
                if (e) {
                    //console.log(e)
                    message.warning(e.data.error)
                }
            })
        }
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {this.renderFormView()}
            </div>
        )
    }
}


export default CoinDoubleTradeDetail = Form.create()(CoinDoubleTradeDetail);
