import React from 'react'
import './coupon_rule.scss'

class CouponRule extends React.Component {
    render() {
        return (
            <div className="rule_name">
                <div className="rule">
                    <div className="title">兑换码使用规则</div>
                    <div className="line">
                        1.兑换码是由住那儿旅行发放给用户的，作为兑换住那儿旅行优惠券的凭证，成功兑换后将以优惠券的形式保存至住那儿旅行账户中，优惠券的使用规则详见优惠券规则页面。
                    </div>
                    <div className="line">
                        2.住那儿旅行兑换码是一串数字，汉字的组合。
                    </div>
                    <div className="line">
                        3.住那儿旅行兑换码不可重复兑换，一个兑换码只能兑换一张优惠券，不能重复兑换。
                    </div>
                    <div className="line">
                        4.平台兑换码仅限用于在住那儿旅行平台兑换优惠券时使用，此兑换码严禁倒卖、转让，不可找零、不可兑换为现金，请妥善保管，遗失泄漏等不补。
                    </div>
                    <div className="line">
                        5.住那儿旅行优惠码所兑换成的优惠券会注明“有效期”，该优惠码仅能在注明的有效期内使用。
                    </div>
                    <div className="line">
                        6.用户在使用兑换码兑换优惠券时如网络信号中断也可能会遇到无法正常使用/选择住那儿旅行平台兑换码，请在网络信号稳定的时间和地方再进行订单提交。
                    </div>
                    <div className="line">
                        7.用户可通过关注住那儿旅行微信公众号，参与平台兑换码相关活动并获得平台兑换码。
                    </div>
                    <div className="line">
                        8.活动期间，如果出现违规行为（如作弊领取、恶意套现、刷取信誉、虚假交易等），住那儿旅行将取消用户的活动资格；同时住那儿旅行有权撤销违规交易，其关联账户不得再次预定住那儿旅行商品，必要时住那儿旅行将追究违规用户的法律责任。
                    </div>
                    <div className="line">
                        9.住那儿旅行的优惠码由住那儿旅行发布，并拥有最终解释权，其他相关问题请与住那儿旅行客服联系并反馈。
                    </div>
                </div>
            </div>
        )
    }
}

export default CouponRule