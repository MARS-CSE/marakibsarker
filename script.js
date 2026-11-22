(() => {
'use strict';
const data = window.PORTFOLIO_DATA || {projects:[], certificates:[]};
const $ = (selector, root=document) => root.querySelector(selector);
const $$ = (selector, root=document) => [...root.querySelectorAll(selector)];
const escapeHTML = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const categoryTitles = {academics:'Academics',recognitions:'Academic Recognitions',training:'Training & Certificates',competition:'Competitions',mentoring:'Mentoring',service:'Leadership & service'};

// Theme toggle. Works without a backend and remembers the choice when possible.
const themeToggle = $('#themeToggle');
try {const stored=localStorage.getItem('rakib-portfolio-theme'); if(stored==='light'||stored==='dark') document.documentElement.dataset.theme=stored;}catch{}
function themeUI(){const dark=document.documentElement.dataset.theme==='dark';themeToggle.setAttribute('aria-label', dark?'Switch to light mode':'Switch to dark mode');themeToggle.title=dark?'Light mode':'Dark mode';themeToggle.innerHTML= dark ? '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.9 4.9l1.5 1.5m11.2 11.2 1.5 1.5M2 12h2m16 0h2M4.9 19.1l1.5-1.5M17.6 6.4l1.5-1.5"/></svg>' : '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.7 13.1A8.8 8.8 0 0 1 10.9 3.3a8.8 8.8 0 1 0 9.8 9.8Z"/></svg>';}
if(themeToggle){themeUI();themeToggle.addEventListener('click',()=>{document.documentElement.dataset.theme=document.documentElement.dataset.theme==='dark'?'light':'dark';try{localStorage.setItem('rakib-portfolio-theme',document.documentElement.dataset.theme);}catch{}themeUI();});}

// Mobile navigation.
const menuToggle=$('#menuToggle'), nav=$('#primaryNav');
function closeNav(){nav.classList.remove('open');menuToggle.setAttribute('aria-expanded','false');menuToggle.setAttribute('aria-label','Open navigation menu');}
menuToggle?.addEventListener('click',()=>{const open=!nav.classList.contains('open');nav.classList.toggle('open',open);menuToggle.setAttribute('aria-expanded',String(open));menuToggle.setAttribute('aria-label',open?'Close navigation menu':'Open navigation menu');});
$$('.main-nav a').forEach(a=>a.addEventListener('click',closeNav));
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeNav();});
document.addEventListener('click',e=>{if(nav.classList.contains('open')&&!nav.contains(e.target)&&!menuToggle.contains(e.target))closeNav();});

// Document progress and active section highlighting.
let scrollQueued=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight;$('#progressBar').style.width=(max>0?Math.max(0,Math.min(100,100*scrollY/max)):0)+'%';scrollQueued=false;}
window.addEventListener('scroll',()=>{if(!scrollQueued){scrollQueued=true;requestAnimationFrame(updateProgress);}}, {passive:true});
window.addEventListener('resize',updateProgress);updateProgress();
if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){$$('.main-nav a').forEach(a=>a.classList.toggle('current',a.getAttribute('href')==='#'+entry.target.id));}});},{rootMargin:'-25% 0px -64% 0px'});$$('main section[id]').forEach(s=>observer.observe(s));}

// Project listing and filtering.
const projectGrid=$('#projectGrid'), projectCount=$('#projectCount');
function projectMarkup(p,index){return `<article class="project-card"><div class="project-cover ${escapeHTML(p.category)}"><span>${escapeHTML(p.label.toUpperCase())}</span><strong>${escapeHTML(p.number)}</strong></div><div class="project-body"><div class="project-category">${escapeHTML(p.label)}</div><h3>${escapeHTML(p.title)}</h3><p>${escapeHTML(p.description)}</p><div class="project-stack">${p.stack.map(s=>`<span>${escapeHTML(s)}</span>`).join('')}</div><div class="project-bottom"><span>${escapeHTML(p.role)}</span><button type="button" class="project-open" data-project-index="${index}">Explore details ↗</button></div></div></article>`;}
let projectFilter='all';
function renderProjects(){if(!projectGrid)return;const shown=data.projects.filter(x=>projectFilter==='all'||x.category===projectFilter);projectGrid.innerHTML=shown.map(p=>projectMarkup(p,data.projects.indexOf(p))).join('');projectCount.textContent=`${shown.length} of ${data.projects.length} projects`;}
$$('#projectFilters button').forEach(btn=>btn.addEventListener('click',()=>{projectFilter=btn.dataset.filter;$$('#projectFilters button').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderProjects();}));renderProjects();
// Project detail dialogs make project overview links functional without inventing repositories.
const projectDialog=$('#projectDialog');let projectFocus=null;
projectGrid?.addEventListener('click',e=>{const b=e.target.closest('[data-project-index]');if(!b)return;const p=data.projects[Number(b.dataset.projectIndex)];if(!p)return;projectFocus=b;$('#projectModalCategory').textContent=p.label;$('#projectModalTitle').textContent=p.title;$('#projectModalRole').textContent=p.role;$('#projectModalDescription').textContent=p.description;$('#projectModalStack').innerHTML=p.stack.map(s=>`<span>${escapeHTML(s)}</span>`).join('');projectDialog.showModal();$('#projectModalClose').focus();});
$('#projectModalClose')?.addEventListener('click',()=>projectDialog.close());
projectDialog?.addEventListener('click',e=>{if(e.target===projectDialog)projectDialog.close();});
projectDialog?.addEventListener('close',()=>{if(projectFocus?.isConnected)projectFocus.focus();});

// Certificate data gallery with category and keyword filtering.
const certificateGrid=$('#certificateGrid'),certificateCount=$('#certificateCount'),certificateEmpty=$('#certificateEmpty'),certificateSearch=$('#certificateSearch');
let certificateFilter='all',searchText='';
function certificateMarkup(c,index){const hasImage=Boolean(c.image);const path=hasImage?`assets/certificates/${encodeURIComponent(c.image)}`:'';return `<article class="cert-card">${hasImage?`<button class="cert-preview" type="button" data-cert-index="${index}" aria-label="View ${escapeHTML(c.title)} certificate"><img src="${path}" alt="Certificate: ${escapeHTML(c.title)}" loading="lazy" decoding="async"></button>`:`<div class="cert-preview cert-placeholder"><span class="cert-placeholder-icon">✦</span><strong>${escapeHTML(c.category==='academics'?'Academic Document':'Credential')}</strong><small>${escapeHTML(c.note||'Image to be added')}</small></div>`}<div class="cert-detail"><div class="cert-meta"><span>${escapeHTML(categoryTitles[c.category]||c.category)}</span><span>${escapeHTML(c.year)}</span></div><h3>${escapeHTML(c.title)}</h3><p>${escapeHTML(c.issuer)}</p></div></article>`;}
function renderCertificates(){if(!certificateGrid)return;const matched=data.certificates.map((cert,index)=>({...cert,index})).filter(c=>(certificateFilter==='all'||c.category===certificateFilter) && (`${c.title} ${c.issuer} ${c.year} ${categoryTitles[c.category]}`.toLowerCase().includes(searchText)));certificateGrid.innerHTML=matched.map(c=>certificateMarkup(c,c.index)).join('');certificateCount.textContent=`Showing ${matched.length} of ${data.certificates.length} credentials`;certificateEmpty.hidden=matched.length!==0;}
$$('#certificateFilters button').forEach(btn=>btn.addEventListener('click',()=>{certificateFilter=btn.dataset.filter;$$('#certificateFilters button').forEach(b=>{const active=b===btn;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderCertificates();}));
certificateSearch?.addEventListener('input',()=>{searchText=certificateSearch.value.trim().toLowerCase();renderCertificates();});
renderCertificates();
$('#certificateHeadlineCount').textContent=String(data.certificates.length);$('#certificateAllCount').textContent=String(data.certificates.length);

// Accessible certificate preview. Large certificate images are taken from the source portfolio PDF.
const dialog=$('#certificateDialog'), modalClose=$('#modalClose');
let previouslyFocused=null;
certificateGrid?.addEventListener('click',event=>{const trigger=event.target.closest('[data-cert-index]');if(!trigger)return;const cert=data.certificates[Number(trigger.dataset.certIndex)];if(!cert||!cert.image)return;previouslyFocused=trigger;const path=`assets/certificates/${encodeURIComponent(cert.image)}`;$('#modalTitle').textContent=cert.title;$('#modalCategory').textContent=categoryTitles[cert.category]||cert.category;$('#modalIssuer').textContent=cert.issuer;$('#modalYear').textContent=cert.year==='—'?'Year not specified':cert.year;$('#modalImage').src=path;$('#modalImage').alt=`Certificate image for ${cert.title}`;$('#modalImageLink').href=path;dialog.showModal();modalClose.focus();});
modalClose?.addEventListener('click',()=>dialog.close());
dialog?.addEventListener('click',e=>{if(e.target===dialog)dialog.close();});
dialog?.addEventListener('close',()=>{if(previouslyFocused?.isConnected)previouslyFocused.focus();});

// Contact form: FormSubmit's AJAX endpoint enables in-page success/error feedback.
// On file:// previews, hosted form services cannot accept the page origin: offer a real mailto draft instead.
// Delivery still needs one-time FormSubmit activation by the recipient; a successful API response is NOT proof of inbox delivery.
const form = $('#contactForm');
const formButton = $('#contactSubmit');
const formStatus = $('#contactStatus');
const contactAddress = 'marakibsarker2001@gmail.com';
const previewMode = window.location.protocol === 'file:';
function setContactStatus(message, state='info') {
  if (!formStatus) return;
  formStatus.hidden = false;
  formStatus.dataset.state = state;
  formStatus.textContent = message;
}
if (form) {
  if (previewMode) {
    formButton.textContent = 'Compose email instead ↗';
    setContactStatus('Local preview: direct form submissions cannot work when the website is opened as a file. This button will prepare an email in your mail app; you will still need to send it.', 'info');
  } else if (window.location.protocol === 'https:' || window.location.protocol === 'http:') {
    $('#contactSource').value = window.location.href.split('#')[0];
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    // Native required/type=email validation occurs before the submit event; this is an extra safeguard.
    if (!form.reportValidity()) return;
    if (previewMode) {
      const fullName = $('#contactName').value.trim();
      const visitorEmail = $('#contactEmail').value.trim();
      const topic = $('#contactSubject').value;
      const message = $('#contactMessage').value.trim();
      const subject = encodeURIComponent(`Portfolio enquiry: ${topic}`);
      const body = encodeURIComponent(`Name: ${fullName}\nEmail: ${visitorEmail}\nSubject: ${topic}\n\n${message}`);
      setContactStatus('Your email application will open with a draft. Please press Send in that app; nothing has been sent automatically.', 'info');
      window.location.href = `mailto:${contactAddress}?subject=${subject}&body=${body}`;
      return;
    }
    const originalLabel = 'Send message ↗';
    formButton.disabled = true;
    formButton.textContent = 'Submitting…';
    setContactStatus('Submitting your message securely to the email-delivery service…', 'info');
    try {
      const endpoint = `https://formsubmit.co/ajax/${contactAddress}`;
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: {'Accept': 'application/json'}
      });
      let result = null;
      try { result = await response.json(); } catch { /* Unexpected response, handled below. */ }
      if (!response.ok || !result || !(result.success === true || result.success === 'true')) {
        throw new Error('FormSubmit did not confirm acceptance.');
      }
      form.reset();
      // Avoid suggesting inbox delivery is confirmed until activation has happened.
      setContactStatus('Your message was accepted by the contact service. Email delivery depends on the recipient having activated this form. Thank you for reaching out!', 'success');
    } catch (error) {
      setContactStatus('I could not confirm that your message was submitted. Your text is still in the form. Please try again later or use the direct email link below.', 'error');
    } finally {
      formButton.disabled = false;
      formButton.textContent = originalLabel;
    }
  });
}


// Photo journals: six are shown initially; each journal can contain multiple images.
const journalGrid=$('#journeyGrid'), journalMore=$('#journeyMore'), journalCount=$('#journeyCount');
const journals=data.journals||[]; let journalExpanded=false; let activeJournal=null; let activePhoto=0; let journalTrigger=null;
const journalDialog=$('#journalDialog');
function journeyPath(file){return `assets/journey/${encodeURIComponent(file)}`;}
function renderJournals(){
 if(!journalGrid)return;
 const subset=journalExpanded?journals:journals.slice(0,6);
 journalGrid.innerHTML=subset.map((j,i)=>`<article class="journal-card"><button type="button" class="journal-preview" data-journal-index="${i}" aria-label="View photo journal: ${escapeHTML(j.title)}"><img src="${journeyPath(j.images[0])}" loading="lazy" alt="${escapeHTML(j.captions[0]||j.title)}"><span class="journal-photo-badge">${j.images.length} photo${j.images.length===1?'':'s'} · View gallery ↗</span></button><div class="journal-card-caption"><div><strong>${escapeHTML(j.title)}</strong><small>${escapeHTML(j.category)}</small></div><span>${escapeHTML(j.date)}</span></div></article>`).join('');
 journalCount.textContent=`Showing ${subset.length} of ${journals.length} journal stories`;
 if(journalMore){journalMore.hidden=journals.length<=6;journalMore.innerHTML=journalExpanded?'Show fewer journals ↑':'See more photo journals ↓';journalMore.setAttribute('aria-expanded',String(journalExpanded));}
}
journalMore?.addEventListener('click',()=>{journalExpanded=!journalExpanded;renderJournals();if(!journalExpanded)document.querySelector('.journey-head')?.scrollIntoView({behavior:'smooth',block:'start'});});
function renderJournalPhoto(){
 const j=activeJournal;if(!j)return;
 const path=journeyPath(j.images[activePhoto]);
 $('#journalModalImage').src=path;
 $('#journalModalImage').alt=j.captions?.[activePhoto]||j.title;
 $('#journalPhotoCaption').textContent=j.captions?.[activePhoto]||j.title;
 $('#journalImageCounter').textContent=`Photo ${activePhoto+1} of ${j.images.length}`;
 $('#journalOriginal').href=path;
 $('#journalPrev').disabled=j.images.length<2;$('#journalNext').disabled=j.images.length<2;
 $('#journalThumbs').innerHTML=j.images.map((img,i)=>`<button type="button" data-photo-index="${i}" class="${i===activePhoto?'selected':''}" aria-label="Show photograph ${i+1}" aria-pressed="${i===activePhoto}"><img src="${journeyPath(img)}" alt=""></button>`).join('');
}
journalGrid?.addEventListener('click',e=>{const trigger=e.target.closest('[data-journal-index]');if(!trigger)return;const idx=Number(trigger.dataset.journalIndex);activeJournal=journals[idx];if(!activeJournal)return;activePhoto=0;journalTrigger=trigger;$('#journalModalCategory').textContent=activeJournal.category;$('#journalModalTitle').textContent=activeJournal.title;$('#journalModalDate').textContent=activeJournal.date;$('#journalModalDescription').textContent=activeJournal.description;renderJournalPhoto();journalDialog.showModal();$('#journalModalClose').focus();});
$('#journalPrev')?.addEventListener('click',()=>{activePhoto=(activePhoto-1+activeJournal.images.length)%activeJournal.images.length;renderJournalPhoto();});
$('#journalNext')?.addEventListener('click',()=>{activePhoto=(activePhoto+1)%activeJournal.images.length;renderJournalPhoto();});
$('#journalThumbs')?.addEventListener('click',e=>{const btn=e.target.closest('[data-photo-index]');if(!btn)return;activePhoto=Number(btn.dataset.photoIndex);renderJournalPhoto();});
$('#journalModalClose')?.addEventListener('click',()=>journalDialog.close());
journalDialog?.addEventListener('click',e=>{if(e.target===journalDialog)journalDialog.close();});
journalDialog?.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'&&activeJournal.images.length>1){activePhoto=(activePhoto-1+activeJournal.images.length)%activeJournal.images.length;renderJournalPhoto();}if(e.key==='ArrowRight'&&activeJournal.images.length>1){activePhoto=(activePhoto+1)%activeJournal.images.length;renderJournalPhoto();}});
journalDialog?.addEventListener('close',()=>{if(journalTrigger?.isConnected)journalTrigger.focus();});
renderJournals();
$('#year').textContent=new Date().getFullYear();
})();
