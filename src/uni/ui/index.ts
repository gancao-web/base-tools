import { promisifyUniApi } from '../index';
import type { ComponentInternalInstance } from 'vue';

/**
 * 提示
 * @param msg 提示内容
 * @param duration 提示持续时间,默认1000ms
 * @returns 提示完成后的Promise
 * @example
 * await toast('保存成功');
 * back(); // 小程序的toast是页面级的,而非全局;若toast不await,直接back,则toast会看不见
 */
export function toast(msg: string, duration = 1000) {
  return new Promise<void>((resolve) => {
    if (!msg) return resolve();

    uni.showToast({ icon: 'none', title: msg, duration });

    setTimeout(() => resolve(), duration);
  });
}

/**
 * 模态框
 * @param option 模态框参数
 * @returns Promise<void>
 * @example
 * await showModal({ content: '确定要删除吗？' });
 */
export async function showModal(option: UniApp.ShowModalOptions) {
  const res = await promisifyUniApi(uni.showModal)(option);
  if (res.confirm) return;
  throw res;
}

/**
 * tab滚动到中间
 * @param option 参数
 * @param option.instance vue实例, 取getCurrentInstance()
 * @param option.selectorScroll 滚动视图选择器
 * @param option.selectorTab 当前tab选择器
 * @param option.onScrollLeft 滚动回调
 * @example
 * tabScrollToCenter({
 *   instance: getCurrentInstance(),
 *   selectorScroll: '.scroll-view',
 *   selectorTab: `.tab-item${index}`,
 *   onScrollLeft: (left) => {
 *     scrollLeft.value = left; // 滚动到中间的值
 *   },
 * });
 */
export function tabScrollToCenter(option: {
  instance: ComponentInternalInstance | null;
  selectorScroll: string;
  selectorTab: string;
  onScrollLeft: (left: number) => void;
}) {
  const scrollView = uni.createSelectorQuery().in(option.instance).select(option.selectorScroll);

  scrollView
    .fields({ size: true, rect: true, scrollOffset: true }, (resScroll) => {
      const domSroll = Array.isArray(resScroll) ? resScroll[0] : resScroll;
      if (!domSroll) {
        console.error(`${option.selectorScroll} is not exist`);
        return;
      }

      const { left = 0, scrollLeft = 0, width = 0 } = domSroll;

      const domOffset = scrollLeft - left - width / 2;

      const tab = uni.createSelectorQuery().in(option.instance).select(option.selectorTab);

      tab
        .boundingClientRect((resTab) => {
          const domTab = Array.isArray(resTab) ? resTab[0] : resTab;
          if (!domTab) {
            console.error(`${option.selectorTab} is not exist`);
            return;
          }
          const { left = 0, width = 0 } = domTab;
          const scrollLeft = left + width / 2 + domOffset;

          option.onScrollLeft(scrollLeft);
        })
        .exec();
    })
    .exec();
}
