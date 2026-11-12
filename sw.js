/* Bump SHELL on every deploy so phones pick up the new files */
const SHELL='gp-shell-v11-neck-support';
const CDN='gp-cdn-v4-exercise-images';
const FILES=['./','index.html','style.css','app.js','manifest.webmanifest','icon.svg','icon-180.png','icon-192.png','icon-512.png','icon-512-maskable.png','cloud-config.js','assets/neck-face-pull.svg','assets/neck-farmers-carry.svg','assets/neck-y-raise.svg','assets/neck-dumbbell-shrug.svg'];
const CDN_HOSTS=['fonts.googleapis.com','fonts.gstatic.com','raw.githubusercontent.com','cdn.zyloai.app','cdn.shopify.com','gymfitclub.ir'];
const EXERCISE_IMAGES=["https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Incline_Bench_Press/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Smith_Machine_Incline_Bench_Press/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_T-Bar_Row/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_T-Bar_Row/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Bar_Pulldown/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/V-Bar_Pulldown/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Bench_Press/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Bench_Press/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Seated_Lateral_Raise/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Reverse_Machine_Flyes/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Triceps_Pushdown_-_Rope_Attachment/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Incline_Dumbbell_Curl/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hack_Squat/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hack_Squat/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Romanian_Deadlift/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Squat_with_Dumbbells/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Split_Squat_with_Dumbbells/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Leg_Curl/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Standing_Calf_Raises/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Pullups/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Dumbbell_Bench_Press/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Cable_Rows/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Shoulder_Military_Press/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Machine_Shoulder_Military_Press/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Low_Cable_Crossover/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Low_Cable_Crossover/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rear_Delt_Fly/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rear_Delt_Fly/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Overhead_Triceps_Extension/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Rope_Overhead_Triceps_Extension/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Preacher_Curl/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Hip_Thrust/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Leg_Press/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Lying_Leg_Curls/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hyperextensions_Back_Extensions/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hyperextensions_Back_Extensions/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Seated_Calf_Raise/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crunch/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Cable_Crunch/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Hanging_Leg_Raise/1.jpg","https://cdn.zyloai.app/exercise/images/lever-lying-chest-press-7.webp","https://cdn.zyloai.app/exercise/images/lever-lying-chest-press-5.webp","https://cdn.shopify.com/s/files/1/1214/7132/files/mt-cable-lateral-raise-900x675_05489ca8-5457-451c-a109-c173f4409a85.jpg?v=1707499502","https://gymfitclub.ir/public/images/articles/upload/barbell-pin-press-muscles-2048x1238.png","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Barbell_Bench_Press_-_Medium_Grip/1.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/0.jpg","https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/Side_Lateral_Raise/1.jpg"];

async function cachedExerciseImage(request){
  const keys=(await caches.keys()).filter(k=>k.startsWith('gp-cdn-')).reverse();
  for(const key of keys){
    const cache=await caches.open(key),hit=await cache.match(request);
    if(hit){if(key!==CDN){const current=await caches.open(CDN);await current.put(request,hit.clone())}return hit}
  }
  return null;
}
async function cacheExerciseImages(){
  const c=await caches.open(CDN);let saved=0,failed=0;
  // Reuse images already downloaded by an older app version before trying the network.
  for(let i=0;i<EXERCISE_IMAGES.length;i+=8){
    const batch=EXERCISE_IMAGES.slice(i,i+8);
    const results=await Promise.allSettled(batch.map(async url=>{
      if(await c.match(url)){saved++;return}
      if(await cachedExerciseImage(url)){saved++;return}
      const res=await fetch(url,{mode:'no-cors',cache:'reload'});
      if(res.ok||res.type==='opaque'){await c.put(url,res.clone());saved++}
      else throw new Error('Image request failed: '+url);
    }));
    failed+=results.filter(x=>x.status==='rejected').length;
  }
  return{saved,failed,total:EXERCISE_IMAGES.length};
}
self.addEventListener('install',e=>{
  e.waitUntil(caches.open(SHELL).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  // Keep older CDN caches: they may contain images already downloaded on the phone.
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==SHELL&&!k.startsWith('gp-cdn-')).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('message',e=>{
  if(e.data&&e.data.type==='CACHE_EXERCISE_IMAGES'){
    const port=e.ports&&e.ports[0];
    e.waitUntil(cacheExerciseImages().then(result=>{if(port)port.postMessage({type:'CACHE_DONE',...result})}).catch(err=>{console.warn('Exercise image pre-cache paused',err);if(port)port.postMessage({type:'CACHE_FAILED'})}));
  }
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET'||r.headers.has('Authorization'))return; // never touch API calls
  const u=new URL(r.url);

  /* App files: serve from cache instantly, refresh in the background */
  if(u.origin===location.origin){
    e.respondWith(caches.open(SHELL).then(async c=>{
      const hit=await c.match(r,{ignoreSearch:true});
      const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>null);
      if(hit){e.waitUntil(net);return hit}
      const res=await net;
      if(res)return res;
      return r.mode==='navigate'?(await c.match('index.html'))||Response.error():Response.error();
    }));
    return;
  }

  /* Fonts and exercise images: cache-first; successful downloads persist for offline use. */
  if(CDN_HOSTS.includes(u.hostname)){
    e.respondWith((async()=>{
      const hit=await cachedExerciseImage(r);if(hit)return hit;
      try{const res=await fetch(r);if(res.ok||res.type==='opaque'){const c=await caches.open(CDN);c.put(r,res.clone())}return res}
      catch(err){return Response.error()}
    })());
  }
});