<script setup>
import {ref,computed} from 'vue'
const selected=ref(0),revealed=ref(false)
const questions=[
 {label:'Objective',q:'In our grid, why does maximizing expected return favor shorter routes?',a:'Each move earns −1 and γ = 1. An episode of T moves has G₀ = −T, so J(π) = −Eπ[T]. The objective counts all remaining moves, not just the next reward.'},
 {label:'Markov',q:'Does a Markov state let us ignore future rewards?',a:'No. It summarizes the information needed to predict future transitions, given the action. The action still changes later states and rewards. Prediction and the optimization objective are different questions.'},
 {label:'Policy',q:'What changes when θ changes? Why use shared weights?',a:'θ controls action probabilities. A shared model uses the same weights across states, so an update can change predictions at other states. This need not improve them. Those probabilities also determine which actions provide new training data.'},
 {label:'REINFORCE',q:'At θ = 0, A gives +3. With α = 0.4, what is the update?',a:'The log-probability derivative is 0.5. The sampled gradient is 3 × 0.5 = 1.5, so θnew = 0 + 0.4 × 1.5 = 0.6. The new probability of A is about 0.646.'},
 {label:'Variance',q:'What variance does the baseline reduce in our example?',a:'The variance of the sampled gradient (G₀ − b) ∇log π, not the reward variance. With b = 1.5 it drops from 0.9375 to 0.375. The mean gradient stays 0.25.'},
 {label:'PPO',q:'Why does PPO use a ratio and discourage large policy changes?',a:'The ratio reweights recorded actions relative to their collection policy. The surrogate still uses old states and estimates. Clipping or KL controls discourage excessive changes; PPO collects fresh data after several updates.'}
]
const question=computed(()=>questions[selected.value])
function select(i){selected.value=i;revealed.value=false}
</script>
<template>
<div class="concept-check" @click.stop>
 <div class="question-tabs" role="tablist" aria-label="Review questions"><button v-for="(q,i) in questions" :key="q.label" role="tab" :aria-selected="selected===i" @click="select(i)">{{q.label}}</button></div>
 <p class="review-question" data-review-question>{{question.q}}</p>
 <button class="reveal-answer" @click="revealed=!revealed" :aria-expanded="revealed">{{revealed?'Hide answer':'Reveal answer'}}</button>
 <div class="review-answer" aria-live="polite"><p v-if="revealed" data-review-answer>{{question.a}}</p><p v-else class="prompt">Discuss with a neighbor before revealing.</p></div>
</div>
</template>
<style scoped>
.question-tabs{display:flex;gap:12px;margin:26px 0 35px}.question-tabs button{font:22px Arial;padding:12px 17px;color:#13294b;background:#fff;border:1px solid #b7c5d3;cursor:pointer}.question-tabs [aria-selected=true]{background:#fff3ea;border-color:#d94d00;font-weight:700}.review-question{font:700 33px/1.4 Arial!important;min-height:102px;max-width:1080px}.reveal-answer{font:23px Arial;color:white;background:#13294b;border:0;padding:13px 24px;cursor:pointer;margin:12px 0 20px}.review-answer{min-height:168px;border-top:2px solid #dce2e9;padding:15px 0}.review-answer p{font:26px/1.48 Arial;margin:0}.review-answer .prompt{font-size:23px;color:#596779}
</style>
