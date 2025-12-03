# toast

显示提示消息

## 示例

```ts
import { toast } from '@base-web-kits/base-tools-uni';

await toast('保存成功');
back();
```

## 参数

- `msg: string` - 提示消息内容
- `duration: number` - 提示持续时间（毫秒），默认为 `1000ms`
