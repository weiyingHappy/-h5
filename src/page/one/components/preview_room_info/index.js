import React, { Component } from 'react'
import { connect } from 'react-redux'
import { CSSTransitionGroup } from 'react-transition-group'
import PropTypes from 'prop-types'
import moment from 'moment'
import qs from 'qs'
import { fetchRoomInfo } from '@/src/actions/room'
import Scroll from "../scroll"
import LoadingPanel from "../loading-panel"
import EquArea from "../equ-area"
import { browserHistory } from 'react-router'
import './style.scss'
import {
  fetchInventory
} from "@/src/actions/storage";

class PreviewRoomInfo extends Component {

  componentWillReceiveProps(props) {
    // 当面板打开时请求房间信息
    
    if(props.visible !== this.props.visible && props.visible) {
      this.loadData(props.room_id)
    }
  }

  loadData(room_id) {
    const { dispatch, storage } = this.props

    // 获取房间基本信息
    dispatch(fetchRoomInfo(room_id))
  }

  showImgs() {
    const { room } = this.props
    if(room.room_info) {
      wx.previewImage({
        current: room.room_info.imgs[0], // 当前显示图片的http链接
        urls: room.room_info.imgs // 需要预览的图片http链接列表
      });
    }
  }

  render() {
    const { room, package_obj } = this.props
    const getPackName = () => {
      if(package_obj) {
        return '-' + package_obj.name
      }
      return ''
    }

    const getPackContent = () => {
      if(package_obj) {
        return package_obj.products.map((produc) => {
          return `${produc.name}*${produc.num}`
        }).join(' ')
      }
      return ''
    }

    const getBodyContent = () => {
      if(room.fetchroom) {
        return (
          <LoadingPanel
            visible
          >
            房间信息获取中...
          </LoadingPanel>
        )
      } else if(room.room_info) {
        const room_info = room.room_info
        return (
          <div> 
            <div className="content">
              <Scroll
                autoPlay
                img_lists={room_info.imgs || []}
                height="180px"
                handleClick={() => {
                  this.showImgs()
                }}
              />

              <div className="pack_content">
                <span className="logo">含</span>
                {room_info.name}*1 {getPackContent()}
              </div>

              <div className="room_info">
                <div className="item">
                  <span className="label">房间面积：</span>
                  {room_info.area}㎡
                </div>
                <div className="item">
                  <span className="label">床数：</span>
                  {
                    room_info.bed_num == 2 ?
                      '双床' :
                      '单床'
                  }
                </div>
                <div className="item">
                  <span className="label">床规格：</span>
                  {
                    room_info.bed
                  }
                </div>
              </div>

              <div className="panel">
                <div className="title">房间设施</div>
                <div className="panel_body">
                  <EquArea
                    lists={room_info.equipments}
                  ></EquArea>
                </div>
              </div>

              <div className="panel intro">
                <div className="title">酒店介绍</div>
                <div className="panel_body">
                  {room_info.intro}
                </div>
              </div>

            </div>
            
          </div>
        )
      }

      return ''
    }

    const getPrice = () => {
      if(package_obj) {
        return package_obj.sprice
      }
      if(room.room_info) {
        return room.room_info.sprice
      }
      return '00.00'
    }

    let component = (
      <div
        className="preview_room_info_page"
        key="content"
      >
        <div className="bgmask" />
        <div className="info_panel">
          <div className="head">
            <div className="title">
              {
                room.room_info ?
                  room.room_info.name :
                  ''
              }
              <span className="pack_name">{getPackName()}</span>
            </div>
            <div className="close">
              <i
                onClick = {() => {
                  if(this.props.onClose) {
                    this.props.onClose()
                  }
                }}
                className="iconfont icon-close"
              ></i>
            </div>
          </div>
          <div className="body">
            {getBodyContent()}
          </div>
          <div className="operation">
            <div className="price">
              ￥
              <span className="large">{getPrice().split(".")[0]}</span>
              .{getPrice().split(".")[1]}
            </div>
            <div className="operation_btns">
              <button
                disabled = {this.props.disabled}
                onClick={() => {
                  browserHistory.push('/cmsfont/orderGenerate?' + qs.stringify({
                    room_id: this.props.room_id,
                    package_id: package_obj ?
                      package_obj.id :
                      undefined
                  }))
                }}
              >
              {
                this.props.disabled ?
                  '选择日期中，该房间不可用' :
                  '立即预定'
              }
              </button>
            </div>
          </div>
        </div>
      </div>
    )

    if(!this.props.visible) {
      component = <div key="none"></div>
    }

    return (
      <CSSTransitionGroup
        transitionName="slideUpForRoomInfo"
        transitionEnterTimeout={300}
        transitionLeaveTimeout={300}
      >
        {
          component
        }
      </CSSTransitionGroup>
    )
  }
}

PreviewRoomInfo.propTypes = {
  visible: PropTypes.bool.isRequired,
  room_id: PropTypes.number.isRequired,
  package_obj: PropTypes.object,
  onClose: PropTypes.func,
  disabled: PropTypes.bool, // 是否禁用预定按钮 true禁用, false不禁用
}

PreviewRoomInfo.defaultProps = {
  disabled: false
}

export default connect((state) => {
  return {
    room: state.room,
    storage: state.storage
  }
})(PreviewRoomInfo)
