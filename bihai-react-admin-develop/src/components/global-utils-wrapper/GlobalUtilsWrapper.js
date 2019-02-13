import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {Router, Route, Switch, Redirect} from 'react-router-dom';
import ModalEm from './ModalEm';
import Login from '../../pages/Login.js'
import {injectIntl} from 'react-intl';

 class GlobalUtilsWrapper extends PureComponent {

    getChildContext() {
        return {
            showMessageModalBox: this.showMessageModalBox.bind(this)
        }
    }

    showMessageModalBox(name) {
        this.ModalEm && this.ModalEm.success(name);
    }


// 重定向：  <Route path="/home" render={()=><Redirect to="/other"/>}/>

    render() {
        let {history, routes, InitPage} = this.props;
        return (
            <Router key={'Router'} history={history}>
                <Switch style={{display: 'flex', flexDirection: 'row', width: '100%'}}>
                    <Route exact path='/' key={'index'} component={Login}/>
                    {
                        routes.map((item, index) => {
                            //console.log(item)
                            return <Route key={item.path+index} path={item.path} component={item.component}/>
                        })
                    }
                </Switch>
            </Router>
        )
    }
}
export default injectIntl(GlobalUtilsWrapper)

GlobalUtilsWrapper.childContextTypes = {
    showMessageModalBox: PropTypes.func.isRequired,
}