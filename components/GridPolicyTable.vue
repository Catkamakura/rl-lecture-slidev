<script setup>
import {computed,ref} from 'vue'
const selected=ref(0)
const rows=ref(Array.from({length:24},()=>[.25,.25,.25,.25]))
const groups=[Array.from({length:12},(_,i)=>i),Array.from({length:12},(_,i)=>i+12)]
const coordinate=i=>`(${i%5}, ${Math.floor(i/5)})`
const terminal=computed(()=>selected.value===24)
const changed=ref(new Set())
function loadPolicy(east){
 rows.value=Array.from({length:24},()=>east?[0,0,0,1]:[.25,.25,.25,.25])
 changed.value=new Set()
}
function editRow(){
 if(terminal.value)return
 rows.value[selected.value]=[0,0,0,1]
 changed.value.add(selected.value)
}
</script>

<template>
<div class="grid-policy-table" @click.stop>
 <div class="table-controls"><span>Load a complete table:</span><button @click="loadPolicy(false)">Uniform random</button><button @click="loadPolicy(true)">Always East</button><span class="stored-count">24 rows × 4 values = <b>96 stored probabilities</b></span></div>
 <div class="table-and-grid">
  <section class="grid-side">
   <h3>Click a state</h3>
   <div class="lookup-grid"><button v-for="i in 25" :key="i" :aria-label="`Locate state ${coordinate(i-1)}`" :aria-pressed="selected===i-1" :class="{selected:selected===i-1,goal:i===25,edited:changed.has(i-1)}" @click="selected=i-1">{{i===25?'G':selected===i-1?'●':''}}</button></div>
   <p data-selected-table-state><b>{{terminal?'Terminal G':`State ${coordinate(selected)}`}}</b></p>
   <button class="edit-row" :disabled="terminal" @click="editRow">Set this row to always East</button>
   <p class="grid-hint">{{terminal?'G has no action row.':'Other rows stay unchanged.'}}</p>
  </section>
  <table v-for="(group,k) in groups" :key="k" :aria-label="`Policy table, rows ${k*12+1} to ${k*12+12}`">
   <thead><tr><th>State s</th><th>N</th><th>S</th><th>W</th><th>E</th></tr></thead>
   <tbody><tr v-for="i in group" :key="i" :data-state-row="i" :class="{selected:selected===i,edited:changed.has(i)}" @click="selected=i"><th scope="row">{{coordinate(i)}}</th><td v-for="(p,a) in rows[i]" :key="a" :data-table-probability="a">{{p.toFixed(2)}}</td></tr></tbody>
  </table>
 </div>
</div>
</template>

<style scoped>
.grid-policy-table{margin:10px 0 0}.table-controls{display:flex;align-items:center;gap:12px;font:19px Arial;margin-bottom:15px}.table-controls button,.edit-row{padding:6px 10px;border:1px solid #a7b5c6;background:white;color:#13294b;font:18px Arial;cursor:pointer}.stored-count{margin-left:auto;font-size:19px}.table-and-grid{display:grid;grid-template-columns:245px 1fr 1fr;gap:25px;align-items:start}.grid-side h3{font:700 22px Arial;margin:0 0 10px}.lookup-grid{display:grid;grid-template-columns:repeat(5,37px);gap:4px}.lookup-grid button{height:37px;width:37px;border:1px solid #b7c6d4;background:white;font:24px Arial;color:#d94d00;cursor:pointer}.lookup-grid button.edited{border-color:#d94d00}.lookup-grid button.selected{background:#ffeadb;border:2px solid #d94d00}.lookup-grid button.goal{background:#14796b;color:white}.grid-side p{font:19px/1.25 Arial;margin:10px 0}.grid-side .grid-hint{font:17px/1.3 Arial;color:#596779;max-width:238px}.edit-row{font-size:16px;padding:6px 8px}.edit-row:disabled{opacity:.45;cursor:default}.table-and-grid table{font:19px/1.1 Arial;width:100%;font-variant-numeric:tabular-nums}.table-and-grid th,.table-and-grid td{padding:4px 8px!important;text-align:center;border-bottom:1px solid #dce2e9}.table-and-grid thead th{padding-top:7px!important;padding-bottom:7px!important;background:#eff3f7}.table-and-grid tbody th{background:white;font-weight:400}.table-and-grid tbody tr{cursor:pointer}.table-and-grid tbody .selected>*{background:#fff0e4;font-weight:700}.table-and-grid tbody .edited th{box-shadow:inset 3px 0 #d94d00}.table-caption{font:20px/1.25 Arial!important;margin:12px 0 0!important}.table-controls button:focus-visible,.lookup-grid button:focus-visible,.edit-row:focus-visible{outline:2px solid #d94d00;outline-offset:2px}
</style>
<style scoped>
.table-and-grid table{font:19px/1.05 Arial!important}.table-and-grid th,.table-and-grid td{padding:3px 8px!important;line-height:1.05!important}
</style>
