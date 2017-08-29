import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.scss'

class CommentItem extends Component {
  render() {
    const { comment } = this.props

    const getReply = () => {
        if(comment.child) {
            return (
                <div className="reply_content">
                    <span className="reply_user">[店长回复]：</span>
                    {comment.child.comment}
                </div>
            )
        }
    }

    return (
      <div className="comment_component">
          <div className="head">
            <div className="user_info">
                {/* <div className="head_img">
                    <img src="" alt=""/>
                </div> */}
                <div className="user_name">{comment.user_name}</div>
            </div>

            <div className="score">
                {comment.star}分
            </div>
          </div>

          <div className="content">
              <div className="comment_content">{comment.comment}</div>
              {getReply()}
          </div>

          <div className="footer">
              <div className="date">{comment.create_time}</div>
              <div className="like"></div>
          </div>
      </div>
    )
  }
}

CommentItem.propTypes = {
    comment: PropTypes.object.isRequired
}

export default CommentItem
