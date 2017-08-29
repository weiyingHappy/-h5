import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Loading from '../loading'
import './index.scss'

import CommentItem from '../comment-item'

class ShowComment extends Component {

    constructor (props) {
        super(props);
        this.getCommentsArea = this.getCommentsArea.bind(this);
    }

    componentWillMount() {

    }


    getCommentsLists(storage) {
        let cnt = 0;
        return (storage.comments.lists||[]).map((item) => {
            cnt += 1;
            if (cnt > 3) return ;
            return (
                <div key={cnt} style={{borderTop:'1px solid #DCDCDC'}}>
                    <CommentItem info={item}/>
                </div>
            )
        })
    }

    getCommentsArea(storage) {
        let comments_display = storage.comments.nowPage<=storage.comments.totalPage;
        return (
            <div className="middle-d">
                {this.getCommentsLists(storage)}
            </div>
        )
    }



    render() {
        let {storage} = this.props;
        let comments_area = this.getCommentsArea(storage);

        return (
            <div className="show-comment-container">
                {comments_area}
            </div>
        )
    }
}


function select(state) {
    return {
        storage: state.storage
    }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(ShowComment)