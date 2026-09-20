const state = {
  nav:"home",
  filter:"all",
  search:"",
  current:null,
  timer:null,
  remaining:0,
  favorites:new Set(JSON.parse(localStorage.getItem("hetre:favorites")||"[]")),
  history:JSON.parse(localStorage.getItem("hetre:history")||"[]")
};

const main = document.getElementById("main");
const backBtn = document.getElementById("backBtn");
const infoBtn = document.getElementById("infoBtn");
const toast = document.getElementById("toast");

function saveFavs(){localStorage.setItem("hetre:favorites",JSON.stringify([...state.favorites]));}
function saveHistory(){localStorage.setItem("hetre:history",JSON.stringify(state.history.slice(0,100)));}
function showToast(msg){toast.textContent=msg;toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1600);}
function formatDuration(s){ if(s<60) return `${s} s`; if(s===60) return "1 min"; return `${Math.round(s/60)} min`; }
function randomExercise(){
  const pool = exercises.filter(e=>e.duration<=60);
  return pool[Math.floor(Math.random()*pool.length)];
}

function leafSVG(cls=""){
  return `<svg class="${cls}" viewBox="0 0 100 145" aria-hidden="true">
    <defs><linearGradient id="leafg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stop-color="#64c6d0"/><stop offset=".58" stop-color="#7bb8d5"/><stop offset="1" stop-color="#9a79ca"/></linearGradient></defs>
    <path d="M51 8 C28 16 12 42 15 72 C18 103 35 125 50 132 C66 122 84 101 86 70 C88 42 73 18 51 8 Z" fill="url(#leafg)" stroke="#3f8998" stroke-width="1.7"/>
    <path d="M50 17 L50 132" stroke="#377b89" stroke-width="1.4" opacity=".8"/>
    <path d="M50 38 L27 52 M50 50 L75 62 M50 66 L25 79 M50 78 L77 90 M50 95 L31 108 M50 105 L69 116" stroke="#4d91a0" stroke-width="1.1" fill="none" opacity=".75"/>
    <path d="M50 131 C48 137 45 141 42 144" stroke="#7d675d" stroke-width="2.4" fill="none"/>
  </svg>`;
}

function illustration(type){
  const common = `stroke="#4a8795" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"`;
  const defs = `<defs><filter id="wash"><feTurbulence type="fractalNoise" baseFrequency=".018" numOctaves="2" seed="7"/><feDisplacementMap in="SourceGraphic" scale="2"/></filter><filter id="softBlur"><feGaussianBlur stdDeviation="3"/></filter><linearGradient id="skin" x1="0" x2="1"><stop stop-color="#f4e7df"/><stop offset="1" stop-color="#eadde8"/></linearGradient><linearGradient id="cloth" x1="0" x2="1"><stop stop-color="#8ac4cc"/><stop offset="1" stop-color="#8492c3"/></linearGradient></defs>`;
  if(type==="tongue") return `<svg viewBox="0 0 300 215">${defs}<ellipse cx="140" cy="110" rx="104" ry="78" fill="#eaf6f8" opacity=".55"/><path d="M112 26c-32 8-53 34-53 70 0 35 19 62 49 74 21 8 47 4 66-12 15-13 26-31 27-52 2-37-18-67-51-77-12-4-25-5-38-3Z" fill="url(#skin)" stroke="#9e8ca0" stroke-width="1.6"/><path d="M150 62c15 5 27 16 34 29" ${common}/><path d="M110 119c20 10 42 10 59-2" ${common}/><path d="M119 123c13 9 29 9 42 1" stroke="#986fae" stroke-width="11" opacity=".45" fill="none" stroke-linecap="round"/><path d="M121 113c13-3 28-2 40 2" stroke="#d7b6c7" stroke-width="2" fill="none"/><circle cx="127" cy="72" r="3" fill="#4a8795"/><path d="M72 66c-12 25-12 62 1 90M201 58c16 18 20 45 15 69" stroke="#73b8c7" opacity=".22" stroke-width="12" fill="none" stroke-linecap="round"/><path d="M225 68c18-7 31-2 38 8-15 5-27 2-38-8Z" fill="#6ebcc8" opacity=".75"/><path d="M228 67l25 8" stroke="#3f8998" stroke-width="1.4"/></svg>`;
  if(type==="thought") return `<svg viewBox="0 0 300 215">${defs}<path d="M85 172c-9-51 6-106 60-116 48-9 90 26 88 76-1 19-8 35-19 48" fill="#edf5f6" stroke="#6d92a3" stroke-width="2"/><path d="M115 119c26-18 49-18 67-6" stroke="#8d73c7" stroke-width="2" fill="none" opacity=".7"/><path d="M114 61c-30 10-47 34-47 72" stroke="#77b7c7" stroke-width="9" opacity=".17" fill="none"/><g opacity=".88"><path d="M195 57c15-13 33-13 47-2-10 17-27 23-47 2Z" fill="#73bdc9"/><path d="M222 37c12-8 25-6 33 3-10 11-21 12-33-3Z" fill="#9b7bc6"/><path d="M242 74c10-6 21-4 27 4-8 9-18 10-27-4Z" fill="#6fa8ca"/></g><circle cx="216" cy="32" r="3" fill="#c6dff0"/><circle cx="257" cy="58" r="2.5" fill="#c9b8e6"/></svg>`;
  if(type==="feet") return `<svg viewBox="0 0 300 215">${defs}<path d="M0 160c60-25 126-24 300 0v55H0Z" fill="#dcecf3"/><path d="M0 171c71-11 152-12 300 7" stroke="#7fc0c8" stroke-width="3" opacity=".5"/><path d="M95 41c20 3 31 21 28 54-3 38-7 79-29 85-22 6-37-20-32-52 4-31 11-90 33-87Zm110 0c-20 3-31 21-28 54 3 38 7 79 29 85 22 6 37-20 32-52-4-31-11-90-33-87Z" fill="#f1e6df" stroke="#7595a4" stroke-width="2"/><circle cx="84" cy="92" r="9" fill="#8d73c7" opacity=".38"/><circle cx="216" cy="92" r="9" fill="#8d73c7" opacity=".38"/><path d="M32 161c20-9 35-6 47 5M232 164c16-10 29-8 41-1" stroke="#85b8c9" stroke-width="5" opacity=".45" fill="none"/></svg>`;
  if(type==="sound") return `<svg viewBox="0 0 260 190"><path d="M92 55c-30 11-45 37-38 66 7 26 30 45 57 46" ${common}/><path d="M119 70c20 5 33 22 32 43-1 17-12 30-26 36" ${common}/><path d="M178 75c18 9 26 28 19 47" stroke="#8d73c7" stroke-width="3" fill="none"/><path d="M197 61c28 15 40 45 28 73" stroke="#6fa8ca" stroke-width="3" fill="none"/></svg>`;
  if(type==="gaze") return `<svg viewBox="0 0 260 190"><path d="M37 95c25-35 58-52 93-52s68 17 93 52c-25 35-58 52-93 52S62 130 37 95Z" fill="#edf6f7" stroke="#4a8795" stroke-width="2"/><circle cx="130" cy="95" r="26" fill="#8d73c7" opacity=".35"/><circle cx="130" cy="95" r="10" fill="#3f7180"/><path d="M28 58l25 13M232 58l-25 13M28 132l25-13M232 132l-25-13" stroke="#6fa8ca" stroke-width="2" opacity=".7"/></svg>`;
  if(type==="hand"||type==="hands") return `<svg viewBox="0 0 260 190"><path d="M89 147c-9-24-9-52-3-77 2-8 8-11 13-7 4 4 2 19 4 27 0-29 0-50 9-51 9-1 8 28 9 48 0-38 4-58 12-57 9 1 7 34 8 59 2-31 7-46 15-43 8 3 3 32 6 53 6-23 13-30 19-25 8 7-3 40-12 57-14 27-55 42-80 16Z" fill="#eef4f5" stroke="#4a8795" stroke-width="2"/><circle cx="128" cy="96" r="16" fill="#8d73c7" opacity=".18"/></svg>`;
  if(type==="doubleSigh") return `<svg viewBox="0 0 300 215">${defs}<ellipse cx="151" cy="110" rx="106" ry="80" fill="#ecf6f8" opacity=".65"/><path d="M105 33c-29 12-44 38-41 72 3 35 24 59 54 67 28 7 56-3 72-27 16-25 17-55 1-80-19-30-55-44-86-32Z" fill="url(#skin)" stroke="#917f97" stroke-width="1.6"/><path d="M119 85c5 3 11 3 16 0M157 85c5 3 11 3 16 0" stroke="#6c8490" stroke-width="2" fill="none"/><path d="M137 119c10 5 21 5 30 0" stroke="#976e9f" stroke-width="2.4" fill="none"/><path d="M213 86c25-11 43-6 61 8M216 110c27-5 42 1 57 15M209 132c23 1 39 8 51 22" stroke="#66afc2" stroke-width="4" fill="none" stroke-linecap="round" opacity=".7"/><path d="M263 89l11 5-10 6M263 120l10 5-10 6M251 149l10 5-10 6" stroke="#66afc2" stroke-width="3" fill="none"/></svg>`;
  if(type==="shoulder") return `<svg viewBox="0 0 260 190"><circle cx="130" cy="55" r="28" fill="#f0e9f3" stroke="#7e7599" stroke-width="2"/><path d="M73 161c3-51 23-76 57-76s54 25 57 76" fill="#e8f3f5" stroke="#4a8795" stroke-width="2"/><path d="M85 110c16 12 29 16 45 16s30-4 45-16" stroke="#8d73c7" stroke-width="5" opacity=".4" fill="none"/></svg>`;
  if(type==="step") return `<svg viewBox="0 0 260 190"><path d="M58 145h47v-38h47V70h50" stroke="#4a8795" stroke-width="10" opacity=".35" fill="none" stroke-linejoin="round"/><path d="M60 67c43-35 91-35 140 0" stroke="#8d73c7" stroke-width="2" fill="none" stroke-dasharray="5 7"/>${leafSVG("")}</svg>`;
  if(type==="breath") return `<svg viewBox="0 0 260 190"><circle cx="130" cy="95" r="48" fill="#e5f3f5" stroke="#4a8795" stroke-width="2"/><path d="M104 95c13-18 39-18 52 0-13 18-39 18-52 0Z" fill="#8d73c7" opacity=".28"/><path d="M39 95h43M178 95h43" stroke="#6fa8ca" stroke-width="2" stroke-dasharray="4 7"/></svg>`;
  return `<svg viewBox="0 0 260 190"><path d="M80 154c-12-37-2-87 25-109 14-12 36-12 50 0 27 22 37 72 25 109" fill="#edf6f7" stroke="#4a8795" stroke-width="2"/><circle cx="130" cy="76" r="25" fill="#efe8f3" stroke="#7e7599" stroke-width="2"/><path d="M98 118c21 9 43 9 64 0" stroke="#8d73c7" stroke-width="3" fill="none" opacity=".45"/></svg>`;
}

function rootsSVG(){
  return `<svg class="roots" viewBox="0 0 260 80" aria-hidden="true"><path d="M130 5v30M130 31c-30 2-47 22-70 41M130 31c30 2 47 22 70 41M123 36c-16 10-20 22-28 36M137 36c16 10 20 22 28 36" stroke="#8f746d" stroke-width="3" fill="none" stroke-linecap="round"/></svg>`;
}
