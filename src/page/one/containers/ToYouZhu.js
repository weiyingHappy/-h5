import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'

import Loading from '../components/loading'
import IsUliveMember from '../components/is-ulive-member'
import NotUliveMember from '../components/not-ulive-member'
import {fetchLogin, fetchIsUliveMember} from '@/src/actions/user'
import {getCookie, changeTitle} from '../components/Common'
import config from '@/config/config.js'

import './toYouZhu.scss'


class ToYouZhu extends Component {

    constructor (props) {
        super(props);
        this.state = {
        }
    }



    componentWillMount() {
        let token = this.props.params.token;
        let code = this.props.location.query.code;
        let self = this;
        const {user, dispatch} = this.props;
        

        if (user.isLogin) {
            let info = {
                phone: user.phone,
                nickname: user.nickname,
                openid: user.openid,
                teamId: user.teamId,
                appid: user.appid,
                appsecret: user.appsecret
            };

            dispatch(fetchIsUliveMember(info));
        }
        else {
            dispatch(fetchLogin({token: token, code: code})).then((res)=>{
                changeTitle(getCookie('wechatName','')||'住那儿旅行');
                if (res.code == 406) {
                    browserHistory.push('/cmsfont/register');
                }
                else if (res.code!=200 && !config.debug) {
                    browserHistory.push('/cmsfont/error');
                }
                else {
                    let info = {
                        phone: (config.debug?'18408249631':res.results.phone),
                        nickname: res.results.nickname,
                        openid: res.results.openid,
                        teamId: res.results.teamid,
                        appid: res.results.appid,
                        appsecret: res.results.appsecret
                    };

                    dispatch(fetchIsUliveMember(info));
                }
            });
        }
    }



    render() {
        let {user} = this.props;
        return user.isFetching?(
            <div className="to-youzhu-container">
                <Loading text="验证中...." isFetching={user.isFetching} />
            </div>
        ):user.isLoading?(
            <div className="to-youzhu-container">
                <Loading text="加载中...." isFetching={user.isLoading} />
            </div>
        ):user.isUliveMember?(
            <div className="to-youzhu-container">
                <IsUliveMember teamId={user.teamId}/>
            </div>
        ):(
            <div className="to-youzhu-container">
                <NotUliveMember ticket={user.qr_ticket}/>
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
export default connect(select)(ToYouZhu)