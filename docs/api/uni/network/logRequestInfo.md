# logRequestInfo

统一输出请求日志

- 需在入口文件初始化应用配置 `setAppConfig({ log })`
- 确保日志统一走setAppConfig配置的log函数。
- 确保日志格式和request函数一致
- 如果 `config.isLog` 为 `false` 或者未配置 `log` 函数，则不进行日志输出。
- 微信开发工具额外输出JSON字符串，方便快速定义 TS 类型。
- 会对 `res` 进行深拷贝，避免外部修改影响日志输出。

## 示例

```ts
import { logRequestInfo } from '@base-web-kits/base-tools-uni';

logRequestInfo({ url, params, config, res });
```

## 参数

`options` 对象包含以下属性：

- `url: string` - 请求 URL
- `params: RequestParams` - 请求参数
- `config: RequestConfig` - 请求配置
- `res: unknown` - 响应数据
- `isFromCache?: boolean` - 响应数据是否从缓存中获取的

## 版本

- 1.0.2 新增
