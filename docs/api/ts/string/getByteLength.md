# getByteLength

获取字节长度 (支持字符串、Buffer/Uint8Array、File/Blob 等类型)

- 字符串按 UTF-8 编码计算字节长度（每个字符 1-4 字节）
- Buffer/Uint8Array 直接返回字节长度（每个元素 1 字节）
- File/Blob 返回文件/Blob 大小（字节数）

## 示例

```ts
import { getByteLength } from '@base-web-kits/base-tools-ts';
getByteLength('abc'); // 3
getByteLength('中文'); // 6
getByteLength('😊'); // 4
getByteLength(new Uint8Array([0x41, 0x42, 0x43])); // 3
getByteLength(new File(['abc'], 'test.txt')); // 3
getByteLength(new Blob(['中文'], { type: 'text/plain' })); // 6
```

## 版本

- 1.0.0 新增
