import { getBaseToolsConfig, promisifyUniApi } from '../index';

/**
 * 打开另一个小程序
 * @example
 * await navigateToMiniProgram({ appId: 'wx1234567890' });
 */
export function navigateToMiniProgram(option: UniApp.NavigateToMiniProgramOptions) {
  return promisifyUniApi(uni.navigateToMiniProgram, 'navigateToMiniProgram')(option);
}

/**
 * 打开公众号主页
 * @example
 * await openOfficialAccountProfile({ username });
 */
export function openOfficialAccountProfile(option: UniApp.OpenOfficialAccountProfileOption) {
  return promisifyUniApi(uni.openOfficialAccountProfile, 'openOfficialAccountProfile')(option);
}

/**
 * 打开公众号文章
 * @example
 * await openOfficialAccountArticle({ url });
 */
export function openOfficialAccountArticle(option: UniApp.OpenOfficialAccountArticleOption) {
  return promisifyUniApi(uni.openOfficialAccountArticle, 'openOfficialAccountArticle')(option);
}

/**
 * 获取用户的当前设置
 * @example
 * const setting = await getSetting();
 */
export function getSetting(options?: UniApp.GetSettingOptions) {
  return promisifyUniApi(uni.getSetting, 'getSetting')(options);
}

/**
 * 消息订阅
 * @example
 * await requestSubscribeMessage(['xxxid']);
 */
export async function requestSubscribeMessage(ids: string | string[]) {
  if (!ids || !ids.length) {
    throw new Error('requestSubscribeMessage ids is empty');
  }

  const tmplIds = typeof ids === 'string' ? ids.split(',') : ids;

  const res = await promisifyUniApi(
    uni.requestSubscribeMessage,
    'requestSubscribeMessage',
  )({ tmplIds });
  const result = JSON.stringify(res);
  if (result.includes('accept')) {
    return result;
  } else {
    throw new Error('requestSubscribeMessage reject');
  }
}

/**
 * 判断权限是否开启 (若没有,则引导用户开启权限)
 * - 文档: https://uniapp.dcloud.net.cn/api/other/authorize.html#authorize
 * @param scope 权限范围
 * @param content 提示内容
 * @param option 用户拒绝授权后,引导弹窗的配置参数 (可设置弹窗的标题、按钮文字等)
 * @example
 * await authorize('scope.writePhotosAlbum', "请开启'添加到相册'的权限");
 * await authorize('scope.writePhotosAlbum', "请开启'添加到相册'的权限", { title: '提示', confirmText: '去开启' });
 */
export async function authorize(
  scope: keyof UniApp.GetSettingSuccessResult['authSetting'],
  content: string,
  option?: Omit<UniApp.ShowModalOptions, 'content'>,
) {
  const { log } = getBaseToolsConfig();

  const setting = await getSetting();

  // 已开启权限
  if (setting.authSetting[scope]) return;

  // 引导开启权限 (只是引导,无法知道用户最终是否同意授权,需再次调用authorize才知道)
  uni.authorize({
    scope,
    fail(e) {
      // 用户拒绝授权后，短期内调用uni.authorize不会再出现授权弹窗，而是直接进入这里的fail, 此时需自行showModal提醒
      log?.('info', {
        name: 'authorize',
        status: 'fail',
        desc: 'showModal openSetting..',
        option: { scope },
        e,
      });
      uni.showModal({
        ...option,
        content,
        success: (res) => {
          log?.('info', {
            name: 'authorize.openSetting',
            status: res.confirm ? 'success' : 'fail',
            option: { scope },
          });
          if (res.confirm) uni.openSetting();
        },
      });
    },
  });

  // 未开启权限, 触发失败回调 (用户未授权,已引导用户开启权限)
  throw new Error('User not authorized, guided to enable permission');
}
