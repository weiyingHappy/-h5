import { defineAction } from "redux-define";
import config from "@/config/config";
import request from "../utils/request";

export const ROOM_INFO = defineAction("ROOM_INFO", [
  "FETCH",
  "SUCCESS",
  "ERROR"
]);
export const ROOM_LIST = defineAction("ROOM_LIST", [
  "FETCH",
  "SUCCESS",
  "ERROR"
]);

export const fetchRoomInfo = room_id => {
  return dispatch => {
    dispatch({
      type: ROOM_INFO.FETCH
    });
    request(
      `${config.remote_host}${config.remote_path.roomInfo}/${room_id}`
    ).then(data => {
      if (data.code === 200) {
        dispatch({
          type: ROOM_INFO.SUCCESS,
          payload: data.results
        });
      } else {
        dispatch({
          type: ROOM_INFO.ERROR
        });
      }
    });
  };
};

/**
 * 获取房间列表
 * @param {number} hotel_id 
 * @param {string} start 
 * @param {string} end
 */
export const fetchRoomList = (hotel_id, start, end) => {
  return dispatch => {
    dispatch({
      type: ROOM_LIST.FETCH
    });

    request(
      `${config.remote_host}${config.remote_path.rooms}`,
      {
        method: 'POST',
        body: {
          team_id: hotel_id,
          start,
          end
        }
      }
    ).then(data => {
      console.log(data);
      if (data.code === 200) {
        dispatch({
          type: ROOM_LIST.SUCCESS,
          payload: {
            list: data.results
          }
        });
      } else {
        dispatch({
          type: ROOM_LIST.ERROR
        });
      }
    });
  };
};

/**
 * 获取锁定房间日期
 * @param {string} start 
 * @param {string} end 
 * @param {string} room_id 
 */
export const fetchRoomLockedDate = (start, end, room_id) => {
  return dispatch => {
    const client = request(config.remote_host + config.remote_path.roomLocks, {
      method: "POST",
      body: {
        start,
        end,
        room_id
      }
    });

    return client;
  };
};
