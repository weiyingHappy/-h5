import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Tabber from '../components/tabber'
import {fetchChangeNickname} from '@/src/actions/user'
import InputCell from '../components/input-cell'
import Loading from '../components/loading'
import './setting.scss'

class Setting extends Component {

    constructor (props) {
        super(props);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.state = {
            nickname: ''
        }
    }

    componentWillMount() {
        let {user} = this.props;
        this.setState({
            nickname: user.nickname
        })
    }

    handleOk() {
        this.props.dispatch(fetchChangeNickname(this.state.nickname)).then((json)=>{
            browserHistory.goBack();
        });
    }

    handleInputChange(id) {
        let self = this;
        return (e) => {
            if (id == 0) {
                self.setState({
                    nickname: e.target.value
                })
            }
        }
    }
    render() {
        const { dispatch, user } = this.props;

        let input_lists = [{
            title: '昵称',
            place: this.state.nickname||'输入昵称',
            value: this.state.nickname
        }, {
            title: '手机号',
            place: user.phone||'输入手机号',
            value: user.phone,
            disabled: true,
            type: 'tel'
        }];

        return (
            <div className="setting-container">
                <div className="top">
                    <InputCell {...input_lists[0]} handleChange={this.handleInputChange(0)}/>
                    <InputCell {...input_lists[1]} handleChange={this.handleInputChange(1)}/>
                </div>
                <div className="middle">
                    <button className="m-btn" onClick={this.handleOk}>完成</button>
                </div>
                <Loading text="加载中..." isFetching={user.isLoading} />
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
export default connect(select)(Setting)