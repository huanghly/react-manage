import {Form, Input, Icon, Select, DatePicker, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import React, {Component} from 'react';
import moment from 'moment';
import 'moment/locale/zh-cn';
import SearchModal from '../../components/modal/SearchModal.js'
import {articleTypeGetAll} from '../../requests/http-req.js'

moment.locale('zh-cn');
const FormItem = Form.Item;
const MonthPicker = DatePicker.MonthPicker;
const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;


class ArticleListSearch extends Component {
    state = {
        type: []
    };
    selectUserId = ''

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
        articleTypeGetAll().then(((req) => {
            console.log(req)
            this.setState({
                type: req.data.data
            })
        }))
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{
                    flexDirection: 'row', display: 'flex', minHeight: '60px', height: '60px', width: '100%'
                    , paddingRight: '15px', paddingLeft: '15px'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >

                <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                    <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={'关键字'}>
                        {getFieldDecorator('keyWords', {
                            rules: [{
                                message: '关键字',
                            }],
                        })(
                            <Input/>
                        )}
                    </FormItem>
                    <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={`文章类型`}>
                        {getFieldDecorator(`type`, {})(
                            <Select
                                placeholder="文章类型"
                            >
                                <Option key={1232} value={null}>全部</Option>
                                {
                                    this.state.type && this.state.type.map((item, index) => {
                                        return <Option key={index} value={item.typeName}>{item.typeName}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </FormItem>
                    <FormItem style={{margin: 'auto', flex: 1, paddingRight: '15px'}} label={`显示客户端`}>
                        {getFieldDecorator(`showClient`, {})(
                            <Select
                                placeholder="选择"
                                //   onChange={this.handleSelectChange}
                            >
                                <Option key={3} value={null}>全部</Option>
                                <Option key={1} value={1}>手机端</Option>
                                <Option key={2} value={2}>电脑端</Option>
                            </Select>
                        )}
                    </FormItem>
                    <div style={{flex: 1}}/>
                </div>

                <Button htmlType="submit" type="primary" icon="search" style={{
                    margin: 'auto'
                }}>搜索
                </Button>
            </Form>
        );
    }
}

const NewArticleListSearch = Form.create()(ArticleListSearch);
export default NewArticleListSearch;
