import { 
    REQUEST_ORDERS_FOR_LUGGAGE,
    CHOOSE_ORDER_FOR_LUGGAGE
} from '../actions/luggage'

const _state = {
    useorders: [],
    chooseorder: 0, //无忧行李选择的酒店订单（下标
}

export default function(state = _state, action) {
    switch (action.type) {
        case REQUEST_ORDERS_FOR_LUGGAGE: 
            return {
                ...state,
                useorders: action.payload.list
            }
        case CHOOSE_ORDER_FOR_LUGGAGE:
            return {
                ...state,
                chooseorder: action.payload.id
            }
        default:
            return state
    }
}