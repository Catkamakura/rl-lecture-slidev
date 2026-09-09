<template>
<svg class="interaction-loop" viewBox="0 0 1100 260" role="img" aria-label="The agent sends an action to the environment. The environment returns a new state and reward to the agent.">
  <defs><marker id="interaction-action-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 1 L10 6 L0 11" fill="none" stroke="#d94d00" stroke-width="2" /></marker><marker id="interaction-feedback-arrow" markerWidth="12" markerHeight="12" refX="10" refY="6" orient="auto"><path d="M0 1 L10 6 L0 11" fill="none" stroke="#13294b" stroke-width="2" /></marker></defs>
  <rect x="80" y="65" width="255" height="135" rx="3" fill="#fff" stroke="#13294b" stroke-width="2" />
  <rect x="765" y="65" width="255" height="135" rx="3" fill="#fff" stroke="#13294b" stroke-width="2" />
  <text x="207" y="125" text-anchor="middle" class="entity">Agent</text>
  <text x="207" y="160" text-anchor="middle" class="description">chooses an action</text>
  <text x="892" y="125" text-anchor="middle" class="entity">Environment</text>
  <text x="892" y="160" text-anchor="middle" class="description">produces a response</text>
  <line x1="335" y1="91" x2="752" y2="91" stroke="#d94d00" stroke-width="3" marker-end="url(#interaction-action-arrow)" />
  <text x="550" y="66" text-anchor="middle" class="label action">Action</text>
  <line x1="765" y1="178" x2="348" y2="178" stroke="#13294b" stroke-width="3" marker-end="url(#interaction-feedback-arrow)" />
  <text x="550" y="217" text-anchor="middle" class="label">New state and reward</text>
</svg>
</template>
<style scoped>
.interaction-loop{display:block;width:100%;height:260px;margin:2px 0 20px}
text{font-family:Arial,sans-serif;fill:#13294b}.entity{font-size:32px;font-weight:700}.description{font-size:21px;fill:#596779}.label{font-size:25px}.action{fill:#d94d00}
</style>
