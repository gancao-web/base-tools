import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as vueUse from '@vueuse/core';

// 读取 @vueuse/core 版本
const require = (await import('module')).createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @vueuse/core 的 package.json 并不在 export map 中, 因此直接 require 包名可能会失败或解析到错误路径
// 这里尝试直接从 node_modules 读取
let pkg;
try {
  pkg = require('@vueuse/core/package.json');
} catch {
  // 如果 resolve 失败, 尝试相对路径或硬编码路径 (根据项目结构调整)
  // 由于是 dev 脚本, 可以容忍一些假设
  const pkgPath = path.resolve(__dirname, '../node_modules/@vueuse/core/package.json');
  if (fs.existsSync(pkgPath)) {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  } else {
    console.warn('Warning: Could not find @vueuse/core package.json, version will be unknown');
    pkg = { version: 'unknown' };
  }
}
const version = pkg.version;

const targetFile = path.resolve(__dirname, '../src/vue/hooks/index.ts');

const keys = Object.keys(vueUse).sort();

const content = `/**
 * re-export 全量 vueuse
 * 版本: ${version}
 * 文档: https://vueuse.nodejs.cn/
 * 目的: 提供hooks能力,收敛依赖版本
 *
 * 注意: 此文件由 scripts/update-vueuse-exports.ts 生成, 请勿手动修改.
 * 如需更新, 请先升级@vueuse/core, 然后运行: npm run update:vueuse
 */
export {
${keys.map((key) => `  ${key},`).join('\n')}
} from '@vueuse/core';

// 导出类型
export type * from '@vueuse/core';
`;

fs.writeFileSync(targetFile, content, 'utf-8');
console.log(`Successfully updated ${targetFile}`);
console.log(`Current @vueuse/core version: ${version}`);
console.log(`Total exported values: ${keys.length}`);
