'use strict';
const fs=require('node:fs');
const path=require('node:path');
const sharp=require('sharp');
const {createFixture}=require('./dom-fixture.cjs');
const root=path.resolve(__dirname,'..');
async function main(){
  const fixture=createFixture(root), study=fixture.scope.AbbeyStudy;
  fs.mkdirSync(path.join(root,'docs/captures'),{recursive:true});
  const choices=[
    ['orchard-day','orchard','clear',14,2],
    ['manuscript-day','manuscript','clear',14,2],
    ['storybook-day','storybook','clear',14,2],
    ['orchard-night','orchard','clear',23,4],
    ['manuscript-snow','manuscript','snow',14,3],
    ['storybook-fog','storybook','fog',6.8,5],
    ['orchard-rain','orchard','rain',17.5,3]
  ];
  for(const [name,style,weather,hour,stage] of choices){
    Object.assign(study.state,{weather,hour,stage,elapsed:8,workTime:8,paused:true,reduced:true});
    study.selectStyle(style);study.render();
    const svg=study.scenes[style].svg.outerHTML;
    fs.writeFileSync(path.join(root,'docs/captures',name+'.svg'),svg);
    await sharp(Buffer.from(svg)).resize(1280,850).png().toFile(path.join(root,'docs/captures',name+'.png'));
    console.log('Captured '+name);
  }
  const montage=[
    ['orchard-day','01 · Orchard Cloister','Clear day'],
    ['manuscript-day','02 · Living Manuscript','Clear day'],
    ['storybook-day','03 · Sunlit Storybook','Clear day'],
    ['orchard-night','Orchard Cloister','Night · Partial roof'],
    ['manuscript-snow','Living Manuscript','Snow · Scaffolding'],
    ['storybook-fog','Sunlit Storybook','Mist · Finished chapel']
  ];
  let labels='<svg xmlns="http://www.w3.org/2000/svg" width="1440" height="820"><rect width="1440" height="820" fill="#f7f4e9"/><text x="20" y="36" font-family="DejaVu Serif" font-size="29" fill="#304b3a">Abbey · Candlelight</text><text x="20" y="62" font-family="DejaVu Sans" font-size="14" fill="#67765b">Three original SVG art studies. Same clearing, same people, three drawing directions.</text>';
  const composite=[];
  for(let index=0;index<montage.length;index++){
    const [name,title,condition]=montage[index],left=12+(index%3)*480,top=86+Math.floor(index/3)*365;
    labels+='<text x="'+left+'" y="'+(top+17)+'" font-family="DejaVu Serif" font-size="21" fill="#304b3a">'+title+'</text><text x="'+left+'" y="'+(top+37)+'" font-family="DejaVu Sans" font-size="12" fill="#6e795e">'+condition+'</text>';
    const input=await sharp(path.join(root,'docs/captures',name+'.png')).resize(456,303).toBuffer();
    composite.push({input,left,top:top+47});
  }
  labels+='</svg>';
  await sharp(Buffer.from(labels)).composite(composite).jpeg({quality:88,chromaSubsampling:'4:4:4'}).toFile(path.join(root,'docs/captures/comparison.jpg'));
  console.log('Captured comparison.jpg');
}
main().catch(error=>{console.error(error);process.exitCode=1;});
