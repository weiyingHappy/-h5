import React from 'react'
import './index.scss'
import '../../scss/facilities.scss'
import cn from 'classnames'
import { covertEquipmentsToClassName } from '@/src/common'

export default class OrderGenerate extends React.Component {
    constructor (props) {
        super(props);

        this.state = {

        }
    }


    render() {
        let {lists} = this.props;

        let id = 0;
        let dis = lists.map((item)=>{
            id += 1;
            
            return (
                <div className="equ-item" key={id}>
                    <span className={cn('facilities_icon', covertEquipmentsToClassName(item))}></span>
                    <div className="ei-text">{item}</div>
                </div>
            )
        });
        return (
            <div className="equ-area">
                {dis}
            </div>
        )
    }
}