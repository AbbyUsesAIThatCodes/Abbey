/* Small deterministic DOM fixture for this study's logic tests and SVG capture.
 * This is not a browser, CSS layout engine, or substitute for browser QA.
 */
'use strict';
const xml=require('xml-js');
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
function escape(value){return String(value).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');}
class Node {
  constructor(name,attributes={},text=null){this.tagName=name;this.attributes={...attributes};this.children=[];this.parentElement=null;this.events={};this.style={};this._text=text;this._value=null;}
  appendChild(node){
    if(node.parentElement)node.parentElement.children.splice(node.parentElement.children.indexOf(node),1);
    node.parentElement=this;this.children.push(node);return node;
  }
  remove(){if(this.parentElement){const parent=this.parentElement;parent.children.splice(parent.children.indexOf(this),1);this.parentElement=null;}}
  setAttribute(name,value){this.attributes[name]=String(value);}
  getAttribute(name){return this.attributes[name]??null;}
  hasAttribute(name){return Object.hasOwn(this.attributes,name);}
  removeAttribute(name){delete this.attributes[name];}
  get dataset(){const node=this;return new Proxy({}, {get(_,key){return node.getAttribute('data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase()));},set(_,key,value){node.setAttribute('data-'+String(key).replace(/[A-Z]/g,c=>'-'+c.toLowerCase()),value);return true;}});}
  get className(){return this.getAttribute('class')||'';}
  set className(value){this.setAttribute('class',value);}
  get classList(){const node=this;return {contains(name){return node.className.split(/\s+/).includes(name);},toggle(name,force){let parts=node.className.split(/\s+/).filter(Boolean);const enable=force===undefined?!parts.includes(name):force;parts=parts.filter(x=>x!==name);if(enable)parts.push(name);node.className=parts.join(' ');return enable;},add(name){this.toggle(name,true);},remove(name){this.toggle(name,false);}};}
  get textContent(){return this._text===null?this.children.map(n=>n.textContent).join(''):this._text;}
  set textContent(value){this.children=[];this._text=String(value);}
  get innerHTML(){return this._text===null?this.children.map(n=>n.outerHTML).join(''):escape(this._text);}
  set innerHTML(value){this.children=[];this._text=null;parse(value).forEach(node=>this.appendChild(node));}
  get outerHTML(){
    if(this.tagName==='#text')return escape(this._text);
    const attrs=Object.entries(this.attributes).map(([key,value])=>' '+key+'="'+escape(value)+'"').join('');
    return '<'+this.tagName+attrs+'>'+this.innerHTML+'</'+this.tagName+'>';
  }
  get value(){return this._value??this.getAttribute('value')??'';}
  set value(value){this._value=String(value);}
  get hidden(){return this.hasAttribute('hidden');}
  set hidden(value){if(value)this.setAttribute('hidden','');else this.removeAttribute('hidden');}
  get disabled(){return this.hasAttribute('disabled');}
  set disabled(value){if(value)this.setAttribute('disabled','');else this.removeAttribute('disabled');}
  get checked(){return this.hasAttribute('checked');}
  set checked(value){if(value)this.setAttribute('checked','');else this.removeAttribute('checked');}
  get open(){return this.hasAttribute('open');}
  set open(value){if(value)this.setAttribute('open','');else this.removeAttribute('open');}
  matches(selector){
    if(selector.includes(','))return selector.split(',').some(s=>this.matches(s.trim()));
    const attributes=[...selector.matchAll(/\[([^\]=]+)(?:=["']?([^"'\]]*)["']?)?\]/g)];
    for(const match of attributes){if(!this.hasAttribute(match[1]))return false;if(match[2]!==undefined&&this.getAttribute(match[1])!==match[2])return false;}
    const rest=selector.replace(/\[[^\]]+\]/g,'');
    const tag=rest.match(/^[a-zA-Z][\w-]*/);if(tag&&tag[0]!==this.tagName)return false;
    for(const match of rest.matchAll(/\.([\w-]+)/g))if(!this.classList.contains(match[1]))return false;
    const id=rest.match(/#([\w-]+)/);if(id&&this.getAttribute('id')!==id[1])return false;
    return this.tagName!=='#text';
  }
  querySelectorAll(selector){const out=[];for(const child of this.children){if(child.matches(selector))out.push(child);out.push(...child.querySelectorAll(selector));}return out;}
  querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
  closest(selector){return this.matches(selector)?this:this.parentElement?.closest(selector)||null;}
  addEventListener(name,callback){(this.events[name]??=[]).push(callback);}
  dispatch(name,detail={}){const event={target:this,preventDefault(){},...detail};for(const callback of this.events[name]||[])callback(event);}
  click(){if(!this.disabled)this.dispatch('click');}
  cloneNode(deep){const node=new Node(this.tagName,this.attributes,this._text);if(deep)this.children.forEach(child=>node.appendChild(child.cloneNode(true)));return node;}
  showModal(){this.open=true;}
  close(){this.open=false;this.dispatch('close');}
}
function parse(markup){
  const data=xml.xml2js('<fixture>'+markup+'</fixture>',{compact:false,ignoreComment:true,ignoreDeclaration:true});
  function convert(item){if(item.type==='text')return new Node('#text',{},item.text);if(item.type!=='element')return null;const node=new Node(item.name,item.attributes);(item.elements||[]).forEach(child=>{const converted=convert(child);if(converted)node.appendChild(converted);});return node;}
  return (data.elements[0].elements||[]).map(convert).filter(Boolean);
}
function createFixture(root=path.resolve(__dirname,'..')){
  let html=fs.readFileSync(path.join(root,'studies/index.html'),'utf8').match(/<body>([\s\S]*)<\/body>/)[1];
  html=html.replace(/<script[\s\S]*?<\/script>/g,'').replace(/&(?!amp;|lt;|gt;|quot;|apos;|#\d+;)/g,'&amp;');
  html=html.replace(/<(input|br)(\s[^>]*|)>/g,'<$1$2/>').replace(/\s(selected|checked|disabled|hidden)(?=[\s/>])/g,' $1=""');
  const document=new Node('document'),body=new Node('body');document.appendChild(body);body.innerHTML=html;
  document.body=body;document.hidden=false;
  document.getElementById=id=>document.querySelector('#'+id);
  document.createElement=name=>new Node(name);
  document.createElementNS=(_,name)=>new Node(name);
  let callback=null;const blobs=[];
  const scope={document,console,Math,Date,Number,Object,Array,String,Boolean,JSON,Blob,URL:{createObjectURL(blob){blobs.push(blob);return 'blob:fixture';},revokeObjectURL(){}},XMLSerializer:class{serializeToString(node){return node.outerHTML;}},setTimeout(){return 1;},clearTimeout(){},requestAnimationFrame(fn){callback=fn;},matchMedia(){return{matches:false};},innerWidth:1440,innerHeight:1100,navigator:{userAgent:'Abbey deterministic DOM fixture (no browser layout)'}};
  scope.window=scope;scope.globalThis=scope;
  const context=vm.createContext(scope);
  for(const name of ['art.js','scene.js','app.js'])vm.runInContext(fs.readFileSync(path.join(root,'studies',name),'utf8'),context,{filename:name});
  return {scope,document,blobs,frame(timestamp){callback(timestamp);},Node};
}
module.exports={createFixture,Node,parse};
