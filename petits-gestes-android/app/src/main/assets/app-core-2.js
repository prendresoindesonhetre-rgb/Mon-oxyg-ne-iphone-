function coverArtSVG(){
  return `<svg class="watercolor-svg" viewBox="0 0 430 520" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#b9dcf0"/><stop offset=".62" stop-color="#e9eff7"/><stop offset="1" stop-color="#f8f4f0"/></linearGradient><filter id="softBlur"><feGaussianBlur stdDeviation="5"/></filter></defs>
    <rect width="430" height="520" fill="url(#sky)"/>
    <circle cx="330" cy="88" r="76" fill="#fff" opacity=".38" class="soft"/>
    <path d="M0 275L85 185l55 63 60-92 56 77 61-105 113 147v245H0Z" fill="#93a8c5" opacity=".28"/>
    <path d="M0 323c95-38 187-30 430 11v186H0Z" fill="#b8d6de" opacity=".64"/><path d="M0 350c117-37 233-32 430 8" stroke="#7ab0c4" stroke-width="3" opacity=".38"/>
    <path d="M92 468C65 358 68 256 85 168c11-58 37-118 63-152h50c-22 42-37 96-44 155-10 85-5 191 26 297Z" fill="#74675e" opacity=".95"/>
    <path d="M147 146C92 99 52 91 9 105M147 118c52-54 101-70 158-77M149 189c-55-25-100-20-145 4M151 165c58-30 104-27 156-6" stroke="#74675e" stroke-width="16" fill="none" stroke-linecap="round"/>
    <g opacity=".92"><ellipse cx="65" cy="91" rx="48" ry="31" fill="#58b8c6"/><ellipse cx="126" cy="67" rx="58" ry="35" fill="#78a9d3"/><ellipse cx="192" cy="51" rx="61" ry="38" fill="#8e75c6"/><ellipse cx="247" cy="83" rx="65" ry="38" fill="#64bdc6"/><ellipse cx="42" cy="148" rx="58" ry="34" fill="#6eaed0"/><ellipse cx="216" cy="127" rx="76" ry="43" fill="#7d7fc5"/><ellipse cx="112" cy="123" rx="62" ry="38" fill="#4fb7c6"/></g>
    <path d="M112 442c7-28 29-48 65-61M127 454c31-13 58-12 87-2M145 462c-14 8-27 16-39 31" stroke="#74675e" stroke-width="8" fill="none" stroke-linecap="round"/>
    <path d="M22 438c20-10 39-8 57 2M296 445c25-16 55-16 84-3" stroke="#7aa8b9" stroke-width="4" opacity=".5"/>
  </svg>`;
}
function needTile(icon,title,sub,action){return `<button class="need-tile" ${action}><span class="need-icon">${icon}</span><h3>${title}</h3><small>${sub}</small></button>`;}
function renderIntro(force=false){
  stopTimer();document.body.classList.add('intro-mode');backBtn.hidden=true;
  main.innerHTML=`<section class="intro-screen"><div class="intro-art">${coverArtSVG()}</div><div class="intro-copy"><h1>Les petits gestes<br>de mon Hêtre</h1><p class="tagline">De grands bienfaits dans de petits instants.</p><div class="micro">Apaiser · Relâcher · Se recentrer · Avancer · Juste être</div><button id="introStart" class="primary">Commencer</button><div class="brand-sub" style="margin-top:13px">Prendre soin de son Hêtre</div></div></section>`;
  document.getElementById('introStart').onclick=()=>{localStorage.setItem('hetre:intro','1');document.body.classList.remove('intro-mode');navigate('home');};
}
function renderTips(){
  state.current=null;backBtn.hidden=false;
  main.innerHTML=`<div class="section-title"><h2>Tips du quotidien</h2><small>Partout, discrètement</small></div><div class="tips-list">
    <button class="tip-row" data-open="before-interaction"><span class="tip-mini">☕</span><div><h3>Au travail</h3><p>Des gestes discrets et efficaces</p></div><span class="chev">›</span></button>
    <button class="tip-row" data-open="bigtoe"><span class="tip-mini">⌁</span><div><h3>Dans les transports</h3><p>Se recentrer là où tu es</p></div><span class="chev">›</span></button>
    <button class="tip-row" data-open="before-answer"><span class="tip-mini">…</span><div><h3>Avant une interaction</h3><p>Créer un peu d’espace avant de répondre</p></div><span class="chev">›</span></button>
    <button class="tip-row" data-open="next-thought"><span class="tip-mini">◌</span><div><h3>Quand les pensées tournent</h3><p>Un coupe-circuit très court</p></div><span class="chev">›</span></button>
    <button class="tip-row" data-open="shake-stop"><span class="tip-mini">✦</span><div><h3>Quand l’énergie manque</h3><p>Remettre doucement du mouvement</p></div><span class="chev">›</span></button>
    <button class="tip-row" data-open="sleep-loop"><span class="tip-mini">☾</span><div><h3>Avant de dormir</h3><p>Laisser l’esprit se déposer</p></div><span class="chev">›</span></button>
    <button class="tip-row" data-open="far-look"><span class="tip-mini">▱</span><div><h3>Avec les écrans</h3><p>Redonner de l’espace au regard</p></div><span class="chev">›</span></button>
  </div><div class="quote-box">« De petits gestes, pour de grands changements. »</div>`;bindOpen();
}

function exerciseCard(e){
  return `<button class="exercise-card" data-open="${e.id}">
    <div class="exercise-top"><span class="card-icon">${e.icon}</span><span class="badge ${e.invisible?'invisible':''}">${e.invisible?'Invisible':'À soi'}</span></div>
    <h3>${e.title}</h3><p>${formatDuration(e.duration)} · ${cats[e.cat]}</p>
  </button>`;
}

function renderHome(){
  document.body.classList.remove('intro-mode');state.current=null;backBtn.hidden=true;
  main.innerHTML=`
    <div class="home-title">Les petits gestes de mon Hêtre</div>
    <div class="home-kicker">Un appui, juste pour toi</div>
    <section class="home-leaf-border">
      <div class="need-grid">
        ${needTile('☁','Dans ma tête','Créer un peu d’espace','data-homecat="head"')}
        ${needTile('❧','Relâcher mon corps','Détendre les tensions','data-homecat="body"')}
        ${needTile('☼','Retrouver de l’énergie','Se remettre en mouvement','data-homecat="energy"')}
        ${needTile('☾','Avant de dormir','Laisser venir le calme','data-homecat="sleep"')}
        ${needTile('◌','Dans la vie quotidienne','Partout, discrètement','id="tipsBtn"')}
        ${needTile('✦','Surprends-moi','Un geste au hasard','id="surpriseBtn"')}
      </div>
      <button id="circuitBtn" class="primary circuit-wide"><span class="lightning">⚡</span><span><b>Coupe-circuit</b><br><small style="font-weight:500;opacity:.85">Un geste, tout de suite</small></span></button>
    </section>
    <section class="section"><div class="section-title"><h2>Essentiels</h2><small>10 à 60 secondes</small></div><div class="grid">${["tongue","next-thought","double-sigh","feet-press","pressure-min","before-answer"].map(id=>exerciseCard(exercises.find(x=>x.id===id))).join("")}</div></section>`;
  document.getElementById('circuitBtn').onclick=()=>openExercise(randomExercise().id);
  document.getElementById('surpriseBtn').onclick=()=>openExercise(randomExercise().id);
  document.getElementById('tipsBtn').onclick=()=>renderTips();
  bindOpen();
  document.querySelectorAll('[data-homecat]').forEach(b=>b.onclick=()=>{state.filter=b.dataset.homecat;state.nav='explore';syncNav();renderExplore();});
}

function tipOfDay(){
  const key = new Date().toISOString().slice(0,10);
  let idx = Number(localStorage.getItem("hetre:tip-index"));
  let savedDate = localStorage.getItem("hetre:tip-date");
  if(savedDate!==key || !Number.isInteger(idx)){idx=Math.floor(Math.random()*contextTips.length);localStorage.setItem("hetre:tip-index",idx);localStorage.setItem("hetre:tip-date",key);}
  const t=contextTips[idx];
  return `<div class="tip-card"><div class="tip-icon">${t.icon}</div><div><h3>${t.title}</h3><p>${t.text}</p></div></div>`;
}
