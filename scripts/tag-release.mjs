#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function run(command) {
  console.log(`> ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    throw new Error(`Command failed: ${command}`, error);
  }
}

function getOutput(command) {
  try {
    return execSync(command, { encoding: 'utf8', stdio: 'pipe' }).trim();
  } catch (error) {
    console.error(`Command failed: ${command}`, error);
    return '';
  }
}

function main() {
  let originalBranch = '';

  try {
    // 1. Check if on master branch
    originalBranch = getOutput('git symbolic-ref --short HEAD');
    if (originalBranch !== 'master') {
      console.error(
        `\x1b[31mError: You are on branch "${originalBranch}". Please switch to "master" to tag.\x1b[0m`,
      );
      console.error(`\x1b[33mReminder: Please merge your changes to master before tagging.\x1b[0m`);
      process.exit(1);
    }

    // 2. Get current version from package.json
    const rootDir = join(__dirname, '..');
    const packageJsonPath = join(rootDir, 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
    const version = packageJson.version;
    const tagName = `v${version}`;

    console.log(`\x1b[36mProcessing release for tag: ${tagName}\x1b[0m`);

    // 3. Create tag if it doesn't exist
    const existingTags = getOutput(`git tag -l ${tagName}`);
    if (existingTags) {
      console.log(`\x1b[33mTag ${tagName} already exists. Skipping creation.\x1b[0m`);
    } else {
      run(`git tag ${tagName}`);
      console.log(`\x1b[32mTag ${tagName} created.\x1b[0m`);
    }

    // 4. Push tag to remote
    run(`git push origin ${tagName}`);
    console.log(`\x1b[32mTag ${tagName} pushed to remote.\x1b[0m`);

    // 5. Merge master into docs and push
    console.log(`\x1b[36mMerging master into docs branch...\x1b[0m`);

    // Check if docs branch exists locally
    const localDoc = getOutput('git branch --list docs');

    if (!localDoc) {
      console.log('Local docs branch not found. Creating tracking branch from origin/docs...');
      run('git checkout -b docs origin/docs');
    } else {
      run('git checkout docs');
      // Try to pull to ensure we are up to date, but don't fail if it's just local
      try {
        execSync('git pull origin docs', { stdio: 'inherit' });
      } catch (e) {
        console.warn('Warning: Failed to pull origin docs. Continuing...', e);
      }
    }

    run('git merge master');
    run('git push origin docs');
    console.log(`\x1b[32mSuccessfully merged master to docs and pushed.\x1b[0m`);
  } catch (error) {
    console.error(`\x1b[31m${error.message}\x1b[0m`);
    process.exitCode = 1;
  } finally {
    // Switch back to master if we moved away from it
    const currentBranch = getOutput('git symbolic-ref --short HEAD');
    if (originalBranch === 'master' && currentBranch !== 'master') {
      console.log('Switching back to master...');
      try {
        execSync('git checkout master', { stdio: 'inherit' });
      } catch (e) {
        console.error('\x1b[31mFailed to switch back to master.\x1b[0m', e);
      }
    }
  }
}

main();
