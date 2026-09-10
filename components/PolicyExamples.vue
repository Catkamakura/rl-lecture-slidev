<script setup>
import {ref,computed} from 'vue'
import {gridResponse} from '../lib/teaching.mjs'
const names=['North','South','West','East']
const moves=[[0,-1],[0,1],[-1,0],[1,0]]
const policies={
 random:Array.from({length:25},(_,i)=>i===24?null:[.25,.25,.25,.25]),
 east:Array.from({length:25},(_,i)=>i===24?null:[0,0,0,1]),
}
const selectedPolicy=ref('random'),xy=ref([0,0]),steps=ref(0),total=ref(0),last=ref(null)
const trail=ref([[0,0]])
const current=computed(()=>policies[selectedPolicy.value][xy.value[1]*5+xy.value[0]])
const finished=computed(()=>current.value===null)
function restart(x,y){xy.value=[x,y];steps.value=0;total.value=0;last.value=null;trail.value=[[x,y]]}
function selectPolicy(name){selectedPolicy.value=name;restart(...xy.value)}
function step(){
 if(finished.value)return
 const draw=Math.random();let cumulative=0,index=3
 for(let i=0;i<4;i++){cumulative+=current.value[i];if(draw<cumulative){index=i;break}}
 const before=[...xy.value],response=gridResponse(before,moves[index])
 xy.value=response.state;steps.value++;total.value+=response.reward;trail.value.push([...xy.value])
 last.value={name:names[index],before,after:[...xy.value],reward:response.reward}
}
function run(count){for(let i=0;i<count&&!finished.value;i++)step()}
const visited=(x,y)=>trail.value.some(s=>s[0]===x&&s[1]===y)
</script>
<template>
<div class="policy-examples" @click.stop>
 <div class="policy-choices" role="group" aria-label="Choose a policy for the whole grid">
  <button :aria-pressed="selectedPolicy==='random'" @click="selectPolicy('random')"><b>Uniform random</b><span><MathInline tex="\pi(a\mid s)=1/4" /> for all four actions</span></button>
  <button :aria-pressed="selectedPolicy==='east'" @click="selectPolicy('east')"><b>Always East</b><span><MathInline tex="\pi(\mathrm E\mid s)=1" />; other actions have probability 0</span></button>
 </div>
 <div class="policy-panels">
  <section>
   <h3>Place the agent, then run</h3>
   <div class="table-grid"><template v-for="row in 5" :key="row"><button v-for="col in 5" :key="col" :aria-label="`Select state ${col-1}, ${row-1}`" :class="{selected:col-1===xy[0]&&row-1===xy[1],goal:col===5&&row===5,visited:visited(col-1,row-1)}" @click="restart(col-1,row-1)">{{col===5&&row===5?'G':col-1===xy[0]&&row-1===xy[1]?'●':''}}</button></template></div>
   <p data-policy-state>State: ({{xy[0]}}, {{xy[1]}})</p>
  </section>
  <section class="arrows-panel"><h3>Action probabilities here</h3><PolicyArrows v-if="!finished" :probabilities="current" :state="xy" :size="230" /><div v-else class="terminal"><b>Terminal state G</b><p>The episode has ended.<br>No next action is taken.</p></div></section>
  <section class="row-panel">
   <h3 data-active-policy>{{selectedPolicy==='random'?'Uniform random':'Always East'}}</h3>
   <table v-if="!finished"><thead><tr><th>Action</th><th>Probability</th></tr></thead><tbody><tr v-for="(name,i) in names" :key="name"><td>{{name}}</td><td :data-row-action="name">{{current[i].toFixed(2)}}</td></tr></tbody></table>
   <p v-if="last" class="last-action" data-policy-transition><b>{{last.name}}</b>: ({{last.before.join(', ')}}) → ({{last.after.join(', ')}})<br>Reward: {{last.reward}}</p>
   <p v-else class="last-action">The chosen policy applies<br>at every nonterminal state.</p>
  </section>
 </div>
 <div class="run-controls"><button :disabled="finished" @click="step">Take one action</button><button :disabled="finished" @click="run(10)">Take up to 10 actions</button><button @click="restart(0,0)">Restart at (0, 0)</button><span>Steps: <b data-policy-steps>{{steps}}</b></span><span>Return: <b data-policy-return>{{total}}</b></span></div>
 <p class="instruction">Click a cell to restart there. The chosen policy stays active. γ = 1; no training.</p>
</div>
</template>
<style scoped>
.policy-examples{margin-top:15px}.policy-choices{display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:19px}.policy-choices button{text-align:left;color:#13294b;border:1px solid #a7b5c6;background:white;padding:10px 15px;cursor:pointer;display:flex;flex-direction:column;gap:6px}.policy-choices button[aria-pressed=true]{border:2px solid #d94d00;padding:9px 14px;background:#fff3ea}.policy-choices b{font:700 23px Arial}.policy-choices span{font:19px Arial}.policy-panels{display:grid;grid-template-columns:280px 300px 1fr;gap:35px;align-items:start}.policy-examples h3{font:700 22px Arial;margin:0 0 13px}.table-grid{display:grid;grid-template-columns:repeat(5,41px);gap:4px}.table-grid button{height:41px;width:41px;border:1px solid #b7c6d4;background:#fff;font:25px Arial;color:#d94d00;cursor:pointer}.table-grid .visited{background:#f1f5f9}.table-grid .selected{background:#ffeadb;border:2px solid #d94d00}.table-grid .goal{background:#14796b;color:white}.policy-examples p{font:19px/1.35 Arial;margin:12px 0}.row-panel table{font:20px Arial!important}.row-panel td,.row-panel th{padding:7px 10px!important}.arrows-panel h3{text-align:center}.terminal{padding:50px 5px;text-align:center;color:#14796b;font:24px Arial}.last-action{padding-top:8px;border-top:1px solid #dce2e9}.run-controls{display:flex;gap:12px;align-items:center;margin-top:16px;font:20px Arial}.run-controls button{font:18px Arial;padding:8px 11px;background:white;color:#13294b;border:1px solid #a7b5c6;cursor:pointer}.run-controls button:disabled{opacity:.45;cursor:default}.run-controls span{margin-left:10px}.policy-examples .instruction{font:18px Arial;color:#596779;margin:13px 0 0}
</style>
<style scoped>
.policy-choices{margin-bottom:12px}.policy-choices button{padding:8px 15px}.policy-choices button[aria-pressed=true]{padding:7px 14px}.run-controls{margin-top:8px}.policy-examples .instruction{margin-top:8px}
</style>
