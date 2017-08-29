import React from 'react'
import './paySuccess.scss'
import successImg from '../images/three/icon-6.png'
import luggageImg from '../images/three/icon-luggage.png'
import { browserHistory, Link } from 'react-router'

class paySuccess extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            wuyou: true
        }
    }

    render() {
        return (
            <div className="success_page">
                <div className="success">
                    <img src={successImg} alt=""/>
                    <p>支付成功</p>
                </div>

                <div className="more-service" style={{display: this.state.wuyou?'block':'none'}}>
                    <div className="ms-top">
                        更多服务
                    </div>
                    <div className="ms-bottom">
                        <Link className="tnb-item" to="/cmsfont/luggage">
                            <img src={luggageImg} alt="" className="weui-tabbar__icon tnb-img" />
                            <p>无忧行李</p>
                        </Link>
                        <div className="description">
                            <Link to="/cmsfont/luggage">
                                <p>假期轻松玩，你的行李我来管</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default paySuccess