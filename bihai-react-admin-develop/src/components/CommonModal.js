import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Modal} from 'antd-mobile';
import history from '../history';

export default class CommonModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            tips: '',
            path: '',
            callback: null
        };
    };

    static defaultProps = {
        needCancel: false,
        needTitle: true,
        leftButtonText: '取消',
        rightButtonText: '确定',
        confirmPath: '', // 点击确认路由地址
    };

    showModal = key => (e) => {
        e && e.preventDefault(); // 修复 Android 上点击穿透
        this.setState({
            [key]: true,
        });
    };

    onClose = key => (path) => {
        this.setState({
            [key]: false,
        });

        path && history.push(path)
        this.state.callback && this.state.callback();
    };

    sendQuickTip(text, path, callback) { // 快速发送短提示
        this.setState({
            modal: true, // pop layer
            tips: text, // tips text
            path: path || '', // click to button turn to path
            callback: callback // callback function
        });
    };

    render() {
        return (
            <div>
                <Modal
                    visible={this.state.modal}
                    transparent
                    maskClosable={false}
                    onClose={this.onClose('modal')}
                    title={this.props.needTitle ? this.props.title || '提示' : ''}
                    footer={[
                        {
                            text: this.props.leftButtonText,
                            style: this.props.needCancel ? this.props.leftButtonStyle : {display: 'none'},
                            onPress: () => {
                                this.onClose('modal')();
                            }
                        },
                        {
                            text: this.props.rightButtonText,
                            style: this.props.rightButtonStyle,
                            onPress: () => {
                                this.props.confirmCallback && this.props.confirmCallback();
                                this.onClose('modal')(this.state.path || this.props.confirmPath);
                            }
                        }
                    ]}
                    wrapProps={{onTouchStart: this.onWrapTouchStart}}
                >
                    {this.state.tips ? this.state.tips : this.props.children}
                </Modal>
            </div>
        )
    }
}