/**
 * Created by Arbella on 2018/3/13.
 */
import React, {Component} from 'react';
import CacheManage from './CacheManage'
import {storeAware} from 'react-hymn';
import config from './config/appConfig'
//内存警报
//清除时机
//容错
//兼容
//业务处理
//

export default class BasicFragment extends Component {
    constructor(props) {
        super(props);
        CacheManage.checkMemory()
    }

    getCache = (fargmentName, state) => {

        try {
            const cacheArr = localStorage.getItem(config.CACHE_ARR)
            let cacheObj = JSON.parse(cacheArr)
            console.log(typeof cacheObj)
            console.log(typeof cacheArr)
            var store = null
            cacheArr.forEach(item => {
                if (fargmentName == item.fargmentName) {
                    store = item.store
                }
            })

            if (store) {
                return JSON.parse(store)
            } else {
                //创建
                this.createViewCache(fargmentName, state)
                return null
            }
        } catch (e) {
            console.log(e)
        }

        // const state= this.state
        // if (store) {
        //     console.log('有缓存数据')
        //     console.log(store)
        //     const objStore = JSON.parse(store)
        //     //
        //     for (var key in objStore) {
        //          state[key]=objStore[key]
        //     }
        //     this.state=state
        // } else {
        //     console.log('没有缓存 new')
        //     this.createCache(this.state,'oneStore')
        // }
        //获取
    }
    //创建fragment 的缓存
    createViewCache = (fargmentName, state) => {

        let cacheArr = localStorage.getItem(config.CACHE_ARR)

        let cacheArrObj = JSON.parse(cacheArr)

        console.log(cacheArrObj)

        var store = {}
        for (var key in state) {
            store[key] = state[key]
        }
        cacheArrObj.push({'fargmentName': fargmentName, 'store': JSON.stringify(store)})
        localStorage.setItem(config.CACHE_ARR, JSON.stringify(cacheArrObj))

        // let cacheArr = []
        //
        // var store = {}
        // for (var key in state) {
        //     store[key] = state[key]
        // }
        //  cacheArr.push({key: storeKey, data: JSON.stringify(store)})
        // localStorage.setItem('view-cache', cacheArr)
    }
//更新数据
    updatedStore = (state, storeKey) => {
        var store = localStorage.getItem(storeKey)
        const objStore = JSON.parse(store)

        for (var key in state) {
            objStore[key] = state[key]
        }

        this.saveStore(storeKey, JSON.stringify(objStore))
    }
//创建缓存


    saveStore = (storeKey, obj) => {
        localStorage.setItem(storeKey, obj)
    }
}

