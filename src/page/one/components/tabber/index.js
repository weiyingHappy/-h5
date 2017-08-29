import React from 'react'
import './index.scss'
import {Link} from 'react-router'
import {connect} from 'react-redux'

import {getCookie} from '../Common'
import cn from 'classnames'

class Tabber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        return (
            <div className="tabber">
                <div className="weui-tab">
                    <div className="weui-tab__panel">
                    </div>
                    <div className="weui-tabbar" style={{backgroundColor:'#fff'}}>
                        <Link to="/cmsfont/intro" className="weui-tabbar__item weui-bar__item_on">
                            <span className={cn({
                                'tab_icon': true,
                                'hotel': true,
                                'active': this.props.pathname === '/cmsfont/intro'
                            })}></span>
                            <p className={cn('tab_label', {
                                'active': this.props.pathname === '/cmsfont/intro'
                            })}>酒店介绍</p>
                        </Link>
                        <Link to={"/cmsfont/rooms"}className="weui-tabbar__item">
                            <span className={cn({
                                'tab_icon': true,
                                'order': true,
                                'active': this.props.pathname === '/cmsfont/rooms'
                            })}></span>
                            <p className={cn('tab_label', {
                                'active': this.props.pathname === '/cmsfont/rooms'
                            })}>客房预订</p>
                        </Link>
                        <Link to="/cmsfont/snap" className="weui-tabbar__item">
                            <span className={cn({
                                'tab_icon': true,
                                'gifts': true,
                                'active': this.props.pathname === '/cmsfont/snap'
                            })}></span>
                            <p className={cn('tab_label', {
                                'active': this.props.pathname === '/cmsfont/snap'
                            })}>最新活动</p>
                        </Link>
                        <Link to="/cmsfont/my" className="weui-tabbar__item">
                            <span className={cn({
                                'tab_icon': true,
                                'user': true,
                                'active': this.props.pathname === '/cmsfont/my'
                            })}></span>
                            <p className={cn('tab_label', {
                                'active': this.props.pathname === '/cmsfont/my'
                            })}>账户中心</p>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

module.exports = connect((state) => {
    return {
        pathname: state.routing.locationBeforeTransitions.pathname
    }
})(Tabber);