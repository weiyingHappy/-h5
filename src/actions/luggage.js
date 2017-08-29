import request from '../utils/request'
import config from '../../config/config'

// 获取支持无忧行李的订单
export const REQUEST_ORDERS_FOR_LUGGAGE = 'REQUEST_ORDERS_FOR_LUGGAGE'
export const CHOOSE_ORDER_FOR_LUGGAGE = 'CHOOSE_ORDER_FOR_LUGGAGE'
import { SET_PAY } from './order'

export const fetchOrdersForLuggage = (teamid) => {
    return (dispatch) => {
        return request(`${ config.remote_host }${ config.remote_path.ordersforluggage }`, {
            method: 'GET'
        }, true)
            .then((json) => {
                if (json.code === 200) {
                    dispatch({
                        type: REQUEST_ORDERS_FOR_LUGGAGE,
                        payload: {
                            list: json.results
                        }
                    })
                }
            })
    }
}

/**
 * 选择订单
 * @param {number} id 
 */
export const chooseOrderForLuggage = (id) => {
    return {
        type: CHOOSE_ORDER_FOR_LUGGAGE,
        payload: {
            id: id
        }
    }
}

export const fetchLuggageOrders = () => {
    return (dispatch) => {
        
    }
}

export const fetchLuggageOrderInfo = (order_num) => {
    return (dispatch) => {
        return request(`${ config.remote_host }${ config.remote_path.luggageOrderInfo }/${ order_num }`, {
            method: 'GET'
        }, true)
    }
}