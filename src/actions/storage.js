import request from '../utils/request'
import config from '../../config/config'
import { browserHistory } from 'react-router'

export const REQUEST_INVENTORY = 'REQUEST_INVENTORY';
export const RECEIVE_INVENTORY = 'RECEIVE_INVENTORY';

export const REQUEST_COMMENTS = 'REQUEST_COMMENTS';
export const RECEIVE_COMMENTS = 'RECEIVE_COMMENTS';

export const REQUEST_ORDER_CHANGE = 'REQUEST_ORDER_CHANGE';
export const RECEIVE_ORDER_CHANGE = 'RECEIVE_ORDER_CHANGE';

export const SET_DATE = 'SET_DATE';
export const SET_DATE_PICKER = 'SET_DATE_PICKER';

export const SET_JS_SDK = 'SET_JS_SDK';
export const SET_STORAGE = 'SET_STORAGE';

export const UPDATE_ORDER_PRICE = 'UPDATE_ORDER_PRICE'


export function setDate(info) {
    return {
        type: SET_DATE,
        data: info
    }
}

export function setDatePicker(picker) {
    return {
        type: SET_DATE_PICKER,
        data: picker
    }
}

export function requestInventory(info) {
    return {
        type: REQUEST_INVENTORY,
        info
    }
}

export function receiveInventory(json) {
    return {
        type: RECEIVE_INVENTORY,
        inventory: json.results.inventory,
        receivedAt: Date.now()
    }
}

export function setStorage(info) {
    return {
        type: SET_STORAGE,
        info
    }
}

export function fetchInventory(info) {
    return (dispatch) => {
        dispatch(requestInventory(info));

        let dt = request(config.remote_host+config.remote_path.inventory+'/'+info.roomId+'/'+info.start, null, false);

        dt.then((json) => {
            if (json.code == 200) {
                let options = {
                    method: 'POST',
                    body: {
                        id: info.roomId,
                        time: info.start
                    }
                };
                let dt2 = request(config.remote_host+config.remote_path.roomPrice, options, false);

                dt2.then((j2)=>{
                    dispatch(setStorage({
                        c_price: j2.results.nowPrice.sprice
                    }));
                    dispatch(receiveInventory(json));
                });

            }
            console.log(json);
        });

        return dt;
    }
}

export function setJsSdk(js_sdk) {
    return {
        type: SET_JS_SDK,
        js_sdk
    }
}

export function fetchJsSdk(info) {
    return (dispatch) => {
        let options = {
            method: 'POST',
            body: info
        };

        let dt = request(config.api_host+config.api_path.getJsSdk, options, false);

        dt.then((json)=> {
            console.log("fetch js sdk: ", json);
            if (json.code == 200) {
                dispatch(setJsSdk(json.results));
            }
        });
        return dt;
    }
}

export function requestOrderNum(order_num) {
    return {
        type: REQUEST_ORDER_CHANGE,
        order: {loading: true, num: order_num}
    }
}
export function receiveOrderNum(order_price) {
    return {
        type: RECEIVE_ORDER_CHANGE,
        order: {loading: false, price: order_price}
    }
}
export function setOrderChange(order) {
    return {
        type: RECEIVE_ORDER_CHANGE,
        order
    }
}

export function fetchOrderSubmit(order) {
    return (dispatch) => {
        dispatch(setOrderChange({submitting: true}));
        let info = {
            room_id: order.room_id,
            num: order.num,
            user_name: order.user_name,
            phone: order.phone,
            start: order.start,
            end: order.end
        };
        if (order.coupon_id) {
            info['coupon_id'] = order.coupon_id
        }
        if (order.package_id) {
            info['package_id'] = order.package_id
        }
        let options = {
            method: 'POST',
            body: info
        };
        let dt = request(config.remote_host+config.remote_path.orderAdd, options, true);

        dt.then((json)=>{
            dispatch(setOrderChange({submitting: false}));
        });

        return dt;
    }
}
export function fetchOrderNum(info) {
    return (dispatch) => {
        dispatch(requestOrderNum(info.num));
        let url = config.remote_host+config.remote_path.orderPrice+'/'+info.roomId+'/'+info.start+'/'+info.days+'/'+info.num

        if(info.package_id) {
            url+='/'+info.package_id
        }

        let dt = request(url, null, true);

        dt.then((json)=>{
            if (json.code == 200) {
                dispatch(receiveOrderNum(json.results));
            }
        });
        return dt;
    }
}

export function updateOrderPrice(payload) {
    return {
        type: UPDATE_ORDER_PRICE,
        payload
    }
}

export function requestComments(info) {
    return {
        type: REQUEST_COMMENTS,
        info
    }
}

export function receiveComments(json) {
    return {
        type: RECEIVE_COMMENTS,
        comments: json.results,
        receivedAt: Date.now()
    }
}
export function getTime() {
    return (dispatch) => {
        let dt = request(config.remote_host+config.remote_path.getTime);
        return dt.then((res) => {
            let st = res.results.server_time;
            let dt = res.results.day_time;
            let reg = /([0-9]*):([0-9]*)$/;
            let rr = dt.match(reg);
            let h = rr[1], m = rr[2];
            return {
                st: st,
                h: h,
                m: m
            }
        })
    }
}

export function fetchComments(info) {
    return (dispatch) => {
        dispatch(requestComments(info));

        let dt = request(config.remote_host+config.remote_path.getComments+'/'+info.roomId+'/'+info.page, null, true);

        dt.then((json) => {
            if (json.code == 200) {
                dispatch(receiveComments(json));
            }
        });

        return dt;
    }
}