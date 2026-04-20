// ═══════════════════════════════════════════════════════════
//  SCANCORE.AI — Cloudflare Worker
//  Serves: full marketing website (5 pages) + quote form
//  Quote submissions → https://scantracker.scancore.ai/api/public-quote
//  Admin login → redirects to https://scantracker.scancore.ai after auth
// ═══════════════════════════════════════════════════════════

const SCANTRACKER_URL = 'https://scantracker.scancore.ai';
const SESSION_KEY     = 'scancore-session-v1'; // must match ScanTracker

function html(body, status = 200) {
  return new Response(body, {
    status,
    headers: { 'content-type': 'text/html; charset=UTF-8', 'cache-control': 'no-store' }
  });
}

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path === '/' || path === '/index.html')        return html(SITE_HTML);
    if (path === '/what-we-do')                         return html(SITE_HTML);
    if (path === '/about')                              return html(SITE_HTML);
    if (path === '/contact')                            return html(SITE_HTML);
    if (path === '/quote' || path === '/quote.html')    return html(QUOTE_PAGE_HTML);
    if (path === '/admin' || path === '/admin/login')   return html(ADMIN_LOGIN_HTML);

    return new Response('Not found', { status: 404 });
  }
};

// ─── QUOTE PAGE ──────────────────────────────────────────────────────────
const QUOTE_PAGE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Get a Free Quote — ScanCore</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&display=swap" rel="stylesheet">
<style>
:root{
  --bg:#f0f2f7;--surface:#fff;--accent:#3b7ef4;--accent2:#2d6ee8;
  --text:#1a1d2e;--muted:#6b7080;--border:#e2e8f0;--border2:#cbd5e1;
  --green:#16a34a;--red:#dc2626;--orange:#d97706;--purple:#7c3aed;
  --r:10px;--rlg:16px;
  font-family:'DM Sans',sans-serif;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:var(--bg);color:var(--text);font-size:15px;line-height:1.6;min-height:100vh}
a{color:var(--accent)}

/* HEADER */
.site-header{background:var(--surface);border-bottom:1px solid var(--border2);padding:0 28px;height:64px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:20;box-shadow:0 1px 6px rgba(0,0,0,.07)}
.header-brand{display:flex;align-items:center;gap:10px}
.html-logo{display:flex;flex-direction:column;gap:1px}
.html-logo-mark{display:flex;align-items:center;line-height:1}
.hl-scan{font-family:'DM Sans',sans-serif;font-weight:900;font-size:32px;color:#111827;letter-spacing:-1.5px;line-height:1}
.hl-ore{font-family:'DM Sans',sans-serif;font-weight:900;font-size:32px;color:#3b7ef4;letter-spacing:-1.5px;line-height:1}
.hl-c-wrap{display:flex;align-items:center;margin:0 -2px}
.hl-tagline{font-family:'DM Sans',sans-serif;font-size:9.5px;font-weight:500;color:#6b7080;letter-spacing:0.4px;margin-top:1px;padding-left:2px}
.header-brand-text{font-size:18px;font-weight:700}
.header-sub{font-size:12px;color:var(--muted);font-weight:400}
.header-contact{font-size:13px;color:var(--muted)}
.header-contact-info{display:flex;align-items:center;gap:20px}
.hci-item{display:flex;align-items:center;gap:7px;text-decoration:none;color:var(--text);transition:.15s}
.hci-item:hover{color:var(--accent)}
.hci-icon{font-size:16px;flex-shrink:0}
.hci-item>span:last-child{display:flex;flex-direction:column;line-height:1.2}
.hci-label{font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em}
.hci-val{font-size:13px;font-weight:600;color:var(--text)}
.hci-item:hover .hci-val{color:var(--accent)}
@media(max-width:768px){
  .site-header{height:auto;padding:12px 16px;flex-direction:column;align-items:flex-start;gap:12px}
  .header-contact-info{flex-wrap:wrap;gap:14px;width:100%}
  .hci-item{flex:1;min-width:140px}
}

/* HERO */
.hero{background:linear-gradient(135deg,#0f1a3d 0%,#1e3fa8 55%,#3b7ef4 100%);color:#fff;padding:64px 24px 56px;text-align:center;position:relative;overflow:hidden}
.hero::before{content:'';position:absolute;inset:0;background:radial-gradient(circle at 70% 30%,rgba(255,255,255,.07) 0%,transparent 60%)}
.hero h1{font-size:clamp(28px,5vw,46px);font-weight:800;margin-bottom:14px;line-height:1.15;position:relative}
.hero p{font-size:17px;opacity:.85;max-width:540px;margin:0 auto;position:relative}
.hero-chips{display:flex;flex-wrap:wrap;gap:10px;justify-content:center;margin-top:24px;position:relative}
.hero-chip{background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:20px;padding:5px 14px;font-size:13px;font-weight:500}

/* LAYOUT */
.page-wrap{max-width:980px;margin:0 auto;padding:24px 20px 80px}

/* SQFT HERO BAR */
.sqft-hero{background:#fff;border-bottom:2px solid var(--accent);padding:0;position:sticky;top:64px;z-index:14;box-shadow:0 4px 16px rgba(59,126,244,.12)}
.sqft-hero-inner{max-width:980px;margin:0 auto;padding:16px 24px;display:flex;align-items:center;gap:20px;flex-wrap:wrap;background:linear-gradient(90deg,#f0f6ff 0%,#fff 60%)}
.sqft-hero-label{flex-shrink:0}
.sqft-hero-label strong{font-size:16px;font-weight:800;color:var(--accent);display:block}
.sqft-hero-label span{font-size:12px;color:var(--muted)}
.sqft-input-wrap{display:flex;align-items:center;gap:8px;flex:1;min-width:200px;max-width:320px}
.sqft-input-big{font-size:24px!important;font-weight:800!important;padding:12px 16px!important;border:2.5px solid var(--accent)!important;border-radius:var(--r)!important;text-align:center;width:100%!important;background:#eef4ff!important;color:var(--text)!important;letter-spacing:-0.5px}
.sqft-input-big:focus{box-shadow:0 0 0 4px rgba(59,126,244,.15)!important}
.sqft-input-big::placeholder{font-size:16px!important;font-weight:400!important;color:var(--muted)!important}
.sqft-unit{font-size:13px;font-weight:600;color:var(--muted);white-space:nowrap}

/* STICKY PRICE TICKER */
.price-ticker{flex:1;display:flex;align-items:center;justify-content:flex-end;gap:16px;flex-wrap:wrap}
.ticker-empty{font-size:13px;color:var(--muted);font-style:italic}
.ticker-services{display:flex;gap:6px;flex-wrap:wrap;align-items:center}
.ticker-svc-chip{font-size:11px;font-weight:600;padding:3px 9px;background:rgba(59,126,244,.08);border:1px solid rgba(59,126,244,.2);color:var(--accent);border-radius:12px}
.ticker-total{background:var(--accent);color:#fff;border-radius:10px;padding:10px 20px;text-align:center;flex-shrink:0}
.ticker-total-label{font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;opacity:.8}
.ticker-total-val{font-size:22px;font-weight:800;line-height:1.1}
.ticker-total.has-price{box-shadow:0 4px 14px rgba(59,126,244,.35)}
@media(max-width:768px){
  .sqft-hero{position:relative;top:auto}
  .sqft-hero-inner{gap:12px;flex-direction:column;align-items:stretch}
  .price-ticker{width:100%;justify-content:flex-start}
  .ticker-total{flex:1;text-align:center}
  .summary-card{position:relative;top:auto}
}

/* FORM COLUMNS */
.form-cols{display:grid;grid-template-columns:1fr 300px;gap:24px;align-items:start;margin-top:24px}
@media(max-width:800px){.form-cols{grid-template-columns:1fr}}
.summary-card{position:sticky;top:152px}

/* CARD */
.card{background:var(--surface);border:1px solid var(--border2);border-radius:var(--rlg);overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.06)}
.card-head{padding:18px 24px;border-bottom:1px solid var(--border);background:#f8faff}
.card-head h2{font-size:16px;font-weight:700;display:flex;align-items:center;gap:8px}
.card-head p{font-size:13px;color:var(--muted);margin-top:3px}
.card-body{padding:24px}
.card+.card{margin-top:0}

/* FORM */
.frow{margin-bottom:18px}
.frow label{display:block;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.06em;margin-bottom:6px}
.frow label .req{color:var(--red)}
.frow input,.frow select,.frow textarea{
  width:100%;padding:11px 14px;font-size:15px;font-family:inherit;
  border:1.5px solid var(--border2);border-radius:var(--r);
  background:#fff;color:var(--text);transition:border-color .15s,box-shadow .15s;
}
.frow input:focus,.frow select:focus,.frow textarea:focus{
  outline:none;border-color:var(--accent);
  box-shadow:0 0 0 4px rgba(59,126,244,.12);
}
.frow textarea{resize:vertical;min-height:90px}
.frow .hint{font-size:12px;color:var(--muted);margin-top:5px}
.frow-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
@media(max-width:560px){.frow-grid{grid-template-columns:1fr}}

/* SERVICE CARDS */
.svc-grid{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin-bottom:4px}
@media(max-width:560px){.svc-grid{grid-template-columns:1fr}}
.svc-card{
  border:2px solid var(--border2);border-radius:var(--r);padding:14px 16px;
  cursor:pointer;transition:all .18s;user-select:none;background:#fff;
  display:flex;align-items:flex-start;gap:10px;
}
.svc-card:hover{border-color:var(--accent);background:#f5f8ff}
.svc-card.selected{border-color:var(--accent);background:rgba(59,126,244,.07)}
.svc-card.selected .svc-check{background:var(--accent);border-color:var(--accent);color:#fff}
.svc-check{
  width:20px;height:20px;border-radius:5px;border:2px solid var(--border2);
  display:grid;place-items:center;flex-shrink:0;margin-top:1px;font-size:11px;font-weight:700;
  transition:.15s;
}
.svc-info{}
.svc-name{font-size:14px;font-weight:700;color:var(--text)}
.svc-desc{font-size:12px;color:var(--muted);margin-top:2px;line-height:1.4}
.svc-price{font-size:12px;font-weight:600;color:var(--accent);margin-top:4px}
.svc-badge{display:inline-block;font-size:10px;font-weight:700;padding:2px 7px;border-radius:10px;margin-top:4px}
.svc-badge.popular{background:rgba(22,163,74,.1);color:var(--green)}
.svc-badge.bundle{background:rgba(59,126,244,.1);color:var(--accent)}
.svc-badge.rush{background:rgba(217,119,6,.1);color:#b45309;border:1px solid rgba(217,119,6,.25);font-size:11px;font-weight:800}
.svc-badge.includes{background:linear-gradient(90deg,rgba(124,58,237,.12),rgba(59,126,244,.12));color:#5b21b6;border:1px solid rgba(124,58,237,.25);font-size:11px;font-weight:800;letter-spacing:.02em}
.bundle-upgrade-toast{display:none;margin:0 0 16px 0;padding:15px 16px;background:linear-gradient(135deg,#ecfdf5,#f0fdf4);border:2px solid #16a34a;border-radius:12px;animation:slideDown .3s ease;box-shadow:0 3px 10px rgba(22,163,74,.12)}
.bundle-upgrade-toast.show{display:flex;gap:12px;align-items:flex-start}
.but-icon{font-size:22px;flex-shrink:0;margin-top:1px}
.but-body{flex:1}
.but-title{font-size:14px;font-weight:800;color:#14532d;margin-bottom:4px}
.but-msg{font-size:13px;color:#166534;line-height:1.45}
.but-savings{display:inline-block;margin-top:8px;background:#16a34a;color:#fff;font-size:13px;font-weight:700;padding:5px 14px;border-radius:20px}
.but-actions{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
.but-accept{padding:7px 16px;background:#3b7ef4;color:#fff;border:none;border-radius:8px;font-size:13px;font-weight:700;cursor:pointer;transition:.15s}
.but-accept:hover{background:#2d6ee8}
.but-dismiss{padding:6px 12px;background:transparent;color:#6b7080;border:1px solid #cbd5e1;border-radius:8px;font-size:12px;cursor:pointer;transition:.15s}
.but-dismiss:hover{border-color:#94a3b8;color:#374151}
@keyframes slideDown{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:translateY(0)}}
.svc-card.matterport-disabled{opacity:.45;pointer-events:none;filter:grayscale(.4)}
.matterport-included-note{display:none;margin-top:8px;padding:7px 10px;background:linear-gradient(90deg,rgba(124,58,237,.08),rgba(59,126,244,.08));border:1px solid rgba(124,58,237,.2);border-radius:7px;font-size:12px;font-weight:700;color:#5b21b6;text-align:center}
.matterport-included-note.show{display:block}

/* QUOTE SUMMARY */
.summary-card{position:sticky;top:84px}
.line-item{display:flex;justify-content:space-between;align-items:center;padding:9px 0;border-bottom:1px solid var(--border)}
.line-item:last-child{border-bottom:none}
.li-label{font-size:13px;color:var(--muted)}
.li-val{font-size:14px;font-weight:600;color:var(--text)}
.total-row{display:flex;justify-content:space-between;align-items:center;padding:14px 0 0;margin-top:8px;border-top:2px solid var(--accent)}
.total-label{font-size:15px;font-weight:700}
.total-val{font-size:26px;font-weight:800;color:var(--accent)}
.no-services{text-align:center;padding:20px 0;color:var(--muted);font-size:13px}

/* DELIVERY TABLE */
.delivery-table{width:100%;border-collapse:collapse;font-size:13px;margin-top:8px}
.delivery-table th{text-align:left;padding:7px 10px;font-size:11px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.05em;background:#f8faff;border-bottom:1px solid var(--border)}
.delivery-table td{padding:8px 10px;border-bottom:1px solid var(--border)}
.delivery-table tr:last-child td{border-bottom:none}
.delivery-table tr.highlight td{background:rgba(59,126,244,.05);font-weight:600;color:var(--accent)}

/* ADDON */
.addon-row{display:flex;align-items:center;gap:10px;padding:10px 0;border-top:1px solid var(--border)}
.addon-toggle{width:40px;height:22px;border-radius:11px;background:var(--border2);border:none;cursor:pointer;position:relative;transition:.2s;flex-shrink:0}
.addon-toggle::after{content:'';position:absolute;width:16px;height:16px;border-radius:50%;background:#fff;top:3px;left:3px;transition:.2s;box-shadow:0 1px 3px rgba(0,0,0,.2)}
.addon-toggle.on{background:var(--accent)}
.addon-toggle.on::after{transform:translateX(18px)}
.addon-info{flex:1}
.addon-name{font-size:13px;font-weight:600}
.addon-desc{font-size:12px;color:var(--muted)}
.addon-price{font-size:13px;font-weight:700;color:var(--accent);white-space:nowrap}

/* SUBMIT BTN */
.submit-btn{
  width:100%;padding:15px;font-size:16px;font-weight:700;
  background:var(--accent);color:#fff;border:none;border-radius:var(--r);
  cursor:pointer;transition:.15s;margin-top:16px;
  display:flex;align-items:center;justify-content:center;gap:8px;
}
.submit-btn:hover{background:var(--accent2)}
.submit-btn:disabled{opacity:.5;cursor:not-allowed}
.submit-btn .spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.4);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:none}
.submit-btn.loading .spinner{display:block}
.submit-btn.loading .btn-text{display:none}
@keyframes spin{to{transform:rotate(360deg)}}

/* SUCCESS STATE */
.success-screen{display:none;text-align:center;padding:40px 24px}
.success-icon{width:72px;height:72px;background:rgba(22,163,74,.1);border-radius:50%;display:grid;place-items:center;margin:0 auto 20px;font-size:32px}
.success-screen h2{font-size:24px;font-weight:800;margin-bottom:10px}
.success-screen p{color:var(--muted);max-width:400px;margin:0 auto 20px}
.quote-ref{font-size:13px;font-weight:600;background:#f0f2f7;border:1px solid var(--border2);border-radius:8px;padding:10px 16px;display:inline-block;color:var(--text)}

/* INFO BOXES */
.info-box{background:#f0f6ff;border:1px solid rgba(59,126,244,.2);border-radius:var(--r);padding:14px 16px;font-size:13px;color:#1e3a8a;margin-bottom:16px;display:flex;gap:10px;align-items:flex-start}
.info-box.warn{background:#fffbeb;border-color:rgba(217,119,6,.2);color:#78350f}
.info-icon{flex-shrink:0;font-size:16px}

/* ERROR */
.field-error{color:var(--red);font-size:12px;margin-top:5px;display:none}
.field-error.show{display:block}
input.error,select.error,textarea.error{border-color:var(--red)!important}

/* FOOTER */
.site-footer{background:var(--text);color:rgba(255,255,255,.5);text-align:center;padding:24px;font-size:12px;margin-top:40px}
</style>
/* NAV OVERRIDE - match main site */
.back-nav{background:#0D0D0D;padding:12px 28px;display:flex;align-items:center;justify-content:space-between}
.back-nav a{color:#fff;font-size:13px;font-weight:600;display:flex;align-items:center;gap:6px;opacity:.8;transition:.15s}
.back-nav a:hover{opacity:1;text-decoration:none}
.back-nav .brand{font-family:'DM Sans',sans-serif;font-weight:900;font-size:1.3rem;color:#fff;letter-spacing:-.5px}
.back-nav .brand span{color:#FFE033}
</style>
</head>
<body>
<div class="back-nav">
  <a href="/" style="color:#FFE033">← Back to scancore.ai</a>
  <div class="brand">SCAN<span>CORE</span></div>
  <a href="/admin" style="font-size:12px;opacity:.5">Admin Login</a>
</div>
<header class="site-header">
  <div class="header-brand">
    <div class="html-logo">
      <div class="html-logo-mark">
        <span class="hl-scan">SCAN</span><span class="hl-c-wrap"><svg viewBox="0 0 36 44" width="28" height="36" style="display:block"><path d="M28 6 A16 16 0 1 0 28 38" fill="none" stroke="#3b7ef4" stroke-width="6.5" stroke-linecap="round"/></svg></span><span class="hl-ore">ORE</span>
      </div>
      <div class="hl-tagline">Reality Captured, Design Unleashed</div>
    </div>
  </div>
  <div class="header-contact-info">
    <a href="tel:18338657226" class="hci-item">
      <span class="hci-icon">📞</span>
      <span><span class="hci-label">Toll Free</span><span class="hci-val">1.833.865.SCAN</span></span>
    </a>
    <a href="mailto:info@scancore.ai" class="hci-item">
      <span class="hci-icon">✉️</span>
      <span><span class="hci-label">E-mail</span><span class="hci-val">info@scancore.ai</span></span>
    </a>
    <a href="https://instagram.com/scancore.ai" target="_blank" class="hci-item">
      <span class="hci-icon">📸</span>
      <span><span class="hci-label">Instagram</span><span class="hci-val">@scancore.ai</span></span>
    </a>
  </div>
</header>

<div class="hero">
  <h1>Get an Instant Quote</h1>
  <p>Select the services you need, enter your square footage, and see your price immediately.</p>
  <div class="hero-chips">
    <span class="hero-chip">📐 Instant pricing</span>
    <span class="hero-chip">✅ No obligation</span>
    <span class="hero-chip">⚡ Fast delivery</span>
    <span class="hero-chip">🏠 Residential specialists</span>
  </div>
</div>

<div class="sqft-hero">
  <div class="sqft-hero-inner">
    <div class="sqft-hero-label">
      <strong>📐 Enter Square Footage</strong>
      <span>Your price updates instantly as you type</span>
    </div>
    <div class="sqft-input-wrap">
      <input class="sqft-input-big" type="number" id="sqFootage" placeholder="e.g. 2,400"
             min="100" max="50000" step="50" required oninput="recalc()" autocomplete="off">
      <span class="sqft-unit">sq ft</span>
    </div>
    <div id="sqftMinWarning" style="display:none;align-items:center;gap:8px;background:#fff7ed;border:1.5px solid #f97316;border-radius:8px;padding:8px 14px;font-size:13px;font-weight:600;color:#c2410c;white-space:nowrap">
      ⚠️ Minimum is 1,000 sq ft
    </div>
    <div class="price-ticker" id="priceTicker">
      <span class="ticker-empty" id="tickerEmpty">← Select services below to see your price</span>
      <div class="ticker-services" id="tickerServices" style="display:none"></div>
      <div class="ticker-total" id="tickerTotal" style="display:none">
        <div class="ticker-total-label">Estimated Total</div>
        <div class="ticker-total-val" id="tickerTotalVal">$0</div>
      </div>
    </div>
  </div>
</div>

<div class="page-wrap">
  <div class="form-cols">
  <div>
    <div class="card" style="margin-bottom:20px">
      <div class="card-head">
        <h2>1️⃣ Choose Your Services <span style="color:var(--red)">*</span></h2>
        <p>Select one or more — all services include professional delivery within standard lead times</p>
      </div>
      <div class="card-body">
        <div id="bundleUpgradeToast" class="bundle-upgrade-toast">
          <div class="but-icon">🎉</div>
          <div class="but-body">
            <div class="but-title">You qualify for the Design Package Bundle!</div>
            <div class="but-msg">You've selected Matterport + AutoCAD + SketchUp individually. We've automatically switched you to the <strong>Design Package</strong> — you get all three services at a better price.</div>
            <div class="but-savings" id="bundleSavingsLabel">Save $0 (0% off)</div>
            <div class="but-actions">
              <button class="but-dismiss" onclick="dismissBundleUpgrade()">Undo — keep services separate instead</button>
            </div>
          </div>
        </div>
        <div class="svc-grid" id="serviceGrid"></div>
        <div id="matterportIncludedNote" class="matterport-included-note">
          ✅ <strong>Matterport 3D Tour + AutoCAD Floor Plan + SketchUp 3D Model</strong> are all included in the Design Package — no need to select them separately
        </div>
        <div id="serviceError" class="field-error">Please select at least one service.</div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-head">
        <h2>2️⃣ Property Details</h2>
        <p>Property address and type — needed to confirm your quote and schedule the scan</p>
      </div>
      <div class="card-body">
        <div class="frow">
          <label>Property Address <span class="req">*</span></label>
          <input type="text" id="propAddress" placeholder="123 Main St, Phoenix, AZ 85001" required>
          <div class="field-error" id="addrError">Please enter the property address.</div>
        </div>
        <div class="frow-grid">
          <div class="frow">
            <label>Property Type</label>
            <select id="propType">
              <option value="residential">Residential — Single Family</option>
              <option value="condo">Residential — Condo / Townhouse</option>
              <option value="multi">Multi-Family / Duplex</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div></div>
        </div>
        <div id="sqftError" class="field-error" style="margin-top:-10px;margin-bottom:10px">Please enter square footage (100–50,000).</div>
        <div class="frow">
          <label>Additional Notes</label>
          <textarea id="propNotes" placeholder="Any special access instructions, parking info, gate codes, or other details..."></textarea>
        </div>
      </div>
    </div>

    <div class="card" style="margin-bottom:20px">
      <div class="card-head">
        <h2>3️⃣ Your Contact Information</h2>
        <p>So we can send your quote and follow up to schedule</p>
      </div>
      <div class="card-body">
        <div class="frow-grid">
          <div class="frow">
            <label>Full Name <span class="req">*</span></label>
            <input type="text" id="contactName" placeholder="Jane Smith" required>
            <div class="field-error" id="nameError">Please enter your full name.</div>
          </div>
          <div class="frow">
            <label>Email Address <span class="req">*</span></label>
            <input type="email" id="contactEmail" placeholder="jane@example.com" required>
            <div class="field-error" id="emailError">Please enter a valid email address.</div>
          </div>
        </div>
        <div class="frow-grid">
          <div class="frow">
            <label>Phone Number</label>
            <input type="tel" id="contactPhone" placeholder="(602) 555-1234">
          </div>
          <div class="frow">
            <label>Company / Referring Firm</label>
            <input type="text" id="contactCompany" placeholder="Optional">
          </div>
        </div>
        <div class="info-box">
          <span class="info-icon">🔒</span>
          <span>Your information is only used to prepare and send your quote. We never sell or share your data.</span>
        </div>
        <button type="button" class="submit-btn" id="submitBtn" onclick="submitQuote()">
          <div class="spinner"></div>
          <span class="btn-text">📋 Submit Quote Request</span>
        </button>
        <div id="submitError" style="color:var(--red);font-size:13px;text-align:center;margin-top:10px;display:none"></div>
      </div>
    </div>

    <div class="card" id="successCard" style="display:none">
      <div class="success-screen" style="display:block">
        <div class="success-icon">✅</div>
        <h2>Quote Submitted!</h2>
        <p>Thanks! We've received your quote request and our team will be in touch within 1 business day.</p>
        <div class="quote-ref" id="quoteRefDisplay">Quote #QT-000</div>
        <div style="margin-top:20px;font-size:13px;color:var(--muted)">A copy of your quote details has been noted. Check your email for confirmation.</div>
        <a href="/" style="display:inline-block;margin-top:20px;padding:10px 24px;background:#0D0D0D;color:#fff;border-radius:8px;font-weight:700;font-size:14px;text-decoration:none">← Back to scancore.ai</a>
      </div>
    </div>
  </div>

  <div class="summary-card">
    <div class="card" style="margin-bottom:16px">
      <div class="card-head"><h2>💰 Price Breakdown</h2></div>
      <div class="card-body" id="summaryBody">
        <div class="no-services" id="noServicesMsg" style="text-align:center;padding:12px 0;font-size:13px;color:var(--muted)">Select services above to see breakdown</div>
        <div id="lineItems" style="display:none"></div>
        <div id="totalRow" style="display:none">
          <div class="total-row">
            <span class="total-label">Total</span>
            <span class="total-val" id="totalVal">$0</span>
          </div>
          <div style="font-size:11px;color:var(--muted);margin-top:8px;line-height:1.5">* Final price confirmed after property inspection.</div>
        </div>
      </div>
    </div>
    <div class="card" style="margin-bottom:16px">
      <div class="card-head"><h2>📅 Estimated Delivery</h2></div>
      <div class="card-body" style="padding:16px">
        <div id="deliveryInfo" style="font-size:13px;color:var(--muted);text-align:center;padding:8px 0">Enter square footage to see delivery timeline</div>
        <table class="delivery-table" id="deliveryTable" style="display:none">
          <thead><tr><th>Type</th><th>Timeline</th></tr></thead>
          <tbody id="deliveryBody"></tbody>
        </table>
      </div>
    </div>
    <div class="card">
      <div class="card-head"><h2>✅ What's Included</h2></div>
      <div class="card-body" style="font-size:13px;line-height:1.8;color:var(--muted)">
        <div>📐 Matterport 3D virtual tour with 6-month hosting</div>
        <div>📄 AutoCAD DWG 2D floor plan (plumbing, appliances, lighting, ceiling heights)</div>
        <div>🏗️ SketchUp 3D model</div>
        <div>🏠 RCP — Reflected Ceiling Plan</div>
        <div>⚡ Expedited delivery available</div>
        <div style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border)">
          <strong style="color:var(--text)">Measurement accuracy:</strong> ±2% on meshed average of scanned area
        </div>
      </div>
    </div>
  </div>
</div>
</div>

<footer class="site-footer">
  © 2025 ScanCore. All rights reserved. · <a href="/" style="color:rgba(255,255,255,.5)">scancore.ai</a> · Residential 3D Scanning Specialists
</footer>

<script>
// ── PRICING ENGINE ─────────────────────────────────────────────────────────
// Based on "All Projects" tier from pricing sheet (rows 14-19)
// Matterport:  $200 base up to 2000sqft, +$50 per additional 1000sqft
// AutoCAD:     $420 up to 1000sqft, $0.42/sqft above 1000sqft
// SketchUp:    $420 up to 1000sqft, $0.42/sqft above 1000sqft
// Design Pkg:  $700 up to 1000sqft, $0.70/sqft above (AutoCAD + SketchUp bundle — saves vs buying separate)
// Premiere:    $200 flat (treated as Matterport-equivalent for video)
// HVAC Addon:  $200 up to 1000sqft, $0.20/sqft above 1000sqft
// Expedited:   +25% of subtotal

const SERVICES = [
  {
    id: 'matterport',
    name: 'Matterport 3D Virtual Tour',
    desc: 'Interactive 3D walkthrough with 6-month hosting included',
    badge: 'popular',
    badgeText: '⭐ Most Popular',
    calc: (sqft) => {
      if (sqft <= 2000) return 200;
      return 200 + Math.ceil((sqft - 2000) / 1000) * 50;
    },
    priceLabel: (sqft) => sqft <= 2000 ? '$200 (up to 2,000 sq ft)' : '$200 + $50/1,000 sq ft over 2,000',
  },
  {
    id: 'autocad',
    name: 'AutoCAD DWG 2D Floor Plan',
    desc: 'Includes plumbing, appliances, lighting, windows/doors & ceiling heights',
    badge: null,
    calc: (sqft) => {
      if (sqft <= 1000) return 420;
      return Math.round(sqft * 0.42);
    },
    priceLabel: (sqft) => sqft <= 1000 ? '$420 (up to 1,000 sq ft)' : '$0.42/sq ft',
  },
  {
    id: 'sketchup',
    name: 'SketchUp SKP 3D Model',
    desc: 'Full 3D building model in SketchUp format for design workflows',
    badge: null,
    calc: (sqft) => {
      if (sqft <= 1000) return 420;
      return Math.round(sqft * 0.42);
    },
    priceLabel: (sqft) => sqft <= 1000 ? '$420 (up to 1,000 sq ft)' : '$0.42/sq ft',
  },
  {
    id: 'design_pkg',
    name: 'Design Package Bundle',
    desc: 'AutoCAD Floor Plan + SketchUp 3D Model + Matterport Tour — everything in one package',
    badge: 'includes',
    badgeText: '🏆 Includes Matterport 3D Virtual Tour — FREE',
    calc: (sqft) => {
      if (sqft <= 1000) return 700;
      return Math.round(sqft * 0.70);
    },
    priceLabel: (sqft) => sqft <= 1000 ? '$700 (up to 1,000 sq ft)' : '$0.70/sq ft',
  },
  {
    id: 'rcp',
    name: 'RCP — Reflected Ceiling Plan',
    desc: 'Detailed ceiling plan showing lighting fixtures, beams, soffits, HVAC registers & heights',
    badge: null,
    calc: (sqft) => {
      if (sqft <= 1000) return 200;
      return Math.round(sqft * 0.20);
    },
    priceLabel: (sqft) => sqft <= 1000 ? '$200 (up to 1,000 sq ft)' : '$0.20/sq ft',
  },
  {
    id: 'expedited',
    name: 'Expedited Delivery',
    desc: 'Rush turnaround — your deliverables prioritized ahead of standard queue. Adds 25% to your total.',
    badge: 'rush',
    badgeText: '⚡ +25% of total',
    isExpedited: true,
    calc: (sqft) => 0, // calculated as 25% of subtotal — shown in summary
    priceLabel: (sqft) => '+25% of total',
  },
];

const ADDONS = {};  // addons now handled as service cards

// State
const state = { selected: new Set(), sqft: 0 };

// ── INIT ───────────────────────────────────────────────────────────────────
function init() {
  const grid = document.getElementById('serviceGrid');
  grid.innerHTML = SERVICES.map(s => \`
    <div class="svc-card" id="svc_\${s.id}" onclick="toggleService('\${s.id}')">
      <div class="svc-check" id="chk_\${s.id}"></div>
      <div class="svc-info">
        <div class="svc-name">\${s.name}</div>
        <div class="svc-desc">\${s.desc}</div>
        <div class="svc-price" id="price_\${s.id}">—</div>
        \${s.badge ? \`<span class="svc-badge \${s.badge}">\${s.badgeText}</span>\` : ''}
      </div>
    </div>
  \`).join('');
  recalc();
}

// ── BUNDLE UPGRADE LOGIC ────────────────────────────────────────
let _bundleDismissed = false;

function checkBundleUpgrade() {
  const hasMatter = state.selected.has('matterport');
  const hasCAD    = state.selected.has('autocad');
  const hasSU     = state.selected.has('sketchup');
  const hasBundle = state.selected.has('design_pkg');
  const toast     = document.getElementById('bundleUpgradeToast');
  if (!toast) return;

  if (hasMatter && hasCAD && hasSU && !hasBundle && !_bundleDismissed) {
    // AUTO-SELECT the design package immediately
    state.selected.add('design_pkg');
    state.selected.delete('matterport');
    state.selected.delete('autocad');
    state.selected.delete('sketchup');
    // Grey out the bundled cards
    ['matterport','autocad','sketchup'].forEach(function(id) {
      document.getElementById('svc_'+id)?.classList.add('matterport-disabled');
    });
    document.getElementById('matterportIncludedNote')?.classList.add('show');
    // Show the success banner with savings
    const sqft = state.sqft || 1000;
    const sepPrice = calcSeparate(sqft);
    const pkgPrice = calcPkg(sqft);
    const savings  = sepPrice - pkgPrice;
    const discPct  = Math.round((savings / sepPrice) * 100);
    const savEl = document.getElementById('bundleSavingsLabel');
    if (savEl) savEl.textContent = 'You are saving $' + savings.toLocaleString() + ' — that is ' + discPct + '% off vs buying separately!';
    toast.classList.add('show');
    // Banner is right below sticky bar — always in view
  } else if (hasBundle) {
    // Keep banner visible while bundle is selected, update savings
    const sqft = state.sqft || 1000;
    const sepPrice = calcSeparate(sqft);
    const pkgPrice = calcPkg(sqft);
    const savings  = sepPrice - pkgPrice;
    const discPct  = Math.round((savings / sepPrice) * 100);
    const savEl = document.getElementById('bundleSavingsLabel');
    if (savEl) savEl.textContent = 'You are saving $' + savings.toLocaleString() + ' — that is ' + discPct + '% off vs buying separately!';
    toast.classList.add('show');
  } else {
    toast.classList.remove('show');
  }
}

function calcSeparate(sqft) {
  const m = sqft <= 2000 ? 200 : 200 + Math.ceil((sqft - 2000) / 1000) * 50;
  const c = sqft <= 1000 ? 420 : Math.round(sqft * 0.42);
  const s = sqft <= 1000 ? 420 : Math.round(sqft * 0.42);
  return m + c + s;
}

function calcPkg(sqft) {
  return sqft <= 1000 ? 700 : Math.round(sqft * 0.70);
}

function acceptBundleUpgrade() {
  _bundleDismissed = false;
  // Switch to design_pkg — reuse existing toggle logic
  state.selected.delete('matterport');
  state.selected.delete('autocad');
  state.selected.delete('sketchup');
  state.selected.add('design_pkg');
  ['matterport','autocad','sketchup'].forEach(id => {
    document.getElementById('svc_'+id)?.classList.add('matterport-disabled');
  });
  document.getElementById('svc_design_pkg')?.classList.add('selected');
  document.getElementById('chk_design_pkg').textContent = '✓';
  document.getElementById('matterportIncludedNote')?.classList.add('show');
  document.getElementById('bundleUpgradeToast')?.classList.remove('show');
  recalc();
}

function dismissBundleUpgrade() {
  _bundleDismissed = true;
  // Undo the bundle selection — restore the three individual services
  state.selected.delete('design_pkg');
  state.selected.add('matterport');
  state.selected.add('autocad');
  state.selected.add('sketchup');
  ['matterport','autocad','sketchup'].forEach(function(id) {
    document.getElementById('svc_'+id)?.classList.remove('matterport-disabled');
  });
  document.getElementById('matterportIncludedNote')?.classList.remove('show');
  document.getElementById('bundleUpgradeToast')?.classList.remove('show');
  recalc();
}

function toggleService(id) {
  // Design package is mutually exclusive with autocad+sketchup individually
  if (id === 'design_pkg') {
    if (state.selected.has('design_pkg')) {
      state.selected.delete('design_pkg');
      // Re-enable all bundled cards
      ['matterport','autocad','sketchup'].forEach(id => {
        document.getElementById('svc_'+id)?.classList.remove('matterport-disabled');
      });
      document.getElementById('matterportIncludedNote')?.classList.remove('show');
    } else {
      state.selected.add('design_pkg');
      // Deselect and grey out all bundled services
      ['matterport','autocad','sketchup'].forEach(id => {
        state.selected.delete(id);
        document.getElementById('svc_'+id)?.classList.add('matterport-disabled');
      });
      document.getElementById('matterportIncludedNote')?.classList.add('show');
    }
  } else if (id === 'autocad' || id === 'sketchup') {
    if (state.selected.has(id)) {
      state.selected.delete(id);
      _bundleDismissed = false; // reset so toast can reappear if they re-add
    } else {
      state.selected.add(id);
      // If design_pkg was selected, deselect it and re-enable all its bundled cards
      if (state.selected.has('design_pkg')) {
        state.selected.delete('design_pkg');
        ['matterport','autocad','sketchup'].forEach(sid => {
          document.getElementById('svc_'+sid)?.classList.remove('matterport-disabled');
        });
        document.getElementById('matterportIncludedNote')?.classList.remove('show');
      }
    }
  } else {
    if (state.selected.has(id)) {
      state.selected.delete(id);
      if (id === 'matterport') _bundleDismissed = false;
    } else {
      state.selected.add(id);
    }
  }
  checkBundleUpgrade();
  recalc();
}

function toggleAddon(id) { /* addons now handled as service cards */ }

function fmtCurrency(n) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

// ── RECALC ─────────────────────────────────────────────────────────────────
function recalc() {
  const sqftEl = document.getElementById('sqFootage');
  const rawSqft = parseInt(sqftEl?.value || '0', 10) || 0;
  const minWarning = document.getElementById('sqftMinWarning');
  if (rawSqft > 0 && rawSqft < 1000) {
    if (minWarning) minWarning.style.display = 'flex';
    state.sqft = 0; // don't calculate until minimum met
  } else {
    if (minWarning) minWarning.style.display = 'none';
    state.sqft = Math.max(0, rawSqft);
  }
  const sqft = state.sqft;

  // Update each service card price label
  SERVICES.forEach(s => {
    const priceEl = document.getElementById(\`price_\${s.id}\`);
    const cardEl = document.getElementById(\`svc_\${s.id}\`);
    const chkEl = document.getElementById(\`chk_\${s.id}\`);
    if (!priceEl) return;
    const isSelected = state.selected.has(s.id);
    cardEl.classList.toggle('selected', isSelected);
    chkEl.textContent = isSelected ? '✓' : '';
    // Expedited price shown dynamically after subtotal is known — skip here
    if (s.id === 'expedited') {
      priceEl.textContent = '+25% of subtotal';
      return;
    }
    if (sqft > 0) {
      const price = s.calc(sqft);
      priceEl.textContent = fmtCurrency(price) + ' for ' + sqft.toLocaleString() + ' sq ft';
    } else {
      priceEl.textContent = s.priceLabel(1000);
    }
  });

  // Calculate subtotal
  let subtotal = 0;
  const lineItemsHtml = [];

  // Build line items — skip expedited (calculated separately as % of subtotal)
  state.selected.forEach(id => {
    if (id === 'expedited') return;
    const svc = SERVICES.find(s => s.id === id);
    if (!svc || sqft === 0) return;
    const price = svc.calc(sqft);
    subtotal += price;
    lineItemsHtml.push(\`
      <div class="line-item">
        <span class="li-label">\${svc.name}</span>
        <span class="li-val">\${fmtCurrency(price)}</span>
      </div>
    \`);
  });

  // Expedited — 25% of non-expedited subtotal
  let total = subtotal;
  if (state.selected.has('expedited') && subtotal > 0) {
    const expFee = Math.round(subtotal * 0.25);
    total += expFee;
    // Add expedited as a line item with the real fee
    lineItemsHtml.push(\`
      <div class="line-item">
        <span class="li-label">⚡ Expedited Delivery (25%)</span>
        <span class="li-val">+\${fmtCurrency(expFee)}</span>
      </div>
    \`);
    const expPriceEl = document.getElementById('price_expedited');
    if (expPriceEl) expPriceEl.textContent = '+' + fmtCurrency(expFee) + ' (25% of subtotal)';
  } else {
    const expPriceEl = document.getElementById('price_expedited');
    if (expPriceEl) expPriceEl.textContent = subtotal > 0 ? '+' + fmtCurrency(Math.round(subtotal * 0.25)) + ' (25% of subtotal)' : '+25% of total';
  }

  checkBundleUpgrade();
  // Show/hide summary
  const hasSelection = state.selected.size > 0 && sqft > 0;

  // ── Update sticky price ticker ─────────────────────────────────
  const tickerEmpty = document.getElementById('tickerEmpty');
  const tickerSvcs  = document.getElementById('tickerServices');
  const tickerTot   = document.getElementById('tickerTotal');
  const tickerVal   = document.getElementById('tickerTotalVal');
  if (hasSelection) {
    if (tickerEmpty) tickerEmpty.style.display = 'none';
    if (tickerSvcs) {
      tickerSvcs.style.display = 'flex';
      const svcLabels = {matterport:'Matterport', autocad:'AutoCAD', sketchup:'SketchUp',
                         design_pkg:'Design Bundle', rcp:'RCP', expedited:'Expedited'};
      let chips = [...state.selected].map(id =>
        '<span class="ticker-svc-chip">' + (svcLabels[id]||id) + '</span>').join('');
      // expedited now in state.selected — already shown as chip above
      tickerSvcs.innerHTML = chips;
    }
    if (tickerTot) {
      tickerTot.style.display = 'block';
      tickerTot.classList.add('has-price');
    }
    if (tickerVal) tickerVal.textContent = fmtCurrency(total);
  } else {
    if (tickerEmpty) tickerEmpty.style.display = sqft > 0 ? 'block' : 'block';
    if (tickerEmpty) tickerEmpty.textContent = sqft > 0
      ? '← Select services below to see your price'
      : '← Enter sq ft above, then select services';
    if (tickerSvcs) tickerSvcs.style.display = 'none';
    if (tickerTot)  { tickerTot.style.display = 'none'; tickerTot.classList.remove('has-price'); }
  }
  document.getElementById('noServicesMsg').style.display = hasSelection ? 'none' : 'block';
  document.getElementById('lineItems').style.display = hasSelection ? 'block' : 'none';
  document.getElementById('totalRow').style.display = hasSelection ? 'block' : 'none';

  if (hasSelection) {
    document.getElementById('lineItems').innerHTML = lineItemsHtml.join('');
    document.getElementById('totalVal').textContent = fmtCurrency(total);
  }

  // Delivery timeline
  updateDelivery(sqft);
}

function updateDelivery(sqft) {
  const infoEl = document.getElementById('deliveryInfo');
  const tableEl = document.getElementById('deliveryTable');
  const bodyEl = document.getElementById('deliveryBody');
  if (!sqft || sqft < 100) {
    infoEl.style.display = 'block';
    tableEl.style.display = 'none';
    return;
  }
  infoEl.style.display = 'none';
  tableEl.style.display = 'table';

  // Standard delivery
  let std = '';
  if (sqft < 2000)       std = '5 business days';
  else if (sqft <= 4000) std = '5 business days';
  else if (sqft <= 6000) std = '7 business days';
  else                    std = '8+ business days';

  // Rush delivery
  let rush = '';
  if (sqft <= 1000)      rush = '3 business days';
  else if (sqft <= 2000) rush = '4 business days';
  else if (sqft <= 4000) rush = '5 business days';
  else                    rush = '6+ business days';

  // Time on site — based on sq footage regardless of service selected
  let timeOnSite = '';
  if (sqft < 2000)       timeOnSite = '1–1.5 hours';
  else if (sqft <= 4000) timeOnSite = '1.5–2 hours';
  else if (sqft <= 6000) timeOnSite = '2–3 hours';
  else                    timeOnSite = '3–4+ hours';

  const isRush = state.selected.has('expedited');
  bodyEl.innerHTML = \`
    <tr class="\${!isRush ? 'highlight' : ''}"><td>Standard delivery</td><td>\${std}</td></tr>
    <tr class="\${isRush ? 'highlight' : ''}"><td>⚡ Rush delivery</td><td>\${rush}</td></tr>
    <tr><td>Time on site</td><td>\${timeOnSite}</td></tr>
  \`;
}

// ── VALIDATION ─────────────────────────────────────────────────────────────
function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.add('show'); }
}
function clearError(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('show');
}
function setInputError(id, hasErr) {
  const el = document.getElementById(id);
  if (el) el.classList.toggle('error', hasErr);
}

function validate() {
  let ok = true;
  // Services
  if (state.selected.size === 0) {
    document.getElementById('serviceError').classList.add('show');
    ok = false;
  } else {
    document.getElementById('serviceError').classList.remove('show');
  }
  // Sqft
  const sqft = parseInt(document.getElementById('sqFootage').value || '0', 10);
  if (!sqft || sqft < 1000 || sqft > 50000) {
    showError('sqftError', sqft > 0 && sqft < 1000 ? 'Minimum project size is 1,000 sq ft.' : 'Please enter square footage (1,000–50,000).');
    setInputError('sqFootage', true);
    ok = false;
  } else { clearError('sqftError'); setInputError('sqFootage', false); }
  // Address
  const addr = document.getElementById('propAddress').value.trim();
  if (!addr || addr.length < 5) {
    showError('addrError', 'Please enter a valid property address.');
    setInputError('propAddress', true);
    ok = false;
  } else { clearError('addrError'); setInputError('propAddress', false); }
  // Name
  const name = document.getElementById('contactName').value.trim();
  if (!name || name.length < 2) {
    showError('nameError', 'Please enter your full name.');
    setInputError('contactName', true);
    ok = false;
  } else { clearError('nameError'); setInputError('contactName', false); }
  // Email
  const email = document.getElementById('contactEmail').value.trim();
  if (!email || !/^[^@]+@[^@]+\\.[^@]+$/.test(email)) {
    showError('emailError', 'Please enter a valid email address.');
    setInputError('contactEmail', true);
    ok = false;
  } else { clearError('emailError'); setInputError('contactEmail', false); }
  return ok;
}

// ── SUBMIT ─────────────────────────────────────────────────────────────────
async function submitQuote() {
  if (!validate()) {
    document.querySelector('.svc-card')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const btn = document.getElementById('submitBtn');
  btn.classList.add('loading');
  btn.disabled = true;
  document.getElementById('submitError').style.display = 'none';

  const sqft = parseInt(document.getElementById('sqFootage').value, 10);
  const services = Array.from(state.selected);
  // Calculate final price
  let contractAmount = 0;
  services.forEach(id => {
    const svc = SERVICES.find(s => s.id === id);
    if (svc) contractAmount += svc.calc(sqft);
  });
  if (state.selected.has('expedited')) contractAmount = Math.round(contractAmount * 1.25);

  const svcLabels = { matterport:'Matterport', autocad:'2D CAD', sketchup:'SketchUp', design_pkg:'Design Package', premiere:'Premiere' };
  const svcNames = services.map(id => svcLabels[id]||id);
  // services already in svcNames from state.selected

  const payload = {
    address: document.getElementById('propAddress').value.trim(),
    sqFootage: sqft,
    contractAmount,
    services: svcNames,
    contactName: document.getElementById('contactName').value.trim(),
    contactEmail: document.getElementById('contactEmail').value.trim(),
    contactPhone: document.getElementById('contactPhone').value.trim(),
    contactCompany: document.getElementById('contactCompany').value.trim(),
    propType: document.getElementById('propType').value,
    notes: document.getElementById('propNotes').value.trim(),
    expedited: state.selected.has('expedited'),
    hvac: false,
  };

  try {
    const res = await fetch('https://scantracker.scancore.ai/api/public-quote', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || data.ok === false) throw new Error(data.error || 'Submission failed');

    // Show success
    document.querySelector('.page-wrap').querySelector(':first-child').innerHTML = '';
    document.querySelector('.page-wrap').querySelector(':first-child').style.display = 'none';
    document.getElementById('successCard').style.display = 'block';
    document.getElementById('quoteRefDisplay').textContent = \`Quote Reference: \${data.quoteNumber || 'Submitted'}\`;
    document.querySelector('.page-wrap').scrollIntoView({ behavior: 'smooth' });
  } catch (err) {
    const errEl = document.getElementById('submitError');
    errEl.textContent = err.message || 'Something went wrong. Please try again.';
    errEl.style.display = 'block';
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}

// Recalc on sqft input with debounce
let recalcTimer;
document.getElementById('sqFootage').addEventListener('input', () => {
  clearTimeout(recalcTimer);
  recalcTimer = setTimeout(recalc, 150);
});

init();
</script>
</body>
</html>
`; // end QUOTE_PAGE_HTML


// ─── ADMIN LOGIN PAGE ─────────────────────────────────────────────────────
const ADMIN_LOGIN_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Admin Login — ScanCore</title>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@700;800;900&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet">
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Barlow',sans-serif;background:linear-gradient(135deg,#0a0f2e 0%,#0d1a5e 50%,#1a3ba0 100%);min-height:100vh;display:grid;place-items:center;padding:24px}
.panel{width:min(440px,100%)}
.brand{text-align:center;margin-bottom:32px}
.brand-logo{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:3rem;color:#fff;letter-spacing:-.5px;line-height:1}
.brand-logo span{color:#FFE033}
.brand-tag{font-size:.7rem;text-transform:uppercase;letter-spacing:.15em;color:rgba(255,255,255,.45);margin-top:4px}
.card{background:#fff;border-radius:16px;padding:36px;box-shadow:0 24px 80px rgba(0,0,0,.4)}
.card h2{font-family:'Barlow Condensed',sans-serif;font-size:1.8rem;font-weight:900;color:#0a0a0a;text-transform:uppercase;margin-bottom:4px}
.card p{font-size:.9rem;color:#888;margin-bottom:28px}
.fg{margin-bottom:18px}
.fg label{display:block;font-size:.75rem;font-weight:700;text-transform:uppercase;letter-spacing:.08em;color:#555;margin-bottom:6px}
.fg input{width:100%;padding:12px 16px;border:2px solid #e0e0e0;border-radius:8px;font-size:1rem;font-family:'Barlow',sans-serif;outline:none;transition:border-color .2s}
.fg input:focus{border-color:#1a3ba0}
.login-btn{width:100%;padding:15px;background:#0a0a0a;color:#fff;font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.1rem;letter-spacing:.08em;text-transform:uppercase;border:none;border-radius:8px;cursor:pointer;transition:background .2s;display:flex;align-items:center;justify-content:center;gap:8px;margin-top:4px}
.login-btn:hover{background:#1a1a1a}
.login-btn:disabled{opacity:.5;cursor:not-allowed}
.spinner{width:18px;height:18px;border:2px solid rgba(255,255,255,.35);border-top-color:#fff;border-radius:50%;animation:spin .7s linear infinite;display:none}
.login-btn.loading .spinner{display:block}
.login-btn.loading .btn-txt{display:none}
@keyframes spin{to{transform:rotate(360deg)}}
.err{color:#dc2626;font-size:.85rem;margin-top:12px;text-align:center;min-height:20px;font-weight:600}
.back{text-align:center;margin-top:20px}
.back a{color:rgba(255,255,255,.5);font-size:.82rem;text-decoration:none;transition:.2s}
.back a:hover{color:rgba(255,255,255,.85)}
.divider{display:flex;align-items:center;gap:12px;margin:20px 0}
.divider hr{flex:1;border:none;border-top:1px solid #e8e8e8}
.divider span{font-size:.75rem;color:#aaa;white-space:nowrap}
.show-pw{display:flex;align-items:center;gap:8px;font-size:.82rem;color:#888;margin-top:8px;cursor:pointer}
.show-pw input{width:auto;cursor:pointer}
</style>
</head>
<body>
<div class="panel">
  <div class="brand">
    <div class="brand-logo">SCAN<span>CORE</span></div>
    <div class="brand-tag">Admin Portal</div>
  </div>
  <div class="card">
    <h2>Welcome Back</h2>
    <p>Sign in to your ScanTracker admin account</p>
    <form id="loginForm" onsubmit="doLogin(event)">
      <div class="fg">
        <label>Username or Email</label>
        <input type="text" id="loginId" placeholder="admin or you@scancore.ai" required autocomplete="username">
      </div>
      <div class="fg">
        <label>Password</label>
        <input type="password" id="loginPw" placeholder="••••••••" required autocomplete="current-password">
        <label class="show-pw"><input type="checkbox" onchange="togglePw(this)"> Show password</label>
      </div>
      <button type="submit" class="login-btn" id="loginBtn">
        <div class="spinner"></div>
        <span class="btn-txt">Sign In to ScanTracker →</span>
      </button>
      <div class="err" id="loginErr"></div>
    </form>
    <div class="divider"><hr><span>Admin access only</span><hr></div>
    <p style="font-size:.78rem;color:#aaa;text-align:center;line-height:1.6">
      This login grants access to ScanTracker — the internal operations portal for managing quotes, scans, customers, and invoices.
    </p>
  </div>
  <div class="back"><a href="/">← Back to scancore.ai</a></div>
</div>

<script>
const SCANTRACKER = 'https://scantracker.scancore.ai';
const SESSION_KEY = 'scancore-session-v1';

function togglePw(cb) {
  document.getElementById('loginPw').type = cb.checked ? 'text' : 'password';
}

async function doLogin(e) {
  e.preventDefault();
  const btn = document.getElementById('loginBtn');
  const err = document.getElementById('loginErr');
  const identifier = document.getElementById('loginId').value.trim();
  const password   = document.getElementById('loginPw').value;
  err.textContent = '';
  btn.classList.add('loading');
  btn.disabled = true;

  try {
    const res  = await fetch(SCANTRACKER + '/api/login', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ identifier, password }),
    });
    const data = await res.json();
    if (!res.ok || data.ok === false) throw new Error(data.error || 'Login failed.');

    // Store session in ScanTracker's origin using a hidden iframe postMessage bridge
    // so ScanTracker's boot() can pick it up from localStorage
    const userId = data.user?.id;
    if (!userId) throw new Error('No user ID returned.');

    // Open ScanTracker in a new tab with the session embedded via URL hash
    // ScanTracker will read it on load (we add the handler below)
    const sessionPayload = encodeURIComponent(JSON.stringify({ userId }));
    window.open(SCANTRACKER + '/?session=' + sessionPayload, '_blank');

  } catch (ex) {
    err.textContent = ex.message || 'Login failed. Check your credentials.';
    btn.classList.remove('loading');
    btn.disabled = false;
  }
}
</script>
</body>
</html>`;

// ─── MAIN SITE HTML ───────────────────────────────────────────────────────
const SITE_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>ScanCore.ai — As-Built Documentation for Interior Designers</title>
<link rel="preconnect" href="https://fonts.googleapis.com"/>
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800;900&family=Barlow:wght@400;500;600;700&display=swap" rel="stylesheet"/>
<style>
/* ═══════════════════════════════════════════════
   SCANCORE — DESIGN SYSTEM
   Yellow #FFE033 | Blue-light #8BB8E8 | Black #0D0D0D
═══════════════════════════════════════════════ */
:root {
  --y: #FFE033;
  --y2: #e6ca00;
  --bl: #8BB8E8;
  --blt: #7DB3E6;
  --bk: #0D0D0D;
  --bk2: #1a1a1a;
  --wh: #ffffff;
  --gr: #f4f4f4;
  --gr2: #e8e8e8;
  --txt: #1a1a1a;
  --txt2: #555;
  --ab: #6aa8d8;
  --red: #e03c3c;
  --green: #2e9e5b;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
html{scroll-behavior:smooth;font-size:16px}
body{font-family:'Barlow',sans-serif;color:var(--txt);background:var(--wh);overflow-x:hidden;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
a{text-decoration:none;color:inherit}
h1,h2,h3,h4,h5{font-family:'Barlow Condensed',sans-serif;font-weight:900;text-transform:uppercase;line-height:.95}


/* ══════════════════════════════════
   NAV
══════════════════════════════════ */
.nav{position:sticky;top:0;z-index:500;background:var(--wh);border-bottom:1px solid #e4e4e4;display:flex;align-items:center;justify-content:space-between;padding:0 48px;height:86px;transition:box-shadow .3s}
.nav.scrolled{box-shadow:0 4px 24px rgba(0,0,0,.08)}
.nav-logo{display:flex;flex-direction:column;line-height:1;cursor:pointer;user-select:none}
.nav-logo-text{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:2.1rem;letter-spacing:-.5px;color:var(--bk)}
.nav-logo-text span{background:var(--bk);color:var(--y);padding:1px 4px;margin-left:2px}
.nav-logo-sub{font-size:.58rem;text-transform:uppercase;letter-spacing:.12em;color:#999;margin-top:4px}
.nav-menu{display:flex;align-items:center;gap:0;list-style:none}
.nav-sep{color:#ddd;padding:0 6px;font-size:.9rem}
.nav-link{font-family:'Barlow',sans-serif;font-weight:600;font-size:.95rem;color:var(--txt);padding:6px 14px;position:relative;cursor:pointer;transition:color .2s;white-space:nowrap}
.nav-link::after{content:'';position:absolute;bottom:0;left:14px;right:14px;height:2px;background:var(--bk);transform:scaleX(0);transition:transform .25s}
.nav-link.on::after,.nav-link:hover::after{transform:scaleX(1)}
.nav-link.cta{background:var(--bk);color:var(--wh);border-radius:4px;margin-left:12px;padding:8px 20px}
.nav-link.cta::after{display:none}
.nav-link.cta:hover{background:var(--bk2)}
.nav-icons{display:flex;align-items:center;gap:8px}
.ni{width:38px;height:38px;border-radius:50%;border:2px solid var(--bk);display:flex;align-items:center;justify-content:center;color:var(--bk);transition:background .2s,color .2s;cursor:pointer}
.ni:hover{background:var(--bk);color:var(--wh)}
.ni svg{width:17px;height:17px;fill:currentColor}
.ham{display:none;flex-direction:column;gap:5px;background:none;border:none;cursor:pointer;padding:6px}
.ham span{width:24px;height:2px;background:var(--bk);display:block;transition:all .3s}

/* ══════════════════════════════════
   HOME — HERO
══════════════════════════════════ */
.hero{position:relative;min-height:88vh;display:flex;align-items:flex-end;overflow:hidden}
.hero-slide{position:absolute;inset:0;background-size:cover;background-position:center;opacity:0;transition:opacity 1.4s ease}
.hero-slide.on{opacity:1}
.hero-overlay{position:absolute;inset:0;background:linear-gradient(135deg,rgba(30,40,160,.55) 0%,rgba(10,15,60,.35) 100%);z-index:1}
.hero-body{position:relative;z-index:2;padding:0 72px 80px;max-width:960px}
.hero-eyebrow{font-size:.75rem;text-transform:uppercase;letter-spacing:.18em;color:rgba(255,255,255,.65);font-weight:700;margin-bottom:16px;display:block}
.hero-h1{font-size:clamp(3.2rem,7vw,6.4rem);color:var(--wh);line-height:.93;margin-bottom:22px}
.hero-h1 em{color:var(--y);font-style:normal}
.hero-p{font-size:clamp(.95rem,1.5vw,1.1rem);color:rgba(255,255,255,.88);max-width:540px;line-height:1.65;margin-bottom:32px;font-weight:500}
.hero-btns{display:flex;gap:14px;flex-wrap:wrap;margin-bottom:36px}
.btn-yel{display:inline-flex;align-items:center;gap:8px;background:var(--y);color:var(--bk);font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1rem;letter-spacing:.07em;text-transform:uppercase;padding:14px 30px;border-radius:5px;cursor:pointer;border:none;transition:background .2s,transform .15s}
.btn-yel:hover{background:var(--y2);transform:translateY(-2px)}
.btn-ghost{display:inline-flex;align-items:center;gap:8px;background:transparent;color:var(--wh);font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:1rem;letter-spacing:.07em;text-transform:uppercase;padding:13px 28px;border-radius:5px;cursor:pointer;border:2px solid rgba(255,255,255,.5);transition:border-color .2s,transform .15s}
.btn-ghost:hover{border-color:var(--wh);transform:translateY(-2px)}
.hero-sw{display:flex;align-items:center;gap:10px;flex-wrap:wrap}
.sw-pill{display:flex;align-items:center;gap:7px;background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.3);backdrop-filter:blur(6px);border-radius:6px;padding:7px 14px;color:var(--wh);font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:.95rem;letter-spacing:.04em}
.sw-dot{width:10px;height:10px;border-radius:2px}
.dc{background:#e63c2f}.ds{background:#1e9e5e}.dr{background:#2e86de}
.hero-dots{position:absolute;right:48px;bottom:32px;z-index:3;display:flex;gap:8px}
.hd{width:28px;height:3px;border-radius:2px;background:rgba(255,255,255,.3);cursor:pointer;border:none;padding:0;transition:background .3s,width .3s}
.hd.on{background:var(--y);width:40px}

/* ── TICKER ── */
.ticker{background:var(--blt);display:flex}
.ti{flex:1;display:flex;align-items:center;gap:13px;padding:18px 44px;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:1.15rem;letter-spacing:.05em;color:var(--bk);text-transform:uppercase;border-right:1px solid rgba(0,0,0,.1)}
.ti:last-child{border-right:none}
.ti svg{width:30px;height:30px;flex-shrink:0;opacity:.75}

/* ── STATS STRIP ── */
.stats-strip{background:var(--bk);display:grid;grid-template-columns:repeat(4,1fr)}
.stat-cell{padding:36px 32px;border-right:1px solid #2a2a2a;text-align:center}
.stat-cell:last-child{border-right:none}
.stat-num{font-family:'Barlow Condensed',sans-serif;font-size:3rem;font-weight:900;color:var(--y);line-height:1}
.stat-label{font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:#888;margin-top:6px;font-weight:600}

/* ── PROBLEM ── */
.problem{position:relative;overflow:hidden;min-height:72vh;display:flex;align-items:center}
.problem-bg{position:absolute;inset:0;background:url('https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/scanningipad-1920w.jpg') center/cover no-repeat}
.problem-bg::after{content:'';position:absolute;inset:0;background:rgba(210,218,238,.92)}
.problem-inner{position:relative;z-index:1;max-width:1240px;margin:0 auto;padding:80px 60px;display:grid;grid-template-columns:1.1fr .9fr;gap:64px;align-items:center;width:100%}
.problem-text h2{font-size:clamp(2.6rem,5vw,4.4rem);color:var(--bk);margin-bottom:24px}
.problem-text p{font-size:1.05rem;line-height:1.75;color:#222;font-weight:500;margin-bottom:20px}
.problem-text p:last-child{margin-bottom:0}
.phone-wrap{display:flex;justify-content:center}
.phone{width:230px;height:470px;border-radius:38px;border:8px solid #1a1a1a;overflow:hidden;box-shadow:0 32px 80px rgba(0,0,0,.28);background:#000}
.phone img{width:100%;height:100%;object-fit:cover}

/* ── COVERAGE ── */
.coverage{background:var(--y);padding:96px 60px;position:relative;overflow:hidden}
.coverage::before{content:'';position:absolute;inset:0;opacity:.05;background-image:radial-gradient(circle,#000 1.5px,transparent 1.5px);background-size:48px 48px}
.coverage-inner{position:relative;z-index:1;max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:start}
.coverage-h{font-size:clamp(3rem,5.5vw,5.2rem);color:var(--bk);margin-bottom:28px}
.coverage-p{font-size:1rem;line-height:1.75;color:#111}
.coverage-p strong{font-weight:800}
.cov-feats{display:flex;flex-direction:column;gap:0;padding-top:4px}
.cov-feat{padding:24px 0}
.cov-hr{border:none;border-top:2px solid rgba(0,0,0,.18)}
.cov-feat h3{font-size:2.1rem;color:var(--bk);margin-bottom:10px}
.cov-feat p{font-size:1rem;line-height:1.65;color:#111}

/* ── PRECISION ── */
.precision{background:var(--wh);padding:96px 60px}
.precision-inner{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.precision-text h2{font-size:clamp(2.5rem,4.5vw,4rem);color:var(--bk);margin-bottom:24px}
.precision-text p{font-size:1rem;line-height:1.78;color:#333;margin-bottom:16px}
.precision-img img{width:100%;border-radius:10px;box-shadow:0 24px 72px rgba(0,0,0,.13)}

/* ── ABOUT TEASER ── */
.about-teaser{background:var(--gr);padding:96px 60px}
.about-teaser-inner{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:80px;align-items:center}
.at-img img{border-radius:10px;width:100%;height:480px;object-fit:cover;box-shadow:0 16px 56px rgba(0,0,0,.12)}
.at-eye{font-size:.72rem;text-transform:uppercase;letter-spacing:.15em;color:#999;font-weight:700;display:block;margin-bottom:14px}
.at-text h2{font-size:clamp(2rem,3.5vw,3.2rem);color:var(--bk);margin-bottom:20px}
.at-text p{font-size:1rem;line-height:1.78;color:#444;margin-bottom:28px}

/* ── BUTTONS ── */
.btn-dark{display:inline-flex;align-items:center;gap:8px;background:var(--bk);color:var(--wh);font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1rem;letter-spacing:.08em;text-transform:uppercase;padding:14px 32px;border-radius:5px;cursor:pointer;border:none;transition:background .2s,transform .15s}
.btn-dark:hover{background:var(--bk2);transform:translateY(-2px)}
.btn-yel-sm{display:inline-flex;align-items:center;gap:7px;background:var(--y);color:var(--bk);font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:.95rem;letter-spacing:.07em;text-transform:uppercase;padding:12px 26px;border-radius:5px;cursor:pointer;border:none;transition:background .2s,transform .15s}
.btn-yel-sm:hover{background:var(--y2);transform:translateY(-2px)}

/* ── CONTACT ROW ── */
.cr{display:flex;border-top:1px solid #ddd}
.cc{flex:1;display:flex;align-items:center;gap:18px;padding:26px 44px;border-right:1px solid #e8e8e8;transition:background .2s;cursor:pointer}
.cc:last-child{border-right:none}
.cc:hover{background:var(--gr)}
.ci{width:52px;height:52px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center}
.ci svg{width:24px;height:24px;fill:#fff}
.cphone{background:#5B9BD5}.cemail{background:#E87CA0}.cinsta{background:#E8B84B}
.cc-lbl{font-size:.72rem;text-transform:uppercase;letter-spacing:.09em;color:#999;font-weight:700}
.cc-val{font-family:'Barlow Condensed',sans-serif;font-size:1.35rem;font-weight:900;color:var(--bk);margin-top:2px}

/* ── FOOTER ── */
footer{background:var(--bl);padding:56px 60px 100px}
.footer-inner{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1.5fr 1fr 1fr 1fr;gap:48px}
.f-brand .fl{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:2rem;color:var(--bk);cursor:pointer}
.f-brand .fl span{background:var(--bk);color:var(--y);padding:1px 4px}
.f-brand p{font-size:.78rem;text-transform:uppercase;letter-spacing:.1em;color:#333;margin-top:6px;margin-bottom:16px}
.f-brand .f-social{display:flex;gap:10px;margin-top:12px}
.f-social a{width:36px;height:36px;border-radius:50%;background:var(--bk);display:flex;align-items:center;justify-content:center;transition:opacity .2s}
.f-social a:hover{opacity:.7}
.f-social svg{width:16px;height:16px;fill:#fff}
.f-col h5{font-family:'Barlow Condensed',sans-serif;font-size:1rem;font-weight:800;color:var(--bk);letter-spacing:.06em;margin-bottom:16px;text-transform:uppercase}
.f-col a,.f-col p{display:block;font-size:.88rem;color:#222;margin-bottom:10px;transition:opacity .2s;cursor:pointer;line-height:1.5}
.f-col a:hover{opacity:.6}
.f-bottom{max-width:1240px;margin:28px auto 0;padding-top:20px;border-top:1px solid rgba(0,0,0,.15);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px}
.f-copy{font-size:.78rem;color:#444}

/* ══════════════════════════════════
   WHAT WE DO PAGE
══════════════════════════════════ */
.page-hero{position:relative;min-height:72vh;display:flex;align-items:flex-end;background-size:cover;background-position:center;overflow:hidden}
.pho{position:absolute;inset:0;background:rgba(0,0,0,.54)}
.phc{position:relative;z-index:2;padding:0 72px 72px;max-width:1000px}
.phc h1{font-size:clamp(3rem,6.5vw,5.8rem);color:var(--wh);margin-bottom:18px}
.phc h1 em{color:var(--ab);font-style:normal}
.phc p{font-size:1.05rem;color:rgba(255,255,255,.88);line-height:1.65;max-width:660px;margin-bottom:28px}
.svc-sec{background:var(--gr);padding:80px 60px}
.sec-inner{max-width:1240px;margin:0 auto}
.sec-eye{font-size:.72rem;text-transform:uppercase;letter-spacing:.16em;color:#888;font-weight:700;display:block;margin-bottom:10px;text-align:center}
.sec-h{font-size:clamp(2rem,3.5vw,3rem);color:var(--bk);text-align:center;margin-bottom:52px}
.svc-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:22px}
.svc-card{background:var(--wh);border-radius:14px;border:2.5px solid var(--bk);padding:32px 28px;transition:transform .2s,box-shadow .2s}
.svc-card:hover{transform:translateY(-5px);box-shadow:0 16px 48px rgba(0,0,0,.1)}
.svc-card-icon{font-size:2rem;margin-bottom:14px}
.svc-card h3{font-size:1.05rem;margin-bottom:12px;color:var(--bk);line-height:1.2}
.svc-card p{font-size:.9rem;line-height:1.65;color:#555}

.one-scan{background:var(--wh);padding:96px 60px;position:relative}
.one-scan-inner{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1.1fr .9fr;gap:80px;align-items:start}
.one-scan-left h2{font-size:clamp(1.6rem,2.5vw,2.1rem);color:var(--bk);margin-bottom:28px;line-height:1.1}
.one-scan-left img{width:100%;border-radius:10px;margin-top:28px;box-shadow:0 12px 40px rgba(0,0,0,.12)}
.feats{display:flex;flex-direction:column;gap:0}
.feat{padding:20px 0;border-bottom:1px solid #e8e8e8}
.feat:last-child{border-bottom:none}
.feat h4{font-size:1.2rem;color:var(--bk);margin-bottom:7px}
.feat p{font-size:.9rem;line-height:1.65;color:#666}

.why-sec{background:var(--gr);padding:80px 60px}
.why-grid{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.why-card{background:var(--wh);border-radius:14px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,.07);transition:transform .2s}
.why-card:hover{transform:translateY(-5px)}
.why-card-img{height:200px;overflow:hidden}
.why-card-img img{width:100%;height:100%;object-fit:cover;transition:transform .4s}
.why-card:hover .why-card-img img{transform:scale(1.04)}
.why-card-body{padding:24px 24px 28px}
.why-card-body h3{font-size:1.2rem;color:var(--bk);margin-bottom:10px}
.why-card-body p{font-size:.88rem;line-height:1.65;color:#666}

.dark-banner{padding:80px 60px;position:relative;background:var(--bk)}
.dark-banner::before{content:'';position:absolute;inset:0;background:url('https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/cover-1920w.png') center/cover no-repeat;opacity:.08}
.dark-banner-inner{position:relative;z-index:1;max-width:900px;margin:0 auto;text-align:center}
.dark-banner-inner .sec-eye{color:#666;margin-bottom:20px}
.dark-banner-inner p{font-size:1rem;line-height:1.85;color:rgba(255,255,255,.78);margin-bottom:28px}

/* ══════════════════════════════════
   ABOUT PAGE
══════════════════════════════════ */
.about-split{display:grid;grid-template-columns:1fr 1fr;min-height:82vh;position:relative}
.about-col{position:relative;overflow:hidden;min-height:82vh}
.about-col img{width:100%;height:100%;object-fit:cover;display:block}
.about-col-overlay{position:absolute;inset:0;background:linear-gradient(to right,rgba(0,0,0,.5),rgba(0,0,0,.2))}
.about-hero-txt{position:absolute;bottom:64px;left:64px;z-index:10;max-width:700px}
.about-hero-txt h1{font-size:clamp(3rem,5.5vw,5rem);color:var(--wh);line-height:.93}
.about-hero-txt h1 em{color:var(--y);font-style:normal}

.about-story{background:var(--wh);padding:96px 60px}
.about-story-inner{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:1fr 1.3fr;gap:80px;align-items:start}
.about-story-img img{width:100%;border-radius:10px;box-shadow:0 24px 64px rgba(0,0,0,.12);position:sticky;top:108px}
.about-story-text .sec-eye{text-align:left;color:#888;margin-bottom:12px}
.about-story-text h2{font-size:clamp(2rem,3.5vw,3.2rem);color:var(--bk);margin-bottom:28px}
.about-story-text p{font-size:1rem;line-height:1.82;color:#333;margin-bottom:18px}
.about-story-text p:last-child{margin-bottom:0}

.values-sec{background:var(--gr);padding:80px 60px}
.values-grid{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:repeat(3,1fr);gap:28px}
.val-card{background:var(--wh);border-radius:14px;padding:36px 30px;border-top:4px solid var(--y)}
.val-card .val-icon{font-size:2.2rem;margin-bottom:16px}
.val-card h3{font-size:1.4rem;color:var(--bk);margin-bottom:12px}
.val-card p{font-size:.92rem;line-height:1.68;color:#555}

/* ══════════════════════════════════
   CONTACT PAGE
══════════════════════════════════ */
.contact-hero-bg{background:url('https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/realtor-scan%2B%281%29-1920w.jpg') center/cover no-repeat}
.contact-info-sec{background:var(--bl);padding:72px 60px}
.cinfo-header{text-align:center;margin-bottom:52px}
.cinfo-header .sec-eye{color:#333;margin-bottom:10px}
.cinfo-header h2{font-size:clamp(2rem,4vw,3.6rem);color:var(--bk)}
.cinfo-cards{max-width:1240px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:20px}
.cic{background:var(--wh);border-radius:14px;padding:32px 26px;transition:transform .2s;box-shadow:0 4px 16px rgba(0,0,0,.07)}
.cic:hover{transform:translateY(-4px)}
.cic-i{margin-bottom:18px}
.cic-i svg{width:32px;height:32px;fill:var(--bk)}
.cic h3{font-size:.82rem;letter-spacing:.1em;color:#888;margin-bottom:10px;text-transform:uppercase}
.cic a,.cic p{font-size:1rem;font-weight:700;color:var(--bk);line-height:1.4}
.cic strong{font-weight:900}

.cform-sec{background:var(--wh);padding:80px 60px}
.cform-inner{max-width:820px;margin:0 auto}
.cform-inner h2{font-size:clamp(2rem,4vw,3rem);color:var(--bk);margin-bottom:8px}
.cform-sub{color:#777;margin-bottom:44px;font-size:1rem}
.cf{display:flex;flex-direction:column;gap:22px}
.cf-row{display:grid;grid-template-columns:1fr 1fr;gap:22px}
.fg{display:flex;flex-direction:column;gap:6px}
.fg label{font-weight:700;font-size:.78rem;text-transform:uppercase;letter-spacing:.08em;color:#444}
.fg input,.fg textarea,.fg select{padding:13px 16px;border:2px solid #e0e0e0;border-radius:7px;font-family:'Barlow',sans-serif;font-size:1rem;outline:none;transition:border-color .2s;background:var(--wh);color:var(--txt)}
.fg input:focus,.fg textarea:focus,.fg select:focus{border-color:var(--bk)}
.fg textarea{resize:vertical;min-height:120px}
.chklbl{display:flex;align-items:flex-start;gap:10px;font-size:.86rem;color:#666;line-height:1.5;cursor:pointer}
.chklbl input{margin-top:3px;flex-shrink:0;accent-color:var(--bk)}
.cf-submit{background:var(--bk);color:var(--wh);font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.15rem;letter-spacing:.1em;text-transform:uppercase;padding:18px 40px;border:none;border-radius:7px;cursor:pointer;width:100%;transition:background .2s;margin-top:4px}
.cf-submit:hover{background:#222}
.cf-success{display:none;background:#ecf9f1;border:2px solid #4caf50;border-radius:10px;padding:28px;text-align:center;font-size:1.1rem;font-weight:600;color:#1e7e38;margin-top:16px}

/* ══════════════════════════════════
   QUOTE PAGE
══════════════════════════════════ */
.quote-hero{background:linear-gradient(135deg,#0d1a5e 0%,#1a3ba0 60%,#2756c5 100%);padding:72px 60px;text-align:center}
.quote-hero h1{font-size:clamp(2.8rem,6vw,5.2rem);color:var(--wh);margin-bottom:16px}
.quote-hero p{font-size:1.1rem;color:rgba(255,255,255,.82);max-width:580px;margin:0 auto 28px;line-height:1.6}
.q-badges{display:flex;justify-content:center;gap:10px;flex-wrap:wrap}
.qb{background:rgba(255,255,255,.12);border:1.5px solid rgba(255,255,255,.25);backdrop-filter:blur(4px);border-radius:100px;padding:8px 18px;color:rgba(255,255,255,.9);font-size:.85rem;font-weight:600}

.quote-wrap{background:#f0f2f6;padding:40px 60px 60px;min-height:60vh}
.quote-body{max-width:1200px;margin:0 auto;display:grid;grid-template-columns:1fr 360px;gap:28px;align-items:start}

/* sqft bar */
.sqft-bar{background:var(--wh);border-radius:12px;padding:20px 28px;margin-bottom:28px;display:grid;grid-template-columns:auto 1fr auto;gap:0;align-items:center;box-shadow:0 2px 12px rgba(0,0,0,.07)}
.sqft-bar label{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:1rem;color:var(--bk);text-transform:uppercase;letter-spacing:.05em;padding-right:20px;border-right:1px solid #e8e8e8;white-space:nowrap}
.sqft-bar label span{font-size:.78rem;font-weight:600;color:#aaa;display:block;text-transform:none;letter-spacing:0;margin-top:2px}
#qSqft{border:none;outline:none;font-family:'Barlow Condensed',sans-serif;font-size:2rem;font-weight:900;color:var(--bk);text-align:center;width:100%;padding:0 20px;background:transparent}
#qSqft::placeholder{color:#ccc;font-weight:700}
.sqft-unit{font-family:'Barlow Condensed',sans-serif;font-size:1.2rem;font-weight:700;color:#aaa;padding-left:16px;border-left:1px solid #e8e8e8;white-space:nowrap}
.sqft-hint{background:#fff3cd;border-left:4px solid #ffc107;padding:10px 16px;border-radius:4px;font-size:.82rem;color:#856404;margin-top:10px;display:none}

/* services section */
.q-section{background:var(--wh);border-radius:14px;padding:28px;box-shadow:0 2px 12px rgba(0,0,0,.07);margin-bottom:20px}
.q-section-head{display:flex;align-items:baseline;gap:10px;margin-bottom:20px}
.q-section-head h3{font-size:1.1rem;color:var(--bk)}
.q-section-head span{font-size:.82rem;color:#888}
.qsvc-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
.qsvc{border:2px solid #e0e0e0;border-radius:10px;padding:18px;cursor:pointer;transition:all .2s;position:relative;background:var(--wh)}
.qsvc:hover{border-color:#aaa}
.qsvc.sel{border-color:var(--bk);background:#fafafa}
.qsvc.disabled{opacity:.45;cursor:not-allowed;pointer-events:none}
.qsvc-check{width:22px;height:22px;border-radius:5px;border:2px solid #ccc;display:flex;align-items:center;justify-content:center;float:right;flex-shrink:0;transition:all .2s;font-size:.85rem;margin-left:8px;margin-top:2px}
.qsvc.sel .qsvc-check{background:var(--bk);border-color:var(--bk);color:var(--wh)}
.qsvc-name{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:1rem;color:var(--bk);margin-bottom:5px;padding-right:32px}
.qsvc-desc{font-size:.8rem;color:#888;line-height:1.5;margin-bottom:8px}
.qsvc-price{font-family:'Barlow Condensed',sans-serif;font-size:.95rem;font-weight:800;color:#2563eb}
.q-badge{display:inline-block;font-size:.72rem;font-weight:700;padding:3px 10px;border-radius:100px;margin-top:6px}
.q-badge.popular{background:#fff7e0;color:#b45309;border:1px solid #fbbf24}
.q-badge.bundle{background:#f0f9ff;color:#0369a1;border:1px solid #7dd3fc}
.bundle-toast{background:#ecfdf5;border:2px solid #16a34a;border-radius:10px;padding:14px 18px;margin-bottom:16px;display:none;align-items:center;justify-content:space-between;gap:12px;font-size:.88rem;color:#15803d;font-weight:600}
.bundle-toast.show{display:flex}
.bundle-toast button{font-size:.75rem;color:#666;background:none;border:none;cursor:pointer;text-decoration:underline;white-space:nowrap}

/* property + contact */
.qprop-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.qfield{display:flex;flex-direction:column;gap:5px}
.qfield label{font-weight:700;font-size:.75rem;text-transform:uppercase;letter-spacing:.07em;color:#555}
.qfield input,.qfield textarea,.qfield select{padding:11px 14px;border:2px solid #e0e0e0;border-radius:7px;font-family:'Barlow',sans-serif;font-size:.95rem;outline:none;transition:border-color .2s;background:var(--wh)}
.qfield input:focus,.qfield textarea:focus,.qfield select:focus{border-color:var(--bk)}
.qfield textarea{resize:vertical;min-height:90px}
.qfield.full{grid-column:1/-1}
.qerr{font-size:.75rem;color:var(--red);display:none;margin-top:3px}
.qerr.show{display:block}
.qinput-err{border-color:var(--red)!important}

/* sidebar */
.q-sidebar{position:sticky;top:108px;display:flex;flex-direction:column;gap:20px}
.q-box{background:var(--wh);border-radius:14px;padding:24px;box-shadow:0 2px 12px rgba(0,0,0,.07)}
.q-box h4{font-size:1.05rem;color:var(--bk);margin-bottom:16px}
.q-box .empty-txt{font-size:.88rem;color:#aaa;text-align:center;padding:12px 0}
.line-item{display:flex;justify-content:space-between;align-items:baseline;padding:10px 0;border-bottom:1px solid #f0f0f0;font-size:.88rem}
.line-item:last-child{border-bottom:none}
.li-lbl{color:#555;font-weight:500}
.li-val{font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:.95rem;color:var(--bk)}
.total-row{display:flex;justify-content:space-between;align-items:center;padding-top:14px;border-top:2.5px solid var(--bk);margin-top:4px}
.total-lbl{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1rem;color:var(--bk);text-transform:uppercase;letter-spacing:.05em}
.total-val{font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:2rem;color:var(--bk)}
.total-note{font-size:.72rem;color:#aaa;margin-top:4px}
.delivery-row{display:flex;justify-content:space-between;padding:8px 0;font-size:.85rem;border-bottom:1px solid #f0f0f0}
.delivery-row:last-child{border-bottom:none}
.delivery-row.hi{font-weight:700;color:var(--green)}
.incl-item{display:flex;align-items:flex-start;gap:8px;font-size:.82rem;color:#555;padding:5px 0}
.incl-item::before{content:'✓';color:var(--green);font-weight:900;flex-shrink:0;margin-top:1px}

.q-submit-btn{width:100%;background:var(--bk);color:var(--wh);font-family:'Barlow Condensed',sans-serif;font-weight:900;font-size:1.1rem;letter-spacing:.08em;text-transform:uppercase;padding:16px;border:none;border-radius:8px;cursor:pointer;transition:background .2s;margin-top:4px}
.q-submit-btn:hover{background:#222}
.q-submit-btn:disabled{background:#aaa;cursor:not-allowed}
.q-privacy{font-size:.72rem;color:#aaa;text-align:center;margin-top:10px}
.q-success{display:none;background:var(--wh);border-radius:14px;padding:40px;text-align:center;box-shadow:0 2px 12px rgba(0,0,0,.07)}
.q-success .qs-icon{font-size:3.5rem;margin-bottom:16px}
.q-success h3{font-size:2rem;color:var(--bk);margin-bottom:10px}
.q-success p{color:#555;line-height:1.7;margin-bottom:8px}

/* ══ RESPONSIVE ══ */
@media(max-width:1100px){
  .footer-inner{grid-template-columns:1fr 1fr;gap:32px}
  .svc-grid,.why-grid,.values-grid{grid-template-columns:repeat(2,1fr)}
  .cinfo-cards{grid-template-columns:repeat(2,1fr)}
  .quote-body{grid-template-columns:1fr}
  .q-sidebar{position:static}
}
@media(max-width:768px){
  .nav{padding:0 20px;height:78px}
  .nav-menu{display:none;position:absolute;top:78px;left:0;right:0;flex-direction:column;background:var(--wh);padding:16px;border-bottom:1px solid #e8e8e8;box-shadow:0 8px 24px rgba(0,0,0,.1);z-index:499}
  .nav-menu.open{display:flex}
  .nav-sep{display:none}
  .nav-link{padding:12px 16px;border-bottom:1px solid #f0f0f0;font-size:1.05rem}
  .nav-link.cta{margin:8px 0 0;border-radius:4px}
  .ham{display:flex}
  .hero-body{padding:0 24px 56px}
  .hero-h1{font-size:2.8rem}
  .ti{padding:14px 20px;font-size:1rem}
  .stats-strip{grid-template-columns:repeat(2,1fr)}
  .stat-cell:nth-child(2){border-right:none}
  .problem-inner{grid-template-columns:1fr;padding:56px 24px}
  .phone-wrap{display:none}
  .coverage{padding:60px 24px}
  .coverage-inner{grid-template-columns:1fr;gap:40px}
  .precision{padding:60px 24px}
  .precision-inner{grid-template-columns:1fr}
  .precision-img{display:none}
  .about-teaser{padding:60px 24px}
  .about-teaser-inner{grid-template-columns:1fr;gap:36px}
  .cr{flex-direction:column}
  .cc{border-right:none;border-bottom:1px solid #e8e8e8}
  footer{padding:48px 24px 100px}
  .footer-inner{grid-template-columns:1fr;gap:28px}
  .f-bottom{flex-direction:column;text-align:center}
  .phc{padding:0 24px 56px}
  .svc-sec,.one-scan,.why-sec,.dark-banner{padding:60px 24px}
  .svc-grid,.why-grid{grid-template-columns:1fr}
  .one-scan-inner{grid-template-columns:1fr}
  .about-split{grid-template-columns:1fr;min-height:auto}
  .about-col:last-child{display:none}
  .about-col{min-height:70vh}
  .about-hero-txt{left:24px;bottom:40px}
  .about-story{padding:60px 24px}
  .about-story-inner{grid-template-columns:1fr;gap:36px}
  .values-sec{padding:60px 24px}
  .values-grid{grid-template-columns:1fr}
  .contact-info-sec,.cform-sec{padding:60px 24px}
  .cinfo-cards{grid-template-columns:1fr}
  .cf-row{grid-template-columns:1fr}
  .quote-hero{padding:56px 24px}
  .quote-wrap{padding:28px 20px 48px}
  .qsvc-grid{grid-template-columns:1fr}
  .qprop-grid{grid-template-columns:1fr}
}
</style>
</head>
<body>

<!-- ════════════════════ SHARED NAV ════════════════════ -->
<nav class="nav" id="nav">
  <div class="nav-logo" onclick="go('home')">
    <div class="nav-logo-text">SCAN<span>CORE</span></div>
    <div class="nav-logo-sub">Reality Captured, Design Unleashed</div>
  </div>
  <button class="ham" id="ham" aria-label="Menu"><span></span><span></span><span></span></button>
  <ul class="nav-menu" id="navMenu">
    <li class="nav-sep" style="display:none">|</li>
    <li><span class="nav-link on" id="nl-home" onclick="go('home')">Home</span></li>
    <li class="nav-sep">|</li>
    <li><span class="nav-link" id="nl-wwd" onclick="go('wwd')">What We Do</span></li>
    <li class="nav-sep">|</li>
    <li><span class="nav-link" id="nl-about" onclick="go('about')">About</span></li>
    <li class="nav-sep">|</li>
    <li><span class="nav-link" id="nl-contact" onclick="go('contact')">Contact</span></li>
    <li class="nav-sep">|</li>
    <li><span class="nav-link cta" onclick="window.location.href='/quote'">Get a Quote</span></li>
  </ul>
  <div class="nav-icons">
    <a href="https://www.instagram.com/scancore.ai" target="_blank" class="ni" aria-label="Instagram">
      <svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
    </a>
    <a href="mailto:info@scancore.ai" class="ni" aria-label="Email">
      <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
    </a>
    <a href="tel:+18338652726" class="ni" aria-label="Call">
      <svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>
    </a>
  </div>
</nav>

<!-- ════════════════════════════════════════
     HOME
════════════════════════════════════════ -->
<div id="p-home" class="page">
  <section class="hero">
    <div class="hero-slide on" style="background-image:url('https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/scanningipad-1920w.jpg')"></div>
    <div class="hero-slide" style="background-image:url('https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/cover-1920w.png')"></div>
    <div class="hero-slide" style="background-image:url('https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/realtor-scan%2B%281%29-1920w.jpg')"></div>
    <div class="hero-overlay"></div>
    <div class="hero-body">
      <span class="hero-eyebrow">LiDAR Scanning · As-Built Documentation · All 50 States</span>
      <h1 class="hero-h1">AS-BUILT DOCUMENTATION<br>FOR <em>INTERIOR DESIGNERS</em></h1>
      <p class="hero-p">We scan real spaces and convert them into precise, designer-ready deliverables. From LiDAR point clouds to 2D CAD &amp; 3D Models.</p>
      <div class="hero-btns">
        <button class="btn-yel" onclick="window.location.href='/quote'">Get an Instant Quote →</button>
        <button class="btn-ghost" onclick="go('wwd')">See Our Services</button>
      </div>
      <div class="hero-sw">
        <div class="sw-pill"><div class="sw-dot dc"></div>AutoCAD</div>
        <div class="sw-pill"><div class="sw-dot ds"></div>SketchUp</div>
        <div class="sw-pill"><div class="sw-dot dr"></div>Revit</div>
        <div class="sw-pill" style="background:rgba(255,255,255,.1)">Matterport</div>
      </div>
    </div>
    <div class="hero-dots">
      <button class="hd on" data-i="0"></button>
      <button class="hd" data-i="1"></button>
      <button class="hd" data-i="2"></button>
    </div>
  </section>

  <div class="ticker">
    <div class="ti"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3" fill="currentColor" stroke="none"/><line x1="12" y1="3" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="21"/><line x1="3" y1="12" x2="6" y2="12"/><line x1="18" y1="12" x2="21" y2="12"/></svg>Precision LiDAR Site Scan</div>
    <div class="ti"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 15 8.5 22 9.5 17 14 18.5 21 12 17.5 5.5 21 7 14 2 9.5 9 8.5 12 2"/></svg>Point Cloud Generation</div>
    <div class="ti"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>Documentation &amp; 3D Models</div>
  </div>

  <div class="stats-strip">
    <div class="stat-cell"><div class="stat-num">50</div><div class="stat-label">States Covered</div></div>
    <div class="stat-cell"><div class="stat-num">±2mm</div><div class="stat-label">Scan Accuracy</div></div>
    <div class="stat-cell"><div class="stat-num">48hr</div><div class="stat-label">Avg. Turnaround</div></div>
    <div class="stat-cell"><div class="stat-num">25+</div><div class="stat-label">Years Design Exp.</div></div>
  </div>

  <section class="problem">
    <div class="problem-bg"></div>
    <div class="problem-inner">
      <div class="problem-text">
        <h2>The Problem: Guessing Measurements Costs Time and Money</h2>
        <p>Inaccurate plans lead to change orders, rework, and eroded client trust. Without reliable as-builts, you're designing blind.</p>
        <p>ScanCore delivers millimeter-accurate documentation using LiDAR, so every dimension is right the first time — no surprises, no site revisits, no expensive mistakes.</p>
        <button class="btn-dark" onclick="go('wwd')" style="margin-top:8px">See How It Works →</button>
      </div>
      <div class="phone-wrap">
        <div class="phone"><img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/scanningipad-1920w.jpg" alt="LiDAR scan"/></div>
      </div>
    </div>
  </section>

  <section class="coverage">
    <div class="coverage-inner">
      <div>
        <h2 class="coverage-h">NATIONWIDE COVERAGE FOR INTERIOR DESIGNERS</h2>
        <p class="coverage-p">At <strong>ScanCore.ai</strong>, we provide top-notch scanning services to interior designers across all 50 states. Our commitment to consistent scanning quality and rapid turnaround times ensures that your projects are always on track.</p>
      </div>
      <div class="cov-feats">
        <div class="cov-feat">
          <h3>50 States</h3>
          <p>We proudly serve interior designers in every state, delivering precise measurements and detailed documentation wherever your projects take you.</p>
        </div>
        <hr class="cov-hr"/>
        <div class="cov-feat">
          <h3>Fast Turnaround</h3>
          <p>Our advanced LiDAR technology allows us to deliver high-quality scans and 3D models quickly, so you can focus on what you do best — designing stunning interiors.</p>
        </div>
        <hr class="cov-hr"/>
        <div class="cov-feat">
          <h3>One Scan, Everything</h3>
          <p>CAD plans, SketchUp models, RCPs, Matterport tours, and BIM files — all from a single site visit. No juggling vendors.</p>
        </div>
      </div>
    </div>
  </section>

  <section class="precision">
    <div class="precision-inner">
      <div class="precision-text">
        <h2>PRECISION IN EVERY DETAIL</h2>
        <p>Our advanced LiDAR technology captures every spatial detail with millimeter-level precision — from existing ceiling conditions and window placements to built-in elements and structural constraints — giving you the accurate measurements and reliable spatial relationships you need to design with confidence.</p>
        <p>No more returning to sites for missing dimensions, no more discovering that your custom millwork won't fit, no more awkward client conversations about why the furniture layout needs to change.</p>
        <button class="btn-dark" onclick="window.location.href='/quote'" style="margin-top:8px">Get an Instant Quote →</button>
      </div>
      <div class="precision-img">
        <img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/cover-1920w.png" alt="ScanCore deliverables on devices"/>
      </div>
    </div>
  </section>

  <section class="about-teaser">
    <div class="about-teaser-inner">
      <div class="at-img"><img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/realtor-scan%2B%281%29-1920w.jpg" alt="Scanning with mobile device"/></div>
      <div class="at-text">
        <span class="at-eye">Reality Captured, Design Unleashed</span>
        <h2>BY INTERIOR DESIGNERS, FOR INTERIOR DESIGNERS</h2>
        <p>ScanCore was founded by Cortney Austin, a veteran interior designer with 25 years of experience who got tired of unreliable measurements — so she built a better solution. We use LiDAR technology to scan spaces and deliver precise as-built documentation including 2D CAD, SketchUp models, reflected ceiling plans, and Matterport 3D tours. We speak your language because we've been in your shoes.</p>
        <button class="btn-dark" onclick="go('about')">Our Story →</button>
      </div>
    </div>
  </section>

  <div class="cr">
    <a href="tel:+18338652726" class="cc"><div class="ci cphone"><svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg></div><div><div class="cc-lbl">Toll Free</div><div class="cc-val">1.833.865.SCAN</div></div></a>
    <a href="mailto:info@scancore.ai" class="cc"><div class="ci cemail"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div><div><div class="cc-lbl">E-mail</div><div class="cc-val">info@scancore.ai</div></div></a>
    <a href="https://www.instagram.com/scancore.ai" target="_blank" class="cc"><div class="ci cinsta"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></div><div><div class="cc-lbl">Instagram</div><div class="cc-val">@scancore.ai</div></div></a>
  </div>
  <div id="home-footer"></div>
</div>

<!-- ════════════════════════════════════════
     WHAT WE DO
════════════════════════════════════════ -->
<div id="p-wwd" class="page">
  <section class="page-hero" style="background-image:url('https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/cover-1920w.png')">
    <div class="pho"></div>
    <div class="phc">
      <h1>PRECISION SCANNING FOR <em>INTERIOR DESIGN</em> EXCELLENCE</h1>
      <p>At <strong>ScanCore.ai</strong>, we specialize in delivering accurate as-built documentation tailored for interior designers. Our advanced scanning technology provides detailed CAD drawings, point clouds using LiDAR, and 3D models for SketchUp and Matterport.</p>
      <button class="btn-yel" onclick="window.location.href='/quote'">Get an Instant Quote →</button>
    </div>
  </section>

  <section class="svc-sec">
    <div class="sec-inner">
      <span class="sec-eye">Streamline Your Interior Design Process</span>
      <h2 class="sec-h">COMPREHENSIVE SCANNING &amp; DOCUMENTATION SERVICES</h2>
      <div class="svc-grid">
        <div class="svc-card"><div class="svc-card-icon">🧊</div><h3>SketchUp 3D Model</h3><p>Design-ready SketchUp models converted directly from hyper accurate LiDAR scans. Measurement accurate &amp; fully editable, our models integrate seamlessly into interior design workflows saving hours of manual modeling time.</p></div>
        <div class="svc-card"><div class="svc-card-icon">📐</div><h3>CAD Floor Plan</h3><p>Accurate CAD floor plans extracted from LiDAR scans. Includes plumbing, appliances, lighting, windows, doors, and ceiling heights — precise measurements and spatial data for confident space planning.</p></div>
        <div class="svc-card"><div class="svc-card-icon">🏗️</div><h3>Reflected Ceiling Plan</h3><p>RCP's with precise fixture locations, ceiling heights, and structural elements captured by LiDAR. Essential for lighting layouts and ceiling treatments without risks or costs of manual measurement.</p></div>
        <div class="svc-card"><div class="svc-card-icon">🎬</div><h3>Matterport Virtual Tour</h3><p>Fully immersive 3D virtual tours allowing designers and clients to explore spaces remotely with dollhouse views and 360° walkthroughs. Includes 6-month hosting. Reduce miscommunication and minimize site visits.</p></div>
        <div class="svc-card"><div class="svc-card-icon">🏢</div><h3>Revit BIM Model</h3><p>Fully intelligent Revit BIM models converted from your LiDAR scans, complete with parametric elements and embedded data. Enables clash detection, design coordination, and seamless collaboration.</p></div>
        <div class="svc-card"><div class="svc-card-icon">🏠</div><h3>Interior &amp; Exterior</h3><p>We document entire properties with comprehensive LiDAR scanning capturing both interior rooms and exterior facades — unified spatial data showing how indoor and outdoor spaces connect.</p></div>
      </div>
    </div>
  </section>

  <section class="one-scan">
    <div class="one-scan-inner">
      <div class="one-scan-left">
        <span class="sec-eye">One Scan, Complete Documentation</span>
        <h2>FROM THE INITIAL SCAN TO FINAL DELIVERY — EVERYTHING YOU NEED, ALL FROM A SINGLE SITE VISIT</h2>
        <p style="font-size:1rem;line-height:1.75;color:#555;margin-top:16px">We streamline the entire process of capturing your space. From the initial scan to the final delivery, we provide spatially coordinated CAD plans, 3D models, BIM files, and immersive virtual tours — all from one visit.</p>
        <img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/realtor-scan%2B%281%29-1920w.jpg" alt="LiDAR scanning technician"/>
      </div>
      <div class="feats">
        <div class="feat"><h4>Accurate CAD Drawings</h4><p>Meticulously crafted to ensure precision, giving interior designers the exact measurements and layouts they need for their projects.</p></div>
        <div class="feat"><h4>3D Models for SketchUp</h4><p>Detailed 3D models compatible with SketchUp, allowing designers to visualize and manipulate their designs effortlessly.</p></div>
        <div class="feat"><h4>BIM File Generation</h4><p>Building Information Modeling files provide comprehensive data about your space, enhancing collaboration and efficiency in design.</p></div>
        <div class="feat"><h4>Matterport Virtual Tours</h4><p>Interactive way to explore and present designs to clients — accessible 24/7 from anywhere in the world.</p></div>
        <div class="feat"><h4>Point Cloud Data</h4><p>Ultra-dense 3D point cloud data generated using advanced LiDAR technology — the foundation of all our deliverables.</p></div>
        <div class="feat"><h4>Seamless Workflow</h4><p>Our end-to-end workflow means you focus on creativity while we handle the technical details, delivering everything in one go.</p></div>
      </div>
    </div>
  </section>

  <section class="why-sec">
    <div class="sec-inner">
      <h2 class="sec-h" style="margin-bottom:40px">WHY SCANCORE</h2>
      <div class="why-grid">
        <div class="why-card"><div class="why-card-img"><img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/scanningipad-1920w.jpg" alt="Precision"/></div><div class="why-card-body"><h3>PRECISION IN EVERY DETAIL</h3><p>Our advanced LiDAR technology captures every spatial detail with precision, documenting exactly what exists on-site. Design with confidence knowing every measurement is accurate.</p></div></div>
        <div class="why-card"><div class="why-card-img"><img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/cover-1920w.png" alt="Workflow"/></div><div class="why-card-body"><h3>END-TO-END WORKFLOW</h3><p>One scan, complete documentation. We manage everything from initial capture through final delivery — CAD plans, 3D models, BIM files, and virtual tours from a single site visit.</p></div></div>
        <div class="why-card"><div class="why-card-img"><img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/realtor-scan%2B%281%29-1920w.jpg" alt="Nationwide"/></div><div class="why-card-body"><h3>NATIONWIDE SCANNING</h3><p>Consistent scanning quality and fast turnaround times across all 50 states. Professional LiDAR technology and design-focused expertise at your project sites nationwide.</p></div></div>
      </div>
    </div>
  </section>

  <section class="dark-banner">
    <div class="dark-banner-inner">
      <span class="sec-eye" style="color:#666;font-size:.88rem">By interior designers · For interior designers</span>
      <h2 style="font-size:clamp(2rem,4vw,3.5rem);color:#fff;margin:16px 0 24px">ACCURATE DATA CAPTURE TAILORED FOR YOUR WORKFLOW</h2>
      <p>From initial site capture to final deliverables, we provide a complete end-to-end workflow that transforms raw LiDAR data into design-ready documentation. Our turnkey service eliminates the complexity of managing multiple vendors — delivering coordinated outputs including CAD plans, 3D models, virtual tours, and BIM files from a single scan session.</p>
      <button class="btn-yel" onclick="window.location.href='/quote'">Get an Instant Quote →</button>
    </div>
  </section>
  <div id="wwd-cr"></div>
  <div id="wwd-footer"></div>
</div>

<!-- ════════════════════════════════════════
     ABOUT
════════════════════════════════════════ -->
<div id="p-about" class="page">
  <div class="about-split">
    <div class="about-col">
      <img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/cover-1920w.png" alt="LiDAR scanner"/>
      <div class="about-col-overlay"></div>
    </div>
    <div class="about-col">
      <img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/realtor-scan%2B%281%29-1920w.jpg" alt="Interior designer"/>
    </div>
    <div class="about-hero-txt">
      <h1>A <em>"INTERIOR<br>DESIGNER FIRST"</em><br>APPROACH</h1>
    </div>
  </div>

  <section class="about-story">
    <div class="about-story-inner">
      <div class="about-story-img">
        <img src="https://lirp.cdn-website.com/db2038fe/dms3rep/multi/opt/scanningipad-1920w.jpg" alt="ScanCore scanning process"/>
      </div>
      <div class="about-story-text">
        <span class="sec-eye" style="text-align:left">About ScanCore.ai</span>
        <h2>TRANSFORMING INTERIOR DESIGN WITH PRECISION</h2>
        <p>ScanCore.ai was founded by Cortney Austin, a veteran interior designer with 25 years of experience who understood firsthand the frustrations of working with inaccurate measurements and incomplete documentation.</p>
        <p>After spending over two decades managing projects where costly delays, field rework, and spatial conflicts consistently stemmed from poor existing condition data, Cortney recognized that interior designers deserved better. She saw an industry struggling with tape measures, unreliable drawings, and scanning services that didn't understand what designers truly needed.</p>
        <p>So she created <strong>ScanCore.ai</strong> — a scanning company built by a designer, for designers. We combine professional-grade LiDAR technology with deep interior design expertise to deliver documentation that actually works the way designers work.</p>
        <p>Every deliverable — from CAD plans to Revit models to virtual tours — is created with a deep understanding of real-world design workflows, not just technical specifications.</p>
        <p>At ScanCore.ai, we don't just capture spaces. We provide the foundation of confidence that lets interior designers focus on what they do best: creating beautiful, functional environments. Because accurate documentation shouldn't be a luxury — it should be the standard.</p>
      </div>
    </div>
  </section>

  <section class="values-sec">
    <div class="sec-inner">
      <span class="sec-eye">Our Commitments</span>
      <h2 class="sec-h">WHAT DRIVES EVERYTHING WE DO</h2>
      <div class="values-grid">
        <div class="val-card"><div class="val-icon">🎯</div><h3>DESIGNER-FIRST THINKING</h3><p>Every deliverable format, every file type, every deadline — optimized for how interior designers actually work. We don't just capture data; we deliver it the way you need it.</p></div>
        <div class="val-card"><div class="val-icon">📏</div><h3>UNCOMPROMISING ACCURACY</h3><p>±2mm scan accuracy using professional-grade LiDAR equipment. We don't round, estimate, or guess. Every dimension is documented to the millimeter so you can design without second-guessing.</p></div>
        <div class="val-card"><div class="val-icon">⚡</div><h3>SPEED WITHOUT SACRIFICE</h3><p>Industry-leading turnaround times without cutting corners on quality. Standard delivery in 5 business days, expedited in 3. Your project timeline is our priority.</p></div>
      </div>
    </div>
  </section>

  <section class="dark-banner">
    <div class="dark-banner-inner">
      <span class="sec-eye" style="color:#666;font-size:.88rem">The ScanCore Promise</span>
      <h2 style="font-size:clamp(2rem,4vw,3.5rem);color:#fff;margin:16px 0 24px">REALITY CAPTURED,<br>DESIGN UNLEASHED</h2>
      <p>Accurate data capture tailored for interior designers to streamline project planning and execution. From initial site capture to final deliverables, we provide a complete end-to-end workflow that transforms raw LiDAR data into design-ready documentation.</p>
      <button class="btn-yel" onclick="go('contact')" style="margin-top:4px">Get In Touch →</button>
    </div>
  </section>
  <div id="about-cr"></div>
  <div id="about-footer"></div>
</div>

<!-- ════════════════════════════════════════
     CONTACT
════════════════════════════════════════ -->
<div id="p-contact" class="page">
  <section class="page-hero contact-hero-bg">
    <div class="pho"></div>
    <div class="phc"><h1>LET'S<br>CONNECT</h1></div>
  </section>

  <section class="contact-info-sec">
    <div class="cinfo-header">
      <span class="sec-eye">Your Partner in Precision Scanning for Interior Designers</span>
      <h2>GET IN TOUCH WITH SCANCORE.AI</h2>
    </div>
    <div class="cinfo-cards">
      <div class="cic"><div class="cic-i"><svg viewBox="0 0 24 24"><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg></div><h3>Call Us</h3><a href="tel:+18338652726">+1 (833) 865-<strong>SCAN</strong></a></div>
      <div class="cic"><div class="cic-i"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></div><h3>Email Us</h3><a href="mailto:info@scancore.ai">info@scancore.ai</a></div>
      <div class="cic"><div class="cic-i"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></div><h3>Instagram</h3><a href="https://www.instagram.com/scancore.ai" target="_blank">@scancore.ai</a></div>
      <div class="cic"><div class="cic-i"><svg viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div><h3>Location</h3><p>Nationwide — All 50 States</p></div>
    </div>
  </section>

  <section class="cform-sec">
    <div class="cform-inner">
      <h2>SEND US A MESSAGE</h2>
      <p class="cform-sub">Tell us about your project — we respond within 24 hours.</p>
      <form class="cf" id="cformEl" onsubmit="submitContact(event)">
        <div class="cf-row">
          <div class="fg"><label>First Name *</label><input type="text" placeholder="Jane" required/></div>
          <div class="fg"><label>Last Name *</label><input type="text" placeholder="Smith" required/></div>
        </div>
        <div class="cf-row">
          <div class="fg"><label>Email *</label><input type="email" placeholder="jane@yourstudio.com" required/></div>
          <div class="fg"><label>Phone</label><input type="tel" placeholder="+1 555-123-4567"/></div>
        </div>
        <div class="fg"><label>Message *</label><textarea placeholder="Tell us about your project — space type, square footage, deliverables needed…" required></textarea></div>
        <label class="chklbl"><input type="checkbox" required/><span>By checking this box, you agree to our Privacy Policy and consent to the use of your information.</span></label>
        <button type="submit" class="cf-submit">Send Message</button>
      </form>
      <div class="cf-success" id="cfSuccess">✓ Thank you for reaching out! We will get back to you shortly.</div>
      <div style="margin-top:32px;padding-top:32px;border-top:1px solid #eee;text-align:center">
        <p style="color:#888;font-size:.9rem;margin-bottom:14px">Ready to see pricing right now?</p>
        <button class="btn-yel-sm" onclick="window.location.href='/quote'">Get an Instant Quote →</button>
      </div>
    </div>
  </section>
  <div id="contact-footer"></div>
</div>

<!-- ════════════════════════════════════════
     QUOTE PAGE
════════════════════════════════════════ -->
<!-- FOOTER TEMPLATE (injected into each page) -->
<template id="footerTpl">
  <footer>
    <div class="footer-inner">
      <div class="f-brand">
        <div class="fl" onclick="go('home')">SCAN<span>CORE</span></div>
        <p>Reality Captured, Design Unleashed</p>
        <div class="f-social">
          <a href="https://www.instagram.com/scancore.ai" target="_blank"><svg viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg></a>
          <a href="mailto:info@scancore.ai"><svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg></a>
        </div>
      </div>
      <div class="f-col">
        <h5>Services</h5>
        <a onclick="go('wwd')">SketchUp 3D Models</a>
        <a onclick="go('wwd')">CAD Floor Plans</a>
        <a onclick="go('wwd')">Reflected Ceiling Plans</a>
        <a onclick="go('wwd')">Matterport Virtual Tours</a>
        <a onclick="go('wwd')">Revit BIM Models</a>
      </div>
      <div class="f-col">
        <h5>Company</h5>
        <a onclick="go('home')">Home</a>
        <a onclick="go('wwd')">What We Do</a>
        <a onclick="go('about')">About</a>
        <a onclick="go('contact')">Contact</a>
        <a onclick="window.location.href='/quote'">Get a Quote</a>
      </div>
      <div class="f-col">
        <h5>Contact</h5>
        <a href="tel:+18338652726">1.833.865.SCAN</a>
        <a href="mailto:info@scancore.ai">info@scancore.ai</a>
        <a href="https://www.instagram.com/scancore.ai" target="_blank">@scancore.ai</a>
        <p style="margin-top:8px;font-size:.78rem;color:#444">Serving interior designers<br>nationwide — all 50 states</p>
      </div>
    </div>
    <div class="f-bottom">
      <div class="f-copy">© 2025 ScanCore.ai — All rights reserved. Serving interior designers across all 50 states.</div>
      <div class="f-copy">Residential 3D Scanning Specialists</div>
    </div>
  </footer>
</template>

<script>
// ── FOOTER INJECTION ──
function injectFooters() {
  const tpl = document.getElementById('footerTpl').innerHTML;
  ['home-footer','wwd-footer','about-footer','contact-footer','quote-footer',
   'home-cr-dummy','wwd-cr','about-cr'].forEach(id => {
    const el = document.getElementById(id);
    if (el && id.includes('footer')) el.innerHTML = tpl;
  });
}

// ── PAGE SWITCHER ──
const pages = ['home','wwd','about','contact'];
// ── URL ↔ PAGE MAP ────────────────────────────────────────────────────────
const PAGE_URLS = {
  home:    '/',
  wwd:     '/what-we-do',
  about:   '/about',
  contact: '/contact',
};
const URL_PAGES = Object.fromEntries(Object.entries(PAGE_URLS).map(([k,v]) => [v, k]));

function go(id, pushHistory = true) {
  // External pages get hard navigation
  if (id === 'quote') { window.location.href = '/quote'; return; }
  if (id === 'admin') { window.location.href = '/admin'; return; }

  // Update URL without reload
  const targetUrl = PAGE_URLS[id] || '/';
  if (pushHistory && window.location.pathname !== targetUrl) {
    window.history.pushState({ page: id }, '', targetUrl);
  }

  // Show correct page, hide all others
  pages.forEach(p => {
    document.getElementById('p-'+p).classList.toggle('on', p===id);
    const nl = document.getElementById('nl-'+p);
    if (nl) nl.classList.toggle('on', p===id);
  });

  // Update nav active state
  document.querySelectorAll('.nav-link[id^="nl-"]').forEach(el => {
    el.classList.toggle('on', el.id === 'nl-'+id);
  });

  document.getElementById('navMenu').classList.remove('open');
  window.scrollTo(0, 0);

  // Update document title
  const titles = {
    home:    'ScanCore.ai — As-Built Documentation for Interior Designers',
    wwd:     'What We Do — ScanCore.ai',
    about:   'About ScanCore — Built by Designers, For Designers',
    contact: 'Contact ScanCore.ai — Get In Touch',
  };
  document.title = titles[id] || 'ScanCore.ai';
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (e) => {
  const id = (e.state && e.state.page) || URL_PAGES[window.location.pathname] || 'home';
  go(id, false);
});
document.getElementById('ham').addEventListener('click', () =>
  document.getElementById('navMenu').classList.toggle('open'));
window.addEventListener('scroll', () => {
  document.getElementById('nav').classList.toggle('scrolled', window.scrollY > 10);
});

// ── HERO SLIDER ──
const hslides = document.querySelectorAll('.hero-slide');
const hdots = document.querySelectorAll('.hd');
let hcur = 0, htimer;
function hGoTo(i) {
  hslides[hcur].classList.remove('on'); hdots[hcur].classList.remove('on');
  hcur = i;
  hslides[hcur].classList.add('on'); hdots[hcur].classList.add('on');
}
if (hslides.length > 1) {
  htimer = setInterval(() => hGoTo((hcur+1) % hslides.length), 7000);
  hdots.forEach(d => d.addEventListener('click', () => {
    clearInterval(htimer);
    hGoTo(+d.dataset.i);
    htimer = setInterval(() => hGoTo((hcur+1) % hslides.length), 7000);
  }));
}

// ── CONTACT FORM ──
function submitContact(e) {
  e.preventDefault();
  document.getElementById('cformEl').style.display = 'none';
  document.getElementById('cfSuccess').style.display = 'block';
}

// ══════════════════════════════════════════
// QUOTE ENGINE
// ══════════════════════════════════════════
const SVCS = [
  { id:'matterport', name:'Matterport 3D Virtual Tour', desc:'Interactive 3D walkthrough with 6-month hosting included', badge:'popular', badgeTxt:'⭐ Most Popular',
    calc:sq => sq<=2000?200:200+Math.ceil((sq-2000)/1000)*50,
    lbl:sq => sq<=2000?'$200 (up to 2,000 sq ft)':'$200 + $50/1k over 2k' },
  { id:'autocad', name:'AutoCAD DWG 2D Floor Plan', desc:'Plumbing, appliances, lighting, windows/doors & ceiling heights',
    calc:sq => sq<=1000?420:Math.round(sq*0.42),
    lbl:sq => sq<=1000?'$420 (up to 1,000 sq ft)':'$0.42/sq ft' },
  { id:'sketchup', name:'SketchUp SKP 3D Model', desc:'Full 3D building model in SketchUp format for design workflows',
    calc:sq => sq<=1000?420:Math.round(sq*0.42),
    lbl:sq => sq<=1000?'$420 (up to 1,000 sq ft)':'$0.42/sq ft' },
  { id:'design_pkg', name:'Design Package Bundle', desc:'AutoCAD + SketchUp 3D + Matterport Tour — everything in one package', badge:'bundle', badgeTxt:'🏆 Includes Matterport — FREE',
    calc:sq => sq<=1000?700:Math.round(sq*0.70),
    lbl:sq => sq<=1000?'$700 (up to 1,000 sq ft)':'$0.70/sq ft' },
  { id:'rcp', name:'RCP — Reflected Ceiling Plan', desc:'Precise fixture locations, ceiling heights, structural elements', 
    calc:sq => sq<=1000?200:Math.round(sq*0.20),
    lbl:sq => sq<=1000?'$200 (up to 1,000 sq ft)':'$0.20/sq ft' },
  { id:'expedited', name:'Expedited Delivery', desc:'Rush turnaround — prioritized ahead of standard queue', badge:'rush', badgeTxt:'⚡ +25% of total', isExp:true,
    calc:()=>0, lbl:()=>'+25% of total' }
];
const qState = { sel: new Set(), sqft: 0 };
let bundleDismissed = false;

function qInit() {
  const g = document.getElementById('svcGrid');
  if (!g) return;
  g.innerHTML = SVCS.map(s => \`
    <div class="qsvc" id="qs_\${s.id}" onclick="qToggle('\${s.id}')">
      <div class="qsvc-check" id="qc_\${s.id}"></div>
      <div class="qsvc-name">\${s.name}</div>
      <div class="qsvc-desc">\${s.desc}</div>
      <div class="qsvc-price" id="qp_\${s.id}">\${s.lbl(1000)}</div>
      \${s.badge ? \`<span class="q-badge \${s.badge}">\${s.badgeTxt}</span>\` : ''}
    </div>\`).join('');
  qRecalc();
}

function qToggle(id) {
  if (id==='design_pkg') {
    if (qState.sel.has('design_pkg')) {
      qState.sel.delete('design_pkg');
      ['matterport','autocad','sketchup'].forEach(i => document.getElementById('qs_'+i)?.classList.remove('disabled'));
    } else {
      qState.sel.add('design_pkg');
      ['matterport','autocad','sketchup'].forEach(i => { qState.sel.delete(i); document.getElementById('qs_'+i)?.classList.add('disabled'); });
    }
  } else if (['autocad','sketchup','matterport'].includes(id)) {
    if (qState.sel.has(id)) { qState.sel.delete(id); bundleDismissed=false; }
    else {
      if (qState.sel.has('design_pkg')) {
        qState.sel.delete('design_pkg');
        ['matterport','autocad','sketchup'].forEach(i => document.getElementById('qs_'+i)?.classList.remove('disabled'));
      }
      qState.sel.add(id);
    }
  } else {
    qState.sel.has(id) ? qState.sel.delete(id) : qState.sel.add(id);
  }
  qCheckBundle();
  qRecalc();
}

function qCheckBundle() {
  const has = id => qState.sel.has(id);
  if (has('matterport')&&has('autocad')&&has('sketchup')&&!has('design_pkg')&&!bundleDismissed) {
    qState.sel.add('design_pkg'); qState.sel.delete('matterport'); qState.sel.delete('autocad'); qState.sel.delete('sketchup');
    ['matterport','autocad','sketchup'].forEach(i => document.getElementById('qs_'+i)?.classList.add('disabled'));
    const sq = qState.sqft||1000;
    const sep = (sq<=2000?200:200+Math.ceil((sq-2000)/1000)*50)+(sq<=1000?420:Math.round(sq*.42))*2;
    const pkg = sq<=1000?700:Math.round(sq*.70);
    document.getElementById('bundleSavings').textContent = \`🎉 Bundle auto-applied — saving $\${(sep-pkg).toLocaleString()} vs buying separately!\`;
    document.getElementById('bundleToast').classList.add('show');
  } else if (has('design_pkg')) {
    document.getElementById('bundleToast').classList.add('show');
  } else {
    document.getElementById('bundleToast').classList.remove('show');
  }
}

function dismissBundle() {
  bundleDismissed=true;
  qState.sel.delete('design_pkg');
  ['matterport','autocad','sketchup'].forEach(i => { qState.sel.add(i); document.getElementById('qs_'+i)?.classList.remove('disabled'); });
  document.getElementById('bundleToast').classList.remove('show');
  qRecalc();
}

function fmt(n) { return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n); }

function qRecalc() {
  const raw = parseInt(document.getElementById('qSqft')?.value||'0')||0;
  const hint = document.getElementById('sqftHint');
  if (raw>0&&raw<1000) { hint.style.display='block'; qState.sqft=0; } else { hint.style.display='none'; qState.sqft=Math.max(0,raw); }
  const sq = qState.sqft;

  SVCS.forEach(s => {
    const card = document.getElementById('qs_'+s.id);
    const chk = document.getElementById('qc_'+s.id);
    const pr = document.getElementById('qp_'+s.id);
    if (!card) return;
    const isSel = qState.sel.has(s.id);
    card.classList.toggle('sel', isSel);
    chk.textContent = isSel ? '✓' : '';
    if (s.isExp) { pr.textContent = sq>0&&qState.sel.size>0 ? \`+\${fmt(Math.round(calcSub(sq)*.25))} (25% of subtotal)\` : '+25% of total'; }
    else pr.textContent = sq>0 ? fmt(s.calc(sq))+' for '+sq.toLocaleString()+' sq ft' : s.lbl(1000);
  });

  const sub = calcSub(sq);
  const isExp = qState.sel.has('expedited');
  const total = isExp ? Math.round(sub*1.25) : sub;
  const has = qState.sel.size>0 && sq>0;

  const lines = document.getElementById('qLines');
  const empty = document.getElementById('qEmpty');
  const tot = document.getElementById('qTotal');
  const totVal = document.getElementById('qTotalVal');
  empty.style.display = has?'none':'block';
  lines.style.display = has?'block':'none';
  tot.style.display = has?'block':'none';
  if (has) {
    let html='';
    qState.sel.forEach(id => {
      if (id==='expedited') return;
      const s = SVCS.find(s=>s.id===id);
      if (!s||!sq) return;
      html += \`<div class="line-item"><span class="li-lbl">\${s.name}</span><span class="li-val">\${fmt(s.calc(sq))}</span></div>\`;
    });
    if (isExp&&sub>0) html += \`<div class="line-item"><span class="li-lbl">⚡ Expedited (+25%)</span><span class="li-val">+\${fmt(Math.round(sub*.25))}</span></div>\`;
    lines.innerHTML = html;
    totVal.textContent = fmt(total);
  }

  // delivery
  const de = document.getElementById('qDelivEmpty');
  const dt = document.getElementById('qDelivTable');
  if (!sq) { de.style.display='block'; dt.style.display='none'; }
  else {
    de.style.display='none'; dt.style.display='block';
    const std = sq<4000?'5 business days':sq<6000?'7 business days':'8+ business days';
    const rush = sq<=1000?'3 business days':sq<=2000?'4 business days':sq<=4000?'5 business days':'6+ business days';
    const onsite = sq<2000?'1–1.5 hours':sq<=4000?'1.5–2 hours':sq<=6000?'2–3 hours':'3–4+ hours';
    dt.innerHTML = \`
      <div class="delivery-row \${!isExp?'hi':''}"><span>Standard delivery</span><span>\${std}</span></div>
      <div class="delivery-row \${isExp?'hi':''}"><span>⚡ Rush delivery</span><span>\${rush}</span></div>
      <div class="delivery-row"><span>Time on site</span><span>\${onsite}</span></div>\`;
  }
}

function calcSub(sq) {
  let sub=0;
  qState.sel.forEach(id => {
    if (id==='expedited') return;
    const s=SVCS.find(s=>s.id===id);
    if (s&&sq) sub+=s.calc(sq);
  });
  return sub;
}

function submitQuote() {
  let ok=true;
  const sq=parseInt(document.getElementById('qSqft')?.value||'0')||0;
  const addr=(document.getElementById('qAddr')?.value||'').trim();
  const name=(document.getElementById('qName')?.value||'').trim();
  const email=(document.getElementById('qEmail')?.value||'').trim();

  document.getElementById('svcErr').classList.toggle('show', qState.sel.size===0);
  if (qState.sel.size===0) ok=false;
  document.getElementById('addrErr').classList.toggle('show', addr.length<5);
  if (addr.length<5) ok=false;
  document.getElementById('nameErr').classList.toggle('show', name.length<2);
  if (name.length<2) ok=false;
  const eok=/^[^@]+@[^@]+\\.[^@]+$/.test(email);
  document.getElementById('emailErr').classList.toggle('show', !eok);
  if (!eok) ok=false;

  if (!ok) return;

  document.querySelector('.quote-body').style.display='none';
  document.querySelector('.sqft-bar').style.display='none';
  document.getElementById('qSuccess').style.display='block';
  const ref='QT-'+Date.now().toString().slice(-6);
  document.getElementById('qRef').textContent='Quote Reference: '+ref;
  window.scrollTo(0,0);
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', () => {
  injectFooters();

  // Route to the correct page based on current URL (handles direct links + refresh)
  const currentPath = window.location.pathname;
  const pageId = URL_PAGES[currentPath] || 'home';

  // Set initial history state so popstate works correctly
  window.history.replaceState({ page: pageId }, '', currentPath);

  // Show the correct page without pushing history again
  go(pageId, false);
});
</script>
</body>
</html>
`;
