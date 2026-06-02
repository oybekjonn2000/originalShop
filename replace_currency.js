const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.html')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      const original = content;
      
      // Look for \${{ ... }} pattern and replace with {{ ... }} so'm
      content = content.replace(/\\\$\{\{([\s\S]*?)\}\}/g, "{{$1}} so'm");
      
      if (content !== original) {
        fs.writeFileSync(fullPath, content);
        console.log('Updated', fullPath);
      }
    }
  }
}

processDir('e:/Loyiha/originalShop/frontend/src/app');
