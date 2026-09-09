<script setup>
import {useNav} from '@slidev/client'
import {course} from '../lib/course-map.mjs'
defineProps({compact:Boolean,focus:String})
const {go}=useNav()
const sections=course.sections.filter(s=>!['map','appendix'].includes(s.id))
</script>
<template>
<div :class="['course-map',{compact}]" @click.stop>
  <button v-for="(s,i) in sections" :key="s.id" :class="{current:focus===s.id}" @click="go(s.start)" :aria-label="`Go to ${s.label} section`">
    <span class="map-number">{{String(i+1).padStart(2,'0')}}</span>
    <strong>{{compact?s.label:s.title}}</strong>
    <template v-if="!compact"><p>{{s.question}}</p><span class="map-example">{{s.example}}</span></template>
  </button>
</div>
</template>
<style scoped>
.course-map{display:grid;grid-template-columns:repeat(3,1fr);gap:23px;margin:25px 0 22px}.course-map button{text-align:left;border:1px solid #c3ced9;border-top:4px solid #d94d00;background:#f8fafc;color:#13294b;padding:17px 21px 19px;cursor:pointer;font:24px/1.3 Arial}.map-number{display:block;color:#d94d00;font:700 20px Arial;margin-bottom:8px}.course-map strong{font-size:25px}.course-map p{font-size:23px;margin:13px 0 16px}.map-example{display:block;font-size:19px;color:#596779;border-top:1px solid #dce2e9;padding-top:12px}.course-map button:hover{background:#fff3ea}.course-map button:focus-visible{outline:3px solid #d94d00}.course-map.compact{grid-template-columns:repeat(6,1fr);gap:9px;margin:15px 0 30px}.compact button{padding:12px 14px;border-top:3px solid #c3ced9;background:#fff}.compact strong{font-size:21px}.compact .map-number{font-size:16px;margin-bottom:4px;color:#667589}.compact button.current{background:#fff3ea;border-top-color:#d94d00}.compact .current .map-number{color:#d94d00}
.course-map:not(.compact) button{display:flex;flex-direction:column;align-items:flex-start;padding:14px 19px 15px}.course-map:not(.compact) strong{font-size:23px}.course-map:not(.compact) .map-number{font-size:18px;margin-bottom:6px}.course-map:not(.compact) p{font-size:22px;min-height:57px;margin:9px 0 10px}.course-map:not(.compact) .map-example{font-size:18px;line-height:1.25;width:100%;padding-top:10px;margin-top:auto}
</style>
