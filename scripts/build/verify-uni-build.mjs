import fs from 'node:fs';
import path from 'node:path';

const outputs = [
  { format: 'ESM', file: 'dist/uni/index.mjs', externalVue: /from\s+["']vue["']/ },
  { format: 'CJS', file: 'dist/uni/index.cjs', externalVue: /require\(["']vue["']\)/ },
];

const bundledVueMarkers = [
  /node_modules\/(?:\.pnpm\/)?@vue[+/]/,
  /node_modules\/(?:\.pnpm\/)?vue@/,
  /@vue\/compiler-(?:core|dom)/,
];

for (const output of outputs) {
  const filePath = path.resolve(output.file);
  const source = fs.readFileSync(filePath, 'utf8');

  if (!output.externalVue.test(source)) {
    throw new Error(`${output.format} uni 产物没有保留对宿主 Vue 的外部引用: ${output.file}`);
  }

  const bundledMarker = bundledVueMarkers.find((marker) => marker.test(source));
  if (bundledMarker) {
    throw new Error(`${output.format} uni 产物仍包含 Vue 运行时代码: ${output.file}`);
  }
}

console.log('Verified uni build: Vue remains external in ESM and CJS outputs.');
