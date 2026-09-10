# Revision: policy visuals and a shorter bridge to PPO

Updated 2026-09-10 from source commit `64ee865`. Old page numbers below refer to the instructor's comments. The deck now has 49 main slides and 31 appendix slides.

| Previous page | Current page | Change |
|---|---|---|
| 15 | 15 | Removed the course-name mention from the student-facing episodic introduction. |
| 18 | 18 | Recalls the policy definition before discussing its representation. |
| 19 | 19 | Added a selectable tabular policy, shaded arrows, numeric probabilities, and independent row editing. |
| 23 | 23 | Shared-model output uses the same arrow display and retains the model calculations. |
| 26 | 26 | Removed the disconnected takeaway. |
| 27 | 27 | Added a decision/reward diagram; defines R1 for the bandit. |
| 29 | 29 | Labels J as expected return; states its limit as theta tends to infinity. |
| 35 | 35 | Uses a general episode-distribution statement for on-policy sampling. |
| 40, 42 | Removed | Removed the extra numerical episode update and backward-return slide. |
| 41 | 40 | Adds return decomposition and explains why past rewards can be omitted in expectation. |
| 43 | 41 | Uses the title Implement REINFORCE with a loss function. |
| 45–52 | 43–44 | Condensed to baseline idea and value/advantage definitions. No main-lecture baseline example or interaction. |
| 53–54 | 45–46 | Retains PPO motivation and local-data rationale. |
| 56 | 47 | Introduces the old/new action ratio before the objective. |
| 55 | 48 | Shows PPO-Clip math and defines the fixed advantage estimate. |
| 57 | 49 | Uses the two clipping plots after their formula. |
| 58–61 | Removed | Removed the extra main-lecture KL, loop, project, and review pages. |
| 62–92 | 50–80 | Retains optional derivations, including baseline, total expectation, IS, KL, and GAE. |

## Knowledge and examples

Slide 15 subsequently clarifies that T is the first terminal-state hitting time and may vary across episodes. Probability-one termination is an explicit assumption, not a guarantee provided by the existence of terminal states. For undiscounted step costs, finite expected T is required for finite expected return. The notes distinguish this from a preset horizon or rollout truncation.

The baseline section states the state-only baseline identity, qualified variance reduction, and the definitions of v, Q, and A. It does not claim that every baseline reduces variance or that any sampled update improves return. The appendix retains the proof and the action-dependence caveat. Sources: Sutton and Barto, Chapters 3 and 13; [Spinning Up](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html).

The PPO page uses the clipped actor surrogate in [Schulman et al. (2017)](https://arxiv.org/abs/1707.06347), Eq. 7. Hat-A estimates the collecting policy's advantage and stays fixed during optimization. The action ratio is introduced first. A Monte Carlo return minus a critic prediction is identified as one possible estimate; GAE remains in the appendix. Clipping does not impose a hard probability-ratio bound or guarantee a return increase.

The tabular rows, shared-model features/weights, and bandit reward probabilities are specified teaching examples. Their visuals follow those definitions. Manually changing a row or shared weight is not training.

## Verification

The numerical verification script checks the existing return, policy-score, baseline, importance-sampling, and PPO arithmetic. Browser checks covered all 80 renumbered slides, with focused rechecks after layout fixes. These covered equation rendering, section links, all 24 selectable tabular states, independent row edits, 12 shared-model state/parameter combinations, numeric/color agreement, and both PPO clipping directions. Source and presenter notes remain private; the public build omits notes.
