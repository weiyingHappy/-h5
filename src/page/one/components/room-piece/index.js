import React from "react";
import PropTypes from "prop-types";
import cn from "classnames";
import qs from 'qs';
import array from 'lodash/array'
import moment from "moment";
import { browserHistory } from 'react-router';
import "./index.scss";

class RoomPiece extends React.Component {
  state = {
    showmore: false
  }
  constructor(props) {
    super(props);
  }
  
  render() {
    const { data } = this.props;
    const { booked, num } = data.dynamic;

    const getNotify = () => {
      const hotel = this.props.hotel.intro;
      if (hotel.daofu == 1) {
        return "最晚留房至入住当天" + hotel.daofu_time;
      }
    };

    const getTags = () => {
      const tags = [];
      const hotel = this.props.hotel.intro;

      if (hotel.daofu == 1) {
        tags.push("到店支付");
      }
      if (hotel.wuyou == 1) {
        tags.push("无忧行李");
      }
      if (hotel.seckill == 1) {
        tags.push("抢房");
      }

      return tags;
    };

    // 获取禁用状态
    const getDisabled = () => {
      let flag = false
      flag = (booked == num || data.available === 0) && moment().isSame(moment(data.dynamic.date), 'day')
      return flag
    }

    // 获取套餐相关组件
    const getPacks = () => {
      if(!this.state.showmore) {
        return ''
      }
      const packages_arr = this.props.data.packages
      return (
        <div className="packages">
          {/**
           * 套餐列表需要包含一个默认的套餐，该套餐就是基本的房间
           */}
          <div className="package_item" onClick={() => {
            this.props.onClickPack()
          }}>
            <div className="text_content">
              <div className="left">
                <div className="room_name">
                  {data.name}
                  {getStockNotiy()}
                </div>
                <div className="pack_content">
                  {/*<span className="logo">含</span>*/}
                  {data.name}*1
                </div>
                
              </div>
              <div className="right">
                <div className="price">
                  ￥
                  <span className="large">{String(data.dynamic.sprice).split(".")[0]}</span>
                  .{String(data.dynamic.sprice).split(".")[1]}
                </div>
                <button
                  className={cn("order_btn", {
                    full: booked == num
                  })}
                  onClick={(e) => {
                    e.stopPropagation()
                    browserHistory.push('/cmsfont/ordergenerate?' + qs.stringify({
                      room_id: data.id
                    }))
                  }}
                  disabled = {getDisabled()}
                >
                  预定
                </button>
                <div className="leave_notiy">
                  {getNotify()}
                </div>
              </div>
            </div>
          </div>
          {
            packages_arr.map((item, index) => (
              <div className="package_item" key={'package_item' + index} onClick={() => {
                this.props.onClickPack(item)
              }}>
                <div className="divide"></div>
                <div className="text_content">
                  <div className="left">
                    <div className="room_name">
                      <span className="pack_name">{item.name}</span>
                      {getStockNotiy()}
                    </div>
                    <div className="pack_content">
                      {/*<span className="logo">含</span>*/}
                      {data.name}*1 {item.products.length<3?item.products.map((produc,pIndex) => {
                        return <p key={pIndex}>{`${produc.name}*${produc.num}`}</p>
                      }):item.products.slice(0,2).concat('...').map((produc,pIndex) => {
                        if(pIndex<2)
                          return <p key={pIndex}>{`${produc.name}*${produc.num}`}</p>
                        else
                         return produc
                      })}
                    </div>
                    
                  </div>
                  <div className="right">
                    <div className="price">
                      ￥
                      <span className="large">{String(item.sprice).split(".")[0]}</span>
                      .{String(item.sprice).split(".")[1]}
                    </div>
                    <button
                      className={cn("order_btn", {
                        full: booked == num
                      })}
                      onClick={(e) => {
                        e.stopPropagation()
                        browserHistory.push('/cmsfont/ordergenerate?' + qs.stringify({
                          room_id: data.id,
                          package_id: item.id
                        }))
                      }}
                      disabled = {getDisabled()}
                    >
                      预定
                    </button>
                    <div className="leave_notiy">
                      {getNotify()}
                    </div>
                  </div>
                </div>
                <div className="pack_imgs">
                  <ul>
                    {
                      array.flattenDeep(item.products
                        .map((produc) => {
                          return produc.imgs
                        }))
                        .map((img, index, arr) => {
                          if(img && index<3) {
                            return (
                              <li key={'produc_img_'+index}>
                                <div className="image_item">
                                  <div className="image" onClick={(e) => {
                                    e.stopPropagation()
                                    console.log(img, arr)
                                    wx.previewImage({
                                      current: img, // 当前显示图片的http链接
                                      urls: arr // 需要预览的图片http链接列表
                                    });
                                  }}>
                                    <img src={img} alt=""/>
                                  </div>
                                </div>
                              </li>
                            )
                          } else {
                            return (
                              <li key={'produc_img_'+index} style={{display:'none'}}>
                                <div className="image_item">
                                  <div className="image" onClick={(e) => {
                                    e.stopPropagation()
                                    console.log(img, arr)
                                    wx.previewImage({
                                      current: img, // 当前显示图片的http链接
                                      urls: arr // 需要预览的图片http链接列表
                                    });
                                  }}>
                                    <img src={img} alt=""/>
                                  </div>
                                </div>
                              </li>
                            )
                          }
                        })
                    }
                  </ul>
                </div>
              </div>
            ))
          }
        </div>
      )
    }

    // 房间剩余提醒
    const getStockNotiy = () => {
      if (booked == num) {
        return <span className="rest_error">· 满房</span>;
      }
      if (booked / num >= 0.8) {
        return (
          <span className="rest_waring">
            · 仅剩<span className="rest_waring_strong">{num - booked}</span>间
          </span>
        );
      }
    };

    return (
      <div>
        <div className="room-piece" onClick={(e) => {
          e.stopPropagation()
          this.setState({
            showmore: !this.state.showmore
          })
        }}>
          <div className="img-area">
            <div className="image_content">
              <img
                src={data.imgs ? data.imgs[0] + "?imageView2/1/w/90/h/90" : 'http://oi9d1dmyt.bkt.clouddn.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.jpg'}
                className="img-area-ins"
              />
              {data.tags && data.tags.length > 0
                ? <img src={data.tags} className="img-type" />
                : ""}
            </div>
          </div>
          <div className="info-area">
            <div className="info-name-info">
              <div className="info-name">
                {data.name}
              </div>
            </div>
            <div className="room_bewrite">
              <span className="area">{data.area}m²</span> |
              <span className="bed">{data.bed_num == 2 ? "双床" : "单床"}</span>
            </div>
            <div className="tags">
              {getTags().map((tag, index) =>
                <span className="tag" key={"tag_" + index}>
                  {tag}
                </span>
              )}
            </div>
          </div>

          <div className="order-opera">
            <div className="opera_btns">
              <div className="price">
                ￥
                <span className="large">{data.dynamic.sprice.split(".")[0]}</span>
                .{data.dynamic.sprice.split(".")[1]}
                <span className="up">
                  起
                </span>
              </div>
              <div className={cn("fold_btn", {
                'active': this.state.showmore
              })}>
                <i className="iconfont icon-up"></i>
              </div>
            </div>
          </div>
        </div>
        {getPacks()}
      </div>
    );
  }
}

RoomPiece.propTypes = {
  data: PropTypes.object.isRequired,
  hotel: PropTypes.object.isRequired, // 房间所属酒店信息，因为需要判断到付
  onClickPack: PropTypes.func
};

module.exports = RoomPiece;
