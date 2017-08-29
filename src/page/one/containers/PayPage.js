import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import moment from "moment";
import pingpp from "pingpp-js";

import config from "@/config/config";
import EquArea from "../components/equ-area";
import Loading from "../components/loading";
import { getCookie } from "../components/Common";
import request from "@/src/utils/request";
import { covertDate } from "@/src/common";

import {
  fetchOrderInfo,
  fetchToPay,
  fetchArrivePay,
  fetchDaoFu
} from "@/src/actions/order";

import "./payPage.scss";
import img_top from "../images/three/icon-6.png";

import img_a from "../images/four/icon-1.png";
import img_b from "../images/four/icon-2.png";
import img_c from "../images/four/icon-3.png";
import img_d from "../images/four/icon-4.png";
import img_e from "../images/one/icon-4.png";

class PayPage extends Component {
  constructor(props) {
    super(props);

    this.handlePay = this.handlePay.bind(this);
    this.handlePayClick = this.handlePayClick.bind(this);
    this.handleArrive = this.handleArrive.bind(this);

    this.state = {
      pay_type: 1,
      daofu: false,
      onlydaofu: false,
      fetch: false,
      account: 0,
      finish_loading: false
    };
  }

  componentWillMount() {
    let { dispatch, order, user } = this.props;

    dispatch(fetchOrderInfo(order.pay.order_no)).then(res => {
      console.log("order info res: ", res);
      if (res.results.hosting == 1) {
        this.setState({
          onlydaofu: true,
          pay_type: 0
        });
      }
    });
    let self = this;
    dispatch(fetchDaoFu({ teamId: user.teamId })).then(res => {
      if (res.results == "0") {
        self.setState({
          daofu: false
        });
      } else {
        self.setState({
          daofu: true
        });
      }
    });

    /**
         * 获取住金
         */
    this.setState({
      fetch: true
    });
    request(
      config.remote_host + config.remote_path.myAccount,
      undefined,
      true
    ).then(data => {
      this.setState({
        fetch: false
      });
      if (data.code === 200) {
        this.setState({
          account: data.results.account
        });
      }
    });
  }

  handlePay() {
    let { dispatch, order } = this.props;

    let url =
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
      config.pay_appid +
      "&redirect_uri=" +
      config.ru +
      order.pay.order_no +
      "&response_type=code&scope=snsapi_base&state=123#wechat_redirect";
    location.replace(url)
  }

  handleArrive() {
    let { dispatch, order } = this.props;
    let self = this;

    let info = {
      order_no: order.pay.order_no,
      wx_order: "daofu",
      price: 1
    };
    dispatch(fetchArrivePay(info)).then(json => {
      if (json.code == 200 || json.code == 407) {
        browserHistory.replace("/cmsfont/myorder");
      } else {
        alert("下单失败,请稍后再试!");
      }
    });
  }

  balancePay() {
    let order = this.props.order.pay;
    if (!order) {
      alert("订单错误");
      return;
    }
    this.setState({
      finish_loading: true
    });
    request(
      config.remote_host + config.remote_path.finishOrder,
      {
        method: "POST",
        body: {
          order_no: order.order_no,
          wx_order: "youmi",
          price: order.pay_price
        }
      },
      true
    ).then(data => {
      this.setState({
        finish_loading: false
      });
      if (data.code == 200) {
        alert("支付成功");
        // window.location = 'my_order?cat=1';
        browserHistory.replace("/cmsfont/paySuccess");
      } else if (data.code == 408) {
        alert("支付失败,可能住金点数不够");
      } else {
        alert("支付失败");
      }
    });
  }

  handlePayClick() {
    console.log("click: " + this.state.pay_type);
    if (this.state.pay_type == 1) {
      this.handlePay();
    } else if (this.state.pay_type == 2) {
      this.balancePay();
    } else {
      this.handleArrive();
    }
  }
  twoFloat(val) {
    return parseInt(val * 100) / 100.0;
  }

  render() {
    let { order, hotel } = this.props;
    let pay = order.pay;

    // 获取套餐名称
    const getPackageName = () => {
      if(pay.package_snapshot) {
        return '-' + pay.package_snapshot.name
      }
      return ''
    }

    // 获取套餐内容
    const getPackageContentStr = () => {
      if(pay.package_snapshot) {
        const arr = pay.package_snapshot.products.map((item, index) => {
          return (
            <span key={"equ_" + index} className="item">
              {item.name + '*' + item.num}
            </span>
          )
        })
        arr.unshift(
          <span className="item" key="equ_default">
            {pay.room.name}*1
          </span>
        )
        return arr
      }

      return ''
    }

    return order.pay.loading && false
      ? <div className="pay-page-container">
          <Loading text="加载中..." isFetching={order.pay.loading} />
        </div>
      : <div className="pay-page-container">
          <div className="order_info">
            <div className="order_card">
              <div className="hotel_name">
                {pay.team.name}
              </div>
              <div className="room_name">
                {pay.room.name}
                <span className="pack_name">{getPackageName()}</span>
              </div>
              <div className="daterange">
                <div className="live_in">
                  入住：{moment(pay.start).format("MM-DD")} （{covertDate(moment(pay.start))}）
                </div>
                <div className="live_out">
                  离店：{moment(pay.end).format("MM-DD")} （{covertDate(moment(pay.end))}）
                </div>
                <div className="count">
                  共{moment(pay.end).diff(pay.start, "days")}晚
                </div>
              </div>
              <div className="equipments">
                {getPackageContentStr()}
              </div>
              <div className="divide" />
              <div className="bewrite">
                <p style={{ marginBottom: 5 }}>订单确认后即视为消费，不支持无理由退款；</p>
                <p>到店支付订单最晚留房至{hotel.intro.daofu_time}，请及时办理入住。</p>
              </div>
            </div>
          </div>

          <div className="we-pay-middle-bottom">
            <div className="wpmb-a">
              订单金额: ￥{pay.price}-{(parseFloat(pay.price) -
                parseFloat(pay.pay_price)).toFixed(2)}=￥{pay.pay_price}
            </div>
            <div className="wpmb-b">
              <div className="price-head">支付金额:</div>
              <div className="price-body">
                ￥{pay.pay_price}
              </div>
            </div>
          </div>
          <Loading text="加载中..." isFetching={order.pay.pay_loading} />
          <Loading text="提交中..." isFetching={order.pay.finish_loading} />
          <Loading text="住金支付中..." isFetching={this.state.finish_loading} />

          <div className="bottom-a">
            <div className="ba-a">请选择支付方式</div>
            <div
              className="pay-item"
              style={{ display: this.state.onlydaofu ? "none" : "flex" }}
            >
              <div className="pi-left">
                <img src={img_e} className="pay-icon" />
                <div>
                  住金支付 (<span style={{ color: "#FF5001" }}>
                    {this.state.fetch
                      ? <div className="weui-loading" />
                      : this.state.account}
                  </span>{" "}
                  住金)
                </div>
              </div>
              <img
                className="pi-right"
                src={this.state.pay_type == 2 ? img_c : img_d}
                onClick={() => {
                  this.setState({ pay_type: 2 });
                }}
              />
            </div>
            <div
              className="pay-item"
              style={{ display: this.state.onlydaofu ? "none" : "flex" }}
            >
              <div className="pi-left">
                <img src={img_a} className="pay-icon" />
                <div>微信支付</div>
              </div>
              <img
                className="pi-right"
                src={this.state.pay_type == 1 ? img_c : img_d}
                onClick={() => {
                  this.setState({ pay_type: 1 });
                }}
              />
            </div>
            <div
              className="pay-item"
              style={{
                borderBottom: "1px solid #DCDCDC",
                display: this.state.daofu ? "flex" : "none"
              }}
            >
              <div className="pi-left">
                <img src={img_b} className="pay-icon" />
                <div>到店支付</div>
              </div>
              <img
                className="pi-right"
                src={this.state.pay_type == 0 ? img_c : img_d}
                onClick={() => {
                  this.setState({ pay_type: 0 });
                }}
              />
            </div>
          </div>
          <div style={{ height: "30px" }} />
          <div className="bottom" onClick={this.handlePayClick}>
            <button className="bottom-button">立即支付</button>
          </div>
        </div>;
  }
}

function select(state) {
  return {
    order: state.order,
    user: state.user,
    hotel: state.hotel
  };
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(PayPage);
