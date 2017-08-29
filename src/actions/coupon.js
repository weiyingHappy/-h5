import request from '../utils/request'
import config from '../../config/config'
export const REQUEST_MY_COUPON= 'REQUEST_MY_COUPON';
export const RECEIVE_MY_COUPON = 'RECEIVE_MY_COUPON';
export const RECEIVE_USAGE_COUPON = 'RECEIVE_USAGE_COUPON';
export const SET_COUPON = 'SET_COUPON';
export const CHANGE_COUPON = 'CHANGE_COUPON';
export const SET_NOT_CHOOSED = 'SET_NOT_CHOOSED';

export function requestMyCoupon(info) {
    return {
        type: REQUEST_MY_COUPON,
        info
    }
}

export function receiveMyCoupon(json) {
    return {
        type: RECEIVE_MY_COUPON,
        data: json,
        receivedAt: Date.now()
    }
}
export function setCoupon(info) {
    return {
        type: SET_COUPON,
        info
    }
}
export function fetchMyCoupon(info) {
    return (dispatch) => {
        dispatch(requestMyCoupon(info));

        if (info.page == 1) {
            dispatch(setCoupon({isFetching: true}))
        }
        let options = {
            method: 'POST',
            body: info
        };

        let dt = request(config.remote_host+config.remote_path.myCoupon, options, true);

        dt.then((json) => {
            console.log("json.code",json.code)
            if (json.code == 200) {
                dispatch(receiveMyCoupon(json.results));
                console.log(json);
            }
        });

        return dt;
    }
}

export function requestUsageCoupon(info) {
    
}
export function receiveUsageCoupon(json) {
    return {
        type: RECEIVE_USAGE_COUPON,
        data: json,
        receivedAt: Date.now()
    }
}
export function fetchUsageCoupon(info) {
    return (dispatch) => {
        // dispatch(requestUsageCoupon(info));
        dispatch(setCoupon({isFetching: true}));
        
        let options = {
            method: 'POST',
            body: info
        };

        let dt = request(config.remote_host+config.remote_path.usageCoupon, options, true);

        dt.then((json) => {
            if (json.code == 200) {
                if (json.results.recommend == null) {
                    json.results.recommend = {}
                }
                dispatch(receiveUsageCoupon(json.results));
                console.log(json);
            }
        });

        return dt;
    }
}

export function changeCoupon(info) {
    return {
        type: CHANGE_COUPON,
        info
    }
}
export function setNotChoosed() {
    return {
        type: SET_NOT_CHOOSED
    }
}

export function exchangeCoupon(info) {
    return (dispatch) => {

        let options = {
            method: 'POST',
            body: info
        };

        let dt = request(config.remote_host+config.remote_path.exchangeCoupon, options, true);

        dt.then((json) => {
            if (json.code == 200) {
                console.log(json);
            }
        });

        return dt;
    }
}
