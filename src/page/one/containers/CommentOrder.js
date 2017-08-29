import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import moment from "moment";
import cn from "classnames";
import config from "@/config/config";
import Loading from "../components/loading";

import { fetchOrderInfo, fetchOrderComment } from "@/src/actions/order";

import "./commentOrder.scss";

class CommentOrder extends Component {
  constructor(props) {
    super(props);
    this.publishComment = this.publishComment.bind(this);
    this.state = {
      anonymous: false,
      score: 5,
      comments: "",
      loading: false
    };
  }

  componentWillMount() {
    let { dispatch, order, user, storage } = this.props;

    dispatch(fetchOrderInfo(order.pay.order_no)).then(res => {
      console.log("order info res: ", res);
    });
  }

  publishComment() {
    let { order, dispatch } = this.props,
      self = this;
    let item = order.pay;
    let com = this.state.comments;
    let info = {
      order_no: item.order_no,
      anonymous: self.state.anonymous ? 1 : 0,
      star: self.state.score,
      comment: self.state.comments
    };
    if (com == "") {
      alert("评论不能为空");
      return;
    }
    self.setState({
      loading: true
    });
    dispatch(fetchOrderComment(info)).then(json => {
      self.setState({
        loading: false
      });
      if (json.code == 200) {
        browserHistory.goBack();
      } else {
        alert(json.msg);
      }
    });
  }

  render() {
    let { order } = this.props;
    let item = order.pay;
    return order.pay.loading
      ? <div className="comment-order-container">
          <Loading text="加载中..." isFetching={order.pay.loading} />
        </div>
      : <div className="comment-order-container">
          <div className="com-top">
            <div className="com-top-title">
              {item.team.name}
            </div>
            <div className="com-top-body">
              <div className="com-top-body-a">
                房型: {item.roomName}
              </div>
              <div className="com-top-body-b">
                间数: {item.num}
              </div>
              <div className="com-top-body-c">
                入离时间: {item.start} 至 {item.end} (共{moment(item.end).diff(
                  moment(item.start),
                  "days"
                )}晚)
              </div>
            </div>
          </div>

          <div className="com-middle">
            <div className="com-middle-a">酒店服务</div>
            <div className="com-middle-b">
              {Array(5).fill(0).map((_, index) => {
                return (
                  <span
                    onClick={() => {
                      this.setState({
                        score: index + 1
                      });
                    }}
                    key={"start" + index}
                    className={cn({
                      "comment-star-icon": true,
                      fill: index + 1 <= parseInt(this.state.score),
                      blank: index + 1 > parseInt(this.state.score)
                    })}
                  />
                );
              })}
            </div>
          </div>

          <div className="com-bottom">
            <textarea
              rows="8"
              cols="20"
              className="bottom-input"
              value={this.state.comments}
              placeholder="请写下入住体验，可为其他小伙伴作为参考，长度在10- 300字之间。"
              onChange={e => {
                this.setState({ comments: e.target.value });
              }}
            />
          </div>

          <div className="com-tail">
            <div className="com-tail-a">
              <span
                className={cn({
                    'anonymous-icon': true,
                    fill: this.state.anonymous,
                    blank: !this.state.anonymous
                })}
                onClick={() => {
                  this.setState({ anonymous: !this.state.anonymous });
                }}
              />
              匿名评价
            </div>
            <button className="com-tail-b" onClick={this.publishComment}>
              发表评价
            </button>
          </div>
        </div>;
  }
}

function select(state) {
  return {
    order: state.order,
    user: state.user,
    storage: state.storage
  };
}
// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(CommentOrder);
