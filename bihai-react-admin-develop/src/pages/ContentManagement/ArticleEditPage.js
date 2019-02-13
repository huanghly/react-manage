import React, {Component} from 'react';
import {Modal, Radio, Select, Button, message, Input, Col} from 'antd';
import E from 'wangeditor'
import {articleSave, articleUpdate} from '../../requests/http-req.js'
import history from '../../history.js'
const RadioGroup = Radio.Group;
const Option = Select.Option;

export default class ArticleEditPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: '',
            title: '',
            showClient: 3,
            keyWords: null,
            language: 'zh',
            status: 0,
            type: null
        };
    };

    saveArticle = () => {
        const {content, title, showClient, keyWords, language, status, type} = this.state
        //console.log(this.state)

        if (content == '' || title == '' || keyWords == '' || type == '') {
            message.warning('空')
            return
        }
        let temObj = {
            articleResource: 'articleResource',
            content: content,
            keyWords: keyWords,
            language: language,
            showClient: showClient,
            status: status,
            title: title,
            type: type
        }

        if (this.itemData) {
            temObj.id = this.itemData.id
            this.coArticleUpdata(JSON.stringify(temObj))
        } else {
            this.articleSave(JSON.stringify(temObj))
        }
    }
    type = []
    coArticleUpdata = (data) => {
        articleUpdate(data).then(req => {
            //console.log(req)
            message.success('更新ok')
        })
    }

    articleSave = (data) => {
        articleSave(data).then(req => {
            //console.log(req)
            message.success('新建ok')
        })
    }

    componentWillReceiveProps(props) {
    }

    componentWillMount() {
        // let {itemData, type} = this.props.location.data
        //console.log(this.props.location.data)
        this.itemData = this.props.location && this.props.location.data ? this.props.location.data.itemData : null
        if (this.itemData) {
            this.state.content = this.itemData.content
            this.state.title = this.itemData.title
            this.state.showClient = this.itemData.showClient
            this.state.keyWords = this.itemData.keyWords
            this.state.language = this.itemData.language
            this.state.status = this.itemData.status
            this.state.type = this.itemData.type

        }
        this.type = this.props.location && this.props.location.data ? this.props.location.data.type : null
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
        this.editor.customConfig.zIndex = 100

        // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
        this.editor.customConfig.onchange = html => {
            this.state.content = html;
        }
        this.editor.create()
        this.editor.txt.html(this.itemData ? this.itemData.content : "")
    }

    onChangeRadioGroup = (e) => {
        this.setState({
            showClient: e.target.value
        })
    }

    render() {
        return (
            <div className='center-user-list'>
                <div className='edit-view-center'>
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                        <div className='edit-row' style={{width: '600px'}}>
                            <div style={{width: '100px'}}>文章标题:</div>
                            <Input style={{width: '300px'}} value={this.state.title}
                                   onChange={(e) => this.setState({title: e.target.value})}/>
                        </div>
                        <div className='edit-row' style={{marginLeft: '35px'}}>
                            <div style={{width: '100px'}}>关键字:</div>
                            <Input style={{width: '300px'}} value={this.state.keyWords}
                                   onChange={(e) => this.setState({keyWords: e.target.value})}/>
                        </div>

                    </div>
                    <div style={{display: 'flex', flexDirection: 'row', width: '100%',margin: '15px 0 0'}}>
                        <div className='edit-row' style={{width: '600px'}}>
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
                        <div className='edit-row' style={{marginLeft: '35px'}}>
                            <div style={{width: '100px'}}>语言:</div>
                            <RadioGroup onChange={(e) => this.setState({language: e.target.value})}
                                        value={this.state.language}>
                                <Radio value={'zh'}>中文</Radio>
                                <Radio value={'en'}>英文</Radio>
                            </RadioGroup>
                        </div>
                    </div>
                    <div style={{display: 'flex', flexDirection: 'row',margin: '15px 0 0'}}>
                        <div className='edit-row' style={{width: '600px'}}>
                            <div style={{width: '100px'}}>状态:</div>
                            <RadioGroup onChange={(e) =>
                                this.setState({status: e.target.value}, () => {
                                    //console.log(this.state.status)

                                })}
                                        value={parseInt(this.state.status)}>
                                <Radio value={1}>停用</Radio>
                                <Radio value={0}>启用</Radio>
                            </RadioGroup>
                        </div>

                        <div className='edit-row' style={{marginLeft: '35px'}}>
                            <div style={{width: '100px'}}>类型:</div>
                            <Select
                                onChange={(e) => {
                                    //console.log(e)
                                    this.state.type = e
                                }}
                                defaultValue={this.state.type}
                                style={{width: '300px'}}
                                placeholder="文章类型"
                            >
                                {
                                    this.type && this.type.map((item, index) => {
                                        return <Option key={index} value={item.typeName}>{item.typeName}</Option>
                                    })
                                }
                            </Select>
                        </div>
                    </div>
                </div>
                <div ref="editorElem"></div>
                <div style={{display: 'flex', flexDirection: 'row'}}>
                    <Button onClick={this.saveArticle}
                            style={{width: '100px'}}>{this.itemData ? '更新' : '保存'}</Button>
                    <Button onClick={() => {
                        history.go(-1)
                    }}
                            style={{width: '100px'}}>返回</Button>

                </div>

                {this.state.hiddenEdit &&
                <div style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>选择你要操作的文件，或者选择新建文章</div>}
            </div>
        )
    }
}
