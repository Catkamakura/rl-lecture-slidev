<script setup>
import {computed} from 'vue'
import katex from 'katex'
const props=defineProps({tex:{type:String,required:true}})
const html=computed(()=>katex.renderToString(props.tex,{throwOnError:true,displayMode:false,output:'html'}))
</script>
<template><span class="math-inline" v-html="html" /></template>
<style scoped>.math-inline{display:inline}</style>
