#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const ASSETS_DIR = path.join(__dirname, '../assets');

// Configuration for target directories
const TARGETS = [
  {
    type: 'Trae',
    dir: '.trae/skills/base-tools',
    file: 'SKILL.md',
    source: 'base-tools/SKILL.md',
  },
  {
    type: 'Cursor',
    dir: '.cursor/rules',
    file: 'base-tools.mdc',
    source: 'base-tools/SKILL.md',
  },
  {
    type: 'GitHub Copilot',
    dir: '.github',
    file: 'copilot-instructions.md',
    source: 'base-tools/SKILL.md',
  },
  {
    type: 'Claude Code',
    dir: '.',
    file: 'CLAUDE.md',
    source: 'base-tools/SKILL.md',
    append: true,
  },
  {
    type: 'Windsurf',
    dir: '.',
    file: '.windsurfrules',
    source: 'base-tools/SKILL.md',
  },
  {
    type: 'Roo Code',
    dir: '.',
    file: '.clinerules',
    source: 'base-tools/SKILL.md',
  },
  {
    type: 'Aider',
    dir: '.',
    file: 'CONVENTIONS.md',
    source: 'base-tools/SKILL.md',
  },
];

function installToDir(projectRoot) {
  let installedCount = 0;

  TARGETS.forEach((target) => {
    const sourcePath = path.join(ASSETS_DIR, target.source);
    const targetPath = path.join(projectRoot, target.dir, target.file);
    const targetDirFull = path.dirname(targetPath);

    // Only install if source exists
    if (fs.existsSync(sourcePath)) {
      try {
        if (!fs.existsSync(targetDirFull)) {
          fs.mkdirSync(targetDirFull, { recursive: true });
        }

        const content = fs.readFileSync(sourcePath, 'utf-8');
        let finalContent = content;

        if (fs.existsSync(targetPath)) {
          const existingContent = fs.readFileSync(targetPath, 'utf-8');
          // Avoid duplication
          if (
            existingContent.includes("name: 'base-tools'") ||
            existingContent.includes('# Base Tools Expert')
          ) {
            // Already installed
            return;
          }

          if (target.append) {
            const separator = existingContent.trim() ? '\n\n' : '';
            finalContent = existingContent + separator + content;
          }
        }

        fs.writeFileSync(targetPath, finalContent, 'utf-8');
        installedCount++;
      } catch (e) {
        console.error(`❌ [${projectRoot}] Failed for ${target.type}:`, e.message);
      }
    }
  });
  return installedCount > 0;
}

function scanAndInstall(rootDir) {
  console.log(`🔍 Scanning for projects in: ${rootDir}`);

  // Get all subdirectories
  let subDirs = [];
  try {
    subDirs = fs
      .readdirSync(rootDir, { withFileTypes: true })
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => path.join(rootDir, dirent.name));
  } catch (e) {
    console.error(`❌ Error reading directory: ${e.message}`);
    return;
  }

  // Include root dir itself if it has package.json
  if (fs.existsSync(path.join(rootDir, 'package.json'))) {
    subDirs.unshift(rootDir);
  }

  let successCount = 0;

  subDirs.forEach((dir) => {
    // Check if it's a valid project (has package.json)
    if (fs.existsSync(path.join(dir, 'package.json'))) {
      const projectName = path.basename(dir);
      const isSuccess = installToDir(dir);
      if (isSuccess) {
        console.log(`✅ [${projectName}] Skills installed`);
        successCount++;
      }
    }
  });

  console.log(`\n✨ Summary: Installed skills to ${successCount} projects.`);
}

function installGlobal() {
  console.log('🌍 Installing AI Skills globally...');
  const homeDir = os.homedir();

  const GLOBAL_TARGETS = [
    {
      type: 'Trae Global',
      path: path.join(homeDir, '.trae', 'skills', 'base-tools', 'SKILL.md'),
      source: 'base-tools/SKILL.md',
      append: false,
    },
  ];

  // Attempt to clean up legacy installation in .trae/user_rules.md and .trae/rules.md
  try {
    const traeUserRulesPath = path.join(homeDir, '.trae', 'user_rules.md');
    if (fs.existsSync(traeUserRulesPath)) {
      let content = fs.readFileSync(traeUserRulesPath, 'utf-8');
      if (content.includes("name: 'base-tools'") || content.includes('# Base Tools Expert')) {
        console.log('🧹 Cleaning up legacy installation in .trae/user_rules.md...');
        // Remove content starting from the skill header
        const skillMarker = "\n\n---\nname: 'base-tools'";
        const skillMarker2 = "name: 'base-tools'";

        if (content.includes(skillMarker)) {
          content = content.split(skillMarker)[0];
        } else if (content.includes(skillMarker2)) {
          // Fallback for different line endings or missing newlines
          const parts = content.split(skillMarker2);
          if (parts.length > 0) {
            // Remove the last part which likely contains the skill
            content = parts[0].replace(/---\s*$/, '').trim();
          }
        }

        fs.writeFileSync(traeUserRulesPath, content, 'utf-8');
        console.log('✅ Cleaned up .trae/user_rules.md');
      }
    }

    const traeRulesPath = path.join(homeDir, '.trae', 'rules.md');
    if (fs.existsSync(traeRulesPath)) {
      const content = fs.readFileSync(traeRulesPath, 'utf-8');
      if (content.includes("name: 'base-tools'")) {
        console.log('🧹 Cleaning up legacy .trae/rules.md...');
        fs.unlinkSync(traeRulesPath);
        console.log('✅ Deleted .trae/rules.md');
      }
    }
  } catch (e) {
    console.warn('⚠️ Failed to clean up legacy files:', e.message);
  }

  let successCount = 0;

  GLOBAL_TARGETS.forEach((target) => {
    const sourcePath = path.join(ASSETS_DIR, target.source);
    if (!fs.existsSync(sourcePath)) return;

    try {
      const targetDir = path.dirname(target.path);

      // Ensure dir exists
      if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true });
      }

      const content = fs.readFileSync(sourcePath, 'utf-8');
      let finalContent = content;
      let mode = 'Created';

      if (fs.existsSync(target.path)) {
        const existingContent = fs.readFileSync(target.path, 'utf-8');
        // Simple check to avoid duplication using the unique name in front matter or title
        if (
          existingContent.includes("name: 'base-tools'") ||
          existingContent.includes('# Base Tools Expert')
        ) {
          console.log(`ℹ️  [${target.type}] Skill already installed in ${target.path}`);
          return;
        }

        if (target.append) {
          // Add a separator if file is not empty
          const separator = existingContent.trim() ? '\n\n' : '';
          finalContent = existingContent + separator + content;
          mode = 'Updated';
        }
      }

      fs.writeFileSync(target.path, finalContent, 'utf-8');
      console.log(`✅ [${target.type}] ${mode} ${target.path}`);
      successCount++;
    } catch (e) {
      console.error(`❌ [${target.type}] Failed: ${e.message}`);
    }
  });

  if (successCount > 0) {
    console.log(
      `\n✨ Global installation complete! You can now use "base-tools" skill in any project.`,
    );
  } else {
    console.log(`\n✨ No changes made (skills might be already installed).`);
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.includes('--global') || args.includes('-g')) {
    installGlobal();
  } else if (args.includes('--scan') || args.includes('-s')) {
    // Batch mode: use current directory as root to scan subfolders
    scanAndInstall(process.cwd());
  } else {
    // Single project mode: install to current directory only
    console.log('🚀 Installing AI Skills to current project...');
    const isSuccess = installToDir(process.cwd());
    if (isSuccess) {
      console.log('✨ Done! You can now use "base-tools" skill in Trae/Cursor.');
    }
  }
}

main();
