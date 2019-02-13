import {Form, Progress, Icon, Upload, Input, Button, Radio, Select, message, InputNumber} from 'antd';
import React, {Component} from 'react';
import {upLoad} from '../../requests/http-req.js';

const RadioGroup = Radio.Group;
const FormItem = Form.Item;
const Option = Select.Option;

class InviteEdit extends Component {
    state = {
        description: null,
        linkUrl: null,
        logo: null,
        title: null,
        percent: 0,

    };
    handleSubmit = () => {
        const {description, linkUrl, logo, title} = this.state


        if (linkUrl == null || logo == null || logo == null || title == null) {
            message.warning('信息不完整')
            return
        }
        let tem = {description: description, linkUrl: linkUrl, logo: logo, title: title}

        if (this.itemData) { //更新
            tem.id = this.itemData.id
            tem.createTime = this.itemData.createTime
            this.props.upData(tem)
        } else {
            this.props.onSave(tem)

        }
    }

    componentDidMount() {
//


    }

    componentWillMount() {
        this.itemData = this.props.itemData || null
        if (this.itemData) {

            this.state.description = this.itemData.description,
                this.state.linkUrl = this.itemData.linkUrl,
                this.state.logo = this.itemData.logo,
                this.state.title = this.itemData.title
        }
    }

    uploadImg = (file) => {
        // file.onProgress({percent: 0.8})
        let fordata = new FormData()
        fordata.append('type', 'logo');
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
                logo: res.data.data.relativePath,
                percent: 0
            })
        }).catch(e => {
            if (e) {
                file.onError()
                this.setState({
                    percent: 0
                })
                message.warning('失败，检查网络')
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
                        percent: 0
                    };
                });
            }
        };

        return (
            <Form>
                <FormItem
                    {...formItemLayout}
                    label="Logo"
                >
                    <Upload {...props} fileList={this.state.fileList} style={{width: 300}}>
                        <Button>
                            <Icon title="upload"/> {this.state.logo ? '更改' : '上传'}
                        </Button>
                        {this.state.percent > 0 && this.state.percent < 100 ?
                            <Progress showInfo={false} width={250} status="active"
                                      percent={this.state.percent}/> : null}
                    </Upload>

                </FormItem>

                <FormItem
                    {...formItemLayout}
                    label="描述"
                >

                    <Input value={this.state.description} onChange={(e) => {
                        this.setState({description: e.target.value})
                    }} style={{width: 300}}/>

                </FormItem>
                <FormItem
                    {...formItemLayout}//linkUrl
                    label="链接地址"
                >
                    <Input value={this.state.linkUrl} onChange={(e) => {
                        this.setState({linkUrl: e.target.value})
                    }} style={{width: 300}}/>

                </FormItem>


                <FormItem
                    {...formItemLayout}
                    label="标题"
                >

                    <Input value={this.state.title} onChange={(e) => {
                        this.setState({title: e.target.value})
                    }} style={{width: 300}}/>

                </FormItem>
                <Button style={{width: '100%'}} onClick={this.handleSubmit}>{this.itemData ? '修改' : '保存'}</Button>
            </Form>
        );
    }
}

const NewInviteEdit = Form.create()(InviteEdit);
export default NewInviteEdit;
