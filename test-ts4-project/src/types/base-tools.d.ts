// TypeScript 4 兼容性声明文件

declare module '@base-web-kits/base-tools-ts' {
  export function createRandId(prefix?: string): string;
  export function createUUID(): string;
  export function createTimeRandId(digits?: number): string;
}

declare module '@base-web-kits/base-tools-web' {
  export function setLocalStorage(key: string, value: unknown, days?: number): void;
  export function getLocalStorage<T = unknown>(key: string): T | null;
  export function removeLocalStorage(key: string): void;
}