import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import './register.scss'

import Loading from '../components/loading'
import Dialog from '../components/dialog'
import {fetchCode, fetchCheckCode, fetchRegister} from '@/src/actions/register'
import {setUser, fetchLogin} from '@/src/actions/user'
import {getCookie} from '../components/Common'

class Register extends Component {

    constructor (props) {
        super(props);

        this.handleSubmit = this.handleSubmit.bind(this);
        this.phoneChange = this.phoneChange.bind(this);
        this.codeChange = this.codeChange.bind(this);
        this.handleGetCode = this.handleGetCode.bind(this);
        this.backTime = this.backTime.bind(this);
        this.handleDialogClick = this.handleDialogClick.bind(this);

        this.state = {
            btn_txt: '获取验证码',
            phone: '',
            code: '',
            isDisplayDialog: false,
            sb_code: 0,
            sb_msg: ''
        }
    }

    componentWillMount() {

    }

    
    handleSubmit(e) {
        e.preventDefault();
        let self = this;
        let phone = this.state.phone;
        let code = this.state.code;

        if(!code) {
            alert('请填写验证码')
            return false
        }

        let info = {
            phone: phone,
            code: code
        };

        this.props.dispatch(fetchCheckCode(info)).then((res_a) => {
            console.log('check over', res_a);

            if (res_a.code == 200) {
                let info_b = {
                    phone: phone,
                    nickname: getCookie('nickname', self.props.teamId),
                    team_id: self.props.teamId,
                    wxid: getCookie('openid', self.props.teamId)
                };

                self.props.dispatch(fetchRegister(info_b)).then((res_b)=>{
                    console.log('submit over', res_b);
                    if (res_b.code == 200) {
                        self.setState({
                            sb_code: res_b.code,
                            sb_msg: '注册成功',
                            isDisplayDialog: true
                        })
                    }
                    else {
                        self.setState({
                            sb_code: res_b.code,
                            sb_msg: res_b.msg,
                            isDisplayDialog: true
                        })
                    }
                });
            }
            else {
                self.setState({
                    sb_code: res_a.code,
                    sb_msg: res_a.msg,
                    isDisplayDialog: true
                })
            }

        });
    }

    phoneChange(e) {
        let val = e.target.value;
        let reg = /^[0-9]*$/;

        if (reg.test(val)) {
            this.setState({
                phone: val
            });
        }
    }

    codeChange(e) {
        let val = e.target.value;
        let reg = /^[0-9]*$/;

        if (reg.test(val)) {
            this.setState({
                code: val
            });
        }
    }

    backTime(cnt) {
        if (cnt == 0) {
            this.setState({
                btn_txt: '获取验证码'
            });
            return ;
        }
        this.setState({
            btn_txt: cnt.toString()+' 秒'
        });
        setTimeout(function() {
            this.backTime(cnt-1)
        }.bind(this),1000);
    }

    handleGetCode(e) {
        let self = this;
        e.preventDefault();
        let phone = this.state.phone;
        let reg = /^1[34578]\d{9}$/;

        if (!reg.test(phone)) {
            alert("手机号不合法");
            return ;
        }

        this.props.dispatch(fetchCode(phone)).then((res)=>{
            console.log("dispatch over: ", res);
            self.backTime(60);
        });
    }

    handleDialogClick() {
        let {user, dispatch} = this.props;
        let self = this;
        this.setState({
            isDisplayDialog: false
        });
        if (this.state.sb_code == 200) {
            if (user.register_back_url.length != 0) {
                dispatch(fetchLogin({token: user.wechatToken, code: user.wechatCode})).then((res)=>{
                    browserHistory.push(self.props.user.register_back_url);
                    dispatch(setUser({register_back_url: ''}));
                });
            }
            else {
                browserHistory.push('/cmsfont/rooms');
            }
        }
    }

    render() {
        const { dispatch, register } = this.props;
        return (
            <div className="register-container">
                <form className="signForm" onSubmit={this.handleSubmit}>
                    <div className="phone-container">
                        <div className="icon-container">
                            手机号:
                        </div>
                        <input type="tel" placeholder="请输入手机号码" value={this.state.phone} className="input-phone" onChange={this.phoneChange}/>
                    </div>
                    <div className="code-container">
                        <div className="icon-container">
                            验证码:
                        </div>
                        <input type="tel" placeholder="输入短信接收到验证码" value={this.state.code} className="input-code" onChange={this.codeChange}/>
                        <button className="get-code" onClick={this.handleGetCode} disabled={(this.state.btn_txt=='获取验证码'?false:true)}
                             style={{color:this.state.btn_txt=='获取验证码'?'#fff':'#fff'}}>{this.state.btn_txt}</button>
                    </div>
                    <button type="submit" className="submitButton">立即验证</button>
                </form>

                <Loading text="loading..." isFetching={register.isFetching} />
                
                <Dialog isDisplay={this.state.isDisplayDialog} handleClick={this.handleDialogClick}>
                    <div className="register-dialog">
                        <span className="img-dialog"></span>
                        <div>
                            {this.state.sb_msg}
                        </div>
                    </div>
                </Dialog>
            </div>
        )
    }
}


function select(state) {
    return {
        register: state.register,
        user: state.user,
        teamId: state.user.teamId
    }
}

// 包装 component ，注入 dispatch 和 state 到其默认的 connect(select)(App) 中；
export default connect(select)(Register)