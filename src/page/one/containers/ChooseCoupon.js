import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import CouponItem from "../components/coupon-item";
import Loading from "../components/loading";
import LoadMore from "../components/load-more";

import cn from "classnames";

import { changeCoupon } from "@/src/actions/coupon";

import "./chooseCoupon.scss";

const Zanwu = ({ desc }) => {
  return (
    <div className="zanwu">
      <div className="zanwu-b">
        {desc}
      </div>
    </div>
  );
};
Zanwu.propTypes = {
  desc: React.PropTypes.string.isRequired
};

class ChooseCoupon extends Component {
  constructor(props) {
    super(props);
    this.changeCoupon = this.changeCoupon.bind(this);
    this.state = {
      tab: 0,
      isChoosing: 0
    };
  }

  componentWillMount() {
    let { recommend, disable, available } = this.props.coupon.use;
    let id = -1,
      self = this;
    available.map(item => {
      id += 1;
      if (recommend.id == item.id) {
        self.setState({
          isChoosing: id
        });
      }
    });
  }

  aClick(id) {
    let self = this;
    let { dispatch } = this.props;
    return () => {
      self.setState({
        isChoosing: id
      });
      dispatch(
        changeCoupon({
          id: id
        })
      );
      // browserHistory.replace("/cmsfont/orderGenerate");
    };
  }
  changeCoupon() {
    let { dispatch } = this.props,
      self = this;
    dispatch(
      changeCoupon({
        id: self.state.isChoosing
      })
    );
    browserHistory.goBack();
  }

  render() {
    let { coupon } = this.props;
    let { available, disable, recommend } = coupon.use;

    let { tab } = this.state;
    let a_id = -1;
    let a_lists = available.map(item => {
      a_id += 1;
      return (
        <div className="ci-container" key={item.id} onClick={this.aClick(a_id)}>
          <CouponItem item={item} type="choose-a" />
          <span
            style={{
              display: a_id == this.state.isChoosing ? "block" : "none"
            }}
            className={cn({
              "ci-choosing": true,
              "organge-select": item.type == 0,
              "blue-select": item.type != 0
            })}
          />
        </div>
      );
    });
    let d_lists = disable.map(item => {
      return <CouponItem item={item} key={item.id} type="choose-b" />;
    });

    return (
      <div className="choose-coupon-container">
        <div className="cc-top">
          <div
            className="cct-a"
            style={{
              color: tab == 0 ? "#FF5000" : "#333333",
              borderBottom: tab == 0 ? "2px solid #FF5000" : "none"
            }}
            onClick={() => {
              this.setState({ tab: 0 });
            }}
          >
            可用优惠券({available.length})
          </div>
          <div
            className="cct-b"
            style={{
              color: tab == 1 ? "#FF5000" : "#333333",
              borderBottom: tab == 1 ? "2px solid #FF5000" : "none"
            }}
            onClick={() => {
              this.setState({ tab: 1 });
            }}
          >
            不可用优惠券({disable.length})
          </div>
        </div>
        <div className="cc-middle">
          <div className="cc-b">
            <div
              className="ccb-left"
              onClick={() => {
                browserHistory.push("/cmsfont/exchangeCoupon");
              }}
            >
              去兑换 >
            </div>
            <div
              className="ccb-right"
              onClick={() => {
                browserHistory.push("/cmsfont/coupon_rule");
              }}
            >
              兑换规则
            </div>
          </div>

          <div className="cc-list-area">
            {tab == 0
              ? available.length == 0 ? <Zanwu desc="暂无可用优惠券~" /> : a_lists
              : disable.length == 0 ? <Zanwu desc="暂无不可用优惠券~" /> : d_lists}
          </div>
          {tab == 0
            ? <div className="cc-bottom">
                <div className="ccb-b">
                  没有更多优惠券，参与活动<span
                    className="ccbb-a"
                    onClick={() => {
                      browserHistory.push("/cmsfont/snap");
                    }}
                  >
                    获得优惠券 >
                  </span>
                </div>
              </div>
            : ""}
        </div>

        {available.length != 0
          ? <div className="operation_btn">
              <button onClick={this.changeCoupon}>确定</button>
            </div>
          : ""}
      </div>
    );
  }
}

function select(state) {
  return {
    coupon: state.coupon
  };
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(ChooseCoupon);
