# tabScrollToCenter
tab滚动到中间

## Example

```ts
import { tabScrollToCenter } from '@base-web-kits/base-tools/uni';
tabScrollToCenter({
instance: getCurrentInstance(),
selectorScroll: '.scroll-view',
selectorTab: `.tab-item${index}`,
onScrollLeft: (left) => {
scrollLeft.value = left; // 滚动到中间的值
},
});
```