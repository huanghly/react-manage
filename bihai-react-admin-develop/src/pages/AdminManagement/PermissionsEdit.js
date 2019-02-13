import {Form, Row, message, Input, Button, Radio, Select, Upload, Checkbox, Icon, InputNumber, Col} from 'antd';
import React, {Component} from 'react';
import Breadcrumb from '../../components/Breadcrumb.js'
import {roleResourcesAll, resourcesById, addResources} from '../../requests/http-req.js'
import history from '../../history'
import axios from 'axios';
import appStore from "../../appStore";
import './PermissionsEdit/PermissionsEdit.css'

const FormItem = Form.Item;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


export default class PermissionsEdit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            permissionData: [],
        }
    }

    selsctData = [22, 25, 23]
    itemData = null

    componentWillMount() {
        this.itemData = this.props.location.state && this.props.location.state.data || null
        //console.log(this.itemData)
    }

    componentDidMount() {
        this.getermissionDataP()
        resourcesById({roleId: this.itemData.id}).then(res => {

            this.selsctData = []
            if (res.status == 200) {
                res.data.data.forEach(item => {
                    if (item.resourceId) {
                        this.selsctData.push(item.resourceId)
                    }
                })
            }
            //console.log('默认选中：', this.selsctData)
            this.setCheckedByData()
        }).catch(e => {
            if (e) {
                message.warning('用户信息获取失败')
            }
        })
    }

    getermissionDataP = () => {
        roleResourcesAll().then(res => {
            //console.log(res)
            if (res.status == 200 && res.data.data) {
                this.setCheckedByData(res.data.data)
            }
        })
    }

    setCheckedByData = (data = this.state.permissionData) => {
        //console.log(data)
        data.forEach(item => {
            let total = 0 //全选效果
            item.children && item.children.forEach(item => {
                if (this.selsctData.indexOf(item.id) > -1) {
                    item.checked = true
                    total++
                } else {
                    item.checked = false
                }
            })
            if (item.children && total == item.children.length) {
                item.checked = true
            } else {
                item.checked = false
            }
        })
        this.setState({
            permissionData: data
        })
    }

    renderPermissionsTable = () => {
        return (
            <div>
                {this.state.permissionData.map(item => {
                    return this.renderTableRow(item)
                })}
            </div>
        )
    }

    parentChaeckBox = (id) => {
        //选定父
        let permissionData = this.state.permissionData
        permissionData.forEach(items => {
            if (items.id == id) {
                items.checked = !items.checked //父修改该状态
                items.children && items.children.forEach(item => {
                    item.checked = items.checked
                    this.changeSelsctDataForAll(item.id, item.checked)
                })
            }
        })
        this.setState({permissionData: permissionData})
    }
    renderTableRow = (item) => {
        return (
            <div key={item.id}>
                <div className='pe-table-title'>
                    <Checkbox checked={item.checked} onChange={() => this.parentChaeckBox(item.id)}/>
                    <div>{item.describe}</div>
                </div>
                {this.renderTableItem(item)}
            </div>
        )
    }
    onChange = (id, parentId) => {
        let permissionData = this.state.permissionData
        permissionData.forEach(items => {
            if (items.id == parentId) {
                let sun = 0;
                items.children.forEach(item => {
                    if (item.id == id) {
                        item.checked = !item.checked
                    }
                    item.checked ? sun++ : sun--
                })
                //console.log(items.children.length)
                //console.log(sun)
                if (sun == items.children.length) {
                    items.checked = true
                } else {
                    items.checked = false
                }
            }
        })
        this.changeSelsctData(id)
        this.setState({
            permissionData: permissionData,
        })
    }
    //选中的数据
    changeSelsctData = (id) => {
        let tem = this.selsctData.indexOf(id)
        if (tem == -1) {
            this.selsctData.push(id)
        } else {
            this.selsctData.splice(tem, 1)
        }
    }
    changeSelsctDataForAll = (id, state) => {
        let tem = this.selsctData.indexOf(id)
        if (state) { //添加
            if (tem == -1) {
                this.selsctData.push(id)
            }
        } else { //删除
            if (tem != -1) {
                this.selsctData.splice(tem, 1)
            }
        }
    }


    checkedState = (id) => {
        let bol = false;
        //console.log(id)
        this.selsctData.forEach(item => {
            if (item == id) {
                bol = true
            }
        })
        return bol
    }
    renderTableItem = (items) => {
        return (
            <Row className='pe-table-item'>
                {items.children && items.children.map(item => {
                    return (
                        <Col span={6}>
                            <Checkbox onChange={() => this.onChange(item.id, items.id)}
                                      checked={item.checked}
                            >
                                {item.describe}
                            </Checkbox>
                        </Col>
                    )
                })}
            </Row>
        )
    }
    savePermissions = () => {
        //console.log(this.selsctData)
        let str = ''
        this.selsctData.forEach((item, index) => {
            if (index != this.selsctData.length - 1) {
                str = str + item + ','
            } else {
                str = str + item
            }
        })
        addResources({roleId: this.itemData.id, resourceId: str}).then(res => {
            console.log(res)
            message.success('成功')
            history.go(-1)
        })
    }

    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {this.renderPermissionsTable()}
                <div style={{width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                    <Button onClick={this.savePermissions}>保存</Button>
                    <Button style={{marginLeft: '15px'}} onClick={() => history.go(-1)}>返回</Button>
                </div>
            </div>

        )
    }
}