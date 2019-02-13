import tradeFetch from './tradeFetch';
import appStore from '../appStore';
import refresh from './refresh';
import loadMore from './loadMore';

function postUrlencoded() {
  return tradeFetch.postUrlencoded.apply(tradeFetch, arguments).then(res => {
    if(res.code === 0){
      return res;
    }else{
      return Promise.reject(res);
    }
  });
}

const fetchActions = {
  /**
   * 获取订单
   * */
  _getOrders: params => {
    return postUrlencoded(tradeFetch.createUrl('/v01/trade/order/orderList'), {pageNumber: params.pageNumber, pageSize: params.pageSize, status: params.type}).then(res => {
      return res.data.list;
    });
  },
  refreshOrders: type => {
    return refresh(appStore, type === 0 ? 'orders' : 'historyOrders', fetchActions._getOrders, { type: type });
  },
  loadMoreOrders: type => {
    return loadMore(appStore, type === 0 ? 'orders' : 'historyOrders', fetchActions._getOrders, { type: type });
  },
  /**
   * 获取广告列表
   * */
  _getAdList: params => {
    return postUrlencoded(tradeFetch.createUrl('/v01/trade/advertising/index/list'), { pageNumber: params.pageNumber, pageSize: params.pageSize, type: params.type, moneyType: params.moneyType}).then(res => {
      return res.data.list;
    });
  },
  refreshAdList: (type, moneyType) => {
    return refresh(appStore, type === 0 ? 'adListSell' : 'adListBuy', fetchActions._getAdList, { type: type , moneyType: moneyType});
  },
  loadMoreAdList: (type, moneyType) => {
    return loadMore(appStore, type === 0 ? 'adListSell' : 'adListBuy', fetchActions._getAdList, { type: type, moneyType: moneyType});
  },
  /**
   * 获取我的广告
   * */
  _getMyAdList: params => {
    return postUrlencoded(tradeFetch.createUrl('/v01/trade/advertising/user/list'), { pageNumber: params.pageNumber, pageSize: params.pageSize, status: params.type, moneyType: params.moneyType }).then(res => {
      return res.data.list;
    });
  },
  refreshMyAdList: (type, moneyType) => {
    console.log('刷新我的广告');
    return refresh(appStore, type === 1 ? 'myAdList' : 'myHistoryAdList', fetchActions._getMyAdList, { type: type, moneyType: moneyType });
  },
  loadMoreMyAdList: (type, moneyType) => {
    console.log('加载更多我的广告');
    return loadMore(appStore, type === 1 ? 'myAdList' : 'myHistoryAdList', fetchActions._getMyAdList, { type: type, moneyType: moneyType });
  },
  /**
   * 获取他人广告
   * */
  _getOthersAdList: params => {
    console.log('获取他人广告', );
    return postUrlencoded(tradeFetch.createUrl('/v01/trade/advertising/user/list', {userId: params.userId}), { pageNumber: params.pageNumber, pageSize: params.pageSize }).then(res => {
      return res.data.list;
    });
  },
  refreshOthersAdList: userId => {
    console.log('刷新他人的广告', userId);
    return refresh(appStore, 'othersAdList' , fetchActions._getOthersAdList, { userId: userId });
  },
  loadMoreOthersAdList: userId => {
    console.log('加载更多他人的广告');
    return loadMore(appStore, 'othersAdList', fetchActions._getOthersAdList, { userId: userId });
  },
  /**
   * 获取他人发布的与我相关的广告
   * */
  _getOthersAdListAboutMe: params => {
    return postUrlencoded(tradeFetch.createUrl('/v01/trade/order/IwithHim/orderList', { userId: params.userId }), { pageNumber: params.pageNumber, pageSize: params.pageSize }).then(res => {
      return res.data.list;
    });
  },
  refreshOthersAdListAboutMe: userId => {
    return refresh(appStore, 'othersAdListAboutMe' , fetchActions._getOthersAdListAboutMe, { userId: userId });
  },
  loadMoreOthersAdListAboutMe: userId => {
    return loadMore(appStore, 'othersAdListAboutMe', fetchActions._getOthersAdListAboutMe, { userId: userId });
  },
  /**
   * 获取报价
   * */
  getPrice: type => {
    return postUrlencoded(tradeFetch.createUrl('/v01/trade/advertising/getNowQuotes'), {moneyType: type}).then(res => {
      return res.data;
    });
  }
};

export default fetchActions;
