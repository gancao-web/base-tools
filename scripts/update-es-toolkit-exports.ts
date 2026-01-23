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

const targetFile = path.resolve(__dirname, '../src/ts/es-toolkit/index.ts');

const keys = Object.keys(esToolkit).sort();

const content = `/**
 * re-export 全量 es-toolkit
 * 版本: ${version}
 * 文档: https://es-toolkit.dev/
 * 目的: 提供常用工具,收敛依赖版本
 *
 * NOTE: 此文件由 scripts/update-es-toolkit-exports.ts 生成
 * 请勿手动修改，如需更新请运行: npm run update:es-toolkit
 */
export {
${keys.map((key) => `  ${key},`).join('\n')}
} from 'es-toolkit';

// 导出类型
export type * from 'es-toolkit';
`;

fs.writeFileSync(targetFile, content, 'utf-8');
console.log(`Successfully updated ${targetFile}`);
console.log(`Current es-toolkit version: ${version}`);
console.log(`Total exported values: ${keys.length}`);
