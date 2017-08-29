import React from "react";
import "./wallet_log.scss";
import request from "@/src/utils/request";
import config from "@/config/config";

class walletLog extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lists: [],
      nowPage: 0,
      totalPage: 0,
      fetch: false
    };
  }
  getCookie(c_name) {
    if (document.cookie.length > 0) {
      try {
        var reg = new RegExp("(^|\\s)" + c_name + "=([^;]*)(;|$)");
        let res = document.cookie.match(reg);
        if (res) {
          return res[2];
        } else {
          return null;
        }
      } catch (e) {
        console.log(e);
      }
    }
    return "";
  }

  componentWillMount() {
    let self = this;
    this.loadData(1)
  }

  handleScorll(e) {
    const el = e.target
    const scrollValue = el.scrollHeight - el.clientHeight - el.scrollTop
    if(scrollValue < 20 && this.state.nowPage < this.state.totalPage && !this.state.fetch) {
      this.loadData(this.state.nowPage + 1)
    }
  }

  loadData(page = 1) {
    this.setState({
      fetch: true
    });
    request(
      config.remote_host + config.remote_path.goldCusLogs,
      {
        method: "POST",
        body: {
          page
        }
      },
      true
    ).then(res => {
      this.setState({
        fetch: false
      });
      if (res.code === 200) {
        let lists = []
        if(page === 1) {
          lists = res.results.lists
        }else {
          lists = this.state.lists.concat(res.results.lists)
        }
        this.setState({
          lists,
          nowPage: res.results.nowPage,
          totalPage: res.results.totalPage
        });
      }
    });
  }

  render() {
    let id = 0;
    let lists = this.state.lists.map(item => {
      id += 1;
      return (
        <div className="sl-item" key={id}>
          <div className="sli-left">
            <div className="slil-top">
              {item.type == 5 ? "【预订】" : "【取消预订】"}
            </div>
            <div className="slil-middle">
              {item.order.team_name + " - " + item.order.room_name}
            </div>
            <div className="slil-bottom">
              {item.create_time}
            </div>
          </div>
          <div className="sli-right">
            <div className="slir-top">成功</div>
            <div className="slir-bottom">
              <span style={{ color: "#FF0000" }}>
                {item.type == 2 ? item.price : "-" + item.price}
              </span>&nbsp;住金
            </div>
          </div>
        </div>
      );
    });
    return (
      <div className="wallet_log_page" onScroll={(e) => { this.handleScorll(e) }}>
        {this.state.fetch ? <div className="tips">加载中....</div> : ""}
        {this.state.fetch === false && this.state.lists.length === 0
          ? <div className="tips">没有数据</div>
          : ""}
        <div className="spend-log">
          {lists}
        </div>
      </div>
    );
  }
}

export default walletLog;
