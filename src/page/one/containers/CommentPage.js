import React, { Component } from "react";
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import cn from 'classnames';
import Stars from "../components/stars";
import CommentItem from "../components/comment_item";
import { fetchComment } from "@/src/actions/comment";
import LoadingPanel from "../components/loading-panel";
import "./CommentPage.scss";

class CommentPage extends Component {
  state = {
    page: 1
  }
  componentWillMount() {
    this.loadData(1)
  }
  componentDidUpdate(nextProps) {
    if(nextProps.query.category !== this.props.query.category) {
      this.loadData(1)
      this.refs['comment_container'].scrollTop = 0
    }
  }
  loadData(page) {
    const { dispatch, query, hotel } = this.props

    let category = 0
    if(query.category) {
      category = Number(query.category)
    }

    this.setState({
      page
    }, () => {
      dispatch(fetchComment(page, category, Number(hotel.intro.id)))
    })
  }

  handleScorll(e) {
    const {comment} = this.props
    const el = e.target
    const scrollValue = el.scrollHeight - el.clientHeight - el.scrollTop
    
    if(scrollValue < 20 && comment.page.nowPage < comment.page.totalPage && !comment.fetch_comments) {
      this.loadData(this.state.page + 1)
    }
  }

  render() {
    const { comment, query, hotel } = this.props

    return (
      <div className="comment_page" ref="comment_container" onScroll={(e) => { this.handleScorll(e) }}>
        <div className="header">
          <div className="score">
            酒店总评
            <span className="score_num">{hotel.intro.star}</span>
            分
            <span style={{ marginLeft: 10 }}>
              <Stars value={Number(hotel.intro.star)} />
            </span>
          </div>
          <div className="tabs">
            <div className={cn("tab_item", {
                "active": query.category === undefined
              })} onClick={() => {
              browserHistory.replace('/cmsfont/comments')
            }}>全部</div>
            <div className={cn("tab_item", {
                "active": query.category === '1'
              })} onClick={() => {
              browserHistory.replace('/cmsfont/comments?category=1')
            }}>好评</div>
            <div className={cn("tab_item", {
                "active": query.category === '2'
              })} onClick={() => {
              browserHistory.replace('/cmsfont/comments?category=2')
            }}>待改善</div>
          </div>
        </div>
        <div className="hack_block" />
        <div className="comments">
          <ul className="comment_list">
            {
              comment.comments.map((item, index) => (
            <li key={'comment_' + index}>
              <CommentItem comment={item} />
            </li>
              ))
            }
          </ul>
        </div>
        
        <LoadingPanel visible={comment.fetch_comments}>房间列表加载中</LoadingPanel>

      </div>
    );
  }
}

export default connect((state) => {
  return {
    hotel: state.hotel,
    comment: state.comment,
    query: state.routing.locationBeforeTransitions.query
  }
})(CommentPage);
