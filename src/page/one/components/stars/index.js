import React, { Component } from 'react'
import cn from 'classnames'
import PropTypes from 'prop-types'
import './style.scss'

class Stars extends Component {
  render() {
    const { value } = this.props
    return (
      <span className="stars_component">
        {new Array(5).fill(0).map((_, index) =>
            <i
                key={"start_" + index}
                className={cn("iconfont", {
                    "icon-star": index + 1 <= parseInt(value),
                    "icon-start-blank":
                    index + 1 > parseInt(value)
                })}
            />
        )}
      </span>
    )
  }
}

Stars.propTypes = {
    value: PropTypes.number.isRequired
}

export default Stars
