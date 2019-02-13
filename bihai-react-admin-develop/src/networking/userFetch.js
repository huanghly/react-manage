import FetchEm from './FetchEm';
import appConfig from '../config/appConfig';

const userFetch = new FetchEm({
  successCode: 0,
  addTimestamp: false
});

userFetch.configSetRootAddress(appConfig.userApiAddress);
userFetch.configSetResponseInterceptor(res => {
  res.message = res.data && res.data.errors ? res.data.errors : res.message;
  return res;
});
userFetch.configSetRequestInterceptor(req => {
  req.params.credentials = "include";
  return req;
});

export default userFetch;
