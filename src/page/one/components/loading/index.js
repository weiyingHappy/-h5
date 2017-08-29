import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Loading extends Component {

    render() {
        const {text, isFetching} = this.props;
        return (
            <div id="loadingToast" style={{display: (isFetching?'block':'none')}}>
                <div className="weui-mask_transparent"></div>
                <div className="weui-toast">
                    <i className="weui-loading weui-icon_toast"></i>
                    <p className="weui-toast__content">{text}</p>
                </div>
            </div>
        )
    }
}


export default Loading