import test_logo from '../resources/img/logo.png'
import test_logo_w from '../resources/img/logo-w.png'

import ecoin_logo from '../resources/ecoin/logo.png'
import ecoin_logo_w from '../resources/ecoin/logo-w.png'

import ccot_logo from '../resources/ccot/logo.png'
import ccot_logo_w from '../resources/ccot/logo-w.png'

import taimi_logo from '../resources/taimi/logo-1.png'
import taimi_logo_w from '../resources/taimi/logo-w.png'

export default {
    developmentENV: { // 开发地址
        httpApi: '47.98.139.149:8081',
        uploadAPI: '47.98.139.149:8083',
        logo: test_logo,
        logo_w: test_logo_w,
    },
    testENV: { // 测试地址
        httpApi: 'adminapi-eoe2.ichainsoft.com',
        uploadAPI: '47.75.194.232:8083',
        logo: test_logo,
        logo_w: test_logo_w,
    },
    // 客户地址环境配置
    // yihuo: {
    //     httpApi: 'adminapi.yihuo.com',
    //     uploadAPI: 'file.yihuo.com',
    //     logo: ecoin_logo,
    //     logo_w: ecoin_logo_w,
    // }, //ccot
     yihuo: {
        httpApi: 'adminapi.bihai.in',
        uploadAPI: 'file.bihai.in',
        logo: ecoin_logo,
        logo_w: ecoin_logo_w,
    },
    ccot: {
        httpApi: 'adminapi.ccot.io',
        uploadAPI: 'img.ccot.io',
        logo: ccot_logo,
        logo_w: ccot_logo_w,
    },
    //172.16.1.9 20883
    sz: {
        httpApi: 'testapi.sz.com',
        uploadAPI: '47.97.118.31:8182',
        logo: test_logo,
        logo_w: test_logo_w,
    },
    taimi: {
        httpApi: 'adminapi.taimi.io',
        uploadAPI: 'img.taimi.io',
        logo: taimi_logo,
        logo_w: taimi_logo_w,
    },
    getENV: function () {
        return this.yihuo;
    }
}
