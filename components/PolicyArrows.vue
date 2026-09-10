<script setup>
import {probabilityColor} from '../lib/teaching.mjs'
defineProps({probabilities:{type:Array,required:true},state:{type:Array,required:true},size:{default:280}})
const names=['North','South','West','East']
const rotations=[0,180,-90,90]
const labels=[[160,22],[160,274],[42,111],[278,111]]
</script>
<template>
<div class="policy-arrows" :style="{width:size+'px'}">
 <svg viewBox="0 0 320 310" role="img" :aria-label="`Action probabilities at state (${state.join(', ')}). Darker arrows indicate larger probabilities.`">
  <g v-for="(name,i) in names" :key="name">
   <path d="M149 123 L149 79 L133 79 L160 48 L187 79 L171 79 L171 123 Z" :transform="`rotate(${rotations[i]} 160 155)`" :fill="probabilityColor(probabilities[i])" stroke="#61778d" stroke-width="1" :data-arrow="name" :data-probability="probabilities[i]" />
   <text :x="labels[i][0]" :y="labels[i][1]" text-anchor="middle">{{name}}</text>
   <text :x="labels[i][0]" :y="labels[i][1]+23" text-anchor="middle" class="probability" :data-action="name">{{probabilities[i].toFixed(3)}}</text>
  </g>
  <circle cx="160" cy="155" r="30" fill="#fff3ea" stroke="#d94d00" stroke-width="2" />
  <text x="160" y="161" text-anchor="middle" class="state">{{state[0]}}, {{state[1]}}</text>
 </svg>
 <div class="color-key"><span>0</span><i></i><span>1</span></div>
 <p>Darker = higher probability</p>
</div>
</template>
<style scoped>
.policy-arrows{max-width:100%;margin:auto}.policy-arrows svg{width:100%;display:block}.policy-arrows text{fill:#13294b;font:18px Arial}.policy-arrows .probability{font-weight:700}.policy-arrows .state{font-size:17px}.color-key{display:flex;align-items:center;justify-content:center;gap:8px;font:15px Arial}.color-key i{display:block;width:95px;height:10px;background:linear-gradient(to right,#e4edf5,#173b64);border:1px solid #bdc8d4}.policy-arrows p{font:16px/1.3 Arial!important;text-align:center;margin:7px 0!important;color:#596779}
</style>
