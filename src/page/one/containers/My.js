import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import {fetchAccumulateTotal, getCouponTotal} from '@/src/actions/user'
import {setUser} from '@/src/actions/user'
import { fetchLogin } from "@/src/actions/user";

import Tabber from '../components/tabber'
import './my.scss'
import ItemCell from '../components/item-cell'

import {getCookie, changeTitle} from '../components/Common'

class My extends Component {

    constructor (props) {
        super(props);
    }

    componentWillMount() {
        let {dispatch, user} = this.props;
        let token = localStorage.token;
        let code = localStorage.code;

        if (!user.isLogin) {
            console.log('获取用户信息')
            // dispatch(setUser({register_back_url: '/cmsfont/my'}));
            // browserHistory.push('/cmsfont/register');
            dispatch(fetchLogin({ token: token, code: code }))
                .then(() => {
                    dispatch(fetchAccumulateTotal()).then((json)=>{
                        console.log(json);
                    })
        
                    dispatch(getCouponTotal())
                })
            return ;
        }
        else {
            dispatch(fetchAccumulateTotal()).then((json)=>{
                console.log(json);
            })

            dispatch(getCouponTotal())
        }

    }


    render() {
        const { dispatch, user } = this.props;
        console.log(user)
        let token = localStorage.getItem('token');
        let item_data = [{
            icon: 'img_order',
            title: '我的订单',
            url: "/cmsfont/myorder"
        }, {
            icon: 'img_setting',
            title: '个人设置',
            url: '/cmsfont/setting'
        }, {
            icon: 'img_accumulate',
            title: (<div>住那儿旅行积分: &nbsp;&nbsp;<span style={{color: '#FF0000'}}>{user.accumulate_loading?(
                <div className="weui-loading"></div>
            ):user.accumulate_total}</span></div>),
            url: '/cmsfont/accumulate'
        }, {
            icon: 'img_coupon',
            title: '我的优惠券',
            num: user.coupon_total+'张',
            url: '/cmsfont/coupon'
        }, {
            icon: 'img_hotel',
            title: '酒店消费商城',
            url: `/cmsfont/entrance/${token}/3`
        }];

        return (
            <div className="my-container">
                <div className="top">
                    <div className="top-b">
                        <div className="tb-a">
                            <img className="tba-img" src={user.avatar}></img>
                        </div>
                        <div className="tb-b">
                            {user.nickname||'用户名'}
                        </div>
                    </div>
                </div>

                <div className="middle">
                    <div className="middle-a">
                        <ItemCell {...item_data[0]}/>
                        <div className="mb-sp"></div>
                        <ItemCell {...item_data[4]} />
                        <div className="mb-sp"></div>
                        <ItemCell
                            icon = {'img_wallet'}
                            title = '我的钱包'
                            url = '/cmsfont/wallet'
                        />
                        <div className="mb-sp"></div>
                        <ItemCell {...item_data[3]} />
                    </div>

                    <div className="middle-c">
                        <ItemCell {...item_data[2]} />
                    </div>

                    <div className="middle-b">
                        <ItemCell {...item_data[1]} />
                    </div>

                </div>



                <Tabber highlight={4} token={user.wechatToken} code={user.wechatCode}/>
            </div>
        )
    }
}


function select(state) {
    return {
        user: state.user
    }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(My)