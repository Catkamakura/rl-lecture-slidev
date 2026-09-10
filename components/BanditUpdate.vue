<script setup>
import {ref, computed} from 'vue'
import {oneUpdate} from '../lib/teaching.mjs'
const outcome=ref(0)
const outcomes=[{action:'A',reward:3,label:'A, reward +3'},{action:'A',reward:-1,label:'A, reward −1'},{action:'B',reward:1,label:'B, reward +1'}]
const selected=computed(()=>outcomes[outcome.value])
const result=computed(()=>oneUpdate(0,selected.value.action,selected.value.reward))
</script>
<template>
<div class="bandit-update" @click.stop>
  <p>Each comparison starts at θ = 0, so p(A) = p(B) = 0.5. Learning rate α = 0.4.</p>
  <div class="outcome-controls"><button v-for="(item,i) in outcomes" :key="i" :class="{active:outcome===i}" @click="outcome=i">{{item.label}}</button></div>
  <div class="update-worked">
    <section class="calculation"><h3>Chosen example outcome</h3><p>Return <MathInline tex="G_0" /> = {{selected.reward}}</p><p>Log-probability derivative = {{result.score}}</p><p>Gradient estimate <MathInline tex="\hat g" /> = {{selected.reward}} × {{result.score}} = <strong class="sample-gradient">{{result.gradient.toFixed(1)}}</strong></p><p>New θ = 0 + 0.4 × {{result.gradient.toFixed(1)}} = {{result.nextTheta.toFixed(1)}}</p></section>
    <section class="before-after"><h3>Probability of action A</h3><div class="bar-row"><span>Before</span><div class="track"><div style="width:50%"></div></div><strong>0.500</strong></div><div class="bar-row"><span>After</span><div class="track"><div :style="{width:result.nextP*100+'%'}"></div></div><strong class="updated-probability">{{result.nextP.toFixed(3)}}</strong></div><p>{{outcome===0?'A becomes more likely after this positive reward.':outcome===1?'For A with reward −1, the update decreases p(A).':'This positive B reward makes B more likely, so A becomes less likely.'}}</p></section>
  </div>
  <p class="sample-caveat">Here J = 1 + p(A). The A/−1 and B/+1 updates decrease J.</p>
</div>
</template>
<style scoped>
.bandit-update>p{font:23px/1.4 Arial;margin:15px 0}.outcome-controls{display:flex;gap:15px;margin:22px 0 30px}.outcome-controls button{font:22px Arial;padding:12px 21px;background:white;border:1px solid #a7b5c6;color:#13294b;cursor:pointer}.outcome-controls .active{background:#13294b;color:white}.update-worked{display:grid;grid-template-columns:1.1fr 1fr;gap:45px}.update-worked h3{font:700 25px Arial;margin:5px 0 21px}.calculation p{font:23px/1.4 Arial;margin:19px 0}.calculation strong{color:#d94d00}.bar-row{display:grid;grid-template-columns:66px 1fr 63px;gap:12px;align-items:center;margin:23px 0;font:22px Arial}.track{height:34px;background:#eff3f7}.track div{height:34px;background:#d94d00}.before-after p{font:22px/1.4 Arial;margin-top:28px}.sample-caveat{border-top:1px solid #dce2e9;padding-top:17px;margin-top:27px!important;color:#596779}
</style>
