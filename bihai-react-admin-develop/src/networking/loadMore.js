export default function loadMore(appStore, path, action, params) {
  path = Array.isArray(path) ? path : [path];
  let isLoadingMorePath = path.concat('isLoadingMore'),
    isRefreshingPath = path.concat('isRefreshing'),
    prevData = appStore.get(path);

  let pageSize = prevData.pageSize || 500,
    pageNumber = prevData.data.length % pageSize === 0 ? prevData.data.length / pageSize + 1 : Math.ceil(prevData.data.length / pageSize);
  if(prevData.isLastPage || pageNumber < 2) return Promise.resolve();
  appStore.set(isLoadingMorePath, true);
  return action({
    pageNumber: pageNumber,
    pageSize: pageSize,
    firstItem: prevData.data[0] || null,
    lastItem: prevData.data[prevData.data.length - 1] || null,
    ...params
  }).then(data => {
    appStore.set(path, {
      data: prevData.data.concat(data),
      isLastPage: data.length < pageSize,
      isLoadingMorePath: false,
      isRefreshing: false,
      pageSize: pageSize,
      updateTime: Date.now()
    });
  }).catch(err => {
    appStore.set(isLoadingMorePath, false);
    appStore.set(isRefreshingPath, false);
    return Promise.reject(err);
  });
}
