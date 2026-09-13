(function(root) {
  'use strict';
  const A=root.AbbeyArt, E=A.element, P=A.point, G=A.group;
  const routes=[
    [[12.9,10.1],[12.8,8.9],[10.7,8.1],[10.7,8.1],[12.8,8.9]],
    [[8.2,9.1],[10.6,10.4],[12.7,11.5],[12.7,11.5],[10.6,10.4]],
    [[4.6,11.8],[6.4,11.8],[7.8,9.2],[7.8,9.2],[6.4,11.8]],
    [[9.0,13.6],[9.7,13.6],[9.7,13.6],[9.0,13.6]],
    [[10.2,13.7],[11.3,13.7],[11.3,13.7],[10.2,13.7]],
    [[6.7,7.4],[8.2,9],[10.7,8.2],[8.2,9],[6.7,7.4]],
    [[2.7,8.2],[3.4,7.6],[5.1,8.3],[5.1,8.3],[3.4,7.6]],
    [[5.9,12.1],[7.8,12.2],[8.2,9.3],[7.8,12.2]],
    [[12.4,8.6],[12.9,10.4],[12.9,10.4],[12.4,8.6]],
    [[9,9.4],[10.8,10.3],[13.0,12.0],[10.8,10.3]],
    [[12.6,11.7],[11.4,10.5],[10.6,8.6],[11.4,10.5]],
    [[7.3,8.4],[5.7,8.4],[5.2,7.4],[5.7,8.4]]
  ];
  function interpolate(a,b,t){return[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];}
  function routePosition(index,time) {
    const route=routes[index%routes.length], step=5.1+(index%4)*.43;
    const progress=time/step+index*.37, segment=Math.floor(progress)%route.length, t=progress-Math.floor(progress);
    const start=route[segment],end=route[(segment+1)%route.length];
    return {position:interpolate(start,end,t),moving:start[0]!==end[0]||start[1]!==end[1],direction:end[0]-start[0]-(end[1]-start[1])};
  }
  function servicePosition(index,state) {
    const normal=routePosition(index,state.workTime), t=state.serviceTime;
    if(t===null)return normal;
    const start=normal.position, target=[6.0+(index%4)*.6,7.4+Math.floor(index/4)*.53];
    const hub=[8.15,9.15];
    const progress=t<12?t/12:t<24?1:1-(t-24)/12;
    const q=Math.max(0,Math.min(1,progress));
    let position;
    if(q<.52)position=interpolate(start,hub,q/.52);
    else position=interpolate(hub,target,(q-.52)/.48);
    return {position:position,moving:t<12||t>=24,direction:t<12?-1:1,gathered:t>=12&&t<24};
  }
  function lighting(hour) {
    const h=((hour%24)+24)%24;
    let darkness;
    if(h<5)darkness=.63;
    else if(h<8)darkness=.63*(1-(h-5)/3);
    else if(h<17)darkness=0;
    else if(h<21)darkness=.63*(h-17)/4;
    else darkness=.63;
    const dusk=Math.max(0,1-Math.abs(h-18.8)/2.5);
    return {darkness:darkness,dusk:dusk};
  }
  function ground(style) {
    const p=A.palettes[style], r=A.seeded(2304);
    let out=E('rect',{width:1280,height:850,fill:'url(#'+style+'-sky)'});
    out+=A.path('M0 183 Q160 71 335 144 Q501 29 685 108 Q872 24 1054 114 Q1174 73 1280 132 V850 H0Z',p.grass,{opacity:.55});
    out+=A.path('M0 281 Q146 167 295 208 Q366 154 478 204 Q655 135 812 192 Q1004 112 1280 254 V850 H0Z',p.ground);
    out+=A.path('M248 287 Q432 185 618 251 Q827 200 1017 321 Q1120 424 1030 576 Q997 650 786 680 Q622 737 385 653 Q234 614 212 486 Q155 349 248 287Z',p.grassLight,{opacity:.75});
    for(let i=0;i<210;i++){
      const x=r()*1280,y=240+r()*610;
      out+=A.ellipse(x,y,5+r()*24,2+r()*6,i%2?p.grass:p.grassLight,{opacity:.26});
    }
    out+=A.path('M-25 571 C91 540 115 665 252 670 C371 679 405 749 552 750 C740 750 764 800 884 769 C1054 728 1045 679 1305 709',p.water,{fill:'none',stroke:p.path,'stroke-width':49});
    out+=A.path('M-25 571 C91 540 115 665 252 670 C371 679 405 749 552 750 C740 750 764 800 884 769 C1054 728 1045 679 1305 709','none',{stroke:p.water,'stroke-width':37});
    [[84,608],[256,676],[469,745],[712,779],[934,752],[1168,706]].forEach(function(v){
      out+=A.path('M'+v[0]+' '+v[1]+' q18 -5 38 2','none',{stroke:'#e9f1d7','stroke-width':1.7,opacity:.7});
    });
    const paths=[
      [[6.4,6.6],[6.5,7.5],[8.15,9.1],[10.5,10.2],[13.5,12.8],[15.7,14.3],[17.3,15.45]],
      [[8.15,9.1],[6.5,11.9],[4.5,11.9],[4.5,11.3]],
      [[8.15,9.1],[10.4,8.1],[12.8,8.6],[12.9,10.1]],
      [[10.5,10.2],[12.4,11.6],[11.8,13.8],[8.7,13.7]],
      [[6.5,7.5],[4.6,8.3],[2.8,7.9]]
    ];
    paths.forEach(function(points){
      out+=A.line(points.map(function(v){return P(v[0],v[1]);}),p.path,25);
      out+=A.line(points.map(function(v){return P(v[0],v[1]);}),p.stoneLight,16,{opacity:.3});
    });
    const garden=[7.7,10.0,3.8,3.1];
    out+=A.tile.apply(null,garden.concat([p.woodDark,p.woodDark,3]));
    for(let row=0;row<5;row++){
      out+=A.tile(7.86,10.13+row*.6,3.48,.35,p.wood);
      for(let col=0;col<9;col++){
        const pos=P(8.02+col*.4,10.27+row*.6);
        out+=A.ellipse(pos[0],pos[1],6,3,p.leafDark);
        out+=A.path('M'+pos[0]+' '+pos[1]+' q-10 -12 -2 -8 q6 -14 7 -4 q10 -4 -1 10',row%2?p.leaf:p.leafLight,{stroke:p.leafDark,'stroke-width':.6});
      }
    }
    // Moss, small flowers, and tufts keep the foreground readable at either zoom level.
    for(let i=0;i<130;i++){
      const x=35+r()*1210,y=250+r()*550;
      if(x>340&&x<1000&&y<600)continue;
      out+=A.line([[x-3,y],[x-5,y-6],[x,y],[x+3,y-8],[x+4,y]],p.leafDark,.9,{opacity:.5});
      if(i%3===0)out+=A.circle(x+3,y-8,2.3,p.flowers)+A.circle(x+3,y-8,.6,p.stoneLight);
    }
    out+=E('g',{'data-ground-snow':'true',opacity:0},
      A.path('M0 269 Q270 190 440 245 Q772 120 1021 228 L1280 213 V699 Q1096 667 966 737 Q858 797 692 765 Q420 774 262 647 Q131 685 0 545Z','#edf1e2',{opacity:.7}));
    return out;
  }
  function props(style) {
    const p=A.palettes[style], items=[];
    function add(x,y,markup,kind){items.push({depth:P(x,y)[1],markup:G('translate('+P(x,y).join(' ')+')',markup),kind:kind||'prop'});}
    // A working well, stacked stone, and a wheelbarrow.
    let well=A.ellipse(0,0,24,11,p.stoneShade,{stroke:p.ink,'stroke-width':1});
    well+=E('rect',{x:-24,y:-16,width:48,height:16,fill:p.stoneShade});
    well+=A.ellipse(0,-16,24,11,p.stoneLight,{stroke:p.ink,'stroke-width':1.5})+A.ellipse(0,-16,16,6,p.woodDark);
    well+=A.line([[-23,-5],[-23,-63]],p.woodDark,4)+A.line([[23,-5],[23,-63]],p.woodDark,4);
    well+=A.polygon([[-34,-59],[0,-82],[35,-59],[0,-47]],p.roof,p.ink,1.3);
    well+=A.line([[0,-52],[0,-19]],p.woodDark,1);
    add(7.0,8.8,well);
    let stones='';
    for(let row=0;row<3;row++)for(let col=0;col<4-row;col++)stones+=E('rect',{x:col*19+row*5-32,y:-row*9-11,width:18,height:10,rx:style==='storybook'?2:1,fill:row%2?p.stoneLight:p.stone,stroke:p.stoneShade,'stroke-width':1.1});
    add(13,9.6,stones);
    let timber='';
    for(let row=0;row<3;row++)for(let col=0;col<3-row;col++){
      timber+=A.polygon([[col*10-31,-row*8],[col*10+26,-row*8-22],[col*10+32,-row*8-17],[col*10-24,-row*8+6]],p.wood,p.woodDark,.8);
      timber+=A.circle(col*10-27,-row*8+2,4,p.stoneShade,{stroke:p.woodDark,'stroke-width':.7});
    }
    add(12.7,11.1,timber);
    let barrow=A.polygon([[-18,-14],[13,-23],[25,-12],[-6,-3]],p.wood,p.woodDark,1.5);
    barrow+=A.circle(20,0,8,p.woodDark,{stroke:p.ink,'stroke-width':1.3})+A.circle(20,0,3,p.path)+A.line([[-12,-5],[-30,5]],p.woodDark,3);
    add(11.7,8.9,barrow);
    add(4.0,11.7,A.ellipse(0,0,12,5,p.woodDark)+E('rect',{x:-12,y:-22,width:24,height:22,rx:5,fill:p.wood,stroke:p.woodDark,'stroke-width':1})+A.ellipse(0,-22,12,5,p.wood)+A.line([[-11,-15],[11,-15]],p.woodDark,2)+A.line([[-11,-5],[11,-5]],p.woodDark,2));
    // Footbridge over the foreground stream.
    let bridge='';
    for(let i=0;i<16;i++)bridge+=A.polygon([[-35+i*4,-32+i*5],[2+i*4,-43+i*5],[6+i*4,-38+i*5],[-31+i*4,-27+i*5]],p.wood,p.woodDark,.6);
    bridge+=A.line([[-35,-43],[25,33]],p.woodDark,3)+A.line([[5,-55],[66,20]],p.woodDark,3);
    [-35,5].forEach(function(x){bridge+=A.line([[x,-43],[x,-24]],p.woodDark,3);});
    add(18.8,15.8,bridge);
    [[5.1,6.9],[7.4,6.9],[4.5,11.5],[11.3,7.15]].forEach(function(v){
      add(v[0],v[1],A.line([[0,0],[0,-28]],p.woodDark,2)+E('rect',{x:-4,y:-25,width:8,height:11,rx:1,fill:p.accent,stroke:p.ink,'stroke-width':1})+A.line([[-4,-28],[4,-28]],p.ink,2));
    });
    return items;
  }
  function Scene(container,style) {
    this.style=style;this.palette=A.palettes[style];this.prefix=style+'-';this.lastStage=-1;this.lastStress=false;this.lastSort=-1;
    this.container=container;this.items=[];this.actors=[];this.trees=[];
    container.innerHTML='<span class="scene-label">'+this.palette.name+'</span>'+E('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 1280 850',role:'img','aria-label':this.palette.name+': an animated woodland abbey with a chapel, construction site, garden and twelve brothers.'},'');
    this.svg=container.querySelector('svg');
    this.build();
  }
  Scene.prototype.build=function(){
    const style=this.style,p=this.palette;
    this.svg.innerHTML=A.defs(style,this.prefix)+
      E('title',{},p.name+' — Abbey, Candlelight')+
      E('desc',{},'An original SVG visual study. Use the adjacent controls to change light, weather, construction and the communal routine.')+
      E('g',{'data-camera':'true'},E('g',{'data-ground':'true'},ground(style))+E('g',{'data-stress-ground':'true'})+E('g',{'data-depth':'true'}))+
      E('rect',{'data-dusk':'true',width:1280,height:850,fill:'#eaad65',opacity:0,'pointer-events':'none'})+
      E('rect',{'data-dark':'true',width:1280,height:850,fill:'#142d49',opacity:0,'pointer-events':'none'})+
      E('g',{'data-light-camera':'true','pointer-events':'none'},E('g',{'data-lights':'true'})+E('g',{'data-selection-overlay':'true'},A.ellipse(0,0,15,7,'none',{stroke:'#304836','stroke-width':4})+A.ellipse(0,0,15,7,'none',{stroke:'#ffe7a1','stroke-width':2})))+
      E('g',{'data-weather':'true','pointer-events':'none'})+
      E('g',{'data-border':'true','pointer-events':'none'},style==='manuscript'?E('rect',{x:14,y:14,width:1252,height:822,rx:5,fill:'none',stroke:p.accent,'stroke-width':3})+E('rect',{x:21,y:21,width:1238,height:808,fill:'none',stroke:p.ink,'stroke-width':.8}):'');
    this.camera=this.svg.querySelector('[data-camera]');
    this.lightCamera=this.svg.querySelector('[data-light-camera]');
    this.selectionOverlay=this.svg.querySelector('[data-selection-overlay]');
    this.depth=this.svg.querySelector('[data-depth]');
    this.dark=this.svg.querySelector('[data-dark]');
    this.dusk=this.svg.querySelector('[data-dusk]');
    this.weather=this.svg.querySelector('[data-weather]');
    this.items=[];this.actors=[];this.trees=[];
    const buildings=[
      {x:4.2,y:3.4,w:4,d:3.2,h:86,r:45,kind:'chapel'},
      {x:10,y:4,w:3,d:3,h:74,r:34,kind:'construction'},
      {x:3,y:9,w:3,d:2.3,h:60,r:28,kind:'kitchen'}
    ];
    buildings.forEach(function(b){
      const node=this.addItem(P(b.x+b.w/2,b.y+b.d)[1],A.building(style,b.x,b.y,b.w,b.d,b.h,b.r,b.kind,2));
      if(b.kind==='construction'){this.construction=node;this.constructionSpec=b;}
      if(b.kind==='chapel')this.bell=node.querySelector('[data-bell]');
    },this);
    props(style).forEach(function(item){this.addItem(item.depth,item.markup);},this);
    const positions=[
      [0,1,1.1],[2,0,1.1],[4,.1,1.15],[6,0,.95],[8,.2,1.15],[10,.4,1],[12,.7,1.1],[14,1.1,1.15],[16,2,1.1],
      [.4,3,1.05],[.6,5,1.1],[1.1,7,.95],[.4,9,1.1],[1.3,11,1.05],[1.6,13,1.05],
      [17.6,4,1.1],[18,6,1.0],[18.3,8,.92],[18.1,10,.9],[17.5,12,.95],
      [3,15,1.0],[5,16,.9],[7.4,16.3,.82],[13,17.3,.95],[15.5,17.2,1.0],
      [2.4,2,1.1],[12.8,2.5,.9],[1.5,5.6,.8],[15.4,5,.9],[2,14,.8],[16.1,9.8,.7]
    ];
    const treeRandom=A.seeded(4531);
    positions.forEach(function(v,index){
      const pos=P(v[0]+(treeRandom()-.5)*.7,v[1]+(treeRandom()-.5)*.7);
      const use=E('use',{href:'#'+this.prefix+'tree'+(index%4===0?1:0)});
      const snow=A.path('M-39 -103 Q-16 -140 13 -128 Q40 -125 44 -95 Q28 -105 19 -111 Q4 -107 -6 -114 Q-24 -108 -39 -103Z','#f1f4e8',{'data-tree-snow':'true',opacity:0});
      const node=this.addItem(pos[1],G('translate('+pos.join(' ')+') scale('+v[2]+')',G('',use+snow,{'data-sway':'true'})));
      this.trees.push({node:node.querySelector('[data-sway]'),phase:index*.73,x:pos[0],y:pos[1],scale:v[2]});
    },this);
    // Thin foreground reeds.
    for(let index=0;index<12;index++){
      const x=65+index*103,y=680+Math.sin(index)*70;
      this.addItem(y,G('translate('+x+' '+y+')',A.line([[-5,0],[-10,-23]],p.leafDark,2)+A.line([[0,0],[2,-29]],p.leafDark,2)+A.line([[4,0],[11,-16]],p.leafDark,2)));
    }
    this.lights=this.svg.querySelector('[data-lights]');
    const lightLocations=[[5.1,6.9],[7.4,6.9],[4.5,11.5],[11.3,7.15]];
    this.lights.innerHTML=lightLocations.map(function(v){const pos=P(v[0],v[1],18);return A.ellipse(pos[0],pos[1]+18,58,26,'url(#'+style+'-glow)')+A.circle(pos[0],pos[1],23,'url(#'+style+'-glow)');}).join('');
    this.lights.setAttribute('opacity',0);
    const smokeAt=P(5.15,9.4,96);
    this.smoke=this.addItem(P(6,11.3)[1]+1,'');
    this.smoke.innerHTML=[0,1,2,3,4].map(function(i){return A.circle(smokeAt[0],smokeAt[1]-i*8,5+i*1.5,'#eeeadd',{opacity:.45,'data-smoke':i});}).join('');
    this.smokeOrigin=smokeAt;this.smokeNodes=Array.from(this.smoke.querySelectorAll('[data-smoke]'));
    this.createActors(12);
    this.createWeather();
    this.cacheSurfaces();
  };
  Scene.prototype.addItem=function(depth,markup){
    const node=document.createElementNS('http://www.w3.org/2000/svg','g');
    node.innerHTML=markup;this.depth.appendChild(node);this.items.push({node:node,depth:depth});return node;
  };
  Scene.prototype.createActors=function(count){
    this.actors.forEach(function(actor){actor.node.remove();});
    this.actors=[];
    for(let index=0;index<count;index++){
      const node=document.createElementNS('http://www.w3.org/2000/svg','g');
      node.setAttribute('data-monk',index%12);node.style.cursor='pointer';
      node.innerHTML=E('title',{},A.brothers[index%12].name)+
        A.ellipse(0,0,15,7,'none',{stroke:'#ffdc6b','stroke-width':2.5,'data-selection':'true',opacity:0})+
        G('',A.monk(this.style,index),{'data-body':'true'})+
        E('rect',{x:-20,y:-48,width:40,height:53,fill:'transparent'});
      this.depth.appendChild(node);
      this.actors.push({node:node,index:index,depth:0,body:node.querySelector('[data-body]'),leftLeg:node.querySelector('[data-leg=left]'),rightLeg:node.querySelector('[data-leg=right]'),leftArm:node.querySelector('[data-arm=left]'),rightArm:node.querySelector('[data-arm=right]'),load:node.querySelector('[data-load]'),selection:node.querySelector('[data-selection]')});
    }
  };
  Scene.prototype.createWeather=function(){
    const r=A.seeded(7721);let rain='',snow='',fog='';
    this.particles=[];
    for(let i=0;i<90;i++){
      const particle={x:r()*1360,y:r()*900,rate:.7+r()*.6,drift:r()*6};this.particles.push(particle);
      rain+=A.line([[0,0],[-6,17]],'#deebe6',1.5,{opacity:.7,'data-rain':i});
      snow+=A.circle(0,0,1.4+r()*1.8,'#fffef5',{opacity:.8,'data-flake':i});
    }
    for(let i=0;i<6;i++)fog+=A.ellipse(230+i*190,310+i%3*170,360,85,'url(#'+this.prefix+'soft-fog)',{opacity:.35,'data-fog':i});
    this.weather.innerHTML=E('g',{'data-rain-layer':'true',opacity:0},E('rect',{width:1280,height:850,fill:'#496a79',opacity:.13})+rain)+E('g',{'data-snow-layer':'true',opacity:0},snow)+E('g',{'data-fog-layer':'true',opacity:0},E('rect',{width:1280,height:850,fill:'url(#'+this.prefix+'mist)',opacity:.38})+fog);
    this.rain=this.weather.querySelector('[data-rain-layer]');this.snow=this.weather.querySelector('[data-snow-layer]');this.fog=this.weather.querySelector('[data-fog-layer]');
    this.rainNodes=Array.from(this.weather.querySelectorAll('[data-rain]'));this.snowNodes=Array.from(this.weather.querySelectorAll('[data-flake]'));this.fogNodes=Array.from(this.weather.querySelectorAll('[data-fog]'));
  };
  Scene.prototype.cacheSurfaces=function(){
    this.snowSurfaces=Array.from(this.svg.querySelectorAll('[data-snow],[data-tree-snow],[data-ground-snow]'));
    this.windows=Array.from(this.svg.querySelectorAll('[data-window]'));
  };
  Scene.prototype.setStress=function(enabled){
    this.lastStress=enabled;this.createActors(enabled?200:12);
    let groundMarkup='';
    if(enabled){
      const r=A.seeded(1402);
      for(let x=0;x<32;x++)for(let y=0;y<32;y++)groundMarkup+=A.tile(x*.55,y*.55,.54,.54,this.palette.grassLight,'',0).replace('<polygon ','<polygon opacity=".08" ');
      for(let i=0;i<300;i++){const pos=P(r()*18,r()*18);groundMarkup+=A.ellipse(pos[0],pos[1],2+r()*5,1+r()*3,this.palette.stoneShade,{opacity:.5});}
    }
    this.svg.querySelector('[data-stress-ground]').innerHTML=groundMarkup;
  };
  Scene.prototype.update=function(state){
    if(this.container.hidden)return;
    const time=state.elapsed, staticMotion=state.reduced;
    if(state.stress!==this.lastStress)this.setStress(state.stress);
    if(state.stage!==this.lastStage){
      const b=this.constructionSpec;
      this.construction.innerHTML=A.building(this.style,b.x,b.y,b.w,b.d,b.h,b.r,b.kind,state.stage);
      this.lastStage=state.stage;this.cacheSurfaces();
    }
    const transform='translate('+state.panX+' '+state.panY+') translate(640 450) scale('+state.zoom+') translate(-640 -450)';
    this.camera.setAttribute('transform',transform);this.lightCamera.setAttribute('transform',transform);
    const light=lighting(state.hour);
    this.dark.setAttribute('opacity',light.darkness.toFixed(3));this.dusk.setAttribute('opacity',(light.dusk*.12).toFixed(3));
    this.lights.setAttribute('opacity',(light.darkness*1.8).toFixed(3));
    this.windows.forEach(function(node){node.setAttribute('fill',light.darkness>.25?'#ffda87':'#d7bb7d');});
    const snowy=state.weather==='snow';
    this.snowSurfaces.forEach(function(node){node.setAttribute('opacity',snowy?1:0);});
    this.rain.setAttribute('opacity',state.weather==='rain'?1:0);this.snow.setAttribute('opacity',snowy?1:0);this.fog.setAttribute('opacity',state.weather==='fog'?1:0);
    this.actors.forEach(function(actor){
      const i=actor.index;
      let pose=i<12?servicePosition(i,state):routePosition(i,state.workTime);
      if(i>=12)pose.position=[1.5+(i%16)*.93,1.7+Math.floor(i/16)*1.05];
      const pos=P(pose.position[0],pose.position[1]),moving=pose.moving&&!staticMotion;
      actor.depth=pos[1];
      actor.node.setAttribute('transform','translate('+pos[0].toFixed(2)+' '+pos[1].toFixed(2)+')');
      const stride=moving?Math.sin(time*7.8+i)*22:0;
      actor.leftLeg.setAttribute('transform','rotate('+stride.toFixed(1)+' -5 -8)');actor.rightLeg.setAttribute('transform','rotate('+(-stride).toFixed(1)+' 5 -8)');
      const working=!pose.moving&&state.serviceTime===null&&!staticMotion;
      const arm=working?Math.sin(time*3.3+i)*15:stride*.7;
      actor.leftArm.setAttribute('transform','rotate('+arm.toFixed(1)+' -6 -25)');actor.rightArm.setAttribute('transform','rotate('+(-arm).toFixed(1)+' 6 -25)');
      actor.body.setAttribute('transform',pose.gathered?'translate(0 3) scale(1 .91)':'translate(0 0)');
      actor.load.setAttribute('opacity',state.serviceTime===null&&(i%3===0||i===2)?1:0);
      actor.selection.setAttribute('opacity',i===state.selected?1:0);
    });
    if(Math.floor(time*7)!==this.lastSort||state.forceSort){
      this.lastSort=Math.floor(time*7);
      this.items.concat(this.actors).sort(function(a,b){return a.depth-b.depth;}).forEach(function(item){this.depth.appendChild(item.node);},this);
    }
    const selectedPose=servicePosition(state.selected,state),selectedPoint=P(selectedPose.position[0],selectedPose.position[1]);
    this.selectionOverlay.setAttribute('transform','translate('+selectedPoint.join(' ')+')');
    this.trees.forEach(function(tree){
      tree.node.setAttribute('transform','rotate('+((staticMotion?0:Math.sin(time*.62+tree.phase)*.75)).toFixed(2)+' 0 -10)');
      const obscures=tree.y>selectedPoint[1]&&Math.abs(tree.x-selectedPoint[0])<56*tree.scale&&selectedPoint[1]>tree.y-150*tree.scale&&selectedPoint[1]<tree.y-20*tree.scale;
      tree.node.setAttribute('opacity',obscures?.28:1);
    });
    this.smokeNodes.forEach(function(node,i){
      const progress=((staticMotion?i*.21:time*.1+i*.21)%1);
      node.setAttribute('cx',this.smokeOrigin[0]+Math.sin(progress*3)*15);
      node.setAttribute('cy',this.smokeOrigin[1]-progress*49);
      node.setAttribute('r',4+progress*10);node.setAttribute('opacity',(1-progress)*.48);
    },this);
    if(this.bell){
      const ringing=state.serviceTime!==null&&state.serviceTime<8&&!staticMotion;
      this.bell.setAttribute('transform','translate(0 -20) rotate('+(ringing?Math.sin(time*8)*20:0)+')');
    }
    if(state.weather==='rain'||snowy){
      this.particles.forEach(function(p,i){
        const t=staticMotion?0:time;
        if(snowy){
          this.snowNodes[i].setAttribute('cx',((p.x+Math.sin(t*.55+i)*15-t*p.drift)+1400)%1400-60);
          this.snowNodes[i].setAttribute('cy',(p.y+t*24*p.rate)%920-35);
        }else{
          const y=(p.y+t*460*p.rate)%940-40,x=((p.x-t*110*p.rate)%1400+1400)%1400-60;
          this.rainNodes[i].setAttribute('transform','translate('+x.toFixed(1)+' '+y.toFixed(1)+')');
        }
      },this);
    }
    if(state.weather==='fog')this.fogNodes.forEach(function(node,i){node.setAttribute('transform','translate('+(staticMotion?0:Math.sin(time*.075+i)*90)+' 0)');});
    this.svg.setAttribute('data-weather',state.weather);this.svg.setAttribute('data-stage',state.stage);
  };
  root.AbbeyScene={Scene:Scene,routePosition:routePosition,servicePosition:servicePosition,lighting:lighting};
})(globalThis);
