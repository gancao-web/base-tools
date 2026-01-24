# configResponsive

## 描述

配置响应式断点。

## 示例

```ts
import { configResponsive, useResponsive } from '@base-web-kits/base-tools-react';

configResponsive({
  small: 0,
  middle: 800,
  large: 1200,
});

const App = () => {
  const responsive = useResponsive();
  return (
    <div>
      <p>Responsive: {JSON.stringify(responsive)}</p>
    </div>
  );
};
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/config-responsive)
