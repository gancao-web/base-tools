import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esToolkit from 'es-toolkit';

// 读取 es-toolkit 版本
const require = (await import('module')).createRequire(import.meta.url);
const pkg = require('es-toolkit/package.json');
const version = pkg.version;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 更新 re-export 文件, 通过git diff 查看差异, 就能知道新增了哪些函数, 从而更新文档
const targetFile1 = path.resolve(__dirname, './docs/es-toolkit.ts');

const keys = Object.keys(esToolkit).sort();

const content1 = `/**
 * re-export 全量 es-toolkit
 * 版本: ${version}
 * 文档: https://es-toolkit.dev/
 * 目的: 提供常用工具,收敛依赖版本
 *
 * 注意: 此文件由 scripts/re-export/update-es-toolkit-exports.ts 生成, 请勿手动修改.
 * 如需更新, 请先升级es-toolkit, 然后运行: npm run update:es-toolkit
 */
export {
${keys.map((key) => `  ${key},`).join('\n')}
} from 'es-toolkit';

// 导出类型
export type * from 'es-toolkit';
`;

fs.writeFileSync(targetFile1, content1, 'utf-8');
console.log(`Successfully updated ${targetFile1}`);
console.log(`Total exported values: ${keys.length}`);

// 更新源码文件,显示版本号
const targetFile2 = path.resolve(__dirname, '../../src/ts/es-toolkit/index.ts');

const content2 = `/**
 * re-export 全量 es-toolkit
 * 版本: ${version}
 * 文档: https://es-toolkit.dev/
 * 目的: 提供常用工具,收敛依赖版本
 *
 * 注意: 此文件由 scripts/re-export/update-es-toolkit-exports.ts 生成, 请勿手动修改.
 * 如需更新, 请先升级es-toolkit, 然后运行: npm run update:es-toolkit
 */
export * from 'es-toolkit';
`;

fs.writeFileSync(targetFile2, content2, 'utf-8');
console.log(`Successfully updated ${targetFile2}`);
console.log(`Current es-toolkit version: ${version}`);
