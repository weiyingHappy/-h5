import React, { Component } from 'react'
import './index.scss'

class NavBar extends Component {
  render() {
    return (
      <div className="nav_bar">
        <div className="content">{this.props.children}</div>
        <div className="link_to">
            <div className="text">{this.props.moretext}</div>
            <div className="icon">
                <i className="iconfont icon-right"></i>
            </div>
        </div>
      </div>
    )
  }
}

NavBar.defaultProps = {
    moretext: ''
}

export default NavBar
