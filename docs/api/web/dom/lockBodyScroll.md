# lockBodyScroll

锁定页面滚动（移动端/PC）

## 示例

```ts
import { lockBodyScroll, unlockBodyScroll } from '@base-web-kits/base-tools-web';

// 显示弹窗时锁定滚动
function showModal() {
  lockBodyScroll();
  // 显示弹窗逻辑
}

// 关闭弹窗时解锁滚动
function hideModal() {
  unlockBodyScroll();
  // 隐藏弹窗逻辑
}

// 使用示例
const openButton = document.querySelector('#openModal');
const closeButton = document.querySelector('#closeModal');

openButton?.addEventListener('click', showModal);
closeButton?.addEventListener('click', hideModal);
```

## 版本

- 1.0.0 新增
