const $=s=>document.querySelector(s);
const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduced.matches;
const frame=$('#robot-frame'),pausePanel=$('#scene-paused');
function setMotion(value){
 paused=value;document.body.classList.toggle('pause-page',paused);
 $('#motion-control').setAttribute('aria-pressed',String(paused));
 $('#motion-control').textContent=paused?'▷ تشغيل الحركة':'Ⅱ تقليل الحركة';
 frame.hidden=paused;pausePanel.hidden=!paused;
 if(paused){frame.removeAttribute('src');$('#light-dot').classList.remove('visible');}
 else if(!frame.getAttribute('src'))frame.src=frame.dataset.src;
}
$('#motion-control').addEventListener('click',()=>setMotion(!paused));
$('#resume-scene').addEventListener('click',()=>setMotion(false));
reduced.addEventListener('change',event=>setMotion(event.matches));setMotion(paused);

// Effects respond to the visitor and respect their motion preference.
const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in-view');observer.unobserve(entry.target);}}),{threshold:.12});
document.querySelectorAll('.reveal').forEach((element,i)=>{element.style.transitionDelay=(i%3)*75+'ms';observer.observe(element);});
if(!reduced.matches)document.body.classList.add('js-motion');
const hover=matchMedia('(hover: hover) and (pointer: fine)');
document.querySelectorAll('.goal-card').forEach(card=>{
 card.addEventListener('pointermove',event=>{
  if(paused||!hover.matches)return;const r=card.getBoundingClientRect(),x=(event.clientX-r.left)/r.width,y=(event.clientY-r.top)/r.height;
  card.style.setProperty('--rx',(0.5-y)*7+'deg');card.style.setProperty('--ry',(x-.5)*7+'deg');card.style.setProperty('--x',x*100+'%');card.style.setProperty('--y',y*100+'%');
 });
 card.addEventListener('pointerleave',()=>{card.style.setProperty('--rx','0deg');card.style.setProperty('--ry','0deg');});
});
const dot=$('#light-dot');
document.addEventListener('pointermove',event=>{if(paused||!hover.matches)return;dot.style.transform=`translate(${event.clientX-6}px,${event.clientY-6}px)`;dot.classList.add('visible');},{passive:true});
document.addEventListener('pointerleave',()=>dot.classList.remove('visible'));

const captions=[
 'نبدأ من عرضك؛ جودة الإعلان تبدأ بفهم ما نروّج له.',
 'نحدّد الجمهور والسوق حسب طبيعة نشاطك، بدل الوصول العشوائي.',
 'نوجّه الزائر لخطوة واضحة تناسب هدف الحملة.',
 'نراجع البيانات المتاحة ونقترح التحسينات وفق ما تعلّمناه.'
];
let stage=0,journeyVisible=false,manualUntil=0;
const journeyObserver=new IntersectionObserver(entries=>journeyVisible=entries[0].isIntersecting,{threshold:.3});journeyObserver.observe($('.journey-board'));
function setStage(value){stage=value;document.querySelectorAll('[data-node]').forEach(node=>node.classList.toggle('active',Number(node.dataset.node)===stage));document.querySelectorAll('[data-stage]').forEach(button=>button.setAttribute('aria-pressed',String(Number(button.dataset.stage)===stage)));$('#journey-caption').textContent=captions[stage];}
document.querySelectorAll('[data-stage]').forEach(button=>button.addEventListener('click',()=>{manualUntil=Date.now()+12000;setStage(Number(button.dataset.stage));}));
setInterval(()=>{if(paused||document.hidden||!journeyVisible||Date.now()<manualUntil)return;setStage((stage+1)%4);},3100);

// One guided request: goal, four basic details, review before WhatsApp.
const goals={
 sales:{label:'مبيعات لمتجري',sector:'متجر إلكتروني',goal:'طلبات شراء'},
 leads:{label:'عملاء لخدمتي',sector:'شركة أو خدمة',goal:'استفسارات وعملاء محتملون'},
 affiliate:{label:'ترويج لعرض أفلييت',sector:'عرض أفلييت',goal:'ترافيك مدفوع لعرض أفلييت — بعد مراجعة شروطه'}
};
let selectedGoal=null,lastFocus=null;
const wizard=$('#wizard'),form=$('#request-form');
function showStep(step){
 $('#wizard-goal').hidden=step!==1;$('#wizard-details').hidden=step!==2;$('#wizard-review').hidden=step!==3;
 const titles=['إيه الخطوة اللي بتدور عليها؟','نجهّز طلبك.','دي البداية اللي هنناقشها.'];
 const labels=['هدفك','التفاصيل','المراجعة'];
 $('#wizard-title').textContent=titles[step-1];$('#wizard-step-label').textContent=`الخطوة ${step} من 3 — ${labels[step-1]}`;
 document.querySelectorAll('.wizard-progress span').forEach((element,i)=>element.classList.toggle('active',i<step));
 wizard.scrollTop=0;
}
function openWizard(goal=null){
 lastFocus=document.activeElement;selectedGoal=goal;form.reset();$('#form-error').textContent='';
 ['name','url','budget'].forEach(name=>form.elements[name].setCustomValidity(''));
 if(goal)$('#selected-goal').textContent=goals[goal].label;
 showStep(goal?2:1);wizard.showModal();
 if(goal)form.elements.name.focus();
}
document.querySelectorAll('[data-goal]').forEach(button=>button.addEventListener('click',()=>{
 const goal=button.dataset.goal;
 if(wizard.open){selectedGoal=goal;$('#selected-goal').textContent=goals[goal].label;showStep(2);form.elements.name.focus();}
 else openWizard(goal);
}));
document.querySelectorAll('[data-start]').forEach(button=>button.addEventListener('click',()=>openWizard()));
$('#change-goal').addEventListener('click',()=>{showStep(1);$('#wizard-goal button').focus();});
$('#back-goal').addEventListener('click',()=>{showStep(1);$('#wizard-goal button').focus();});
$('#edit-request').addEventListener('click',()=>{showStep(2);form.elements.name.focus();});
document.querySelectorAll('[data-close]').forEach(button=>button.addEventListener('click',()=>button.closest('dialog').close()));
document.querySelectorAll('dialog').forEach(dialog=>dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}}));
wizard.addEventListener('close',()=>{if(lastFocus?.isConnected)lastFocus.focus();});
form.addEventListener('submit',event=>{
 event.preventDefault();if(!form.reportValidity())return;
 if(!selectedGoal){showStep(1);return;}
 const data=new FormData(form);
 for(const name of ['name','budget'])if(!String(data.get(name)).trim()){form.elements[name].setCustomValidity('اكتب قيمة واضحة في الحقل');form.elements[name].reportValidity();return;}
 let url;try{url=new URL(data.get('url'));}catch{form.elements.url.setCustomValidity('أدخل رابط موقع صحيح');form.elements.url.reportValidity();return;}
 if(!['https:','http:'].includes(url.protocol)){form.elements.url.setCustomValidity('استخدم رابطًا يبدأ بـ https:// أو http://');form.elements.url.reportValidity();return;}
 const selected=goals[selectedGoal];
 const message=`مرحبًا BLOOM، أود مناقشة حملة إعلانية.\n\nالاسم: ${data.get('name').trim()}\nالنشاط: ${selected.sector}\nالهدف: ${selected.goal}\nالدولة المستهدفة: ${data.get('market')}\nرابط الموقع أو العرض: ${data.get('url')}\nميزانية الإعلان: ${data.get('budget').trim()}\nتفاصيل إضافية: ${data.get('notes').trim()||'لا توجد'}\n\nأرغب في معرفة نطاق الخدمة وأتعاب الإدارة بشكل منفصل عن ميزانية الإعلان.`;
 $('#request-message').textContent=message;$('#whatsapp-send').href='https://wa.me/971567371542?text='+encodeURIComponent(message);showStep(3);$('#whatsapp-send').focus();
});
['name','url','budget'].forEach(name=>form.elements[name].addEventListener('input',()=>form.elements[name].setCustomValidity('')));
$('#privacy-open').addEventListener('click',()=>$('#privacy-dialog').showModal());
