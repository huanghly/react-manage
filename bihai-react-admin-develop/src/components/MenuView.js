/**
 * Created by Arbella on 2018/3/13.
 */
import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Layout, Menu, Breadcrumb, Icon, Image} from 'antd';
// import menuDatas from '../resources/MenuData.js'
import icon from '../resources/imgs/coin_icon.png'


const pathSubmen = ['user', 'CoinManagement', 'PoundageManagement', 'MoneyManagement', 'OrderManagement', 'DigManagement', 'ContentManagement', 'AdminManagement', 'LogMangement', 'SystemManagement']

const SubMenu = Menu.SubMenu;
export default class MenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: false,
            openKeys: [],
            showMenuData: []
        }
    }

    componentWillMount() {
        this.setState({
            showMenuData: JSON.parse(window.localStorage.getItem('user')).menuData || [],
        }, () => {
            this.setCurrent()
        })
    }

    setCurrent = () => {
        let path = window.location.pathname
        pathSubmen.forEach((item, index) => {
            if (path.indexOf(item) != -1) {
                this.setState({
                    openKeys: [this.rootSubmenuKeys[index]]
                })
            }
        })
        //console.log(this.state.showMenuData)
    }
    len = 66;

    rootSubmenuKeys = ['用户管理', '币种管理', '手续费管理', '资金管理', '订单管理', '交易挖矿', '内容管理', '管理员管理', '日志管理', '系统管理'];
    onOpenChange = (openKeys) => {
        const latestOpenKey = openKeys.find(key => this.state.openKeys.indexOf(key) === -1);
        if (this.rootSubmenuKeys.indexOf(latestOpenKey) === -1) {
            this.setState({openKeys});
        } else {
            this.setState({
                openKeys: latestOpenKey ? [latestOpenKey] : [],
            });
        }
    }
    onItemClick = (data) => {
        //onItemClick
        this.props.onItemClick(data)
    }


    bandleChildren(data) {
        return data.map((item, index) => {
            return <Menu.Item key={`${item.route || index + '-key-chile'}`}>{item.describe}</Menu.Item>
        })
    }
    handleSubMenu() {
        const {showMenuData} = this.state;
        return showMenuData.map((item, index) => {
            return <SubMenu key={`${index}-key-0`}
                            title={<div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                                <span>{item.describe}</span></div>}>
                {
                    this.bandleChildren(item.children)
                }
            </SubMenu>
        })
    }

    render() {
        return (
            <Menu
                mode="inline"
                openKeys={this.state.openKeys}
                onOpenChange={this.onOpenChange}
                onClick={this.onItemClick}
                theme='dark'
            >
                {
                    this.handleSubMenu()
                }
            </Menu>
        )
    }
}

