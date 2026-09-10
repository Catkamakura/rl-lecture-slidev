import assert from 'node:assert/strict';
import {gridPolicyDetails,baselineMetrics,routeReturn,oneUpdate} from '../lib/teaching.mjs';
import {createRun,runBatch,sigmoid} from '../lib/bandit.mjs';

const close=(a,b,tol=1e-10)=>assert(Math.abs(a-b)<tol,`${a} != ${b}`);
const derivative=(f,x)=>(f(x+1e-5)-f(x-1e-5))/2e-5;
const outcomes=p=>[
 {a:'A',r:3,q:p*.75,z:1-p},
 {a:'A',r:-1,q:p*.25,z:1-p},
 {a:'B',r:1,q:1-p,z:-p},
];
const expectation=(rows,f)=>rows.reduce((s,o)=>s+o.q*f(o),0);

// Explicit finite distributions check the identities independently of demo helpers.
for(const theta of [-2,-1,0,1,2]){
 const p=sigmoid(theta),rows=outcomes(p),target=p*(1-p);
 close(expectation(rows,o=>o.r),1+p);
 close(expectation(rows,o=>o.z),0);
 close(expectation(rows,o=>o.r*o.z),target);
 close(derivative(x=>1+sigmoid(x),theta),target,1e-9);
 for(const b of [-2,0,1.5,4])close(expectation(rows,o=>(o.r-b)*o.z),target);
 for(const action of ['A','B']){
  const lp=x=>Math.log(action==='A'?sigmoid(x):1-sigmoid(x));
  close(derivative(lp,theta),action==='A'?1-p:-p,1e-9);
 }
}

for(let b=0;b<=4;b+=.25){
 const rows=outcomes(.5),mean=expectation(rows,o=>(o.r-b)*o.z);
 const variance=expectation(rows,o=>((o.r-b)*o.z-mean)**2);
 close(mean,.25);close(variance,.375+.25*(b-1.5)**2);
 close(baselineMetrics(b).variance,variance);
 let meanErrorSquared=0,duplicateErrorSquared=0;
 for(const u of rows)for(const v of rows){
  const g1=(u.r-b)*u.z,g2=(v.r-b)*v.z;
  meanErrorSquared+=u.q*v.q*((g1+g2)/2-.25)**2;
 }
 for(const u of rows)duplicateErrorSquared+=u.q*((u.r-b)*u.z-.25)**2;
 close(meanErrorSquared,variance/2);close(duplicateErrorSquared,variance);
}
close((.9375-.375)/.9375,.6);
for(const [a,r,expectedTheta] of [['A',3,.6],['A',-1,-.2],['B',1,-.2]]){
 const u=oneUpdate(0,a,r);close(u.nextTheta,expectedTheta);
 if(r===-1||a==='B')assert(1+u.nextP<1.5);
}
close((1.5-.5+1.5-.5)/4,.5);
assert(Math.abs(sigmoid(.2)-.550)<.0005);
assert(Math.abs(sigmoid(.4)-.599)<.0005);
assert(Math.abs(sigmoid(.6)-.646)<.0005);

// Old-data bias and exact importance correction at fixed target parameters.
const old=outcomes(.5),newP=.8;
const newScore=o=>o.a==='A'?1-newP:-newP;
const ratio=o=>o.a==='A'?newP/.5:(1-newP)/.5;
close(expectation(old,o=>o.r*newScore(o)),-.2);
close(expectation(old,o=>ratio(o)*o.r*newScore(o)),.16);
close(expectation(old,o=>ratio(o)*o.r),1.8);
close(expectation(old,o=>(o.r-(o.a==='A'?2:1))*o.z),0);

// A fully specified two-step test MDP contains the lecture's illustrative AA trace.
// These extra outcomes are test fixtures, not new lecture claims.
function trajectories(theta,gamma){
 const p=sigmoid(theta),rows=[];
 for(const a of ['A','B'])for(const b of ['A','B']){
  const r1=a==='A'?0:-2;
  const r2={AA:4,AB:1,BA:2,BB:-1}[a+b];
  const z0=a==='A'?1-p:-p,z1=b==='A'?1-p:-p;
  rows.push({q:(a==='A'?p:1-p)*(b==='A'?p:1-p),r1,r2,z0,z1,G:r1+gamma*r2});
 }
 return rows;
}
for(const gamma of [1,.9])for(const theta of [-1,0,1]){
 const rows=trajectories(theta,gamma);
 const full=expectation(rows,o=>o.G*(o.z0+o.z1));
 const rtg=expectation(rows,o=>o.G*o.z0+gamma*o.r2*o.z1);
 const baseline=expectation(rows,o=>(o.G-1.5)*o.z0+gamma*(o.r2-2)*o.z1);
 close(full,rtg);close(full,baseline);
 close(derivative(x=>expectation(trajectories(x,gamma),o=>o.G),theta),full,1e-8);
}

for(const theta of [-3,0,1,3])for(let x=0;x<5;x++)for(let y=0;y<5;y++){
 const d=gridPolicyDetails(x,y,theta);
 close(d.probabilities.reduce((a,b)=>a+b,0),1);
 for(let i=0;i<4;i++)close(d.probabilities[i],d.exponentials[i]/d.normalizer);
}
assert.deepEqual(gridPolicyDetails(1,2,1).logits,[-.5,.5,-.75,.75]);
assert(Math.abs(gridPolicyDetails(1,2,1).probabilities[3]-.437)<.0005);
close(100*100*36*10,3600000);close(4*3600000,14400000);
close(routeReturn(8,1),-8);close(routeReturn(12,1),-12);
close(routeReturn(8,.9),-5.6953279);close(routeReturn(12,.9),-7.17570463519);
for(const gamma of [.1,.9,.99]){
 for(const n of [0,1,10,100])close(gamma**n/(1-gamma),(1/(1-gamma)-(-routeReturn(n,gamma))),1e-9);
}
const kl=p=>.5*Math.log(.5/p)+.5*Math.log(.5/(1-p));
assert(Math.abs(kl(.6)-.0204)<.00005);assert(Math.abs(kl(.95)-.8304)<.00005);
assert(Math.abs(1.6**10-110)<.1);
for(const a of [-1,0,1])for(const r of [.2,.8,1,1.2,1.8]){
 const clip=Math.min(r*a,Math.max(.8,Math.min(1.2,r))*a);
 const piece=a>=0?a*Math.min(r,1.2):a*Math.max(r,.8);
 close(clip,piece);
}
const rewards=[-1,-1,-1],V=[.2,.3,.4,.5],gamma=.9;
const residuals=rewards.map((r,t)=>r+gamma*V[t+1]-V[t]);
close(residuals.reduce((s,d,t)=>s+gamma**t*d,0),rewards.reduce((s,r,t)=>s+gamma**t*r,0)+gamma**3*V[3]-V[0]);

const run=createRun(443);for(let i=0;i<40;i++)runBatch(run);
close(sigmoid(run.theta),.9316579033408068);
console.log(JSON.stringify({
 verified:['finite-outcome expectations','policy-score derivatives','baseline cancellation','baseline variance','independent vs duplicated samples','sample updates','old-data bias and IS','two-step trajectory and discounted gradients','softmax','route returns and tail bounds','KL arithmetic','PPO piecewise formula','GAE telescoping'],
 seed443:{batches:40,episodesPerBatch:64,alpha:.4,pA:sigmoid(run.theta)},
 limit:'Numerical and algebraic checks do not establish learning guarantees.'
},null,2));
