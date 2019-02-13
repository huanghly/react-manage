/* eslint-disable no-undef */
import React, {Component} from 'react';
import Validator from 'pvalidator';

var content = [{viewType: 'input', name: '姓名', rulesType: 'phone', initial: '', ErrorMsg: '姓名非法', required: false}]

export default class CustomFormView extends Component {


    componentWillMount() {
    }

    renderInputItem() {
        return (
            <div></div>
        )
    }

    renderMenuButon() {
        return (
            <div></div>
        )
    }

    renderDataView() {
        return (
            <div></div>
        )
    }

    handleSubmit(event) {
        //   event.preventDefault();
    }

    renderItem(arrItem) {
        return (
            <div>
                {
                    arrItem.map((item, index) => {
                            <div style={{
                                display: 'flex',
                                flexDirection: 'row',
                                flex: 1,
                                marginLeft: '10px',
                                marginRight: '10px',
                                backgroundColor: 'blue'
                            }}>
                                {index}
                            </div>

                        }
                    )
                }
            </div>
        )

    }

    getChildren = () => {
        let len = (content.length / 3);
        if (content.length < 3) {
            len = 1
        }
        len = Math.floor(len) === len ? len : len + 1
        let arrItem = []
        for (var i = 0; i < len; i++) {
            if (i == 0) {
                arrItem[i] = [0, 1, 2, 3]
            } else {
                arrItem[i] = [3, 4, 5]
            }
        }
        return (
            <div style={{display: 'flex', flex: 8, flexDirection: 'column'}}>
                {arrItem.map((item, index) => {
                    return (
                        <div style={{height: '50px', margin: '10px', display: 'flex', flexDirection: 'row'}}>
                            {this.renderItem(arrItem)}
                        </div>
                    )
                })}
            </div>
        )


    }

    render() {
        return (
            <form onSubmit={this.handleSubmit} style={{display: 'flex', flexDirection: 'row'}}>
                {this.getChildren()}
                <input style={{flex: 2}} type="submit" value="Submit"/>
            </form>
        );
    }
}

