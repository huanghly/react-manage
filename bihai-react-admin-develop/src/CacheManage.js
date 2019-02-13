import config from './config/appConfig'

var CacheManage = {
    //初始化缓存
    init() {
        let a = []
        localStorage.setItem(config.CACHE_ARR, JSON.stringify(a))
    },

    checkMemory() {

    },
//更新数据
    updatedStore(state, storeKey) {
        var objStore = localStorage.getItem(storeKey).parseJSON()

        //  const objStore = JSON.parse(store)
        console.log(state)
        console.log(objStore)
        for (var key in state) {
            objStore[key] = state[key]
        }
        console.log(state)
        console.log(objStore)
        this.saveStore(storeKey, JSON.stringify(objStore))
    },


    createViewCache(state, storeKey) {
        var store = {}
        for (var key in state) {
            store[key] = state[key]
        }
        console.log(store)
        localStorage.setItem(storeKey, JSON.stringify(store))
    },

    saveStore(storeKey, obj) {
        localStorage.setItem(storeKey, obj)
    },
}
// CacheManage.prototype.aa =0
export default CacheManage