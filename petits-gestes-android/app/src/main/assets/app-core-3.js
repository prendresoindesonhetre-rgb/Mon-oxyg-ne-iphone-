function renderExplore(){
  state.current=null; backBtn.hidden=true;
  const q = state.search.trim().toLowerCase();
  let list = exercises.filter(e=>state.filter==="all"||e.cat===state.filter);
  if(q) list=list.filter(e=>(e.title+" "+e.when+" "+e.lead).toLowerCase().includes(q));
  main.innerHTML=`
    <div class="section-title"><h2>Explorer</h2><small>${list.length} gestes</small></div>
    <div class="search-wrap"><input id="search" type="search" placeholder="Chercher un geste…" value="${state.search.replaceAll('"','&quot;')}"></div>
    <div class="filter-row">${Object.entries(cats).map(([k,v])=>`<button class="chip ${state.filter===k?'active':''}" data-filter="${k}">${v}</button>`).join("")}</div>
    ${list.length?`<div class="grid">${list.map(exerciseCard).join("")}</div>`:`<div class="empty-card">Aucun geste trouvé. Essaie un autre mot.</div>`}`;
  document.getElementById("search").addEventListener("input",e=>{state.search=e.target.value;renderExplore();document.getElementById("search").focus();});
  document.querySelectorAll("[data-filter]").forEach(b=>b.onclick=()=>{state.filter=b.dataset.filter;renderExplore();});
  bindOpen();
}

function renderFavorites(){
  state.current=null; backBtn.hidden=true;
  const list=exercises.filter(e=>state.favorites.has(e.id));
  main.innerHTML=`<div class="section-title"><h2>Mes gestes</h2><small>${list.length} favori${list.length>1?'s':''}</small></div>
    ${list.length?`<div class="grid">${list.map(exerciseCard).join("")}</div>`:`<div class="empty-card"><h3>Ta petite boîte à outils est vide</h3><p>Ajoute un cœur à un geste pour le retrouver ici.</p></div>`}`;
  bindOpen();
}

function renderAbout(){
  state.current=null; backBtn.hidden=true;
  main.innerHTML=`<div class="about-card">
    <h2>Prendre soin de son Hêtre</h2>
    <p>Cette application propose de très courts gestes d’attention, de relâchement et de recentrage. Ils peuvent être utilisés seuls, partout, et beaucoup sont volontairement discrets.</p>
    <p>Il n’y a pas de bonne réaction à obtenir. Certains gestes créeront parfois un petit espace, d’autres non. Tu peux simplement garder ceux qui te conviennent.</p>
    <p><strong>Important :</strong> ces outils ne remplacent pas un avis, un diagnostic ou un accompagnement médical ou psychologique. Si un exercice provoque douleur, vertige, malaise ou inconfort, arrête-le.</p>
    <p class="soft-note">Univers conçu dans la continuité de « Prendre soin de son Hêtre » : douceur, écoute du corps et respect du rythme de chacun.</p>
    <button class="secondary" id="replayIntro" style="min-height:46px;margin-top:8px">Revoir l’écran d’accueil</button>
  </div>`;
  document.getElementById("replayIntro").onclick=()=>renderIntro(true);
}

function renderBreathScene(){
  return `<div class="illustration" id="breathArea">
    <div class="breath-scene" id="breathScene">
      <div class="breath-label" id="breathLabel">Prête ?</div>
      <div class="breath-sub">La feuille descend à son rythme. Toi aussi.</div>
      <div class="leaf-wrap">${leafSVG("leaf-svg")}</div>
      ${rootsSVG()}
    </div>
  </div>`;
}
