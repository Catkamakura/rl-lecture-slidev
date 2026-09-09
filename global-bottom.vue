<script setup>
import {computed} from 'vue'
import {useNav} from '@slidev/client'
import {course} from './lib/course-map.mjs'
const {currentPage,go}=useNav()
const active=computed(()=>course.sections.find(s=>currentPage.value>=s.start&&currentPage.value<=s.end))
const progress=s=>currentPage.value>s.end?100:currentPage.value<s.start?0:100*(currentPage.value-s.start+1)/(s.end-s.start+1)
</script>
<template>
<nav class="course-nav" aria-label="Lecture sections" @click.stop @pointerdown.stop>
  <button v-for="s in course.sections" :key="s.id" :aria-current="active?.id===s.id?'location':undefined" :class="{active:active?.id===s.id,optional:s.id==='appendix'}" :title="`${s.title} · slides ${s.start}–${s.end}`" @click="go(s.id==='map'?course.pages.roadmap:s.start)">
    {{s.label}}<span class="nav-progress" :style="{width:progress(s)+'%'}"></span>
  </button>
  <span class="page-location">{{currentPage}} / {{course.total}}</span>
</nav>
</template>
<style scoped>
.course-nav{position:absolute;z-index:30;bottom:0;left:0;right:0;height:43px;display:flex;align-items:stretch;padding:0 34px 0 48px;gap:6px;background:#fff;border-top:1px solid #dce2e9;font:17px Arial,sans-serif;color:#596779}
.course-nav button{font:inherit;border:0;background:transparent;color:inherit;position:relative;padding:0 13px;cursor:pointer;min-width:76px;white-space:nowrap}
.course-nav button.active{color:#13294b;font-weight:700;background:#fff3ea}.course-nav button:hover{background:#eff3f7}.course-nav button:focus-visible{outline:2px solid #d94d00;outline-offset:-3px}.course-nav button.optional{margin-left:5px;border-left:1px solid #dce2e9}.nav-progress{position:absolute;bottom:0;left:0;height:3px;background:#a7b4c3}.active .nav-progress{background:#d94d00}.page-location{margin-left:auto;align-self:center;font-variant-numeric:tabular-nums;font-size:16px;white-space:nowrap;padding-left:12px}
@media print{.course-nav{display:none}}
</style>
