type EventFn = (...args: unknown[]) => void;

/**
 * 总线式发布订阅
 * @example
 * const em = new EventBus(); // 支持链式调用
 * em.on('xx', fn); // 订阅事件 xx
 * em.once('xx', fn); // 订阅事件 xx 一次
 * em.emit('xx', any); // 发布事件 xx，参数任意
 * em.off('xx'); // 移除事件 xx 下全部监听
 * em.off('xx', fn); // 移除事件 xx 下指定监听
 * em.clear(); // 移除所有事件
 */
export default class EventBus {
  /** 事件池 */
  private _events: Record<string, EventFn[]> = Object.create(null);

  /** 订阅（每次 emit 都触发） */
  on(type: string, fn: EventFn): this {
    if (typeof fn !== 'function') {
      throw new TypeError('listener must be a function');
    }
    (this._events[type] ??= []).push(fn);
    return this;
  }

  /** 订阅一次 */
  once(type: string, fn: EventFn): this {
    if (typeof fn !== 'function') {
      throw new TypeError('listener must be a function');
    }
    const wrap: EventFn = (...args) => {
      this.off(type, wrap); // 先删后执行，确保只跑一次
      fn.apply(this, args);
    };
    return this.on(type, wrap);
  }

  /** 发布事件 */
  emit(type: string, ...args: unknown[]): boolean {
    const listeners = this._events[type];
    if (!listeners?.length) return false;
    // 复制一份，避免中途修改原数组
    listeners.slice().forEach((fn) => fn.apply(this, args));
    return true;
  }

  /** 移除指定监听；若 fn 不传，则移除该事件下全部监听 */
  off(type: string, fn?: EventFn): this {
    if (!fn) {
      delete this._events[type];
      return this;
    }
    const pool = this._events[type];
    if (pool) {
      const idx = pool.indexOf(fn);
      if (idx !== -1) pool.splice(idx, 1);
      if (!pool.length) delete this._events[type];
    }
    return this;
  }

  /** 清空所有事件 */
  clear(): this {
    this._events = Object.create(null);
    return this;
  }

  /** 当前已注册的事件名列表 */
  eventNames(): string[] {
    return Object.keys(this._events);
  }
}
