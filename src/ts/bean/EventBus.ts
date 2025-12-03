import mitt, { type Emitter, type EventType } from 'mitt';

type Events = Record<EventType, unknown>;

/**
 * 总线式发布订阅
 * @example
 * const emitter = new EventBus(); // 支持链式调用
 * emitter.on('xx', fn); // 订阅事件 xx
 * emitter.once('xx', fn); // 订阅事件 xx 一次
 * emitter.emit('xx', any); // 发布事件 xx，参数任意
 * emitter.off('xx'); // 移除事件 xx 下全部监听
 * emitter.off('xx', fn); // 移除事件 xx 下指定监听
 * emitter.clear(); // 移除所有事件
 *
 * @example 类型约束
 * type T = { a: number; b: string };
 * const emitter = new EventBus<{ xx: T; yy: void }>();
 * const fn = (arg: T) => {}
 * emitter.on('xx', fn);
 * emitter.off('xx', fn);
 * emitter.emit('xx', { a: 123, b: '123' });
 * emitter.emit('yy');
 */
export class EventBus<T extends Events = Events> {
  private readonly _emitter: Emitter<T> = mitt<T>();

  /** 订阅 */
  on<K extends keyof T>(type: K, fn: (event: T[K]) => void): this {
    this._emitter.on(type, fn);
    return this;
  }

  /** 订阅一次 */
  once<K extends keyof T>(type: K, fn: (event: T[K]) => void): this {
    const wrap = (event: T[K]) => {
      this._emitter.off(type, wrap);
      fn(event);
    };
    this._emitter.on(type, wrap);
    return this;
  }

  /** 发布 */
  emit<K extends keyof T>(type: K, event?: T[K]): this {
    this._emitter.emit(type, event as T[K]);
    return this;
  }

  /** 移除 */
  off<K extends keyof T>(type: K, fn?: (event: T[K]) => void): this {
    this._emitter.off(type, fn);
    return this;
  }

  /** 清空 */
  clear(): this {
    this._emitter.all.clear();
    return this;
  }
}
