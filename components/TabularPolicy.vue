<script setup>
import {ref,computed} from 'vue'
const x=ref(1),y=ref(2)
const initialRows=()=>Array.from({length:25},(_,i)=>i===24?null:i===11?[.1,.2,.1,.6]:[.25,.25,.25,.25])
const rows=ref(initialRows())
const index=computed(()=>y.value*5+x.value)
const current=computed(()=>rows.value[index.value])
function setRow(values){rows.value[index.value]=[...values]}
function reset(){rows.value=initialRows();x.value=1;y.value=2}
</script>
<template>
<div class="tabular-policy" @click.stop>
 <section>
  <h3>Choose a state</h3>
  <div class="table-grid"><template v-for="row in 5" :key="row"><button v-for="col in 5" :key="col" :aria-label="`Select state ${col-1}, ${row-1}`" :disabled="col===5&&row===5" :class="{selected:col-1===x&&row-1===y,goal:col===5&&row===5}" @click="x=col-1;y=row-1">{{col===5&&row===5?'G':col-1===x&&row-1===y?'●':''}}</button></template></div>
  <p>Selected state: ({{x}}, {{y}})</p>
 </section>
 <section class="arrows-panel"><h3>Its action distribution</h3><PolicyArrows :probabilities="current" :state="[x,y]" :size="270" /></section>
 <section class="row-panel">
  <h3>One stored row</h3>
  <table><thead><tr><th>Action</th><th>Probability</th></tr></thead><tbody><tr v-for="(name,i) in ['North','South','West','East']" :key="name"><td>{{name}}</td><td :data-row-action="name">{{current[i].toFixed(2)}}</td></tr></tbody></table>
  <div class="row-controls"><button @click="setRow([.25,.25,.25,.25])">Uniform row</button><button @click="setRow([.1,.2,.1,.6])">Favor East</button><button @click="reset">Reset table</button></div>
  <p>These buttons edit only this row.</p>
 </section>
</div>
</template>
<style scoped>
.tabular-policy{display:grid;grid-template-columns:270px 330px 1fr;gap:35px;align-items:start;margin-top:25px}.tabular-policy h3{font:700 23px Arial;margin:0 0 16px}.table-grid{display:grid;grid-template-columns:repeat(5,45px);gap:4px}.table-grid button{height:45px;width:45px;border:1px solid #b7c6d4;background:#fff;font:25px Arial;color:#d94d00;cursor:pointer}.table-grid .selected{background:#ffeadb;border:2px solid #d94d00}.table-grid .goal{background:#14796b;color:white}.tabular-policy p{font:19px/1.4 Arial;margin:14px 0}.row-panel table{font:20px Arial!important;margin-top:12px}.row-panel td,.row-panel th{padding:7px 10px!important}.row-controls{display:flex;flex-wrap:wrap;gap:8px;margin:15px 0 10px}.row-controls button{font:17px Arial;padding:7px 9px;background:white;color:#13294b;border:1px solid #a7b5c6;cursor:pointer}.arrows-panel h3{text-align:center}
</style>
