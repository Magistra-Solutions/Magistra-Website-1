
(function(){
  const root = document.documentElement;
  const menuBtn = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mobile-menu]');
  if(menuBtn && menu){
    menuBtn.addEventListener('click', function(){
      const open = menu.classList.toggle('open');
      menuBtn.setAttribute('aria-expanded', String(open));
    });
    menu.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      menu.classList.remove('open');
      menuBtn.setAttribute('aria-expanded','false');
    }));
  }

  const reveal = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    const io = new IntersectionObserver(entries=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          e.target.classList.add('on');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.12, rootMargin:'0px 0px -35px 0px'});
    reveal.forEach((el,i)=>{
      el.style.transitionDelay = Math.min(i%4,3)*70+'ms';
      io.observe(el);
    });
  } else {
    reveal.forEach(el=>el.classList.add('on'));
  }

  // Contact routing: no tracking, no external requests.
  const contactMap = {
    general: 'info@magistra-solutions.com',
    americas: 'l.bahamon@magistra-solutions.com',
    compliance: 'compliance@magistra-solutions.com'
  };

  function resolveContact(service, region){
    const s=(service||'').toLowerCase();
    const r=(region||'').toLowerCase();
    const complianceTerms=['compliance','aml','kyc','risk','governance','due diligence','regulatory'];
    const dachTerms=['dach','germany','deutschland','austria','österreich','switzerland','schweiz'];
    const americasTerms=['colombia','americas','latin america','latam','south america','central america'];

    if(complianceTerms.some(t=>s.includes(t)) || dachTerms.some(t=>r.includes(t))) return contactMap.compliance;
    if(americasTerms.some(t=>r.includes(t))) return contactMap.americas;
    return contactMap.general;
  }

  document.querySelectorAll('[data-smart-mail]').forEach(el=>{
    const service=el.getAttribute('data-service')||'';
    const region=el.getAttribute('data-region')||'';
    const subject=el.getAttribute('data-subject')||'Magistra Solutions inquiry';
    const email=resolveContact(service,region);
    el.href='mailto:'+email+'?subject='+encodeURIComponent(subject);
  });

  const form=document.querySelector('[data-contact-form]');
  if(form){
    const status=document.querySelector('[data-form-status]');
    form.addEventListener('submit',function(ev){
      ev.preventDefault();
      const fd=new FormData(form);
      const name=(fd.get('name')||'').toString().trim();
      const company=(fd.get('company')||'').toString().trim();
      const email=(fd.get('email')||'').toString().trim();
      const subject=(fd.get('subject')||'').toString().trim();
      const message=(fd.get('message')||'').toString().trim();
      const region=(fd.get('region')||'').toString().trim();

      if(!name || !email || !subject || !message){
        if(status) status.textContent='Please complete the required fields.';
        return;
      }

      const target=resolveContact(subject+' '+message,region);
      const body=[
        'Name: '+name,
        'Company: '+company,
        'Business Email: '+email,
        'Region: '+region,
        '',
        message
      ].join('\n');

      location.href='mailto:'+target+
        '?subject='+encodeURIComponent(subject)+
        '&body='+encodeURIComponent(body);

      if(status) status.textContent='Your email application should open now.';
    });
  }
})();
