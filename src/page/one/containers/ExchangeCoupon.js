import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Loading from '../components/loading'
import LoadMore from '../components/load-more'
import i19 from '../images/three/icon-19.png'
import i20 from '../images/three/icon-20.png'
import close from '../images/three/close.png'
import {getCookie} from '../components/Common'
import {exchangeCoupon} from '@/src/actions/coupon'

import './exchangeCoupon.scss'


const CouponItem = ({item,type}) => {
    return item.type==0?(
        <div className={"coupon-item-red "}>
            <div className="ci-left">
                <div className="cil-a">{item.coupon_type==0?('无门槛'+item.desc.discount+'元优惠券'):item.coupon_type==1?('折扣券'):('满'+item.desc.limit+'减'+item.desc.discount+'券')}</div>
                <div className="cil-b"></div> 
                <div className="cil-c">所有酒店通用, {item.coupon_type==1?('最多抵扣 '+item.desc.max_discount+' 元'):''}</div>
            </div>
            <div className="ci-right">
                <div className="cir-a">{item.coupon_type==1?(item.desc.discount+' 折'):('￥'+item.desc.discount)}</div>
                <div className="cir-b">{item.end} 前有效</div>
            </div>
        </div>
    ):(
        <div className={"coupon-item-blue "}>
            <div className="ci-left">
                <div className="cil-a">{item.coupon_type==0?('无门槛'+item.desc.discount+'元优惠券'):item.coupon_type==1?('折扣券'):('满'+item.desc.limit+'减'+item.desc.discount+'券')}</div>
                <div className="cil-b"></div>
                <div className="cil-c">{item.team_name}适用</div>
            </div>
            <div className="ci-right">
                <div className="cir-a">{item.coupon_type==1?(item.desc.discount+' 折'):('￥'+item.desc.discount)}</div>
                <div className="cir-b">{item.end} 前有效</div>
            </div>
        </div>
    )
};


class ExchangeCoupon extends Component {

    constructor (props) {
        super(props);

        this.exchange = this.exchange.bind(this);

        this.state = {
            code: '',
            tanchu_display: 'none',
            coupon: {
                "id": "",
                "type": "",
                "disabled": "",
                "team_id": "",
                "title": "",
                "start": "",
                "coupon_type": "",
                "end": "",
                "desc": {}
            }
        }
    }

    componentWillMount() {

    }

    exchange() {
        let {dispatch} = this.props, self = this;
        dispatch(exchangeCoupon({code: self.state.code})).then((res) => {
            if (res.code == 200) {
                self.setState({
                    coupon: res.results,
                    tanchu_display: 'block'
                })
            }
            else {
                alert(res.msg);
            }
        })
    }

    render() {

        return (
            <div className="exchange-coupon-container">
                <div className="top" onClick={() => {
                    browserHistory.push('/cmsfont/coupon_rule')    
                }}>
                    兑换规则
                </div>
                <div className="middle">
                    <input type="text" className="m-a" value={this.state.code} placeholder="请输入兑换码" onChange={(e)=>{this.setState({code:e.target.value})}}/>
                    <button className="m-b" onClick={this.exchange} disabled={this.state.code.length==0} style={{backgroundColor: this.state.code.length>0?'#456DF2':'#DDDDDD'}}>兑换</button>
                </div>
                <div style={{display:this.state.tanchu_display}} className="tanchu-container">
                    <div className="weui-mask"></div>
                    <div className="close">
                        <img src={close} alt="" onClick={()=>{this.setState({tanchu_display:'none'})}}/>
                    </div>
                    <div className="tanchu weui-dialog">
                        <img src={i20} className="tanchu-a" />
                        <div className="tanchu-c">
                            <CouponItem item={this.state.coupon}/>
                        </div>
                        <img src={i19} className="tanchu-b"/>

                        <div className="tanchu-d"  onClick={()=>{browserHistory.push('/cmsfont/rooms/'+(getCookie('wechatToken', ''))+"?code="+(getCookie('wechatCode','')))}}>去使用</div>

                    </div>
                </div>
            </div>
        )
    }
}


function select(state) {
    return {
        coupon: state.coupon
    }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(ExchangeCoupon)