#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = process.cwd();
const cmd = process.argv[2] || 'dev';
const script = cmd === 'build' ? 'build.mjs' : cmd === 'preview' ? 'preview.mjs' : 'dev.mjs';
const result = spawnSync(process.execPath, [path.join(root, 'scripts', script), ...process.argv.slice(cmd === 'dev' ? 2 : 3)], { stdio: 'inherit' });
process.exit(result.status ?? 0);
