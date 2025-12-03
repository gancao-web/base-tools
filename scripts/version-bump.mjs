#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
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

function bumpVersion(currentVersion, type) {
  const [major, minor, patch] = currentVersion.split('.').map(Number);

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    default:
      throw new Error(`Invalid version type: ${type}. Use major, minor, or patch.`);
  }
}

function updatePackageVersion(packagePath, newVersion) {
  const packageJsonPath = join(packagePath, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

  console.log(`Updating ${packageJson.name}: ${packageJson.version} → ${newVersion}`);

  packageJson.version = newVersion;
  writeFileSync(packageJsonPath, `${JSON.stringify(packageJson, null, 2)}\n`);
}

function main() {
  const versionType = process.argv[2];

  if (!versionType || !['major', 'minor', 'patch'].includes(versionType)) {
    console.error('Usage: node scripts/version-bump.mjs <major|minor|patch>');
    process.exit(1);
  }

  console.log(`🚀 Bumping ${versionType} version for all packages...\n`);

  packages.forEach((packageName) => {
    const packagePath = join(packagesDir, packageName);
    const packageJsonPath = join(packagePath, 'package.json');

    try {
      const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
      const currentVersion = packageJson.version;
      const newVersion = bumpVersion(currentVersion, versionType);

      updatePackageVersion(packagePath, newVersion);
    } catch (error) {
      console.error(`❌ Failed to update ${packageName}: ${error.message}`);
    }
  });

  console.log('\n✅ All package versions updated successfully!');
}

main();
