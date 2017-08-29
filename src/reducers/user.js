import { REQUEST_LOGIN, RECEIVE_LOGIN, REQUEST_INDEX_IMG, RECEIVE_INDEX_IMG, REQUEST_CHANGE_NICKNAME, RECEIVE_CHANGE_NICKNAME, SET_USER, RECEIVE_ACCUMULATE_MY, SET_COUPON_TOTAL } from '../actions/user'
let defaultImgs = 'http://7xo285.com1.z0.glb.clouddn.com/FnN1Op_4yKDlY00C1pl_FjFIwnkx';
import config from '../../config/config'

let user_state = {
    isFetching: false,
    isLoading: false,

    teamId: localStorage.teamId,
    appid: '',
    appsecret: '',
    nickname: '',
    phone: '',
    receivedAt: '',
    isLogin: false,
    wechatToken: localStorage.token, // 为酒店生成的token
    wechatCode: '', // 第一次进入带过来的code
    avatar: '',
    openid: '',

    indexImgs: [],

    accumulate_loading: false,
    accumulate_total: 0,
    coupon_total: 0,
    accumulate_my: {
        lists: [],
        nowPage: 0,
        totalPage: 0
    },
    isUliveMember: true,
    qr_ticket: '',

    register_back_url: ''
};
function receive_lists(state, data) {
    if (data.nowPage!=1 && state.accumulate_my.nowPage+1 != data.nowPage) {
        return state;
    }
    let ret = Object.assign({}, state, {});
    ret.accumulate_my.nowPage = data.nowPage;
    ret.accumulate_my.totalPage = data.totalPage;
    ret.accumulate_my.lists = (data.nowPage==1?data.lists:[...ret.accumulate_my.lists,...data.lists]);

    return ret;
}
export default function user(state=user_state, action) {
    switch(action.type) {
        case SET_USER:
            return Object.assign({}, state, action.info);
        case REQUEST_LOGIN:
            return Object.assign({}, state, {isFetching: true, wechatToken: action.user.token, wechatCode: action.user.code});
        case RECEIVE_LOGIN:
            localStorage.teamId = action.data.results.teamid // hack
            return Object.assign({}, state, {isFetching: false, teamId: action.data.results.teamid, isLogin: (action.data.code==200||config.mid==config.development),
                                            nickname: action.data.results.nickname||'', phone: action.data.results.phone||'', appid:action.data.results.appid,
                                            appsecret: action.data.results.appsecret, avatar: action.data.results.avatar, openid: action.data.results.openid});
        case REQUEST_INDEX_IMG:
            return Object.assign({}, state, {isLoading: true});
        case RECEIVE_INDEX_IMG:
            return Object.assign({}, state, {isLoading: false, indexImgs: action.data.results.imgs||[defaultImgs]});

        case REQUEST_CHANGE_NICKNAME:
            return Object.assign({}, state, {isLoading: true});
        case RECEIVE_CHANGE_NICKNAME:
            return Object.assign({}, state, {isLoading: false, nickname: (action.json.code==200?action.json.nickname:state.nickname)});
        case SET_COUPON_TOTAL:
            return {
                ...state,
                coupon_total: action.payload
            }
        case RECEIVE_ACCUMULATE_MY:
            return receive_lists(state, action.info);
        default:
            return state;
    }
}