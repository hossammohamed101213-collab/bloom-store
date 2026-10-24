const G=window.gsap;
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches||window.web2050MotionPaused;
if(G){
 document.body.classList.add('gsap-motion');
 window.web2050AnimateFlip=(card,open)=>{
  const inner=card.querySelector('.flip-inner');G.killTweensOf(inner);
  G.to(inner,{rotationY:open?180:0,duration:reduced()?0:.85,ease:'power3.inOut',overwrite:true,force3D:true});
  if(open&&!reduced())G.fromTo(card.querySelectorAll('.service-back h3,.back-intro,.service-back li,.service-back-actions'),{x:45,opacity:0},{x:0,opacity:1,duration:.55,stagger:.055,delay:.36,ease:'power3.out',overwrite:true});
 };
 const floats=new Map();
 const observer=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{const anim=floats.get(target);if(!anim)return;isIntersecting&&!reduced()?anim.play():anim.pause();}),{threshold:.15});
 function scan(){
  for(const [el,anim] of floats)if(!el.isConnected){anim.kill();observer.unobserve(el);floats.delete(el);}
  document.querySelectorAll('.service-flip:not([data-studio-ready])').forEach(card=>{
   card.dataset.studioReady='true';if(!reduced())G.fromTo(card,{opacity:0,y:24},{opacity:1,y:0,duration:.65,delay:(Number(card.dataset.model)%3)*.08,ease:'power2.out'});const art=card.querySelector('.art-float');
   const anim=G.to(art,{y:-7,scale:1.035,rotation:.35,duration:4.5,ease:'sine.inOut',repeat:-1,yoyo:true,paused:true});floats.set(card,anim);observer.observe(card);
   const visual=card.querySelector('.service-art');const xTo=G.quickTo(visual,'rotationY',{duration:.7,ease:'power3.out'}),yTo=G.quickTo(visual,'rotationX',{duration:.7,ease:'power3.out'});
   card.addEventListener('pointermove',e=>{if(reduced()||card.classList.contains('is-flipped'))return;const r=card.getBoundingClientRect();xTo((e.clientX-r.left-r.width/2)/r.width*5);yTo(-(e.clientY-r.top-r.height/2)/r.height*4);});
   card.addEventListener('pointerleave',()=>{xTo(0);yTo(0);});
  });
 }
 document.addEventListener('web2050:motion',()=>{floats.forEach(anim=>reduced()?anim.pause():anim.play());});
 new MutationObserver(scan).observe(document.querySelector('#main'),{childList:true,subtree:true});scan();document.body.dataset.motionEngine='GSAP '+G.version;
}

const lowerObserver=new IntersectionObserver(entries=>entries.forEach(({target,isIntersecting})=>{const anim=target._lowerMotion;if(anim)isIntersecting&&!reduced()?anim.play():anim.pause();if(isIntersecting){target.classList.add('motion-visible');}}),{threshold:.12});
function enhanceLower(){document.querySelectorAll('.benefit-card,.plan-card,.guide-card,.closing-block,.footer-grid>div').forEach((el,i)=>{if(el.dataset.lowerReady)return;el.dataset.lowerReady='true';el.classList.add('lower-motion');if(G){el._lowerMotion=G.to(el,{y:-4,duration:3.5+i%3,ease:'sine.inOut',yoyo:true,repeat:-1,paused:true});el.addEventListener('pointerenter',()=>{if(!reduced())G.to(el,{rotationY:3,rotationX:-2,duration:.5,overwrite:'auto'});});el.addEventListener('pointerleave',()=>G.to(el,{rotationY:0,rotationX:0,duration:.5}));}lowerObserver.observe(el);});}
new MutationObserver(enhanceLower).observe(document.querySelector('#main'),{childList:true,subtree:true});enhanceLower();document.addEventListener('web2050:motion',()=>document.querySelectorAll('.lower-motion').forEach(el=>{if(el._lowerMotion)reduced()?el._lowerMotion.pause():el._lowerMotion.play();}));
