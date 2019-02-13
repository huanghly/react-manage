import {Form, Input, Icon, Select, DatePicker, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SearchModal from '../../components/modal/SearchModal.js'
import {getCodeType} from '../../requests/http-req.js'

moment.locale('zh-cn');
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;


class CashBalanceListSearch extends Component {
    state = {};

    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                if (this.props.handleSearch) {
                    this.props.handleSearch(values)
                }
            }
        });
    }

    componentWillMount() {
    }

    componentDidMount() {
//获取币种类型 //获取提现类型的接口
        getCodeType().then(((req) => {
            this.setState({
                codeType: req.data.data
            }, () => {
                this.props.form.setFieldsValue({
                    coinCode: this.props.coinCode ? this.props.coinCode : this.state.codeType[0],
                    balanceTime: this.props.balanceTime ? moment(this.props.balanceTime, 'YYYY-MM-DD') : moment(moment().add(-1, 'days').format('YYYY/MM/DD'), 'YYYY-MM-DD'),
                    //   balanceTime: moment().add(-1, 'days').format('YYYY/MM/DD'),
                })
            })
        }))

    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{
                    flexDirection: 'row', display: 'flex', minHeight: '60px', height: '60px', width: '100%'
                    , paddingRight: '15px', paddingLeft: '15px', alignItems: 'center'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <div style={{
                    display: 'flex',
                    width: '100%',
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}>
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>

                        <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={`币种`}>
                            {getFieldDecorator(`coinCode`, {
                                rules: [{
                                    required: true,
                                    message: '选择币种'
                                }]
                            })(
                                <Select
                                    placeholder="选择币种"
                                >
                                    {
                                        this.state.codeType && this.state.codeType.map((item, index) => {
                                            return <Option key={index} value={item}>{item}</Option>
                                        })
                                    }
                                </Select>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 'auto', flex: 1}} label={`时间`}>
                            {getFieldDecorator('balanceTime', {
                                rules: [{
                                    required: true,
                                    message: '选择时间'
                                }],
                            })(
                                <DatePicker
                                    format="YYYY-MM-DD"
                                    disabledTime={true}
                                />)}
                        </FormItem>
                        <view style={{flex: 2}}></view>
                    </div>
                </div>
                <Button htmlType="submit" type="primary" icon="search" style={{
                    marginLeft: '10px',
                }}>搜索
                </Button>
            </Form>
        );
    }
}

const NewCashBalanceListSearch = Form.create()(CashBalanceListSearch);
export default NewCashBalanceListSearch;
