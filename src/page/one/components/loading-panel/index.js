import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './style.scss'

class LoadingPanel extends Component {
  render() {
    if(!this.props.visible) {
      return <div></div>
    }
    return (
      <div className="loading_panel">
          <div className="icon">
              <div className="loading_animation"></div>
          </div>
          <div className="text">
              {this.props.children}
          </div>
      </div>
    )
  }
}

LoadingPanel.propTypes = {
    visible: PropTypes.bool.isRequired
}

export default LoadingPanel
