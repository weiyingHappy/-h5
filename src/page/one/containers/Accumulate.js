import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { browserHistory } from "react-router";

import { fetchAccumulateMy } from "@/src/actions/user";

import "./accumulate.scss";

class Accumulate extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    let { dispatch, user } = this.props;
    dispatch(fetchAccumulateMy({ page: 1 }))
  }

  handleScorll(e) {
    const { dispatch } = this.props
    const { accumulate_my } = this.props.user

    const el = e.target
    const scrollValue = el.scrollHeight - el.clientHeight - el.scrollTop
    if(scrollValue < 20 && accumulate_my.nowPage < accumulate_my.totalPage && !this.props.user.accumulate_loading) {
      dispatch(fetchAccumulateMy({ page: accumulate_my.nowPage+1 }))
    }
  }

  render() {
    const { dispatch, user } = this.props;
    let lists = user.accumulate_my.lists.map((item, index) => {
      return (
        <div className="m-item" key={'accumulate_' + index}>
          <div className="mi-left">
            <div className="mil-top">消费送积分</div>
            <div className="mil-bottom">
              {item.create_time}
            </div>
          </div>
          <div className="mi-right">
            +{item.point}
          </div>
        </div>
      );
    });

    return (
      <div className="accumulate-container" onScroll={(e) => { this.handleScorll(e) }}>
        <div className="top">
          <span className="icon money" />
          <div className="top-text">
            {user.accumulate_total}
          </div>
        </div>

        <div className="middle">
          {lists.length > 0 ? lists : <p className="nohave">暂无积分记录</p>}
        </div>
      </div>
    );
  }
}

function select(state) {
  return {
    user: state.user
  };
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(Accumulate);
