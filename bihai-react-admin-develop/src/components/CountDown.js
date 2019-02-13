import React, {Component} from 'react';
import {Button} from 'antd';

class CountDown extends Component {
    static defaultProps = {
        initialRemaining: 60,
        interval: 1000,
        initialContent: '获取验证码'
    }

    state = {
        content: this.props.initialContent,
        disabled: false
    }

    timer = null

    i = this.props.initialRemaining

    start = () => {
        this.i--
        this.setState({content: this.i + '后重试', disabled: true})
        this.timer = setTimeout(
            () => {
                if (this.i <= 1) {
                    this.reset()
                    return
                }
                this.start()
            },
            this.props.interval
        )
    }

    reset = () => {
        if (this.timer) {
            clearTimeout(this.timer)
        }
        this.timer = null
        this.i = this.props.initialRemaining
        this.setState({content: this.props.initialContent, disabled: false})
    }

    handleClick = () => {
        this.start()
        this.props.onClick && this.props.onClick()
    }

    componentWillUnmount() {
        if (this.timer) {
            clearTimeout(this.timer)
        }
    }
    render() {
        const disabledClass = this.state.disabled ? this.props.disabledClass || '' : ''
        return (
            <Button
                className={`${this.props.className || ''} ${disabledClass}`}
                style={this.props.style}
                onClick={this.handleClick}
                disabled={this.state.disabled}
            >
                {this.state.content}
            </Button>
        )
    }
}

export default CountDown