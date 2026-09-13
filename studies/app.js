(function() {
  'use strict';
  const A=window.AbbeyArt, S=window.AbbeyScene;
  const byId=function(id){return document.getElementById(id);};
  const state={style:'orchard',weather:'clear',hour:14,stage:2,elapsed:0,workTime:0,serviceTime:null,speed:1,paused:false,reduced:window.matchMedia('(prefers-reduced-motion: reduce)').matches,cycleDay:false,cycleBuild:false,zoom:1,panX:0,panY:0,selected:0,compare:false,stress:false,forceSort:true};
  const scenes={}, sceneRoot=byId('scenes');
  const frameIntervals=[];
  let lastTimestamp=null, lastReadout=0, noticeTimer=null, modalWasPaused=false;
  Object.keys(A.palettes).forEach(function(style){
    const container=document.createElement('div');
    container.className='scene-slot';container.dataset.style=style;container.hidden=style!==state.style;
    sceneRoot.appendChild(container);scenes[style]=new S.Scene(container,style);
  });
  A.brothers.forEach(function(b,index){
    const option=document.createElement('option');option.value=index;option.textContent=b.name;byId('person').appendChild(option);
  });
  function notify(message) {
    const node=byId('notice');node.textContent=message;node.classList.add('show');
    clearTimeout(noticeTimer);noticeTimer=setTimeout(function(){node.classList.remove('show');},3500);
  }
  function personReadout() {
    const person=A.brothers[state.selected];
    byId('person').value=state.selected;
    byId('person-name').textContent=person.name;
    byId('person-description').textContent=person.role+' · '+person.traits;
    byId('person-thought').textContent=state.serviceTime!==null?'The bell has called him to the chapel.':person.thought;
    byId('person-description').title=person.action+' '+person.reason;
    byId('portrait').innerHTML=A.portrait(state.style,state.selected);
  }
  function selectStyle(style) {
    if(!A.palettes[style])return;
    state.style=style;state.forceSort=true;frameIntervals.length=0;
    document.querySelectorAll('[data-style].style-choice').forEach(function(button){
      const active=button.dataset.style===style;button.classList.toggle('active',active);button.setAttribute('aria-pressed',String(active));
    });
    Object.keys(scenes).forEach(function(key){scenes[key].container.hidden=!state.compare&&key!==style;});
    byId('scene-caption').textContent=state.compare?'One clearing · Three art directions':A.palettes[style].name;
    byId('style-description').textContent=A.palettes[style].description;
    personReadout();render();
  }
  function setCompare(enabled) {
    state.compare=enabled;document.body.classList.toggle('comparing',enabled);
    byId('compare').setAttribute('aria-pressed',String(enabled));
    byId('compare').textContent=enabled?'Return to single study':'Compare all three';
    selectStyle(state.style);
  }
  function hourDescription(hour) {
    if(hour<5||hour>=21)return'Night';
    if(hour<8)return'Dawn';
    if(hour>=17)return'Dusk';
    return'Day';
  }
  function readout() {
    const hours=Math.floor(state.hour)%24,minutes=Math.floor((state.hour%1)*60);
    byId('hour-value').textContent=String(hours).padStart(2,'0')+':'+String(minutes).padStart(2,'0')+' · '+hourDescription(state.hour);
    byId('hour').value=state.hour;
    document.querySelectorAll('[data-hour]').forEach(function(button){button.classList.toggle('active',hourDescription(Number(button.dataset.hour))===hourDescription(state.hour));});
    byId('construction').value=state.stage;byId('construction-value').textContent=A.stageNames[state.stage];
    const service=state.serviceTime;
    byId('routine-caption').textContent=service===null?'An afternoon of work':service<12?'The bell calls them together':service<24?'Vespers · A quiet observance':'Returning to the work of the house';
    byId('vespers').disabled=service!==null;
    byId('vespers').textContent=service===null?'Call the brothers to Vespers':service<12?'Gathering at the chapel…':service<24?'A moment of quiet…':'Returning to work…';
    byId('pause').textContent=state.paused?'Resume':'Pause';byId('pause').setAttribute('aria-pressed',String(state.paused));
    byId('zoom-value').textContent=Math.round(state.zoom*100)+'%';
    byId('zoom-out').disabled=state.zoom<=.7;byId('zoom-in').disabled=state.zoom>=1.8;
  }
  function render() {Object.values(scenes).forEach(function(scene){scene.update(state);});state.forceSort=false;}
  function advance(seconds) {
    if(state.paused||state.reduced)return;
    const delta=seconds*state.speed;
    state.elapsed+=delta;
    if(state.serviceTime!==null){
      state.serviceTime+=delta;
      if(state.serviceTime>=36){state.workTime+=state.serviceTime-36;state.serviceTime=null;personReadout();}
    }else state.workTime+=delta;
    if(state.cycleDay)state.hour=(state.hour+delta/6)%24;
    if(state.cycleBuild)state.stage=Math.floor(state.elapsed/5)%6;
  }
  function frame(timestamp) {
    if(lastTimestamp!==null&&!document.hidden){
      const interval=timestamp-lastTimestamp;
      if(interval>0&&interval<1000){frameIntervals.push(interval);if(frameIntervals.length>240)frameIntervals.shift();}
      advance(Math.min(.08,interval/1000));
    }
    lastTimestamp=timestamp;
    render();
    if(timestamp-lastReadout>200){
      readout();lastReadout=timestamp;
      if(byId('timing-details').open&&frameIntervals.length>30){
        const sorted=frameIntervals.slice().sort(function(a,b){return a-b;});
        const mean=frameIntervals.reduce(function(a,b){return a+b;},0)/frameIntervals.length;
        const p95=sorted[Math.floor(sorted.length*.95)];
        byId('timing').textContent=(1000/mean).toFixed(1)+' frames/s · '+mean.toFixed(1)+' ms mean · '+p95.toFixed(1)+' ms p95. '+(state.stress?'200 figures, 1,024 test tiles and 300 test props':'12 figures')+' per visible study.';
      }
    }
    requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange',function(){lastTimestamp=null;frameIntervals.length=0;});
  document.querySelectorAll('button[data-style]').forEach(function(button){button.addEventListener('click',function(){selectStyle(button.dataset.style);});});
  byId('compare').addEventListener('click',function(){setCompare(!state.compare);});
  byId('pause').addEventListener('click',function(){state.paused=!state.paused;readout();});
  byId('hour').addEventListener('input',function(event){state.hour=Number(event.target.value);state.cycleDay=false;byId('cycle-day').checked=false;readout();render();});
  document.querySelectorAll('[data-hour]').forEach(function(button){button.addEventListener('click',function(){state.hour=Number(button.dataset.hour);state.cycleDay=false;byId('cycle-day').checked=false;readout();render();});});
  byId('cycle-day').addEventListener('change',function(event){state.cycleDay=event.target.checked;});
  byId('weather').addEventListener('change',function(event){state.weather=event.target.value;render();});
  byId('construction').addEventListener('input',function(event){state.stage=Number(event.target.value);state.cycleBuild=false;byId('build-cycle').checked=false;readout();render();});
  byId('build-cycle').addEventListener('change',function(event){state.cycleBuild=event.target.checked;});
  byId('speed').addEventListener('change',function(event){state.speed=Number(event.target.value);});
  byId('reduced-motion').checked=state.reduced;
  byId('reduced-motion').addEventListener('change',function(event){state.reduced=event.target.checked;render();});
  byId('stress').addEventListener('change',function(event){state.stress=event.target.checked;state.forceSort=true;frameIntervals.length=0;render();});
  byId('vespers').addEventListener('click',function(){
    state.serviceTime=0;state.paused=false;readout();personReadout();
    if(state.reduced)notify('The bell is called. Turn off the still-scene setting to watch the procession.');
  });
  byId('person').addEventListener('change',function(event){state.selected=Number(event.target.value);personReadout();render();});
  function zoomTo(value) {state.zoom=Math.max(.7,Math.min(1.8,Math.round(value*100)/100));readout();render();}
  byId('zoom-in').addEventListener('click',function(){zoomTo(state.zoom+.1);});
  byId('zoom-out').addEventListener('click',function(){zoomTo(state.zoom-.1);});
  byId('reset-view').addEventListener('click',function(){state.panX=0;state.panY=0;zoomTo(1);});
  Object.values(scenes).forEach(function(scene){
    let drag=null,suppressClick=false;
    function position(event){return new DOMPoint(event.clientX,event.clientY).matrixTransform(scene.svg.getScreenCTM().inverse());}
    scene.svg.addEventListener('pointerdown',function(event){
      if(event.button!==0)return;
      const point=position(event);drag={x:point.x,y:point.y,panX:state.panX,panY:state.panY,actor:event.target.closest('[data-monk]')};
      suppressClick=false;scene.svg.setPointerCapture(event.pointerId);
    });
    scene.svg.addEventListener('pointermove',function(event){
      if(!drag)return;const point=position(event),dx=point.x-drag.x,dy=point.y-drag.y;
      if(Math.abs(dx)+Math.abs(dy)>5)suppressClick=true;
      if(suppressClick){state.panX=Math.max(-350,Math.min(350,drag.panX+dx));state.panY=Math.max(-240,Math.min(240,drag.panY+dy));render();}
    });
    scene.svg.addEventListener('pointerup',function(event){
      if(!drag)return;
      const actor=drag.actor;drag=null;
      if(scene.svg.hasPointerCapture(event.pointerId))scene.svg.releasePointerCapture(event.pointerId);
      if(!suppressClick&&actor){state.selected=Number(actor.dataset.monk);selectStyle(scene.style);personReadout();render();}
    });
    scene.svg.addEventListener('pointercancel',function(){drag=null;suppressClick=true;});
  });
  document.addEventListener('keydown',function(event){
    if(event.target.closest('input,select,button,textarea,summary')||byId('event-dialog').open)return;
    if(event.code==='Space'){event.preventDefault();state.paused=!state.paused;readout();}
    const movements={ArrowLeft:[25,0],ArrowRight:[-25,0],ArrowUp:[0,25],ArrowDown:[0,-25]};
    if(movements[event.key]){
      event.preventDefault();state.panX=Math.max(-350,Math.min(350,state.panX+movements[event.key][0]));state.panY=Math.max(-240,Math.min(240,state.panY+movements[event.key][1]));render();
    }
  });
  byId('restart').addEventListener('click',function(){
    state.elapsed=0;state.workTime=0;state.serviceTime=null;state.forceSort=true;state.panX=0;state.panY=0;state.zoom=1;
    state.paused=false;readout();personReadout();render();notify('The clearing begins again. Your art, light, and weather choices are kept.');
  });
  byId('open-event').addEventListener('click',function(){
    modalWasPaused=state.paused;state.paused=true;byId('event-art').innerHTML=A.eventArt(state.style);byId('event-response').textContent='';
    byId('event-dialog').showModal();readout();
  });
  byId('close-event').addEventListener('click',function(){byId('event-dialog').close();});
  byId('event-dialog').addEventListener('close',function(){state.paused=modalWasPaused;readout();});
  const responses={
    shelter:'Martin goes to find a ladder. Thomas rolls up the plans carefully. The wall will still be there tomorrow.',
    church:'Oswin sets aside the chapel beams. Martin turns to find a dry corner in the refectory for the guests.',
    trade:'Agnes listens, then names the price. Anselm asks Oswin to bring the accounts before they promise more.'
  };
  document.querySelectorAll('[data-choice]').forEach(function(button){button.addEventListener('click',function(){byId('event-response').textContent=responses[button.dataset.choice];});});
  byId('save-frame').addEventListener('click',function(){
    render();const scene=scenes[state.style], clone=scene.svg.cloneNode(true);
    clone.setAttribute('width',1280);clone.setAttribute('height',850);
    const svg='<?xml version="1.0" encoding="UTF-8"?>\n'+new XMLSerializer().serializeToString(clone);
    const url=URL.createObjectURL(new Blob([svg],{type:'image/svg+xml'}));
    const link=document.createElement('a');link.href=url;link.download='Abbey-'+state.style+'-'+state.weather+'-'+hourDescription(state.hour).toLowerCase()+'.svg';
    document.body.appendChild(link);link.click();link.remove();setTimeout(function(){URL.revokeObjectURL(url);},3000);
    notify('Saved an editable SVG of the selected art direction.');
  });
  // A bounded inspection interface for deterministic capture and browser verification.
  window.AbbeyStudy={
    version:'0.0.1',state:state,scenes:scenes,
    render:function(){state.forceSort=true;readout();render();personReadout();},
    advance:function(seconds){advance(seconds);state.forceSort=true;readout();render();},
    selectStyle:selectStyle,
    metrics:function(){const sorted=frameIntervals.slice().sort(function(a,b){return a-b;});return {samples:sorted.length,meanMs:sorted.length?sorted.reduce(function(a,b){return a+b;},0)/sorted.length:null,p95Ms:sorted.length?sorted[Math.floor(sorted.length*.95)]:null,viewport:[innerWidth,innerHeight],userAgent:navigator.userAgent,visibleStudies:state.compare?3:1,figuresPerStudy:state.stress?200:12};}
  };
  selectStyle(state.style);readout();requestAnimationFrame(frame);
})();
