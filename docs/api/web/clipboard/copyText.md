# copyText
复制文本到剪贴板（兼容移动端和PC）

## Example

```ts
import { copyText } from '@base-web-kits/base-tools/web';

// 基础用法
await copyText('hello world');

// 复制成功后显示提示
try {
  await copyText('复制的内容');
  console.log('复制成功');
} catch (error) {
  console.error('复制失败:', error);
}
```