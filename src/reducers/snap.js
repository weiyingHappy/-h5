import { REQUEST_SNAP, RECEIVE_SNAP, SET_SRC} from '../actions/snap'
import config from '../../config/config'

let snap_state = {
    loading: true,
    nowPage: 0,
    totalPage: 0,
    lists: [],
    src: ''
};


function handleData(info) {
    return {
        loading: false,
        lists: info.lists||[],
        nowPage: info.nowPage,
        totalPage: info.totalPage
    }
}
export default function snap(state=snap_state, action) {
    switch(action.type) {
        case REQUEST_SNAP:
            return Object.assign({}, state, {loading: true});
        case RECEIVE_SNAP:
            return Object.assign({}, state, handleData(action.info));
        case SET_SRC:
            return Object.assign({}, state, {src: action.src});
        default:
            return state;
    }
}
