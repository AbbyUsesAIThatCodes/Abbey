/* These tests run the real study scripts in a DOM fixture, without a browser.
 * Pointer hit testing, CSS layout, actual downloads, and frame rates need a browser.
 */
'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const xml=require('xml-js');
const {createFixture}=require('./dom-fixture.cjs');
const root=path.resolve(__dirname,'..');
const fixture=createFixture(root), {scope,document}=fixture;
const study=scope.AbbeyStudy;
const get=id=>document.getElementById(id);
const event=(id,type,value)=>{const control=get(id);if(value!==undefined)control.value=value;control.dispatch(type);};
function restore(){
  if(get('event-dialog').open)get('event-dialog').close();
  Object.assign(study.state,{style:'orchard',weather:'clear',hour:14,stage:2,elapsed:8,workTime:8,serviceTime:null,speed:1,paused:false,reduced:false,cycleDay:false,cycleBuild:false,zoom:1,panX:0,panY:0,selected:0,stress:false});
  if(study.state.compare)get('compare').click();
  study.selectStyle('orchard');study.render();
}
test('offline bundle contains the exact editable sources and no network dependencies',()=>{
  const bundle=fs.readFileSync(path.join(root,'Candlelight.html'),'utf8');
  for(const file of ['art.js','scene.js','app.js'])assert.ok(bundle.includes(fs.readFileSync(path.join(root,'studies',file),'utf8')));
  assert.ok(bundle.includes(fs.readFileSync(path.join(root,'studies/styles.css'),'utf8')));
  assert.doesNotMatch(bundle,/<script\s+src=|<link\s+rel="stylesheet"|fetch\(|XMLHttpRequest|WebSocket/);
});
test('all three styles have twelve figures and distinct complete SVG assets',()=>{
  restore();const trees=[];
  for(const [style,scene] of Object.entries(study.scenes)){
    assert.equal(scene.actors.length,12);
    assert.ok(scene.svg.querySelector('#'+style+'-tree0'));
    trees.push(scene.svg.querySelector('#'+style+'-tree0').outerHTML);
  }
  assert.equal(new Set(trees).size,3);
  const ids=document.querySelectorAll('[id]').map(node=>node.getAttribute('id'));
  assert.equal(new Set(ids).size,ids.length,'SVG definitions and UI IDs must be unique');
});
test('changing style preserves the shared scene and comparison synchronizes poses',()=>{
  restore();const before=JSON.stringify(study.state);
  document.querySelector('button[data-style="manuscript"]').click();
  const prior=JSON.parse(before);
  assert.equal(study.state.workTime,prior.workTime);assert.equal(study.state.hour,prior.hour);
  assert.equal(get('scene-caption').textContent,'Living Manuscript');
  get('compare').click();
  const poses=Object.values(study.scenes).map(scene=>{assert.equal(scene.container.hidden,false);return scene.actors.map(actor=>actor.node.getAttribute('transform')).join(';');});
  assert.equal(new Set(poses).size,1);
  get('compare').click();assert.equal(study.scenes.orchard.container.hidden,true);
});
test('light, weather and all construction stages produce valid self-contained SVG',()=>{
  restore();
  for(const style of Object.keys(study.scenes)){
    study.selectStyle(style);
    for(const weather of ['clear','rain','fog','snow']){
      event('weather','change',weather);
      assert.equal(study.scenes[style].svg.getAttribute('data-weather'),weather);
      assert.equal(study.scenes[style].snow.getAttribute('opacity'),weather==='snow'?'1':'0');
    }
    for(let stage=0;stage<6;stage++){
      event('construction','input',stage);
      const svg=study.scenes[style].svg.outerHTML;
      assert.doesNotMatch(svg,/NaN|undefined|Infinity/);
      assert.equal(study.scenes[style].svg.getAttribute('data-stage'),String(stage));
      assert.equal(get('construction-value').textContent,scope.AbbeyArt.stageNames[stage]);
      xml.xml2js(svg);
      const ids=new Set(study.scenes[style].svg.querySelectorAll('[id]').map(node=>node.getAttribute('id')));
      for(const ref of svg.matchAll(/(?:href="#|url\(#)([^")]+)/g))assert.ok(ids.has(ref[1]),'Missing SVG definition '+ref[1]);
    }
    document.querySelector('button[data-hour="23"]').click();
    assert.ok(Number(study.scenes[style].dark.getAttribute('opacity'))>.5);
    assert.ok(Number(study.scenes[style].lights.getAttribute('opacity'))>0);
  }
});
test('clock, pause and reduced motion control actual actor and weather transforms',()=>{
  restore();const scene=study.scenes.orchard;
  event('weather','change','rain');
  const initial=scene.actors[0].node.getAttribute('transform'),drop=scene.rainNodes[0].getAttribute('transform');
  study.advance(.3);
  assert.notEqual(scene.actors[0].node.getAttribute('transform'),initial);
  assert.notEqual(scene.rainNodes[0].getAttribute('transform'),drop);
  get('pause').click();const paused=scene.actors[0].node.getAttribute('transform'),time=study.state.elapsed;
  study.advance(2);assert.equal(study.state.elapsed,time);assert.equal(scene.actors[0].node.getAttribute('transform'),paused);
  get('pause').click();get('reduced-motion').checked=true;event('reduced-motion','change');
  study.advance(2);assert.equal(study.state.elapsed,time);
});
test('Vespers gathers, observes and returns all brothers continuously without losing work time',()=>{
  restore();const scene=study.scenes.orchard;
  const start=scene.actors.map(actor=>actor.node.getAttribute('transform'));
  get('vespers').click();study.render();
  assert.deepEqual(scene.actors.map(actor=>actor.node.getAttribute('transform')),start);
  study.advance(12);
  assert.equal(get('routine-caption').textContent,'Vespers · A quiet observance');
  assert.equal(study.state.workTime,8);
  assert.ok(scene.actors.every(actor=>actor.load.getAttribute('opacity')==='0'));
  const gathered=scene.actors.map(actor=>actor.node.getAttribute('transform'));
  study.advance(10);assert.deepEqual(scene.actors.map(actor=>actor.node.getAttribute('transform')),gathered);
  study.advance(14);assert.equal(study.state.serviceTime,null);
  assert.deepEqual(scene.actors.map(actor=>actor.node.getAttribute('transform')),start);
  assert.equal(get('vespers').disabled,false);
});
test('character selection and narrative choices use the real control handlers',()=>{
  restore();event('person','change',3);
  assert.equal(get('person-name').textContent,'Brother Hugh');
  assert.match(get('person-thought').textContent,/ground is telling/);
  get('open-event').click();assert.equal(study.state.paused,true);
  assert.match(get('event-art').innerHTML,/Two brothers discuss/);
  document.querySelector('[data-choice="shelter"]').click();
  assert.match(get('event-response').textContent,/Martin goes to find a ladder/);
  get('close-event').click();assert.equal(study.state.paused,false);
  study.state.paused=true;get('open-event').click();get('close-event').click();assert.equal(study.state.paused,true);
});
test('frame export creates parseable SVG with all used artwork inside the file',async()=>{
  restore();get('save-frame').click();assert.equal(fixture.blobs.length,1);
  const source=await fixture.blobs[0].text();xml.xml2js(source);
  assert.match(source,/width="1280"/);assert.match(source,/orchard-tree0/);
  assert.doesNotMatch(source,/<image[^>]+https?:/);
});
test('stress scene expands and releases its test population and scenery',()=>{
  restore();get('stress').checked=true;event('stress','change');
  const scene=study.scenes.orchard;
  assert.equal(scene.actors.length,200);
  const ground=scene.svg.querySelector('[data-stress-ground]');
  assert.equal(ground.querySelectorAll('polygon').length,1024);
  assert.equal(ground.querySelectorAll('ellipse').length,300);
  get('stress').checked=false;event('stress','change');
  assert.equal(scene.actors.length,12);assert.equal(ground.children.length,0);
});
test('bounded zoom and reset restore a useful view',()=>{
  restore();for(let i=0;i<20;i++)get('zoom-in').click();assert.equal(study.state.zoom,1.8);
  for(let i=0;i<20;i++)get('zoom-out').click();assert.equal(study.state.zoom,.7);
  study.state.panX=250;study.state.panY=-100;get('reset-view').click();
  assert.equal(study.state.zoom,1);assert.equal(study.state.panX,0);assert.equal(study.state.panY,0);
});
