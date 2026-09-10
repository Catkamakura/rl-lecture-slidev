<script setup>
import {ref,computed} from 'vue'
const selected=ref(2)
const routes=[
{name:'Model-based',learn:'Estimate transitions and rewards',steps:['Experience','Predict transitions + rewards','Plan actions'],example:'Grid: predict the next cell and move cost, then plan a route.',note:'A learned environment model supports planning. If the model is already known, we can plan without first learning it.'},
{name:'Value-based',learn:'Estimate returns for actions',steps:['Experience','Estimate action values','Choose high-value actions'],example:'Grid: estimate the future return after each possible move.',note:'Action values score long-term consequences. A policy can choose an action with a high estimated value. Q-learning follows this route.'},
{name:'Policy gradients',learn:'Optimize policy parameters directly',steps:['Experience','Estimate a return gradient','Update the policy θ'],example:'Our route: sample actions, observe returns, and update their policy probabilities.',note:'REINFORCE uses complete sampled returns. Actor–critic methods also learn a value predictor to help update the actor.'}
]
const route=computed(()=>routes[selected.value])
</script>
<template>
<div class="rl-landscape" @click.stop>
 <div role="tablist" aria-label="RL approaches" class="landscape-tabs"><button v-for="(r,i) in routes" :key="r.name" role="tab" :aria-selected="i===selected" @click="selected=i"><strong>{{r.name}}</strong><span>{{r.learn}}</span><em v-if="i===2">Today's focus</em></button></div>
 <div class="landscape-detail" role="tabpanel" :aria-label="route.name">
  <div class="landscape-flow"><template v-for="(step,i) in route.steps" :key="step"><span v-if="i" class="arrow">→</span><div>{{step}}</div></template></div>
  <p class="landscape-example">{{route.example}}</p><p>{{route.note}}</p>
 </div>
 <p class="landscape-caveat">These routes can be combined. They are a map of ideas, not separate boxes for every algorithm.</p>
</div>
</template>
<style scoped>
.landscape-tabs{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin:24px 0}.landscape-tabs button{position:relative;text-align:left;color:#13294b;border:1px solid #bdc8d4;background:white;padding:16px 19px 19px;cursor:pointer;min-height:145px}.landscape-tabs strong{display:block;font:700 28px Arial;margin-bottom:11px}.landscape-tabs span{font:22px/1.35 Arial;display:block}.landscape-tabs em{font:16px Arial;color:#d94d00;display:block;margin-top:11px}.landscape-tabs [aria-selected=true]{border:2px solid #d94d00;background:#fff3ea}.landscape-tabs button:focus-visible{outline:3px solid #13294b}.landscape-detail{border-top:1px solid #dce2e9;padding-top:9px}.landscape-flow{display:flex;align-items:center;gap:18px;margin:8px 0 17px}.landscape-flow div{flex:1;text-align:center;background:#eff3f7;border-top:3px solid #13294b;padding:17px 14px;font:24px/1.3 Arial}.landscape-flow .arrow{font:36px Arial;color:#d94d00}.rl-landscape p{font:23px/1.4 Arial;margin:14px 0}.landscape-example{font-weight:700!important}.rl-landscape .landscape-caveat{font-size:19px;color:#596779;margin-top:22px}
</style>
