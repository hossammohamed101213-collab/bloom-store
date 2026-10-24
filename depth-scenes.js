import * as T from './vendor/three.module.js';
import {createRobot,updateRobot} from './robot-scene.js';
import {createMeteorField} from './meteor-field.js';

const colors=['#b6c9ba','#c5b1dc','#cba88c','#a5c4dc','#c8c39f','#b4acd6','#c7b790','#a5c7b9','#bdc6d9'];
const backgrounds=['#13241d','#191329','#281e19','#111f2c','#25241a','#171328','#231f17','#10241e','#1b202a'];
const ids=['store-sales','business-leads','affiliate-launch','store-retarget','business-awareness','affiliate-test','store-launch','business-gulf','affiliate-review'];
const spaceFragment=`uniform vec3 shade;uniform vec2 resolution;uniform float radius;uniform float uTime;uniform float isSpace;uniform float panelAlpha;uniform float isHero;uniform vec2 uPointer;uniform float uHover;varying vec2 vUv;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+1.7;a*=.5;}return v;}
void main(){vec2 q=abs(vUv*resolution-resolution*.5)-(resolution*.5-vec2(radius));float d=length(max(q,0.))+min(max(q.x,q.y),0.)-radius;float a=1.-smoothstep(-1.,1.,d);if(a<.01)discard;vec3 color=shade;if(isSpace>.5){vec2 uv=vUv;float cloud=fbm(uv*3.2+vec2(uTime*.006,-uTime*.003));float violet=exp(-length((uv-vec2(.16,.65))*vec2(2.4,1.5))*2.);float blue=exp(-length((uv-vec2(.85,.15))*vec2(2.,1.8))*2.8);color=vec3(.0022,.0022,.0022);}if(isHero>.5){vec2 pixel=vUv*resolution;vec2 cell=floor(pixel/44.);vec2 center=(cell+.5)*44.;vec2 local=fract(pixel/44.);float border=max(step(.98,local.x),step(.98,local.y));float dist=length((center-uPointer*resolution)/vec2(180.,160.));float field=exp(-dist*dist*1.5)*uHover;float tile=step(.28,hash(cell))*field;vec3 tint=mix(vec3(.28,.75,.58),vec3(.48,.31,.68),hash(cell+2.));color+=vec3(.009)*border+tint*(tile*.065+border*field*.13);}gl_FragColor=vec4(color,a*panelAlpha);
#include <colorspace_fragment>
}`;
export async function startDepth(){
 const layer=document.createElement('canvas');layer.id='depth-layer';layer.setAttribute('aria-hidden','true');document.body.prepend(layer);
 const renderer=new T.WebGLRenderer({canvas:layer,alpha:true,antialias:true,powerPreference:'high-performance'});
 const ratio=Math.min(devicePixelRatio,innerWidth<720?1:1.3);const readyStarted=performance.now();renderer.setPixelRatio(ratio);renderer.setSize(document.documentElement.clientWidth,innerHeight);renderer.autoClear=false;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.25;renderer.setClearColor(0x000000,0);
 const studio=new T.Scene();studio.background=new T.Color(0x191b25);
 function softbox(w,h,x,y,z,color,strength,rx=0,ry=0){const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color,side:T.DoubleSide}));mesh.material.color.multiplyScalar(strength);mesh.position.set(x,y,z);mesh.rotation.set(rx,ry,0);studio.add(mesh);}
 softbox(4,6,-5,2,1,0xffffff,5,0,Math.PI/2);softbox(3,7,5,1,2,0xaebce7,4,0,-Math.PI/2);softbox(8,3,0,5,0,0xffffff,4,Math.PI/2);softbox(3,5,1,1,6,0xc5c7e3,2.3,0,Math.PI);softbox(5,2,0,-4,0,0x9381c1,2,-Math.PI/2);
 const pmrem=new T.PMREMGenerator(renderer);const env=pmrem.fromScene(studio,.06);pmrem.dispose();studio.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
 const models=new Map();let descriptors=[],robot=null,robotToken=0,lastTime=0,time=0,paused=window.web2050MotionPaused||false,viewVisible=true,scanFrame=0;
 let needsFrame=true;let pointer={x:0,y:0},heroPointer={x:0,y:0};
 document.addEventListener('pointermove',event=>{needsFrame=true;pointer.x=event.clientX;pointer.y=event.clientY;heroPointer.x=event.clientX/innerWidth-.5;heroPointer.y=event.clientY/innerHeight-.5;},{passive:true});
 document.addEventListener('visibilitychange',()=>{viewVisible=!document.hidden;if(robot){viewVisible&&!paused?robot.play():robot.stop();}});
 document.addEventListener('web2050:motion',event=>{needsFrame=true;paused=event.detail.paused;if(robot){paused?robot.stop():robot.play();}});
 function material(type,bright=false){return new T.MeshPhysicalMaterial({color:bright?0xdce1ed:colors[type],metalness:.92,roughness:.22,clearcoat:1,clearcoatRoughness:.13,envMapIntensity:1.3});}
 function roundedBox(w,h,d,r=.12){
  r=Math.min(r,w/3,h/3);const shape=new T.Shape();const x=-w/2,y=-h/2;
  shape.moveTo(x+r,y);shape.lineTo(x+w-r,y);shape.quadraticCurveTo(x+w,y,x+w,y+r);shape.lineTo(x+w,y+h-r);shape.quadraticCurveTo(x+w,y+h,x+w-r,y+h);shape.lineTo(x+r,y+h);shape.quadraticCurveTo(x,y+h,x,y+h-r);shape.lineTo(x,y+r);shape.quadraticCurveTo(x,y,x+r,y);
  const geo=new T.ExtrudeGeometry(shape,{depth:d,bevelEnabled:true,bevelSize:.025,bevelThickness:.025,bevelSegments:3,steps:1,curveSegments:10});geo.translate(0,0,-d/2);return geo;
 }
 function makeScene(type){
  const isSpace=type==='hero'||type==='space';
  const scene=new T.Scene();scene.environment=env.texture;
  const backdrop=new T.ShaderMaterial({transparent:!isSpace||type==='hero',depthTest:false,depthWrite:false,uniforms:{shade:{value:new T.Color(isSpace?'#03040b':backgrounds[type])},resolution:{value:new T.Vector2(400,240)},radius:{value:type==='hero'?23:type==='space'?0:13},uTime:{value:0},isSpace:{value:isSpace?1:0},panelAlpha:{value:type==='hero'?0:isSpace?1:.12},isHero:{value:0},uPointer:{value:new T.Vector2(.3,.5)},uHover:{value:.12}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.9999,1.0);}',fragmentShader:spaceFragment});
  const backdropMesh=new T.Mesh(new T.PlaneGeometry(2,2),backdrop);backdropMesh.frustumCulled=false;backdropMesh.renderOrder=-100;scene.add(backdropMesh);
  const camera=new T.PerspectiveCamera(isSpace?42:33,1,.1,120);camera.position.set(0,.2,isSpace?8:6.2);camera.lookAt(0,0,0);
  const group=new T.Group();scene.add(group);const parts=[];
  const key=new T.DirectionalLight(0xf1edff,3.2);key.position.set(-3,5,5);scene.add(key);const edge=new T.DirectionalLight(0xbab9ff,2.6);edge.position.set(3,-1,-2);scene.add(edge);scene.add(new T.AmbientLight(0x8287a2,.6));
  const meteorField=type==='space'?createMeteorField():null;if(meteorField)scene.add(meteorField.field);
  const m=material(isSpace?1:type),dark=new T.MeshStandardMaterial({color:'#10121b',metalness:.8,roughness:.3});let starsMaterial=null;const meteors=[];let floor=null;
  function mesh(geometry,mat=m,x=0,y=0,z=0){const item=new T.Mesh(geometry,mat);item.position.set(x,y,z);group.add(item);parts.push(item);return item;}
  if(isSpace){
   const count=type==='hero'?80:innerWidth<720?380:700,positions=new Float32Array(count*3),sizes=new Float32Array(count),phases=new Float32Array(count),starColors=new Float32Array(count*3);
   const rnd=i=>{const s=Math.sin(i*127.1+91.7)*43758.5453;return s-Math.floor(s);};
   for(let i=0;i<count;i++){positions[i*3]=(rnd(i*5)-.5)*75;positions[i*3+1]=(rnd(i*5+1)-.5)*40;positions[i*3+2]=-rnd(i*5+2)*55;sizes[i]=1.5+rnd(i*5+3)*3.5;phases[i]=rnd(i*5+4)*6.28;const c=new T.Color().setHSL(.56+rnd(i*7)*.13,.12+rnd(i*7+1)*.28,.75+rnd(i*7+2)*.25);c.toArray(starColors,i*3);}
   const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.BufferAttribute(positions,3));geometry.setAttribute('aSize',new T.BufferAttribute(sizes,1));geometry.setAttribute('aPhase',new T.BufferAttribute(phases,1));geometry.setAttribute('aColor',new T.BufferAttribute(starColors,3));
   starsMaterial=new T.ShaderMaterial({transparent:true,depthWrite:false,blending:T.AdditiveBlending,uniforms:{uTime:{value:0},uRatio:{value:ratio},uStrength:{value:type==='hero'?.06:.38}},vertexShader:'uniform float uTime;uniform float uRatio;attribute float aSize;attribute float aPhase;attribute vec3 aColor;varying vec3 vColor;varying float vBlink;void main(){vec3 p=position;p.z=mod(p.z+uTime*.8+55.,55.)-55.;p.x+=sin(uTime*.025+aPhase)*.25;vec4 mv=modelViewMatrix*vec4(p,1.);gl_Position=projectionMatrix*mv;gl_PointSize=clamp(aSize*uRatio*(17./max(5.,-mv.z)),1.,7.*uRatio);vColor=aColor;vBlink=.55+.45*sin(uTime*.85+aPhase);}',fragmentShader:'uniform float uStrength;varying vec3 vColor;varying float vBlink;void main(){vec2 p=gl_PointCoord-.5;float d=length(p);float core=exp(-d*d*32.);float halo=exp(-d*d*10.)*.24;gl_FragColor=vec4(vColor,(core+halo)*vBlink*uStrength);}' });
   group.add(new T.Points(geometry,starsMaterial));

  }else switch(type){
   case 0:{for(let i=0;i<3;i++){const item=mesh(roundedBox(1.05,1.45,.26,.2),i===1?m:dark,(i-1)*.52,(i-1)*.18,(i-1)*-.22);item.rotation.set(.1,-.25,-.2);}const torus=mesh(new T.TorusGeometry(.23,.035,12,40),material(0,true),0,.91,.2);torus.rotation.x=.1;break;}
   case 1:{for(let i=0;i<3;i++){const ring=mesh(new T.TorusGeometry(.69,.10,18,72),m,(i-1)*.22,(i-1)*.05,0);ring.rotation.set(.3+i*.45,.2+i*.55,i*.3);ring.scale.set(.84,1.12,1);}break;}
   case 2:{const shape=new T.Shape();shape.moveTo(0,1.08);shape.lineTo(-1,-.67);shape.lineTo(1,-.67);shape.closePath();const hole=new T.Path();hole.moveTo(0,.53);hole.lineTo(.52,-.4);hole.lineTo(-.52,-.4);hole.closePath();shape.holes.push(hole);const frame=mesh(new T.ExtrudeGeometry(shape,{depth:.28,bevelEnabled:true,bevelSize:.075,bevelThickness:.075,bevelSegments:4,curveSegments:10}),m);frame.rotation.set(.15,-.45,-.25);break;}
   case 3:{for(let i=0;i<3;i++){const ring=mesh(new T.TorusGeometry(.95-i*.26,.055,14,72),i===1?material(3,true):m);ring.rotation.set(.42+i*.22,i*.25,i*.35);}mesh(new T.SphereGeometry(.12,24,16),material(3,true),.45,.3,.5);break;}
   case 4:{for(let i=0;i<12;i++){const a=i*Math.PI/6,ring=mesh(new T.TorusGeometry(.66,.047,10,50),m);ring.rotation.set(Math.PI/2,a,0);}mesh(new T.SphereGeometry(.19,24,16),material(4,true));break;}
   case 5:{for(let i=0;i<5;i++){const h=.5+i*.26;const bar=mesh(roundedBox(.24,h,.28,.08),m,(i-2)*.36,(h-1.5)/2,0);bar.rotation.y=-.4;}const line=new T.CatmullRomCurve3([new T.Vector3(-.95,-.2,.18),new T.Vector3(-.25,.45,.18),new T.Vector3(.9,1.05,.18)]);mesh(new T.TubeGeometry(line,30,.018,8,false),material(5,true));break;}
   case 6:{const cube=mesh(roundedBox(1.25,1.25,1.25,.07),m);cube.rotation.set(.5,.7,.15);const frame=mesh(new T.BoxGeometry(1.6,1.6,1.6),new T.MeshBasicMaterial({color:colors[6],wireframe:true,transparent:true,opacity:.17}));frame.rotation.copy(cube.rotation);break;}
   case 7:{mesh(new T.SphereGeometry(.88,40,28),new T.MeshPhysicalMaterial({color:'#143b31',metalness:.8,roughness:.3,clearcoat:1}));const wire=mesh(new T.SphereGeometry(.905,20,12),new T.MeshBasicMaterial({color:colors[7],wireframe:true,transparent:true,opacity:.21}));wire.rotation.z=.2;for(let i=0;i<2;i++){const ring=mesh(new T.TorusGeometry(1.12,.014,8,72),material(7,true));ring.rotation.set(.75+i*.7,.5+i*.9,.1);}mesh(new T.SphereGeometry(.05,16,12),material(7,true),1.05,.2,.3);break;}
   case 8:{const phone=mesh(roundedBox(1.1,1.9,.15,.16),m);phone.rotation.set(.1,-.25,-.18);const front=mesh(roundedBox(.94,1.7,.04,.11),dark,0,0,.12);front.rotation.copy(phone.rotation);for(let i=0;i<3;i++){const line=mesh(roundedBox(.58-i*.06,.035,.02,.008),material(8,true),0,-.15-i*.19,.21);line.rotation.z=-.18;}const check=new T.CatmullRomCurve3([new T.Vector3(-.22,.45,.23),new T.Vector3(-.06,.29,.23),new T.Vector3(.24,.62,.23)]);mesh(new T.TubeGeometry(check,16,.027,10,false),material(8,true));break;}
  }
  if(!isSpace){group.rotation.set(-.08,-.22,0);floor=new T.Mesh(new T.CircleGeometry(1.2,40),new T.MeshBasicMaterial({color:'#000',transparent:true,opacity:.18}));floor.rotation.x=-Math.PI/2;floor.position.y=-1.15;scene.add(floor);}
  return {scene,camera,group,parts,key,backdrop,backdropMesh,starsMaterial,meteors,meteorField,floor,isSpace,base:parts.map(p=>({position:p.position.clone(),rotation:p.rotation.clone(),scale:p.scale.clone()})),dragX:0,dragY:0,hoverX:0,hoverY:0,type};
 }
 function getModel(type){if(!models.has(type))models.set(type,type==='robot'?createRobot(env.texture):makeScene(type));return models.get(type);}
 function scan(){needsFrame=true;
  const detail=null;
  if(detail&&!detail.dataset.livePrepared){
   detail.dataset.livePrepared='true';detail.classList.add('depth-detail');const id=location.hash.split('/').pop(),type=Math.max(0,ids.indexOf(id));
   const area=document.createElement('div');area.className='detail-model-space';area.dataset.depth=String(type);area.dataset.dragModel='true';area.setAttribute('role','img');area.setAttribute('aria-label',document.documentElement.lang==='en'?'Interactive service model. Drag to rotate.':'مجسّم ثلاثي الأبعاد للخدمة. اسحب لتدويره.');detail.prepend(area);
   const toolbar=document.createElement('div');toolbar.className='detail-model-toolbar';toolbar.innerHTML=document.documentElement.lang==='en'?'<span>Interactive service illustration</span><button type="button">Reset view</button>':'<span>مشهد 3D تفاعلي · تصوّر للخدمة</span><button type="button">إعادة الوضع</button>';area.after(toolbar);
   let drag=null;area.addEventListener('pointerdown',event=>{drag={x:event.clientX,y:event.clientY};area.setPointerCapture(event.pointerId);});
   area.addEventListener('pointermove',event=>{if(!drag)return;const m=getModel(type);m.dragX+=(event.clientX-drag.x)*.009;m.dragY+=(event.clientY-drag.y)*.007;drag={x:event.clientX,y:event.clientY};});
   area.addEventListener('pointerup',()=>drag=null);area.addEventListener('pointercancel',()=>drag=null);
   toolbar.querySelector('button').addEventListener('click',()=>{const m=getModel(type);m.dragX=0;m.dragY=0;});
  }
  descriptors=[...document.querySelectorAll('[data-depth]')].map(element=>({element,model:getModel(Number(element.dataset.depth))}));
  const hero=document.querySelector('[data-depth-hero]');if(hero)descriptors.unshift({element:hero,model:getModel('hero')});
  const robotCanvas=document.querySelector('#robot-native');if(robotCanvas)descriptors.push({element:robotCanvas,model:getModel('robot')});
  descriptors.unshift({element:null,model:getModel('space'),global:true});
  document.body.dataset.depthViews=String(descriptors.length);
  prepareRobot();
 }
 function scheduleScan(){cancelAnimationFrame(scanFrame);scanFrame=requestAnimationFrame(scan);}
 const mutation=new MutationObserver(scheduleScan);mutation.observe(document.querySelector('#main'),{subtree:true,childList:true});
 document.addEventListener('web2050:route',scheduleScan);
 function prepareRobot(){
  const canvas=document.querySelector('#robot-native');if(!canvas)return;
  const status=document.querySelector('#robot-status');if(status.textContent!=='BLOOM / ORIGINAL 3D')status.textContent='BLOOM / ORIGINAL 3D';status.classList.add('ready');
  canvas.setAttribute('aria-label',document.documentElement.lang==='en'?'Interactive robot. Drag to rotate. Arrow keys to turn, Home to reset.':'روبوت تفاعلي. اسحب للتدوير، أو استخدم الأسهم وزر Home لإعادة الوضع.');
  if(!canvas.dataset.controlsReady){canvas.dataset.controlsReady='true';canvas.tabIndex=0;let drag=null;canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};canvas.setPointerCapture(e.pointerId);});canvas.addEventListener('pointermove',e=>{if(!drag)return;const m=getModel('robot');m.dragX+=(e.clientX-drag.x)*.012;m.dragY=Math.max(-.65,Math.min(.65,m.dragY+(e.clientY-drag.y)*.006));drag={x:e.clientX,y:e.clientY};needsFrame=true;});canvas.addEventListener('pointerup',()=>drag=null);canvas.addEventListener('pointercancel',()=>drag=null);canvas.addEventListener('keydown',e=>{const m=getModel('robot');if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home'].includes(e.key)){e.preventDefault();m.dragX+=e.key==='ArrowLeft'?-.18:e.key==='ArrowRight'?.18:0;m.dragY=Math.max(-.65,Math.min(.65,m.dragY+(e.key==='ArrowUp'?-.1:e.key==='ArrowDown'?.1:0)));if(e.key==='Home')m.dragX=m.dragY=0;needsFrame=true;}});}
  document.body.dataset.robotReady='true';document.body.dataset.robotEngine='THREE.JS / ORIGINAL';
 }
 window.addEventListener('scroll',()=>needsFrame=true,{passive:true});
 window.addEventListener('resize',()=>{needsFrame=true;renderer.setSize(document.documentElement.clientWidth,innerHeight);scheduleScan();},{passive:true});
 function draw(now){
  requestAnimationFrame(draw);if(now-lastTime<33)return;
  const dt=Math.min((now-lastTime)/1000,.06);lastTime=now;if(!paused)time+=dt;
  if(paused&&!needsFrame)return;if(document.hidden&&!needsFrame)return;needsFrame=false;renderer.setScissorTest(false);renderer.setViewport(0,0,document.documentElement.clientWidth,innerHeight);renderer.setClearColor(0x000000,0);renderer.clear(true,true,true);renderer.setScissorTest(true);
  let visibleCount=0;
  const ordered=[...descriptors].sort((a,b)=>(a.global?-1000:Number(a.element?.closest('.solution-card')?.style.zIndex)||0)-(b.global?-1000:Number(b.element?.closest('.solution-card')?.style.zIndex)||0));
  for(const {element,model:m,global} of ordered){
   if(!global&&!element.isConnected)continue;const r=global?{left:0,top:0,right:document.documentElement.clientWidth,bottom:innerHeight,width:document.documentElement.clientWidth,height:innerHeight}:element.getBoundingClientRect();if(r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth||r.width<1||r.height<1)continue;
   if(m.isRobot){updateRobot(m,time,pointer,r,paused);renderer.clearDepth();renderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);renderer.setScissor(r.left,innerHeight-r.bottom,r.width,r.height);renderer.render(m.scene,m.camera);visibleCount++;continue;}
   const hover=pointer.x>r.left&&pointer.x<r.right&&pointer.y>r.top&&pointer.y<r.bottom;
   const x=hover?(pointer.x-r.left)/r.width-.5:0,y=hover?(pointer.y-r.top)/r.height-.5:0;
   if(!paused){
    m.hoverX+=(x-m.hoverX)*.08;m.hoverY+=(y-m.hoverY)*.08;
    if(m.isSpace){m.starsMaterial.uniforms.uTime.value=time;m.meteorField?.update(time);m.camera.position.x+=(heroPointer.x*.65-m.camera.position.x)*.035;m.camera.position.y+=(heroPointer.y*.3-m.camera.position.y)*.035;m.meteors.forEach((line,i)=>{const p=((time+i*4.1)%12)/12;line.material.opacity=p<.12?Math.sin(p/.12*Math.PI)*.65:0;line.position.x=-8+p*120;line.position.y=4-p*40;});}
    else{const t=time+Number(m.type)*.8;m.group.rotation.y=m.dragX-.22+m.hoverX*.9+Math.sin(t*.65)*.28;m.group.rotation.x=m.dragY-.08+m.hoverY*.55+Math.sin(t*.45)*.06;m.group.position.y=Math.sin(t*1.1)*.12;m.key.position.x=-3+m.hoverX*3;
     m.parts.forEach((part,i)=>{const b=m.base[i];
      if(m.type===0&&i<3){part.position.x=b.position.x+(i-1)*(.12+.16*Math.sin(t*1.05));part.position.y=b.position.y+Math.sin(t*1.3+i)*.08;part.rotation.z=b.rotation.z+Math.sin(t+i*.7)*.08;}
      if(m.type===1){part.rotation.x=b.rotation.x+Math.sin(t*.65+i)*.3;part.rotation.y=b.rotation.y+t*.22*(i%2?1:-1);}
      if(m.type===2){part.rotation.y=b.rotation.y+Math.sin(t*.65)*.65;part.rotation.z=b.rotation.z+Math.sin(t*.4)*.12;}
      if(m.type===3&&i<3){part.rotation.x=b.rotation.x+Math.sin(t*.7+i)*.4;part.rotation.z=b.rotation.z+t*.18*(i%2?1:-1);}
      if(m.type===3&&i===3){part.position.set(Math.cos(t)*.72,Math.sin(t)*.72,.35);}
      if(m.type===4){part.rotation.y=b.rotation.y+t*.16;part.scale.setScalar(1+Math.sin(t*1.1+i*.3)*.09);}
      if(m.type===5&&i<5){const h=.5+i*.26,s=.72+.28*Math.sin(t*1.2-i*.5);part.scale.y=s;part.position.y=b.position.y+(s-1)*h/2;}
      if(m.type===6){part.rotation.x=b.rotation.x+t*.17;part.rotation.y=b.rotation.y+t*.24;}
      if(m.type===7){part.rotation.y=b.rotation.y+t*.16;part.rotation.z=b.rotation.z+Math.sin(t*.4)*.12;}
      if(m.type===8&&i<2){part.rotation.z=b.rotation.z+Math.sin(t*.75)*.09;}
     });}
   }else if(!m.isSpace){m.group.rotation.y=m.dragX-.22;m.group.rotation.x=m.dragY-.08;}
   m.camera.aspect=r.width/r.height;m.camera.updateProjectionMatrix();m.backdrop.uniforms.resolution.value.set(r.width,r.height);m.backdrop.uniforms.uTime.value=time;if(m.type==='hero'){const point=m.backdrop.uniforms.uPointer.value;point.x+=((pointer.x-r.left)/r.width-point.x)*.1;point.y+=(1-(pointer.y-r.top)/r.height-point.y)*.1;m.backdrop.uniforms.uHover.value+=((hover?1:.12)-m.backdrop.uniforms.uHover.value)*.07;}
   m.camera.position.z=m.isSpace?(r.width<720?10:8)+Math.max(0,-r.top)/innerHeight*.35:element.matches('[data-drag-model]')?5.2:6.1;
   if(m.isSpace){renderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);renderer.setScissor(r.left,innerHeight-r.bottom,r.width,r.height);renderer.render(m.scene,m.camera);}
   else{
    m.camera.position.y=.2+(r.top+r.height/2-innerHeight/2)/innerHeight*.15;
    const card=element.closest('.solution-card'),alpha=card?Number(card.dataset.cardAlpha??1):1,entry=card?Number(card.dataset.flight??1):1;
    if(alpha<.015)continue;
    m.backdrop.uniforms.panelAlpha.value=.12*alpha;m.group.visible=false;if(m.floor)m.floor.visible=false;m.backdropMesh.visible=true;
    renderer.setViewport(r.left,innerHeight-r.bottom,r.width,r.height);renderer.setScissor(r.left,innerHeight-r.bottom,r.width,r.height);renderer.render(m.scene,m.camera);
    m.group.visible=true;m.backdropMesh.visible=false;
    m.group.position.x=(1-entry)*(Number(m.type)%2?-3.4:3.4);m.group.position.y=(paused?0:Math.sin((time+Number(m.type)*.8)*1.1)*.12)+(1-entry)*2.0;m.group.scale.setScalar(.7+.3*entry);
    m.parts.forEach(part=>{if(!part.material)return;part.material.opacity=alpha;part.material.transparent=alpha<.99;part.material.depthWrite=alpha>.85;});
    const margin=entry<.999?Math.min(130,r.width*.3):0,w=r.width+margin*2,h=r.height+margin*2;
    const fov=m.camera.fov;m.camera.fov=2*Math.atan(Math.tan(T.MathUtils.degToRad(fov/2))*h/r.height)*180/Math.PI;m.camera.aspect=w/h;m.camera.updateProjectionMatrix();
    renderer.setViewport(r.left-margin,innerHeight-r.bottom-margin,w,h);renderer.setScissor(r.left-margin,innerHeight-r.bottom-margin,w,h);renderer.render(m.scene,m.camera);
    m.camera.fov=fov;m.backdropMesh.visible=true;
   }visibleCount++;
  }
  document.body.dataset.depthVisible=String(visibleCount);
  if(visibleCount)document.body.classList.add('depth-ready');
 }
 document.body.dataset.depthEngine='webgl';scan();document.body.dataset.sceneInitMs=String(Math.round(performance.now()-readyStarted));requestAnimationFrame(draw);
}




