import HTML from './index.html';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === '/api/public-quote' && request.method === 'POST') {
      return fetch('https://scantracker.scancore.ai/api/public-quote', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: request.body,
      });
    }

    // Inject script that overrides submitQuote after page loads
    const OVERRIDE = `<script>
submitQuote = async function() {
  let ok=true;
  const sqft=parseInt(document.getElementById('sqFootage')?.value||'0',10);
  const addr=(document.getElementById('propAddress')?.value||'').trim();
  const name=(document.getElementById('contactName')?.value||'').trim();
  const email=(document.getElementById('contactEmail')?.value||'').trim();
  document.getElementById('serviceError').classList.toggle('show',qState.selected.size===0);
  if(qState.selected.size===0)ok=false;
  if(!sqft||sqft<1000||sqft>50000){document.getElementById('sqftError').classList.add('show');ok=false;}
  else document.getElementById('sqftError').classList.remove('show');
  if(!addr||addr.length<5){document.getElementById('addrError').classList.add('show');ok=false;}
  else document.getElementById('addrError').classList.remove('show');
  if(!name||name.length<2){document.getElementById('nameError').classList.add('show');ok=false;}
  else document.getElementById('nameError').classList.remove('show');
  if(!/^[^@]+@[^@]+[.][^@]+$/.test(email)){document.getElementById('emailError').classList.add('show');ok=false;}
  else document.getElementById('emailError').classList.remove('show');
  if(!ok)return;
  const btn=document.getElementById('submitBtn');
  if(btn){btn.disabled=true;btn.textContent='Submitting...';}
  let ca=0;
  qState.selected.forEach(id=>{if(id==='expedited')return;const svc=SERVICES.find(s=>s.id===id);if(svc&&qState.sqft)ca+=svc.calc(qState.sqft);});
  if(qState.selected.has('expedited'))ca=Math.round(ca*1.25);
  const svcs=[...qState.selected].map(id=>({matterport:'Matterport',autocad:'2D CAD',sketchup:'SketchUp',design_pkg:'Design Package',rcp:'RCP',expedited:'Expedited'}[id]||id));
  const pl={address:addr,sqFootage:sqft,contractAmount:ca,services:svcs,contactName:name,contactEmail:email,contactPhone:(document.getElementById('contactPhone')?.value||'').trim(),contactCompany:(document.getElementById('contactCompany')?.value||'').trim(),propType:document.getElementById('propType')?.value||'residential',notes:(document.getElementById('propNotes')?.value||'').trim(),expedited:qState.selected.has('expedited'),hvac:false};
  try{
    const res=await fetch('/api/public-quote',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(pl)});
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
    if(btn){btn.disabled=false;btn.textContent='Submit Quote Request →';}
    const el=document.getElementById('submitError');
    if(el){el.textContent=err.message||'Something went wrong.';el.style.display='block';}
  }
};
<\/script>`;

    let html = HTML.replace('</body>', OVERRIDE + '\n</body>');
    html = html.replace(
      '<a href="https://www.instagram.com/scancore.ai"',
      '<a href="https://portal.scancore.ai" style="display:inline-flex;align-items:center;padding:.45rem 1rem;border:1.5px solid #1a3bff;border-radius:6px;color:#1a3bff;font-family:sans-serif;font-size:.8rem;font-weight:600;text-decoration:none;margin-right:.5rem;">&#128274; Client Login</a><a href="https://www.instagram.com/scancore.ai"'
    );

    return new Response(html, {
      headers: { 'content-type': 'text/html; charset=UTF-8', 'cache-control': 'no-store' },
    });
  },
};
