import 'whatwg-fetch';
import simpleUrl from 'simple-url';
const emptyFunc = d => d;
export const CODE_PARSE_ERROR = 11100;
export const CODE_NETWORK_ERROR = 11111;

export default class Fetch{
  constructor(options){
    options = options || {};
    const { commonHeaders, protocol, host, pathPrefix, networkOn, networkOff, addTimestamp, successCode, credentials } = options;
    this.globalConfig = {
      commonHeaders: commonHeaders || {},
      protocol: protocol || "https",
      host: host || "",
      pathPrefix: pathPrefix || "",
      addTimestamp: addTimestamp !== false
    };
    this.successCode = successCode || 0;
    this.responseInterceptors = [];
    this.requestInterceptors = [];
    this.credentials = credentials === true;
    this._networkOn = networkOn || emptyFunc;
    this._networkOff = networkOff || emptyFunc;
    this._networkStatus = true;
  }
  _processJSONResponse(response){
    this.responseInterceptors.forEach(interceptor => {
      response = interceptor(response);
    });
    return response;
  }
  _processRequest(request){
    this.requestInterceptors.forEach(interceptor => {
      request = interceptor(request);
    });
    return request;
  }
  configSetNetworkOn(cb){
    this._networkOn = cb;
  }
  configSetNetworkOff(cb){
    this._networkOff = cb;
  }
  configSetResponseInterceptor(cb){
    if(typeof cb === 'function'){
      this.responseInterceptors.push(cb);
    }
  }
  configSetRequestInterceptor(cb){
    if(typeof cb === 'function'){
      this.requestInterceptors.push(cb);
    }
  }
  configSetCommonHeader(name, value) {
    this.globalConfig.commonHeaders[name] = value;
  }
  configGetCommonHeader(name) {
    return this.globalConfig.commonHeaders[name];
  }
  configSetHost(host) {
    this.globalConfig.host = host;
  }
  configGetHost(){
    return this.globalConfig.host;
  }
  configSetRootAddress(address) {
    let urlObj = simpleUrl.parse(address);
    this.globalConfig.host = urlObj.host;
    this.globalConfig.protocol = urlObj.protocol;
  }
  configSetPathPrefix(prefix) {
    this.globalConfig.pathPrefix = prefix.slice(-1) === "/" ? prefix.slice(0, -1) : prefix;
  }
  configGetPathPrefix(){
    return this.globalConfig.pathPrefix;
  }
  configSetProtocol(protocol) {
    this.globalConfig.protocol = protocol;
  }

  configGetProtocol(){
    return this.globalConfig.protocol;
  }

  createUrl(path, query, hash) {
    query = query || {};
    return simpleUrl.create({
      protocol: this.globalConfig.protocol,
      host: this.globalConfig.host,
      pathname: this.globalConfig.pathPrefix + path,
      query: this.globalConfig.addTimestamp ? {...query, timestamp: Date.now()} : {...query},
      hash: hash
    });
  }

  postJSON(url, data) {
    return this._receiveJSON(url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/json;charset=UTF-8'
      },
      body: JSON.stringify(data)
    });
  }

  postUrlencoded(url, data){
    data = {...data};
    return this._receiveJSON(url, {
      method: "POST",
      headers: {
        "Content-Type": 'application/x-www-form-urlencoded;charset=UTF-8'
      },
      body: Object.keys(data).map((key) => {
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }).join('&')
    });
  }

  postMultipart(url, formData){
    return this._receiveJSON(url, {
      method: "POST",
      body: formData
    });
  }

  getText(url, config){
    return this._receiveText(url, config);
  }

  get(url, config){
    return this._receiveJSON(url, config);
  }

  async _receiveJSON(url, config){
    let response = await this.__request(url, config);
    if(response){
      try {
        let jsonData = await response.json();
        return this._processJSONResponse(jsonData);
      }catch (e){
        return { code: CODE_PARSE_ERROR, message: "解析错误", data: null };
      }
    }
    return { code: CODE_NETWORK_ERROR, message: "网络错误", data: null };
  }

  async _receiveText(url, config) {
    let response = await this.__request(url, config);
    if(response){
      try {
        let text =  await response.text();
        return { code: this.successCode, data: text };
      }catch (e){
        return { code: CODE_PARSE_ERROR, message: "解析错误", data: null };
      }
    }
    return { code: CODE_NETWORK_ERROR, message: "网络错误", data: null };
  }

  async __request(url, config) {
    config = config || {};
    try {
      let requestParams = {
        ...config,
        headers: {
          ...config.headers,
          ...this.globalConfig.commonHeaders
        }
      };
      let req = this._processRequest({ url: url, params: requestParams }),
        response = await window.fetch(req.url, req.params);
      if(!this._networkStatus){
        this._networkOn();
        this._networkStatus = true;
      }
      return response;
    }catch (e){
      if(this._networkStatus){
        this._networkOff();
        this._networkStatus = false;
      }
      return void 0;
    }
  }
}
