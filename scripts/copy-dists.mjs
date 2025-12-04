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
  if (fs.existsSync(dst)) {
    fs.rmSync(dst, { recursive: true, force: true });
  }

  function copyRecursive(currentSrc, currentDst) {
    if (!fs.existsSync(currentSrc)) return;

    const entries = fs.readdirSync(currentSrc, { withFileTypes: true });
    for (const ent of entries) {
      const sp = path.join(currentSrc, ent.name);
      const dp = path.join(currentDst, ent.name);

      if (ent.isDirectory()) {
        copyRecursive(sp, dp);
      } else {
        fs.mkdirSync(currentDst, { recursive: true });
        fs.copyFileSync(sp, dp);
      }
    }
  }

  copyRecursive(src, dst);
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

// 复制README.md到各个包目录
function copyReadmeToPackages() {
  const rootReadmePath = path.join(process.cwd(), 'README.md');

  if (!fs.existsSync(rootReadmePath)) {
    console.log('Root README.md not found, skipping copy');
    return;
  }

  const packageDirs = [
    'packages/base-tools-ts',
    'packages/base-tools-web',
    'packages/base-tools-uni',
    'packages/base-tools-react',
    'packages/base-tools-vue',
  ];

  packageDirs.forEach((packageDir) => {
    const packagePath = path.join(process.cwd(), packageDir);
    const destReadmePath = path.join(packagePath, 'README.md');

    if (fs.existsSync(packagePath)) {
      fs.copyFileSync(rootReadmePath, destReadmePath);
      console.log(`Copied README.md to ${packageDir}`);
    } else {
      console.log(`Package directory ${packageDir} not found, skipping`);
    }
  });
}

// 复制源码文件到各个包目录
function copySourceFiles() {
  const sourceMap = {
    ts: ['src/ts', 'packages/base-tools-ts/src/ts'],
    web: ['src/web', 'packages/base-tools-web/src/web'],
    uni: ['src/uni', 'packages/base-tools-uni/src/uni'],
    react: ['src/react', 'packages/base-tools-react/src/react'],
    vue: ['src/vue', 'packages/base-tools-vue/src/vue'],
  };

  for (const key of Object.keys(sourceMap)) {
    const [src, dst] = sourceMap[key];
    copyDir(src, dst);
    console.log(`Copied source files for ${key}`);
  }
}

// 修复Source Map路径
function fixSourceMaps() {
  const distDirs = [
    'packages/base-tools-ts/dist',
    'packages/base-tools-web/dist',
    'packages/base-tools-uni/dist',
    'packages/base-tools-react/dist',
    'packages/base-tools-vue/dist',
  ];

  function processDir(currentDir) {
    const files = fs.readdirSync(currentDir);
    files.forEach((file) => {
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        processDir(fullPath);
      } else if (file.endsWith('.map')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        // 将 ../../src 替换为 ../src (减少一层层级，适用于 js.map 和 d.ts.map)
        const newContent = content.replace(/\.\.\/\.\.\/src/g, '../src');
        fs.writeFileSync(fullPath, newContent);
        console.log(`Fixed sourcemap: ${file}`);
      }
    });
  }

  distDirs.forEach((distDir) => {
    const fullPath = path.join(process.cwd(), distDir);
    if (fs.existsSync(fullPath)) {
      processDir(fullPath);
    }
  });
}

for (const key of Object.keys(map)) {
  const [src, dst] = map[key];
  copyDir(src, dst);
}

// 复制UMD文件
copyUMDFiles();

// 复制README.md到各个包目录
copyReadmeToPackages();

// 复制源码
copySourceFiles();

// 修复Source Map
fixSourceMaps();
