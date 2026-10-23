/** 一次计时的结果，时间戳与耗时的单位均为毫秒。 */
export type TimerResult = {
  /** 开始时的 Unix 毫秒时间戳。 */
  startMs: number;
  /** 结束时的 Unix 毫秒时间戳。 */
  endMs: number;
  /** 耗时（毫秒），优先使用单调时钟，不保证等于 endMs - startMs。 */
  durationMs: number;
};

export type Timer = {
  /** 开始时的 Unix 毫秒时间戳。 */
  startMs: number;
  /** 停止计时；重复调用返回第一次结束时的同一份结果。 */
  end(): TimerResult;
};

/**
 * 创建并启动计时器。
 * 时间戳使用系统时间，耗时优先使用全局 performance.now()，不可用时回退到系统时间。
 * 使用单调时钟的意义：系统时间被手动修改或自动校准时，耗时不会随之跳变。
 * @example
 * const timer = startTimer();
 * await doSomething();
 * const { startMs, endMs, durationMs } = timer.end();
 */
export function startTimer(): Timer {
  const startMs = Date.now();
  let now = Date.now;
  let start = startMs;
  try {
    const clock = typeof performance !== 'undefined' ? performance : undefined;
    if (typeof clock?.now === 'function') {
      const value = clock.now();
      if (Number.isFinite(value)) {
        now = () => clock.now();
        start = value;
      }
    }
  } catch {
    // 宿主时钟不可用时使用系统时间。
  }

  let result: TimerResult | undefined;
  return {
    startMs,
    end() {
      if (!result) {
        const endMs = Date.now();
        let durationMs = Math.max(0, endMs - startMs);
        try {
          const elapsed = now() - start;
          if (Number.isFinite(elapsed)) durationMs = Math.max(0, elapsed);
        } catch {
          // 宿主时钟后续不可用时回退到系统时间之差。
        }
        result = { startMs, endMs, durationMs };
      }
      return result;
    },
  };
}
