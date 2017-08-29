import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import config from '@/config/config'
import Loading from '../components/loading'

import * as helper from '../components/Common'

import './refundProgress.scss'

class RefundProgress extends Component {

    constructor (props) {
        super(props);

        this.state = {
        }
    }

    componentWillMount() {

    }

    render() {
        let {order} = this.props;
        let item = order.pay;
        return (
            <div className="refund-progress-container">
                <div className="sp-top">
                    <div>订单编号: {item.order_no}</div>
                    <div>取消/退款原因：{item.etc}</div>
                    <div>取消/退款进度: {helper.refundOk(item.apply_refund)?'已完成':helper.refundApply(item.apply_refund)?
                        '已申请':'商户拒绝'}</div>
                </div>
                <div className="sp-middle">
                    <div className="spm-a">退款明细</div>
                    <div className="spm-b">在线支付: ￥{item.price}</div>
                    <div className="spm-c">优惠券：无</div>
                    <div className="spm-d">*退款到账需3个工作日</div>
                </div>
                <div className="sp-bottom">
                    <div className="spb-left">
                        <div className="progress-line"></div>
                        <div className={"progress-dot-a"+(helper.refundOk(item.apply_refund)?' pd-highlight':'')}></div>
                        <div className={"progress-dot-b"+((helper.refundOk(item.apply_refund)||helper.refundFail(item.apply_refund))?' pd-highlight':'')}></div>
                        <div className="progress-dot-c pd-highlight"></div>
                    </div>
                    <div className="spb-right">
                        <div className="spbr-a">
                            <div className="spbra-a">受理完成，到账周期</div>
                            <div className="spbra-b">2017-04-05 17:32:00</div>
                        </div>
                        <div className="spbr-b">
                            <div className="spbra-a">{helper.refundFail(item.apply_refund)?'酒店已拒绝退款':'酒店已同意退款'}</div>
                            <div className="spbra-b">2017-04-05 17:32:00</div>
                        </div>
                        <div className="spbr-c">
                            <div className="spbra-a">您的取消已提交</div>
                            <div className="spbra-b">2017-04-05 17:32:00</div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


function select(state) {
    return {
        order: state.order,
        user: state.user,
        storage: state.storage
    }
}
// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(RefundProgress)