import { spawn } from 'node:child_process';
import path from 'node:path';
const build = spawn(process.execPath, [path.join(process.cwd(), 'scripts/build.mjs')], { stdio: 'inherit' });
build.on('exit', code => {
  if (code) process.exit(code);
  import('./preview.mjs');
});
