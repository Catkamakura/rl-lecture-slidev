<script setup>
import {ref, computed} from 'vue'
import {routeReturn} from '../lib/teaching.mjs'
const gamma = ref(.99)
const loop = computed(()=>gamma.value===1?'−∞':(-1/(1-gamma.value)).toFixed(3))
</script>
<template>
<div class="return-explorer" @click.stop>
  <label class="gamma-control">Discount factor γ = <strong>{{Number(gamma).toFixed(2)}}</strong><input aria-label="Return discount factor" type="range" min="0" max="1" step=".01" v-model.number="gamma"><button @click="gamma=1">No discount</button><button @click="gamma=.9">γ = 0.9</button><button @click="gamma=.99">γ = 0.99</button></label>
  <div v-for="length in [8,12]" :key="length" class="route-row">
    <div class="route-label">{{length}} moves to G</div>
    <div class="reward-tiles"><div v-for="k in length" :key="k" :style="{background:`rgba(217,77,0,${.10+.45*gamma**(k-1)})`,color:'#13294b'}"><span>−1</span><small>×{{(gamma**(k-1)).toFixed(2)}}</small></div></div>
    <strong class="route-total" :data-length="length">{{routeReturn(length,gamma).toFixed(3)}}</strong>
  </div>
  <div class="tile-caption">Each tile is one reward. Its weight is 1, γ, γ², … from left to right.</div>
  <div class="loop-total">A policy that loops forever: <strong>{{loop}}</strong></div>
  <p>At γ = 1, an endless loop has return −∞. This endpoint lies outside the discounted formulation.</p>
</div>
</template>
<style scoped>
.gamma-control{display:flex;gap:14px;align-items:center;font:24px Arial;margin:20px 0 44px}.gamma-control strong{color:#d94d00}.gamma-control input{width:250px;accent-color:#d94d00}.gamma-control button{font:18px Arial;padding:8px 12px;background:white;border:1px solid #a7b5c6;color:#13294b;cursor:pointer}.route-row{display:grid;grid-template-columns:166px 1fr 110px;gap:15px;align-items:center;margin:28px 0}.route-label{font:23px Arial}.reward-tiles{display:flex;gap:6px;height:76px}.reward-tiles>div{width:57px;display:flex;flex-direction:column;align-items:center;justify-content:center}.reward-tiles span{font:700 25px Arial}.reward-tiles small{font:15px Arial;margin-top:9px}.route-total{font:700 31px Arial;color:#d94d00}.tile-caption{font:20px Arial;color:#596779;margin:18px 0 29px}.loop-total{border-top:1px solid #dce2e9;padding-top:20px;font:25px Arial}.loop-total strong{color:#d94d00;margin-left:16px}.return-explorer p{font:22px/1.4 Arial;margin-top:24px}
</style>
