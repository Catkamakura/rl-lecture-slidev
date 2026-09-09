<script setup>
import {computed,ref} from 'vue'
const props=defineProps({adv:{default:1},initial:{default:1.5}})
const rho=ref(props.initial), eps=.2
const xmin=0,xmax=2,left=56,right=480,top=24,bottom=254
const ymin=computed(()=>props.adv>=0?0:2.05*props.adv)
const ymax=computed(()=>props.adv>=0?2.05*props.adv:0)
const x=v=>left+(right-left)*v/2
function y(value){
 const range=ymax.value-ymin.value
 const offset=value-ymin.value
 const normalized=offset/range
 const height=bottom-top
 return bottom-normalized*height
}
const clip=v=>Math.max(.8,Math.min(1.2,v))
const objective=v=>Math.min(v*props.adv,clip(v)*props.adv)
const path=(fn)=>Array.from({length:101},(_,i)=>`${i?'L':'M'}${x(i*.02)},${y(fn(i*.02))}`).join(' ')
const raw=computed(()=>path(v=>v*props.adv)),clipped=computed(()=>path(objective))
</script>
<template><div class="clip-chart">
<svg viewBox="0 0 515 310" role="img" :aria-label="adv>0?'Positive advantage: the clipped PPO objective becomes flat above ratio 1.2.':'Negative advantage: the clipped PPO objective becomes flat below ratio 0.8.'">
 <line :x1="left" :x2="right" :y1="bottom" :y2="bottom" stroke="#758397"/>
 <line :x1="left" :x2="left" :y1="top" :y2="bottom" stroke="#758397"/>
 <g v-for="v in [.5,.8,1,1.2,1.5,2]" :key="v"><line :x1="x(v)" :x2="x(v)" :y1="top" :y2="bottom" :stroke="v===.8||v===1.2?'#97a6b8':'#e7ecf1'" :stroke-dasharray="v===.8||v===1.2?'5 5':'0'"/><text :x="x(v)" y="279" text-anchor="middle">{{v}}</text></g>
 <path :d="raw" fill="none" stroke="#8390a3" stroke-width="3" stroke-dasharray="7 6"/>
 <path :d="clipped" fill="none" stroke="#d94d00" stroke-width="5"/>
 <circle :cx="x(rho)" :cy="y(objective(rho))" r="7" fill="#13294b"/>
 <text x="18" y="20">Lₜ</text><text x="482" y="305">ρₜ</text>
 <text :x="left-8" :y="y(0)+6" text-anchor="end">0</text>
</svg>
<div class="chart-legend"><span class="orange-line"></span> PPO clipped objective <span class="gray-line"></span> ρₜ Âₜ</div>
<label class="demo-controls" @click.stop>ρₜ = {{Number(rho).toFixed(2)}} <input aria-label="Policy probability ratio" type="range" min="0.05" max="2" step="0.01" v-model.number="rho"> Lₜ = {{objective(rho).toFixed(3)}}</label>
</div></template>
<style scoped>svg{width:100%;overflow:visible}svg text{font:17px Arial;fill:#596779}.chart-legend{display:flex;align-items:center;gap:9px;font-size:16px;white-space:nowrap}.orange-line,.gray-line{width:24px;height:3px;background:#d94d00;display:inline-block}.gray-line{background:#8390a3;margin-left:9px}label{display:flex;gap:12px;align-items:center;font-size:17px;margin-top:21px;color:#596779}input{width:145px;accent-color:#d94d00}</style>
