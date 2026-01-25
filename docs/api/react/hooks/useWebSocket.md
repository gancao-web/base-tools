# useWebSocket

## 描述

用于处理 WebSocket 的 Hook。

## 示例

```ts
import { useWebSocket } from '@base-web-kits/base-tools-react';

const App = () => {
  const { readyState, sendMessage, latestMessage, disconnect, connect } = useWebSocket(
    'wss://echo.websocket.org',
  );

  return (
    <div>
      <button onClick={() => sendMessage('Hello')}>Send</button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={connect}>Connect</button>
      <div>readyState: {readyState}</div>
      <div>latestMessage: {latestMessage?.data}</div>
    </div>
  );
};
```

## 来源

[ahooks](https://ahooks.js.org/zh-CN/hooks/use-web-socket)
