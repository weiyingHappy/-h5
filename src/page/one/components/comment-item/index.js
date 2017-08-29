import React from 'react'
import cn from 'classnames'
import './index.scss'

export default class CommentItem extends React.Component {
    constructor (props) {
        super (props);
    }

    render () {
        let info = this.props.info;
        return (
            <div className="comment-item">
                <div className="ci-a">
                    <div className="cia-a">{info.user_name} 说</div>
                    <div className="cia-b">
                        {
                            Array(5).fill(0).map((_, index) => {
                                return (
                                    <span key={'start' + index} className={cn({
                                        'comment-star-icon': true,
                                        'fill': index + 1 <= parseInt(info.star),
                                        'blank': index + 1 > parseInt(info.star)
                                    })} />
                                )
                            })
                        }
                        <span className="comment-star-score">{info.star}</span>
                    </div>
                </div>
                <div className="ci-b">
                    {info.comment}
                </div>
                <div className="ci-c">
                    {info.time}
                </div>
            </div>
        )
    }
}
