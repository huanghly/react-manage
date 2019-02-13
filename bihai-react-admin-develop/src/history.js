import createBrowserHistory from 'history/createBrowserHistory';
import createHashHistory from 'history/createHashHistory';
let isCordovaApp = document.URL.indexOf('http://') === -1 && document.URL.indexOf('https://') === -1;

let history = isCordovaApp ? createHashHistory({
  initialEntries: [ '/' ],
  initialIndex: 0,
  keyLength: 6,
  getUserConfirmation: null
}) : createBrowserHistory();

export default history;
