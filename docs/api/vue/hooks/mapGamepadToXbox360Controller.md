# mapGamepadToXbox360Controller

## 描述

将 Gamepad 映射到 Xbox 360 控制器。

## 示例

```ts
import { mapGamepadToXbox360Controller, useGamepad } from '@base-web-kits/base-tools-vue';

const { gamepads } = useGamepad();
const xboxController = mapGamepadToXbox360Controller(gamepads.value[0]);
``` 示例代码
```

## 来源

[VueUse](https://vueuse.org/functions/mapGamepadToXbox360Controller/)
