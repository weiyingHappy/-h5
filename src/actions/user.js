import request from '../utils/request'
import config from '../../config/config'
import { browserHistory } from 'react-router'

export const REQUEST_LOGIN = 'REQUEST_LOGIN';
export const RECEIVE_LOGIN = 'RECEIVE_LOGIN';

export const REQUEST_INDEX_IMG = 'REQUEST_INDEX_IMG';
export const RECEIVE_INDEX_IMG = 'RECEIVE_INDEX_IMG';

export const REQUEST_CHANGE_NICKNAME = 'REQUEST_CHANGE_NICKNAME';
export const RECEIVE_CHANGE_NICKNAME = 'RECEIVE_CHANGE_NICKNAME';

export const SET_USER = 'SET_USER';
export const RECEIVE_ACCUMULATE_MY = 'RECEIVE_ACCUMULATE_MY';

export const SET_COUPON_TOTAL = 'SET_COUPON_TOTAL'

export function fetchQrCode(info) {
    return (dispatch) => {
        let options = {
            method: 'POST',
            body: info
        };
        let dt = request(config.api_host+config.api_path.getQrCode, options, false);
        dt.then((json) => {
            dispatch(setUser({qr_ticket: json.ticket}));
        });
        return dt;
    }
}
export function fetchIsUliveMember(info) {
    return (dispatch) => {
        dispatch(setUser({isLoading: true}));
        let options = {
            method: 'POST',
            body: {
                phone: info.phone
            }
        };
        let dt = request(config.remote_host+config.remote_path.isUliveMember, options, true);
        dt.then((json) => {
            if (json.code==200) {
                dispatch(setUser({isUliveMember: true}));
                dispatch(setUser({isLoading: false}));
                return json;
            }
            else {
                dispatch(setUser({isUliveMember: false}));
                return dispatch(fetchQrCode(info)).then((json_b) => {
                    console.log(json_b);
                    dispatch(setUser({isLoading: false}));
                })
            }
        });
        return dt;
    }
}

export function getCouponTotal () {
    return (dispatch) => {
        let options = {
            method: 'GET'
        };
        let dt = request(config.remote_host+config.remote_path.coupon_total, options, true);
        dt.then((json) => {
            if (json.code == 200) {
                dispatch({
                    type: SET_COUPON_TOTAL,
                    payload: json.results
                })
            }
        })
    }
}

export function requestChangeNickname(nickname) {
    return {
        type: REQUEST_CHANGE_NICKNAME,
        nickname
    }
}
export function receiveChangeNickname(json) {
    return {
        type: RECEIVE_CHANGE_NICKNAME,
        json
    }
}
export function fetchChangeNickname(nickname) {
    return (dispatch) => {
        dispatch(requestChangeNickname(nickname));
        let options = {
            method: 'POST',
            body: {
                nickname: nickname
            }
        };
        let dt = request(config.remote_host+config.remote_path.changeNickname, options, true);
        dt.then((json)=>{
            dispatch(receiveChangeNickname({code: json.code, nickname: nickname}));
            console.log(json);
        });
        return dt;
    }
}
export function setUser(info) {
    return {
        type: SET_USER,
        info
    }
}
export function fetchAccumulateTotal() {
    return (dispatch) => {
        dispatch(setUser({accumulate_loading: true}));
        let dt = request(config.remote_host+config.remote_path.accumulate_total, null, true);
        dt.then((json) => {
            if (json.code == 200) {
                dispatch(setUser({
                    accumulate_loading: false,
                    accumulate_total: json.results.point
                }))
            }
        });
        return dt;
    }
}
export function receiveAccumulateMy(info) {
    return {
        type: RECEIVE_ACCUMULATE_MY,
        info
    }
}
export function fetchAccumulateMy(info) {
    return (dispatch) => {
        dispatch(setUser({accumulate_loading: true}));
        let options = {
            method: 'POST',
            body: info
        };
        let dt = request(config.remote_host+config.remote_path.accumulate_my, options, true);
        dt.then((json) => {
            if (json.code == 200) {
                dispatch(setUser({accumulate_loading: false}));
                dispatch(receiveAccumulateMy(json.results));
            }
        });
        return dt;
    }
}

export function requestLogin(user) {
    return {
        type: REQUEST_LOGIN,
        user
    }
}

export function receiveLogin(json) {
    return {
        type: RECEIVE_LOGIN,
        data: json,
        receivedAt: Date.now()
    }
}

export function fetchLogin(user) {
    return (dispatch) => {
        dispatch(requestLogin(user));

        let options = {
            method: 'POST',
            body: {
                token: user.token,
                code: user.code
            }
        };

        let dt = request(config.api_host+config.api_path.login, options);

        dt.then((json) => {
            dispatch(receiveLogin(json));
        });

        return dt;
    }
}

export function requestIndexImg(data) {
    return {
        type:REQUEST_INDEX_IMG,
        data
    }
}

export function receiveIndexImg(data) {
    return {
        type: RECEIVE_INDEX_IMG,
        data: data
    }
}


export function fetchIndexImg(data) {
    return (dispatch) => {
        dispatch(requestIndexImg(data));

        let dt = request(config.remote_host+config.remote_path.wechatInfo+'/'+data.token);

        dt.then((json)=>{
            dispatch(receiveIndexImg(json));
        });

        return dt;
    }
}