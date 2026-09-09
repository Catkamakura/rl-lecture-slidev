<script setup>
import {ref,computed} from 'vue'
const theta=ref(0)
const p=computed(()=>1/(1+Math.exp(-theta.value)))
const rows=computed(()=>[{name:'A',prob:p.value},{name:'B',prob:1-p.value}])
</script>
<template>
<div class="exploration-policy" @click.stop>
 <div class="explore-controls"><label>θ = <b data-exploration-theta>{{theta.toFixed(2)}}</b><input aria-label="Exploration policy theta" type="range" min="-4.6" max="4.6" step=".01" v-model.number="theta"></label><button @click="theta=0">Equal probabilities</button><button @click="theta=4.6">Favor A</button></div>
 <div class="explore-head"><span>Action</span><span>Probability</span><span>Expected count in 100 episodes</span></div>
 <div class="explore-row" v-for="r in rows" :key="r.name"><strong>{{r.name}}</strong><span :data-explore-prob="r.name">{{r.prob.toFixed(3)}}</span><div class="explore-count"><div class="explore-track"><i :style="{width:100*r.prob+'%'}"></i></div><b :data-explore-count="r.name">{{(100*r.prob).toFixed(1)}}</b></div></div>
 <p>Expected count = 100 × action probability. Actual sampled counts vary.</p>
</div>
</template>
<style scoped>
.exploration-policy{border-top:1px solid #dce2e9;border-bottom:1px solid #dce2e9;margin:22px 0;padding:14px 0 8px}.explore-controls{display:flex;align-items:center;gap:18px;margin-bottom:22px;font:22px Arial}.explore-controls label{display:flex;align-items:center;gap:12px}.explore-controls b{width:58px;color:#d94d00}.explore-controls input{width:240px;accent-color:#d94d00}.explore-controls button{font:19px Arial;color:#13294b;background:white;border:1px solid #a7b5c6;padding:8px 13px;cursor:pointer}.explore-head,.explore-row{display:grid;grid-template-columns:100px 160px 1fr;gap:28px;align-items:center}.explore-head{font:19px Arial;color:#596779;margin-bottom:13px}.explore-row{font:25px Arial;margin:12px 0}.explore-count{display:flex;align-items:center;gap:20px}.explore-count b{min-width:62px;font-size:23px}.explore-track{height:27px;background:#eff3f7;flex:1}.explore-track i{height:27px;display:block;background:#d94d00}.exploration-policy p{font:19px Arial;color:#596779;margin:18px 0 7px}
</style>
