import sha1 from "sha1";
import moment from "moment";

export function getCookie(c_name, pre = "") {
  c_name = pre + c_name;
  if (document.cookie.length > 0) {
    try {
      var reg = new RegExp("(^|\\s)" + c_name + "=([^;]*)(;|$)");
      let res = document.cookie.match(reg);
      if (res) {
        let ret = decodeURIComponent(res[2]);
        return ret;
      } else {
        return null;
      }
    } catch (e) {
      console.log(e);
    }
  }
  return null;
}

export function jsSdkInit(data, appid, url) {
  console.log("jsSdk", data);
  wx.config({
    debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
    appId: appid,
    timestamp: data.timestamp,
    nonceStr: data.nonceStr,
    signature: sha1(
      "jsapi_ticket=" +
        data.jsapi_ticket +
        "&noncestr=" +
        data.nonceStr +
        "&timestamp=" +
        data.timestamp +
        "&url=" +
        url
    ),
    jsApiList: ["checkJsApi", "openLocation", "getLocation"]
  });
}

export function changeTitle(name) {
  document.title = name;
  //解决document.title 在 ios 下不生效bug方案 ios内生效
  const mobile = navigator.userAgent.toLowerCase();
  const length = document.querySelectorAll("iframe").length;
  if (/iphone|ipad|ipod/.test(mobile) && !length) {
    const iframe = document.createElement("iframe");
    iframe.style.cssText = "display: none; width: 0; height: 0;";
    iframe.setAttribute("src", "about:blank");
    iframe.addEventListener("load", () => {
      setTimeout(() => {
        iframe.removeEventListener("load", false);
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

// 获取浏览器环境
export const getBrowserEnv = () => {
  let env = "production";
  if (window.location.hostname == "www.lianwuyun.cn") {
    env = "test";
  }
  if (window.location.hostname == "localhost") {
    env = "development";
  }

  return env;
};

/**
 * 通过价格计算可能获得积分
 * 注：计算结果可能与实际结果不同
 * @param {number} price 
 */
export const getIntegral = price => {
  return parseInt(Number(price));
};

/**
 * 转换配置文字成样式名
 * @param {string} name 
 */
export const covertEquipmentsToClassName = name => {
  switch (name) {
    case "毛巾":
      return "maojin";
    case "牙刷":
      return "yashua";
    case "医药":
      return "yiyao";
    case "浴缸":
      return "yugang";
    case "洗衣机":
      return "xiyiji";
    case "吹风":
      return "cuifeng";
    case "洗手液":
      return "xishouye";
    case "行李":
      return "xingli";
    case "早餐":
      return "zaocan";
    case "单早":
      return "zaocan";
    case "双早":
      return "zaocan";
    case "淋浴":
      return "linyu";
    case "卫浴":
      return "linyu";
    case "wifi":
      return "wifi";
    case "宽带":
      return "wifi";
    case "沐浴露":
      return "muyulu";
    case "免费停车":
      return "tingche";
    case "付费停车":
      return "tingche";
    case "空调":
      return "kongtiao";
    case "打印机":
      return "dayinji";
    case "叫醒":
      return "jiaoxin";
    case "接送":
      return "jiesong";
    case "餐厅":
      return "canting";
    case "电视":
      return "dianshi";
    case "咖啡":
      return "coffee";
    case "电脑":
      return "diannao";
    case "吧台":
      return "batai";
    case "迷你吧台":
      return "batai";
    case "拖鞋":
      return "tuoxie";
    case "窗户":
      return "chuanghu";
    case "无早":
      return "wuzao";
    default:
      return "";
  }
};

/**
 * 转换日期成·今天、明天、周几·
 * @param {moment} date 
 */
export const covertDate = date => {
  if (moment().isSame(date, "day")) {
    return "今天";
  }
  if (moment().add(1, "day").isSame(date, "day")) {
    return "明天";
  }
  return "周" + ["", "一", "二", "三", "四", "五", "六", "日"][date.day()];
};
