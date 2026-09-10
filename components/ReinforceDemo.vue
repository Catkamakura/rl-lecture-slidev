<script setup>
import {computed, reactive} from 'vue'
import {useNav} from '@slidev/client'
import {createRun, runBatch, sigmoid} from '../lib/bandit.mjs'

const {isPrintMode}=useNav()
const live=reactive(createRun())
const printed=createRun()
for(let i=0;i<40;i++) runBatch(printed)
const shown=computed(()=>isPrintMode.value ? printed : live)
const p=computed(()=>sigmoid(shown.value.theta))
const maxBatch=computed(()=>Math.max(40,shown.value.batch))
const x = n => 65 + 640 * n / maxBatch.value
const y = probability => 292 - 240 * probability
const points=computed(()=>shown.value.history.map(row=>`${x(row.batch)},${y(row.p)}`).join(' '))
const ticks=computed(()=>[0,maxBatch.value/2,maxBatch.value])
function train(count){for(let i=0;i<count;i++)runBatch(live)}
function reset(){Object.assign(live,createRun())}
</script>

<template>
<div class="reinforce-demo">
  <div class="run-label">{{isPrintMode ? 'Example run: 40 batches, seed 443' : 'Sampled REINFORCE run · seed 443'}}</div>
  <div class="training-body">
    <svg class="training-chart" viewBox="0 0 750 345" role="img" aria-label="Probability of choosing action A versus the number of training batches">
      <text x="18" y="22" class="axis-title">Probability of A</text>
      <g v-for="v in [0,.25,.5,.75,1]" :key="v">
        <line x1="65" x2="705" :y1="y(v)" :y2="y(v)" stroke="#dce2e9" />
        <text x="52" :y="y(v)+5" text-anchor="end">{{v.toFixed(2)}}</text>
      </g>
      <line x1="65" x2="65" y1="52" y2="292" stroke="#13294b" />
      <line x1="65" x2="705" y1="292" y2="292" stroke="#13294b" />
      <g v-for="n in ticks" :key="n"><text :x="x(n)" y="315" text-anchor="middle">{{n}}</text></g>
      <text x="385" y="341" text-anchor="middle" class="axis-title">Training batches</text>
      <polyline :points="points" fill="none" stroke="#d94d00" stroke-width="4" stroke-linejoin="round" />
      <circle :cx="x(shown.batch)" :cy="y(p)" r="5" fill="#13294b" />
    </svg>
    <div class="training-values" aria-live="polite">
      <div>Completed batches<strong class="batch-count">{{shown.batch}}</strong></div>
      <div>Probability of A<strong class="current-prob">{{p.toFixed(3)}}</strong></div>
      <div>Expected reward<strong class="expected-reward">{{(1+p).toFixed(3)}}</strong><span>Exact model expectation: J = 1 + p</span></div>
    </div>
  </div>
  <div v-if="!isPrintMode" class="training-controls" @click.stop>
    <button @click="train(1)">Train 1 batch</button>
    <button @click="train(20)">Train 20 batches</button>
    <button @click="reset">Reset training</button>
    <span>Last batch's mean reward: {{shown.lastReward===null?'—':shown.lastReward.toFixed(3)}}</span>
  </div>
  <div v-else class="print-demo-note">The Slidev version lets you run the updates and reset the experiment.</div>
</div>
</template>

<style scoped>
.run-label{font-size:22px;color:#596779;margin:0 0 8px}
.training-body{display:grid;grid-template-columns:750px 1fr;gap:28px;align-items:center}
.training-chart{width:750px;height:345px;overflow:visible}
svg text{font:17px Arial,sans-serif;fill:#596779}.axis-title{font-size:19px;fill:#13294b}
.training-values{font-size:20px}.training-values>div{margin:0 0 16px}.training-values strong{display:block;font-size:34px;color:#d94d00;line-height:1.2}.training-values span{display:block;font-size:15px;color:#596779;margin-top:4px}
.training-controls{display:flex;gap:12px;align-items:center;margin:14px 0 21px}.training-controls button{font:19px Arial;border:1px solid #a7b5c6;background:white;color:#13294b;padding:9px 13px;border-radius:3px;cursor:pointer}.training-controls button:hover{background:#fff0e5}.training-controls span{font-size:17px;color:#596779;margin-left:6px}
.print-demo-note{font-size:19px;color:#596779;margin:14px 0 21px}
</style>
