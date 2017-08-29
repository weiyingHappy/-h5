import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import moment from "moment";

import {
  fetchInventory,
  fetchComments,
  setDatePicker,
  fetchJsSdk
} from "@/src/actions/storage";
import {
  changeRoom
} from "@/src/actions/hotel";
import { fetchRoomInfo } from "@/src/actions/room";
import config from "@/config/config.js";
import { covertDate } from "@/src/common";
import Loading from "../components/loading";
import Scroll from "../components/scroll";
import "./roomInfo.scss";

import { getCookie, jsSdkInit } from "../components/Common";
import EquArea from "../components/equ-area";
import CommentItem from "../components/comment-item";
import { fetchRoomLockedDate } from '@/src/actions/room'

class RoomInfo extends Component {
  state = {
    lockedDate: []
  }
  constructor(props) {
    super(props);
    this.getCommentsArea = this.getCommentsArea.bind(this);
    this.showImg = this.showImg.bind(this);
  }

  componentWillMount() {
    let { user, storage, dispatch, hotel, params } = this.props;

    let self = this;
    let from = moment(storage.from);
    let to = moment(storage.to);

    dispatch(fetchRoomInfo(params.id));

    let info = {
      roomId: params.id,
      start: from.format("YYYY-MM-DD")
    };
    dispatch(fetchInventory(info));

    let info2 = {
      roomId: params.id,
      page: 1
    };
    dispatch(fetchComments(info2));

    let info3 = {
      teamId: user.teamId,
      appid: user.appid,
      appsecret: user.appsecret
    };

    if (storage.js_sdk.hasData) {
      jsSdkInit(storage.js_sdk, user.appid, config.my_host + "/roomInfo");
    } else {
      dispatch(fetchJsSdk(info3)).then(res => {
        console.log("jssdk res: ", res);
        jsSdkInit(res.results, user.appid, config.my_host + "/roomInfo");
      });
    }
    
    dispatch(fetchRoomLockedDate(from.format('YYYY-MM-DD'), to.format('YYYY-MM-DD'), params.id)).then((data) => {
        if(data.code === 200) {
            this.setState({
                lockedDate: data.results.map((date_str) => moment(date_str.time))
            })
        }
    })
  }

  chooseDateRange() {
    browserHistory.push("/cmsfont/chooseDate?room_id=" + this.props.params.id);
  }

  getCommentsLists(storage) {
    let cnt = 0;
    return (storage.comments.lists || []).map(item => {
      cnt += 1;
      if (cnt > 3) return;
      return (
        <div key={cnt} style={{ borderTop: "1px solid #DCDCDC" }}>
          <CommentItem info={item} />
        </div>
      );
    });
  }

  getCommentsArea(storage) {
    let comments_display =
      storage.comments.nowPage <= storage.comments.totalPage;
    return storage.comments.loading
      ? <div className="middle-d">
          <div className="md-a">
            <div className="mda-a">评价</div>
            <div className="weui-loading" />
          </div>
        </div>
      : !comments_display
        ? <div className="middle-d">
            <div className="md-a">
              <div className="mda-a">评价</div>
            </div>
            <div className="no-comments">暂时没有评论</div>
          </div>
        : <div className="middle-d">
            <div className="md-a">
              <div className="mda-a">评价</div>
              <div
                className="mda-b"
                onClick={() => {
                  browserHistory.push("/cmsfont/showComment");
                }}
              >
                更多...
              </div>
            </div>
            {this.getCommentsLists(storage)}
          </div>;
  }

  handleOrder() {
    const { dispatch, params } = this.props
    dispatch(changeRoom(params.id));
    browserHistory.push("/cmsfont/orderGenerate");
  }

  showImg() {
    const { room_info } = this.props.room;

    wx.previewImage({
      current: room_info.imgs ? room_info.imgs[0] || "" : "", // 当前显示图片的http链接
      urls: room_info.imgs // 需要预览的图片http链接列表
    });
  }

  render() {
    const { hotel, user, storage, room } = this.props;

    // const room = hotel.lists[hotel.room_id];
    if (room.state === 0) {
      return <div />;
    }
    if (room.state === 1) {
      return (
        <div>
          <Loading text="房间信息加载中..." isFetching />
        </div>
      );
    }
    if (room.state === 3) {
      return <div>房间信息获取失败</div>;
    }

    const { room_info } = room;

    let from = moment(storage.from);
    let to = moment(storage.to);

    let comments_area = this.getCommentsArea(storage);

    const isIncludeLockDate = () => {
      let flag = false
      this.state.lockedDate.map((lockdate_item) => {
          if (
              lockdate_item.isBetween(from, to) ||
              lockdate_item.isSame(from, 'day')
          ) {
              flag = true
          }
      })

      return flag
    }

    return (
      <div className="roomInfo-container">
        <div className="top-a">
          <Scroll
            autoPlay
            img_lists={room_info.imgs || []}
            height="180px"
            handleClick={this.showImg}
          />

          <div className="top-a-des">
            <div className="top-a-left">
              {room_info.name}
            </div>
            {storage.inventory_loading
              ? <div className="weui-loading" />
              : storage.inventory == 0
                ? <div className="no-room-text">当前日期无房</div>
                : <div className="top-a-right">
                    <div className="top-a-right-a">
                      ￥{room_info.nowPrice.oprice}
                    </div>
                    <div
                      className={
                        "top-a-right-b " +
                        (room_info.inventory == 0 ? "no-room-price" : "")
                      }
                    >
                      ￥{storage.c_price}
                    </div>
                  </div>}
          </div>
        </div>

        <div
          className="date-container"
          onClick={() => {
            this.chooseDateRange();
          }}
        >
          <div className="start-date">
            <div className="explain-text">入住</div>
            <div className="date-ins">
              {from.get("month") + 1}月{from.get("date")}日 {covertDate(from)}
            </div>
          </div>
          <div className="num-date">
            <div className="count-text">
              {moment(to).diff(moment(from), "days")}晚
            </div>
          </div>
          <div className="end-date">
            <div className="explain-text">离店</div>
            <div className="date-ins">
              {to.get("month") + 1}月{to.get("date")}日 {covertDate(to)}
            </div>
          </div>
        </div>

        <div className="middle-a">
          <div>
            <div className="item-label">房间面积</div>
            <div className="item-value">
              {room_info.area} m²
            </div>
          </div>
          <div>
            <div className="item-label">床　　数</div>
            <div className="item-value">
              {room_info.bed_num == 1 ? "单床" : "双床"}
            </div>
          </div>
          <div>
            <div className="item-label">床 &nbsp;规 &nbsp;格</div>
            <div className="item-value">
              {room_info.bed}
            </div>
          </div>
        </div>

        <div className="middle-b">
          <div className="item-label2">房间设施</div>
          <EquArea lists={room_info.equipments} />
        </div>

        <div className="middle-c">
          <div className="item-label2">房间介绍</div>
          <div className="room-intro">
            {room_info.intro}
          </div>
        </div>

        {comments_area}

        <div style={{ height: "80px" }} />

        <div className="m-bottom">
          {
            isIncludeLockDate() ?
             <button
              disabled
              className = 'order-button order-button-disabled'

             >当前选择时间中包含锁定房间</button> :
            <button
              onClick={()=>{this.handleOrder()}}
              className={
                "order-button " +
                (!storage.inventory_loading && storage.inventory == 0
                  ? "order-button-disabled"
                  : "")
              }
              disabled={
                storage.inventory_loading || storage.inventory == 0 ? true : false
              }
            >
              {storage.inventory_loading
                ? <div className="weui-loading" />
                : <div>立即预定</div>}
            </button>
          }
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    user: state.user,
    hotel: state.hotel,
    storage: state.storage,
    room: state.room
  };
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(RoomInfo);
