import fs from 'node:fs';
import path from 'node:path';

const map = {
  ts: ['dist/ts', 'packages/base-tools-ts/dist'],
  web: ['dist/web', 'packages/base-tools-web/dist'],
  uni: ['dist/uni', 'packages/base-tools-uni/dist'],
  react: ['dist/react', 'packages/base-tools-react/dist'],
  vue: ['dist/vue', 'packages/base-tools-vue/dist'],
};

function copyDir(src, dst) {
  fs.rmSync(dst, { recursive: true, force: true });
  fs.mkdirSync(dst, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const sp = path.join(src, ent.name);
    const dp = path.join(dst, ent.name);
    if (ent.isDirectory()) {
      copyDir(sp, dp);
    } else {
      fs.copyFileSync(sp, dp);
    }
  }
}

// 复制UMD文件到子包根目录
function copyUMDFiles() {
  // 复制TS包的UMD文件
  const tsSource = path.join(process.cwd(), 'dist/ts/base-tools-ts.umd.global.js');
  const tsDest = path.join(process.cwd(), 'packages/base-tools-ts/base-tools-ts.umd.global.js');

  if (fs.existsSync(tsSource)) {
    fs.copyFileSync(tsSource, tsDest);
    console.log('Copied TS UMD file to package directory');
  }

  // 复制Web包的UMD文件
  const webSource = path.join(process.cwd(), 'dist/web/base-tools-web.umd.global.js');
  const webDest = path.join(process.cwd(), 'packages/base-tools-web/base-tools-web.umd.global.js');

  if (fs.existsSync(webSource)) {
    fs.copyFileSync(webSource, webDest);
    console.log('Copied Web UMD file to package directory');
  }
}

for (const key of Object.keys(map)) {
  const [src, dst] = map[key];
  copyDir(src, dst);
}

// 复制UMD文件
copyUMDFiles();
