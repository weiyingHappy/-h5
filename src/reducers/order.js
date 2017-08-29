import { SET_PAY, SET_STATE, RECEIVE_MY_ORDER, REQUEST_To_PAY, RECEIVE_TO_PAY,STATE_ALL, REQUEST_UNI_PAY_OPENID, RECEIVE_UNI_PAY_OPENID,STATE_ALREADY, STATE_FINISH, STATE_NO, POP_ORDER } from '../actions/order'
import config from '../../config/config'
import moment from 'moment'

let order_state = {
    pay: {
        order_no: '',
        openid: '',
        loading: true,
        room: {},
        team: {},
        pay_loading: false,
        openid_loading: false,
        finish_loading: false,
        refund_loading: false,
        unpay_loading: false
    },
    con: [{
        nowPage: 0,
        totalPage: 0,
        lists: []
    },{
        nowPage: 0,
        totalPage: 0,
        lists: []
    },{
        nowPage: 0,
        totalPage: 0,
        lists: []
    },{
        nowPage: 0,
        totalPage: 0,
        lists: []
    },{
        nowPage: 0,
        totalPage: 0,
        lists: []
    }],
    con_loading: true,
    cat: STATE_ALL
};

function combineState(ori, now) {
    return Object.assign({}, ori, now);
}
function setCon(ori, now, cat) {
    if (now.nowPage!=1 && ori[cat].nowPage+1 != now.nowPage) {
        return ori;
    }

    let ret = ori.slice();
    ret[cat].nowPage = now.nowPage;
    ret[cat].totalPage = now.totalPage;
    ret[cat].lists = (now.nowPage==1?now.lists:[...ret[cat].lists,...now.lists]);
    console.log("reducer ret: ", ret);
    return ret;
}
function popOrder(con, cat, id) {
    let ret = con.slice();
    let lists = ret[cat].lists;
    ret[cat].lists = [...lists.slice(0,id),...lists.slice(id+1, lists.length)];
    return ret;
}
export default function user(state=order_state, action) {
    switch(action.type) {
        case SET_PAY:
            return combineState(state, {pay: combineState(state.pay, action.pay)});
        case SET_STATE:
            return combineState(state, action.state);
        case REQUEST_To_PAY:
            return combineState(state, {pay: combineState(state.pay, {pay_loading: true})});
        case RECEIVE_TO_PAY:
            return combineState(state, {pay: combineState(state.pay, {pay_loading: false})});
        case REQUEST_UNI_PAY_OPENID:
            return combineState(state, {pay: combineState(state.pay, {openid_loading: true})});
        case RECEIVE_UNI_PAY_OPENID:
            return combineState(state, {pay: combineState(state.pay, {openid_loading: false, openid: action.info.openid})});
        case RECEIVE_MY_ORDER:
            return combineState(state, {con: setCon(state.con, action.results, action.cat)});
        case POP_ORDER:
            return combineState(state, {con: popOrder(state.con, action.cat, action.id)});
        default:
            return state;
    }
}