import fs from 'node:fs';
import path from 'node:path';

/**
 * 生成技能包
 * npm run skills:generate
 *
 * 作用:
 * - 为 `skills/base-tools` 生成或更新 references
 * - 自动产出 `references/ts|web|react|vue|uni` 下的 `catalog.md`、`lookup.md`
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
    selection: '通用 TS / JS 需求先查本包；有明确平台信号时先查对应平台包，再补查本包。',
    lookups: [
      [
        '深拷贝 / clone',
        '`cloneDeep`',
        '来自 `es-toolkit` re-export，优先从 `@base-web-kits/base-tools-ts` 导入。',
      ],
      ['数组移动 / 拖拽排序', '`arrayMove`', '用于把数组元素从一个下标移动到另一个下标。'],
      ['异步错误元组', '`toAsync`', '用于把 Promise 转成 `[err, data]` 风格结果。'],
      [
        '日期格式化 / dayjs',
        '`toDayjs`、`dateFormat`、`dayjs`',
        '日期解析、格式化和 dayjs 统一入口。',
      ],
      ['年龄 / 生日', '`getAgeByBirthdate`', '按出生日期计算年龄。'],
      [
        '日期范围 / 前后几天',
        '`getDateRangeBefore`、`getDateRangeAfter`',
        '生成从今天到指定天数之前或之后的日期范围，可按格式补齐整日时间。',
      ],
      ['倒计时', '`getCountdownParts`', '拆分天、时、分、秒等倒计时字段。'],
      [
        '金额精确计算',
        '`mathPlus`、`mathMinus`、`mathTimes`、`mathDiv`',
        '基于 BigNumber，避免浮点误差。',
      ],
      [
        '千分位 / 单位 / px / 补零',
        '`toThousandth`、`withUnit`、`withUnitPx`、`zeroPad`',
        '数值展示与 CSS 尺寸格式化。',
      ],
      ['手机号 / 姓名脱敏', '`toMaskPhone`、`toMaskName`、`toMaskText`', '文本隐私脱敏。'],
      [
        '邮箱 / 手机号 / 身份证校验',
        '`isEmail`、`isMobilePhone`、`isIdentityCard`',
        '常见表单校验。',
      ],
      ['URL 参数拼接', '`appendUrlParam`', '向 URL 追加 query 参数。'],
      ['URL 路径拼接', '`joinUrlPath`', '拼接 URL 或路径片段，并清理交界处多余的斜杠。'],
      ['文件后缀 / 文件类型', '`getFileSuffix`、`getFileType`', '从文件名或 URL 识别文件信息。'],
      [
        'OSS / 七牛媒体链接',
        '`getOSSImg`、`getQnImg`、`getOSSHls`、`getQnHls`',
        '生成图片、音频、视频、HLS 资源链接。',
      ],
      ['事件总线', '`EventBus`', '跨模块事件发布订阅。'],
      ['SSE 流式解析', '`SSEParser`', '解析服务端事件流消息。'],
    ],
    thirdPartyRefs: [
      {
        file: 'es-toolkit.md',
        packageName: 'es-toolkit',
        importFrom: '@base-web-kits/base-tools-ts',
        sourceFile: path.join(ROOT, 'scripts', 're-export', 'docs', 'es-toolkit.ts'),
      },
    ],
  },
  {
    name: 'base-tools-web',
    key: 'web',
    packageName: '@base-web-kits/base-tools-web',
    sourceEntry: path.join(SOURCE_ROOT, 'web', 'index.ts'),
    install: 'pnpm add @base-web-kits/base-tools-web',
    title: 'Base Tools Web',
    selection: '浏览器 / H5 能力先查本包，再补查 `base-tools-ts`。',
    lookups: [
      ['复制文本', '`copyText`', '复制普通文本到剪贴板。'],
      [
        '复制 HTML / 节点 / 图片',
        '`copyHtml`、`copyNode`、`copyImage`',
        '复制富文本、DOM 节点或图片。',
      ],
      [
        '浏览器 / 系统 / 设备识别',
        '`getBrowserName`、`getOS`、`isMobile`、`isPC`、`isWeChat`',
        '识别 UA、平台和设备类型。',
      ],
      [
        '视口尺寸 / 滚动位置',
        '`getWindowWidth`、`getWindowHeight`、`getWindowScrollTop`',
        '读取窗口尺寸和滚动信息。',
      ],
      ['元素是否在视口内', '`isInViewport`', '判断 DOM 元素是否进入可视区域。'],
      ['锁定页面滚动', '`lockBodyScroll`、`unlockBodyScroll`', '弹窗、抽屉等场景锁定 body 滚动。'],
      [
        '请求封装',
        '`request`、`RequestConfig`',
        '基于 fetch 的请求封装，支持缓存、loading、toast、日志和 SSE。',
      ],
      [
        '下载 / 动态加载资源',
        '`download`、`loadJs`、`loadCss`、`preloadImage`',
        '文件下载和资源加载。',
      ],
      ['上传文件', '`uploadFile`', '浏览器文件上传封装。'],
      ['Cookie', '`getCookie`、`setCookie`、`removeCookie`', '读写和删除 Cookie。'],
      [
        'localStorage',
        '`getLocalStorage`、`setLocalStorage`、`removeLocalStorage`',
        '本地存储封装。',
      ],
      [
        'URL 参数读取',
        '`getUrlParam`、`getUrlNumber`、`getUrlParams`',
        '读取当前 URL 或指定 URL 的 query 参数。',
      ],
    ],
    thirdPartyRefs: [],
  },
  {
    name: 'base-tools-react',
    key: 'react',
    packageName: '@base-web-kits/base-tools-react',
    sourceEntry: path.join(SOURCE_ROOT, 'react', 'index.ts'),
    install: 'pnpm add @base-web-kits/base-tools-react',
    title: 'Base Tools React',
    selection: 'React 组件逻辑或 hooks 先查本包，再补查 `base-tools-ts` 和 `base-tools-web`。',
    lookups: [
      [
        '元素尺寸监听',
        '`useMeasure` 或 `useSize`',
        '`useMeasure` 是本包封装；`useSize` 来自 ahooks re-export。',
      ],
      ['倒计时', '`useCountDown`', '来自 ahooks re-export。'],
      ['请求状态管理', '`useRequest`', '来自 ahooks re-export。'],
      [
        '防抖 / 节流',
        '`useDebounceFn`、`useThrottleFn`、`withDebounce`',
        'hooks 场景优先用 ahooks，组件包装可用 HOC。',
      ],
      ['点击外部', '`useClickAway`', '来自 ahooks re-export。'],
      ['事件监听', '`useEventListener`、`useKeyPress`', '来自 ahooks re-export。'],
      [
        '本地存储状态',
        '`useLocalStorageState`、`useSessionStorageState`、`useCookieState`',
        '来自 ahooks re-export。',
      ],
      ['加载态包装组件', '`withLoading`、`withSkeleton`、`withSuspense`', '组件级状态包装。'],
      [
        '错误边界',
        '`withErrorBoundary`、`ErrorBoundary`、`withAsyncBoundary`',
        '组件异常捕获和异步边界。',
      ],
      [
        'memo / ref / displayName',
        '`withMemo`、`withForwardRef`、`withDisplayName`',
        '组件性能和类型包装。',
      ],
    ],
    thirdPartyRefs: [
      {
        file: 'ahooks.md',
        packageName: 'ahooks',
        importFrom: '@base-web-kits/base-tools-react',
        sourceFile: path.join(ROOT, 'scripts', 're-export', 'docs', 'ahooks.ts'),
      },
    ],
  },
  {
    name: 'base-tools-vue',
    key: 'vue',
    packageName: '@base-web-kits/base-tools-vue',
    sourceEntry: path.join(SOURCE_ROOT, 'vue', 'index.ts'),
    install: 'pnpm add @base-web-kits/base-tools-vue',
    title: 'Base Tools Vue',
    selection: 'Vue 3 组合式 API 或组件逻辑先查本包，再补查 `base-tools-ts` 和 `base-tools-web`。',
    lookups: [
      [
        '点击外部',
        '`onClickOutside` 或 `vClickOutside`',
        '`onClickOutside` 来自 @vueuse/core re-export；模板指令场景用 `vClickOutside`。',
      ],
      ['元素尺寸监听', '`useElementSize`、`useResizeObserver`', '来自 @vueuse/core re-export。'],
      ['窗口尺寸 / 滚动', '`useWindowSize`、`useWindowScroll`', '来自 @vueuse/core re-export。'],
      [
        '防抖 / 节流',
        '`useDebounceFn`、`useThrottleFn`、`watchDebounced`、`watchThrottled`',
        '来自 @vueuse/core re-export。',
      ],
      ['剪贴板', '`useClipboard`', '来自 @vueuse/core re-export。'],
      [
        '本地存储',
        '`useLocalStorage`、`useSessionStorage`、`useStorage`',
        '来自 @vueuse/core re-export。',
      ],
      [
        '深色模式 / 媒体查询',
        '`useDark`、`useColorMode`、`useMediaQuery`',
        '来自 @vueuse/core re-export。',
      ],
      ['聚焦', '`vFocus` 或 `useFocus`', '模板指令场景用 `vFocus`；组合式场景用 `useFocus`。'],
      ['懒加载图片', '`vLazy`', '模板指令场景使用。'],
      ['长按', '`vLongpress`', '模板指令场景使用。'],
    ],
    thirdPartyRefs: [
      {
        file: 'vueuse.md',
        packageName: '@vueuse/core',
        importFrom: '@base-web-kits/base-tools-vue',
        sourceFile: path.join(ROOT, 'scripts', 're-export', 'docs', 'vueuse.ts'),
      },
    ],
  },
  {
    name: 'base-tools-uni',
    key: 'uni',
    packageName: '@base-web-kits/base-tools-uni',
    sourceEntry: path.join(SOURCE_ROOT, 'uni', 'index.ts'),
    install: 'pnpm add @base-web-kits/base-tools-uni',
    title: 'Base Tools Uni',
    selection: 'uni-app 平台能力、端差异或生态 API 先查本包，再补查 `base-tools-ts`。',
    lookups: [
      ['Promise 化 uni API', '`enhanceUniApi`', '为 uni API 注入 loading、toast、log 等能力。'],
      ['页面事件监听', '`useOn`', 'uni 页面生命周期或事件监听封装。'],
      ['路由跳转 / 返回', '`href`、`back`、`toHome`、`toLogin`', '统一页面跳转和登录跳转。'],
      ['登录检查', '`checkLogin`', '路由或业务操作前检查登录态。'],
      [
        '选择图片 / 视频 / 媒体',
        '`chooseImage`、`chooseVideo`、`chooseMedia`',
        '统一媒体选择能力。',
      ],
      ['保存图片到相册', '`saveImageToPhotosAlbum`', '保存网络图片或本地图片到系统相册。'],
      ['打开文件 / 文档', '`openDocument`、`getFileUrl`', '文件 URL 处理和文档预览。'],
      [
        '请求封装',
        '`request`、`RequestConfig`',
        'uni.request 封装，支持缓存、loading、toast、日志和流式响应；项目内可基于 `request` 自行封装 `requestApi`。',
      ],
      ['上传 / 下载文件', '`uploadFile`、`downloadFile`', 'uni 文件上传下载。'],
      [
        '窗口 / 安全区 / 设备信息',
        '`getWindowInfo`、`getSafeAreaBottom`、`getDeviceInfo`、`getPlatformOs`',
        '平台和布局适配。',
      ],
      ['扫码 / 复制', '`scanCode`、`copyText`', '系统能力封装。'],
      ['Toast / Modal / Loading', '`toast`、`showModal`、`showLoading`', '统一 UI 提示。'],
      ['微信支付', '`toPayWx`', '微信支付封装。'],
      ['小程序更新', '`mpUpdate`', '小程序版本更新流程。'],
      ['rpx 单位', '`withUnitRpx`', '数值转 rpx 字符串。'],
    ],
    thirdPartyRefs: [],
  },
];

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFileIfChanged(filePath, content) {
  ensureDir(path.dirname(filePath));
  const prev = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
  const lineEnding = prev?.includes('\r\n') ? '\r\n' : '\n';
  const rendered = content.endsWith('\n') ? content : `${content}\n`;
  const next = rendered.replace(/\r?\n/g, lineEnding);
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
  const cleanSource = stripComments(source);
  const symbols = new Set();
  const matchers = [
    /export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g,
    /export\s+(?:const|let|var)\s+([A-Za-z_$][\w$]*)/g,
    /export\s+class\s+([A-Za-z_$][\w$]*)/g,
    /export\s+(?:interface|type|enum)\s+([A-Za-z_$][\w$]*)/g,
  ];
  for (const matcher of matchers) {
    for (const match of cleanSource.matchAll(matcher)) symbols.add(match[1]);
  }

  const namedExportMatcher = /export\s*{\s*([^}]+)\s*}(?:\s*from\s*['"]([^'"]+)['"])?/g;
  for (const match of cleanSource.matchAll(namedExportMatcher)) {
    const specifier = match[2];
    // 带来源的导出由模块遍历或第三方独立索引负责，避免在 catalog 中重复展开超长符号列表。
    if (specifier) continue;
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

function stripComments(source) {
  let result = '';
  let state = 'code';

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const next = source[i + 1];

    if (state === 'code') {
      if (char === '"' || char === "'" || char === '`') {
        state = char;
        result += char;
      } else if (char === '/' && next === '/') {
        state = 'lineComment';
        i += 1;
      } else if (char === '/' && next === '*') {
        state = 'blockComment';
        i += 1;
      } else {
        result += char;
      }
      continue;
    }

    if (state === 'lineComment') {
      if (char === '\n' || char === '\r') {
        state = 'code';
        result += char;
      }
      continue;
    }

    if (state === 'blockComment') {
      if (char === '\n' || char === '\r') result += char;
      if (char === '*' && next === '/') {
        state = 'code';
        i += 1;
      }
      continue;
    }

    result += char;
    if (char === '\\') {
      if (next) {
        result += next;
        i += 1;
      }
    } else if (char === state) {
      state = 'code';
    }
  }

  return result;
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
    const cleanSource = stripComments(source);
    const localSymbols = parseNamedExports(source);
    const reexportedExternals = new Set();

    const starMatcher = /export\s+\*\s+from\s+['"]([^'"]+)['"]/g;
    for (const match of cleanSource.matchAll(starMatcher)) {
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
    for (const match of cleanSource.matchAll(namedFromMatcher)) {
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

function renderLookup(spec) {
  const lines = [
    `# ${spec.title} Lookup`,
    '',
    spec.selection,
    '',
    '按用户需求快速定位推荐 API。命中后仍需用 `catalog.md` 确认真实导出。',
    spec.thirdPartyRefs?.length
      ? '遇到第三方 re-export 未命中时，再读对应的完整第三方索引文件。'
      : '第三方统一导出规则见 `catalog.md` 的 `Third-party Re-exports`。',
    '',
    '| 需求 / 关键词 | 优先推荐 | 说明 |',
    '| :-- | :-- | :-- |',
  ];

  for (const [keyword, api, detail] of spec.lookups ?? []) {
    lines.push(`| ${keyword} | ${api} | ${detail} |`);
  }

  lines.push('');
  return lines.join('\n');
}

function renderThirdPartyRef(spec, ref) {
  const exports = collectExplicitExports(ref.sourceFile);
  const grouped = groupSymbolsByInitial(exports);
  const lines = [
    `# ${spec.title} ${ref.packageName} Index`,
    '',
    `本文件列出 \`${ref.packageName}\` 经由 \`${ref.importFrom}\` 统一 re-export 的完整符号清单。`,
    '推荐规则：如果用户需求命中下列符号，应优先从统一包导入，而不是直接从第三方包导入。',
    '',
  ];

  for (const [initial, symbols] of grouped) {
    lines.push(`## ${initial}`, '');
    lines.push(symbols.map((item) => `\`${item}\``).join('、'), '');
  }

  return lines.join('\n');
}

function collectExplicitExports(filePath) {
  const source = fs.readFileSync(filePath, 'utf8');
  const cleanSource = stripComments(source);
  const symbols = new Set();
  const exportBlockMatcher = /export\s*{\s*([\s\S]*?)\s*}\s*from\s*['"][^'"]+['"]/g;

  for (const match of cleanSource.matchAll(exportBlockMatcher)) {
    for (const rawItem of match[1].split(',')) {
      const item = rawItem.trim();
      if (!item) continue;
      const alias = item
        .split(/\s+as\s+/i)
        .pop()
        .trim();
      if (alias) symbols.add(alias);
    }
  }

  return [...symbols].sort((a, b) => a.localeCompare(b));
}

function groupSymbolsByInitial(symbols) {
  const groups = new Map();

  for (const symbol of symbols) {
    const initial = symbol[0]?.toUpperCase() ?? '#';
    const key = /^[A-Z]$/.test(initial) ? initial : '#';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(symbol);
  }

  return [...groups.entries()].sort(([a], [b]) => a.localeCompare(b));
}

function main() {
  ensureDir(BASE_SKILL_DIR);
  const referencesRoot = path.join(BASE_SKILL_DIR, 'references');

  for (const spec of PACKAGE_SPECS) {
    const moduleDir = path.join(referencesRoot, spec.key);
    ensureDir(moduleDir);

    writeFileIfChanged(path.join(moduleDir, 'catalog.md'), renderCatalog(spec));
    writeFileIfChanged(path.join(moduleDir, 'lookup.md'), renderLookup(spec));
    for (const ref of spec.thirdPartyRefs ?? []) {
      writeFileIfChanged(path.join(moduleDir, ref.file), renderThirdPartyRef(spec, ref));
    }
  }
}

main();
