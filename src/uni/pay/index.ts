import { promisifyUniApi } from '../index';

/**
 * 微信支付
 * @param option 文档 https://developers.weixin.qq.com/miniprogram/dev/api/payment/wx.requestPayment.html
 * @example
 * await toPayWx(option);
 * href('/pages/order/pay/success/index');
 */
export function toPayWx(option: {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}) {
  return promisifyUniApi(uni.requestPayment, 'requestPayment')(
    { provider: 'wxpay', orderInfo: {}, ...option },
    {
      toastError: (e) => !e.errMsg.includes('cancel'),
    },
  );
}
