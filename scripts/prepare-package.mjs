import fs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

// pnpm file: dependencies can hard-link package files into local test projects.
// On Windows, large inode numbers lose precision in npm's tar implementation,
// causing unrelated files to be emitted as hard links. Detach before packing.
let detached = 0;

function detachHardLinks(directory) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.name === 'node_modules' || entry.name === '.git') continue;
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      detachHardLinks(file);
    } else if (entry.isFile() && fs.statSync(file).nlink > 1) {
      const temporary = `${file}.${randomUUID()}.tmp`;
      try {
        fs.copyFileSync(file, temporary, fs.constants.COPYFILE_EXCL);
        fs.renameSync(temporary, file);
        detached++;
      } finally {
        if (fs.existsSync(temporary)) fs.unlinkSync(temporary);
      }
    }
  }
}

detachHardLinks(process.cwd());
console.error(`Prepared package: detached ${detached} hard-linked files.`);
