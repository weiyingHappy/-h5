import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './index.scss'
import ImageGallery from 'react-image-gallery'
import 'react-image-gallery/styles/scss/image-gallery.scss'

class Scroll extends Component {

    render() {
        let img_lists = this.props.img_lists.map((item)=>{
            return {
                original: item+'?imageView2/5/w/600/h/320'
            }
        });

        return (
            <div className="scroll-container" style={{height: this.props.height}} onClick={this.props.handleClick}>
                <ImageGallery
                    items={img_lists}
                    slideInterval={2000}
                    showThumbnails={false}
                    showFullscreenButton={false}
                    showPlayButton={false}
                    autoPlay={this.props.autoPlay}
                    showNav={false}
                    showBullets={true}
                    showIndex={false}/>
            </div>
        )
    }
}


// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default Scroll