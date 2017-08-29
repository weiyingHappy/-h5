import { defineAction } from "redux-define";
import config from "@/config/config";
import request from "../utils/request";

export const COMMENTS = defineAction("COMMENTS", [
  "FETCH",
  "SUCCESS",
  "ERROR",
  "CONCAT",
  "CLEAR"
]);

/**
 * 获取评论列表
 * @param {number} page 
 * @param {number} category 
 * @param {number} hotel_id
 */
export function fetchComment(page, category, hotel_id) {
  return dispatch => {
    if(page === 1) {
      dispatch({
        type: COMMENTS.CLEAR
      })
    }
    dispatch({
      type: COMMENTS.FETCH,
      payload: {
        category
      }
    });

    let category_str = ''
    switch(category) {
      case 1:
        category_str = 'good'
        break
      case 2:
        category_str = 'bad'
        break
      default:
        category_str = ''
        break
    }

    const client = request(
      `${config.remote_host}/FE/Evaluation/hotelEvaluations`,
      {
        method: 'POST',
        body: {
          page,
          order: category_str,
          team_id: hotel_id
        }
      }
    );

    client.then(data => {
      if (data.code !== 200) {
        dispatch({
          type: COMMENTS.ERROR
        });
        return;
      }

      // 进行分页处理，如果是第一将会清空comment数组
      dispatch({
        type: page === 1 ? COMMENTS.SUCCESS : COMMENTS.CONCAT,
        payload: {
          data: data.results
        }
      });
    });
  };
}
