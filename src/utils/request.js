import 'babel-polyfill'
import fetch from 'isomorphic-fetch'
import {getCookie} from '@/src/common'
import config from '../../config/config'

export default function request(url, options, needToken=false) {
    if (!options) {
        options = {method: 'GET'};
    }
    options.mode = 'cors';

    let reg = new RegExp("^"+config.api_host);
    if (reg.test(url)) {
        options.credentials = 'include';
    }
    let sessionToken = (config.mid==config.development?config.admin_token:getCookie('Session-Token'));
    console.log(sessionToken)
    var myHeaders = new Headers({
        "Content-Type": "application/json"
    });
    if (needToken) {
        myHeaders.append("Session-Token", sessionToken);
    }


    options.headers = myHeaders;
    options.body = JSON.stringify(options.body);
    //
    // console.log('options: ', options);

    if (options.method === 'GET') {
        return timeoutfetch(url, options)
    }

    return fetch(url, options)
        .then(response => response.json())
        .then(json =>{
                return json;
            }
        )
        .catch((e) => {
            console.log("catch error: ", e);
        });
}

function timeoutfetch(url, options) {
    return new Promise((resolve, reject) => {
        _fetch(fetch(url, options), 30000)
            .then((response) => {
                resolve(response.json())
            })
            .catch((error) => {
                if (error === 'abort promise') {
                    _fetch(fetch(url, options), 30000)
                        .then((response) => {
                            resolve(response.json())
                        })
                }
            })
    })
}

function _fetch(fetch_promise, timeout) {
    var abort_fn = null;

    //这是一个可以被reject的promise
    var abort_promise = new Promise(function(resolve, reject) {
        abort_fn = function() {
            reject('abort promise');
        };
    });

    //这里使用Promise.race，以最快 resolve 或 reject 的结果来传入后续绑定的回调
    var abortable_promise = Promise.race([
        fetch_promise,
        abort_promise
    ]);

    setTimeout(function() {
        abort_fn();
    }, timeout);

    return abortable_promise;
}