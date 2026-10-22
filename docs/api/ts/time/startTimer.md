# startTimer

创建并启动一次性计时器，返回开始时间、结束时间和耗时。适用于请求、任务及其他异步操作的耗时测量。

## 示例

```ts
import { startTimer } from '@base-web-kits/base-tools-ts';

const timer = startTimer();

try {
  await doSomething();
} finally {
  const { startMs, endMs, durationMs } = timer.end();
  console.log({ startMs, endMs, durationMs });
}
```

## API

```ts
type TimerResult = {
  startMs: number;
  endMs: number;
  durationMs: number;
};

type Timer = {
  startMs: number;
  end(): TimerResult;
};

function startTimer(): Timer;
```

无参数。`Timer`、`TimerResult` 可以从同一包入口作为类型导入。

| 字段／方法 | 说明 |
| --- | --- |
| `timer.startMs` | 创建计时器时的 Unix 毫秒时间戳 |
| `timer.end()` | 停止计时，返回 `TimerResult`；重复调用返回首次结束时的同一个结果对象 |
| `result.startMs` | 开始时的 Unix 毫秒时间戳 |
| `result.endMs` | 首次调用 `end()` 时的 Unix 毫秒时间戳 |
| `result.durationMs` | 耗时，单位毫秒，可含小数，最小为 `0` |

## 时钟与边界

- 时间戳使用 `Date.now()`；耗时优先使用全局 `performance.now()`，开始时不可用、抛错或返回非有限值时，回退到系统时间。
- 结束时单调时钟抛错或返回非有限值，也会回退到系统时间戳之差，并将负耗时截为 `0`。
- 系统时间可能被校准，因此 `durationMs` 不保证等于 `endMs - startMs`，`endMs` 也不保证大于等于 `startMs`。使用 `durationMs` 统计耗时，使用时间戳展示日期。
- 只读取 `timer.startMs` 不会停止计时；第一次调用 `end()` 后，结束时间和耗时固定。不要修改复用的结果对象。
- 该函数不格式化日期、不输出日志、不管理超时或取消。测量范围由调用位置决定，也包含范围内的等待和调度时间。

## 延迟读取示例

将计时结果作为其他操作的附加字段时，可以在字段被读取时才结束计时：

```ts
const timer = startTimer();
const extra = {
  get elapsedMs() {
    return timer.end().durationMs;
  },
  get completedAtMs() {
    return timer.end().endMs;
  },
};

await doSomething();
console.log({ ...extra }); // 此时触发 getter，两次 end() 复用同一份结果
```

展开对象、`Object.assign` 或 JSON 序列化都会读取可枚举 getter；需要延迟计算时，避免提前读取这些属性。

## 版本

- 1.7.0 新增
