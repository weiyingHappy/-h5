import React from 'react'

import './index.scss'

export default class NotUliveMember extends React.Component {
    constructor (props) {
        super(props);

    }


    render () {
        let {ticket} = this.props;
        return (
            <div className="not-ulive-member">
                <div className="top">
                    <div className="top-a">
                        半价抢房由住那儿旅行平台提供!
                    </div>
                    <div className="top-b">
                        <div>只睡十小时，为何要花整天的钱？</div>
                        <div>住那儿旅行汇聚全国优质房源，只卖最舒适的房间，</div>
                        <div>让你聪明抢房，开心入住。</div>
                        <div>不是节省，是聪明住酒店。</div>
                    </div>
                </div>

                <div className="middle">
                    <img className="qr-code" src={'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ticket} />
                    <div className="qr-desc">长按识别二维码关注住那儿旅行</div>
                    <div className="qr-bottom">关注后, 点击推送消息, 进入酒店</div>
                </div>
            </div>
        )
    }
}