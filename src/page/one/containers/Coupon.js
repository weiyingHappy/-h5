import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory, Link } from 'react-router'
import {fetchMyCoupon} from '@/src/actions/coupon'
import CouponItem from '../components/coupon-item'
import Loading from '../components/loading'
import LoadMore from '../components/load-more'

import './coupon.scss'

class Coupon extends Component {

    constructor (props) {
        super(props);

        this.handleScroll = this.handleScroll.bind(this);
    }

    componentWillMount() {
        let {dispatch, coupon} = this.props;
        let info = {
            page: 1
        };
        dispatch(fetchMyCoupon(info));
        window.addEventListener('scroll',this.handleScroll,false);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll',this.handleScroll, false);
    }
    handleScroll() {
        let h1 = document.body.scrollHeight;
        let h2 = window.innerHeight;
        let h3 = document.body.scrollTop;
        const {coupon, dispatch} = this.props;
        let self = this;

        console.log("document: "+h1+"; window: "+h2+" scroll:"+h3+" h2+h3:"+(h2+h3));

        if (h1 <= h2 + h3 && coupon.my.nowPage < coupon.my.totalPage) {
            console.log("加载下一页");
            let info = {
                page: coupon.my.nowPage+1
            };
            dispatch(fetchMyCoupon(info)).then((res)=>{
                console.log('fetch my coupon: ', res);
            })
        }
    }

    handleClick = (coupon) => {
        localStorage.useCoupon = coupon.id
        browserHistory.push('/cmsfont/rooms')
    }

    render() {
        let {coupon} = this.props;
        let myCoupon = coupon.my.lists;

        let lists = myCoupon.map((item) => {
            return (
                <div onClick={()=>{this.handleClick(item)}} key={item.id}>
                    <CouponItem item={item}/>
                </div>
            )
        });

        return coupon.isFetching?(
            <Loading text="加载中..." isFetching={coupon.isFetching} />
        ):(
            <div className="coupon-container">
                <div className="top">
                    <div className="t-left" onClick={()=>{browserHistory.push("/cmsfont/exchangeCoupon")}}>
                        去兑换 >
                    </div>
                    <div className="t-right">
                        <Link to="/cmsfont/coupon_rule">兑换规则</Link>
                    </div>
                </div>
                <div className="list-area">
                    {lists}
                </div>

                <LoadMore nowPage={coupon.my.nowPage} totalPage={coupon.my.totalPage}></LoadMore>
                <div className="bottom">
                    没有更多优惠券，参与活动<span className="b-a" onClick={() => {
                        browserHistory.push('/cmsfont/snap')    
                    }}>获得优惠券 ></span>
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
export default connect(select)(Coupon)