var axios = require('./axios');

const httpRequest = {

}

function axiosCache(instance, cacheConfig) {
    const defaultConfig = {
        // 上一次请求还在pending,直接复用   config pendingCache:true
        pendingCache: {
            enable: true,
            ignore: [],
            include: [],
        },
        // 上一次已经有值的，直接复用   config valueCache:true
        valueCache: {
            enable: true,
            ignore: [],
            include: [],
        },
        // 请求间隔小于xx ms直接复用   config xxcache: 100,
        xxcache : {
            enable: true,
            ignore: [],
            include: [],
            time: 100,
        },

        // 满足条件重试
        retryConfig: {

        }
    }
    cacheConfig = Object.assign(defaultConfig, cacheConfig);

    // 响应拦截器一定要放到第一个
    axios.interceptors.response.handlers.unshift({
        fulfilled: (response) => {
            delete httpRequest[response.config.url];
            return response;
        },
        rejected: (err) => {
            // delete httpRequest[response.config.url];   正常跑错  取消
            throw err
        },
    });

    // 请求拦截器  synchronous true则同步  false则异步，默认是异步
    const fn = (...rest) => {
        const url = rest[0];
        // 上一次请求还在pending,直接复用
        if (httpRequest[rest[0]]) {
            return httpRequest[rest[0]];
        }


        // 上一次已经有值的，根据配置复用
         return Promise.resolve('add')


        // 请求间隔小于xx ms直接复用
        return Promise.resolve('add')

        // 自动重试机制


        const newInstance = instance(...rest);
        httpRequest[rest[0]] = newInstance;
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


myAxios('http://www.baidu.com', {
}).then(res => {
    console.log('then');
}).catch(err => {
    console.log('catch', err)
})


setTimeout(() => {
    console.log('setTimeout', httpRequest);
    myAxios('http://www.baidu.com', {
    }).then(res => {
        console.log('then');
    }).catch(err => {
        console.log('catch', err)
    })
}, 1000)

console.log(123, httpRequest)
