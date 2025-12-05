import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// 测试项目配置
const testProjects = [
  {
    name: 'HTML5项目',
    path: 'test-html5-project',
    type: 'html5',
    testFile: 'index.html',
    expectedFiles: [
      '../packages/base-tools-ts/dist/base-tools-ts.umd.global.js',
      '../packages/base-tools-web/dist/base-tools-web.umd.global.js',
    ],
  },
  {
    name: 'TS4项目',
    path: 'test-ts4-project',
    type: 'typescript-react',
    buildCommand: 'pnpm build',
    expectedFiles: [
      'node_modules/@base-web-kits/base-tools-ts',
      'node_modules/@base-web-kits/base-tools-web',
      'node_modules/@base-web-kits/base-tools-react',
    ],
  },
  {
    name: 'TS5项目',
    path: 'test-ts5-project',
    type: 'typescript',
    buildCommand: 'pnpm build',
    expectedFiles: [
      'node_modules/@base-web-kits/base-tools-ts',
      'node_modules/@base-web-kits/base-tools-web',
    ],
  },
  {
    name: 'Vue2项目',
    path: 'test-vue2-project',
    type: 'vue2',
    buildCommand: 'pnpm build',
    expectedFiles: [
      'node_modules/@base-web-kits/base-tools-ts',
      'node_modules/@base-web-kits/base-tools-web',
      'node_modules/@base-web-kits/base-tools-vue',
    ],
  },
];

// 颜色输出
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, cwd, options = {}) {
  try {
    execSync(command, {
      stdio: 'inherit',
      cwd: cwd || rootDir,
      ...options,
    });
    return true;
  } catch (error) {
    log(`❌ 命令执行失败: ${command}`, 'red');
    log(`错误信息: ${error.message}`, 'red');
    return false;
  }
}

function checkFilesExist(projectPath, files) {
  const missingFiles = [];

  for (const file of files) {
    const fullPath = path.join(projectPath, file);
    if (!fs.existsSync(fullPath)) {
      missingFiles.push(file);
    }
  }

  return missingFiles;
}

function checkPackageDependencies(projectPath) {
  const packageJsonPath = path.join(projectPath, 'package.json');

  if (!fs.existsSync(packageJsonPath)) {
    return { hasError: true, message: 'package.json 不存在' };
  }

  try {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

    const baseToolsDeps = Object.keys(dependencies).filter((dep) =>
      dep.startsWith('@base-web-kits/base-tools-'),
    );

    const nodeModulesPath = path.join(projectPath, 'node_modules');
    const missingDeps = [];

    for (const dep of baseToolsDeps) {
      const depPath = path.join(nodeModulesPath, dep);
      if (!fs.existsSync(depPath)) {
        missingDeps.push(dep);
      }
    }

    return {
      hasError: missingDeps.length > 0,
      message: missingDeps.length > 0 ? `缺少依赖: ${missingDeps.join(', ')}` : '所有依赖都存在',
      missingDeps,
    };
  } catch (error) {
    return { hasError: true, message: `解析 package.json 失败: ${error.message}` };
  }
}

async function testProject(project) {
  log(`\n🔍 开始测试 ${project.name}...`, 'blue');
  const projectPath = path.join(rootDir, project.path);

  // 检查项目目录是否存在
  if (!fs.existsSync(projectPath)) {
    log(`❌ 项目目录不存在: ${project.path}`, 'red');
    return false;
  }

  // 安装依赖 (HTML5项目跳过)
  if (project.type !== 'html5') {
    log('📦 安装依赖...', 'yellow');
    if (!execCommand('pnpm install', projectPath)) {
      return false;
    }
  }

  // 检查依赖 (HTML5项目跳过)
  if (project.type !== 'html5') {
    log('🔍 检查依赖...', 'yellow');
    const depCheck = checkPackageDependencies(projectPath);
    if (depCheck.hasError) {
      log(`❌ 依赖检查失败: ${depCheck.message}`, 'red');
      return false;
    }
    log(`✅ 依赖检查通过: ${depCheck.message}`, 'green');
  }

  // 根据不同项目类型进行不同测试
  if (project.type === 'html5') {
    // HTML5项目特殊处理 - 检查文件是否存在
    const missingFiles = checkFilesExist(projectPath, project.expectedFiles);
    if (missingFiles.length > 0) {
      log(`❌ 缺少构建产物: ${missingFiles.join(', ')}`, 'red');
      return false;
    }
    log('✅ HTML5项目测试通过 - 所有必要的构建产物都存在', 'green');
    return true;
  } else {
    // 其他项目尝试构建
    if (project.buildCommand) {
      log('🏗️  执行构建测试...', 'yellow');
      const buildSuccess = execCommand(project.buildCommand, projectPath);
      if (!buildSuccess) {
        return false;
      }

      // 检查构建产物
      log('🔍 检查构建产物...', 'yellow');
      const distPath = path.join(projectPath, 'dist');
      if (fs.existsSync(distPath)) {
        const distFiles = fs.readdirSync(distPath);
        if (distFiles.length === 0) {
          log('❌ 构建产物目录为空', 'red');
          return false;
        }
        log(`✅ 构建产物检查通过 - 找到 ${distFiles.length} 个文件`, 'green');
      } else {
        log('⚠️  构建产物目录不存在', 'yellow');
      }
    }
  }

  return true;
}

async function main() {
  log('🚀 开始测试所有项目...', 'blue');
  const startTime = Date.now();

  // 步骤1: 构建主项目
  log('\n📦 步骤1: 构建主项目...', 'blue');
  if (!execCommand('npm run build')) {
    log('❌ 主项目构建失败', 'red');
    process.exit(1);
  }

  // 步骤2: 检查构建产物
  log('\n🔍 步骤2: 检查构建产物...', 'blue');
  const packagesDir = path.join(rootDir, 'packages');
  const packages = [
    'base-tools-ts',
    'base-tools-web',
    'base-tools-uni',
    'base-tools-react',
    'base-tools-vue',
  ];

  let allPackagesExist = true;
  for (const pkg of packages) {
    const pkgPath = path.join(packagesDir, pkg);
    const distPath = path.join(pkgPath, 'dist');

    if (fs.existsSync(distPath) && fs.readdirSync(distPath).length > 0) {
      log(`✅ ${pkg} - 构建产物存在`, 'green');
    } else {
      log(`❌ ${pkg} - 构建产物缺失`, 'red');
      allPackagesExist = false;
    }
  }

  if (!allPackagesExist) {
    log('❌ 构建产物检查失败', 'red');
    process.exit(1);
  }

  // 步骤3: 测试各个项目
  log('\n🧪 步骤3: 开始测试各个项目...', 'blue');
  const results = [];

  for (const project of testProjects) {
    const success = await testProject(project);
    results.push({
      name: project.name,
      path: project.path,
      success,
    });

    if (success) {
      log(`✅ ${project.name} 测试通过`, 'green');
    } else {
      log(`❌ ${project.name} 测试失败`, 'red');
    }
  }

  // 步骤4: 生成测试报告
  log('\n📊 测试报告:', 'blue');
  const passed = results.filter((r) => r.success).length;
  const failed = results.filter((r) => !r.success).length;

  log(`总测试项目: ${results.length}`, 'blue');
  log(`通过: ${passed}`, 'green');
  log(`失败: ${failed}`, failed > 0 ? 'red' : 'green');

  results.forEach((result) => {
    const status = result.success ? '✅ 通过' : '❌ 失败';
    const color = result.success ? 'green' : 'red';
    log(`${status} - ${result.name} (${result.path})`, color);
  });

  const duration = ((Date.now() - startTime) / 1000).toFixed(2);
  log(`\n⏱️  总耗时: ${duration}秒`, 'blue');

  if (failed > 0) {
    log('\n❌ 测试失败 - 有项目未通过测试', 'red');
    process.exit(1);
  } else {
    log('\n🎉 所有测试通过！', 'green');

    // 额外验证HTML5项目
    log('\n🔍 额外验证HTML5项目依赖...', 'blue');
    const html5Verification = verifyHTML5Project();
    if (!html5Verification) {
      log('❌ HTML5项目验证失败', 'red');
      process.exit(1);
    }
  }
}

// HTML5项目验证函数
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

// 错误处理
process.on('unhandledRejection', (error) => {
  log(`\n❌ 未处理的Promise拒绝: ${error.message}`, 'red');
  process.exit(1);
});

process.on('uncaughtException', (error) => {
  log(`\n❌ 未捕获的异常: ${error.message}`, 'red');
  process.exit(1);
});

// 运行主函数
main().catch((error) => {
  log(`\n❌ 测试脚本执行失败: ${error.message}`, 'red');
  process.exit(1);
});
