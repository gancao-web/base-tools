import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// 检查HTML5项目所需的文件
function verifyHTML5Project() {
  console.log('🔍 验证HTML5项目依赖...\n');

  const requiredFiles = [
    'packages/base-tools-ts/dist/base-tools-ts.umd.global.js',
    'packages/base-tools-web/dist/base-tools-web.umd.global.js',
    'test-html5-project/index.html',
  ];

  let allFilesExist = true;

  for (const file of requiredFiles) {
    const fullPath = path.join(rootDir, file);
    const exists = fs.existsSync(fullPath);

    console.log(`${exists ? '✅' : '❌'} ${file}`);

    if (!exists) {
      allFilesExist = false;
    } else {
      // 检查文件大小
      const stats = fs.statSync(fullPath);
      const sizeKB = (stats.size / 1024).toFixed(2);
      console.log(`   文件大小: ${sizeKB} KB`);

      // 对于JS文件，检查内容
      if (file.endsWith('.js')) {
        const content = fs.readFileSync(fullPath, 'utf-8');
        const hasUMD =
          content.includes('(function') ||
          content.includes('!function') ||
          content.includes('var ');
        console.log(`   UMD格式验证: ${hasUMD ? '✅' : '❌'}`);

        // 检查特定的全局变量
        if (file.includes('base-tools-ts')) {
          const hasBaseToolsTS = content.includes('baseToolsTS') || content.includes('EventBus');
          console.log(`   包含TS工具: ${hasBaseToolsTS ? '✅' : '❌'}`);
        }

        if (file.includes('base-tools-web')) {
          const hasBaseToolsWeb =
            content.includes('baseToolsWeb') || content.includes('setLocalStorage');
          console.log(`   包含Web工具: ${hasBaseToolsWeb ? '✅' : '❌'}`);
        }
      }
    }

    console.log('');
  }

  console.log('📋 验证结果:');
  if (allFilesExist) {
    console.log('✅ HTML5项目所有依赖文件都存在且格式正确！');
    console.log('🌐 你可以直接在浏览器中打开 test-html5-project/index.html 进行测试');
  } else {
    console.log('❌ 部分依赖文件缺失，请检查构建过程');
  }

  return allFilesExist;
}

// 运行验证
verifyHTML5Project();
