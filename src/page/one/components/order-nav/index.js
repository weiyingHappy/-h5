import React from 'react'
import moment from 'moment'
import './index.scss'

import {STATE_ALL, STATE_ALREADY, STATE_FINISH, STATE_NO, STATE_REFUND} from '@/src/actions/order'
class OrderNav extends React.Component {
    constructor (props) {
        super(props);

        this.state = {

        }
    }

    render() {
        let {cat, changeCat} = this.props;
        return (
            <div className="order-nav">
                <div className={"nav-cell nav-first"+(cat==STATE_ALL?" nav-cell-highlight":"")} onClick={changeCat(STATE_ALL)}>全部</div>

                <div className={"nav-cell"+(cat==STATE_NO?" nav-cell-highlight":"")} onClick={changeCat(STATE_NO)}>未支付</div>

                <div className={"nav-cell"+(cat==STATE_ALREADY?" nav-cell-highlight":"")} onClick={changeCat(STATE_ALREADY)}>已支付</div>

                <div className={"nav-cell"+(cat==STATE_FINISH?" nav-cell-highlight":"")} onClick={changeCat(STATE_FINISH)}>已完成</div>

                <div className={"nav-cell nav-refund"+(cat==STATE_REFUND?" nav-cell-highlight":"")} onClick={changeCat(STATE_REFUND)}>申请退款</div>
            </div>
        )
    }
}

module.exports = OrderNav;