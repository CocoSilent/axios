var axios = require('./axios');

global.httpRequest = {

}

function axiosCache(instance, config) {
    axios.interceptors.request.handlers.push({
        fulfilled: (config) => {
            console.log('axiosCache request', config.url);
            if (global.httpRequest[config.url]) {
                // throw 'cache'
            }
            return config
        },
    });

    axios.interceptors.response.handlers.unshift({
        fulfilled: (config) => {
            console.log('axiosCache response');
            return config;
        },
        rejected: (err) => {
            console.log('axiosCache response err');
            throw err
        },
    });

    // 请求拦截器  synchronous true则同步  false则异步
    const fn = (...rest) => {
        const newInstance = instance(...rest);
        global.httpRequest[rest[0]] = newInstance;
        return newInstance;
    }
    return fn;
}


axios.interceptors.request.use(config => {
    console.log('request yw');
    return config;
}, error => {
    console.log('request error yw', error);
    throw error;
})

axios.interceptors.response.use(config => {
    console.log('response yw');
    return config
}, (err) => {
    console.log('response yw err');
    throw err
})

const myAxios = axiosCache(axios, {

});

myAxios('http://www.baidu.com', {
}).then(res => {
    console.log('then');
}).catch(err => {
    console.log('catch', err)
})

myAxios('http://www.baidu.com', {
}).then(res => {
    console.log('then');
}).catch(err => {
    console.log('catch', err)
})
