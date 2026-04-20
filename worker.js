import HTML from './index.html';

const REAL_SUBMIT = `async function submitQuote() {
  let ok=true;
  const sqft=parseInt(document.getElementById('sqFootage')?.value||'0',10);
  const addr=(document.getElementById('propAddress')?.value||'').trim();
  const name=(document.getElementById('contactName')?.value||'').trim();
  const email=(document.getElementById('contactEmail')?.value||'').trim();
  const svcErrEl=document.getElementById('serviceError');
  svcErrEl.classList.toggle('show',qState.selected.size===0);
  if(qState.selected.size===0)ok=false;
  const sqftErrEl=document.getElementById('sqftError');
  const sqftInputEl=document.getElementById('sqFootage');
  if(!sqft||sqft<1000||sqft>50000){sqftErrEl.textContent=sqft>0&&sqft<1000?'Minimum project size is 1,000 sq ft.':'Please enter square footage (1,000-50,000).';sqftErrEl.classList.add('show');sqftInputEl?.classList.add('error');ok=false;}else{sqftErrEl.classList.remove('show');sqftInputEl?.classList.remove('error');}
  const addrErrEl=document.getElementById('addrError');
  if(!addr||addr.length<5){addrErrEl.classList.add('show');document.getElementById('propAddress')?.classList.add('error');ok=false;}else{addrErrEl.classList.remove('show');document.getElementById('propAddress')?.classList.remove('error');}
  const nameErrEl=document.getElementById('nameError');
  if(!name||name.length<2){nameErrEl.classList.add('show');document.getElementById('contactName')?.classList.add('error');ok=false;}else{nameErrEl.classList.remove('show');document.getElementById('contactName')?.classList.remove('error');}
  const emailErrEl=document.getElementById('emailError');
  const eok=/^[^@]+@[^@]+[.][^@]+$/.test(email);
  if(!eok){emailErrEl.classList.add('show');document.getElementById('contactEmail')?.classList.add('error');ok=false;}else{emailErrEl.classList.remove('show');document.getElementById('contactEmail')?.classList.remove('error');}
  if(!ok)return;
  const btn=document.getElementById('submitBtn');
  if(btn){btn.disabled=true;btn.textContent='Submitting...';}
  let contractAmount=0;
  qState.selected.forEach(id=>{if(id==='expedited')return;const svc=SERVICES.find(s=>s.id===id);if(svc&&qState.sqft)contractAmount+=svc.calc(qState.sqft);});
  if(qState.selected.has('expedited'))contractAmount=Math.round(contractAmount*1.25);
  const svcLabels={matterport:'Matterport',autocad:'2D CAD',sketchup:'SketchUp',design_pkg:'Design Package',rcp:'RCP',expedited:'Expedited'};
  const services=[...qState.selected].map(id=>svcLabels[id]||id);
  const payload={address:addr,sqFootage:sqft,contractAmount,services,contactName:name,contactEmail:email,contactPhone:(document.getElementById('contactPhone')?.value||'').trim(),contactCompany:(document.getElementById('contactCompany')?.value||'').trim(),propType:document.getElementById('propType')?.value||'residential',notes:(document.getElementById('propNotes')?.value||'').trim(),expedited:qState.selected.has('expedited'),hvac:false};
  try{
    const res=await fetch('/api/public-quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(payload)});
    const data=await res.json().catch(()=>({}));
    if(!res.ok||data.ok===false)throw new Error(data.error||'Submission failed');
    document.querySelector('.qbody').style.display='none';
    document.querySelector('.sqft-bar').style.display='none';
    document.getElementById('sqftMinWarning').style.display='none';
    document.getElementById('bundleUpgradeToast').style.display='none';
    document.getElementById('successCard').style.display='block';
    document.getElementById('quoteRefDisplay').textContent='Quote '+(data.quoteNumber||'Submitted');
    window.scrollTo(0,0);
  }catch(err){
    if(btn){btn.disabled=false;btn.textContent='Submit Quote Request';}
    const errEl=document.getElementById('submitError');
    if(errEl){errEl.textContent=err.message||'Something went wrong. Please try again.';errEl.style.display='block';}
  }
}`;

// Script injected at end of <body> to handle URL routing + fix go() for shareable links
const ROUTING_SCRIPT = `<script>
(function(){
  // Map URL paths to section IDs
  var ROUTES = {'/':'home','/services':'wwd','/about':'about','/contact':'contact','/quote':'quote'};
  var REVERSE = {home:'/',wwd:'/services',about:'/about',contact:'/contact',quote:'/quote'};

  // Patch go() to also update the URL
  var _origGo = window.go;
  window.go = function(section) {
    if(_origGo) _origGo(section);
    var path = REVERSE[section] || '/';
    if(location.pathname !== path) history.pushState({section:section}, '', path);
    window.scrollTo(0,0);
  };

  // On load, navigate to the section matching the URL
  var startSection = ROUTES[location.pathname] || 'home';
  if(startSection !== 'home' && window.go) {
    setTimeout(function(){ window.go(startSection); }, 50);
  }

  // Handle browser back/forward
  window.addEventListener('popstate', function(e){
    var section = (e.state && e.state.section) || ROUTES[location.pathname] || 'home';
    if(window.go) window.go(section);
  });
})();
<\/script>`;

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Proxy quote submissions to ScanTracker
    if (url.pathname === '/api/public-quote' && request.method === 'POST') {
      return fetch('https://scantracker.scancore.ai/api/public-quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: request.body,
      });
    }

    // Serve the SPA for all page routes
    let html = HTML;

    // Fix submitQuote — replace fake version with real API call
    html = html.replace('function submitQuote() {', REAL_SUBMIT);

    // Inject URL routing script before </body>
    html = html.replace('</body>', ROUTING_SCRIPT + '</body>');

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': 'no-store',
      },
    });
  },
};
