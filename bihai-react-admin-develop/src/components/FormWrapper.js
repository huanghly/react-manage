import React, { Component } from 'react';
import PropTypes from 'prop-types';

let flg = false;

export default class FormWrapper extends Component {
  static defaultProps = {
  	executeValidator: () => {},
  	executeHandle: () => {},
  	status: false,
  }

  static contextTypes = {
    showMessageModalBox: PropTypes.func.isRequired,
  };

  componentDidMount() {
  	console.log(this.props.executeValidator);
  }

  componentWillReceiveProps(nextProps) {
    console.log(nextProps.executeStatus)
    if (nextProps.executeStatus) {
      this._executeValidator();
    }
  }

  _executeValidator () {
    let {executeValidator, executeHandle} = this.props;
    executeValidator.validate().then(res => {
      executeHandle(true);
    }).catch(err => {
      console.log(err);
      err.length && this.context.showMessageModalBox(err.join(','))
      executeHandle(false);
    })
  }

  render() {
  	return (
  	  <div>
  	  	{this.props.children}
  	  </div>
  	)
  }
}