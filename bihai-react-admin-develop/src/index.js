import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './rem.js';
import 'babel-polyfill';
import {IntlProvider} from 'react-intl';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import zh_CN from './resources/i18n/zh_CN';
import en_US from './resources/i18n/en_US';

ReactDOM.render(
        <App/>
    , document.getElementById('root'));
registerServiceWorker();
