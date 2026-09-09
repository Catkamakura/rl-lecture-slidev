<script setup>
import { computed, ref } from 'vue'
const props = defineProps({ mode: {default:'plain'}, interactive:Boolean, size:{default:360}, near:Boolean, discount:{default:.9} })
const start = computed(()=>props.near ? [3,4] : [0,0])
const xy=ref([...start.value]), steps=ref(0), g=ref(0)
const finished=computed(()=>xy.value[0]===4 && xy.value[1]===4)
const routes={ short:[[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]], long:[[0,0],[0,1],[0,2],[0,1],[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4]], east:[[3,4],[4,4]], north:[[3,4],[3,3],[4,3],[4,4]] }
const route=computed(()=>routes[props.mode]||[])
function visited(x,y){return route.value.some(p=>p[0]===x && p[1]===y)}
function label(x,y){
 if(x===4 && y===4)return 'G'
 if(props.interactive && x===xy.value[0] && y===xy.value[1]) return '●'
 if(!props.interactive && x===start.value[0] && y===start.value[1]) return 'S'
 const i=route.value.findIndex(p=>p[0]===x && p[1]===y)
 if(i>=0 && i<route.value.length-1){const q=route.value[i+1]; return q[0]>x?'→':q[0]<x?'←':q[1]>y?'↓':'↑'}
 return ''
}
function move(dx,dy){if(finished.value)return;xy.value=[Math.max(0,Math.min(4,xy.value[0]+dx)),Math.max(0,Math.min(4,xy.value[1]+dy))];g.value-=props.discount**steps.value;steps.value++}
function reset(){xy.value=[...start.value];steps.value=0;g.value=0}
</script>
<template>
<div class="nav-figure" :style="{width: size+'px'}">
 <table class="nav-grid" aria-label="Five by five navigation grid. Start at the upper left and goal at the lower right.">
 <tbody><tr v-for="y in 5" :key="y"><td v-for="x in 5" :key="x" :class="{goal:x===5&&y===5,visited:visited(x-1,y-1),agent:interactive&&(x-1)===xy[0]&&(y-1)===xy[1]}" :style="{height:(size/5)+'px'}">{{label(x-1,y-1)}}</td></tr></tbody>
 </table>
 <div class="legend">S = start / current state &nbsp; · &nbsp; G = goal</div>
 <div v-if="interactive" class="demo-controls" @click.stop>
  <div class="nav-buttons"><button @click="move(0,-1)" :disabled="finished">↑</button><button @click="move(0,1)" :disabled="finished">↓</button><button @click="move(-1,0)" :disabled="finished">←</button><button @click="move(1,0)" :disabled="finished">→</button><button class="reset" @click="reset">Reset</button></div>
  <p aria-live="polite">{{ finished ? 'Goal reached' : 'Try a route' }} · {{steps}} {{steps===1?'move':'moves'}} · Total reward: {{g.toFixed(0)}}</p>
 </div>
</div>
</template>
<style scoped>
.nav-grid{width:100%;table-layout:fixed;border:2px solid #13294b;font-family:Arial,sans-serif;border-collapse:collapse}
.nav-grid td{padding:0 !important;width:20%;text-align:center !important;vertical-align:middle;border:1px solid #bdc8d4 !important;font-size:35px;line-height:1;background:#fff;color:#13294b}
.nav-grid .visited{background:#fff0e5;color:#c74300}
.nav-grid .goal{background:#14796b;color:white;font-size:31px;font-weight:bold}
.nav-grid .agent{background:#ffeadb;color:#d94d00}
.legend{font-size:16px;color:#596779;margin-top:9px}
.nav-buttons{display:flex;gap:7px;margin-top:13px}
button{border:1px solid #a7b5c6;background:white;color:#13294b;font:24px Arial;border-radius:3px;width:44px;height:37px;cursor:pointer}
button:hover{background:#fff0e5}button:disabled{opacity:.4}.reset{width:70px;font-size:16px}
.demo-controls p{font:18px Arial;margin:10px 0;color:#596779}
</style>
