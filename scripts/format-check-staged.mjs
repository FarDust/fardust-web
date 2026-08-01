import { execFileSync } from 'node:child_process';
import { existsSync } from 'node:fs';

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const stagedFiles = getGitFiles([
  'diff',
  '--cached',
  '--name-only',
  '--diff-filter=ACMR',
]).filter((file) => existsSync(file));

if (stagedFiles.length === 0) {
  console.log('No staged files to format-check.');
  process.exit(0);
}

const unstagedFiles = new Set(
  getGitFiles(['diff', '--name-only', '--diff-filter=ACMRD']),
);
const partiallyStagedFiles = stagedFiles.filter((file) =>
  unstagedFiles.has(file),
);

if (partiallyStagedFiles.length > 0) {
  console.error(
    'Format check cannot safely validate partially staged files. Stage or stash unstaged changes in:',
  );
  for (const file of partiallyStagedFiles) {
    console.error(`- ${file}`);
  }
  process.exit(1);
}

execFileSync(
  npxCommand,
  ['prettier', '--check', '--ignore-unknown', ...stagedFiles],
  { stdio: 'inherit' },
);

function getGitFiles(args) {
  const output = execFileSync('git', args, { encoding: 'utf8' }).trim();

  return output
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean);
}
