import FetchEm from './FetchEm';
import appConfig from '../config/appConfig';

const tradeFetch = new FetchEm({
  successCode: 0,
  addTimestamp: false
});

tradeFetch.configSetRootAddress(appConfig.tradeApiAddress);
tradeFetch.configSetResponseInterceptor(res => {
  res.message = res.data && res.data.errors ? res.data.errors : res.message;
  return res;
});

export default tradeFetch;
