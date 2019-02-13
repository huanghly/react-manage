import {Form, Row, message, Input, Button, Radio, Progress, Select, Upload, Icon, InputNumber} from 'antd';
import React, {Component} from 'react'

import Breadcrumb from '../../components/Breadcrumb.js'
import {coininfoSave, coininfoUpload, upLoad} from '../../requests/http-req.js'
import history from '../../history'
import axios from 'axios';
import appStore from "../../appStore";

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


export default class AddCoinTypeEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            coinCode: null,
            coinName: null,
            coinFullName: null,
            drawMin: null,
            drawMax: null,
            coinPrecision: null,
            // istrade: null,
            isrecharge: null,
            isdraw: null,
            id: null,
            fileList: [],
            version: null,
            isMarketCoin: null,
            image: null,
            sortNo: null,
            percent: 0
        }
    }

    itemData = null

    componentWillMount() {
        this.itemData = this.props.location.state && this.props.location.state.data || null
        if (this.itemData) {
            this.setState({
                coinCode: this.itemData.coinCode,
                coinName: this.itemData.coinName,
                coinFullName: this.itemData.coinFullName,
                coinKind: this.itemData.coinKind,
                drawMin: this.itemData.drawMin,
                drawMax: this.itemData.drawMax,
                coinPrecision: this.itemData.coinPrecision,
                isMarketCoin: this.itemData.isMarketCoin,
                istrade: this.itemData.istrade == '是' ? 1 : 0,
                isrecharge: this.itemData.isrecharge == '是' ? 1 : 0,
                isdraw: this.itemData.isdraw == '是' ? 1 : 0,
                id: this.itemData.id,
                version: this.itemData.version,
                image: this.itemData.logoUrl,
                sortNo: this.itemData.sortNo || 0

            })
        }
    }

    validateStatus = (e) => {
        //console.log(e)
        return this.state.coinCode ? 'success' : 'warning'
    }
    handleChange = (info) => {

        const isLt1M = info.file.size / 1024 / 1024 < 1;
        if (!isLt1M) {
            return
        }

        let arr = info.file.name.split('.')
        let imgs = ['jpg', 'jpeg', 'png', 'png', 'jpg']
        if (imgs.indexOf(arr[1]) == -1) {
            return
        }
        let fileList = []
        fileList.push(info.fileList[info.fileList.length - 1])
        this.setState({fileList}, () => {
            //console.log(this.state.fileList)
        });
    }

    renderForm() {
        const props = {
            accept: 'image/*',
            customRequest: (e) => {
                this.uploadImg(e)
            },
            beforeUpload: (file) => {

                const isLt1M = file.size / 1024 / 1024 < 1;
                if (!isLt1M) {
                    message.warning('币种图片不能超过1M')
                    return false
                }
                let arr = file.name.split('.')
                let imgs = ['jpg', 'jpeg', 'png', 'png', 'jpg']
                if (imgs.indexOf(arr[1]) == -1) {
                    message.warning('只能选择图片')
                    return false
                } else {
                    return true;
                }
            },
            onChange: this.handleChange,
            listType: 'picture',
            onRemove: (file) => {
                this.setState(({fileList}) => {
                    const index = fileList.indexOf(file);
                    const newFileList = fileList.slice();
                    newFileList.splice(index, 1);
                    return {
                        fileList: newFileList,
                        percent: 0
                    };
                });
            },
        };
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
            <Form style={{marginLeft: '60px'}}>
                <FormItem
                    {...formItemLayout}
                    label="币种简称"
                    hasFeedback
                    validateStatus={this.state.coinCode ? 'success' : ''}//'success', 'warning', 'error', 'validating'。
                    help='请输入字母'
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <Input onChange={(e) => this.setState({coinCode: e.target.value.toUpperCase()})}
                           value={this.state.coinCode}
                           style={{width: '220px', marginRight: '50px'}}/>

                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="中文名称"
                    hasFeedback
                    validateStatus={this.state.coinName ? 'success' : ''}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <Input onChange={(e) => this.setState({coinName: e.target.value})}
                           type='text'
                           value={this.state.coinName}
                           style={{width: '220px', marginRight: '50px'}}/>

                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="币种全称"
                    hasFeedback
                    validateStatus={this.state.coinFullName ? 'success' : ''}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <Input onChange={(e) => this.setState({coinFullName: e.target.value})}
                           value={this.state.coinFullName}
                           style={{width: '220px', marginRight: '50px'}}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="上传图片"
                    // hasFeedback
                    validateStatus={this.state.image ? 'success' : ''}//'success', '', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <Upload {...props} fileList={this.state.fileList}>
                        <Button>
                            <Icon type="upload"/>{this.state.image ? '更换图片' : '上传图片'}
                        </Button>
                        {this.state.percent > 0 && this.state.percent < 100 ?
                            <Progress showInfo={false} width={250} status="active"
                                      percent={this.state.percent}/> : null}
                    </Upload>
                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="是否可充值"
                    // hasFeedback
                    // validateStatus={this.state.coinFullName ? 'success' : 'warning'}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <RadioGroup onChange={(e) => this.setState({isrecharge: e.target.value})}
                                value={this.state.isrecharge}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="是否是市场币"
                    // hasFeedback
                    // validateStatus={this.state.coinFullName ? 'success' : 'warning'}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <RadioGroup onChange={(e) => this.setState({isMarketCoin: e.target.value})}
                                value={this.state.isMarketCoin}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                </FormItem>

                <FormItem
                    {...formItemLayout}

                    label="是否可提现"
                    // hasFeedback
                    // validateStatus={this.state.coinFullName ? 'success' : 'warning'}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <RadioGroup onChange={(e) => this.setState({isdraw: e.target.value})} value={this.state.isdraw}>
                        <Radio value={1}>是</Radio>
                        <Radio value={0}>否</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="所属种类"
                    hasFeedback
                    validateStatus={() => this.state.coinKind ? 'success' : ''}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <Input onChange={(e) => this.setState({coinKind: e.target.value})}
                           value={this.state.coinKind}
                           style={{width: '220px', marginRight: '50px'}}/>
                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="最小提现"
                    hasFeedback
                    validateStatus={() => this.state.drawMin ? 'success' : ''}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <Input type='number' onChange={(e) => this.setState({drawMin: e.target.value})}
                           value={this.state.drawMin}
                           style={{width: '220px', marginRight: '50px'}}/>
                </FormItem>

                <FormItem
                    {...formItemLayout}

                    label="最大提现"
                    hasFeedback
                    validateStatus={() => this.state.drawMax ? 'success' : ''}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <Input type='number' onChange={(e) => this.setState({drawMax: e.target.value})}
                           value={this.state.drawMax}
                           style={{width: '220px', marginRight: '50px'}}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="数量精度"
                    hasFeedback
                    validateStatus={() => this.state.coinPrecision ? 'success' : ''}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <InputNumber onChange={(e) => this.setState({coinPrecision: e})}
                                 value={this.state.coinPrecision}
                                 style={{width: '220px', marginRight: '50px'}}/>
                </FormItem>
                <FormItem
                    {...formItemLayout}

                    label="排序"
                    hasFeedback
                    validateStatus={() => this.state.coinPrecision ? 'success' : ''}//'success', 'warning', 'error', 'validating'。
                    help=''
                    style={{display: 'flex', flexDirection: 'row'}}>
                    <InputNumber min={0} max={9999} onChange={(e) => this.setState({sortNo: e})}
                                 value={this.state.sortNo}
                                 style={{width: '220px', marginRight: '50px'}}/>
                </FormItem>

                <FormItem           {...tailFormItemLayout}
                >
                    <Button onClick={this.handleSubmit} style={{marginRight: '20px'}}>确定</Button>
                    <Button onClick={() => history.go(-1)}>返回</Button>
                </FormItem>
            </Form>
        )
    }

    handleSubmit = () => {
        const {coinCode, coinName, coinFullName, drawMin, drawMax, coinPrecision, isrecharge, isdraw, coinKind, isMarketCoin, image, sortNo} = this.state
        // alert('000')
        if (parseFloat(drawMin) < 0) {
            message.warning('最小提现不能小于0')
            return
        }
        if (parseFloat(drawMin) >= parseFloat(drawMax)) {
            message.warning('最小提现不能大于最大提现')
            return
        }
        if (coinCode == '' || coinName == '' || coinFullName == '' || drawMax == null || coinKind == null || isMarketCoin == null || drawMin == null || coinPrecision == null || isrecharge == null || isdraw == null || image == null || sortNo == null) {
            message.warn('信息不完整')
            return
        }
        // v.match( /^[\u4E00-\u9FA5]{1,}$/)
        // if (coinName.match(/^[\u4E00-\u9FA5]+$/)) {
        // } else {
        //     alert('中文名字不能有其他字符~')
        //     return
        // }

        let imgUrl = ''
        if (this.itemData) {
            if (this.state.image == this.itemData.logoUrl) { //没有改变
                imgUrl == null
            } else {
                imgUrl = this.state.image.relativePath
            }
        } else {
            imgUrl = this.state.image.relativePath
        }
        let obj = {
            coinKind: this.state.coinKind,
            isMarketCoin: this.state.isMarketCoin,
            coinCode: this.state.coinCode,
            coinName: this.state.coinName,
            coinFullName: this.state.coinFullName,
            rechargeMin: 1,//删除字段
            rechargeMax: 2,
            drawMin: this.state.drawMin,
            drawMax: this.state.drawMax,
            coinPrecision: this.state.coinPrecision,
            istrade: this.state.istrade || 1,
            isrecharge: this.state.isrecharge,
            isdraw: this.state.isdraw,
            logoUrl: imgUrl,
            sortNo: this.state.sortNo
        }

        if (this.itemData) {
            obj.coinStatus = this.itemData.coinStatus == '启动' ? 1 : 0
            obj.version = this.state.version
            obj.id = this.itemData.id
            coininfoUpload(obj).then(res => {
                message.success('更新成功')
                history.go(-1)
            }).catch(e => {
                message.warning(e.data.message)
            })
        } else {
            obj.coinStatus = 1
            coininfoSave(obj).then(res => {
                //console.log(res)
                message.success('添加成功')
                history.go(-1)
            }).catch(e => {
                if (e) {
                    message.warning(e.data.message)
                }
            })

        }
        //console.log(this.state)

    }


    uploadImg = (file) => {
        //console.log(file)
        let fordata = new FormData()
        fordata.append('type', 'coinIcon');
        fordata.append('file ', file.file);
        upLoad(fordata, (e) => {
            let count = ( (e.loaded / e.total) * 100).toFixed(2)

            if (count == 100) {
                percent:0
            } else {
                this.setState({
                    percent: count
                })
            }
        }).then(res => {
            file.onSuccess()
            this.setState({
                image: res.data.data,
                percent: 0
            })
        }).catch(e => {
            if (e) {
                file.onError()
                message.error('图片上传失败~')
                this.setState({
                    percent: 0
                })
            }
        })
    }

    render() {
        return (
            <div className='center-user-list'>
                <div style={{display: 'flex', flex: 1, flexDirection: 'column'}}>
                    <Breadcrumb data={window.location.pathname}/>
                    {this.renderForm()}
                </div>
            </div>

        )
    }
}