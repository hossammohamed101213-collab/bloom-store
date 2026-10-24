const $ = (selector) => document.querySelector(selector);
const requestDialog = $('#request-dialog');
const form = $('#request-form');
const review = $('#request-review');
let returnFocus;
function openRequest() {
  returnFocus = document.activeElement;
  form.hidden = false; review.hidden = true;
  requestDialog.showModal();
}
document.querySelectorAll('[data-request]').forEach(button => button.addEventListener('click', openRequest));
document.querySelectorAll('.dialog-close').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog => {
  dialog.addEventListener('click', event => { if (event.target === dialog) { const r = dialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); } });
});
requestDialog.addEventListener('close', () => returnFocus?.focus());
$('#privacy-open').addEventListener('click', () => $('#privacy-dialog').showModal());
form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const data = new FormData(form);
  const url = new URL(data.get('url'));
  if (!['https:', 'http:'].includes(url.protocol)) { form.elements.url.setCustomValidity('أدخل رابط موقع يبدأ بـ https:// أو http://'); form.elements.url.reportValidity(); return; }
  const message = `مرحبًا BLOOM، أود مناقشة حملة إعلانية.\n\nالاسم: ${data.get('name').trim()}\nنوع النشاط: ${data.get('sector')}\nالسوق: ${data.get('market')}\nرابط العرض: ${data.get('url')}\nالهدف: ${data.get('goal')}\nميزانية الإعلان: ${data.get('budget').trim()}\nتفاصيل: ${data.get('notes').trim() || 'لا توجد تفاصيل إضافية'}\n\nأرغب في عرض خدمة يوضّح أتعاب الإدارة منفصلة عن ميزانية الإعلان.`;
  $('#request-message').textContent = message;
  $('#whatsapp-send').href = 'https://wa.me/971567371542?text=' + encodeURIComponent(message);
  form.hidden = true; review.hidden = false; $('#whatsapp-send').focus();
});
form.elements.url.addEventListener('input', () => form.elements.url.setCustomValidity(''));
$('#request-edit').addEventListener('click', () => { form.hidden = false; review.hidden = true; form.elements.name.focus(); });

const sectors = {
  store: {kicker:'E-COMMERCE GROWTH', title:'من مشاهدة المنتج،\nإلى خطوة الشراء.', description:'نخطّط لحملات تركّز على منتجاتك وجمهورك، مع مراجعة رحلة الزائر وقياس الطلبات عند تهيئة التتبع.', cta:'ناقش خطة متجرك', field:'متجر إلكتروني', steps:['جمهور مهتم','صفحة مناسبة','إجراء قابل للقياس']},
  business: {kicker:'BUSINESS CONNECTIONS', title:'خدمتك تستحق\nأن تصل لمن يحتاجها.', description:'نحدّد العملاء المحتملين المناسبين لنشاطك، ونبني مسارًا واضحًا للاستفسار أو الحجز، مع قياس جودة الطلبات بالتنسيق معك.', cta:'ناقش خطة شركتك', field:'شركة أو خدمة', steps:['احتياج واضح','عرض الخدمة','طلب تواصل']},
  affiliate: {kicker:'AFFILIATE CAMPAIGNS', title:'العرض المناسب،\nللجمهور المناسب.', description:'نراجع العرض وشروط الترافيك المدفوع أولًا، ثم نخطّط للاستهداف وصفحة الوصول وتتبع التحويلات ضمن الإمكانيات المتاحة.', cta:'ناقش عرض الأفلييت', field:'عرض أفلييت', steps:['عرض مقبول','زائر مهتم','تحويل متتبّع']}
};
function selectSector(button) {
  const s = sectors[button.dataset.sector];
  document.querySelectorAll('[data-sector]').forEach(b => { b.setAttribute('aria-selected', String(b===button)); b.tabIndex = b===button ? 0 : -1; });
  $('#service-detail').setAttribute('aria-labelledby', button.id);
  $('#sector-kicker').textContent = s.kicker;
  $('#sector-title').replaceChildren(...s.title.split('\n').flatMap((line,i) => i ? [document.createElement('br'),document.createTextNode(line)] : [document.createTextNode(line)]));
  $('#sector-description').textContent = s.description;
  $('.service-detail [data-request]').replaceChildren(document.createTextNode(s.cta+' '), Object.assign(document.createElement('span'), {textContent:'↗'}));
  s.steps.forEach((step,i) => $('#journey-'+(i+1)).textContent = step);
  form.elements.sector.value = s.field;
}
const tabs = [...document.querySelectorAll('[data-sector]')];
tabs.forEach((button,i) => {
  button.addEventListener('click', () => selectSector(button));
  button.addEventListener('keydown', event => {
    let index;
    if(event.key==='ArrowLeft') index=(i+1)%tabs.length;
    if(event.key==='ArrowRight') index=(i+tabs.length-1)%tabs.length;
    if(event.key==='Home') index=0;
    if(event.key==='End') index=tabs.length-1;
    if(index!==undefined){event.preventDefault();selectSector(tabs[index]);tabs[index].focus();}
  });
});
const nf = new Intl.NumberFormat('ar-AE',{maximumFractionDigits:1});
function calculate() {
  const inputs=['budget','cpc','conversion','fee'].map(id=>$('#'+id));
  if(inputs.some(input=>input.value.trim()==='' || !input.checkValidity() || !Number.isFinite(input.valueAsNumber))) {
    $('#calc-error').textContent='أدخل قيمًا صحيحة: الميزانية وتكلفة الزيارة أكبر من صفر، ونسبة التحويل حتى 100٪.';
    ['clicks','actions','cost'].forEach(id=>$('#'+id).textContent='—'); return;
  }
  $('#calc-error').textContent='';
  const [budget,cpc,conversion,fee]=inputs.map(input=>input.valueAsNumber);
  const clicks=budget/cpc, actions=clicks*conversion/100;
  $('#clicks').textContent=nf.format(clicks);
  $('#actions').textContent=nf.format(actions);
  $('#cost').textContent=nf.format((budget+fee)/actions)+' د.إ';
}
['budget','cpc','conversion','fee'].forEach(id=>$('#'+id).addEventListener('input',calculate));calculate();

async function startScene() {
  const status=$('#scene-status'), host=$('#scene-container'), canvas=$('#robot-canvas');
  try {
    const THREE = await import('./vendor/three.module.js');
    const renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,1.7));
    renderer.setClearColor(0x000000,0);
    renderer.toneMapping=THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure=1.35;
    const scene=new THREE.Scene();
    const camera=new THREE.PerspectiveCamera(36,1,.1,100);
    camera.position.set(0,.1,7.7);camera.lookAt(0,-.05,0);

    // Procedural studio reflections keep all robot assets self-contained.
    const studio=new THREE.Scene();studio.background=new THREE.Color(0x10151f);
    function softbox(w,h,x,y,z,color,intensity,rx=0,ry=0) {
      const box=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({color,side:THREE.DoubleSide}));
      box.position.set(x,y,z);box.rotation.set(rx,ry,0);box.material.color.multiplyScalar(intensity);studio.add(box);
    }
    softbox(3,7,-4,2,1,0xdfeaff,5,0,Math.PI/2);
    softbox(2,6,4,1,0,0x5885ff,6,0,-Math.PI/2);
    softbox(6,2,0,5,0,0xffffff,4,Math.PI/2,0);
    softbox(1,5,1,0,5,0xaac6ff,3,0,Math.PI);
    const pmrem=new THREE.PMREMGenerator(renderer);const environment=pmrem.fromScene(studio,.08);scene.environment=environment.texture;pmrem.dispose();
    scene.add(new THREE.HemisphereLight(0xb6d4ff,0x090c17,2.4));
    const key=new THREE.DirectionalLight(0xecf3ff,5);key.position.set(-3,4,5);scene.add(key);
    const rim=new THREE.DirectionalLight(0x2b60ff,8);rim.position.set(4,1,-1);scene.add(rim);
    const fill=new THREE.DirectionalLight(0xbcd6ff,1.5);fill.position.set(2,-2,5);scene.add(fill);

    const black=new THREE.MeshPhysicalMaterial({color:0x11151d,metalness:.92,roughness:.2,clearcoat:1,clearcoatRoughness:.12,envMapIntensity:1.5});
    const face=new THREE.MeshPhysicalMaterial({color:0x02050b,metalness:.7,roughness:.08,clearcoat:1,envMapIntensity:1.4});
    const joint=new THREE.MeshStandardMaterial({color:0x172231,metalness:.85,roughness:.4});
    const chrome=new THREE.MeshStandardMaterial({color:0x64758e,metalness:1,roughness:.2});
    const glow=new THREE.MeshStandardMaterial({color:0x759cff,emissive:0x3068ff,emissiveIntensity:3,roughness:.3,metalness:.3});
    const robot=new THREE.Group();scene.add(robot);
    function ellipsoid(parent,material,x,y,z,sx,sy,sz) {
      const m=new THREE.Mesh(new THREE.SphereGeometry(1,48,32),material);m.position.set(x,y,z);m.scale.set(sx,sy,sz);parent.add(m);return m;
    }
    function capsule(parent,material,radius,length,x,y,z,rotation=0) {
      const m=new THREE.Mesh(new THREE.CapsuleGeometry(radius,length,8,24),material);m.position.set(x,y,z);m.rotation.z=rotation;parent.add(m);return m;
    }
    const torso=ellipsoid(robot,black,0,-.05,0,.69,.88,.42);
    ellipsoid(robot,joint,0,-.7,0,.48,.25,.34);
    capsule(robot,chrome,.16,.14,0,.84,0);
    const head=new THREE.Group();head.position.y=1.35;robot.add(head);
    ellipsoid(head,black,0,0,0,.53,.64,.46);
    ellipsoid(head,face,0,.025,.27,.445,.40,.255);
    // A narrow visor and separate LED bars produce a readable original expression.
    capsule(head,glow,.027,.115,-.17,.04,.521,Math.PI/2);
    capsule(head,glow,.027,.115,.17,.04,.521,Math.PI/2);
    capsule(head,joint,.014,.13,0,-.19,.485,Math.PI/2);
    for(const side of [-1,1]) {
      ellipsoid(head,joint,side*.515,0,0,.095,.19,.18);
      ellipsoid(head,glow,side*.577,0,.025,.013,.10,.09);
    }
    // Chest emblem and small status indicators are geometry, not a flat image.
    const emblem=new THREE.Group();emblem.position.set(0,.13,.418);robot.add(emblem);
    capsule(emblem,chrome,.023,.18,-.06,0,0,.42);capsule(emblem,glow,.023,.18,.06,0,0,-.42);
    for(let i=0;i<3;i++)ellipsoid(robot,i===0?glow:joint,-.09+i*.09,-.24,.412,.016,.016,.012);
    const arms=[];
    for(const side of [-1,1]) {
      const arm=new THREE.Group();arm.position.set(side*.71,.46,0);arm.rotation.z=side*.27;robot.add(arm);arms.push(arm);
      ellipsoid(arm,black,side*.06,0,0,.26,.29,.28);
      capsule(arm,black,.19,.42,side*.09,-.37,0);
      ellipsoid(arm,joint,side*.09,-.76,0,.17,.17,.17);
      capsule(arm,black,.205,.30,side*.10,-1.03,.06,side*.06);
      ellipsoid(arm,chrome,side*.10,-1.31,.08,.14,.075,.13);
      ellipsoid(arm,black,side*.10,-1.49,.10,.21,.22,.18);
      for(let j=0;j<4;j++)capsule(arm,joint,.035,.11,side*.1-.105+j*.07,-1.55,.255,0);
      ellipsoid(arm,black,side*.10-side*.18,-1.43,.18,.09,.13,.10);
    }
    for(const side of [-1,1]){
      ellipsoid(robot,joint,side*.27,-.92,0,.19,.18,.19);
      capsule(robot,black,.21,.32,side*.28,-1.2,0,side*.07);
      ellipsoid(robot,black,side*.30,-1.53,.07,.24,.22,.3);
      capsule(robot,glow,.015,.15,side*.30,-1.54,.34,Math.PI/2);
    }
    const platform=new THREE.Group();platform.position.y=-1.98;scene.add(platform);
    const ring=new THREE.Mesh(new THREE.TorusGeometry(.96,.014,12,100),glow);ring.rotation.x=Math.PI/2;platform.add(ring);
    const ring2=new THREE.Mesh(new THREE.TorusGeometry(1.2,.006,8,100),new THREE.MeshBasicMaterial({color:0x263d69,transparent:true,opacity:.6}));ring2.rotation.x=Math.PI/2;platform.add(ring2);
    const disk=new THREE.Mesh(new THREE.CircleGeometry(.92,64),new THREE.MeshBasicMaterial({color:0x19315c,transparent:true,opacity:.14,side:THREE.DoubleSide}));disk.rotation.x=-Math.PI/2;platform.add(disk);
    const particles=new THREE.BufferGeometry(),positions=new Float32Array(45*3);
    for(let i=0;i<positions.length;i+=3){positions[i]=Math.sin(i*23.7)*2.2;positions[i+1]=Math.cos(i*4.9)*2.2;positions[i+2]=-1-Math.abs(Math.cos(i*7.2))*2;}
    particles.setAttribute('position',new THREE.BufferAttribute(positions,3));
    const dots=new THREE.Points(particles,new THREE.PointsMaterial({color:0x4e7dde,size:.014,transparent:true,opacity:.5}));scene.add(dots);

    let pointer={x:0,y:0},paused=matchMedia('(prefers-reduced-motion: reduce)').matches,visible=true,offscreen=false;
    const motion=$('#motion-toggle');
    function updateMotionLabel(){motion.setAttribute('aria-pressed',String(paused));motion.textContent=paused?'▷ تشغيل الحركة':'Ⅱ إيقاف الحركة';}
    updateMotionLabel();motion.addEventListener('click',()=>{paused=!paused;updateMotionLabel();});
    host.addEventListener('pointermove',event=>{const r=host.getBoundingClientRect();pointer.x=((event.clientX-r.left)/r.width-.5)*2;pointer.y=((event.clientY-r.top)/r.height-.5)*2;});
    host.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0;});
    document.addEventListener('visibilitychange',()=>visible=!document.hidden);
    new IntersectionObserver(entries=>offscreen=!entries[0].isIntersecting).observe(host);
    new ResizeObserver(()=>{const w=host.clientWidth,h=host.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.position.z=w<450?8.15:7.7;camera.updateProjectionMatrix();}).observe(host);
    const clock=new THREE.Clock();let elapsed=0,last=0;
    function render(now){requestAnimationFrame(render);const dt=Math.min(clock.getDelta(),.06);if(!visible||offscreen)return;if(now-last<32)return;last=now;
      if(!paused){elapsed+=dt;robot.position.y=Math.sin(elapsed*1.35)*.07;robot.rotation.y=THREE.MathUtils.lerp(robot.rotation.y,pointer.x*.25-.16,.045);robot.rotation.z=Math.sin(elapsed*.7)*.018;head.rotation.y=THREE.MathUtils.lerp(head.rotation.y,pointer.x*.23,.06);head.rotation.x=THREE.MathUtils.lerp(head.rotation.x,pointer.y*.12,.06);arms[0].rotation.z=-.27+Math.sin(elapsed*1.2)*.025;arms[1].rotation.z=.27+Math.sin(elapsed*1.2+1)*.025;dots.rotation.y=elapsed*.015;}
      renderer.render(scene,camera);
    }
    requestAnimationFrame(render);status.hidden=true;
    canvas.addEventListener('webglcontextlost',event=>{event.preventDefault();status.hidden=false;status.textContent='توقّف المشهد مؤقتًا. يمكنك متابعة تصفّح الموقع.';});
  } catch(error) {
    console.error('3D preview could not start:',error);
    status.textContent='المشهد ثلاثي الأبعاد غير متاح على هذا الجهاز. بقية الموقع تعمل.';
    status.style.top='70%';
    const fallback=document.createElement('div');fallback.className='static-robot';fallback.textContent='◈';host.append(fallback);
    $('#motion-toggle').hidden=true;
  }
}
startScene();
