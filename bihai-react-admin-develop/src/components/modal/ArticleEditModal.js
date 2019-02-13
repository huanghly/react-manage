import React, {Component} from 'react';
import {Modal, Radio, Select, Button, Table, Input, Col} from 'antd';
import E from 'wangeditor'

const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class ArticleEditModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            itemData: null,
            editorContent: '',
            title: '',
            showClient: 3,
        };
    };

    componentWillReceiveProps(props) {
    }

    componentWillMount() {
        this.state.itemData = this.props.itemData || {}
    }

    componentDidMount() {
        if (this.refs.editorElem) {
            this.initEdit()
        }
    }

    editor = null

    initEdit = () => {
        const elem = this.refs.editorElem
        this.editor = new E(elem)
        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = html => {
            this.state.editorContent = html;
        }
        this.editor.create()
        this.editor.txt.html(this.state.itemData ? this.state.itemData.content : "")
    }
    saveWord = () => {
        let temObj = {
            content: this.state.editorContent,
            title: this.state.title,
            showClient: this.state.showClient,
        }
        if (this.state.itemData) {
            temObj.id = this.state.itemData.id
            this.props.coArticleUpdata && this.props.coArticleUpdata(temObj)
        } else {
            this.props.saveWord && this.props.saveWord(temObj)
        }
    }
    onChangeRadioGroup = (e) => {
        this.setState({
            showClient: e.target.value
        })
    }

    render() {
        return (
            <div className='edit-view'>
                <div className='edit-view-center'>
                    <div className='edit-row'>
                        <div style={{width: '100px'}}>文章标题:</div>
                        <Input style={{width: '300px'}} value={this.state.title}
                               onChange={(e) => this.setState({title: e.target.value})}/>
                    </div>

                    <div className='edit-row'>
                        <div style={{width: '100px'}}>
                            显示客户端:
                        </div>
                        <RadioGroup value={
                            parseInt(this.state.showClient)
                        } onChange={this.onChangeRadioGroup}>
                            <Radio value={1}>手机端</Radio>
                            <Radio value={2}>PC端</Radio>
                            <Radio value={3}>所有端</Radio>
                        </RadioGroup>
                    </div>
                    <div className='edit-row'>
                        <div style={{width: '100px'}}>语言:</div>
                        <RadioGroup onChange={(e) => this.setState({language: e})} value={this.state.language}>
                            <Radio value={'zh'}>中文</Radio>
                            <Radio value={'en'}>英文</Radio>
                        </RadioGroup>
                    </div>
                    <div className='edit-row'>
                        <div style={{width: '100px'}}>状态:</div>
                        <RadioGroup onChange={(e) => this.setState({language: e})} value={this.state.language}>
                            <Radio value={1}>停用</Radio>
                            <Radio value={0}>启用</Radio>
                        </RadioGroup>
                    </div>
                    <div className='edit-row'>
                        <div style={{width: '100px'}}>关键字:</div>
                        <Input style={{width: '300px'}} value={this.state.title}
                               onChange={(e) => this.setState({title: e.target.value})}/>
                    </div>

                    <div className='edit-row'>
                        <div style={{width: '100px'}}>类型:</div>
                        <Select
                            placeholder="文章类型"
                        >
                            <Option key={1232} value={null}>全部</Option>
                            {
                                this.props.type && this.props.type.map((item, index) => {
                                    return <Option key={index} value={item.typeName}>{item.typeName}</Option>
                                })
                            }
                        </Select>
                    </div>
                </div>
                <div ref="editorElem"></div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Button onClick={this.saveWord}
                            style={{width: '100px'}}>{this.state.itemData ? '更新' : '保存'}</Button>
                    <Button onClick={() => this.props.delWord && this.props.delWord(this.state.itemData.id)}
                            style={{width: '100px'}}>删除</Button>
                </div>

                {this.state.hiddenEdit &&
                <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>选择你要操作的文件，或者选择新建文章</div>}
            </div>
        )
    }
}
