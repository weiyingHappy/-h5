/**
 * 无忧行李订单
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import './LuggageOrders.scss'
import config from '@/config/config.js'
import InfiniteScroll from 'react-infinite-scroller'
import request from '@/src/utils/request'
import { browserHistory } from 'react-router'

class LuggageOrders extends React.Component {
    constructor () {
        super()
        this.state = {
            orders: [],
            page: 1,
            showinfo: false,
            showorder: undefined,
            hasmore: false,
            fetch: false
        }
    }

    getCookie (c_name) {
        if (document.cookie.length>0)
        {
            try {
                var reg = new RegExp("(^|\\s)" + c_name + "=([^;]*)(;|$)");
                let res = document.cookie.match(reg);
                if (res) {
                    return res[2];
                }
                else {
                    return null;
                }
            }
            catch(e) {
                console.log(e);
            }
        }
        return ""
    }

    componentWillMount() {
        /*$.ajax({
            url: `${config.api_host}/FE/OrderExtra/wuoyouOrders/${this.state.page++}`,
            method: 'GET',
            dataType: 'JSON',
            beforeSend: (request) => request.setRequestHeader("Session-Token", this.getCookie('token')||config.admin_token),
            success: (res) => {
                if (res.code === 200) {
                    this.setState(Object.assign(this.state, {
                        orders: res.results.lists
                    }))
                }
                if (res.results.nowPage<res.results.totalPage) {
                    this.setState({
                        ...this.state,
                        hasmore: true
                    })
                } else {
                    this.setState({
                        ...this.state,
                        hasmore: false
                    })
                }
            }
        })*/
        this.setState({
            fetch: true
        })
        request(`${config.remote_host}/FE/OrderExtra/wuoyouOrders/${this.state.page++}`, {
            method: 'GET'
        }, true).then((res) => {
            this.setState({
                fetch: false
            })
            if (res.code === 200) {
                this.setState(Object.assign(this.state, {
                    orders: res.results.lists
                }))
            }
            if (res.results.nowPage<res.results.totalPage) {
                this.setState({
                    ...this.state,
                    hasmore: true
                })
            } else {
                this.setState({
                    ...this.state,
                    hasmore: false
                })
            }
        })
    }

    filterOrderState (state) {
        
        let text = '未知'
        let className = 'gray_bg'

        switch (state) {
            case 0:
                text = '未支付'
                className = "red_bg"
                break
            case 1:
                text = '确认中'
                className = "green_bg"
                break
            case 2:
                text = '派单中'
                className = "green_bg"
                break
            case 3:
                text = '已接单'
                className = "blue_bg"
                break
            case 4:
                text = '运送中'
                className = "blue_bg"
                break
            case 5:
                text = '已到达'
                className = "blue_bg"
                break
            case 6:
                text = '已完成'
                className = "orange_bg"
                break
            case 7:
                text = '已取消'
                className = "gray_bg"
                break
        }

        return (
            <div className={'state '+className}>{text}</div>
        )
    }

    handleOrderItemClick (value) {
        // location.href = 'luggage_orderinfo?id='+value.id;
        browserHistory.push('/cmsfont/luggageOrderInfo/'+value.id)
    }


    filterFlowuser (showorder) {
        if (showorder.extra.state===3||showorder.extra.state===4||showorder.extra.state===5) {
            return (
                <div>
                    <div className="flowuser">配送人员：{showorder.extra.user_name}</div>
                    <div className="flowuser flowphone">联系电话：{showorder.extra.phone}</div>
                </div>
            )
        }
    }

    loadMore () {
        if (!this.state.hasmore) {
            return
        }

        request(`${config.remote_host}/FE/OrderExtra/wuoyouOrders/${this.state.page++}`, {
            method: 'GET'
        }, true).then((res) => {
            if (res.code === 200) {
                this.setState(Object.assign(this.state, {
                    orders: this.state.orders.concat(res.results.lists)
                }))
            }
            if (res.results.nowPage<res.results.totalPage) {
                this.setState({
                    ...this.state,
                    hasmore: true
                })
            } else {
                this.setState({
                    ...this.state,
                    hasmore: false
                })
            }
            console.log(this.state)
        })
    }

    render () {

        const { orders } = this.state
        
        if (orders.length===0) {
            return (
                <div className="page">
                    <div className="none">
                        {
                            this.state.fetch ?
                                '订单获取中' :
                                '暂无无忧行李订单'
                        }
                    </div>
                    <div className="footer">
                        {/*联系客服：400-123-1234*/}
                    </div>
                </div>
            )
        }

        return (
            <div className="page luggage_orders">
                <InfiniteScroll pageStart={1} loadMore={this.loadMore.bind(this)} hasMore={this.state.hasmore} useWindow={false}>
                    <ul className="orders">
                        {
                            orders.map((value, key)=>{
                                return (
                                    <li className="item" key={key} onClick={()=>{this.handleOrderItemClick(value)}}>
                                        <div className="content">
                                            <div className="title">{value.desc.start_address}</div>
                                            <div className="title">—{value.desc.end_address}</div>
                                            <div className="graytext">行李数：{value.desc.num}件</div>
                                            <div className="graytext">时间：{value.desc.end_time} 到达</div>
                                            {
                                                this.filterOrderState(value.extra.state)
                                            }
                                        </div>
                                    </li>
                                )
                            })
                        }
                    </ul>
                    <div className="footer">
                        {/*联系客服：400-123-1234*/}
                    </div>
                </InfiniteScroll>
            </div>
        )
    }
}

export default connect()(LuggageOrders)