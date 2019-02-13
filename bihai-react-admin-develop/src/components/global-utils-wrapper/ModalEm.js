import React, { PureComponent } from 'react';
import { Modal, Button } from 'antd';

export default class ModalEm extends PureComponent {
  success (name) {
  	console.log('打印', name)
  	const modal = Modal.success({
  	  title: `This is a ${name} message`,
  	  content: 'This modal will be destroyed after 2 second',
  	});
  	setTimeout(() => modal.destroy(), 2000);
  }

  render() {
  	return (
  	  <div></div>
  	)
  }
}