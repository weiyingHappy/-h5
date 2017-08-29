import {REQUEST_MY_COUPON, RECEIVE_MY_COUPON, SET_COUPON, RECEIVE_USAGE_COUPON, CHANGE_COUPON, SET_NOT_CHOOSED} from '../actions/coupon'

let coupon_state = {
    isFetching: true,
    my: {
        totalPage: 0,
        nowPage: 0,
        lists: [],
        loading: true
    },
    use: {
        available: [],
        disable: [],
        recommend: {
        },
        loading: true,
        choosed: false
    }
};

function combineState(ori, now) {
    return Object.assign({}, ori, now);
}
function setCon(ori, now) {
    if (now.nowPage!=1 && ori.nowPage+1 != now.nowPage) {
        return ori;
    }
    console.log("ori: ", ori);

    let ret = Object.assign({}, ori, {});
    ret.nowPage = now.nowPage;
    ret.totalPage = now.totalPage;
    ret.loading = false;
    ret.lists = (now.nowPage==1?now.lists:[...ret.lists,...now.lists]);
    console.log("reducer ret: ", ret);
    return ret;
}
export default function user(state=coupon_state, action) {
    switch(action.type) {
        case REQUEST_MY_COUPON:
            return combineState(state, {my: combineState(state.my, {loading: true})});
        case RECEIVE_MY_COUPON:
            return combineState(state, {my: setCon(state.my, action.data), isFetching: false});
        case SET_COUPON:
            return combineState(state, action.info);
        case RECEIVE_USAGE_COUPON:
            return combineState(state, {use: combineState(action.data,{loading:false, choosed:false}), isFetching: false});
        case CHANGE_COUPON:
            return combineState(state, {use: combineState(state.use, {recommend:state.use.available[action.info.id], choosed: true})});
        case SET_NOT_CHOOSED:
            return combineState(state, {use: combineState(state.use, {choosed:false})});
        default:
            return state;
    }
}