import { execFileSync } from 'node:child_process';
import { mkdirSync, rmSync, copyFileSync, readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';
const root = process.cwd();
const dist = path.join(root, 'dist');
rmSync(dist, { recursive: true, force: true });
mkdirSync(dist, { recursive: true });
execFileSync('tsc', ['--rootDir', 'src', '--outDir', 'dist/src', '--module', 'ES2020', '--target', 'ES2020', '--moduleResolution', 'Bundler', '--noEmit', 'false', '--declaration', 'false', '--sourceMap', 'false'], { stdio: 'inherit' });
copyFileSync('node_modules/phaser/dist/phaser.js', path.join(dist, 'phaser.js'));
copyFileSync('src/style.css', path.join(dist, 'style.css'));
let html = readFileSync('index.html', 'utf8')
  .replace('<script type="module" src="/src/main.ts"></script>', '<link rel="stylesheet" href="/style.css" />\n    <script type="module" src="/src/main.js"></script>');
writeFileSync(path.join(dist, 'index.html'), html);
function walk(dir) {
  for (const name of readdirSync(dir)) {
    const file = path.join(dir, name);
    if (statSync(file).isDirectory()) walk(file);
    else if (file.endsWith('.js')) {
      const relDir = path.relative(path.dirname(file), dist).replaceAll(path.sep, '/') || '.';
      const phaserPath = relDir === '.' ? './phaser.js' : `${relDir}/phaser.js`;
      let code = readFileSync(file, 'utf8')
        .replace(/^import ['"]\.\/style\.css['"];\n?/m, '')
        .replace(/from ['"]phaser['"]/g, `from '${phaserPath}'`);
      writeFileSync(file, code);
    }
  }
}
walk(path.join(dist, 'src'));
console.log('✓ Neon Drift built to dist/');
