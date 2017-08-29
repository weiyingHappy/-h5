import {
    REQUEST_HOTEL_LISTS,
    RECEIVE_HOTEL_LISTS,
    CHANGE_ROOM,
    RECEIVE_HOTEL_INFO,
    REQUEST_HOTEL_INFO
} from '../actions/hotel'

let hotel_state = {
    isFetching: true,
    intro: {},
    lists: [],
    nowPage: 0,
    totalPage: 0,
    hasData: false,
    room_id: 0
};

function receive_lists(state, data) {
    if (data.nowPage!=1 && state.nowPage+1 != data.nowPage) {
        return state;
    }
    let new_state = Object.assign({}, state, {isFetching: false, intro: data.other,
                    nowPage: data.nowPage, totalPage: data.totalPage, hasData: true});

    if(!new_state.intro.equipments) {
        new_state.intro.equipments = []
    }
    new_state.lists = (data.nowPage==1?data.lists:[...state.lists, ...data.lists]);

    return new_state;
}

export default function hotel(state=hotel_state, action) {
    switch(action.type) {
        case REQUEST_HOTEL_INFO:
            return {
                ...state,
                isFetching: true
            }
        case REQUEST_HOTEL_LISTS:
            return Object.assign({}, state, {isFetching: true});
        case RECEIVE_HOTEL_LISTS:
            return receive_lists(state, action.data.results);
        case CHANGE_ROOM:
            return Object.assign({}, state, {room_id: action.id});
        case RECEIVE_HOTEL_INFO:
            return {
                ...state,
                intro: {
                    ...action.payload.data,
                    equipments: action.payload.data.equipments || [],
                    daofu_time: action.payload.data.daofu_time.split(":").slice(0,2).join(":")
                },
                isFetching: false
            }
        default:
            return state;
    }
}