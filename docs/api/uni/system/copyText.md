# copyText

复制文本到剪贴板，支持自定义成功提示

## 示例

```ts
import { copyText } from '@base-web-kits/base-tools-uni';

await copyText('Hello World');
```

## 参数

- `text: string` - 要复制的文本内容
- `toastSuccess?: string` - 复制成功的提示文字，默认为 `'复制成功'`
