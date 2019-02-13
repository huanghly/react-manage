import {List, Modal, Button, Collapse, message} from 'antd';
import React, {Component} from 'react';
import EditWordModal from '../../components/modal/EditWordModal'
import getChinaText from '../../utils/MumberUtil.js'
import {
    coArticleAdd,
    coArticleCategoryetAll,
    coArticleUpdata,
    coArticleRemove,
    coArticleCategoryetRemove
} from '../../requests/http-req.js'

const Panel = Collapse.Panel;

export default class HelpCenter extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menuData: [],
            collapse: ['1'],
            itemData: null
        }
    }

    editor = null

    componentDidMount() {
        this.getMenuData()
    }

    getMenuData = (data) => {
        coArticleCategoryetAll().then(req => {
            this.setState({
                menuData: req.data.data && req.data.data || []
            })
            // 更新选中
            if (data) {
                this.setState({
                    itemData: data
                })
            }
        })
    }

    // renderList = (menu, index) => {
    //     return (
    //         <List
    //             split={false}
    //             key={menu.catName}
    //             header={menu.coArticleDOList ? this.renderListHeader(menu, index) : null}
    //             dataSource={menu.coArticleDOList ? menu.coArticleDOList : menu.nodeList}
    //             renderItem={(item, index) => {
    //                 return item.title ? this.renderWordItem(item, index + 1) : this.renderList(item, index)
    //             }}
    //         />
    //     )
    // }
    renderList = (menu, index) => {
        return (
            <div>
                {menu.nodeList.map((item, index) => {
                    return (
                        <div>
                            <div style={{display: 'flex', marginTop: '5px', flexDirection: 'row',}}>
                                <div>{getChinaText(index + 1)}.{item.catName}</div>
                                <Button onClick={() => this.delMenu(item.id)}>删除目录</Button>
                                <Button onClick={() => this.createWord(item)}>新建文章</Button>
                            </div>
                            {item.coArticleDOList.map((itemData, indexs) => {
                                return (
                                    <div key={itemData.title} style={{paddingLeft: '25px'}} onClick={() => {
                                        this.setState({itemData: itemData})
                                    }
                                    }>
                                        {indexs + 1}.{itemData.title}
                                    </div>
                                    // <div>{indexs + 1}.{itemData.title}</div>
                                )
                            })}
                        </div>
                    )
                })}
            </div>
        )
    }

    callback = (e) => {
        //console.log(e)
        this.setState({
            collapse: e
        })
    }
    renderCollapse = (item, index) => {
        return (
            <Collapse defaultActiveKey={['0']} onChange={this.callback}>
                <Panel header={item.catName} key={index}>
                    {this.renderList(item, index)}
                </Panel>
            </Collapse>
        )

    }

    renderWordItem = (itemData, index) => {
        return (
            <div key={itemData.title} style={{paddingLeft: '40px'}} onClick={() => {
                this.setState({itemData: itemData})
            }
            }>
                {index}.{itemData.title}
            </div>
        )
    }


    addMen = () => {
//     {
//     "catName": "测试目录111",
//     "enabled": 1,
//     "parentId": 5,
//     "showClient": 1,
//     "sortOrder": 10,
//     "depth":1,
//     "catCode":1001,
//     "language":"CN"
// }
    }
    delMenu = (id) => {
        let title = '确认你的操作' + JSON.stringify(id)
        const that = this
        Modal.confirm({
            zIndex: 20002,
            title: title,
            content: '确认删除目录吗',
            okText: '确认',
            cancelText: '取消',
            onOk() {
                coArticleCategoryetRemove(id).then(req => {
                    if (req.status == 200) {
                        message.success('成功删除')
                        that.getMenuData()
                        //console.log(req)
                    }

                })
            },
            onCancel() {
            },
        });
    }
    delWord = (id) => {
        coArticleRemove(id).then(req => {
            if (req.status == 200) {
                message.success('成功删除文章')
                this.getMenuData()
                this.setState({
                    itemData: null
                })
            } else {
                message.warning('删除文章失败')
            }
            //console.log(req)
        })
    }
    coArticleUpdata = (data) => {
        coArticleUpdata(data).then(req => {
            message.success('更新成功')
            //console.log(data)
            //console.log(this.state.menuData)

            this.getMenuData(data)

        })
    }
    categoryId = null

    createWord = (item) => {
        //console.log(item)
        this.setState({itemData: null})
        this.categoryId = item.coArticleDOList[0].categoryId
        //console.log('当前选择' + this.categoryId)
    }
    saveWord = (obj) => {
        obj.categoryId = this.categoryId
        obj.isLink = 1
        //console.log(JSON.stringify(obj))
        coArticleAdd(JSON.stringify(obj)).then(req => {
            //console.log(req)
            message.success('新建文章')
            this.getMenuData()

        })
    }


    renderListHeader = (item, index) => {

        if (item.coArticleDOList) {
            return (
                <div style={{display: 'flex', marginTop: '5px', flexDirection: 'row',}}>
                    <div>{getChinaText(index + 1)}.{item.catName}</div>
                    <Button onClick={this.delMenu}>删除目录</Button>
                    <Button onClick={() => this.createWord(item)}>新建文章</Button>
                </div>
            )
        } else {
            return (
                <div style={{display: 'flex', marginTop: '5px', flexDirection: 'row',}}>
                    <div>{item.catName}</div>
                </div>
            )
        }
    }


    render() {
        return (
            <div className='center-user-list' style={{flexDirection: 'row'}}>
                <div style={{height: window, width: '400px'}}>
                    {
                        this.state.menuData.map((item, index) => {
                            //return (this.renderList(item, index))
                            return (this.renderCollapse(item, index))
                        })
                    }
                </div>
                <EditWordModal itemData={this.state.itemData} saveWord={this.saveWord} categoryId={this.categoryId}
                               coArticleUpdata={this.coArticleUpdata} delWord={this.delWord}/>
            </div>
        )
    }
}
