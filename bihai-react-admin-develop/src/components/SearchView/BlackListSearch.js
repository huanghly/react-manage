import {Form, Input, Tooltip, Icon, Select, DatePicker, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import React, {Component} from 'react';
import SearchModal from '../../components/modal/SearchModal.js'
import 'moment/locale/zh-cn';

const FormItem = Form.Item;


class BlackListSearch extends React.Component {
    state = {
        showSearchModal: false,
        phone: '',
        email: '',
    };
    handleSearch = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                console.log('Received values of form: ', values);
                this.props.handleSearch && this.props.handleSearch(this.selectUserId)
            }
        });

    }

    onFocu = () => {
        this.selectUserId = null
        this.setState({showSearchModal: true})

    }

    onCancel = () => {
        this.setState({
            showSearchModal: false
        })
    }

    onSelectRow = (e) => {
        console.log(e)
        this.selectUserId = e.userId
        this.setState({
            phone: e.mobile || e.phoneNo || null,
            email: e.email || null,
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        return (
            <Form
                style={{
                    flexDirection: 'row',
                    display: 'flex',
                    height: '60px',
                    alignItems: 'center',
                    paddingLeft: '20px',
                    paddingRight: '20px'
                }}
                className="ant-advanced-search-form"
                onSubmit={this.handleSearch}
            >
                <div style={{display: 'flex', width: '100%', flex: 1, alignItems: 'center'}}>
                    {this.state.showSearchModal &&
                    <SearchModal showModal={this.state.showSearchModal} closeSearchModal={this.onCancel}
                                 onSelectRow={this.onSelectRow}/>}
                    <div style={{width: '100%', display: 'flex', flexDirection: 'row'}}>
                        <FormItem style={{margin: 'auto', flex: 1}} label={'手机号码'}>
                            {getFieldDecorator('phoneNo', {
                                rules: [{
                                    message: '请输入手机号!',
                                }],
                            })(
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    marginTop: '3px'
                                }}>
                                    <Button style={{marginTop: '4px', width: '100%'}}
                                            onClick={this.onFocu}>{this.state.phone}</Button>
                                    {this.state.phone != '' ?
                                        <img src={require('../../resources/imgs/del_icon.png')}
                                             onClick={() => {
                                                 this.selectUserId = ''
                                                 this.setState({phone: '', email: ''})
                                             }} style={{
                                            height: '10px',
                                            width: '10px',
                                            position: 'relative',
                                            right: '20px'
                                        }}/> : null
                                    }
                                </div>
                            )}
                        </FormItem>
                        <FormItem style={{margin: 'auto', flex: 1, marginLeft: '10px'}} label={'邮箱'}>
                            {getFieldDecorator(`email`, {
                                rules: [{
                                    message: '请输入邮箱!',
                                }],
                            })(
                                <div onClick={this.onFocu}
                                     style={{display: 'flex', alignItems: 'center', marginTop: '3px'}}>
                                    <Button style={{marginTop: '4px', width: '100%'}}
                                            onClick={this.onFocu}>{this.state.email}</Button>
                                    {this.state.email != '' ?
                                        <img src={require('../../resources/imgs/del_icon.png')}
                                             onClick={() => {
                                                 this.selectUserId = ''
                                                 this.setState({email: '', phone: ''})
                                             }} style={{
                                            height: '10px',
                                            width: '10px',
                                            position: 'relative',
                                            right: '20px'
                                        }}/> : null
                                    }

                                </div>
                            )}
                        </FormItem>
                        <div style={{flex: 2}}></div>
                    </div>
                </div>
                <Button htmlType="submit" type="primary" icon="search">搜索
                </Button>
            </Form>
        );
    }
}

const NewBlackListSearch = Form.create()(BlackListSearch);
export default NewBlackListSearch;
