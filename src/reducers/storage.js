import { REQUEST_INVENTORY, RECEIVE_INVENTORY, REQUEST_COMMENTS, RECEIVE_COMMENTS, SET_DATE, SET_DATE_PICKER,
    REQUEST_ORDER_CHANGE, RECEIVE_ORDER_CHANGE, SET_JS_SDK, SET_STORAGE, UPDATE_ORDER_PRICE} from '../actions/storage'
import config from '../../config/config'
import moment from 'moment'

let storage_state = {
    from: moment().format("YYYY-MM-DD"),
    to: moment().add(1,'d').format("YYYY-MM-DD"),
    datePicker: 0,

    inventory: 0,
    inventory_loading: false,

    c_price: 0,

    order: {
        loading: false,
        price: 0,
        num: 1,
        submitting: false
    },

    comments: {
        nowPage: 0,
        totalPage: 0,
        lists: [],
        loading: false
    },

    js_sdk: {
        hasData: false,
        appId: '',
        timestamp: '',
        nonceStr: '',
        jsapi_ticket: ''
    }
};

function setComments(comments, options) {
    return Object.assign({}, comments, options);
}
export default function user(state=storage_state, action) {
    switch(action.type) {
        case REQUEST_INVENTORY:
            return Object.assign({}, state, {inventory_loading: true});
        case RECEIVE_INVENTORY:
            return Object.assign({}, state, {inventory_loading: false, inventory: action.inventory});
        case REQUEST_COMMENTS:
            return Object.assign({}, state, {comments: setComments(state.comments, {loading: true})});
        case RECEIVE_COMMENTS:
            return Object.assign({}, state, {comments: setComments(state.comments, {loading: false,
                                    lists:action.comments.lists, nowPage: action.comments.nowPage, totalPage: action.comments.totalPage})});
        case REQUEST_ORDER_CHANGE:
            // return Object.assign({}, state, {order_loading: true, order_num: action.order_num});
            return Object.assign({}, state, {order: Object.assign(state.order,action.order)});
        case RECEIVE_ORDER_CHANGE:
            // return Object.assign({}, state, {order_loading: false, order_price: action.order_price});
            return Object.assign({}, state, {order: Object.assign(state.order,action.order)});
        case UPDATE_ORDER_PRICE:
            return {
                ...state,
                order: {
                    ...state.order,
                    price: action.payload
                }
            }
        case SET_STORAGE:
            return Object.assign({}, state, action.info);

        case SET_DATE:
            return Object.assign({}, state, {from: action.data.from, to: action.data.to});
        case SET_DATE_PICKER:
            return Object.assign({}, state, {datePicker: action.data});

        case SET_JS_SDK:
            return Object.assign({}, state, {js_sdk: Object.assign({},action.js_sdk,{hasData:true})});
        default:
            return state;
    }
}