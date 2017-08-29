import React from 'react'
import './index.scss'

class InputCell extends React.Component {
    constructor (props) {
        super(props);

        this.state = {

        };
    }

    render() {

        return (
            <div className="input-cell">
                <div className="ic-header">
                    {this.props.title}
                </div>
                <div className="ic-body">
                    <input placeholder={this.props.place} type={this.props.type} value={this.props.value} disabled={this.props.disabled} onChange={this.props.handleChange}/>
                </div>
            </div>
        )
    }
}

module.exports = InputCell;