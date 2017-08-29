import { REQUEST_CODE, RECEIVE_CODE, REQUEST_CHECK_CODE, RECEIVE_CHECK_CODE, REQUEST_REGISTER, RECEIVE_REGISTER } from '../actions/register'

let register_state = {
    isFetching: false
};

export default function register(state=register_state, action) {
    switch(action.type) {
        case REQUEST_CODE:
            return Object.assign({}, state, {isFetching: true});
        case RECEIVE_CODE:
            return Object.assign({}, state, {isFetching: false});
        case REQUEST_CHECK_CODE:
            return Object.assign({}, state, {isFetching: true});
        case RECEIVE_CHECK_CODE:
            return Object.assign({}, state, {isFetching: false});
        default:
            return state;
    }
}