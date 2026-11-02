
(async function(){
  const LANGS=['en','es','de','ca','fr'];
  const WA={global:'34689138279',americas:'573187246938',dach:'491632349268'};
  let I18N={};
  try{I18N=await (await fetch('i18n.json',{cache:'no-store'})).json();}catch(e){I18N={};}

  const menuBtn=document.querySelector('[data-menu-toggle]');
  const mobile=document.querySelector('[data-mobile-menu]');
  if(menuBtn&&mobile){
    menuBtn.addEventListener('click',()=>{
      const open=mobile.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded',String(open));
    });
  }

  function getHashLang(){
    const h=(location.hash||'').replace('#','').toLowerCase();
    return LANGS.includes(h)?h:null;
  }
  function saved(){
    try{const x=localStorage.getItem('magistraLang');return LANGS.includes(x)?x:null;}catch(e){return null;}
  }
  function langNow(){
    return getHashLang()||saved()||(LANGS.includes((navigator.language||'en').slice(0,2))?(navigator.language||'en').slice(0,2):'en');
  }
  function save(lang){try{localStorage.setItem('magistraLang',lang)}catch(e){}}
  function apply(lang){
    if(!LANGS.includes(lang))lang='en';
    const d=I18N[lang]||I18N.en||{};
    document.documentElement.lang=lang;
    document.querySelectorAll('[data-i18n]').forEach(el=>{
      const k=el.getAttribute('data-i18n');
      if(d[k]) el.textContent=d[k];
    });
    document.querySelectorAll('[data-wa]').forEach(el=>{
      const region=el.getAttribute('data-wa')||'global';
      const msg=d.wa_msg||(I18N.en&&I18N.en.wa_msg)||'Hello Magistra Solutions';
      el.href='https://wa.me/'+WA[region]+'?text='+encodeURIComponent(msg);
      el.target='_blank';el.rel='noopener';
    });
    const picker=document.getElementById('language');
    if(picker)picker.value=lang;
    save(lang);
  }
  const picker=document.getElementById('language');
  if(picker)picker.addEventListener('change',()=>{
    const lang=picker.value; apply(lang);
    history.replaceState(null,'',location.pathname+location.search+'#'+lang);
  });
  window.addEventListener('hashchange',()=>{const h=getHashLang();if(h)apply(h)});
  apply(langNow());

  const animEls=document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  if('IntersectionObserver'in window&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io=new IntersectionObserver(entries=>entries.forEach(e=>{
      if(e.isIntersecting){e.target.classList.add('on');io.unobserve(e.target)}
    }),{threshold:.12,rootMargin:'0px 0px -45px 0px'});
    animEls.forEach((el,i)=>{el.style.transitionDelay=Math.min(i%4,3)*70+'ms';io.observe(el)})
  } else animEls.forEach(el=>el.classList.add('on'));

  function contactFor(subject,region){
    const s=(subject||'').toLowerCase(),r=(region||'').toLowerCase();
    if(/compliance|aml|kyc|risk|governance|due diligence/.test(s)||/dach|emea|germany|deutschland|austria|österreich|switzerland|schweiz|liechtenstein/.test(r))return 'compliance@magistra-solutions.com';
    if(/colombia|americas|latin america|latam/.test(r))return 'l.bahamon@magistra-solutions.com';
    return 'info@magistra-solutions.com';
  }
  const form=document.querySelector('[data-contact-form]');
  if(form)form.addEventListener('submit',ev=>{
    ev.preventDefault();
    const fd=new FormData(form);
    const name=(fd.get('name')||'').toString().trim(),company=(fd.get('company')||'').toString().trim(),email=(fd.get('email')||'').toString().trim(),region=(fd.get('region')||'').toString().trim(),subject=(fd.get('subject')||'').toString().trim(),message=(fd.get('message')||'').toString().trim();
    if(!name||!email||!subject||!message)return;
    const target=contactFor(subject+' '+message,region);
    const body=['Name: '+name,'Company: '+company,'Business Email: '+email,'Region: '+region,'',message].join('\n');
    location.href='mailto:'+target+'?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(body);
  });
})();
