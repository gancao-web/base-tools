#!/usr/bin/env node

import { execSync } from 'child_process';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packagesDir = join(__dirname, '..', 'packages');
const packages = [
  'base-tools-ts',
  'base-tools-web',
  'base-tools-uni',
  'base-tools-react',
  'base-tools-vue',
];

console.log('🚀 Publishing alpha version for all packages...\n');

packages.forEach((packageName) => {
  const packagePath = join(packagesDir, packageName);
  console.log(`Publishing ${packageName}...`);
  try {
    execSync(
      'node ../../scripts/prepare-package.mjs && npm publish --access public --tag alpha --registry https://registry.npmjs.org',
      {
        cwd: packagePath,
        stdio: 'inherit',
      },
    );
    console.log(`✅ ${packageName} published successfully!\n`);
  } catch (error) {
    console.error(`❌ Failed to publish ${packageName}: ${error.message}\n`);
    process.exit(1);
  }
});

console.log('✅ All alpha packages published successfully!');
