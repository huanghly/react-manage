import {Store} from 'react-hymn';
import Storage from 'react-hymn-local-storage';

export const logoutClearPairs = {
    //"user": null,
};

export default new Store({
    localStorage: new Storage('TTFDSHBVCX'),
    flashKeys: [],
    cacheKeys: [
        'user'
    ],

    store: {
        user: null,
    },

});
