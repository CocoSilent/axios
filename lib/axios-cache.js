var axios = require('./axios');

global.httpRequest = {

}

function axiosCache(instance, config) {
    axios.interceptors.request.handlers.push({
        fulfilled: (config) => {
            console.log(global.httpRequest)
            console.log('axiosCache request', config.url);
            if (global.httpRequest[config.url]) {
                console.log('throw')
                throw 'cache'
            }
            return config
        },
        rejected: () => {},
    });

    axios.interceptors.response.handlers.unshift({
        fulfilled: (config) => {
            console.log('axiosCache response');
            return config;
        },
        rejected: () => {},
    });
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
})

axios.interceptors.response.use(config => {
    console.log('response yw');
})

const myAxios = axiosCache(axios, {

});

myAxios('http://www.baidu.com', {
}).then(res => {
}).catch(err => {
    console.log(err)
})

try {
    myAxios('http://www.baidu.com', {
    }).then(res => {
    }).catch(err => {
        console.log('abc', err)
    })
} catch (err) {
    console.log(err);
}
