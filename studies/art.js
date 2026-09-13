/* Original procedural SVG artwork for Abbey. No external fonts, images, or libraries. */
(function (root) {
  'use strict';
  const palettes = {
    orchard: {
      name: 'Orchard Cloister', ink: '#40533b', outline: 1.65,
      sky: '#e6edd1', ground: '#bbcf98', grass: '#a4bd7e', grassLight: '#cfdfa7',
      leaf: '#6f984f', leafDark: '#487646', leafLight: '#a1bb65', trunk: '#78684a',
      stone: '#e4cfa5', stoneShade: '#c9b589', stoneLight: '#f3e3be',
      roof: '#b66c49', roofShade: '#884f39', wood: '#b79161', woodDark: '#7b6548',
      path: '#decfa7', water: '#87b8af', habit: '#68533e', habitLight: '#897053',
      accent: '#d4a149', flowers: '#d78974', skin: '#dbac7c',
      description: 'Rounded canopies, clear contours, terracotta roofs, and warm limestone. A simple, readable world with room for architectural detail.'
    },
    manuscript: {
      name: 'Living Manuscript', ink: '#3d4542', outline: 2,
      sky: '#e8dfbc', ground: '#c8cc93', grass: '#a5b478', grassLight: '#dedcab',
      leaf: '#387972', leafDark: '#235c59', leafLight: '#76a389', trunk: '#766249',
      stone: '#e5cb92', stoneShade: '#c09c63', stoneLight: '#f2dfad',
      roof: '#996073', roofShade: '#754456', wood: '#b28e59', woodDark: '#796344',
      path: '#e7d8ad', water: '#6aa4ae', habit: '#514c59', habitLight: '#797084',
      accent: '#b78c37', flowers: '#af606e', skin: '#d3a17a',
      description: 'Leaf-shaped trees, inked architectural details, patterned roofs, and gilded margins. The strongest manuscript character of the three.'
    },
    storybook: {
      name: 'Sunlit Storybook', ink: '#657657', outline: .85,
      sky: '#e4ecd9', ground: '#c5d6ae', grass: '#aac799', grassLight: '#d8e4bd',
      leaf: '#86ac78', leafDark: '#608c68', leafLight: '#b6ce8a', trunk: '#948166',
      stone: '#efdac0', stoneShade: '#d6bea5', stoneLight: '#faead4',
      roof: '#b68990', roofShade: '#926b80', wood: '#bea17c', woodDark: '#967857',
      path: '#e5d9bc', water: '#a2c8c2', habit: '#897466', habitLight: '#ac9580',
      accent: '#c09b5e', flowers: '#d0a0b4', skin: '#e5b995',
      description: 'Cloudlike trees, softer edges, lavender roofs, and broad pools of color. Gentle and inviting, with fewer inked boundaries.'
    }
  };
  const stageNames = ['Survey & ropes', 'Foundations', 'Walls & piers', 'Arches & scaffolds', 'The timber roof', 'A finished chapel'];
  const brothers = [
    {name:'Brother Thomas', role:'Aspiring mason', traits:'Ambitious · Exacting', thought:'“One day, there will be an arch here that outlives all of us.”', action:'Carrying stone to the chapel.', reason:'He has volunteered to help Walter with the new bay.', skin:'#d6a16c', beard:false},
    {name:'Brother Oswin', role:'Cellarer', traits:'Exacting · Cautious', thought:'“A fine church still needs a full storehouse.”', action:'Checking the timber stores.', reason:'He wants to know what remains before promising more.', skin:'#c79361', beard:true},
    {name:'Brother Martin', role:'Cook', traits:'Generous · Sociable', thought:'“There is always room for one more bowl.”', action:'Taking provisions to the kitchen.', reason:'The evening meal will soon need his attention.', skin:'#e4b98e', beard:false},
    {name:'Brother Hugh', role:'Gardener', traits:'Patient · Cautious', thought:'“The ground is telling us something. Give it a moment.”', action:'Tending the garden.', reason:'He is showing Peter how to loosen the soil.', skin:'#b67f55', beard:true},
    {name:'Peter', role:'Novice', traits:'Curious · Restless', thought:'“Can I try the saw when we finish?”', action:'Helping in the garden.', reason:'Hugh has asked him to finish one row carefully.', skin:'#edc098', beard:false},
    {name:'Brother Anselm', role:'Acting superior', traits:'Patient · Cautious', thought:'“Let us promise only what we can keep.”', action:'Walking between the worksite and the house.', reason:'He is listening before deciding the next priority.', skin:'#d1a07b', beard:true},
    {name:'Brother Edmund', role:'Study extra', traits:'Quiet · Observant', thought:'“Even the woodpecker seems to have a task.”', action:'Walking the clearing.', reason:'A background figure for testing silhouettes and animation.', skin:'#cc9567', beard:false},
    {name:'Brother Luke', role:'Study extra', traits:'Cheerful · Patient', thought:'“We have made a good beginning.”', action:'Bringing a basket to the house.', reason:'A background figure for testing carrying poses.', skin:'#ac794f', beard:true},
    {name:'Brother William', role:'Study extra', traits:'Steady · Careful', thought:'“Measure once more before we lift it.”', action:'Inspecting a stack of stone.', reason:'A background figure for testing scale and motion.', skin:'#e0b28d', beard:false},
    {name:'Brother Robert', role:'Study extra', traits:'Sociable · Curious', thought:'“I wonder what Agnes will bring tomorrow.”', action:'Crossing the clearing.', reason:'A background figure for testing movement and overlap.', skin:'#cc936d', beard:true},
    {name:'Brother Gilbert', role:'Study extra', traits:'Practical · Patient', thought:'“A dry roof is a blessing in any season.”', action:'Carrying a beam.', reason:'A background figure for testing the timber animation.', skin:'#e0ad7e', beard:false},
    {name:'Brother Stephen', role:'Study extra', traits:'Gentle · Quiet', thought:'“Listen. The bell carries all the way to the trees.”', action:'Walking past the well.', reason:'A background figure for testing the shared routine.', skin:'#bf8759', beard:false}
  ];
  function escape(value) { return String(value).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function element(name, attrs, content) {
    const attributes = Object.entries(attrs || {}).filter(function(pair){return pair[1] !== undefined;})
      .map(function(pair){return ' '+pair[0]+'="'+escape(pair[1])+'"';}).join('');
    return '<'+name+attributes+'>'+(content || '')+'</'+name+'>';
  }
  function point(x, y, z) { return [640+(x-y)*36, 134+(x+y)*18-(z || 0)]; }
  function polygon(points, fill, stroke, width, extra) {
    return element('polygon', Object.assign({points:points.map(function(p){return p.map(function(n){return +n.toFixed(2);}).join(',');}).join(' '),fill:fill,stroke:stroke || 'none','stroke-width':width || 0,'stroke-linejoin':'round'},extra));
  }
  function line(points, stroke, width, extra) {
    return element('polyline',Object.assign({points:points.map(function(p){return p.join(',');}).join(' '),fill:'none',stroke:stroke,'stroke-width':width || 1.5,'stroke-linecap':'round','stroke-linejoin':'round'},extra));
  }
  function circle(x,y,r,fill,extra) { return element('circle',Object.assign({cx:x,cy:y,r:r,fill:fill},extra)); }
  function ellipse(x,y,rx,ry,fill,extra) { return element('ellipse',Object.assign({cx:x,cy:y,rx:rx,ry:ry,fill:fill},extra)); }
  function path(d,fill,extra){return element('path',Object.assign({d:d,fill:fill},extra));}
  function group(transform, content, extra) { return element('g',Object.assign({transform:transform},extra),content); }
  function seeded(seed) {
    let value=seed>>>0;
    return function(){value=(Math.imul(1664525,value)+1013904223)>>>0;return value/4294967296;};
  }
  function tile(x,y,w,d,fill,stroke,width) {return polygon([point(x,y),point(x+w,y),point(x+w,y+d),point(x,y+d)],fill,stroke,width);}
  function tree(style, variant) {
    const p=palettes[style], outline={stroke:p.ink,'stroke-width':p.outline,'stroke-linejoin':'round'};
    let artwork=ellipse(2,1,27,11,'#33462a',{opacity:.12});
    artwork+=path('M-6 0 L-4 -62 L5 -66 L8 0 Z',p.trunk,outline);
    artwork+=line([[-1,-32],[-20,-61]],p.trunk,6)+line([[2,-43],[25,-69]],p.trunk,5);
    if(style==='manuscript'){
      artwork+=path('M0 -139 C-47 -113 -58 -75 -30 -51 C-8 -34 22 -38 38 -59 C58 -89 25 -120 0 -139Z',p.leafDark,outline);
      [[-22,-82,-27],[18,-103,23],[22,-68,54],[-17,-113,-20],[0,-64,0]].forEach(function(v,i){
        artwork+=group('translate('+v[0]+' '+v[1]+') rotate('+v[2]+')',path('M0 23 C-28 6 -23 -24 0 -39 C22 -22 27 5 0 23Z',i%2?p.leaf:p.leafLight,outline)+line([[0,17],[0,-27]],p.ink,1)+line([[0,-2],[-10,-13]],p.ink,1)+line([[0,-13],[11,-24]],p.ink,1));
      });
      artwork+=circle(0,-141,4,p.accent);
    }else if(style==='storybook'){
      artwork+=path('M-9 -46 C-51 -35 -63 -63 -47 -82 C-71 -107 -41 -135 -18 -123 C-9 -153 35 -146 40 -122 C74 -115 71 -84 49 -75 C56 -45 23 -33 -9 -46Z',p.leafDark);
      artwork+=path('M-15 -60 C-56 -59 -46 -92 -34 -94 C-48 -118 -19 -134 -4 -119 C12 -142 43 -120 36 -103 C61 -94 39 -68 22 -73 C15 -56 -1 -52 -15 -60Z',p.leaf);
      artwork+=ellipse(-17,-105,24,15,p.leafLight,{opacity:.65})+ellipse(16,-116,17,12,p.leafLight,{opacity:.45});
    }else{
      artwork+=ellipse(0,-80,46,43,p.leafDark,outline);
      artwork+=circle(-24,-96,25,p.leaf,outline)+circle(4,-119,29,p.leaf,outline)+circle(29,-88,28,p.leaf,outline);
      artwork+=circle(-10,-95,33,p.leaf)+ellipse(-10,-118,20,10,p.leafLight,{opacity:.7});
      artwork+=ellipse(-32,-93,10,5,p.leafLight,{opacity:.55})+ellipse(26,-95,11,6,p.leafLight,{opacity:.45});
    }
    if(variant===1){[[-25,-87],[16,-110],[32,-78],[-6,-65]].forEach(function(v){artwork+=circle(v[0],v[1],3.1,p.flowers,{stroke:p.ink,'stroke-width':.5});});}
    return artwork;
  }
  function defs(style,prefix) {
    const p=palettes[style];
    const radial=element('radialGradient',{id:prefix+'glow'},element('stop',{offset:'0%','stop-color':'#ffd47a','stop-opacity':.85})+element('stop',{offset:'45%','stop-color':'#ffd47a','stop-opacity':.3})+element('stop',{offset:'100%','stop-color':'#ffd47a','stop-opacity':0}));
    const mist=element('linearGradient',{id:prefix+'mist',x1:0,y1:0,x2:0,y2:1},element('stop',{offset:0,'stop-color':'#f1f4e7','stop-opacity':0})+element('stop',{offset:1,'stop-color':'#f1f4e7','stop-opacity':.85}));
    const softFog=element('radialGradient',{id:prefix+'soft-fog'},element('stop',{offset:'0%','stop-color':'#f1f4e7','stop-opacity':.8})+element('stop',{offset:'100%','stop-color':'#f1f4e7','stop-opacity':0}));
    const sky=element('linearGradient',{id:prefix+'sky',x1:0,y1:0,x2:0,y2:1},element('stop',{offset:0,'stop-color':p.sky})+element('stop',{offset:1,'stop-color':p.ground}));
    return element('defs',{},radial+mist+softFog+sky+element('g',{id:prefix+'tree0'},tree(style,0))+element('g',{id:prefix+'tree1'},tree(style,1)));
  }
  function frontFeature(x,y,z,width,height,p,kind) {
    const at=point(x,y,z);
    let content=path('M0 0 V'+(-height+width/2)+' Q'+(width/2)+' '+(-height-width/2)+' '+width+' '+(-height+width/2)+' V0Z',kind==='door'?p.woodDark:'#655e44',{stroke:p.ink,'stroke-width':1.5});
    if(kind==='door'){
      for(let u=5;u<width;u+=6)content+=line([[u,0],[u,-height+8]],p.wood,1);
      content+=circle(width*.75,-height*.4,1.5,p.accent);
    }else if(kind==='window'){
      content+=path('M3 -2 V'+(-height+width/2)+' Q'+(width/2)+' '+(-height+1)+' '+(width-3)+' '+(-height+width/2)+' V-2Z','#d7bb7d',{'data-window':'true'});
      content+=line([[width/2,-2],[width/2,-height+4]],p.ink,1.5);
    }
    return group('matrix(1 .5 0 1 '+at[0]+' '+at[1]+')',content);
  }
  function building(style,x,y,w,d,height,roofHeight,kind,stage) {
    const p=palettes[style], s=stage===undefined?5:stage, construction=kind==='construction';
    const A=function(z){return point(x,y,z);},B=function(z){return point(x+w,y,z);},C=function(z){return point(x+w,y+d,z);},D=function(z){return point(x,y+d,z);};
    let result=polygon([A(0),B(0),point(x+w+.4,y+d+.4),point(x+.1,y+d+.4)],'#435234','',0,{opacity:.13});
    if(construction && s===0){
      result+=polygon([A(0),B(0),C(0),D(0)],p.path,p.woodDark,2,{'stroke-dasharray':'6 5'});
      [A(0),B(0),C(0),D(0)].forEach(function(a){result+=line([[a[0],a[1]],[a[0],a[1]-13]],p.woodDark,3);});
      return result;
    }
    const h=construction?[0,10,40,height,height,height][s]:height;
    if(construction&&s<4){
      result+=polygon([A(0),B(0),B(h),A(h)],p.stone,p.ink,p.outline);
      result+=polygon([A(0),D(0),D(h),A(h)],p.stoneShade,p.ink,p.outline);
      result+=polygon([point(x+.2,y+.2,1),point(x+w-.2,y+.2,1),point(x+w-.2,y+d-.2,1),point(x+.2,y+d-.2,1)],p.path);
      result+=polygon([point(x+.2,y+.2,1),point(x+w-.2,y+.2,1),point(x+w-.2,y+.2,h),point(x+.2,y+.2,h)],p.stoneLight,p.stoneShade,1);
      result+=polygon([point(x+.2,y+.2,1),point(x+.2,y+d-.2,1),point(x+.2,y+d-.2,h),point(x+.2,y+.2,h)],p.stone,p.stoneShade,1);
    }
    result+=polygon([B(0),C(0),C(h),B(h)],p.stoneShade,p.ink,p.outline);
    result+=polygon([D(0),C(0),C(h),D(h)],kind==='kitchen'?p.wood:p.stone,p.ink,p.outline);
    if(construction && s<4){
      const outer=[A(h),B(h),C(h),D(h)];
      const inner=[point(x+.22,y+.22,h),point(x+w-.22,y+.22,h),point(x+w-.22,y+d-.22,h),point(x+.22,y+d-.22,h)];
      for(let i=0;i<4;i++)result+=polygon([outer[i],outer[(i+1)%4],inner[(i+1)%4],inner[i]],p.stoneLight,p.stoneShade,.7);
    }else result+=polygon([A(h),B(h),C(h),D(h)],p.stoneLight,p.ink,p.outline);
    for(let z=12;z<h;z+=12){
      result+=line([D(z),C(z),B(z)],p.woodDark,.7,{opacity:.3});
      for(let u=.5+(Math.floor(z/12)%2)*.4;u<w;u+=.8)result+=line([point(x+u,y+d,z),point(x+u,y+d,z-11)],p.woodDark,.7,{opacity:.28});
    }
    if(s>=2||!construction){
      const doorWidth=kind==='chapel'?26:21;
      result+=frontFeature(x+w*.42,y+d,0,doorWidth,Math.min(43,h-3),p,construction&&s<5?'opening':'door');
      if(h>50){
        result+=frontFeature(x+.34,y+d,24,12,24,p,'window');
        if(w>2.5)result+=frontFeature(x+w-.76,y+d,24,12,24,p,'window');
      }
    }
    if((s>=4||!construction)){
      const ridgeBack=point(x+w/2,y,height+roofHeight), ridgeFront=point(x+w/2,y+d,height+roofHeight);
      result+=polygon([D(height),C(height),ridgeFront],p.stoneLight,p.ink,p.outline);
      if(style==='manuscript'){
        result+=circle((D(height)[0]+C(height)[0])/2,(D(height)[1]+C(height)[1])/2-22,8,p.accent,{stroke:p.ink,'stroke-width':1.5});
        result+=line([[ridgeFront[0]-6,ridgeFront[1]+15],[ridgeFront[0]+6,ridgeFront[1]+15]],p.ink,1.2);
      }
      result+=polygon([A(height),ridgeBack,ridgeFront,D(height)],p.roof,p.ink,p.outline);
      result+=polygon([ridgeBack,B(height),C(height),ridgeFront],p.roofShade,p.ink,p.outline);
      for(let t=.18;t<1;t+=.18){
        const back=point(x+w/2+w/2*t,y,height+roofHeight*(1-t));
        const front=point(x+w/2+w/2*t,y+d,height+roofHeight*(1-t));
        result+=line([back,front],p.roof,.9,{opacity:.65});
      }
      if(style==='manuscript'){
        for(let v=.25;v<d;v+=.48)result+=line([point(x,y+v,height),point(x+w/2,y+v,height+roofHeight),point(x+w,y+v,height)],p.accent,.75,{opacity:.7});
      }
      result+=polygon([A(height),ridgeBack,ridgeFront,D(height)],'#f5f7e8','',0,{'data-snow':'roof',opacity:0});
      result+=polygon([ridgeBack,B(height),C(height),ridgeFront],'#e3ecdf','',0,{'data-snow':'roof',opacity:0});
      if(construction && s===4){
        result+=polygon([point(x+w*.55,y+d*.5,height+roofHeight*.9),point(x+w,y+d*.5,height),C(height),ridgeFront],p.wood,p.ink,1);
        for(let v=d*.52;v<d;v+=.34)result+=line([point(x+w/2,y+v,height+roofHeight),point(x+w,y+v,height)],p.woodDark,3);
      }
      if(kind==='chapel'){
        const b=point(x+w/2,y+.8,height+roofHeight);
        result+=group('translate('+b[0]+' '+b[1]+')',
          polygon([[-14,3],[14,3],[14,-28],[-14,-28]],p.wood,p.ink,1.5)+
          path('M-8 -3 V-20 Q0 -32 8 -20 V-3Z',p.woodDark)+
          group('translate(0 -20)',path('M-5 3 Q-5 9 -8 12 H8 Q5 9 5 3Z',p.accent,{stroke:p.ink,'stroke-width':1})+circle(0,14,2,p.ink),{'data-bell':'true'})+
          polygon([[-19,-28],[0,-47],[19,-28]],p.roofShade,p.ink,1.5)+line([[0,-47],[0,-59]],p.ink,2)+line([[-5,-54],[5,-54]],p.ink,2));
      }
      if(kind==='kitchen'){
        const chimney=point(x+w*.72,y+.4,height+roofHeight*.6);
        result+=group('translate('+chimney[0]+' '+chimney[1]+')',element('rect',{x:-7,y:-31,width:14,height:30,fill:p.stone,stroke:p.ink,'stroke-width':1.2})+line([[-9,-31],[9,-31]],p.stoneShade,5));
      }
    }
    if(construction && s>=2&&s<5){
      const sh=height+11;
      [.05,w+.3].forEach(function(u){
        result+=line([point(x+u,y+d+.35,0),point(x+u,y+d+.35,sh)],p.woodDark,4);
      });
      result+=line([point(x+.05,y+d+.35,sh-10),point(x+w+.3,y+d+.35,sh-10)],p.wood,7);
      result+=line([point(x+.05,y+d+.35,sh-28),point(x+w+.3,y+d+.35,sh-28)],p.woodDark,2.5);
      result+=line([point(x+.05,y+d+.35,8),point(x+w+.3,y+d+.35,sh-29)],p.woodDark,2.5);
      const ladderStart=point(x+w+.6,y+d+.7,0), ladderEnd=point(x+w+.3,y+d+.35,sh-9);
      [-4,4].forEach(function(o){result+=line([[ladderStart[0]+o,ladderStart[1]],[ladderEnd[0]+o,ladderEnd[1]]],p.woodDark,2);});
      for(let t=.1;t<1;t+=.12)result+=line([[ladderStart[0]*(1-t)+ladderEnd[0]*t-4,ladderStart[1]*(1-t)+ladderEnd[1]*t],[ladderStart[0]*(1-t)+ladderEnd[0]*t+4,ladderStart[1]*(1-t)+ladderEnd[1]*t]],p.woodDark,2);
      if(s===3){
        const at=point(x+w*.4,y+d,0);
        result+=group('matrix(1 .5 0 1 '+at[0]+' '+at[1]+')',path('M-3 -40 Q12 -74 31 -40 L26 -37 Q12 -65 1 -37Z',p.wood,{stroke:p.woodDark,'stroke-width':1})+line([[14,-42],[14,-65]],p.woodDark,2));
      }
    }
    return result;
  }
  function monk(style,index,portrait) {
    const p=palettes[style], person=brothers[index%brothers.length], habit=index%3===1?p.habitLight:p.habit;
    const stroke={stroke:p.ink,'stroke-width':portrait?1.1:.9,'stroke-linejoin':'round'};
    let result=ellipse(0,0,10,4,'#2c402a',{opacity:.2,'data-shadow':'true'});
    result+=group('',path('M-6 -8 L-6 0', 'none',{stroke:p.woodDark,'stroke-width':4,'stroke-linecap':'round'}),{'data-leg':'left'});
    result+=group('',path('M5 -8 L5 0', 'none',{stroke:p.woodDark,'stroke-width':4,'stroke-linecap':'round'}),{'data-leg':'right'});
    result+=path(style==='manuscript'?'M-6 -28 L6 -28 L12 -3 L-11 -3Z':'M-5 -28 Q0 -31 6 -28 Q8 -17 11 -4 Q0 1 -11 -4 Q-8 -17 -5 -28Z',habit,stroke);
    result+=path('M-4 -25 Q-1 -13 -4 -5 L3 -4 Q1 -17 4 -25Z',p.habitLight,{opacity:.6});
    result+=line([[-8,-17],[8,-16]],p.woodDark,1.3);
    result+=group('',line([[-6,-26],[-10,-17],[-8,-12]],habit,5),{'data-arm':'left'});
    result+=group('',line([[6,-26],[10,-17],[9,-11]],habit,5),{'data-arm':'right'});
    result+=ellipse(0,-31,8,7,p.habitLight,stroke);
    result+=circle(0,-36,7.2,person.skin,stroke)+path('M-7 -37 Q-7 -47 0 -45 Q8 -45 7 -37 Q3 -39 0 -39 Q-4 -39 -7 -37Z',index===5?'#b8b4a2':p.woodDark);
    result+=ellipse(0,-43,3.8,2.5,person.skin);
    result+=circle(-2.7,-36.5,.7,p.ink)+circle(2.7,-36.5,.7,p.ink);
    if(person.beard)result+=path('M-5 -33 Q0 -27 5 -33 Q4 -26 0 -25 Q-4 -26 -5 -33Z',index===5?'#c9c3ad':p.woodDark);
    else result+=path('M-2 -32 Q0 -31 2 -32','none',{stroke:p.ink,'stroke-width':.6});
    result+=group('',element('rect',{x:-12,y:-20,width:24,height:9,rx:2,fill:index%3===0?p.stone:p.wood,stroke:p.woodDark,'stroke-width':1}),{'data-load':'true'});
    return result;
  }
  function portrait(style,index) {return element('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 84 100'},group('translate(42 108) scale(2.2)',monk(style,index,true)));}
  function eventArt(style) {
    const p=palettes[style];let art=element('rect',{width:640,height:240,fill:p.sky});
    art+=path('M0 80 Q110 30 230 80 Q440 18 640 75 V240 H0Z',p.grass);
    art+=group('translate(88 180) scale(.92)',tree(style,0))+group('translate(592 171) scale(1.1)',tree(style,1));
    art+=element('rect',{x:165,y:78,width:300,height:130,fill:p.stone,stroke:p.ink,'stroke-width':2});
    art+=polygon([[144,82],[316,12],[488,82]],p.roof,p.ink,2);
    for(let y=100;y<200;y+=21)art+=line([[165,y],[465,y]],p.stoneShade,1);
    art+=path('M289 208 V143 Q317 94 345 143 V208Z',p.woodDark);
    for(let i=0;i<5;i++)art+=element('rect',{x:365+i*3,y:195-i*10,width:104,height:9,rx:2,fill:p.wood,stroke:p.woodDark,'stroke-width':1});
    art+=group('translate(243 229) scale(2.7)',monk(style,1,true))+group('translate(360 232) scale(2.8)',monk(style,0,true));
    for(let i=0;i<35;i++){const x=(i*97)%640,y=(i*41)%230;art+=line([[x,y],[x-5,y+14]],'#a6b8ac',1.3,{opacity:.65});}
    if(style==='manuscript')art+=element('rect',{x:9,y:9,width:622,height:222,fill:'none',stroke:p.accent,'stroke-width':3})+element('rect',{x:15,y:15,width:610,height:210,fill:'none',stroke:p.ink,'stroke-width':.8});
    return element('svg',{xmlns:'http://www.w3.org/2000/svg',viewBox:'0 0 640 240',role:'img','aria-label':'Two brothers discuss a small stack of timber outside the guesthouse in the rain.'},art);
  }
  root.AbbeyArt={palettes:palettes,stageNames:stageNames,brothers:brothers,element:element,point:point,polygon:polygon,line:line,circle:circle,ellipse:ellipse,path:path,group:group,tile:tile,seeded:seeded,defs:defs,building:building,monk:monk,portrait:portrait,eventArt:eventArt};
})(globalThis);
