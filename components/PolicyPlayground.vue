<script setup>
import {ref, computed} from 'vue'
import {gridPolicyDetails} from '../lib/teaching.mjs'
const x = ref(1), y = ref(2), theta = ref(0)
const names = ['North', 'South', 'West', 'East']
const formulas = ['-\\theta d_y', '\\theta d_y', '-\\theta d_x', '\\theta d_x']
const model = computed(() => gridPolicyDetails(x.value, y.value, theta.value))
const eastCalculation = computed(() => `\\frac{${model.value.exponentials[3].toFixed(3)}}{${model.value.normalizer.toFixed(3)}}\\approx ${model.value.probabilities[3].toFixed(3)}`)
</script>
<template>
<div class="policy-playground" @click.stop>
  <div class="parameter-controls">
    <label>Shared weight <strong>θ = {{Number(theta).toFixed(1)}}</strong>
      <input aria-label="Policy parameter theta" type="range" min="-3" max="3" step=".1" v-model.number="theta">
    </label>
    <button @click="theta=1">Set θ = 1</button>
    <button @click="theta=0;x=1;y=2">Reset policy</button>
  </div>
  <div class="policy-diagram">
    <section>
      <h3>1. State → features</h3>
      <div class="state-grid">
        <template v-for="row in 5" :key="row"><button v-for="col in 5" :key="col" :aria-label="`Select state ${col-1}, ${row-1}`" :disabled="col===5&&row===5" :class="{selected:col-1===x&&row-1===y,goal:col===5&&row===5}" @click="x=col-1;y=row-1">{{col===5&&row===5?'G':col-1===x&&row-1===y?'●':''}}</button></template>
      </div>
      <p>State: ({{x}}, {{y}})</p>
      <p class="feature"><MathInline tex="d_x=(4-x)/4" /><br><strong data-feature="dx">{{model.dx.toFixed(2)}}</strong></p>
      <p class="feature"><MathInline tex="d_y=(4-y)/4" /><br><strong data-feature="dy">{{model.dy.toFixed(2)}}</strong></p>
    </section>
    <span class="arrow">→</span>
    <section class="score-panel">
      <h3>2. Features × weight → scores</h3>
      <table>
        <thead><tr><th>Action</th><th>Rule</th><th><MathInline tex="z_a" /></th><th><MathInline tex="e^{z_a}" /></th></tr></thead>
        <tbody><tr v-for="(name,i) in names" :key="name"><td>{{name}}</td><td><MathInline :tex="formulas[i]" /></td><td :data-score="name">{{model.logits[i].toFixed(2)}}</td><td :data-exponential="name">{{model.exponentials[i].toFixed(3)}}</td></tr></tbody>
      </table>
      <p class="normalizer"><MathInline tex="\sum_b e^{z_b}" /> = <strong data-normalizer>{{model.normalizer.toFixed(3)}}</strong></p>
      <p class="small-note">A score can be negative.<br>Exponentials are always positive.</p>
    </section>
    <span class="arrow">→</span>
    <section class="policy-bars">
      <h3>3. Normalize → probabilities</h3>
      <p class="softmax-formula"><MathInline tex="\pi_\theta(a\mid s)=\frac{e^{z_a}}{\sum_b e^{z_b}}" /></p>
      <div v-for="(name,i) in names" :key="name" class="prob-row"><span>{{name}}</span><div class="bar-track"><div :style="{width:100*model.probabilities[i]+'%'}"></div></div><strong :data-action="name">{{model.probabilities[i].toFixed(3)}}</strong></div>
      <p class="east-worked">East: <MathInline :tex="eastCalculation" /></p>
      <p class="small-note">Probabilities sum to 1.<br>Displayed values are rounded.</p>
    </section>
  </div>
  <p class="interaction-hint">Move θ: change the shared weight. Select a cell: change the input state.</p>
</div>
</template>
<style scoped>
.parameter-controls{display:flex;align-items:center;gap:18px;margin:8px 0 28px;font:23px Arial}.parameter-controls label{display:flex;align-items:center;gap:16px}.parameter-controls strong{color:#d94d00;min-width:95px}.parameter-controls input{width:235px;accent-color:#d94d00}.parameter-controls button{border:1px solid #a7b5c6;padding:7px 13px;font:18px Arial;color:#13294b;background:white;cursor:pointer}.policy-diagram{display:grid;grid-template-columns:207px 22px 408px 22px 1fr;gap:16px;align-items:start}.policy-diagram h3{font:700 22px/1.3 Arial;margin:0 0 17px}.policy-diagram p{font:20px/1.4 Arial;margin:12px 0}.arrow{font-size:32px;color:#d94d00;padding-top:145px}.state-grid{display:grid;grid-template-columns:repeat(5,35px);gap:3px}.state-grid button{width:35px;height:35px;border:1px solid #bdc8d4;background:white;font:24px Arial;color:#d94d00;cursor:pointer}.state-grid .selected{background:#ffeadb}.state-grid .goal{background:#14796b;color:white}.feature strong{color:#d94d00}.score-panel table{font:20px Arial;width:100%}.score-panel th,.score-panel td{padding:14px 10px}.normalizer{padding-top:8px;font-size:22px!important}.normalizer strong{color:#d94d00}.policy-diagram .small-note{font-size:18px;color:#596779}.softmax-formula{min-height:60px;margin:0 0 14px!important;font-size:23px!important}.prob-row{display:grid;grid-template-columns:54px 1fr 47px;gap:8px;align-items:center;margin:18px 0;font:19px Arial}.bar-track{height:22px;background:#eff3f7}.bar-track div{height:22px;background:#d94d00}.prob-row strong{font:700 18px Arial}.east-worked{margin-top:22px!important;font-size:20px!important}.interaction-hint{margin-top:20px!important;font:21px/1.4 Arial!important;color:#596779}
</style>
<style scoped>
.parameter-controls{margin-bottom:20px}.policy-diagram h3{margin-bottom:14px}.score-panel th,.score-panel td{padding:10px}.state-grid{grid-template-columns:repeat(5,32px)}.state-grid button{width:32px;height:32px}.policy-diagram p{margin:10px 0}.normalizer{padding-top:4px}.interaction-hint{margin-top:14px!important}
</style>
