# loadJs

动态加载 JS（重复执行不会重复加载，内部已排重）

## 示例

```ts
import { loadJs } from '@base-web-kits/base-tools-web';

await loadJs('https://xx/xx.js');
await loadJs('/a.js', { defer: true });
```

## 版本

- 1.0.0 新增
