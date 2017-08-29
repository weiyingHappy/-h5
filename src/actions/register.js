import request from '../utils/request'
import config from '../../config/config'
import { browserHistory } from 'react-router'

export const REQUEST_CODE = 'REQUEST_CODE';
export const RECEIVE_CODE = 'RECEIVE_CODE';

export const REQUEST_REGISTER = 'REQUEST_REGISTER';
export const RECEIVE_REGISTER = 'RECEIVE_REGISTER';

export const REQUEST_CHECK_CODE = 'REQUEST_CHECK_CODE';
export const RECEIVE_CHECK_CODE = 'RECEIVE_CHECK_CODE';

export function requestCode(phone) {
    return {
        type: REQUEST_CODE,
        phone
    }
}

export function receiveCode(json) {
    return {
        type: RECEIVE_CODE,
        data: json,
        receivedAt: Date.now()
    }
}

export function fetchCode(phone) {
    return (dispatch) => {
        dispatch(requestCode(phone));

        let dt = request(config.remote_host+config.remote_path.sendSMS+'/'+phone+'/register');

        dt.then((json) => {
            dispatch(receiveCode(json));
        });

        return dt;
    }
}


export function requestCheckCode(info) {
    return {
        type: REQUEST_CHECK_CODE,
        info
    }
}

export function receiveCheckCode(json) {
    return {
        type: RECEIVE_CODE,
        data: json,
        receivedAt: Date.now()
    }
}

export function fetchCheckCode(info) {
    return (dispatch) => {
        dispatch(requestCheckCode(info));

        let dt = request(config.remote_host+config.remote_path.checkSMS+'/'+info.phone+'/'+info.code);

        dt.then((json) => {
            dispatch(receiveCheckCode(json));
        });

        return dt;
    }
}

export function requestRegister(info) {
    return {
        type: REQUEST_REGISTER,
        info
    }
}

export function receiveRegister(json) {
    return {
        type: RECEIVE_REGISTER,
        data: json,
        receivedAt: Date.now()
    }
}


export function fetchRegister(info) {
    return (dispatch) => {
        dispatch(requestRegister(info));

        let options = {
            method: 'POST',
            body: {
                phone: info.phone,
                wxid: info.wxid,
                nickname: info.nickname,
                team_id: info.team_id
            }
        };
        
        let dt = request(config.remote_host+config.remote_path.register, options);

        dt.then((json)=>{
            dispatch(receiveRegister(json));
        });

        return dt;
    }
}