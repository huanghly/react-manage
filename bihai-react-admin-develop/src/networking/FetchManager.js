import tradeFetch from './tradeFetch';
import userFetch from './userFetch';
import history from '../history';
import appStore, { logoutClearPairs } from '../appStore';

export function setToken(token) {
  tradeFetch.configSetCommonHeader('Token', token);
  userFetch.configSetCommonHeader('Token', token);
}

export function clearToken() {
  tradeFetch.configSetCommonHeader('Token', '');
  userFetch.configSetCommonHeader('Token', '');
}

export function listen403() {
  tradeFetch.configSetResponseInterceptor(res => {
    if(res.code === 403){
      Object.keys(logoutClearPairs).forEach(key => {
        appStore.set(key, logoutClearPairs[key]);
      });
      history.push('/quickLogin');
    }
    return res;
  });
  userFetch.configSetResponseInterceptor(res => {
    if(res.code === 403){
      Object.keys(logoutClearPairs).forEach(key => {
        appStore.set(key, logoutClearPairs[key]);
      });
      history.push('/quickLogin');
    }
    return res;
  });
  clearToken();
}
