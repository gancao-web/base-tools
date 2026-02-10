import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_ROOT = path.resolve(__dirname, '../docs/api');
const OUTPUT_DIR = path.resolve(__dirname, '../docs/public');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

interface DocFile {
  path: string;
  name: string;
  category: string;
  content: string;
  title: string;
}

function getAllDocs(dir: string, category: string = ''): DocFile[] {
  let results: DocFile[] = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of list) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const newCategory = category ? `${category}/${entry.name}` : entry.name;
      results = results.concat(getAllDocs(fullPath, newCategory));
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      if (entry.name.toLowerCase() === 'index.md') continue;

      const content = fs.readFileSync(fullPath, 'utf-8');
      // Extract first h1 as title, or use filename
      const titleMatch = content.match(/^#\s+(.+)$/m);
      const title = titleMatch ? titleMatch[1].trim() : entry.name.replace(/\.md$/, '');

      results.push({
        path: fullPath,
        name: entry.name,
        category,
        content,
        title,
      });
    }
  }
  return results;
}

const docs = getAllDocs(DOCS_ROOT);

// Generate llms.txt
let llmsTxt = `# Base Tools Documentation Index

Project: @base-web-kits/base-tools
Description: Cross-platform utility library (TS/Web/React/Vue/Uni)

## Documentation Structure

`;

// Group by top-level category
const docsByCategory: Record<string, DocFile[]> = {};
docs.forEach((doc) => {
  const topCategory = doc.category.split('/')[0];
  if (!docsByCategory[topCategory]) {
    docsByCategory[topCategory] = [];
  }
  docsByCategory[topCategory].push(doc);
});

for (const [category, categoryDocs] of Object.entries(docsByCategory)) {
  llmsTxt += `### ${category.toUpperCase()}\n\n`;
  // Sort by title
  categoryDocs.sort((a, b) => a.title.localeCompare(b.title));

  // Add install instructions based on category
  let installCmd = '';
  switch (category) {
    case 'ts':
      installCmd = 'npm i @base-web-kits/base-tools-ts';
      break;
    case 'web':
      installCmd = 'npm i @base-web-kits/base-tools-web';
      break;
    case 'react':
      installCmd = 'npm i @base-web-kits/base-tools-react';
      break;
    case 'vue':
      installCmd = 'npm i @base-web-kits/base-tools-vue';
      break;
    case 'uni':
      installCmd = 'npm i @base-web-kits/base-tools-uni';
      break;
    default:
      installCmd = '';
      break;
  }

  if (installCmd) {
    llmsTxt += `> Install: \`${installCmd}\`\n\n`;
  }

  for (const doc of categoryDocs) {
    // Construct relative link (assuming standard VitePress routing)
    // api/category/filename (without .md)
    const link = `/base-tools/api/${doc.category}/${doc.name.replace(/\.md$/, '')}`;
    llmsTxt += `- [${doc.title}](${link})\n`;
  }
  llmsTxt += '\n';
}

llmsTxt += `
## Full Content

For the complete content of all documentation pages, please refer to:
/base-tools/llms-full.txt
`;

fs.writeFileSync(path.join(OUTPUT_DIR, 'llms.txt'), llmsTxt);
console.log(`Generated ${path.join(OUTPUT_DIR, 'llms.txt')}`);

// Generate llms-full.txt
let llmsFullTxt = `# Base Tools Full Documentation

Project: @base-web-kits/base-tools
Date: ${new Date().toISOString().split('T')[0]}

`;

for (const doc of docs) {
  llmsFullTxt += `\n\n${'='.repeat(50)}\n`;
  llmsFullTxt += `File: ${doc.category}/${doc.name}\n`;
  llmsFullTxt += `${'='.repeat(50)}\n\n`;
  llmsFullTxt += doc.content;
}

fs.writeFileSync(path.join(OUTPUT_DIR, 'llms-full.txt'), llmsFullTxt);
console.log(`Generated ${path.join(OUTPUT_DIR, 'llms-full.txt')}`);
