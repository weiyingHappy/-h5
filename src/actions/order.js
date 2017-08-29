import request from '../utils/request'
import config from '../../config/config'
import { browserHistory } from 'react-router'

export const SET_PAY = 'SET_PAY';
export const SET_STATE = 'SET_STATE';

export const RECEIVE_MY_ORDER = 'RECEIVE_MY_ORDER';

export const REQUEST_To_PAY = 'REQUEST_To_PAY';
export const RECEIVE_TO_PAY = 'RECEIVE_TO_PAY';

export const REQUEST_UNI_PAY_OPENID = 'REQUEST_UNI_PAY_OPENID';
export const RECEIVE_UNI_PAY_OPENID = 'RECEIVE_UNI_PAY_OPENID';

export const STATE_ALL  = '0';
export const STATE_NO = '1';
export const STATE_ALREADY = '2';
export const STATE_FINISH = '3';
export const STATE_REFUND = '4';

export const POP_ORDER = "POP_ORDER";

export function setState(state) {
    return {
        type: SET_STATE,
        state
    }
}
export function receiveMyOrder(results, cat) {
    return {
        type: RECEIVE_MY_ORDER,
        results,
        cat
    }
}
export function fetchToUnPay(info) {
    return (dispatch) => {
        dispatch(setPay({unpay_loading: true}));

        let options = {
            method: 'POST',
            body: info
        };
        let dt = request(config.remote_host+config.remote_path.unPay, options, true);
        dt.then((json) => {
            dispatch(setPay({unpay_loading: false}));
        });
        return dt;
    }
}
export function fetchToCancel(info) {
    return (dispatch) => {
        dispatch(setPay({unpay_loading: true}));

        let dt = request(config.remote_host+config.remote_path.orderCancel+'/'+info.order_no, null, true);
        dt.then((json) => {
            dispatch(setPay({unpay_loading: false}));
        });
        return dt;
    }
}
export function popOrder(info) {
    return {
        type: POP_ORDER,
        cat: info.cat,
        id: info.id
    }
}
export function fetchToRefund(info) {
    return (dispatch) => {
        dispatch(setPay({refund_loading: true}));

        let options = {
            method: 'POST',
            body: info
        };

        let dt = request(config.api_host+config.api_path.toRefund, options, false);

        dt.then((json) => {
            dispatch(setPay({refund_loading: false}));
        });
        return dt;
    }
}
export function fetchMyOrder(info) {

    return (dispatch) => {
        if (info.page == 1) {
            dispatch(setState({con_loading: true}));
        }
        let body = {
            state: info.state-1,
            page: info.page,
            team_id: info.team_id
        };
        let options = {
            method: 'POST',
            body: body
        };
        let dt = request(config.remote_host+config.remote_path.myOrder, options, true);
        dt.then((json)=>{
            console.log(json);
            if (json.code == 200) {
                dispatch(setState({con_loading: false}));
                dispatch(receiveMyOrder(json.results, info.state));
            }
        });
        return dt;
    }

}

export function fetchFinishOrder(info) {
    return (dispatch) => {
        dispatch(setPay({finish_loading: true}));
        let options = {
            method: 'POST',
            body: info
        };
        let dt = request(config.remote_host+config.remote_path.finishOrder, options, true);
        dt.then((json) => {
            dispatch(setPay({finish_loading: false}));
        });
        return dt;
    }
}


export function requestUniPayOpenid(info) {
    return {
        type: REQUEST_UNI_PAY_OPENID,
        info
    }
}
export function receiveUniPayOpenid(info) {
    return {
        type: RECEIVE_UNI_PAY_OPENID,
        info
    }
}
export function fetchUniPayOpenid(info) {
    return (dispatch) => {
        dispatch(requestUniPayOpenid(info));
        let options = {
            method: 'POST',
            body: info
        };
        let dt = request(config.api_host+config.api_path.uniPayOpenid, options, false);
        dt.then((json) => {
            dispatch(receiveUniPayOpenid(json));
        });
        return dt;
    }
}

export function requestToPay(info) {
    return {
        type: REQUEST_To_PAY,
        info
    }
}

export function receiveToPay(info) {
    return {
        type: RECEIVE_TO_PAY,
        info
    }
}

export function fetchToPay(info) {
    return (dispatch) => {
        dispatch(requestToPay(info));
        
        let options = {
            method: 'POST',
            body: info
        };
        
        let dt = request(config.api_host+config.api_path.toPay, options, false);

        dt.then((json) => {
            dispatch(receiveToPay(json.data)); //TODO: 优化
        });
        
        return dt;
    }
}

export function setPay(pay) {
    return {
        type: SET_PAY,
        pay
    };
}

export function fetchOrderComment(info) {
    return (dispatch) => {
        let options = {
            method: 'POST',
            body: info
        };
        let dt = request(config.remote_host+config.remote_path.addComment, options, true);
        dt.then((json)=>{

        });
        return dt;
    }
}

export function fetchOrderInfo(orderNo) {
    return (dispatch) => {
        dispatch(setPay({loading: true}));

        let dt = request(config.remote_host+config.remote_path.orderInfo+'/'+orderNo, null, true);

        dt.then((json)=>{
            if (json.code == 200) {
                dispatch(setPay(Object.assign({},json.results, {loading: false})));
            }
        });
        return dt;
    }
}

export function fetchArrivePay(info) {
    return (dispatch) => {
        dispatch(setPay({finish_loading: true}));
        let options = {
            method: 'POST',
            body: info
        };
        let dt = request(config.remote_host+config.remote_path.finishOrder, options, true);
        dt.then((json) => {
            dispatch(setPay({finish_loading: false}));
        });
        return dt;
    }
}


export function fetchDaoFu(info) {
    return (dispatch) => {
        let dt = request(config.remote_host+config.remote_path.daofu+'/'+info.teamId, null, true);
        dt.then((json) => {
            console.log('daofu: ',json);
        });
        return dt;
    }
}