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
  const regex = /^(\d+)\.(\d+)\.(\d+)(?:-(alpha)\.(\d+))?$/;
  const match = currentVersion.match(regex);

  if (!match) {
    throw new Error(`Invalid version format: ${currentVersion}`);
  }

  let [major, minor, patch, preType, preVer] = match;
  major = parseInt(major);
  minor = parseInt(minor);
  patch = parseInt(patch);
  preVer = preVer ? parseInt(preVer) : 0;

  switch (type) {
    case 'major':
      return `${major + 1}.0.0`;
    case 'minor':
      return `${major}.${minor + 1}.0`;
    case 'patch':
      // If it is a pre-release (e.g., 1.0.1-alpha.0), "patch" should stabilize it to 1.0.1
      if (preType) {
        return `${major}.${minor}.${patch}`;
      }
      return `${major}.${minor}.${patch + 1}`;
    case 'alpha':
      if (preType === 'alpha') {
        return `${major}.${minor}.${patch}-alpha.${preVer + 1}`;
      }
      // If stable, bump patch and start alpha
      return `${major}.${minor}.${patch + 1}-alpha.0`;
    default:
      throw new Error(`Invalid version type: ${type}. Use major, minor, patch, or alpha.`);
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

  if (!versionType || !['major', 'minor', 'patch', 'alpha'].includes(versionType)) {
    console.error('Usage: node scripts/version-bump.mjs <major|minor|patch|alpha>');
    process.exit(1);
  }

  console.log(`🚀 Bumping ${versionType} version for all packages...\n`);

  // Update root package.json
  try {
    const rootDir = join(__dirname, '..');
    const packageJsonPath = join(rootDir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const currentVersion = packageJson.version;
    const newVersion = bumpVersion(currentVersion, versionType);

    updatePackageVersion(rootDir, newVersion);
  } catch (error) {
    console.error(`❌ Failed to update root package: ${error.message}`);
  }

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
