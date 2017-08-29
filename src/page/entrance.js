/**
 * 验证页面，通过此页面路由到其他页面
 * :hotel_token  为酒店对应的token
 * :alias        为跳转别名
 */
import React, { Component } from "react";
import { connect } from "react-redux";
import { getCookie } from '@/src/common'
import { fetchLogin, setUser } from "@/src/actions/user";
import { getBrowserEnv } from "@/src/common";
import { browserHistory } from "react-router";
import config from '../../config/config'

class Entrance extends Component {
  state = {
    auth: 0, // 验证状态 0:验证中 1:成功 2:失败
    msg: "验证中..."
  };
  componentWillMount() {
    const { dispatch } = this.props;

    const token = this.props.params.hotel_token;
    const alias = this.props.params.alias;
    const roomId = this.props.params.room_id;
    const code = this.props.location.query.code;
    // 将token和code放入本地
    localStorage.token = token;
    localStorage.code = code;

    let sessionToken = (config.mid==config.development?config.admin_token:getCookie('Session-Token'));
    
    dispatch(
      fetchLogin({
        token,
        code
      })
    )
      .then(data => {
        // 因为这里的code不一定是200， 所以判断是否有results进行下一步
        if (data.results) {
          // 动态加载css

          if (Number(data.results.theme) !== 0) {
            let link_tag = document.createElement("link");
            link_tag.rel = "stylesheet";

            const env = getBrowserEnv();
            let style_href = "/cmsfont/";
            if (env === "development") {
              style_href = "/";0
            }

            link_tag.href =
              style_href + `theme/one/style${data.results.theme}.css`;

            document.querySelector("head").appendChild(link_tag);
          }

          /** 
           * 进行模板判断跳转路由
           * 1. 房间列表
           * 2. 我的订单
           * 3. 商城
           */
          switch (Number(alias)) {
            case 1:
              location.replace("/cmsfont/rooms");
              break;
            case 2:
              location.replace("/cmsfont/myorder");
              break;
            case 3:
              if (data.code === 406) {
                dispatch (setUser({register_back_url:`/cmsfont/entrance/${token}/3/${roomId}`}))
                browserHistory.push('/cmsfont/register');
              } else {
                let shop_url = `/cmsshop/#/auth?token=${token}&teamId=${data.results.teamid}`
                if (roomId) {
                  shop_url += `&roomNum=${roomId}`
                }
                location.replace(shop_url)
              }
              
              break;
            default:
              this.setState({
                msg: "未匹配到alias跳转 :- ("
              });
          }
        } else {
          this.setState({
            auth: 2
          });
        }
      })
      .catch(error => {
        alert("网络异常，请关闭后重试！");
      });
  }
  render() {
    if (this.state.auth === 2) {
      return <div>登陆失败</div>;
    }
    return (
      <div
        style={{
          height: "100%",
          backgroundColor: "#efefef",
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <div
          style={{
            backgroundColor: '#fff',
            textAlign: 'center',
            padding: '20px 30px',
            border: 'solid 1px #dcdcdc',
            borderRadius: 4,
            color: '#666'
          }}>
          <p>验证页面</p>
          <p>
            状态：{this.state.msg}
          </p>
        </div>
      </div>
    );
  }
}

export default connect()(Entrance);
