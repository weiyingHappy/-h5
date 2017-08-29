/**
 * 套餐信息reducer
 */
import { PACKAGE_INFO } from '../actions/packages'

const default_state = {
  info: undefined,
  fetch_info: false
}

export default function(state = default_state, { type, payload }) {
  switch(type) {
    case PACKAGE_INFO.FETCH:
      return {
        ...state,
        fetch_info: true
      }
    case PACKAGE_INFO.SUCCESS:
      return {
        ...state,
        fetch_info: false,
        info: payload.data
      }
    case PACKAGE_INFO.ERROR:
      return {
        ...state,
        fetch_info: false
      }
    default:
      return state
  }
}