import React, { Component } from 'react'
import { connect } from 'react-redux'
import request from '@/src/utils/request'
import config from '@/config/config.js'
import { browserHistory } from 'react-router'
import './LuggageOrderInfo.scss'

class LuggageOrdersInfo extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            showorder: undefined,
            showcancel: false,
        }
    }
    
    componentWillMount() {
        request(`${config.remote_host}/FE/OrderExtra/wuyouOrderInfo/${this.props.params.id}`, {
            method: 'GET'
        }, true).then((data) => {
            if (data.code === 200) {
                this.setState({
                    showorder: data.results
                })
            }
        })
    }

    toggaleCancelModal () {
        this.setState({
            ...this.state,
            showcancel: !this.state.showcancel
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


    filterPaytype (type) {
        if (type == 0) {
            return '微信支付'
        }
        return '支付宝支付'
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

    cancelModal (showorder) {
        if (this.state.showcancel) {
            return (
                <div className="cancelmodal" onClick={this.toggaleCancelModal.bind(this)}>
                    <div className="modalpanel" onClick={(e)=>{e.stopPropagation()}}>
                        <div className="mpaneltitle">
                            取消订单
                        </div>
                        <div className="content">
                            <div className="mline">
                                <span className="mtitle">起点：</span>
                                <span className="mtext">{showorder.desc.start_address}</span>
                            </div>
                            <div className="mline">
                                <span className="mtitle">终点：</span>
                                <span className="mtext">{showorder.desc.end_address}</span>
                            </div>
                            <div className="mline">
                                <span className="mtitle">行李总数：</span>
                                <span className="mtext">{showorder.desc.num}</span>
                            </div>
                            <div className="wmsg">您的取消申请将发送至客服，确认取消后我们的客服 将第一时间和您核对情况</div>
                        </div>
                        <div className="btns">
                            <button onClick={this.toggaleCancelModal.bind(this)}>点错了</button>
                            <button className="primary" onClick={this.cancelOrder.bind(this)}>确认取消</button>
                        </div>
                    </div>
                </div> 
            )
        }
    }
    
    cancelOrder () {
        request(`${config.remote_host}/FE/OrderExtra/cancelWuyouOrder/${this.state.showorder.id}`, 
            {
                method: 'GET'
            },
            true
        )
            .then((res) => {
                if(res.code === 200) {
                    this.setState({
                        ...this.state,
                        showcancel: false
                    })
                    browserHistory.goBack()
                    setTimeout(()=>{location.reload()}, 10)
                }
            })
    }

    render () {
        const {showorder} = this.state
        if (!showorder) {
            return <div>查询订单中</div>
        }
        return (
            <div className="luggageorder_info">
                <div className="page">
                    <div className="order">
                        {
                            showorder.extra.state != 7?
                            <div className="cancelorder">
                                <span onClick={this.toggaleCancelModal.bind(this)}>取消订单>></span>
                            </div>:''
                        }
                        
                        <div className="address panel">
                            <div className="start">
                                <span className="btitle">起</span>
                                <span className="title">{showorder.desc.start_address}</span>
                            </div>
                            <div className="end">
                                <span className="btitle">终</span>
                                <span className="title">{showorder.desc.end_address}</span>                                
                            </div>
                        </div>  
                        <div className="info panel">
                            <div className="infostate">
                                {
                                    this.filterOrderState(showorder.extra.state)
                                }
                            </div>
                            <div className="line">联系人：{showorder.user_name}</div>
                            <div className="line">联系电话：{showorder.phone}</div>
                            <div className="line">行李数量：{showorder.desc.num}</div>
                            <div className="line">费用：<span className="money">{showorder.price}元</span>{this.filterPaytype(showorder.pay_type)}</div>
                            <div className="line">订单编号：{showorder.inner_order}</div>
                            <div className="line">下单时间：{showorder.create_time}</div>
                            <div className="line">到达时间：{showorder.desc.end_time}</div>
                        </div>  
                        <div className="flow panel">
                            {this.filterFlowuser(showorder)}
                            <div className="flowline">
                                <ul>
                                    <li className="end">
                                        <div className="msg">{showorder.extra.end_address}</div>
                                        <div className="time">{showorder.extra.end_time} 到达</div>
                                    </li>
                                    {
                                        showorder.extra.flow.map((value, index)=>{
                                            return (
                                                <li className={index===0?'active':''} key={index}>
                                                    <div className="msg">{value.event}</div>
                                                    <div className="time">{value.time}</div>
                                                </li>
                                            )
                                        })
                                    }
                                </ul>
                            </div>
                        </div>
                    </div>   
                    {this.cancelModal(showorder)}           
                </div>
            </div>
        )
    }
}

export default connect()(LuggageOrdersInfo)