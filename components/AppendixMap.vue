<script setup>
import {useNav} from '@slidev/client'
import {course} from '../lib/course-map.mjs'
const {go}=useNav()
const groups=[['A.0','Expectation refresher','conditional_mean'],['A','One-action REINFORCE','proof_one_action'],['B','Trajectory gradients','proof_trajectory'],['C','Baselines and variance','proof_goal'],['D','Discounting and horizon','discounted_pg'],['E','Importance sampling','is_identity'],['F','PPO, KL, and GAE','ppo_formula'],['G','REINFORCE implementation','algorithm']]
</script>
<template><div class="appendix-map" @click.stop><button v-for="[label,title,key] in groups" :key="key" @click="go(course.pages[key])"><b>{{label}}</b><span>{{title}}</span><small>{{course.pages[key]}}</small></button></div></template>
<style scoped>
.appendix-map{display:grid;grid-template-columns:1fr 1fr;gap:18px 25px;margin:32px 0}.appendix-map button{display:flex;align-items:center;gap:20px;font:24px Arial;color:#13294b;background:#f8fafc;border:1px solid #c3ced9;text-align:left;padding:20px 21px;cursor:pointer}.appendix-map b{color:#d94d00;min-width:43px}.appendix-map small{margin-left:auto;font-size:18px;color:#596779}.appendix-map button:hover{background:#fff3ea}
</style>
