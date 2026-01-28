import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as ahooks from 'ahooks';

// 读取 ahooks 版本
const require = (await import('module')).createRequire(import.meta.url);
const pkg = require('ahooks/package.json');
const version = pkg.version;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 更新 re-export 文件, 通过git diff 查看差异, 就能知道新增了哪些函数, 从而更新文档
const targetFile1 = path.resolve(__dirname, './docs/ahooks.ts');

const keys = Object.keys(ahooks)
  .filter((key) => key !== 'default' && key !== '__esModule')
  .sort();

const content1 = `/**
 * re-export 全量 ahooks
 * 版本: ${version}
 * 文档: https://ahooks.js.org/zh-CN
 * 目的: 提供hooks能力,收敛依赖版本
 *
 * 注意: 本文件由 scripts/re-export/update-ahooks-exports.ts 生成, 请勿手动修改.
 * 如需更新, 请先升级ahooks, 然后运行: npm run update:ahooks
 */
export {
${keys.map((key) => `  ${key},`).join('\n')}
} from 'ahooks';

// 导出类型
export type * from 'ahooks';
`;

fs.writeFileSync(targetFile1, content1, 'utf-8');
console.log(`Successfully updated ${targetFile1}`);
console.log(`Total exported values: ${keys.length}`);

// 更新源码文件,显示版本号
const targetFile2 = path.resolve(__dirname, '../../src/react/hooks/ahooks.ts');

const content2 = `/**
 * re-export 全量 ahooks
 * 版本: ${version}
 * 文档: https://ahooks.js.org/zh-CN
 * 目的: 提供hooks能力,收敛依赖版本
 *
 * 注意: 本文件由 scripts/re-export/update-ahooks-exports.ts 生成, 请勿手动修改.
 * 如需更新, 请先升级ahooks, 然后运行: npm run update:ahooks
 */
export * from 'ahooks';
`;

fs.writeFileSync(targetFile2, content2, 'utf-8');
console.log(`Successfully updated ${targetFile2}`);
console.log(`Current ahooks version: ${version}`);
