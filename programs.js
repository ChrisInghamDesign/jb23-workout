/* ============================================================
   DYNAMIC HOCKEY PROGRAMS — follow-along video programs from
   dynamichockeytraining.com (Chris's membership).
   The program data is encrypted (dh.enc.json) so the paid content
   isn't readable on the public site; it unlocks with Chris's
   passphrase, remembered on each device after the first time.
   ============================================================ */
(function(){
const DH_KEY = "jb23-dh-pass", DH_DONE = "jb23-dh-done-", DH_FIT = "jb23-dh-fill";
let DH = null;                       // decrypted data
const ls = { get:k=>{try{return localStorage.getItem(k)}catch(e){return null}}, set:(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}}, del:k=>{try{localStorage.removeItem(k)}catch(e){}} };
const dhDone = id => ls.get(DH_DONE + id) === "1";
const b64 = s => Uint8Array.from(atob(s), c => c.charCodeAt(0));
const thumbURL = (th, w = 640) => `https://embed-ssl.wistia.com/deliveries/${th}.jpg?image_crop_resized=${w}x${Math.round(w*9/16)}`;
const mins = s => Math.round(s / 60);
const clock = s => { s = Math.max(0, Math.round(s)); return Math.floor(s/60) + ":" + String(s%60).padStart(2,"0"); };

async function decrypt(pass){
  const enc = await fetch("dh.enc.json", { cache: "no-cache" }).then(r => r.json());
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(pass), "PBKDF2", false, ["deriveKey"]);
  const key = await crypto.subtle.deriveKey({ name:"PBKDF2", salt:b64(enc.salt), iterations:enc.iter, hash:"SHA-256" }, base, { name:"AES-GCM", length:256 }, false, ["decrypt"]);
  const plain = await crypto.subtle.decrypt({ name:"AES-GCM", iv:b64(enc.iv) }, key, b64(enc.ct));
  return JSON.parse(new TextDecoder().decode(plain));
}
async function unlock(pass){
  try { DH = await decrypt(pass); ls.set(DH_KEY, pass); return true; }
  catch(e){ return false; }
}

/* ---------- styles ---------- */
const css = `
.dh-lock{background:#F4F4F6;border-radius:16px;padding:16px;margin-top:14px}
.dh-lock p{margin:0 0 10px;color:#2C2E31}
.dh-lock form{display:flex;gap:10px}
.dh-lock input{flex:1;min-width:0;font:inherit;font-size:1.05rem;padding:12px 14px;border:1.5px solid #D3D8DE;border-radius:12px;background:#fff;color:#1C1D1F}
.dh-lock button{background:var(--gold);border:0;border-radius:12px;padding:0 18px;font-weight:800}
.dh-lock .err{color:#C0392B;font-weight:700;margin:8px 0 0}
.dh-tile{width:32%;max-width:170px;aspect-ratio:4/3;flex:none;background:#0F2236 center/cover no-repeat;position:relative}
.dh-tile span{position:absolute;left:8px;bottom:8px;background:rgba(0,0,0,.65);color:#fff;font-size:.75rem;font-weight:800;padding:3px 8px;border-radius:999px}
.wcard.soon{opacity:.6;cursor:default}
.wcard[data-dh] .meta span:not(.donetag){display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.dh-sec{font-size:1.15rem;font-weight:800;margin:26px 0 2px}
.dh-about{color:#3A3C40;line-height:1.5;margin:0 0 6px;white-space:pre-line}
.dh-hero{position:relative;aspect-ratio:16/9;background:#111 center/cover no-repeat;border-radius:22px 22px 0 0;overflow:hidden}
.dh-hero button{position:absolute;inset:0;margin:auto;width:84px;height:84px;border-radius:50%;border:0;background:rgba(0,0,0,.55);display:grid;place-items:center}
.dh-hero svg{width:38px;height:38px;fill:#fff;margin-left:5px}
.dh-routine{list-style:none;padding:0;margin:0;counter-reset:r}
.dh-routine li{counter-increment:r;display:flex;gap:14px;align-items:center;padding:11px 0;border-bottom:1.5px solid #ECEDEF;font-size:1.1rem}
.dh-routine li::before{content:counter(r);width:34px;height:34px;flex:none;border-radius:50%;background:#F2F2F4;display:grid;place-items:center;font-weight:800;font-size:.95rem}
.dh-chips{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 22px}
.dh-chips span{background:#F2F2F4;border-radius:999px;padding:6px 12px;font-size:.98rem}
.dh-src{display:inline-block;margin-top:18px;color:#2E7CF6;font-weight:700;text-decoration:none}
/* TV player */
.dh-player{position:fixed;inset:0;z-index:40;display:flex;background:#0B0C0E;color:#F3F4F6;font-family:"Mulish",var(--body)}
.dh-stage{position:relative;flex:1;min-width:0;overflow:hidden;background:#000}
.dh-stage .dh-v{position:absolute;top:0;bottom:0;left:50%;transform:translateX(-50%);height:100%;aspect-ratio:16/9}
.dh-player.fit .dh-stage .dh-v{top:50%;bottom:auto;height:auto;width:100%;transform:translate(-50%,-50%)}
.dh-stage .wistia_embed{width:100%!important;height:100%!important}
.dh-tap{position:absolute;inset:0;z-index:2}
.dh-ctl{position:absolute;left:0;right:0;bottom:0;z-index:3;display:flex;justify-content:center;gap:2vh;padding:3vh;background:linear-gradient(transparent,rgba(0,0,0,.75));transition:opacity .25s}
.dh-ctl.hide{opacity:0;pointer-events:none}
.dh-ctl button{border:0;border-radius:999px;background:rgba(255,255,255,.16);color:#fff;font:inherit;font-weight:800;font-size:2.4vh;padding:1.6vh 3vh;display:flex;align-items:center;gap:1vh}
.dh-ctl button.primary{background:var(--gold);color:#15171A}
.dh-ctl svg{width:3vh;height:3vh;fill:currentColor}
.dh-big{position:absolute;inset:0;margin:auto;z-index:4;width:16vh;height:16vh;border-radius:50%;border:0;background:var(--gold);display:grid;place-items:center}
.dh-big svg{width:7vh;height:7vh;fill:#15171A;margin-left:1vh}
.dh-panel{width:26vw;flex:none;background:#15171A;padding:4vh 3vh;display:flex;flex-direction:column;min-height:0}
.dh-panel .top{display:flex;justify-content:space-between;align-items:center;color:#9EA4AC;font-weight:700;font-size:2.1vh;gap:1vh}
.dh-panel .top button{border:0;background:rgba(255,255,255,.1);color:#F3F4F6;border-radius:999px;font:inherit;font-weight:800;font-size:1.9vh;padding:.8vh 1.6vh}
.dh-panel h2{font-family:var(--cond);font-weight:800;font-size:5vh;line-height:1.02;margin:2vh 0 .6vh}
.dh-panel .prog{color:#9EA4AC;font-size:2.1vh;margin:0 0 2vh}
.dh-panel .time{font-family:var(--cond);font-weight:800;font-size:9vh;line-height:1;color:var(--gold)}
.dh-panel .time small{font-family:"Mulish",var(--body);font-size:2vh;color:#9EA4AC;font-weight:700;margin-left:1vh}
.dh-bar{height:1.2vh;border-radius:99px;background:#2E3238;overflow:hidden;margin:2vh 0 3vh}
.dh-bar i{display:block;height:100%;width:0;background:var(--gold)}
.dh-panel ol{margin:0;padding:0 0 0 3.4vh;overflow:auto;min-height:0;font-size:2.3vh;line-height:1.35}
.dh-panel ol li{padding:.55vh 0;color:#D5D8DC}
.dh-panel .eq{color:#9EA4AC;font-size:1.9vh;margin:0 0 1.5vh}
/* Phone held upright: video across the top, routine below, controls docked at the bottom */
@media (max-aspect-ratio: 4/5){
  .dh-player{flex-direction:column}
  .dh-stage{flex:none;width:100%;aspect-ratio:16/9;padding-top:env(safe-area-inset-top,0px);box-sizing:content-box}
  .dh-stage .dh-v,.dh-player.fit .dh-stage .dh-v{top:env(safe-area-inset-top,0px);bottom:auto;left:0;width:100%;height:auto;aspect-ratio:16/9;transform:none}
  .dh-tap{top:env(safe-area-inset-top,0px)}
  .dh-big{width:76px;height:76px;top:env(safe-area-inset-top,0px)}.dh-big svg{width:34px;height:34px;margin-left:5px}
  .dh-ctl,.dh-ctl.hide{position:fixed;top:auto;opacity:1;pointer-events:auto;background:#15171A;border-top:1px solid #2E3238;gap:10px;
    padding:12px 12px calc(env(safe-area-inset-bottom,0px) + 14px)}
  .dh-ctl button{font-size:16px;padding:0 18px;height:56px;justify-content:center}
  .dh-ctl button.primary{min-width:130px}
  .dh-ctl svg{width:20px;height:20px}
  #dhp-fit{display:none}
  .dh-panel{width:auto;flex:1;padding:16px 20px calc(env(safe-area-inset-bottom,0px) + 100px)}
  .dh-panel .top{font-size:14px}.dh-panel .top button{font-size:14px;padding:8px 14px}
  .dh-panel h2{font-size:30px;margin:12px 0 4px}
  .dh-panel .prog{font-size:14px;margin-bottom:10px}
  .dh-panel .time{font-size:44px}.dh-panel .time small{font-size:14px}
  .dh-bar{height:8px;margin:10px 0 14px}
  .dh-panel .eq{font-size:14px;margin-bottom:8px}
  .dh-panel ol{font-size:17px;padding-left:24px}
  .dh-panel ol li{padding:4px 0}
}
`;
document.head.insertAdjacentHTML("beforeend", `<style>${css}</style>`);

/* ---------- views ---------- */
const app = document.getElementById("home");
app.insertAdjacentHTML("beforeend", `
  <section class="view" id="v-dh" hidden>
    <div class="appbar"><button class="icon-btn" id="dh-back" aria-label="Back"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></button><h1 id="dh-bar"></h1><span style="width:44px"></span></div>
    <div id="dh-body"></div>
    <button class="fab" id="dh-start" hidden>Start Now</button>
  </section>`);
document.body.insertAdjacentHTML("beforeend", `<div class="dh-player" id="dh-player" hidden></div>`);

const progOf = slug => DH && DH.programs.find(p => p.slug === slug);
const sessionsOf = p => p.sections.flatMap(s => s.sessions.map(x => Object.assign({ section: s.title }, x)));
const findSession = (p, id) => sessionsOf(p).find(x => x.id === id);

function lockHTML(sfx = ""){
  return `<div class="dh-lock"><p>Enter your passphrase to show the Dynamic Hockey programs on this device.</p>
    <form id="dh-form${sfx}"><input id="dh-pass${sfx}" type="password" autocomplete="current-password" placeholder="Passphrase" aria-label="Passphrase"><button>Unlock</button></form>
    <p class="err" id="dh-err${sfx}" hidden>That passphrase didn't work.</p></div>`;
}
function wireLock(after, sfx = ""){
  const f = document.getElementById("dh-form" + sfx); if (!f) return;
  f.onsubmit = async e => {
    e.preventDefault();
    const ok = await unlock(document.getElementById("dh-pass" + sfx).value.trim());
    if (ok) after(); else document.getElementById("dh-err" + sfx).hidden = false;
  };
}
function programCards(){
  if (!DH) return `<h3 class="section-h">Dynamic Hockey</h3>` + lockHTML();
  return `<h3 class="section-h">Dynamic Hockey</h3>` + DH.programs.map(p => {
    const ss = sessionsOf(p), done = ss.filter(s => dhDone(s.id)).length, first = ss[0];
    return `<button class="wcard${ss.length ? "" : " soon"}" data-dh="${p.slug}"${ss.length ? "" : " disabled"}>
      <div class="dh-tile" style="${first ? `background-image:url('${thumbURL(first.thumb, 480)}')` : ""}">${ss.length ? `<span>${ss.length} videos</span>` : `<span>Coming soon</span>`}</div>
      <div class="meta"><b>${esc(p.title.replace(/\s*-\s*Coming Soon$/i, ""))}</b><span>${esc(p.blurb || "")}</span>${done ? `<span class="donetag">${done} of ${ss.length} completed</span>` : ""}</div></button>`;
  }).join("");
}
function addProgramsToHome(){
  const host = document.getElementById("l-cards"); if (!host) return;
  host.insertAdjacentHTML("beforeend", `<div id="dh-home">${programCards()}</div>`);
  host.querySelectorAll("[data-dh]").forEach(c => c.onclick = () => go("#dh/" + c.dataset.dh));
  wireLock(() => { document.getElementById("dh-home").remove(); addProgramsToHome(); });
}
// Hook into the main list so the programs show under the weeks
const baseRenderList = renderList;
renderList = function(){ baseRenderList(); addProgramsToHome(); };

function shortTitle(p, sec, t){
  t = t.replace(/\s+/g, " ").trim();
  if (sec && t.startsWith(sec)) t = t.slice(sec.length).replace(/^[\s|\-–]+/, "");
  else if (t.startsWith(p.title + " |")) t = t.slice(p.title.length + 2).trim();
  return t;
}
function renderProgram(p){
  document.getElementById("dh-bar").textContent = "Dynamic Hockey";
  document.getElementById("dh-start").hidden = true;
  const about = p.info.map(i => `<h3 class="dh-sec">${esc(i.title)}</h3><p class="dh-about" data-more="${esc(i.text)}"></p>`).join("");
  const secs = p.sections.filter(s => s.sessions.length).map(s => `<h3 class="dh-sec">${esc(s.title)}</h3>` + s.sessions.map(x =>
    `<button class="wcard" data-s="${x.id}"><div class="thumb"><img src="${thumbURL(x.thumb, 480)}" alt="" loading="lazy"></div>
      <div class="meta"><b>${esc(shortTitle(p, s.title, x.title))}</b><span>${mins(x.seconds)} min&nbsp;&nbsp;${x.routine.length} moves</span>${dhDone(x.id) ? `<span class="donetag">Completed</span>` : ""}</div></button>`).join("")).join("");
  document.getElementById("dh-body").innerHTML = `<div class="sheet-card"><h2 class="prog-name">${esc(p.title)}</h2>
    <span class="tag">Dynamic Hockey</span><p class="phase">${esc(p.blurb || "")}</p>${about}${secs}
    <a class="dh-src" href="${p.url}" target="_blank" rel="noopener">Open on Dynamic Hockey</a></div>`;
  document.querySelectorAll("#dh-body .dh-about").forEach(el => moreText(el, el.dataset.more, 160));
  document.querySelectorAll("#dh-body [data-s]").forEach(c => c.onclick = () => go(`#dh/${p.slug}/${c.dataset.s}`));
  document.getElementById("dh-back").onclick = () => go("#library");
}
function renderSession(p, x){
  document.getElementById("dh-bar").textContent = "";
  const done = dhDone(x.id);
  document.getElementById("dh-body").innerHTML = `
    <div class="dh-hero" style="background-image:url('${thumbURL(x.thumb, 1280)}')"><button id="dh-hero-play" aria-label="Start follow-along video"><svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg></button></div>
    <div class="sheet-card" style="border-radius:0">
      <div class="wtitle"><button class="check ${done ? "on" : ""}" id="dh-check" aria-label="Mark complete"><svg viewBox="0 0 24 24"><path d="M5 12l5 5 9-10"/></svg></button>
        <h2>${esc(x.title.replace(/\s+/g, " "))}</h2></div>
      <ul class="facts2">
        <li><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>${clock(x.seconds)} follow-along video</li>
        <li><svg viewBox="0 0 24 24"><path d="M6 7v10M3 9v6M18 7v10M21 9v6M6 12h12"/></svg>${x.routine.length} moves</li>
      </ul>
      ${x.equipment.length ? `<h3 class="h3">Equipment:</h3><div class="dh-chips">${x.equipment.map(q => `<span>${esc(q)}</span>`).join("")}</div>` : ""}
      <h3 class="h3">Routine</h3>
      <ol class="dh-routine">${x.routine.map(r => `<li>${esc(r)}</li>`).join("")}</ol>
      <a class="dh-src" href="${x.url}" target="_blank" rel="noopener">Open on Dynamic Hockey</a>
    </div>`;
  document.getElementById("dh-check").onclick = e => { const on = !dhDone(x.id); ls.set(DH_DONE + x.id, on ? "1" : "0"); e.currentTarget.classList.toggle("on", on); if (window.jb23OnDh) window.jb23OnDh(x.id, on); };
  const start = () => { fromSession = true; go(`#dh/${p.slug}/${x.id}/play`); };
  document.getElementById("dh-hero-play").onclick = start;
  const fab = document.getElementById("dh-start"); fab.hidden = false; fab.onclick = start;
  document.getElementById("dh-back").onclick = () => go((window.jb23Back && window.jb23Back("dh", x.id)) || "#dh/" + p.slug);
}

/* ---------- TV player (Wistia) ---------- */
let fromSession = false, video = null, hideT = null, tick = null;
function loadWistia(){
  if (window._wq && document.querySelector("script[src*='wistia.com/assets/external/E-v1.js']")) return;
  window._wq = window._wq || [];
  const s = document.createElement("script"); s.src = "https://fast.wistia.com/assets/external/E-v1.js"; s.async = true; document.head.appendChild(s);
}
function closePlayer(){
  clearInterval(tick); clearTimeout(hideT);
  if (video) { try { video.pause(); video.remove(); } catch(e){} video = null; }
  const pl = document.getElementById("dh-player"); pl.hidden = true; pl.innerHTML = "";
  if (document.fullscreenElement) document.exitFullscreen().catch(()=>{});
}
function openPlayer(p, x){
  loadWistia();
  const pl = document.getElementById("dh-player");
  const fill = ls.get(DH_FIT) !== "0";
  pl.className = "dh-player" + (fill ? "" : " fit");
  pl.hidden = false;
  const IP = '<svg viewBox="0 0 24 24"><path d="M6.5 5h4v14h-4zM13.5 5h4v14h-4z"/></svg>', IPL = '<svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg>';
  pl.innerHTML = `
    <div class="dh-stage">
      <div class="dh-v"><div class="wistia_embed wistia_async_${x.wistia} videoFoam=false playerColor=FFC629 controlsVisibleOnLoad=false playbar=false fullscreenButton=false settingsControl=false volumeControl=false smallPlayButton=false playButton=false" style="width:100%;height:100%"></div></div>
      <div class="dh-tap" id="dhp-tap"></div>
      <button class="dh-big" id="dhp-big" aria-label="Play"><svg viewBox="0 0 24 24"><path d="M7 5v14l12-7z"/></svg></button>
      <div class="dh-ctl hide" id="dhp-ctl">
        <button id="dhp-back15" aria-label="Back 15 seconds">− 15s</button>
        <button class="primary" id="dhp-pp">${IP}<span>Pause</span></button>
        <button id="dhp-fwd15" aria-label="Forward 15 seconds">+ 15s</button>
        <button id="dhp-fit">${fill ? "Fit video" : "Fill screen"}</button>
      </div>
    </div>
    <div class="dh-panel">
      <div class="top"><span>${esc(p.title)}</span><button id="dhp-end">End</button></div>
      <h2>${esc(shortTitle(p, x.section, x.title))}</h2>
      <p class="prog">${esc(x.section)}</p>
      <div class="time" id="dhp-left">${clock(x.seconds)}<small>left</small></div>
      <div class="dh-bar"><i id="dhp-bar"></i></div>
      ${x.equipment.length ? `<p class="eq">${x.equipment.map(esc).join(" · ")}</p>` : ""}
      <ol>${x.routine.map(r => `<li>${esc(r)}</li>`).join("")}</ol>
    </div>`;
  const $p = id => document.getElementById(id);
  const showCtl = () => { $p("dhp-ctl").classList.remove("hide"); clearTimeout(hideT); hideT = setTimeout(() => { if (video && video.state() === "playing") $p("dhp-ctl").classList.add("hide"); }, 3500); };
  const sync = () => {
    if (!video) return;
    const playing = video.state() === "playing";
    $p("dhp-pp").innerHTML = (playing ? IP : IPL) + `<span>${playing ? "Pause" : "Play"}</span>`;
    $p("dhp-big").hidden = playing || video.time() > 0.5;
    const d = video.duration() || x.seconds, t = video.time();
    $p("dhp-left").innerHTML = `${clock(d - t)}<small>left</small>`;
    $p("dhp-bar").style.width = Math.min(100, t / d * 100) + "%";
  };
  const toggle = () => { if (!video) return; video.state() === "playing" ? video.pause() : video.play(); };
  $p("dhp-big").onclick = () => { if (video) video.play(); else pending = true; showCtl(); };
  $p("dhp-tap").onclick = () => { if (!$p("dhp-ctl").classList.contains("hide")) toggle(); showCtl(); };
  $p("dhp-pp").onclick = () => { toggle(); showCtl(); };
  $p("dhp-back15").onclick = () => { if (video) video.time(Math.max(0, video.time() - 15)); showCtl(); };
  $p("dhp-fwd15").onclick = () => { if (video) video.time(Math.min(video.duration() - 1, video.time() + 15)); showCtl(); };
  $p("dhp-fit").onclick = () => { const f = !pl.classList.toggle("fit"); ls.set(DH_FIT, f ? "1" : "0"); $p("dhp-fit").textContent = f ? "Fit video" : "Fill screen"; showCtl(); };
  $p("dhp-end").onclick = () => { if (fromSession) { fromSession = false; history.back(); } else location.replace(`#dh/${p.slug}/${x.id}`); };
  let pending = true;          // try to start right away (Start Now was a tap)
  window._wq.push({ id: x.wistia, onReady: v => {
    video = v;
    v.bind("play", sync); v.bind("pause", sync);
    v.bind("end", () => { ls.set(DH_DONE + x.id, "1"); if (window.jb23OnDh) window.jb23OnDh(x.id, true); sync(); $p("dhp-ctl").classList.remove("hide"); });
    if (pending) v.play();
    tick = setInterval(sync, 500); sync();
  }});
  try { if (document.documentElement.requestFullscreen && !document.fullscreenElement) document.documentElement.requestFullscreen().catch(()=>{}); } catch(e){}
}

/* ---------- shared with the Today screen ---------- */
window.jb23DH = {
  get data(){ return DH; },
  thumbURL, mins, shortTitle,
  lockHTML: sfx => lockHTML("-" + sfx),
  wireLock: after => wireLock(after, "-dash")
};

/* ---------- routing (#dh/<program>[/<session>[/play]]) ---------- */
function dhRoute(){
  const m = location.hash.match(/^#dh\/([\w-]+)(?:\/(\d+))?(\/play)?$/);
  const v = document.getElementById("v-dh");
  if (!m) { v.hidden = true; document.getElementById("dh-start").hidden = true; closePlayer(); return; }
  ["v-dash","v-list","v-week","v-workout","v-exercise"].forEach(id => document.getElementById(id).hidden = true);
  v.hidden = false;
  if (!DH) {
    document.getElementById("dh-bar").textContent = "Dynamic Hockey";
    document.getElementById("dh-body").innerHTML = `<div class="sheet-card">${lockHTML()}</div>`;
    document.getElementById("dh-back").onclick = () => go("#library");
    wireLock(dhRoute); return;
  }
  const p = progOf(m[1]); if (!p) return go("");
  const x = m[2] && findSession(p, m[2]);
  if (m[2] && !x) return go("#dh/" + p.slug);
  if (!m[3]) closePlayer();
  if (x) { renderSession(p, x); if (m[3]) openPlayer(p, x); }
  else renderProgram(p);
  if (!m[3]) window.scrollTo(0, 0);
}
window.addEventListener("hashchange", dhRoute);

/* ---------- start-up: unlock with the saved passphrase, then draw ---------- */
(async () => {
  const saved = ls.get(DH_KEY);
  if (saved && !(await unlock(saved))) ls.del(DH_KEY);
  if (location.hash.startsWith("#dh/")) dhRoute();
  else if (!document.getElementById("v-list").hidden) renderList();
  else if (!document.getElementById("v-dash").hidden && window.renderDash) window.renderDash();
})();
})();
