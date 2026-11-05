import { mkdirSync, readdirSync, rmSync } from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

/**
 * Windows sometimes keeps esbuild's temporary executable locked in the system
 * temp directory, so the next build cannot remove it. Keeping TEMP inside the
 * repository makes build/test/dev deterministic and avoids antivirus/sandbox
 * locks in %LOCALAPPDATA%\Temp.
 */
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const tempDir = path.join(root, '.tmp');
mkdirSync(tempDir, { recursive: true });

process.env.TEMP = tempDir;
process.env.TMP = tempDir;
process.env.TMPDIR = tempDir;

try {
  for (const entry of readdirSync(tempDir)) {
    if (entry.startsWith('esbuild-')) {
      try {
        rmSync(path.join(tempDir, entry), { force: true });
      } catch {
        // A stale executable can be locked; it is random-named and harmless.
      }
    }
  }
} catch {
  // Cleanup is best-effort and must not block the command.
}

const commands = {
  build: {
    steps: [
      ['node_modules/typescript/bin/tsc', ['--noEmit']],
      ['node_modules/vite/bin/vite.js', ['build']],
    ],
  },
  dev: { steps: [['node_modules/vite/bin/vite.js', []]] },
  preview: { steps: [['node_modules/vite/bin/vite.js', ['preview']]] },
  test: { steps: [['node_modules/vitest/vitest.mjs', ['run']]] },
  'test:watch': { steps: [['node_modules/vitest/vitest.mjs', []]] },
  validate: {
    steps: [
      ['node_modules/vitest/vitest.mjs', ['run', 'src/tests/questionBank.test.ts']],
    ],
  },
  typecheck: { steps: [['node_modules/typescript/bin/tsc', ['--noEmit']]] },
};

const commandName = process.argv[2];
const command = commands[commandName];
if (!command) {
  console.error(`Unknown command: ${commandName ?? '(empty)'}`);
  process.exit(2);
}

const extraArgs = process.argv.slice(3);
for (const [bin, defaultArgs] of command.steps) {
  const args = [...defaultArgs, ...extraArgs];
  const result = spawnSync(process.execPath, [path.join(root, bin), ...args], {
    cwd: root,
    env: process.env,
    stdio: 'inherit',
  });
  if (result.error) {
    console.error(result.error.message);
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
