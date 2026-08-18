const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PORT = Number(process.env.PORT || 3000);
const HOST = process.env.HOST || '0.0.0.0';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ChangeMe-123!';
const DB_FILE = path.join(__dirname, 'server-data.json');
const PUBLIC = __dirname;

function defaultDB(){
  const data = require('./seed-data.json');
  return { app:data.app, films:data.films, users:[], orders:[], access:[] };
}
function loadDB(){ try { return JSON.parse(fs.readFileSync(DB_FILE,'utf8')); } catch(e){ const d=defaultDB(); saveDB(d); return d; } }
function saveDB(db){ fs.writeFileSync(DB_FILE, JSON.stringify(db,null,2)); }
let db=loadDB();
const sessions=new Map();
function send(res,status,obj){ const body=JSON.stringify(obj); res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'}); res.end(body); }
function parseBody(req){ return new Promise((resolve,reject)=>{let b=''; req.on('data',c=>{b+=c; if(b.length>2e6) req.destroy();}); req.on('end',()=>{try{resolve(b?JSON.parse(b):{})}catch(e){reject(e)}}); req.on('error',reject);}); }
function token(){return crypto.randomBytes(32).toString('hex')}
function auth(req){const t=(req.headers.authorization||'').replace(/^Bearer\s+/i,''); return sessions.get(t)||null}
function safeFile(p){const resolved=path.normalize(path.join(PUBLIC,p)); return resolved.startsWith(PUBLIC) ? resolved : null}
function mime(f){return {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.jpg':'image/jpeg','.jpeg':'image/jpeg','.png':'image/png','.webmanifest':'application/manifest+json','.svg':'image/svg+xml'}[path.extname(f).toLowerCase()]||'application/octet-stream'}
function publicDB(){return {app:db.app,films:db.films}}
function createAccess(order){const code='WOOD-'+crypto.randomBytes(4).toString('hex').toUpperCase()+'-'+crypto.randomBytes(4).toString('hex').toUpperCase(); const a={id:crypto.randomUUID(),code,filmId:order.filmId,userId:order.userId,expiresAt:null,createdAt:new Date().toISOString()}; db.access.push(a); saveDB(db); return a;}
function router(req,res){
  const u=new URL(req.url,`http://${req.headers.host||'localhost'}`); const p=u.pathname;
  if(req.method==='GET' && p==='/api/health') return send(res,200,{ok:true,service:'HYBRID WOOD STUDIOS PROJECTION'});
  if(req.method==='GET' && p==='/api/catalog') return send(res,200,publicDB());
  if(req.method==='POST' && p==='/api/admin/login') return parseBody(req).then(b=>{if(b.password!==ADMIN_PASSWORD)return send(res,401,{error:'Mot de passe incorrect'}); const t=token(); sessions.set(t,{role:'admin'}); send(res,200,{token:t});});
  if(req.method==='GET' && p==='/api/admin/catalog'){if(!auth(req))return send(res,401,{error:'Non autorisé'}); return send(res,200,publicDB());}
  if(req.method==='PUT' && p==='/api/admin/catalog'){if(!auth(req))return send(res,401,{error:'Non autorisé'}); return parseBody(req).then(b=>{if(!Array.isArray(b.films))return send(res,400,{error:'films doit être un tableau'}); db.films=b.films; if(b.app)db.app={...db.app,...b.app}; saveDB(db); send(res,200,{ok:true,...publicDB()});});}
  if(req.method==='POST' && p==='/api/orders'){return parseBody(req).then(b=>{const film=db.films.find(f=>f.id===b.filmId); if(!film)return send(res,404,{error:'Film introuvable'}); const order={id:crypto.randomUUID(),filmId:film.id,amount:film.price,currency:db.app.currency||'HTG',customer:b.customer||{},provider:b.provider||'pending',status:'pending',createdAt:new Date().toISOString()}; db.orders.push(order); saveDB(db); send(res,201,{order, message:'Commande créée. Le paiement réel doit être confirmé par le prestataire.'});});}
  if(req.method==='POST' && p==='/api/payments/webhook'){return parseBody(req).then(b=>{const secret=process.env.PAYMENT_WEBHOOK_SECRET||'CHANGE_ME'; if(secret && b.secret!==secret)return send(res,401,{error:'Webhook non autorisé'}); const order=db.orders.find(o=>o.id===b.orderId || o.externalId===b.orderId); if(!order)return send(res,404,{error:'Commande introuvable'}); if(b.status!=='paid')return send(res,200,{ok:true,status:b.status}); order.status='paid'; order.externalId=b.externalId||order.externalId||null; const access=createAccess(order); send(res,200,{ok:true,orderId:order.id,accessCode:access.code});});}
  if(req.method==='POST' && p==='/api/access/verify'){return parseBody(req).then(b=>{const a=db.access.find(x=>x.code===String(b.code||'').trim().toUpperCase()); if(!a)return send(res,404,{valid:false,error:'Code invalide'}); const film=db.films.find(f=>f.id===a.filmId); send(res,200,{valid:true,film,access:a});});}
  if(req.method==='POST' && p==='/api/admin/orders'){if(!auth(req))return send(res,401,{error:'Non autorisé'}); return send(res,200,{orders:db.orders,access:db.access});}
  // static site
  let file=p==='/'?'/index.html':p; const full=safeFile(file); if(!full)return send(res,403,{error:'Forbidden'}); fs.stat(full,(e,s)=>{if(e||!s.isFile())return send(res,404,{error:'Not found'}); res.writeHead(200,{'Content-Type':mime(full)}); fs.createReadStream(full).pipe(res);});
}
http.createServer((req,res)=>{Promise.resolve(router(req,res)).catch(e=>{console.error(e); if(!res.headersSent) send(res,500,{error:'Erreur serveur'})})}).listen(PORT,HOST,()=>console.log(`HYBRID WOOD running on http://${HOST}:${PORT}`));
