// Copy web files from parent project to www/
const fs = require('fs');
const path = require('path');

const srcDir = path.resolve(__dirname, '..', '..');
const destDir = path.resolve(__dirname, '..', 'www');

// Files to copy
const files = [
  'index.html',
  'index.css',
  'index.js',
  'data.json',
  'manifest.json',
  'sw.js',
  'auth.html'
];

// Dirs to copy
const dirs = ['icons'];

console.log('Copying web assets...');

// Clear www
if (fs.existsSync(destDir)) {
  for (const item of fs.readdirSync(destDir)) {
    const itemPath = path.join(destDir, item);
    if (fs.statSync(itemPath).isDirectory()) {
      fs.rmSync(itemPath, { recursive: true });
    } else {
      fs.unlinkSync(itemPath);
    }
  }
}

// Copy files
for (const file of files) {
  const src = path.join(srcDir, file);
  const dest = path.join(destDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
    console.log('  ' + file + ' (' + fs.statSync(dest).size + ' bytes)');
  } else {
    console.log('  SKIP ' + file + ' (not found)');
  }
}

// Copy directories
for (const dir of dirs) {
  const src = path.join(srcDir, dir);
  const dest = path.join(destDir, dir);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log('  ' + dir + '/ (copied)');
  } else {
    console.log('  SKIP ' + dir + ' (not found)');
  }
}

// Fix paths in index.html for Capacitor (make all asset paths relative to root)
const htmlPath = path.join(destDir, 'index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Replace data.json fetch path if needed - it's already relative
// Make sure supabase iframe and other URLs work

// Add Capacitor-specific meta tags
if (!html.includes('capacitor')) {
  html = html.replace('<head>', `<head>
  <meta name="capacitor" content="true">`);
}

fs.writeFileSync(htmlPath, html);
console.log('\nDone! Web assets copied to www/');
console.log('Files in www/:');
for (const f of fs.readdirSync(destDir)) {
  console.log('  ' + f);
}
