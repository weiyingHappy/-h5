import React, { Component } from "react";
import PropTypes from 'prop-types'
import { connect } from "react-redux";
import { browserHistory, Link } from "react-router";
import config from "@/config/config";
import cn from 'classnames'
import "./intro.scss";
import Tabber from "../components/tabber";
import Loading from "../components/loading";
import Scroll from "../components/scroll";

import { getCookie, jsSdkInit } from "../components/Common";
import { fetchHotelInfo } from "@/src/actions/hotel";
import { fetchJsSdk } from "@/src/actions/storage";
import { covertEquipmentsToClassName } from '@/src/common'
// 加载房间配置的图标样式
import '../scss/facilities.scss'

class Intro extends Component {
  constructor(props) {
    super(props);
    this.handleShowMap = this.handleShowMap.bind(this);
    this.showImg = this.showImg.bind(this);
    this.state = {
      map_loading: false,
      err_msg: ""
    };
  }

  componentWillMount() {
    let self = this;
    const { user, hotel, storage, dispatch } = this.props;

    if (!hotel.hasData) {
      dispatch(fetchHotelInfo(user.teamId))
    }

    let info = {
      teamId: user.teamId,
      appid: user.appid,
      appsecret: user.appsecret
    };
    if (storage.js_sdk.hasData) {
      jsSdkInit(storage.js_sdk, user.appid, config.my_host + "/intro");
    } else {
      dispatch(fetchJsSdk(info)).then(res => {
        console.log("jssdk res: ", res);
        jsSdkInit(res.results, user.appid, config.my_host + "/intro");
      });
    }
  }

  showImg() {
    let { hotel } = this.props;
    wx.previewImage({
      current: hotel.intro.imgs ? hotel.intro.imgs[0] || "" : "", // 当前显示图片的http链接
      urls: hotel.intro.imgs // 需要预览的图片http链接列表
    });
  }

  handleShowMap() {
    let { hotel } = this.props,
      self = this;
    self.setState({
      map_loading: true
    });
    wx.openLocation({
      latitude: parseFloat(hotel.intro.latitude), // 纬度，浮点数，范围为90 ~ -90
      longitude: parseFloat(hotel.intro.longitude), // 经度，浮点数，范围为180 ~ -180。
      name: hotel.intro.name, // 位置名
      address: hotel.intro.address, // 地址详情说明
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
    }, 5000);
  }

  render() {
    const { hotel, user, storage } = this.props;
    return hotel.isFetching
      ? <div className="intro-container">
          <Loading text="加载中..." isFetching={hotel.isFetching} />

          <Tabber
            highlight={4}
            token={user.wechatToken}
            code={user.wechatCode}
          />
        </div>
      : <div className="intro-container">
          <div className="top">
            <Scroll
              img_lists={hotel.intro.imgs || []}
              height="200px"
              autoPlay
              handleClick={this.showImg}
            />
            <div className="hotel-info">
              <div className="hotel-info-a">
                <div className="hotel-name">
                  {hotel.intro.name}
                </div>
                <div className="hotel-star">
                  {Array(5).fill(0).map((_, index) => {
                    return (
                      <span
                        key={"start" + index}
                        className="hotel-star-icon"
                      >
                        <i
                          className={cn('iconfont', {
                            'icon-star': index + 1 <= parseInt(hotel.intro.star),
                            'icon-start-blank': index + 1 > parseInt(hotel.intro.star),
                          })}
                        ></i>
                      </span>
                    );
                  })}
                  <span className="hotel-star-score">
                    {hotel.intro.star}分
                  </span>
                </div>
              </div>
            </div>

            <div className="addr-phone">
              {storage.js_sdk.hasData
                ? <div className="hotel-addr" onClick={this.handleShowMap}>
                    <span className="location-icon"></span>
                    <div>
                      {hotel.intro.address}
                    </div>
                  </div>
                : <div className="hotel-addr">
                    <div className="weui-loading" />
                  </div>}
              <a className="hotel-phone" href={"tel:" + hotel.intro.telphone}>
                <span className="phone-icon"></span>
              </a>
            </div>
          </div>
          
          <div className="hotel_service">
            <div className="title">可提供服务</div>
            <div className="services">
              {
                hotel.intro.equipments.map((equipment, index) => {
                  return (
                    <div className="item" key={'equipment_' + index}>
                      <div className="icon">
                        <i className={cn('facilities_icon', covertEquipmentsToClassName(equipment))}></i>
                      </div>
                      <div className="name">{equipment}</div>
                    </div>
                  )
                })
              }
            </div>
          </div>

          <div className="hotel-intro">
            <div className="hotel-intro-title">酒店介绍</div>
            <div className="hotel-intro-body">
              {hotel.intro.intro}
            </div>
          </div>
          
          <Loading text="获取位置中" isFetching={this.state.map_loading} />
          <div className="order_btn">
            <Link to="/cmsfont/rooms">
              <button className="order_btn">立即预定</button>
            </Link>
          </div>
          <div style={{ height: "60px" }} />
          <Tabber
            highlight={4}
            token={user.wechatToken}
            code={user.wechatCode}
          />
        </div>;
  }
}

function select(state) {
  return {
    user: state.user,
    hotel: state.hotel,
    storage: state.storage
  };
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(Intro);
