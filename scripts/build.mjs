import { execSync } from 'node:child_process';
import process from 'node:process';

const commands = [
  'npm run test',
  'tsup --config config/tsup.ts.ts',
  'tsup --config config/tsup.web.ts',
  'tsup --config config/tsup.uni.ts',
  'tsup --config config/tsup.react.ts',
  'tsup --config config/tsup.vue.ts',
  'tsup --config config/tsup.umd.ts',
  'node scripts/copy-dists.mjs',
];

console.log('🚀 Starting build process...');

const startTime = Date.now();

for (const command of commands) {
  console.log(`\n👉 Running: ${command}`);
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`\n❌ Command failed: ${command}`, error);
    process.exit(1);
  }
}

const duration = ((Date.now() - startTime) / 1000).toFixed(2);
console.log(`\n✅ Build completed successfully in ${duration}s!`);
