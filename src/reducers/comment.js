import {
    COMMENTS
} from '@/src/actions/comment'

const default_state = {
    comments: [],
    category: 0, // 评论分类 0.全部 1.好评 2.待改善
    fetch_comments: false, // 请求状态
    page: {
        nowPage: 0,
        totalPage: 1,
    }, // 页码信息
}

export default function comment(state = default_state, { type, payload }) {
    switch(type) {
        case COMMENTS.CLEAR:
            return {
                ...state,
                comments: []
            }
        case COMMENTS.FETCH:
            return {
                ...state,
                category: payload.category,
                fetch_comments: true
            }
        case COMMENTS.ERROR:
            return {
                ...state,
                fetch_comments: false
            }
        case COMMENTS.SUCCESS:
            return {
                ...state,
                fetch_comments: false,
                comments: payload.data.lists,
                page: {
                    nowPage: payload.data.nowPage,
                    totalPage: payload.data.totalPage,
                }
            }
        case COMMENTS.CONCAT:
            return {
                ...state,
                fetch_comments: false,
                comments: state.comments.concat(payload.data.lists),
                page: {
                    nowPage: payload.data.nowPage,
                    totalPage: payload.data.totalPage,
                }
            }
        default:
            return state
    }
}