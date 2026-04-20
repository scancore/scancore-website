import HTML from './index.html';

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

    // Patch index.html at runtime — no template literals used for injected code
    let html = HTML;

    // 1. Make submitQuote async
    html = html.replace('function submitQuote() {', 'async function submitQuote() {');

    // 2. Replace fake success block with real API call
    // We find the unique marker and replace from there to end of function
    const fakeMarker = '  // Show success';
    const fakeEnd = 'window.scrollTo(0,0);\n}';
    const fakeStart = html.indexOf(fakeMarker);
    const fakeEndIdx = html.indexOf(fakeEnd, fakeStart) + fakeEnd.length;

    if (fakeStart > -1) {
      const realCode = [
        '  const btn=document.getElementById(\'submitBtn\');',
        '  if(btn){btn.disabled=true;btn.textContent=\'Submitting...\'}',
        '  let contractAmount=0;',
        '  qState.selected.forEach(id=>{if(id===\'expedited\')return;const svc=SERVICES.find(s=>s.id===id);if(svc&&qState.sqft)contractAmount+=svc.calc(qState.sqft);});',
        '  if(qState.selected.has(\'expedited\'))contractAmount=Math.round(contractAmount*1.25);',
        '  const svcLabels={matterport:\'Matterport\',autocad:\'2D CAD\',sketchup:\'SketchUp\',design_pkg:\'Design Package\',rcp:\'RCP\',expedited:\'Expedited\'};',
        '  const services=[...qState.selected].map(id=>svcLabels[id]||id);',
        '  const payload={address:addr,sqFootage:sqft,contractAmount,services,contactName:name,contactEmail:email,contactPhone:(document.getElementById(\'contactPhone\')?.value||\'\').trim(),contactCompany:(document.getElementById(\'contactCompany\')?.value||\'\').trim(),propType:document.getElementById(\'propType\')?.value||\'residential\',notes:(document.getElementById(\'propNotes\')?.value||\'\').trim(),expedited:qState.selected.has(\'expedited\'),hvac:false};',
        '  try{',
        '    const res=await fetch(\'/api/public-quote\',{method:\'POST\',headers:{\'content-type\':\'application/json\'},body:JSON.stringify(payload)});',
        '    const data=await res.json().catch(()=>({}));',
        '    if(!res.ok||data.ok===false)throw new Error(data.error||\'Submission failed\');',
        '    document.querySelector(\'.qbody\').style.display=\'none\';',
        '    document.querySelector(\'.sqft-bar\').style.display=\'none\';',
        '    document.getElementById(\'sqftMinWarning\').style.display=\'none\';',
        '    document.getElementById(\'bundleUpgradeToast\').style.display=\'none\';',
        '    document.getElementById(\'successCard\').style.display=\'block\';',
        '    document.getElementById(\'quoteRefDisplay\').textContent=\'Quote \'+(data.quoteNumber||\'Submitted\');',
        '    window.scrollTo(0,0);',
        '  }catch(err){',
        '    if(btn){btn.disabled=false;btn.textContent=\'Submit Quote Request \u2192\';}',
        '    const errEl=document.getElementById(\'submitError\');',
        '    if(errEl){errEl.textContent=err.message||\'Something went wrong.\';errEl.style.display=\'block\';}',
        '  }',
        '}'
      ].join('\n');
      html = html.substring(0, fakeStart) + realCode + html.substring(fakeEndIdx);
    }

    // 3. Inject URL routing + fix nav links
    const routingScript = '<scr'+'ipt>\n' +
      '(function(){\n' +
      '  var R={"/":"home","/services":"wwd","/about":"about","/contact":"contact","/quote":"quote"};\n' +
      '  var B={home:"/",wwd:"/services",about:"/about",contact:"/contact",quote:"/quote"};\n' +
      '  function patch(){\n' +
      '    if(!window.go)return setTimeout(patch,30);\n' +
      '    var og=window.go;\n' +
      '    window.go=function(s){og(s);var p=B[s]||"/";if(location.pathname!==p)history.pushState({s:s},"",p);window.scrollTo(0,0);};\n' +
      '    var s0=R[location.pathname]||"home";\n' +
      '    if(s0!=="home")window.go(s0);\n' +
      '  }\n' +
      '  patch();\n' +
      '  window.addEventListener("popstate",function(e){window.go((e.state&&e.state.s)||R[location.pathname]||"home");});\n' +
      '})();\n' +
      '</scr'+'ipt>';

    html = html.replace('</body>', routingScript + '\n</body>');

    return new Response(html, {
      headers: {
        'content-type': 'text/html; charset=UTF-8',
        'cache-control': 'no-store',
      },
    });
  },
};
