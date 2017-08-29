import React from 'react'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import './chooseOrderForLuggage.scss'
import {
    fetchOrdersForLuggage,
    chooseOrderForLuggage
} from '@/src/actions/luggage'
import icon30 from '../images/five/icon-30.png'

let getTimeDiff = function (time1, time2)
{
    var startTime = new Date(Date.parse(time2.replace(/-/g,   "/"))).getTime();
    var endTime = new Date(Date.parse(time1.replace(/-/g,   "/"))).getTime();
    var dates = Math.abs((startTime - endTime))/(1000*60*60*24);
    return  dates;
};
const OrderItem = ({item}) => {
    return (
        <div className="wuyou-order-item">
            <div className="woi-a">{item.team_name} - {(item.type=='0'?'普通订单':item.type=='1'?'抢房订单':item.type==2?'门店订单':'到店支付订单')}</div>
            <div className="woi-b">房型: {item.room_name}</div>
            <div className="woi-c">入离时间: {item.start} 至 {item.end} (共{getTimeDiff(item.start, item.end)}晚)</div>
        </div>
    )
};

class ChooseOrderForLuggage extends React.Component {
    constructor (props) {
        super (props);

        this.state = {
        }
    }

    componentWillMount() {
        const { dispatch } = this.props
        dispatch(fetchOrdersForLuggage(1))
    }

    handleOkWuyouOrder(id) {
        const { dispatch } = this.props
        dispatch(chooseOrderForLuggage(id))
        browserHistory.goBack()
    }

    render() {
        let {wuyouOrder = [],isChoosing} = this.props;
        let id = -1;
        
        let lists = wuyouOrder.map((item) => {
            id += 1;
           return (
               <div className="wo-container" key={id} onClick={()=>{ this.handleOkWuyouOrder(id) }}>
                   <OrderItem item={item} />
                   <img style={{display: (id==isChoosing?'block':'none')}} className="wo-choosing" src={icon30}></img>
               </div>
           )
        });

        return (
            <div className="choose-wuyou-order">
                {lists}
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        wuyouOrder: state.luggage.useorders,
        isChoosing: state.luggage.chooseorder
    }
}

export default connect(mapStateToProps)(ChooseOrderForLuggage)