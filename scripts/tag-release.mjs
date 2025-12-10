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
    console.error(`Command failed: ${command}`, error);
    process.exit(1);
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
  // 1. Check if on master branch
  const branch = getOutput('git symbolic-ref --short HEAD');
  if (branch !== 'master') {
    console.error(
      `\x1b[31mError: You are on branch "${branch}". Please switch to "master" to tag.\x1b[0m`,
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
    try {
      run('git checkout -b docs origin/docs');
    } catch (e) {
      console.error(
        '\x1b[31mFailed to checkout docs branch. Make sure it exists on remote.\x1b[0m',
        e,
      );
      process.exit(1);
    }
  } else {
    run('git checkout docs');
    // Try to pull to ensure we are up to date, but don't fail if it's just local
    try {
      run('git pull origin docs');
    } catch (e) {
      console.warn('Warning: Failed to pull origin docs. Continuing...', e);
    }
  }

  try {
    run('git merge master');
    run('git push origin docs');
    console.log(`\x1b[32mSuccessfully merged master to docs and pushed.\x1b[0m`);
  } catch (e) {
    console.error('\x1b[31mFailed to merge or push docs branch.\x1b[0m', e);
    process.exit(1);
  } finally {
    // Switch back to master
    console.log('Switching back to master...');
    run('git checkout master');
  }
}

main();
