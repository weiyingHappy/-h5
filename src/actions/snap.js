import request from '../utils/request'
import config from '../../config/config'
import { browserHistory } from 'react-router'

export const REQUEST_SNAP = 'REQUEST_SNAP';
export const RECEIVE_SNAP = 'RECEIVE_SNAP';
export const SET_SRC = 'SET_SRC';


export function setSrc(src) {
    return {
        type: SET_SRC,
        src
    }
}

export function requestSnap(teamId) {
    return {
        type: REQUEST_SNAP,
        teamId
    }
}

export function receiveSnap(json) {
    return {
        type: RECEIVE_SNAP,
        info: json,
        receivedAt: Date.now()
    }
}

export function fetchSnap(teamId) {
    return (dispatch) => {
        dispatch(requestSnap(teamId));

        let dt = request(config.remote_host+config.remote_path.getSnap+'/'+teamId, null, true);

        dt.then((json) => {
            if (json.code == 200) {
                dispatch(receiveSnap(json.results));
            }
        });
        return dt;
    }
}