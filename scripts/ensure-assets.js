const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, '..', 'node_modules', 'expo-router', 'assets');
const REQUIRED = ['file.png', 'pkg.png', 'forward.png', 'sitemap.png', 'arrow_down.png'];

const missing = REQUIRED.filter((f) => !fs.existsSync(path.join(ASSETS_DIR, f)));

if (missing.length > 0) {
  try {
    execSync('npx expo install expo-router -- --force 2>&1', {
      cwd: path.join(__dirname, '..'),
      stdio: 'pipe',
      timeout: 60000,
    });
    const stillMissing = REQUIRED.filter((f) => !fs.existsSync(path.join(ASSETS_DIR, f)));
    if (stillMissing.length > 0) {
      console.error(`[ensure-assets] WARNING: expo-router assets still missing after reinstall: ${stillMissing.join(', ')}`);
    }
  } catch {
    console.error('[ensure-assets] WARNING: Could not reinstall expo-router, assets may be missing');
  }
}
