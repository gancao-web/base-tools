import { defineConfig } from 'vitepress';
import fs from 'fs';
import path from 'path';

function getModuleSidebar(module: string) {
  const baseLink = `/api/${module}/`;
  const dir = path.resolve(__dirname, `../api/${module}`);

  const sidebar: { text: string; items: { text: string; link: string }[]; collapsed?: boolean }[] =
    [{ text: '快速开始', items: [{ text: '安装使用', link: `${baseLink}` }] }];

  // 直接根据目录结构生成侧边栏
  const walk = (d: string, rel = '') => {
    const list = fs.readdirSync(d, { withFileTypes: true });

    for (const it of list) {
      const p = path.join(d, it.name);
      const r = rel ? `${rel}/${it.name}` : it.name;

      if (it.isDirectory()) {
        // 如果是目录，递归遍历并创建分组
        const groupItems: { text: string; link: string }[] = [];

        for (const subIt of fs.readdirSync(p, { withFileTypes: true })) {
          if (subIt.isFile() && subIt.name.endsWith('.md')) {
            const name = subIt.name.replace(/\.md$/, '');
            groupItems.push({
              text: name,
              link: `${baseLink}${r}/${name}`,
            });
          }
        }

        // 如果有文件，添加到侧边栏
        if (groupItems.length > 0) {
          groupItems.sort((a, b) => a.text.localeCompare(b.text));
          // 目录较少的模块，默认展开
          const isCollapsed = !['react', 'vue', 'web'].includes(module);
          sidebar.push({ text: it.name, items: groupItems, collapsed: isCollapsed });
        }
      } else if (it.isFile() && it.name.endsWith('.md') && it.name.toLowerCase() !== 'index.md') {
        // 如果是根目录下的文件，直接添加到侧边栏
        const name = it.name.replace(/\.md$/, '');

        // 检查是否已有根目录文件分组
        let rootGroup = sidebar.find((item) => item.text === '其他');
        if (!rootGroup) {
          rootGroup = { text: '其他', items: [], collapsed: true };
          sidebar.push(rootGroup);
        }

        rootGroup.items.push({
          text: name,
          link: `${baseLink}${name}`,
        });
      }
    }
  };

  // 只有当目录存在时才遍历，否则返回基本侧边栏
  if (fs.existsSync(dir)) {
    walk(dir);

    // 确保根目录文件分组的项按字母排序
    const otherGroup = sidebar.find((item) => item.text === '其他');
    if (otherGroup) {
      otherGroup.items.sort((a, b) => a.text.localeCompare(b.text));
    }
  }

  return sidebar;
}

export default defineConfig({
  base: '/base-tools/',
  lang: 'zh-CN',
  title: 'Base Tools',
  description: '跨端工具库文档（TS/Web/React/Vue/Uni）',
  lastUpdated: true,
  cleanUrls: true,
  head: [['style', {}, '.VPDocFooter{display:none !important;}']], // 去掉文档底部的上一页和下一页按钮
  appearance: 'dark', // 默认深色模式
  themeConfig: {
    search: {
      provider: 'local',
      options: {
        miniSearch: {
          options: {
            // 自定义分词函数，支持中文
            tokenize: (text: string) => {
              // 改进的分词函数，更好地处理中文
              const tokens: string[] = [];

              // 1. 提取所有中文字符（每个字符作为一个token）
              const chineseChars = text.match(/[\u4e00-\u9fa5]/g);
              if (chineseChars) {
                tokens.push(...chineseChars);
              }

              // 2. 提取英文单词和数字
              const words = text.toLowerCase().match(/[a-z0-9]+/g);
              if (words) {
                tokens.push(...words);
              }

              // 3. 提取中文词汇（2-4个字符的组合）
              for (let len = 2; len <= 4; len++) {
                for (let i = 0; i <= text.length - len; i++) {
                  const substring = text.substr(i, len);
                  // 检查是否全是中文字符
                  if (/^[\u4e00-\u9fa5]+$/.test(substring)) {
                    tokens.push(substring);
                  }
                }
              }

              return [...new Set(tokens)]; // 去重
            },
          },
          searchOptions: {
            boost: {
              title: 4,
              text: 2,
              titles: 1,
            },
            fuzzy: 0.2,
            prefix: true,
          },
        },
        locales: {
          root: {
            translations: {
              button: {
                buttonText: '搜索文档',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                noResultsText: '无法找到相关结果',
                resetButtonTitle: '清除查询条件',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },
    nav: [
      { text: '指南', link: '/guide' },
      { text: 'TS', link: '/api/ts/' },
      { text: 'Web', link: '/api/web/' },
      { text: 'React', link: '/api/react/' },
      { text: 'Vue', link: '/api/vue/' },
      { text: 'Uni', link: '/api/uni/' },
    ],
    sidebar: {
      '/api/ts/': getModuleSidebar('ts'),
      '/api/web/': getModuleSidebar('web'),
      '/api/react/': getModuleSidebar('react'),
      '/api/vue/': getModuleSidebar('vue'),
      '/api/uni/': getModuleSidebar('uni'),
    },
    socialLinks: [{ icon: 'github', link: 'https://github.com/gancao-web/base-tools' }],
    outline: false, // 禁用大纲
  },
});
