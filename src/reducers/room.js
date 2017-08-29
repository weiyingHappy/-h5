import { ROOM_INFO, ROOM_LIST } from '../actions/room'


const default_state = {
    room_id: '',
    state: 0, // 0初始化，1请求中，2请求完成, 3请求失败
    room_info: undefined,
    rooms: [],
    fetchroom: false, // 请求房间详情flag
    fetchrooms: false
}

export default function room(state = default_state, action) {
    switch(action.type) {
        case ROOM_INFO.FETCH:
            return {
                ...state,
                fetchroom: true,
                state: 1
            }
        case ROOM_INFO.SUCCESS:
            return {
                ...state,
                room_info: action.payload,
                state: 2,
                fetchroom: false
            }
        case ROOM_INFO.ERROR:
            return {
                ...state,
                state: 3,
                fetchroom: false
            }
        case ROOM_LIST.FETCH:
            return {
                ...state,
                fetchrooms: true
            }
        case ROOM_LIST.ERROR:
            return {
                ...state,
                fetchrooms: false
            }
        case ROOM_LIST.SUCCESS:
            return {
                ...state,
                fetchrooms: false,
                rooms: action.payload.list
            }
        default:
            return state
    }
}