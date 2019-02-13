import {Form, Row, Col, Input, Button, Icon, Select, message} from 'antd';
import React, {Component} from 'react';
import {getImageCode} from '../../requests/http-req.js';
import appConfig from '../../config/appConfig.js'

const FormItem = Form.Item;
const Option = Select.Option;

class LoginForm extends Component {
    state = {
        image: null
    };
    count = 5
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                //   console.log('Received values of form: ', values);
                if (this.props && this.props.goto) {
                    this.props.goto(values, this.state.image)
                    // this.props.form.setFields({
                    //     password: {
                    //         value: '',
                    //     }, imageCode: {
                    //         value: '',
                    //     }, username: {
                    //         value: '',
                    //     }
                    // });

                }
            }
        });
    }

    componentDidMount() {
        this.getMyImageCode()

    }

    componentWillMount() {

        // if (this.timer != null) {
        //     clearInterval(this.timer);
        // }
    }

    // getCode = () => {
    //
    //     this.timer = setInterval(() => {
    //         if (this.count == 0) {
    //             clearInterval(this.timer);
    //             this.setState({
    //                 verificationButton: '再次获取验证码',
    //                 disabledButton: false
    //             })
    //         }
    //         this.setState({
    //             verificationButton: (this.count--) + '秒后重试',
    //             disabledButton: true
    //         })
    //
    //     }, 1000)
    //
    // }
    delay = (time) => new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    })

    // handleClick = async () => {
    //     await this.delay(3000)
    //     this.countdown.reset()
    // }
    getMyImageCode = () => {
        getImageCode({width: 80, height: 30}).then((res) => {
            console.log(res)
            this.setState({
                image: res.data.data
            })
        }).catch(e => {
            if (e) {
                message.warning(e.data.message)
            }
        })
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                xs: {span: 24},
                sm: {span: 8},
            },
            wrapperCol: {
                xs: {span: 24},
                sm: {span: 16},
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };


        return (
            <Form style={{
                height: '100%',
            }} onSubmit={this.handleSubmit}>
                <div style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    flexDirection: 'column'
                }}>
                    <img style={{marginBottom: '60px', width: '60px', height: '60px'}}
                         src={appConfig.getENV().logo}/>
                    <FormItem
                        label=""
                    >
                        {getFieldDecorator('username', {
                            rules: [{
                                required: true, message: '请输入用户名!',
                            }],
                        })(
                            <Input style={{width: '400px'}} placeholder="用户名"/>
                        )}
                    </FormItem>
                    <FormItem
                        label=""
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入你的密码！',
                            }],
                        })(
                            <Input style={{width: '400px'}} placeholder="密码" type="password"/>
                        )}
                    </FormItem>
                    <FormItem
                        label=""
                    >
                        {getFieldDecorator('imageCode', {
                            rules: [{
                                required: true, message: '验证码!',
                            }],
                        })(
                            <div style={{display: 'flex', flexDirection: 'row', width: '400px'}}>
                                <Input style={{width: '100px', flex: 1, marginRight: '5px'}} placeholder="验证码"/>
                                {this.state.image &&
                                <img onClick={this.getMyImageCode}
                                     src={'data:image/gif;base64,' + this.state.image.imageBase64}/>}
                            </div>
                        )}
                    </FormItem>
                    <FormItem>
                        <Button style={{width: '400px', backgroundColor: '#5e50db'}} type="primary"
                                htmlType="submit">登录</Button>
                    </FormItem>
                </div>
            </Form>
        );
    }
}

const NewLoginForm = Form.create()(LoginForm);
export default NewLoginForm;
// {
//     validator: this.validateToNextPassword,
// }