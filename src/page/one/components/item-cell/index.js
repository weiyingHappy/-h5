import React from 'react'
import { browserHistory } from 'react-router'
import cn from 'classnames'
import './index.scss'

class ItemCell extends React.Component {
    constructor (props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
        this.state = {

        };
    }

    handleClick() {
        browserHistory.push(this.props.url);
    }

    render() {

        return (
            <div className="item-cell" onClick={this.handleClick}>
                <div className="ic-a">
                    <span className={
                        cn('nav-icon', this.props.icon)
                    } />
                    <div className="ica-b">
                        {this.props.title}
                        {
                            this.props.num?
                            <span>: &nbsp;&nbsp;<span style={{color: 'red'}}>{this.props.num}</span></span>:
                            ''
                        }
                    </div>
                </div>
                <div className="ic-b"></div>
            </div>
        )
    }
}

module.exports = ItemCell;