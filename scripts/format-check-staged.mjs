import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const stagedOutput = execFileSync(
  'git',
  ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
  { encoding: 'utf8' },
).trim();

const stagedFiles = stagedOutput
  .split('\n')
  .map((file) => file.trim())
  .filter(Boolean)
  .filter((file) => existsSync(file));

if (stagedFiles.length === 0) {
  console.log('No staged files to format-check.');
  process.exit(0);
}

execFileSync(
  npxCommand,
  ['prettier', '--check', '--ignore-unknown', ...stagedFiles],
  { stdio: 'inherit' },
);
