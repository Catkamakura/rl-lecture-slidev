<script setup>
import {ref,computed} from 'vue'
import {nearGoalValue,gridResponse} from '../lib/teaching.mjs'
const q=ref(.5)
const start=[3,4]
const actions=['North','South','West','East']
const moves=[[0,-1],[0,1],[-1,0],[1,0]]
const nextStates=moves.map(move=>gridResponse(start,move).state)
const probabilities=computed(()=>[1-q.value,0,0,q.value])
const value=computed(()=>nearGoalValue(q.value))
const equation=computed(()=>String.raw`\begin{aligned}J(\pi_q)&=\mathbb E_{\pi_q}[G_0\mid S_0=s_0]\\&=${q.value.toFixed(2)}(-1)+${(1-q.value).toFixed(2)}(-2.9701)=${value.value.toFixed(5)}\end{aligned}`)
</script>
<template>
<div class="policy-return" @click.stop>
 <label>At (3,4), probability of East: <b data-return-q>q = {{q.toFixed(2)}}</b><input aria-label="Probability of East" type="range" min="0" max="1" step=".05" v-model.number="q"></label>
 <div class="return-explanation">
  <section><h3>Four available actions</h3><PolicyArrows :probabilities="probabilities" :state="start" :size="220" /><p class="zero-note">0 = not chosen by this policy.</p></section>
  <section class="return-policy-table"><h3>Example policy <MathInline tex="\pi_q" /></h3><table><thead><tr><th>Action</th><th>Next state</th><th>Probability</th></tr></thead><tbody><tr v-for="(name,i) in actions" :key="name"><td>{{name}}</td><td :data-next-state="name">({{nextStates[i].join(',')}})</td><td :data-return-action="name">{{probabilities[i].toFixed(2)}}</td></tr></tbody></table><p class="continuation"><b>Fixed continuation:</b><br><MathInline tex="\pi_q(\mathrm E\mid(3,3))=1" /><br><MathInline tex="\pi_q(\mathrm S\mid(4,3))=1" /></p></section>
  <section class="return-outcomes"><h3>Paths under this policy</h3><div class="return-path"><b>East → G</b><p>Probability {{q.toFixed(2)}}</p><p>Rewards: −1, 0, 0, …</p><MathInline tex="G_0=-1" /></div><div class="return-path detour"><b>North → East → South → G</b><p>Probability {{(1-q).toFixed(2)}}</p><p>Rewards: −1, −1, −1, 0, …</p><MathInline tex="G_0=-1-0.99-0.99^2=-2.9701" /></div></section>
 </div>
 <div class="expectation" data-policy-return :data-value="value.toFixed(6)"><MathInline :tex="equation" /></div>
</div>
</template>
<style scoped>
.policy-return{margin-top:18px}.policy-return label{display:flex;align-items:center;gap:18px;font:22px Arial}.policy-return label b{color:#d94d00;min-width:95px}.policy-return input{width:270px;accent-color:#d94d00}.return-explanation{display:grid;grid-template-columns:250px 345px 1fr;gap:24px;margin:20px 0 10px;align-items:start}.return-explanation h3{font:700 22px Arial;margin:0 0 10px}.return-explanation .zero-note{font:17px/1.3 Arial;margin:8px 0;color:#596779}.return-policy-table table{font:19px/1.25 Arial!important}.return-policy-table td,.return-policy-table th{padding:7px 8px!important}.return-policy-table .continuation{font:20px/1.5 Arial;margin:17px 0 0}.return-path{border-left:4px solid #d94d00;background:#fff8f2;padding:9px 12px;margin-bottom:13px;font:20px Arial}.return-path.detour{border-left-color:#176aa0;background:#f4f8fb}.return-path b{font:700 20px Arial}.return-path p{font:19px/1.2 Arial;margin:8px 0}.expectation{text-align:center;font:24px Arial;margin:12px 0 8px;border-top:2px solid #dce2e9;padding-top:10px}.policy-return .manual-note{font:18px/1.3 Arial;color:#596779;margin:8px 0}
</style>
