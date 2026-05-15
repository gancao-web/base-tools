import fs from 'node:fs';
import path from 'node:path';

/**
 * 生成技能包
 * npm run skills:generate
 *
 * 作用:
 * - 为 `skills/base-tools` 生成或更新 references
 * - 自动产出 `references/ts|web|react|vue|uni` 下的 `catalog.md`、`scenarios.md`、`reexports.md`
 * - 让 AI 先命中 `base-tools` 总入口, 再按项目类型和导出清单定位现有函数, 避免重复造轮子
 *
 * 什么时候跑:
 * - 新增导出函数 / hook / HOC / 指令之后
 * - 删除导出之后
 *
 * 一般不用跑:
 * - 只改函数内部实现, 但导出名和导出结构没变
 *
 * 注意:
 * - 该脚本只生成 `skills/base-tools/references/**`
 * - `skills/base-tools/SKILL.md` 总入口为手工维护, 不由本脚本生成
 */
const ROOT = process.cwd();
const SOURCE_ROOT = path.join(ROOT, 'src');
const SKILLS_ROOT = path.join(ROOT, 'skills');
const BASE_SKILL_DIR = path.join(SKILLS_ROOT, 'base-tools');

const PACKAGE_SPECS = [
  {
    name: 'base-tools-ts',
    key: 'ts',
    packageName: '@base-web-kits/base-tools-ts',
    sourceEntry: path.join(SOURCE_ROOT, 'ts', 'index.ts'),
    install: 'pnpm add @base-web-kits/base-tools-ts',
    title: 'Base Tools TS',
    scenarios: [
      [
        '通用逻辑 / 数据转换',
        '先看 `catalog.md` 里的 `array`、`object`、`string`、`number`、`async`。',
      ],
      ['日期 / 时间', '先看 `day` 模块，以及 `toDayjs` / 日期范围 / 倒计时相关工具。'],
      ['校验 / 表单', '先看 `validator` 模块，优先复用现成校验函数。'],
      ['URL / 文件', '先看 `url` 模块，优先复用参数拼接、文件后缀、OSS 链接相关工具。'],
      [
        '异步 / 事件',
        '先看 `async`、`bean`、`buffer` 模块，优先复用 `toAsync`、`EventBus`、`SSEParser` 一类能力。',
      ],
      ['数值 / 金额', '先看 `number` 模块，优先复用格式化、运算、金额转换能力。'],
    ],
    reexports: [
      ['es-toolkit', '全量 re-export，优先把它当作统一入口，而不是重复实现常见工具函数。'],
    ],
  },
  {
    name: 'base-tools-web',
    key: 'web',
    packageName: '@base-web-kits/base-tools-web',
    sourceEntry: path.join(SOURCE_ROOT, 'web', 'index.ts'),
    install: 'pnpm add @base-web-kits/base-tools-web',
    title: 'Base Tools Web',
    scenarios: [
      ['剪贴板', '先看 `clipboard` 模块，优先复用复制文本 / HTML / 节点 / 图片能力。'],
      ['网络请求 / 下载 / 上传', '先看 `network` 模块，优先复用 request / download / uploadFile。'],
      ['设备 / 浏览器识别', '先看 `device` 模块，优先复用浏览器、系统、触控、尺寸相关工具。'],
      ['DOM / 视口', '先看 `dom` 模块，优先复用视口、滚动、锁滚动等工具。'],
      ['本地存储 / Cookie', '先看 `storage`、`cookie` 模块，优先复用现成封装。'],
      ['配置 / URL', '先看 `config`、`url` 模块，优先复用统一配置和 URL 拼接能力。'],
    ],
    reexports: [],
  },
  {
    name: 'base-tools-react',
    key: 'react',
    packageName: '@base-web-kits/base-tools-react',
    sourceEntry: path.join(SOURCE_ROOT, 'react', 'index.ts'),
    install: 'pnpm add @base-web-kits/base-tools-react',
    title: 'Base Tools React',
    scenarios: [
      ['Hook 组合', '先看 `hooks` 模块，优先复用现成 hooks，避免重复写状态 / 监听 / 请求逻辑。'],
      [
        'HOC / 包装器',
        '先看 `hoc` 模块，优先复用 memo、loading、error boundary、forwardRef、debounce。',
      ],
      ['第三方 hooks', '`ahooks` 为全量 re-export，先把它当统一入口，再回到本包找封装或约束。'],
    ],
    reexports: [['ahooks', '全量 re-export，优先使用本包统一版本，而不是直接重新引入多份依赖。']],
  },
  {
    name: 'base-tools-vue',
    key: 'vue',
    packageName: '@base-web-kits/base-tools-vue',
    sourceEntry: path.join(SOURCE_ROOT, 'vue', 'index.ts'),
    install: 'pnpm add @base-web-kits/base-tools-vue',
    title: 'Base Tools Vue',
    scenarios: [
      ['组合式 API', '先看 `hooks` 模块，优先复用现成组合式能力。'],
      ['自定义指令', '先看 `directives` 模块，优先复用点击外部、聚焦、懒加载、长按等指令。'],
      [
        '第三方 hooks',
        '`@vueuse/core` 为全量 re-export，先把它当统一入口，再回到本包找封装或约束。',
      ],
    ],
    reexports: [
      ['@vueuse/core', '全量 re-export，优先使用本包统一版本，而不是直接重新引入多份依赖。'],
    ],
  },
  {
    name: 'base-tools-uni',
    key: 'uni',
    packageName: '@base-web-kits/base-tools-uni',
    sourceEntry: path.join(SOURCE_ROOT, 'uni', 'index.ts'),
    install: 'pnpm add @base-web-kits/base-tools-uni',
    title: 'Base Tools Uni',
    scenarios: [
      ['路由 / 登录', '先看 `router`、`config`、`bean` 模块，优先复用跳转、登录、首页、返回封装。'],
      [
        '媒体 / 文件',
        '先看 `media`、`file`、`url` 模块，优先复用选择图片 / 视频 / 媒体和文件能力。',
      ],
      ['网络 / 异步', '先看 `network`、`async`、`hooks` 模块，优先复用请求、加载、事件监听封装。'],
      ['系统 / 平台', '先看 `system`、`other` 模块，优先复用窗口信息、设备信息、平台识别。'],
      [
        '支付 / 更新 / UI',
        '先看 `pay`、`update`、`ui` 模块，优先复用支付、版本更新、提示和滚动封装。',
      ],
    ],
    reexports: [],
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFileIfChanged(filePath, content) {
  ensureDir(path.dirname(filePath));
  const next = content.endsWith('\n') ? content : `${content}\n`;
  const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  if (prev !== next) fs.writeFileSync(filePath, next, 'utf8');
}

function stripExt(filePath) {
  return filePath.replace(/\.(d\.)?(ts|tsx|js|mjs|cjs)$/, '');
}

function toPosix(filePath) {
  return filePath.split(path.sep).join('/');
}

function isLocalSpecifier(specifier) {
  return specifier.startsWith('./') || specifier.startsWith('../');
}

function resolveLocalFile(fromFile, specifier) {
  const base = path.resolve(path.dirname(fromFile), specifier);
  const candidates = [
    `${base}.ts`,
    `${base}.tsx`,
    `${base}.js`,
    `${base}.mjs`,
    `${base}.cjs`,
    `${base}.d.ts`,
    path.join(base, 'index.ts'),
    path.join(base, 'index.tsx'),
    path.join(base, 'index.js'),
    path.join(base, 'index.mjs'),
    path.join(base, 'index.cjs'),
    path.join(base, 'index.d.ts'),
  ];

  return (
    candidates.find((candidate) => {
      try {
        return fs.statSync(candidate).isFile();
      } catch {
        return false;
      }
    }) ?? null
  );
}

function parseNamedExports(source) {
  const symbols = new Set();
  const matchers = [
    /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g,
    /export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g,
    /export\s+class\s+([A-Za-z_$][\w$]*)/g,
    /export\s+(?:interface|type|enum)\s+([A-Za-z_$][\w$]*)/g,
  ];
  for (const matcher of matchers) {
    for (const match of source.matchAll(matcher)) symbols.add(match[1]);
  }

  const namedExportMatcher = /export\s*{\s*([^}]+)\s*}(?:\s*from\s*['"]([^'"]+)['"])?/g;
  for (const match of source.matchAll(namedExportMatcher)) {
    const specifier = match[2];
    if (specifier && isLocalSpecifier(specifier)) continue;
    for (const item of match[1].split(',')) {
      const part = item.trim();
      if (!part) continue;
      const alias = part
        .split(/\s+as\s+/i)
        .pop()
        .trim();
      if (alias) symbols.add(alias);
    }
  }

  return symbols;
}

function collectModuleInfo(entryFile) {
  const visited = new Set();
  const files = new Map();
  const external = new Map();

  function visit(filePath) {
    const resolved = path.resolve(filePath);
    if (visited.has(resolved)) return;
    visited.add(resolved);

    const source = fs.readFileSync(resolved, 'utf8');
    const localSymbols = parseNamedExports(source);
    const reexportedExternals = new Set();

    const starMatcher = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g;
    for (const match of source.matchAll(starMatcher)) {
      const specifier = match[1];
      if (isLocalSpecifier(specifier)) {
        const target = resolveLocalFile(resolved, specifier);
        if (target) visit(target);
      } else {
        reexportedExternals.add(specifier);
        external.set(specifier, resolved);
      }
    }

    const namedFromMatcher = /export\s*{\s*[^}]+\s*}\s*from\s*['"]([^'"]+)['"]/g;
    for (const match of source.matchAll(namedFromMatcher)) {
      const specifier = match[1];
      if (isLocalSpecifier(specifier)) {
        const target = resolveLocalFile(resolved, specifier);
        if (target) visit(target);
      } else {
        reexportedExternals.add(specifier);
        external.set(specifier, resolved);
      }
    }

    const rel = toPosix(path.relative(path.dirname(entryFile), resolved));
    const normalized = stripExt(rel).replace(/\/index$/, '');
    if (normalized !== '.' && (localSymbols.size || reexportedExternals.size)) {
      files.set(normalized, {
        file: resolved,
        symbols: [...localSymbols].sort((a, b) => a.localeCompare(b)),
        externals: [...reexportedExternals].sort((a, b) => a.localeCompare(b)),
      });
    }
  }

  visit(entryFile);

  return {
    files,
    externals: [...external.keys()].sort((a, b) => a.localeCompare(b)),
  };
}

function insertTree(tree, modulePath, payload) {
  const parts = modulePath.split('/').filter(Boolean);
  let node = tree;
  for (const part of parts) {
    node.children ??= new Map();
    if (!node.children.has(part)) {
      node.children.set(part, {
        name: part,
        children: new Map(),
        symbols: [],
        externals: [],
        file: null,
      });
    }
    node = node.children.get(part);
  }
  node.file = payload.file;
  node.symbols = payload.symbols;
  node.externals = payload.externals;
}

function renderTreeNode(node, depth = 0) {
  const lines = [];
  const heading = ['##', '###', '####', '#####'][depth] ?? '######';

  if (node.name !== 'root') {
    lines.push(`${heading} ${node.name}`);
    if (node.file) lines.push(`- 来源: \`${toPosix(path.relative(ROOT, node.file))}\``);
    if (node.symbols?.length)
      lines.push(`- 导出: ${node.symbols.map((item) => `\`${item}\``).join('、')}`);
    if (node.externals?.length)
      lines.push(`- re-export: ${node.externals.map((item) => `\`${item}\``).join('、')}`);
    lines.push('');
  }

  if (node.children) {
    for (const child of [...node.children.values()].sort((a, b) => a.name.localeCompare(b.name))) {
      lines.push(...renderTreeNode(child, depth + 1));
    }
  }

  return lines;
}

function renderCatalog(spec) {
  const { files, externals } = collectModuleInfo(spec.sourceEntry);
  const root = { name: 'root', children: new Map() };
  for (const [modulePath, payload] of files) insertTree(root, modulePath, payload);

  const lines = [
    `# ${spec.title} Catalog`,
    '',
    `- 包名: \`${spec.packageName}\``,
    `- 安装: \`${spec.install}\``,
    `- 入口: \`${toPosix(path.relative(ROOT, spec.sourceEntry))}\``,
    '',
    '## Modules',
    '',
    ...renderTreeNode(root),
  ];

  if (externals.length) {
    lines.push('## Third-party Re-exports', '');
    for (const item of externals) {
      lines.push(`- \`${item}\``);
    }
    lines.push('');
  }

  return lines.join('\n').replace(/\n{3,}/g, '\n\n');
}

function renderReexports(spec) {
  const { externals } = collectModuleInfo(spec.sourceEntry);
  const lines = [
    `# ${spec.title} Re-exports`,
    '',
    externals.length
      ? '以下第三方包由本包统一 re-export，优先从本包导入，避免项目里重复引入不同版本。'
      : '本包没有第三方 re-export。',
    '',
  ];

  for (const item of externals) lines.push(`- \`${item}\``);
  lines.push('');
  return lines.join('\n');
}

function renderScenarios(spec) {
  const lines = [
    `# ${spec.title} Scenarios`,
    '',
    '优先顺序：`base-tools-ts` -> 对应框架包 -> 最后才手写新工具。',
    '',
  ];

  for (const [label, detail] of spec.scenarios) {
    lines.push(`- ${label}: ${detail}`);
  }

  lines.push('');
  return lines.join('\n');
}

function main() {
  ensureDir(BASE_SKILL_DIR);
  const referencesRoot = path.join(BASE_SKILL_DIR, 'references');

  for (const spec of PACKAGE_SPECS) {
    const moduleDir = path.join(referencesRoot, spec.key);
    ensureDir(moduleDir);

    writeFileIfChanged(path.join(moduleDir, 'catalog.md'), renderCatalog(spec));
    writeFileIfChanged(
      path.join(moduleDir, 'scenarios.md'),
      renderScenarios(spec),
    );
    writeFileIfChanged(
      path.join(moduleDir, 'reexports.md'),
      renderReexports(spec),
    );
  }
}

main();
