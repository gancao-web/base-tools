/**
 * 获取窗口宽度（不含滚动条）
 * @returns 窗口宽度
 */
export function getWindowWidth() {
  return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

/**
 * 获取窗口高度（不含滚动条）
 * @returns 窗口高度
 */
export function getWindowHeight() {
  return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}

/**
 * 获取文档垂直滚动位置
 * @example
 * const top = getWindowScrollTop();
 */
export function getWindowScrollTop() {
  const doc = document.documentElement;
  const body = document.body;
  return window.pageYOffset || doc.scrollTop || body.scrollTop || 0;
}

/**
 * 获取文档水平滚动位置
 * @example
 * const left = getWindowScrollLeft();
 */
export function getWindowScrollLeft() {
  const doc = document.documentElement;
  const body = document.body;
  return window.pageXOffset || doc.scrollLeft || body.scrollLeft || 0;
}

/**
 * 平滑滚动到指定位置
 * @param top 目标纵向滚动位置
 * @param behavior 滚动行为，默认 'smooth'
 * @example
 * windowScrollTo(0);
 */
export function windowScrollTo(top: number, behavior: ScrollBehavior = 'smooth') {
  if ('scrollBehavior' in document.documentElement.style) {
    window.scrollTo({ top, behavior });
  } else {
    window.scrollTo(0, top);
  }
}

/**
 * 元素是否在视口内（可设置阈值）
 * @param el 目标元素
 * @param offset 额外判定偏移（像素，正数放宽，负数收紧）
 * @returns 是否在视口内
 */
export function isInViewport(el: Element, offset = 0) {
  const rect = el.getBoundingClientRect();
  const width = getWindowWidth();
  const height = getWindowHeight();
  return (
    rect.bottom >= -offset &&
    rect.right >= -offset &&
    rect.top <= height + offset &&
    rect.left <= width + offset
  );
}

/**
 * 锁定页面滚动（移动端/PC）
 * 使用 `body{ position: fixed }` 技术消除滚动条抖动，记录并恢复滚动位置。
 * @example
 * lockBodyScroll();
 */
export function lockBodyScroll() {
  const body = document.body;
  if (body.dataset.scrollLock === 'true') return;
  const y = Math.round(window.scrollY || window.pageYOffset || 0);
  body.dataset.scrollLock = 'true';
  body.dataset.scrollLockY = String(y);
  body.style.position = 'fixed';
  body.style.top = `-${y}px`;
  body.style.left = '0';
  body.style.right = '0';
  body.style.width = '100%';
}

/**
 * 解除页面滚动锁定，恢复原始滚动位置
 * @example
 * unlockBodyScroll();
 */
export function unlockBodyScroll() {
  const body = document.body;
  if (body.dataset.scrollLock !== 'true') return;
  const y = Number(body.dataset.scrollLockY || 0);
  body.style.position = '';
  body.style.top = '';
  body.style.left = '';
  body.style.right = '';
  body.style.width = '';
  delete body.dataset.scrollLock;
  delete body.dataset.scrollLockY;
  window.scrollTo(0, y);
}
