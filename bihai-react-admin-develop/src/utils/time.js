export default {
  getISOString: function (timestamp) {
    timestamp = getTimestamp(timestamp);
    let date = new Date(timestamp + 8 * 3600 * 1000);
    let dateStr = date.toISOString(),
      dateArr = dateStr.split('T');
    return `${dateArr[0]} ${dateArr[1].split('.')[0]}`;
  },
  getUTCString: function (timestamp) {
    timestamp = getTimestamp(timestamp);
    let date = new Date(timestamp + 8 * 3600 * 1000);
    return date.toUTCString() + '+8';
  },
  getTimeString: function (timestamp) {
    if(!timestamp) return '';
    let date = getTimestamp(timestamp);
        date = new Date(date);
    let YY = date.getFullYear(),
        MM = date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1,
        DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate(),
        hh = date.getHours() < 10 ? '0' + date.getHours() : date.getHours(),
        mm = date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes(),
        ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds();
    return `${YY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
  }
};

function getTimestamp(timestamp){
  timestamp = parseInt(timestamp);
  return (timestamp + "").length < 13 ? timestamp * 1000 : timestamp;
}
