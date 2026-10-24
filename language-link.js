const control=document.querySelector('.language-switch');
function sync(){if(control)control.href=(document.documentElement.lang==='en'?'index.html':'en.html')+(location.hash||'#/');}
addEventListener('hashchange',sync);sync();
