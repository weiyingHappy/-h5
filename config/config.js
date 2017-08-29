import pro_conf from './config.production'
import dev_conf from './config.development'
import test_conf from './config.test'
import api_path from './config.api_path'

let production = 'production';
let development = 'development';
let test = 'test';

let mid;
let reback;
if (window.location.hostname == 'www.lianwuyun.cn') {
    mid = test;
    reback = 'http://www.lianwuyun.cn/'
} else if (window.location.hostname == 'www.hotelets.com') {
    mid = production;
    reback = 'http://www.hotelets.com/'
} else {
    mid = development;
    reback = 'http://www.lianwuyun.cn/'
}

let now = (mid == development?dev_conf:(mid==test?test_conf:pro_conf));
let config = {
    api_host: now.api_host,
    remote_host: now.remote_host,
    my_host: now.my_host,
    reback: reback,
    admin_token: '3db627ac3a7180e7fb0cc8a68b3b4220',

    ping_appid: now.ping_appid,
    pay_appid: now.pay_appid,
    ru: now.ru,

    debug: (mid == development?true:false),

    mid: mid,
    production: production,
    development: development
};
config = Object.assign({}, config, api_path, now);

module.exports = config;
