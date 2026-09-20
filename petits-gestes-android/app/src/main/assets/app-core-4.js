function renderExercise(e){
  state.current=e.id; backBtn.hidden=false;
  const isBreath=e.type==="breath-leaf";
  main.innerHTML=`<div class="exercise-view">
    <section class="exercise-header-card">
      <div class="exercise-meta">
        <span class="duration">${formatDuration(e.duration)}</span>
        ${e.invisible?'<span class="badge invisible">Invisible</span>':'<span class="badge">À soi</span>'}
      </div>
      <h1>${e.title}</h1>
      <p class="when">${e.when}</p>
    </section>

    ${isBreath?renderBreathScene():`<div class="illustration watercolor">${illustration(e.illus)}<div class="illus-caption">Un geste simple, sans performance.</div></div>`}

    <section class="instruction-card">
      <p class="lead">${e.lead}</p>
      <ol class="steps">${e.steps.map((s,i)=>`<li><span class="step-num">${i+1}</span><span>${s}</span></li>`).join("")}</ol>
    </section>

    <div class="action-row">
      <button class="primary" id="startBtn">${isBreath?'Suivre la feuille':'Commencer'} · ${formatDuration(e.duration)}</button>
      <button class="secondary favorite ${state.favorites.has(e.id)?'on':''}" id="favBtn" aria-label="Ajouter aux favoris">${state.favorites.has(e.id)?'♥':'♡'}</button>
    </div>

    <section class="timer-card" id="timerCard">
      <div class="timer-orbit">
        <div class="timer-ring">${leafSVG("leaf-mark")}<div class="timer-number" id="timerNumber">${formatDuration(e.duration)}</div><small>reste simplement avec le geste</small></div>
      </div>
      <div class="progress"><div id="progressBar"></div></div>
      <div class="soft-note" id="timerHint">Rien à réussir. Essaie simplement.</div>
      <div class="feedback" id="feedback">
        <button data-feel="Rien">Rien</button>
        <button data-feel="Un petit espace">Un petit espace</button>
        <button data-feel="Ça m’a aidé">Ça m’a aidé</button>
      </div>
    </section>
  </div>`;
  document.getElementById("favBtn").onclick=()=>toggleFav(e.id);
  document.getElementById("startBtn").onclick=()=>startTimer(e);
  document.querySelectorAll("[data-feel]").forEach(b=>b.onclick=()=>recordFeedback(e,b.dataset.feel));
}

function openExercise(id){
  stopTimer();
  const e=exercises.find(x=>x.id===id);
  if(!e)return;
  renderExercise(e);
  window.scrollTo({top:0,behavior:"smooth"});
  main.focus({preventScroll:true});
}

function startTimer(e){
  stopTimer();
  const card=document.getElementById("timerCard");
  const num=document.getElementById("timerNumber");
  const bar=document.getElementById("progressBar");
  const fb=document.getElementById("feedback");
  card.classList.add("show");fb.classList.remove("show");
  if(e.type!=="breath-leaf"){card.classList.add("timer-orbit-card");}
  state.remaining=e.duration;
  const started=Date.now();
  if(e.type==="breath-leaf"){
    document.getElementById("breathScene").classList.add("breathing");
    updateBreathLabel(0);
  }
  state.timer=setInterval(()=>{
    const elapsed=(Date.now()-started)/1000;
    const left=Math.max(0,e.duration-elapsed);
    state.remaining=left;
    num.textContent=left>=60?`${Math.ceil(left/60)} min`:`${Math.ceil(left)} s`;
    bar.style.width=`${Math.min(100,(elapsed/e.duration)*100)}%`;
    if(e.type==="breath-leaf") updateBreathLabel(elapsed);
    if(left<=0){finishTimer(e);}
  },100);
  document.getElementById("startBtn").textContent="Recommencer";
  card.scrollIntoView({behavior:"smooth",block:"nearest"});
}

function updateBreathLabel(elapsed){
  const label=document.getElementById("breathLabel"); if(!label)return;
  const phase=elapsed%10;
  label.textContent=phase<4?"Inspire doucement":"Laisse l’air repartir";
}

function finishTimer(e){
  stopTimer(false);
  const num=document.getElementById("timerNumber");
  const bar=document.getElementById("progressBar");
  const fb=document.getElementById("feedback");
  if(num)num.textContent="Terminé";
  if(bar)bar.style.width="100%";
  if(fb)fb.classList.add("show");
  state.history.unshift({id:e.id,at:new Date().toISOString()});saveHistory();
  if(e.type==="breath-leaf"){
    const scene=document.getElementById("breathScene");
    if(scene)scene.classList.remove("breathing");
    const label=document.getElementById("breathLabel"); if(label)label.textContent="Laisse la feuille se poser";
  }
}

function stopTimer(clearScene=true){
  if(state.timer){clearInterval(state.timer);state.timer=null;}
  if(clearScene){
    const scene=document.getElementById("breathScene"); if(scene)scene.classList.remove("breathing");
  }
}

function recordFeedback(e,feel){
  localStorage.setItem(`hetre:feel:${e.id}`,feel);
  showToast("C’est noté, sans jugement.");
}

function toggleFav(id){
  if(state.favorites.has(id)){state.favorites.delete(id);showToast("Retiré des favoris");}
  else{state.favorites.add(id);showToast("Ajouté à tes essentiels");}
  saveFavs();
  if(state.current) renderExercise(exercises.find(x=>x.id===id));
}

function bindOpen(){document.querySelectorAll("[data-open]").forEach(b=>b.onclick=()=>openExercise(b.dataset.open));}

function syncNav(){
  document.querySelectorAll(".nav-btn").forEach(b=>b.classList.toggle("active",b.dataset.nav===state.nav));
}
function navigate(nav){
  stopTimer(); state.nav=nav; syncNav();
  if(nav==="home")renderHome();
  if(nav==="explore")renderExplore();
  if(nav==="favorites")renderFavorites();
  if(nav==="about")renderAbout();
  window.scrollTo({top:0,behavior:"smooth"});
}

document.querySelectorAll(".nav-btn").forEach(b=>b.onclick=()=>navigate(b.dataset.nav));
backBtn.onclick=()=>navigate(state.nav==="home"?"home":state.nav);
infoBtn.onclick=()=>navigate("about");

if(localStorage.getItem("hetre:intro")){renderHome();}else{renderIntro();}
