/* Render the actual SVG animation deterministically; this is not a screen recording. */
'use strict';
const fs=require('node:fs');
const os=require('node:os');
const path=require('node:path');
const {spawnSync}=require('node:child_process');
const sharp=require('sharp');
const {createFixture}=require('./dom-fixture.cjs');
async function main(){
  const folder=fs.mkdtempSync(path.join(os.tmpdir(),'abbey-candlelight-'));
  const fixture=createFixture(),study=fixture.scope.AbbeyStudy;
  Object.assign(study.state,{hour:18.5,weather:'rain',stage:3,elapsed:0,workTime:8,serviceTime:0});
  study.render();
  try{
    for(let frame=0;frame<144;frame++){
      const svg=study.scenes.orchard.svg.outerHTML;
      await sharp(Buffer.from(svg)).resize(768,510).png().toFile(path.join(folder,String(frame).padStart(4,'0')+'.png'));
      study.advance(.25);
      if(frame%48===0)console.log('Rendered '+frame+'/144 animation frames');
    }
    const output=path.resolve(__dirname,'../docs/captures/vespers.mp4');
    const ffmpeg=spawnSync('ffmpeg',['-hide_banner','-loglevel','error','-framerate','12','-i',path.join(folder,'%04d.png'),'-c:v','libx264','-crf','23','-pix_fmt','yuv420p','-movflags','+faststart','-y',output],{encoding:'utf8'});
    if(ffmpeg.status!==0)throw new Error(ffmpeg.stderr||'ffmpeg failed');
    console.log('Rendered docs/captures/vespers.mp4 (36-second routine at 3x).');
  }finally{fs.rmSync(folder,{recursive:true,force:true});}
}
main().catch(error=>{console.error(error);process.exitCode=1;});
