export default {
	getUrlSearch (url) { // aim to url get params with function
	  let theRequest = {};
	  let str = url.substr( url.indexOf('?') + 1 ); // 获取参数开始位置

	  if (str.indexOf('&') !== -1) {
	  	str = str.split('&');
	  	str.forEach(item => {
	  	  item = item.split('=');
	  	  theRequest[item[0]] = item[1];
	  	})

	  	return theRequest;
	  } else {
	  	let _strs = str.split('=');
	  	theRequest[_strs[0]] = _strs[1];
	  	
	  	return theRequest;
	  }
	},
	getUrlParams (url) { // not use
	  let _n = url.indexOf('?');
	  let str = url.substr(_n + 1);
	},
	getUrlId (id) {
	  let _n = id.indexOf('?');
	  let str = id.substr(0, _n);
	  return str;
	}
}