import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { browserHistory } from "react-router";
import moment from "moment";

import config from "@/config/config";
import Loading from "../components/loading";
import { getCookie, jsSdkInit } from "../components/Common";
import { fetchJsSdk } from "@/src/actions/storage";
import { fetchLogin } from "@/src/actions/user";

import { fetchOrderInfo } from "@/src/actions/order";
import * as helper from "../components/Common";

import "./showOrder.scss";

class ShowOrder extends Component {
  constructor(props) {
    super(props);
    this.handleShowMap = this.handleShowMap.bind(this);
    this.showRefundProgress = this.showRefundProgress.bind(this);

    this.state = {
      map_loading: false
    };
  }

  handleShowMap() {
    let { order } = this.props,
      self = this;
    let item = order.pay;
    self.setState({
      map_loading: true
    });
    wx.openLocation({
      latitude: parseFloat(item.team.latitude), // 纬度，浮点数，范围为90 ~ -90
      longitude: parseFloat(item.team.longitude), // 经度，浮点数，范围为180 ~ -180。
      name: item.team.name, // 位置名
      address: item.team.address, // 地址详情说明
      scale: 25, // 地图缩放级别,整形值,范围从1~28。默认为最大
      infoUrl: "", // 在查看位置界面底部显示的超链接,可点击跳转
      success: function(res) {
        self.setState({
          map_loading: false
        });
      },
      fail: err => {
        // alert(JSON.stringify(err));
        alert("获取地图失败");
        console.log(err)
        self.setState({
          map_loading: false
        });
      }
    });
    setTimeout(() => {
      if (self.state.map_loading) {
        alert("获取地图失败");
        self.setState({
          map_loading: false
        });
      }
    }, 15000);
  }

  componentWillMount() {
    /**
         * 修改记录，查看订单详情
         * 原设计逻辑为在MyOrder.js页面进行查看订单操作后将订单
         * id存入redux，在此页面通过取redux的值获取订单内容，改
         * 为在路由里面定义订单id
         */
    let { dispatch, order, user, storage, pathname } = this.props;
    let token = localStorage.token;
    let code = localStorage.code;

    dispatch(fetchOrderInfo(this.props.params.id));
    
    // 注意，验证jssdk时需要先验证用户是否登陆
    if (user.isLogin) {
      dispatch(
        fetchJsSdk({
          teamId: user.teamid,
          appid: user.appid,
          appsecret: user.appsecret
        })
      ).then(res => {
        jsSdkInit(
          res.results,
          user.appid,
          config.basehost + this.props.pathname
        );
      });
    } else {
      dispatch(fetchLogin({ token: token, code: code })).then(res => {
        if (res.results) {
          dispatch(
            fetchJsSdk({
              teamId: res.results.teamid,
              appid: res.results.appid,
              appsecret: res.results.appsecret
            })
          ).then(json => {
            jsSdkInit(
              json.results,
              res.results.appid,
              config.basehost + this.props.pathname
            );
          });
        }
      });
    }
  }
  showRefundProgress() {
    browserHistory.push("/cmsfont/refundProgress");
  }

  render() {
    let { order } = this.props;
    let item = order.pay;
    return order.pay.loading
      ? <div className="show-order-container">
          <Loading text="加载中..." isFetching={order.pay.loading} />
        </div>
      : <div className="show-order-container">
          <div className="show-order">
            <div className="so-top">
              <div className="sot-a">
                {item.team.name}
              </div>
              <div className="sot-b">
                {
                  item.package_id?(
                    <div>
                      <div>套餐：{item.package_snapshot.name}</div>
                      {item.package_snapshot.products.length
                      ?<div>包含：{item.package_snapshot.products.map((item,index) => {
                        return <span key={'produc'+index}>{`${item.name}*${item.num}`} </span>
                        })}</div>:""}
                        <div style={{height:10}}></div>
                    </div>
                  ):(
                    <div>
                      房型: {item.room.name}
                    </div>
                  )
                }
                
                <div>
                  间数: {item.num}间
                </div>
                <div>
                  入离时间: {item.start} 至 {item.end}
                </div>
                <div>
                  订单类型:{" "}
                  <span style={{ color: "#FF5000" }}>
                    {item.type == "1"
                      ? "抢房订单"
                      : item.type == "2" ? "普通订单" : "到付订单"}
                  </span>
                </div>
              </div>
              <div className="sot-c">
                酒店地址: {item.team.address}
              </div>
              <div className="sot-d">
                <a className="sotd-a" onClick={this.handleShowMap}>
                  <span className="location-icon" />
                  酒店地图
                </a>
                <a className="sotd-b" href={"tel:" + item.team.telphone}>
                  <span className="phone-icon" />
                  酒店电话
                </a>
              </div>
            </div>

            <div className="so-middle">
              <div className="som-a som-dis">
                <div>订单状态:</div>
                <div className="som-red">
                  {helper.readyPay(item.state)
                    ? "未支付"
                    : helper.hasPay(item.state)
                      ? "已支付"
                      : helper.isFinish(item.state)
                        ? "已完成"
                        : helper.needRefund(item.state) ? "申请退款" : "已取消"}
                </div>
              </div>
              <div
                className="som-progress som-dis"
                onClick={this.showRefundProgress}
                style={{
                  display: parseInt(item.apply_refund) > 0 ? "flex" : "none"
                }}
              >
                <div>取消/退款进度</div>
                <div className="arrow-right" />
              </div>
              <div className="som-b">
                <div>订单编号:</div>
                <div>
                  {item.order_no}
                </div>
              </div>
              <div className="som-c">
                <div>下单时间:</div>
                <div>
                  {item.create_time}
                </div>
              </div>
              <div className="som-d">
                <div>订单金额:</div>
                <div className="som-red">
                  ￥{item.price}
                </div>
              </div>
              <div className="som-d">
                <div>优惠金额:</div>
                <div>
                  ￥{item.price - item.pay_price}
                </div>
              </div>
              <div className="som-d">
                <div>支付金额:</div>
                <div className="som-red">
                  ￥{item.pay_price}
                </div>
              </div>
              <div className="som-e">
                {item.state > 2 ? "*退款到账需3个工作日" : ""}
              </div>
            </div>

            <div className="so-bottom">
              <div className="sob-a">
                <div>入住人:</div>
                <div>
                  {item.user_name}
                </div>
              </div>
              <div className="sob-b">
                <div>联系手机:</div>
                <div>
                  {item.phone}
                </div>
              </div>
            </div>
          </div>

          <Loading text="获取位置中" isFetching={this.state.map_loading} />
        </div>;
  }
}

function select(state) {
  return {
    order: state.order,
    user: state.user,
    storage: state.storage,
    pathname: state.routing.locationBeforeTransitions.pathname
  };
}
// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(ShowOrder);
