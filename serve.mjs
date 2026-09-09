import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'dist');
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff':'font/woff','.woff2':'font/woff2','.ttf':'font/ttf'};
let port=Number(process.env.PORT)||3030;
const server=http.createServer(async(req,res)=>{
 try{
  let requested=decodeURIComponent(new URL(req.url,'http://localhost').pathname);
  if(requested.includes('/assets/'))requested=requested.slice(requested.indexOf('/assets/'));
  let file=path.resolve(root,'.'+requested);
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403);res.end();return;}
  let stat=await fs.stat(file).catch(()=>null);
  if(!stat?.isFile())file=path.join(root,'index.html');
  const data=await fs.readFile(file);
  res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-cache'});
  res.end(data);
 }catch{res.writeHead(404);res.end('Not found');}
});
server.on('error',e=>{if(e.code==='EADDRINUSE'&&port<3040){port++;server.listen(port,'127.0.0.1')}else{console.error(e.message);process.exit(1)}});
server.on('listening',()=>console.log('Presentation: http://127.0.0.1:'+port+'\nPresenter notes: http://127.0.0.1:'+port+'/presenter/\nPress Ctrl+C to stop.'));
server.listen(port,'127.0.0.1');
