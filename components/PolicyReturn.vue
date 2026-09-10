<script setup>
import {ref,computed} from 'vue'
import {nearGoalValue} from '../lib/teaching.mjs'
const q=ref(.5)
const value=computed(()=>nearGoalValue(q.value))
const equation=computed(()=>String.raw`v_\pi(s)=${q.value.toFixed(2)}(-1)+${(1-q.value).toFixed(2)}(-2.9701)=${value.value.toFixed(6)}`)
</script>
<template>
<div class="policy-return" @click.stop>
 <label>Probability of East: <b data-return-q>{{q.toFixed(2)}}</b><input aria-label="Probability of East" type="range" min="0" max="1" step=".05" v-model.number="q"></label>
 <div class="return-branches">
  <div><h3>East directly</h3><p>Probability {{q.toFixed(2)}}</p><div class="track"><i :style="{width:(q*100)+'%'}"></i></div><p>Return −1</p></div>
  <div><h3>North, East, South</h3><p>Probability {{(1-q).toFixed(2)}}</p><div class="track"><i :style="{width:((1-q)*100)+'%'}"></i></div><p>Return −2.9701</p></div>
 </div>
 <div class="expectation" data-policy-return :data-value="value.toFixed(6)"><MathInline :tex="equation" /></div>
 <p class="manual-note">Manual policy setting, γ = 0.99. The weighted average follows the definition of expectation.</p>
</div>
</template>
<style scoped>
.policy-return{margin-top:20px}.policy-return label{display:flex;align-items:center;gap:18px;font:23px Arial}.policy-return label b{color:#d94d00;min-width:55px}.policy-return input{width:310px;accent-color:#d94d00}.return-branches{display:grid;grid-template-columns:1fr 1fr;gap:42px;margin:20px 0}.return-branches h3{font:700 24px Arial;margin:0 0 8px}.return-branches p{font:21px Arial;margin:10px 0}.track{height:22px;background:#eff3f7}.track i{display:block;height:100%;background:#d94d00}.expectation{text-align:center;font:24px Arial;margin:20px 0}.policy-return .manual-note{font:19px/1.3 Arial;color:#596779;margin:14px 0}
</style>
