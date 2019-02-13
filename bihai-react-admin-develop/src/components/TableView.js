import React, {Component} from 'react';
import 'antd/dist/antd.css';
import {Table, LocaleProvider} from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';

import PropTypes from 'prop-types'
import ReactHTMLTableToExcel from 'react-html-table-to-excel';
import ReactDOM from 'react-dom'

const screenWidth = window.screen.width
const tableWidth = screenWidth - 200

export default class TableView extends Component {
    static propTypes = {
        columns: PropTypes.array.isRequired,
        data: PropTypes.array.isRequired,
        pageNo: PropTypes.number,
        pageSize: PropTypes.number,
        total: PropTypes.number
    };
    static defaultProps = {
        pageNo: 0,
        pageSize: 10
    };

    componentWillReceiveProps(Props) {
        //console.log(Props)
        this.setState({
            data: Props.data,
            total: Props.total,
            selectedRowKeys: [],
            pageNo: Props.pageNo
        })
    }

    state = {
        selectedRowKeys: [],
        columns: [],
        data: [],
        xSlide: 1300,
        pageNo: 0,
        pageSize: 10,
        total: 0,
    };
    selectRow = (record) => {
        //console.log(record)
    }
    onSelectedRowKeysChange = (selectedRowKeys) => {
        console.log(selectedRowKeys)
        this.setState({selectedRowKeys}, () => {
            this.props.onSelectedRowKeys && this.props.onSelectedRowKeys(this.state.selectedRowKeys)
        });
    }

    componentWillMount() {
        this.state.columns = this.props.columns
        this.state.total = this.props.total
        this.state.pageSize = this.props.pageSize
        this.state.xSlide = this.props.columns.length * 100 > tableWidth ? this.props.columns.length * 100 : tableWidth
        if (this.props.minWidth) {
            this.state.xSlide = this.props.minWidth
        }
        //console.log(this.state.xSlide)
        this.state.data = this.props.data
    }

    componentDidMount() {
        const tableCon = ReactDOM.findDOMNode(this.refs['table'])
        const table = tableCon.querySelector('table')
        table.setAttribute('id', 'table-to-xls')
    }

    onChangePagintion = (e) => {
        this.props.onChangePagintion(e)

        // this.state.pageNo = 0
    }

    render() {
        const {selectedRowKeys, total, pageSize} = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectedRowKeysChange,
        };
        return (
            <div>
                {this.props.showExcel &&
                <ReactHTMLTableToExcel
                    id="test-table-xls-button"
                    className="download-table-xls-button"
                    table="table-to-xls"
                    filename="table"
                    sheet="tablexls"
                    buttonText="导出数据"/>
                }
                <LocaleProvider locale={zhCN}>
                    <Table
                        ref='table'
                        rowKey={record => record.registered}
                        size='middle'
                        style={{width: tableWidth, margin: '0 auto'}}
                        scroll={{x: this.state.xSlide}}
                        pagination={{
                            pageSize: this.state.pageSize,
                            total: this.state.total,
                            onChange: this.onChangePagintion,
                            current: this.props.pageNo
                        }}
                        rowSelection={this.props.hiddenSelection ? null : rowSelection}
                        columns={this.state.columns}
                        dataSource={this.state.data}
                        onRow={(record) => ({
                            onClick: () => {
                                this.selectRow(record);
                            },
                        })}
                    />
                </LocaleProvider>
            </div>

        );
    }
}