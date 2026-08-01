import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';

const scanMode = process.argv.includes('--all') ? 'all' : 'staged';

const BLOCKED_PATH_PREFIXES = [
  '.artifacts/',
  '.codex',
  '.firecrawl/',
  '.lighthouseci/',
  '.sisyphus/',
  'output/',
];

const SKIPPED_SCAN_PREFIXES = ['src/assets/vendor/'];

const BLOCKED_FILE_NAMES = [
  '.env',
  '.env.local',
  '.env.production',
  '.env.development',
  '.env.test',
];

const SECRET_PATTERNS = [
  {
    id: 'private-key',
    message: 'private key material',
    pattern: /-----BEGIN (?:RSA |OPENSSH |EC |DSA |PGP )?PRIVATE KEY-----/,
  },
  {
    id: 'github-token',
    message: 'GitHub token',
    pattern: /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{30,}\b/,
  },
  {
    id: 'openai-token',
    message: 'OpenAI-style secret key',
    pattern: /\bsk-[A-Za-z0-9_-]{20,}\b/,
  },
  {
    id: 'google-api-key',
    message: 'Google API key',
    pattern: /\bAIza[0-9A-Za-z_-]{35}\b/,
  },
  {
    id: 'slack-token',
    message: 'Slack token',
    pattern: /\bxox[baprs]-[0-9A-Za-z-]{20,}\b/,
  },
  {
    id: 'literal-bearer-token',
    message: 'literal bearer token',
    pattern: /Authorization\s*[:=]\s*['"]Bearer\s+[A-Za-z0-9._-]{8,}['"]/i,
  },
  {
    id: 'assigned-secret',
    message: 'hardcoded secret-like assignment',
    pattern:
      /\b(?:api[_-]?key|secret|token|password|authorization|ipInfoToken)\b\s*[:=]\s*['"][^'"$]{8,}['"]/i,
  },
];

const ALLOWED_ASSIGNMENTS = [
  {
    pattern: /^const TOKEN_COOKIE = 'personal_token';$/,
    ruleIds: ['assigned-secret'],
  },
  {
    pattern: /^\s*Authorization: `Bearer \${token}`,?$/,
    ruleIds: ['literal-bearer-token'],
  },
];

const scanFiles = getScanFiles(scanMode);
const findings = [];

for (const file of scanFiles) {
  inspectPath(file, findings);

  if (shouldSkipContentScan(file)) {
    continue;
  }

  const content = readScanContent(file, scanMode, findings);
  if (content === null) {
    continue;
  }

  inspectContent(file, content, findings);
}

if (findings.length > 0) {
  console.error('Privacy scan failed. Review these files before committing:');
  for (const finding of findings) {
    console.error(`- ${finding}`);
  }
  process.exit(1);
}

console.log(`Privacy scan passed for ${scanFiles.length} ${scanMode} file(s).`);

function getScanFiles(mode) {
  const args =
    mode === 'all'
      ? ['ls-files', '--cached', '--others', '--exclude-standard']
      : ['diff', '--cached', '--name-only', '--diff-filter=ACMR'];
  const output = execFileSync('git', args, { encoding: 'utf8' }).trim();

  return output
    .split('\n')
    .map((file) => file.trim())
    .filter(Boolean)
    .filter((file) => !isSkippedPath(file));
}

function inspectPath(file, target) {
  const normalized = normalizePath(file);
  const baseName = normalized.split('/').at(-1) ?? normalized;

  if (BLOCKED_FILE_NAMES.includes(baseName) || /^\.env\./.test(baseName)) {
    target.push(`${file}: environment files must not be committed`);
  }

  for (const prefix of BLOCKED_PATH_PREFIXES) {
    if (
      normalized === prefix.replace(/\/$/, '') ||
      normalized.startsWith(prefix)
    ) {
      target.push(`${file}: generated/local artifact path is blocked`);
      return;
    }
  }
}

function shouldSkipContentScan(file) {
  return isLikelyBinary(file) || isSkippedPath(file);
}

function isSkippedPath(file) {
  const normalized = normalizePath(file);
  return SKIPPED_SCAN_PREFIXES.some((prefix) => normalized.startsWith(prefix));
}

function isLikelyBinary(file) {
  return /\.(avif|gif|ico|jpe?g|pdf|png|webp|woff2?)$/i.test(file);
}

function readScanContent(file, mode, target) {
  try {
    if (mode === 'all') {
      return existsSync(file) ? readFileSync(file, 'utf8') : null;
    }

    return execFileSync('git', ['show', `:${file}`], {
      encoding: 'utf8',
      maxBuffer: 10 * 1024 * 1024,
    });
  } catch (error) {
    target.push(`${file}: unable to read ${mode} content (${error.message})`);
    return null;
  }
}

function inspectContent(file, content, target) {
  const lines = content.split(/\r?\n/);

  lines.forEach((line, index) => {
    for (const rule of SECRET_PATTERNS) {
      if (isAllowedLineForRule(line, rule.id)) {
        continue;
      }

      if (rule.pattern.test(line)) {
        target.push(`${file}:${index + 1}: ${rule.message} (${rule.id})`);
      }
    }
  });
}

function isAllowedLineForRule(line, ruleId) {
  return ALLOWED_ASSIGNMENTS.some(
    (allowed) => allowed.ruleIds.includes(ruleId) && allowed.pattern.test(line),
  );
}

function normalizePath(file) {
  return file.replace(/\\/g, '/');
}
