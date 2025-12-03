# tabScrollToCenter

将指定的tab项滚动到滚动容器的中间位置

## 示例

```ts
import { tabScrollToCenter } from '@base-web-kits/base-tools-uni';

const scrollLeft = ref(0);
const activeTab = ref(0);

// 监听tab变化自动滚动到中间
watch(activeTab, () => {
  tabScrollToCenter({
    instance: getCurrentInstance(),
    selectorScroll: '.responsive-tabs',
    selectorTab: `.tab-${activeTab.value}`,
    onScrollLeft: (left) => {
      scrollLeft.value = left;
    },
  });
});
```

## 参数

- `option: object` - 滚动配置：
  - `instance: ComponentInternalInstance | null` - Vue组件实例，通过 `getCurrentInstance()` 获取
  - `selectorScroll: string` - 滚动容器的选择器
  - `selectorTab: string` - 需要滚动到中间的tab项的选择器
  - `onScrollLeft: (left: number) => void` - 滚动完成后的回调函数，接收计算出的滚动位置
