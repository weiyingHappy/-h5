import { defineAction } from 'redux-define'
import config from '@/config/config'
import request from '../utils/request'

export const PACKAGE_INFO = defineAction('PACKAGE_INFO', ['FETCH', 'SUCCESS', 'ERROR'])

export const fetchPackageInfo = (package_id) => {
  return dispatch => {
    dispatch({
      type: PACKAGE_INFO.FETCH
    })
    const client = request(`${config.remote_host}/FE/Room/packageInfo/${package_id}`)
    client.then((data) => {
      if(data.code === 200) {
        dispatch({
          type: PACKAGE_INFO.SUCCESS,
          payload: {
            data: data.results
          }
        })
      } else {
        dispatch({
          type: PACKAGE_INFO.ERROR,
          payload: {
            msg: data.msg
          }
        })
      }
    })
    return client
  }
}