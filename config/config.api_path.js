module.exports = {
    api_path: {
        login: '/post_api/login', //登录
        getJsSdk: '/post_api/getJsSdk',
        toPay: '/post_api/toPay',
        uniPayOpenid: '/post_api/uniPayOpenid',
        toRefund: '/post_api/toRefund',
        getQrCode: '/post_api/getQrCode'
    },
    remote_path: {
        isMember: '/CMS/CmsBasic/isMember',
        register: '/CMS/CmsBasic/register',
        sendSMS: '/SMS/sendSMS',
        checkSMS: '/SMS/checkSMS',
        wechatInfo: '/CMS/CmsBasic/wechatInfo',
        hotelInfo: '/FE/Room/rooms',
        hotelInfomation: '/FE/Hotel/hotelInfo', // 真.获取酒店信息
        inventory: '/FE/Room/inventory',
        getComments: '/FE/Evaluation/evaluations',
        orderPrice: '/FE/Order/calcuPrice',
        orderAdd: '/FE/Order/add',
        orderInfo: '/FE/Order/orderInfo',
        getSnap: '/FE/Activity/activities',
        changeNickname: '/CMS/CmsBasic/changeNickname',
        myOrder: '/CMS/CmsBasic/myOrders',
        finishOrder: '/FE/Order/pay',
        unPay: '/FE/Order/unpay',
        orderCancel: '/FE/Order/cancel',
        addComment: '/FE/Evaluation/add',
        accumulate_total: '/FE/UserCenter/getMyPoint',
        coupon_total: '/FE/UserCenter/myCouponCount',
        accumulate_my: '/FE/UserCenter/getPointLogs',
        isUliveMember: '/CMS/CmsBasic/isUliveMember',
        roomPrice: '/FE/Room/roomPrice',
        getTime: '/FE/UserBasic/getSysConfig',
        activityInfo: '/FE/Activity/activityInfo',
        myCoupon: '/FE/Coupon/my',
        usageCoupon: '/FE/Coupon/usageCoupon',
        exchangeCoupon: '/FE/Coupon/exchange',
        daofu: '/CMS/CmsActivity/getCmsDaofuState',
        ordersforluggage: '/FE/OrderExtra/canUseWuyouOrders',
        luggageOrderInfo: '/FE/OrderExtra/wuyouOrderInfo2',
        myAccount: '/FE/UserCenter/getMyAccount',
        goldCusLogs: '/FE/Charge/goldCusLogs',
        roomInfo: '/FE/Room/roomInfo',
        rooms: '/FE/Room/roomDynamics',
        roomLocks: '/FE/Room/room_loced'
    }
};