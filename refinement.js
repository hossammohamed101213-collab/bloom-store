const $=s=>document.querySelector(s);
const main=$('#main'),dialog=$('#request-dialog'),form=$('#request-form'),review=$('#request-review');
const goalPanel=document.createElement('div');goalPanel.className='request-goal-panel';goalPanel.hidden=true;
goalPanel.innerHTML='<div class="quick-goals"><button data-quick-goal="store">مبيعات لمتجري <span>↗</span></button><button data-quick-goal="business">عملاء لشركتي أو خدمتي <span>↗</span></button><button data-quick-goal="affiliate">ترويج لعرض أفلييت <span>↗</span></button></div>';
const progress=document.createElement('div');progress.className='request-stepper';progress.setAttribute('aria-hidden','true');progress.innerHTML='<span class="active"></span><span></span><span></span>';
const stepInfo=document.createElement('p');stepInfo.className='request-step-info';
const selected=document.createElement('div');selected.className='request-goal-summary';selected.hidden=true;selected.innerHTML='<span></span><button type="button">تغيير الهدف</button>';
dialog.insertBefore(progress,form);dialog.insertBefore(stepInfo,form);dialog.insertBefore(goalPanel,form);dialog.insertBefore(selected,form);
const sectors={store:'المتاجر الإلكترونية',business:'الشركات والخدمات',affiliate:'عروض الأفلييت'};
const titles={store:'مبيعات لمتجري',business:'عملاء لشركتي أو خدمتي',affiliate:'ترويج لعرض أفلييت'};
function step(number){
 progress.querySelectorAll('span').forEach((span,i)=>span.classList.toggle('active',i<number));
 stepInfo.textContent=`${number} / 3 — ${['اختيار الهدف','تفاصيل الحملة','مراجعة الرسالة'][number-1]}`;
 dialog.querySelector('h2').textContent=['خلّينا نبدأ من هدفك.','أربع تفاصيل. ونناقش البداية.','راجع طلبك قبل المتابعة.'][number-1];
 dialog.querySelector(':scope > p').textContent=number===1?'اختار الأقرب لنشاطك، ونجهّز الطلب معاك.':number===2?'اسمك، الدولة، رابط العرض، والميزانية المتاحة.':'الإرسال يتم بواسطتك داخل واتساب، ولا توجد مدفوعات هنا.';
 goalPanel.hidden=number!==1;form.hidden=number!==2;review.hidden=number!==3;selected.hidden=number!==2;
 dialog.scrollTop=0;
}
function chooseGoal(key){form.elements.sector.value=sectors[key];form.elements.goal.value=key==='store'?'طلبات شراء':key==='business'?'استفسارات وعملاء محتملون':'زيارات مهتمة';selected.querySelector('span').textContent=titles[key];step(2);form.elements.name.focus();}
goalPanel.addEventListener('click',event=>{const button=event.target.closest('[data-quick-goal]');if(button)chooseGoal(button.dataset.quickGoal);});
selected.querySelector('button').addEventListener('click',()=>{step(1);goalPanel.querySelector('button').focus();});
document.addEventListener('click',event=>{
 const request=event.target.closest('[data-request]');if(!request)return;
 ['name','url','budget'].forEach(name=>form.elements[name].setCustomValidity(''));
 if(request.dataset.service){const sector=form.elements.sector.value;const key=Object.keys(sectors).find(key=>sectors[key]===sector)||'store';chooseGoal(key);}else step(1);
});
form.addEventListener('submit',()=>{if(form.hidden&&!review.hidden)step(3);});
$('#request-edit').addEventListener('click',()=>step(2));

const reduced=matchMedia('(prefers-reduced-motion: reduce)');
let motionPaused=reduced.matches;
window.web2050MotionPaused=motionPaused;
function setMotion(value){motionPaused=value;window.web2050MotionPaused=value;document.body.classList.toggle('reduced-motion',value);const control=$('#motion-button');if(control){control.setAttribute('aria-pressed',String(value));const label=value?'▷ تشغيل الحركة':'Ⅱ تقليل الحركة';if(control.textContent!==label)control.textContent=label;}document.dispatchEvent(new CustomEvent('web2050:motion',{detail:{paused:value}}));}
reduced.addEventListener('change',event=>setMotion(event.matches));
document.addEventListener('click',event=>{if(event.target.closest('#motion-button'))setMotion(!motionPaused);});

const revealObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('shown');revealObserver.unobserve(entry.target);}}),{threshold:.08});
function enhance(){
 document.querySelectorAll('.content-section > .section-heading,.platform-benefits,.workflow,.closing-block,.plan-grid,.guide-grid').forEach(element=>{if(!element.classList.contains('reveal-refined')){element.classList.add('reveal-refined');revealObserver.observe(element);}});
 document.querySelectorAll('.solution-card').forEach(card=>{if(card.dataset.pointerReady)return;card.dataset.pointerReady='true';card.addEventListener('pointermove',event=>{const r=card.getBoundingClientRect();card.style.setProperty('--mx',(event.clientX-r.left)/r.width*100+'%');card.style.setProperty('--my',(event.clientY-r.top)/r.height*100+'%');});});
 const art=$('.workflow-art');if(art&&!art.dataset.pointerReady){art.dataset.pointerReady='true';art.addEventListener('pointermove',event=>{if(motionPaused)return;const r=art.getBoundingClientRect();const win=art.querySelector('.mini-window');win.style.animation='none';win.style.transform=`perspective(850px) rotateY(${(event.clientX-r.left)/r.width*18-9}deg) rotateX(${9-(event.clientY-r.top)/r.height*18}deg) rotateZ(-3deg)`;});art.addEventListener('pointerleave',()=>{const win=art.querySelector('.mini-window');win.style.animation='';win.style.transform='';});}
 setMotion(motionPaused);
}
let enhanceFrame=0;const observer=new MutationObserver(()=>{if(!enhanceFrame)enhanceFrame=requestAnimationFrame(()=>{enhanceFrame=0;enhance();});});observer.observe(main,{childList:true,subtree:true});enhance();
// Render the actual model locally, and share one WebGL renderer across gallery views.
import('./depth-scenes.js').then(module=>module.startDepth()).catch(error=>{console.error('3D renderer unavailable',error);document.body.classList.add('no-depth');});
