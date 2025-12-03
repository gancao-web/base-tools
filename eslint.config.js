import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  {
    ignores: [
      '*.sh',
      'node_modules',
      '*.md',
      '*.woff',
      '*.ttf',
      '.vscode',
      '.idea',
      'dist',
      'public',
      'docs',
      '.husky',
      '.local',
      'bin',
      'src/mock',
      'Dockerfile',
      'commitlint.config.js',
      'index.html',
      'components.d.ts',
      'auto-imports.d.ts',
    ],
  },
  js.configs.recommended,
  {
    files: ['**/*.{ts,js,mjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {},
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        exports: 'readonly',
        module: 'readonly',
        require: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      import: importPlugin,
    },
    settings: {},
    rules: {
      // js 相关规则
      // 强制使用全等比较（避免 == 带来的隐式转换问题）
      eqeqeq: ['error', 'always'],
      // 限制使用 console，仅允许 console.error（减少生产日志噪音）
      'no-console': ['warn', { allow: ['error'] }],
      // 禁用少见或易误用的语法：带标签语句、with 语句
      'no-restricted-syntax': ['error', 'LabeledStatement', 'WithStatement'],
      // 变量与函数命名使用驼峰；属性名不强制（兼容后端字段）
      camelcase: ['error', { properties: 'never' }],
      // 关闭未定义变量检查，交由 TypeScript 做静态分析
      'no-undef': 'off',
      // 禁用 var，统一使用 let/const
      'no-var': 'error',
      // 禁用 void 运算符，避免语义不清的写法
      'no-void': 'error',
      // 禁止空语句块，但允许空的 catch（常用于吞错占位）
      'no-empty': [
        'error',
        {
          allowEmptyCatch: true,
        },
      ],
      // 禁止未使用的变量，忽略常见约定（下划线、rest 解构等）
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_|^rest$',
        },
      ],
      // 能用 const 的场景优先使用 const（更明确不可变）
      'prefer-const': [
        'warn',
        {
          destructuring: 'all',
          ignoreReadBeforeAssign: true,
        },
      ],
      // 使用模板字符串替代字符串拼接
      'prefer-template': 'error',
      // 对象字面量尽量使用简写（{a: a} -> {a}）
      'object-shorthand': [
        'error',
        'always',
        {
          ignoreConstructors: false,
          avoidQuotes: true,
        },
      ],
      // 禁止始终为真/假的条件，但允许循环场景下的常量条件
      'no-constant-condition': [
        'error',
        {
          checkLoops: false,
        },
      ],
      // switch 必须提供 default 分支
      'default-case': ['error'],
      // default 分支必须位于最后
      'default-case-last': ['error'],

      // ts 相关规则
      // 关闭重复声明检查（避免与 JS 规则重复校验）
      '@typescript-eslint/no-redeclare': 'off',
      // 允许使用 // @ts-ignore/expect-error 等注释在必要时抑制类型错误
      '@typescript-eslint/ban-ts-comment': 'off',
      // 放宽对基础类型（如 {}、Object）的使用限制
      '@typescript-eslint/ban-types': 'off',
      // 导出边界不强制显式返回类型（工具库保持简洁）
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      // 允许空函数（占位、钩子或接口实现）
      '@typescript-eslint/no-empty-function': 'off',
      // 允许 any（在通用工具场景下更灵活）
      '@typescript-eslint/no-explicit-any': 'off',
      // 允许非空断言（!），在确保数据存在的场景下简化代码
      '@typescript-eslint/no-non-null-assertion': 'off',
      // 统一使用类型导入（import type），提高可读性与性能
      '@typescript-eslint/consistent-type-imports': ['error', { disallowTypeAnnotations: false }],
      // 允许使用 require（兼容少量 Node 场景）
      '@typescript-eslint/no-var-requires': 'off',
      // 关闭 TS 版本的未使用变量检查，交由基础 no-unused-vars 处理
      '@typescript-eslint/no-unused-vars': 'off',

      // import 相关规则
      // import 必须放在文件顶部
      'import/first': 'error',
      // 禁止从同一路径重复导入
      'import/no-duplicates': 'error',
      // 统一 import 顺序：builtin/external/internal/parent/sibling/index/type
      'import/order': [
        'error',
        {
          groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index', 'type'],
          pathGroups: [],
          pathGroupsExcludedImportTypes: [],
        },
      ],
    },
  },
  // 禁用与 Prettier 冲突的规则
  eslintConfigPrettier,
  // 其他推荐配置
  ...tseslint.configs.recommended,
  // Node.js 脚本文件的特殊配置
  {
    files: ['scripts/**/*.{js,mjs}'],
    rules: {
      'no-console': 'off', // 允许在脚本文件中使用 console
    },
  },
];
