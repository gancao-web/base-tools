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

const targetFile = path.resolve(__dirname, '../src/react/hooks/ahooks.ts');

const keys = Object.keys(ahooks)
  .filter((key) => key !== 'default' && key !== '__esModule')
  .sort();

const content = `/**
 * re-export 全量 ahooks
 * 版本: ${version}
 * 文档: https://ahooks.js.org/zh-CN
 * 目的: 提供hooks能力,收敛依赖版本
 *
 * 注意: 此文件由 scripts/update-ahooks-exports.ts 生成, 请勿手动修改.
 * 如需更新, 请先升级ahooks, 然后运行: npm run update:ahooks
 */
export {
${keys.map((key) => `  ${key},`).join('\n')}
} from 'ahooks';

// 导出类型
export type * from 'ahooks';
`;

fs.writeFileSync(targetFile, content, 'utf-8');
console.log(`Successfully updated ${targetFile}`);
console.log(`Current ahooks version: ${version}`);
console.log(`Total exported values: ${keys.length}`);
