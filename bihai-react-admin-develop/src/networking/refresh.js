export default function refresh(appStore, path, action, params) {
  path = Array.isArray(path) ? path : [path];
  let pageSizePath = path.concat('pageSize'),
    isLastPagePath = path.concat('isLastPage'),
    isLoadingMorePath = path.concat('isLoadingMore'),
    isRefreshingPath = path.concat('isRefreshing'),
    prevData = appStore.get(path);

  let pageSize = appStore.get(pageSizePath) || 500;
  appStore.set(isRefreshingPath, true);
  appStore.set(isLastPagePath, false);
  return action({
    pageNumber: 1,
    pageSize: pageSize,
    firstItem: prevData.data[0] || null,
    lastItem: prevData.data[prevData.data.length - 1] || null,
    ...params
  }).then(data => {
    appStore.set(path, {
      data: data,
      isLastPage: data.length < pageSize,
      isRefreshing: false,
      isLoadingMore: false,
      pageSize: pageSize,
      updateTime: Date.now()
    });
  }).catch(err => {
    appStore.set(isRefreshingPath, false);
    appStore.set(isLoadingMorePath, false);
    return Promise.reject(err);
  });
}
