import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as vueUse from '@vueuse/core';

// 读取 @vueuse/core 版本
const require = (await import('module')).createRequire(import.meta.url);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');

// @vueuse/core 的 package.json 并不在 export map 中, 因此直接 require 包名可能会失败或解析到错误路径
// 这里退回到仓库根目录下的 node_modules 读取
let pkg;
try {
  pkg = require('@vueuse/core/package.json');
} catch {
  const pkgPath = path.resolve(rootDir, 'node_modules/@vueuse/core/package.json');
  if (fs.existsSync(pkgPath)) {
    pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  } else {
    console.warn('Warning: Could not find @vueuse/core package.json, version will be unknown');
    pkg = { version: 'unknown' };
  }
}
const version = pkg.version;

// 更新 re-export 文件, 通过git diff 查看差异, 就能知道新增了哪些函数, 从而更新文档
const targetFile1 = path.resolve(__dirname, './docs/vueuse.ts');

const keys = Object.keys(vueUse).sort();

const content1 = `/**
 * re-export 全量 vueuse
 * 版本: ${version}
 * 文档: https://vueuse.nodejs.cn/
 * 目的: 提供hooks能力,收敛依赖版本
 * 运行时: @vueuse/core 由子包 dependencies 提供, Vue 由宿主项目通过 peerDependencies 提供
 *
 * 注意: 此文件由 scripts/re-export/update-vueuse-exports.ts 生成, 请勿手动修改.
 * 如需更新, 请先升级@vueuse/core, 然后运行: npm run update:vueuse
 */
export {
${keys.map((key) => `  ${key},`).join('\n')}
} from '@vueuse/core';

// 导出类型
export type * from '@vueuse/core';
`;

fs.writeFileSync(targetFile1, content1, 'utf-8');
console.log(`Successfully updated ${targetFile1}`);
console.log(`Total exported values: ${keys.length}`);

// 更新 re-export 文件, 通过git diff 查看差异, 就能知道新增了哪些函数, 从而更新文档
const targetFile2 = path.resolve(__dirname, '../../src/vue/hooks/index.ts');

const content2 = `/**
 * re-export 全量 vueuse
 * 版本: ${version}
 * 文档: https://vueuse.nodejs.cn/
 * 目的: 提供hooks能力,收敛依赖版本
 * 运行时: @vueuse/core 由子包 dependencies 提供, Vue 由宿主项目通过 peerDependencies 提供
 *
 * 注意: 此文件由 scripts/re-export/update-vueuse-exports.ts 生成, 请勿手动修改.
 * 如需更新, 请先升级@vueuse/core, 然后运行: npm run update:vueuse
 */
export * from '@vueuse/core';
`;

fs.writeFileSync(targetFile2, content2, 'utf-8');
console.log(`Successfully updated ${targetFile2}`);
console.log(`Current @vueuse/core version: ${version}`);
