import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'


class Dialog extends Component {

    render() {
        const {isDisplay} = this.props;
        return (
            <div className="js_dialog" style={{display: (isDisplay?'block':'none')}} onClick={this.props.handleClick}>
                <div className="weui-mask"></div>
                <div className="weui-dialog">
                    {this.props.children}
                </div>
            </div>
        )
    }
}


// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default Dialog