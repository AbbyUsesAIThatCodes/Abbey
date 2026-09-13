/* Build the dependency-free, double-clickable preview from the editable sources. */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
let html=fs.readFileSync(path.join(root,'studies/index.html'),'utf8');
const css=fs.readFileSync(path.join(root,'studies/styles.css'),'utf8');
html=html.replace('<link rel="stylesheet" href="styles.css">','<style>\n'+css+'\n</style>');
for(const name of ['art.js','scene.js','app.js']){
  const source=fs.readFileSync(path.join(root,'studies',name),'utf8');
  if(/<\/script/i.test(source))throw new Error('Unexpected closing script tag in '+name);
  html=html.replace('<script src="'+name+'"></script>','<script>\n'+source+'\n</script>');
}
fs.writeFileSync(path.join(root,'Candlelight.html'),html);
console.log('Built Candlelight.html ('+Buffer.byteLength(html)+' bytes). No runtime dependencies.');
