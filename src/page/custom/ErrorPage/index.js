import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'

class Loading extends Component {

    render() {
        return (
            <div className="notfound-container">
                服务器驾崩啦!!!
            </div>
        )
    }
}


// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default Loading