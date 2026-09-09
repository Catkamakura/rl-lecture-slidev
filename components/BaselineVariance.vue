<script setup>
import {ref,computed} from 'vue'
import {baselineMetrics} from '../lib/teaching.mjs'
const baseline=ref(0)
const result=computed(()=>baselineMetrics(baseline.value))
const sumEquation=computed(()=>String.raw`\operatorname{Var}(\hat g_b)=`+result.value.outcomes.map(o=>Number(o.varianceTerm.toFixed(7)).toString()).join('+')+'='+result.value.variance.toFixed(4))
const comparison=computed(()=>result.value.variance<.9375-1e-9?'Lower variance: less noise in the batch update.':result.value.variance>.9375+1e-9?'Higher variance: this baseline makes the estimate noisier.':'Same variance as the uncentered update.')
</script>
<template>
<div class="baseline-variance" @click.stop>
  <div class="variance-equations"><MathInline tex="\hat g_b=(G_0-b)\,\frac{d}{d\theta}\log\pi_\theta(a)" /><MathInline tex="\operatorname{Var}(\hat g_b)=\sum_i p_i(\hat g_{b,i}-m)^2,\quad m=0.25" /></div>
  <div class="baseline-controls"><label>Baseline <strong>b = {{baseline.toFixed(2)}}</strong><input aria-label="Baseline value" type="range" min="0" max="4" step=".25" v-model.number="baseline"></label><button @click="baseline=0">b = 0</button><button @click="baseline=1.5">b = 1.5</button><button @click="baseline=4">b = 4</button></div>
  <table><thead><tr><th>Outcome</th><th>Probability</th><th><MathInline tex="\hat g_0" /></th><th><MathInline tex="\hat g_b" /></th><th>Probability × <MathInline tex="(\hat g_b-0.25)^2" /></th></tr></thead>
  <tbody><tr v-for="(o,i) in result.outcomes" :key="i"><td>{{o.label}}</td><td>{{o.probability.toFixed(3)}}</td><td>{{o.raw.toFixed(3)}}</td><td :data-centered="i" class="centered">{{o.gradient.toFixed(3)}}</td><td :data-variance-term="i">{{Number(o.varianceTerm.toFixed(7))}}</td></tr></tbody></table>
  <div class="variance-calculation" data-variance-calculation><MathInline :tex="sumEquation" /></div>
  <div class="variance-summary"><div><h3>Mean gradient</h3><strong data-gradient-mean>{{result.mean.toFixed(2)}}</strong><p>Unchanged for every b.</p></div><div><h3>Variance = sum of last column</h3><div class="variance-bar"><span>Without baseline</span><div class="track"><div style="width:46.875%" class="original"></div></div><b>0.9375</b></div><div class="variance-bar"><span>With this baseline</span><div class="track"><div :style="{width:(result.variance/2*100)+'%'}"></div></div><b data-gradient-variance>{{result.variance.toFixed(4)}}</b></div></div></div>
  <p class="comparison" data-variance-comparison>{{comparison}} <span>Same bandit, θ = 0.</span></p>
</div>
</template>
<style scoped>
.baseline-controls{display:flex;align-items:center;gap:16px;margin:8px 0 14px;font:23px Arial}.baseline-controls label{display:flex;align-items:center;gap:15px}.baseline-controls strong{color:#d94d00;min-width:115px}.baseline-controls input{width:240px;accent-color:#d94d00}.baseline-controls button{font:20px Arial;padding:8px 14px;border:1px solid #a7b5c6;color:#13294b;background:white;cursor:pointer}.baseline-variance>p{font:21px/1.4 Arial;margin:13px 0}.baseline-variance table{font:22px Arial}.baseline-variance th,.baseline-variance td{padding:10px}.baseline-variance .centered{color:#d94d00;font-weight:700}.variance-summary{display:grid;grid-template-columns:260px 1fr;gap:38px;margin:13px 0 12px}.variance-summary h3{font:700 24px Arial;margin:0 0 10px}.variance-summary strong{font:700 39px Arial;color:#14796b}.variance-summary p{font:20px Arial}.variance-bar{display:grid;grid-template-columns:200px 1fr 80px;gap:16px;align-items:center;font:21px Arial;margin:13px 0}.variance-bar b{font-size:22px}.track{height:25px;background:#eff3f7}.track div{height:25px;background:#d94d00}.track .original{background:#94a3b8}.comparison{border-top:2px solid #dce2e9;padding-top:13px;font-weight:700!important}
.variance-equations{display:flex;justify-content:space-between;align-items:center;gap:24px;font:21px Arial;background:#f4f7fa;padding:17px 15px;margin:0 0 19px}.variance-calculation{font:22px Arial;text-align:center;margin:17px 0;color:#13294b}.baseline-variance .baseline-controls{margin-bottom:10px}.baseline-variance>p{margin:10px 0;font-size:20px}.baseline-variance th,.baseline-variance td{padding:8px}.variance-summary{margin-top:18px;gap:28px;grid-template-columns:230px 1fr}.variance-summary h3{font-size:22px}.variance-summary strong{font-size:32px}.variance-summary p{margin:8px 0;font-size:19px}.variance-bar{font-size:20px;margin:10px 0;grid-template-columns:195px 1fr 80px}.comparison{padding-top:10px}.comparison span{font:16px Arial;color:#596779;margin-left:14px}
</style>
<style scoped>.variance-summary{margin:12px 0 3px}</style>
