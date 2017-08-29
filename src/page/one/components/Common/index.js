
import sha1 from 'sha1'


export function getCookie(c_name, pre = '')
{
    c_name = pre+c_name;
    if (document.cookie.length>0)
    {
        try {
            var reg = new RegExp("(^|\\s)" + c_name + "=([^;]*)(;|$)");
            let res = document.cookie.match(reg);
            if (res) {
                let ret = decodeURIComponent(res[2]);
                return ret;
            }
            else {
                return null;
            }
        }
        catch(e) {
            console.log(e);
        }
    }
    return null;
}

export function jsSdkInit(data, appid, url) {
    console.log('jsSdk', data, url)
    wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: appid,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: sha1('jsapi_ticket=' + data.jsapi_ticket + '&noncestr=' + data.nonceStr + '&timestamp=' + data.timestamp + '&url='+url),
        jsApiList: [
            'checkJsApi',
            'openLocation',
            'getLocation'
        ]
    });
}

export function changeTitle(name) {
    document.title = name;
//解决document.title 在 ios 下不生效bug方案 ios内生效
    const mobile = navigator.userAgent.toLowerCase();
    const length = document.querySelectorAll('iframe').length;
    if (/iphone|ipad|ipod/.test(mobile) && !length) {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'display: none; width: 0; height: 0;';
        iframe.setAttribute('src', 'about:blank');
        iframe.addEventListener('load', () => {
            setTimeout(() => {
                iframe.removeEventListener('load', false);
                document.body.removeChild(iframe);
            }, 0);
        });
        document.body.appendChild(iframe);
    }
}




export function isCancel(state) {
    return state == 11 || state == 12 || state == 13;
}
export function isFinish(state) {
    return state == 10;
}
export function readyPay(state) {
    return state == 0;
}
export function hasPay(state) {
    return state == 1 || state == 2;
}
export function needRefund(state) {
    return state == 5;
}


export function refundApply(apply_refund) {
    return apply_refund == 1 || apply_refund == 2;
}
export function refundOk(apply_refund) {
    return apply_refund == 5;
}
export function refundFail(apply_refund) {
    return apply_refund == 6;
}