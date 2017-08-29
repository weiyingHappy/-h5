import React, { Component } from 'react'
import PropTypes from 'prop-types'
import image from './404.png'
import './index.scss'

class Loading extends Component {

    render() {
        return (
            <div className="notfound-container">
                <div className="img">
                    <img src={image} alt=""/>
                </div>
                <div className="text">
                    Sorry，您访问的页面已离开地球~
                </div>
            </div>
        )
    }
}


// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default Loading