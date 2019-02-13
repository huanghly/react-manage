import {Form, Icon, Upload, Input, Button, Radio, Select, message, InputNumber, Spin, Progress} from 'antd';
import React, {Component} from 'react';
import {upLoad} from '../../requests/http-req.js';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class BannerEdit extends Component {
    state = {
        picPath: null,
        url: null,
        sortOrder: null,
        enabled: null,
        type: null,
        name: null,
        percent: 0,

    };
    handleSubmit = () => {
        const {picPath, url, sortOrder, enabled, type, name} = this.state

        //if (picPath == null || sortOrder == null || enabled == null || enabled == null || type == null || name == null) {
        //    message.warning('信息不完整')
        //    return
        //}


        let tem = this.state
        if (this.itemData) { //更新
            tem.id = this.itemData.id
            this.props.upData(tem)
        } else {
            if (tem.url != '' && tem.url != null) {
                tem.url = 'http://' + url
            }
            this.props.onSave(tem)
        }
    }

    componentDidMount() {
//


    }

    componentWillMount() {
        this.itemData = this.props.itemData || null
        if (this.itemData) {

            this.state.name = this.itemData.name,
                this.state.url = this.itemData.url,
                this.state.sortOrder = this.itemData.sortOrder,
                this.state.enabled = this.itemData.enabled,
                this.state.picPath = this.itemData.picPath,
                this.state.type = this.itemData.type
        }
    }

    uploadImg = (file) => {
        let fordata = new FormData()
        fordata.append('type', 'banner');
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

        }).then(res => {//absolutePath  relativePath
            file.onSuccess()
            this.setState({
                picPath: res.data.data.relativePath,
                percent: 0
            })
        }).catch(e => {
            if (e) {
                file.onError()
                message.warning('失败，检查网络')
                this.setState({
                    percent: 0

                })
            }
        })
    }


    handleChange = (info) => {

        const isLt1M = info.file.size / 1024 / 1024 < 2;
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

        this.setState({fileList});
    }


    render() {
        const {getFieldDecorator} = this.props.form;
        const formItemLayout = {
            labelCol: {
                sm: {span: 8},//24
            },
        };
        const props = {
            accept: 'image/*',
            customRequest: (e) => {
                this.uploadImg(e)
            },
            beforeUpload: (file) => {
                const isLt1M = file.size / 1024 / 1024 < 2;
                if (!isLt1M) {
                    message.warning('币种图片不能超过2M')
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
                        percent:0
                    };
                });
            }
        };


        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="Upload"
                >
                    <Upload {...props} fileList={this.state.fileList} style={{width: 300}}>
                        <Button>
                            <Icon type="upload"/> {this.state.picPath ? '更改' : '上传'}
                        </Button>
                        {this.state.percent > 0 && this.state.percent < 100 ?
                            <Progress showInfo={false} width={250} status="active"
                                      percent={this.state.percent}/> : null}
                    </Upload>
                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="名称"
                >

                    <Input value={this.state.name} onChange={(e) => {
                        this.setState({name: e.target.value})
                    }} style={{width: 300}}/>

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="跳转地址"
                >
                    <Input addonBefore={this.itemData ? '' : 'http://'} value={this.state.url} onChange={(e) => {
                        this.setState({url: e.target.value})
                    }} style={{width: 300}}/>

                </FormItem>
                <FormItem
                    {...formItemLayout}//sortOrder
                    label="顺序"
                >
                    <InputNumber value={this.state.sortOrder} onChange={(e) => {
                        this.setState({sortOrder: e})
                    }} style={{width: 300}}/>

                </FormItem>


                <FormItem
                    {...formItemLayout}
                    label="状态"
                >

                    <RadioGroup onChange={(e) => {
                        this.setState({enabled: e.target.value})
                    }} value={this.state.enabled}>
                        <Radio value={0}>启用</Radio>
                        <Radio value={1}>停用</Radio>
                    </RadioGroup>

                </FormItem>
                <FormItem
                    {...formItemLayout}
                    label="平台"
                >
                    <RadioGroup onChange={(e) => {
                        this.setState({type: e.target.value})
                    }} value={this.state.type}>
                        <Radio value={1}>APP</Radio>
                        <Radio value={2}>PC</Radio>
                    </RadioGroup>
                </FormItem>
                <Button style={{width: '100%'}} onClick={this.handleSubmit}>{this.itemData ? '修改' : '保存'}</Button>
            </Form>
        );
    }
}

const NewBannerEdit = Form.create()(BannerEdit);
export default NewBannerEdit;
