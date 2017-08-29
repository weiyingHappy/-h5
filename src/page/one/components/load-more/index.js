import React from 'react'

import './index.scss'

export default class LoadMore extends React.Component {
    constructor (props) {
        super(props);

    }


    render () {
        let dt = this.props.nowPage>=this.props.totalPage?(
            <div className="my-load-bottom weui-loadmore_line">
                <span className="weui-loadmore__tips" style={{backgroundColor:'#F2F2F2'}}>{this.props.children}</span>
            </div>
        ):(
            <div className="my-load-more">
                <i className="weui-loading"></i>
                <span className="weui-loadmore__tips">正在加载</span>
            </div>
        );
        return (
            <div className="load-more">
                {dt}
            </div>
        )
    }
}