/**
 * Created by liu 2018/6/5
 **/

import React, {Component} from 'react';
import {storeAware} from 'react-hymn';
import {Select, Button, message, Input} from 'antd';
import TableView from '../../components/TableView'
import Breadcrumb from '../../components/Breadcrumb.js'
import {tradeOrderPage, orderAppealOperation} from '../../requests/http-req.js'
import history from "../../history";
import defaultImg from "../../resources/1.png";
import './OrderAppealPagesInfo/OrderAppealPagesInfo.css'

const {TextArea} = Input;

const Option = Select.Option;

export default class OrderAppealPagesInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            description: '',
            selectState: null,
            itemData: {}
        }
    }

    componentWillMount() {
        if (this.props.location.state && this.props.location.state.data) {
            this.setState({
                itemData: this.props.location.state.data,
            }, () => {
                //console.log()
            })
        }
    }

    componentDidMount() {

    }

    handleSelectChange = (e) => {
        this.setState({
            selectState: e
        })
    }
    postData = () => {
        if (this.state.selectState == null) {
            message.warning('选择你的操作')
            return
        }
        orderAppealOperation({
            tradeId: this.state.itemData.tradeId,
            id: this.state.itemData.id,
            result: this.state.selectState,
            description: this.state.description
        }).then(req => {
            //console.log(req)
            message.success("ok")
            history.go(-1)
        }).catch(e => {
            if (e) {
                message.error(e.data.message)
            }
        })
    }
    renderImg = () => {
        let strs = [];
        let itemData = this.state.itemData
        if (itemData.picPath.length == 0) {
            return <img
                src={defaultImg}
                style={{
                    padding: '15px',
                    height: '100px',
                    width: '100px',
                }}/>
        } else {
            strs = this.state.itemData.picPath.split(",")
            return (
                <div className='item-left'>
                    {strs.map(item => {
                        return <img
                            onError={() => {
                                itemData.picPath = []
                                this.setState({itemData: itemData})
                            }
                            }
                            src={item ? item : defaultImg}
                            style={{
                                padding: '15px',
                                height: '100px',
                                width: '100px',
                            }}/>
                    })}
                </div>
            )
        }


        // let strs = [{}, {}, {}];
        // strs = this.state.itemData.picPath.split(",")
        // if (strs.length = 0) {
        //     return <div>没有申诉图</div>
        // } else {
        //     return strs.map(item => {
        //         return (
        //             <img
        //                 src={item}
        //                 style={{
        //                     backgroundColor: '#000',
        //                     margin: '15px',
        //                     height: '100px',
        //                     width: '100px',
        //                 }}/>
        //         )
        //
        //     })
        // }
    }
    renderCenter = () => {
        const itemData = this.state.itemData
        return (
            <div className='oapi-center'>
                <div className='oapi-center-item-row'>
                    <div className='item-right'>申诉订单号:</div>
                    <div className='item-left'>{itemData.number}</div>
                </div>

                <div className='oapi-center-item-row'>
                    <div className='item-right'>买家手机:</div>
                    <div className='item-left'>{itemData.buyerPhone}</div>
                </div>
                <div className='oapi-center-item-row'>
                    <div className='item-right'>卖手机:</div>
                    <div className='item-left'>{itemData.sellerPhone}</div>
                </div>
                <div className='oapi-center-item-row'>
                    <div className='item-right'>申诉原因:</div>
                    <div className='item-left'>{itemData.reason}</div>
                </div>

                <div className='oapi-center-item-row'>
                    <div className='item-right'>申诉详情:</div>
                    <div className='item-left'>{itemData.description}</div>
                </div>
                <div className='oapi-center-item-row'>
                    <div className='item-right'>申诉图片:</div>
                    {this.renderImg()}
                </div>

                <div className='oapi-center-item-row'>
                    <div className='item-right'>处理备注:</div>
                    <TextArea className='item-left' style={{width: '300px'}} onChange={(e) => {
                        this.setState({description: e.target.value})
                    }} rows={2}></TextArea>
                </div>

                <div className='oapi-center-item-row'>
                    <div className='item-right'>处理方式:</div>
                    <Select
                        className='item-left'
                        style={{width: '300px'}}
                        value={this.state.selectState}
                        placeholder="选择操作"
                        onChange={this.handleSelectChange}
                    >
                        <Option value={0}>取消订单 </Option>
                        <Option value={1}>放币</Option>
                    </Select></div>
                <div className='oapi-center-item-row' style={{marginLeft: '215px'}}>
                    <Button onClick={this.postData}>确定</Button>
                    <Button className='item-left'>返回</Button>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div className='center-user-list'>
                <Breadcrumb data={window.location.pathname}/>
                {this.renderCenter()}
            </div>
        )
    }
}
