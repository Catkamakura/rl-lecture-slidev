<template>
<svg class="bandit-diagram" viewBox="0 0 1120 280" role="img" aria-label="One decision state. The policy chooses A or B. Action A produces reward plus three with probability 0.75 or minus one with probability 0.25. Action B produces plus one with probability one. Every outcome ends the episode.">
 <defs><marker id="bandit-tip" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0 0L8 4L0 8Z" fill="#64788d" /></marker></defs>
 <g fill="none" stroke="#64788d" stroke-width="2.5" marker-end="url(#bandit-tip)"><path d="M140 139L296 73"/><path d="M140 155L296 220"/><path d="M360 72L593 45"/><path d="M360 72L593 126"/><path d="M360 220L593 220"/><path d="M827 45L984 134"/><path d="M827 126L984 143"/><path d="M827 220L984 162"/></g>
 <text x="174" y="22" class="caption">Policy chooses an action</text><text x="443" y="22" class="caption">Environment draws a reward</text>
 <circle cx="94" cy="146" r="43" fill="#fff3ea" stroke="#d94d00" stroke-width="3"/><text x="94" y="154" text-anchor="middle" class="node">s</text>
 <circle cx="328" cy="72" r="31" fill="#13294b"/><text x="328" y="81" text-anchor="middle" class="action">A</text><circle cx="328" cy="220" r="31" fill="#13294b"/><text x="328" y="229" text-anchor="middle" class="action">B</text>
 <text x="190" y="90">π(A)</text><text x="190" y="213">π(B)</text>
  <g v-for="(outcome,i) in [{y:45,r:'+3',p:'0.75'},{y:126,r:'−1',p:'0.25'},{y:220,r:'+1',p:'1.00'}]" :key="i"><text x="475" :y="outcome.y+13" text-anchor="middle" class="chance">{{outcome.p}}</text><rect x="600" :y="outcome.y-23" width="222" height="46" rx="5" fill="#eff3f7"/><text x="711" :y="outcome.y+8" text-anchor="middle" class="reward">Reward {{outcome.r}}</text></g>
 <rect x="992" y="113" width="118" height="69" rx="10" fill="#e7f2ef" stroke="#14796b" stroke-width="2"/><text x="1051" y="155" text-anchor="middle">End</text>
 <text x="94" y="211" text-anchor="middle" class="caption">Start state</text>
</svg>
</template>
<style scoped>.bandit-diagram{width:100%;height:245px;margin:10px 0}.bandit-diagram text{font:23px Arial;fill:#13294b}.bandit-diagram .caption{font-size:17px;fill:#596779}.bandit-diagram .node{font-size:31px;font-style:italic}.bandit-diagram .action{fill:#fff;font-size:27px;font-weight:700}.bandit-diagram .reward{font-weight:700}.bandit-diagram .chance{paint-order:stroke;stroke:white;stroke-width:7px;stroke-linejoin:round}</style>
