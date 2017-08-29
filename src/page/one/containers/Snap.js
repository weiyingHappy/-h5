import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import {fetchSnap, setSrc} from '@/src/actions/snap'
import config from '@/config/config'
import {setUser} from '@/src/actions/user'
import {fetchLogin} from '@/src/actions/user'
import Loading from '../components/loading'
import Tabber from '../components/tabber'
import {getCookie} from '../components/Common'
import cookie from 'react-cookie';
import './snap.scss'


class Snap extends Component {

    constructor (props) {
        super(props);
        this.handleSnapClick = this.handleSnapClick.bind(this);
        this.state = {
            sessionToken: (config.mid==config.development?config.admin_token:getCookie('Session-Token'))
        }
    }

    componentWillMount() {
        let {snap, user, dispatch} = this.props;

        if (user.isLogin) {
            dispatch(fetchSnap(user.teamId||cookie.load('team_id')))
        } else {
            dispatch(fetchLogin({token: user.wechatToken})).then((res)=>{
                if (res.code == 406) {
                    dispatch(setUser({register_back_url: '/cmsfont/snap'}));
                    browserHistory.push('/cmsfont/register');
                }
                else if (res.code!=200 && !config.debug) {
                    browserHistory.push('/cmsfont/error');
                }
                else {
                    dispatch(fetchSnap(user.teamId||cookie.load('team_id'))).then((res)=>{
                        console.log('snap res: ', res);
                    })
                }
            });
        }

        console.log(getCookie('Session-Token'))
    }

    handleSnapClick(src) {
        let self = this;
        return () => {
            // self.props.dispatch(setSrc(src));
            // browserHistory.push('/cmsfont/iframe');
            window.location.href = src;
        }
    }

    render() {
        let {snap, user} = this.props;

        let id = 0;
        let lists = snap.lists.map((item) => {
            id+=1;
            if (item.type == 0) {
                return (
                    <div className="activity_item" key={id} onClick={this.handleSnapClick(config.api_host+'/activity/'+item.id+'?token='+this.state.sessionToken)}>
                        <img src={item.desc.cover+'?imageView2/5/w/200/h/120'} className="ai-img"/>
                        <p>
                            {item.name}
                        </p>
                    </div>
                )
            } else {
                return (
                    <div className="activity_item" key={id} onClick={this.handleSnapClick(item.desc.url)}>
                        <img src={item.desc.cover+'?imageView2/5/w/200/h/120'} className="ai-img"/>
                        <p>
                            {item.name}
                        </p>
                    </div>
                )
            }
        });
        return snap.loading?(
            <Loading text="加载中..." isFetching={snap.loading} />
        ):(
            <div className="snap-container">
                {
                    lists.length>0?
                        lists:
                        <p className="nohave">没有活动</p>
                }

                <div style={{height:'100px'}}></div>
                <Tabber highlight={4} token={user.wechatToken} code={user.wechatCode}/>
            </div>
        )
    }
}


function select(state) {
    return {
        snap: state.snap,
        user: state.user
    }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(Snap)