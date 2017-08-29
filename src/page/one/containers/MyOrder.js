import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import moment from 'moment'
import pingpp from 'pingpp-js'

import config from '@/config/config'
import Loading from '../components/loading'
import OrderPiece from '../components/order-piece'
import OrderNav from '../components/order-nav'
import {getCookie, changeTitle} from '../components/Common'
import LoaderMore from '../components/load-more'

import {fetchLogin} from '@/src/actions/user'
import {fetchOrderInfo, fetchToCancel, fetchToUnPay, fetchMyOrder, fetchToRefund, STATE_ALL, STATE_ALREADY, STATE_FINISH, STATE_NO, setState,setPay, popOrder} from '@/src/actions/order'

import './myOrder.scss'


class MyOrder extends Component {

    constructor (props) {
        super(props);

        this.toRefund = this.toRefund.bind(this);
        this.changeCat = this.changeCat.bind(this);
        this.toCancel = this.toCancel.bind(this);
        this.toPay = this.toPay.bind(this);
        this.toShowOrder = this.toShowOrder.bind(this);
        this.toComment = this.toComment.bind(this);
        this.getInfo = this.getInfo.bind(this);
        this.handleScroll = this.handleScroll.bind(this);

        this.state = {
        }
    }

    getInfo() {
        const {dispatch, user, order} = this.props;
        let info = {
            state: order.cat,
            page: 1,
            team_id: user.teamId
        };
        dispatch(fetchMyOrder(info)).then((res)=>{
            console.log('fetch my order: ', res);
        })
    }

    componentWillMount() {
        const {dispatch, user, order} = this.props;

        let token = localStorage.token;
        let code = localStorage.code;

        let self = this;
        if (!this.props.user.isLogin) {
            this.props.dispatch(fetchLogin({token: token, code: code})).then((res)=>{
                console.log('dispatch res: ', res);
                changeTitle(getCookie('wechatName','')||'住那儿旅行');

                if (res.code == 406) {
                    browserHistory.push('/cmsfont/register');
                }
                else if (res.code!=200 && config.mid==config.production) {
                    browserHistory.push('/cmsfont/error');
                }
                else {
                    self.getInfo();
                }
            });
        }
        else {
            self.getInfo();
        }
        window.addEventListener('scroll',self.handleScroll,false);

    }
    componentWillUnmount() {
        window.removeEventListener('scroll',this.handleScroll, false);
    }
    handleScroll() {
        let h1 = document.body.scrollHeight;
        let h2 = window.innerHeight;
        let h3 = document.body.scrollTop;
        const {user, order, dispatch} = this.props;
        let nowOrder = order.con[order.cat];
        let self = this;

        console.log("document: "+h1+"; window: "+h2+" scroll:"+h3+" h2+h3:"+(h2+h3));

        if (h1 <= h2 + h3 && nowOrder.nowPage < nowOrder.totalPage) {
            console.log("加载下一页");
            let info = {
                state: order.cat,
                page: nowOrder.nowPage+1,
                team_id: user.teamId
            };
            dispatch(fetchMyOrder(info)).then((res)=>{
                console.log('fetch my order: ', res);
            })
        }
    }
    changeCat(cat) {
        let {dispatch, user} = this.props;
        return () => {
            dispatch(setState({cat: cat}));

            let info = {
                state: cat,
                page: 1,
                team_id: user.teamId
            };
            dispatch(fetchMyOrder(info)).then((res)=>{
                console.log('fetch my order: ', res);
            })
        }
    }

    toRefund(id) {
        let self = this;
        return () => {
            console.log("退订: ", id);

            let {order, dispatch} = this.props, self = this;
            let item = order.con[order.cat].lists[id];
            console.log('item: ', item);

            let info = {
                order_no: item.order_no
            };
            dispatch(fetchToCancel(info)).then((res)=>{
                if (res.code == 200) {
                    alert("取消订单成功");

                    dispatch(popOrder({
                        cat: order.cat,
                        id: id
                    }));
                }
                else {
                    alert(res.msg);
                }
            });
        }
    }
    toCancel(id) {
        return () => {
            let {order, dispatch} = this.props, self = this;
            let item = order.con[order.cat].lists[id];
            let info = {
                order_no: item.order_no
            };
            dispatch(fetchToCancel(info)).then((res)=>{
                if (res.code == 200) {
                    alert("已申请退款");

                    dispatch(popOrder({
                        cat: order.cat,
                        id: id
                    }));
                }
                else {
                    alert(res.msg);
                }
            });
        }
    }
    toShowOrder(id) {
        return () => {
            let {order, dispatch} = this.props, self = this;
            let item = order.con[order.cat].lists[id];
            // dispatch(setPay({order_no: item.order_no}));
            browserHistory.push('/cmsfont/showOrder/'+item.order_no);
        }
    }
    toComment(id) {
        return () => {
            let {order, dispatch} = this.props, self = this;
            let item = order.con[order.cat].lists[id];
            dispatch(setPay({order_no: item.order_no}));
            browserHistory.push('/cmsfont/commentOrder');
        }
    }
    toPay(id) {
        return () => {
            let {order, dispatch} = this.props, self = this;
            let item = order.con[order.cat].lists[id];
            dispatch(setPay({order_no: item.order_no}));
            browserHistory.push('/cmsfont/payPage');
        }
    }

    render() {
        let {order, user} = this.props;
        let nowOrder = order.con[order.cat];
        return user.isFetching?(
            <div className="index-container">
                <Loading text="验证中..." isFetching={user.isFetching} />
            </div>
        ) : order.con_loading?(
            <Loading text="加载中..." isFetching={order.con_loading} />
        ):(
            <div className="my-order-container">
                <OrderNav cat={order.cat} changeCat={this.changeCat} />
                <OrderPiece toRefund={this.toRefund} orders={nowOrder.lists||[]}
                        toCancel={this.toCancel} toShowOrder={this.toShowOrder} toComment={this.toComment} toPay={this.toPay}/>

                <Loading text="退款中..." isFetching={order.pay.refund_loading} />
                <Loading text="取消订单中..." isFetching={order.pay.unpay_loading} />

                <LoaderMore nowPage={nowOrder.nowPage} totalPage={nowOrder.totalPage}>没有更多了</LoaderMore>
            </div>
        )
    }
}


function select(state) {
    return {
        order: state.order,
        user: state.user
    }
}
// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(MyOrder)