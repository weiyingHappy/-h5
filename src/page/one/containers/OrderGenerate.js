import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import moment from "moment";
import qs from 'qs';
import { browserHistory } from "react-router";

import EquArea from "../components/equ-area";
import Loading from "../components/loading";

import {
  fetchOrderNum,
  fetchOrderSubmit,
  fetchInventory
} from "@/src/actions/storage";
import { setPay } from "@/src/actions/order";
import { setUser } from "@/src/actions/user";
import { fetchPackageInfo } from "@/src/actions/packages";
import {
  fetchUsageCoupon,
  setNotChoosed,
  changeCoupon
} from "@/src/actions/coupon";
import { getIntegral, covertDate } from '@/src/common'

import "./orderGenerate.scss";

class OrderGenerate extends Component {
  constructor(props) {
    super(props);
    this.handlePay = this.handlePay.bind(this);
    this.handleChooseNum = this.handleChooseNum.bind(this);
    this.chooseCoupon = this.chooseCoupon.bind(this);
    
    this.state = {
      is_choosing_num: false,
      name: localStorage.input_name || "",
      phone: localStorage.input_phone || ""
    };
  }

  componentWillMount() {
    let { dispatch, hotel, user, storage, coupon, query } = this.props,
      self = this;
    const store_room = this.props.room
    const { room_id, package_id } = query
    const room = store_room.rooms.find((room) => room.id === room_id)
    
    let from = moment(storage.from);
    let to = moment(storage.to);
    if (!user.isLogin) {
      // dispatch(setUser({register_back_url: '/cmsfont/orderGenerate?'+qs.stringify(query)}));
      // browserHistory.replace('/cmsfont/register');
      // return ;
      // browserHistory.replace('/cmsfont/rooms')
      // return
    } else {
      // if(user.phone) {
      //   self.setState({
      //     phone: user.phone
      //   });
      // }

      let info = {
        roomId: room.id,
        start: moment(from).format("YYYY-MM-DD"),
        days: moment(to).diff(from, "days"),
        num: 1
      };

      // 计算价格时需要传入订单
      if(package_id) {
        info.package_id = package_id
      }

      dispatch(fetchOrderNum(info)).then(ee => {
        if (coupon.use.choosed == true) {
          dispatch(setNotChoosed());
        } else {
          let info2 = {
            price: storage.order.price,
            team_id: user.teamId
          };

          dispatch(fetchUsageCoupon(info2)).then(data => {
            if (localStorage.useCoupon) {
              const couponid = localStorage.useCoupon;
              localStorage.removeItem("useCoupon");
              let coupon_index = -1;
              data.results.available.map((x, index) => {
                console.log("map coupon", x.id, couponid);
                if (x.id == couponid) {
                  coupon_index = index;
                }
              });

              console.log(coupon_index);

              if (coupon_index != -1) {
                dispatch(
                  changeCoupon({
                    id: coupon_index
                  })
                );
              }
            }
          });
        }
      });

      if(package_id) {
        dispatch(fetchPackageInfo(package_id))
      }

      // 获取可用房间
      dispatch(fetchInventory({
        roomId: room.id,
        start: from.format("YYYY-MM-DD")
      }))
    }
  }
  componentWillUnmount() {
    // 存放到localStorage，以解决选择优惠券时返回输入为空
    localStorage.input_name = this.state.name
    localStorage.input_phone = this.state.phone
  }
  twoFloat(val) {
    return parseInt(val * 100) / 100.0;
  }

  handleChooseNum(val) {
    let self = this;
    return () => {
      let { dispatch, hotel, user, storage, query } = self.props;
      const store_room = this.props.room
      const { room_id, package_id } = query
      const room = store_room.rooms.find((room) => room.id === room_id)
      let from = moment(storage.from);
      let to = moment(storage.to);

      if (storage.inventory < val) {
        return;
      }

      self.setState({
        is_choosing_num: false
      });

      let info = {
        roomId: room.id,
        start: moment(from).format("YYYY-MM-DD"),
        days: moment(to).diff(from, "days"),
        num: val
      };

      // 计算价格时需要传入套餐
      if(package_id) {
        info.package_id = package_id
      }

      dispatch(fetchOrderNum(info)).then(data => {
        fetchUsageCoupon({
          price: data.results,
          team_id: hotel.intro.id
        });
      });
    };
  }


  // 获取金额
  convertPrice() {
    const { available, choose } = this.props.coupon;
    const { order } = this.props.storage;

    return available.length == 0
      ? order.price
      : (order.price -
        (choose.coupon_type == 1
          ? Math.min(
              ((10 - choose.desc.discount) * order.price / 10.0),
              parseFloat(choose.desc.max_discount)
            )
          : parseFloat(choose.desc.discount))).toFixed(2);
  }

  handlePay() {
    let { dispatch, hotel, user, storage, coupon, query } = this.props,
      self = this;
    const store_room = this.props.room
    const { room_id, package_id  } = query
    const room = store_room.rooms.find((room) => room.id === room_id)

    // if (!coupon.use.recommend) {
    //   coupon.use.recommend = {
    //     id:-1 ,
    //     type: 0,//优惠券类型，0平台券，1门店券 
    //     disabled:  0,//是否禁用，0否，1是
    //     team_id: 1 ,//如果是门店券，记录酒店Id
    //     title: "",//优惠券简称，如满100减20 
    //     start : "",//开始日期 
    //     send: "",//商家发放 
    //     received: "" ,
    //     exchanged: "",
    //     used : "" ,
    //     coupon_type: "" ,
    //     end : "" ,
    //     desc: ""
    //   }
    // }

    if (self.state.name == "" || self.state.phone == "") {
      alert("姓名或手机号不能为空");
      return;
    }

    let reg = /^1[34578]\d{9}$/;

    if (!reg.test(self.state.phone)) {
      alert("手机号不合法");
      return;
    }

    let coupon_id =
      coupon.use.available.length == 0 ? "-1" : coupon.use.recommend.id;

    let info = {
      room_id: room.id,
      num: storage.order.num,
      user_name: self.state.name,
      phone: self.state.phone,
      start: storage.from,
      end: storage.to
    };

    // 计算价格时需要传入订单
    if(package_id) {
      info.package_id = package_id
    }

    if (coupon_id != -1) {
      info["coupon_id"] = coupon_id;
    }

    if (coupon.recommend) {
      info.coupon_id = coupon.recommend.id;
    }

    if (coupon.choose) {
      info.coupon_id = coupon.choose.id;
    }

    dispatch(fetchOrderSubmit(info)).then(res => {
      if (res.code == 200) {
        dispatch(setPay({ order_no: res.results.order_no }));
        browserHistory.replace("/cmsfont/payPage");
      } else {
        alert(res.code + "---" + res.msg);
      }
    });
  }
  
  chooseCoupon() {
    browserHistory.push("/cmsfont/chooseCoupon");
  }

  render() {
    let { storage, hotel, user, coupon, query, packages } = this.props;
    const store_room = this.props.room
    const {room_id} = query
    const room = store_room.rooms.find((room) => room.id === room_id)
    if(!room) {
        return (
            <div>不适当的操作导致页面失效</div> 
        )
    }

    let { available, disable, recommend } = coupon.use;

    let from = moment(storage.from);
    let to = moment(storage.to);

    let price = storage.order.price.toFixed(2); // 计算价格
    if (available.length !== 0) {
        let pre_price = storage.order.price -
          (recommend.coupon_type == 1
            ? Math.min(
                ((10 - recommend.desc.discount) *
                  storage.order.price /
                  10.0),
                  parseFloat(recommend.desc.max_discount)
              )
            : parseFloat(recommend.desc.discount))
        if (pre_price <= 0) {
            price = 1
        } else {
            price = pre_price.toFixed(2)
        }
    }

    // 获取套餐名称
    const getPackageName = () => {
      if(packages.info) {
        return '-' + packages.info.name
      }

      return ''
    }
    
    // 获取套餐内容
    const getPackageContentStr = () => {
      if(packages.info) {
        const arr = packages.info.products.map((item, index) => {
          return (
            <span key={"equ_" + index} className="item">
              {item.name + '*' + item.num}
            </span>
          )
        })
        arr.unshift(
          <span className="item" key="equ_default">
            {room.name}*1
          </span>
        )
        return arr
      }

      return ''
    }
    console.log(coupon.use.loading)
    return (
      <div className="order-generate-container">
        <div className="order_info">
          <div className="order_card">
            <div className="hotel_name">
              {hotel.intro.name}
            </div>
            <div className="room_name">
              {room.name}
              <span className="pack_name">{getPackageName()}</span>
            </div>
            <div className="daterange">
              <div className="live_in">
                入住：{from.format("MM-DD")}（{covertDate(from)}）
              </div>
              <div className="live_out">
                离店：{to.format("MM-DD")}（{covertDate(to)}）
              </div>
              <div className="count">
                共{moment(to).diff(from, "days")}晚
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

        <div className="middle">
          <div
            className="middle-a"
            onClick={() => this.setState({ is_choosing_num: true })}
          >
            <div className="input-head">房间数:</div>
            <input
              type="text"
              disabled
              value={storage.order.num + "间"}
              className="input-body"
            />
            <div className="sign" />
          </div>
          <div className="mbc-container">
            <div className="mbc-left">
              <div className="middle-b">
                <div className="input-head">入住人:</div>
                <input
                  type="text"
                  value={this.state.name}
                  placeholder="姓名"
                  className="input-body"
                  onChange={e => {
                    console.log ("qiguai",e.target.value)
                    this.setState({ name: e.target.value });
                  }}
                />
              </div>
              <div className="middle-c">
                <div className="input-head">手机号:</div>
                <input
                  type="tel"
                  value={this.state.phone}
                  placeholder="用于接收确认短信"
                  className="input-body"
                  onChange={e => {
                    this.setState({ phone: e.target.value });
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        {coupon.use.loading
          ? <div className="coupon">
              {"暂无可用优惠券"}
            </div>
          : <div className="coupon" onClick={this.chooseCoupon}>
              <div className="cp-left">
                <div className="reduce_logo">减</div>
                <div className="coupon_info">
                  <div className="cpl-a">
                    <div className="cpla-a">优惠券</div>
                    <div className="cpla-b">
                      {available.length}张可用
                    </div>
                  </div>
                  <div className="cpl-b">
                    {available.length == 0
                      ? "暂无可用优惠券"
                      : recommend.coupon_type == 0
                        ? recommend.desc.discount + "元优惠券"
                        : recommend.coupon_type == 1
                          ? recommend.desc.discount + "折券"
                          : "满" +
                            recommend.desc.limit +
                            "减" +
                            recommend.desc.discount +
                            "券"}
                  </div>
                </div>
              </div>
              <div className="cp-right">
                <div className="cpr-a">
                  {(available.length == 0 ? "" : "-￥") +
                    (recommend.coupon_type
                      ? recommend.coupon_type == 1
                        ? Math.min(
                            ((10 - recommend.desc.discount) *
                              storage.order.price /
                              10.0).toFixed(2),
                              parseFloat(recommend.desc.max_discount).toFixed(2)
                          )
                        : parseFloat(recommend.desc.discount).toFixed(2)
                      : "")}
                </div>
                <div className="cpr-b" />
              </div>
            </div>}

        <div className="integral">
          <div className="icon">
            <i className="iconfont icon-icon" />
          </div>
          获得积分：
          <span className="integral_num">{getIntegral(price)}</span>
        </div>

        <div className="bottom">
          <div className="bottom-a">温馨提示:</div>
          <div className="bottom-res">1、需在30分钟内支付，支付成功后，房间预订成功。 </div>
          <div className="bottom-res">
            2、在入住18：00可取消订单，无条件退全款。款金额将原路返回支付账户。{" "}
          </div>
          <div className="bottom-res">3、在当日18：00后预订房间，下单后半小时内可取消订单。 </div>
          <div className="bottom-res">4、因自身原因未能入住，请与酒店方协商退款。</div>
        </div>

        <div style={{ height: "80px" }} />

        {storage.order.loading
          ? <div className="tail">
              <div className="tail-a">
                订单总额: ￥<div className="weui-loading" />
              </div>
              <button className="tail-b" disabled>
                <div className="weui-loading" />
              </button>
            </div>
          : <div className="tail">
              <div className="tail-a">
                订单总额:{" "}
                <span className="tail-highlight">
                  ￥{price}
                </span>
              </div>
              <button className="tail-b" onClick={this.handlePay}>
                提交订单
              </button>
            </div>}

        <Loading text="提交订单中..." isFetching={storage.order.submitting} />

        <div style={{ display: this.state.is_choosing_num ? "block" : "none" }}>
          <div className="weui-mask" style={{ opacity: "1" }} />
          <div
            className="weui-actionsheet weui-actionsheet_toggle"
            id="iosActionsheet"
          >
            <div className="weui-actionsheet__menu choose-room-num">
              <div
                className={
                  "room-num-item " +
                  (storage.order.num == 1 ? "num-item-highlight" : "") +
                  (storage.inventory < 1 ? " room-num-item-disabled" : "")
                }
                onClick={this.handleChooseNum(1)}
              >
                1间
              </div>
              <div
                className={
                  "room-num-item " +
                  (storage.order.num == 2 ? "num-item-highlight" : "") +
                  (storage.inventory < 2 ? " room-num-item-disabled" : "")
                }
                onClick={this.handleChooseNum(2)}
              >
                2间
              </div>
              <div
                className={
                  "room-num-item " +
                  (storage.order.num == 3 ? "num-item-highlight" : "") +
                  (storage.inventory < 3 ? " room-num-item-disabled" : "")
                }
                onClick={this.handleChooseNum(3)}
              >
                3间
              </div>
              <div
                className={
                  "room-num-item " +
                  (storage.order.num == 4 ? "num-item-highlight" : "") +
                  (storage.inventory < 4 ? " room-num-item-disabled" : "")
                }
                onClick={this.handleChooseNum(4)}
              >
                4间
              </div>
              <div
                className={
                  "room-num-item " +
                  (storage.order.num == 5 ? "num-item-highlight" : "") +
                  (storage.inventory < 5 ? " room-num-item-disabled" : "")
                }
                onClick={this.handleChooseNum(5)}
              >
                5间
              </div>
              <div
                className={
                  "room-num-item " +
                  (storage.order.num == 6 ? "num-item-highlight" : "") +
                  (storage.inventory < 6 ? " room-num-item-disabled" : "")
                }
                onClick={this.handleChooseNum(6)}
              >
                6间
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    storage: state.storage,
    hotel: state.hotel,
    user: state.user,
    coupon: state.coupon,
    room: state.room,
    query: state.routing.locationBeforeTransitions.query,
    packages: state.packages
  };
}

export default connect(select)(OrderGenerate);
