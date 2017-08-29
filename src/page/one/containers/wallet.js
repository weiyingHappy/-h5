import React from 'react'
import request from '@/src/utils/request'
import { Link } from 'react-router'
import config from '@/config/config'
import './wallet.scss'

class Wallet extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            account: 0,
            fetch: false
        }
    }

    componentWillMount() {
        this.setState({
            fetch: true
        })
        request(config.remote_host + config.remote_path.myAccount, undefined, true)
            .then((data) => {
                this.setState({
                    fetch: false
                })
                if (data.code === 200) {
                    this.setState({
                        account: data.results.account
                    })
                }
            })
    }

    render() {
        return (
            <div className="wallet_page">
                <div className="wallet-item" style={{
                    marginBottom: '20px',
                    marginTop: '20px'
                }}>
                    <div className="wi-left">
                        可用余额: <span style={{color: '#FF0000'}}>&nbsp;{
                            this.state.fetch ?
                                <div className="weui-loading"></div> :
                                this.state.account
                        }&nbsp;</span>住金
                    </div>
                </div>

                <div className="wallet-item">
                    <Link to="/cmsfont/wallet_log">
                        <div className="wi-left">
                            消费记录
                        </div>
                        <div className="wi-right arrow-right">
                        </div>
                    </Link>
                </div>
            </div>
        )
    }
}

export default Wallet