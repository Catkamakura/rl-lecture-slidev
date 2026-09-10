# Revision: policy visuals and a shorter bridge to PPO

Updated 2026-09-10 from source commit `64ee865`. Old page numbers below refer to the instructor's comments. The deck now has 48 main slides and 31 appendix slides.

| Previous page | Current page | Change |
|---|---|---|
| 15 | 15 | Removed the course-name mention from the student-facing episodic introduction. |
| 18 | 17 | Recalls the policy definition before discussing its representation. |
| 19 | 18 | Two complete policies, Uniform random and Always East, with persistent policy selection, shaded probabilities, and rollout controls. |
| 23 | 22 | Shared-model output uses the same arrow display and retains the model calculations. |
| 26 | 25 | Removed the disconnected takeaway. |
| 27 | 26 | Added a decision/reward diagram; defines R1 for the bandit. |
| 29 | 28 | Labels J as expected return; states its limit as theta tends to infinity. |
| 35 | 34 | Uses a general episode-distribution statement for on-policy sampling. |
| 40, 42 | Removed | Removed the extra numerical episode update and backward-return slide. |
| 41 | 39 | Adds return decomposition and explains why past rewards can be omitted in expectation. |
| 43 | 40 | Uses the title Implement REINFORCE with a loss function. |
| 45–52 | 42–43 | Condensed to baseline idea and value/advantage definitions. No main-lecture baseline example or interaction. |
| 53–54 | 44–45 | Retains PPO motivation and local-data rationale. |
| 56 | 46 | Introduces the old/new action ratio before the objective. |
| 55 | 47 | Shows PPO-Clip math and defines the fixed advantage estimate. |
| 57 | 48 | Uses the two clipping plots after their formula. |
| 58–61 | Removed | Removed the extra main-lecture KL, loop, project, and review pages. |
| 62–92 | 49–79 | Retains optional derivations, including baseline, total expectation, IS, KL, and GAE. |

Previous page 17 (From an MDP to a reinforcement-learning problem) was subsequently deleted. The current-page column above and navigation links reflect the deletion. The deck has 79 slides in total.

## Knowledge and examples

Slide 15 clarifies that T is the first terminal-state hitting time and may vary across episodes. Probability-one termination is an explicit assumption, not a guarantee provided by the existence of terminal states. For undiscounted step costs, finite expected T is required for finite expected return. The notes distinguish this from a preset horizon or rollout truncation.

The baseline section states the state-only baseline identity, qualified variance reduction, and the definitions of v, Q, and A. It does not claim that every baseline reduces variance or that any sampled update improves return. The appendix retains the proof and the action-dependence caveat. Sources: Sutton and Barto, Chapters 3 and 13; [Spinning Up](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html).

The PPO page uses the clipped actor surrogate in [Schulman et al. (2017)](https://arxiv.org/abs/1707.06347), Eq. 7. Hat-A estimates the collecting policy's advantage and stays fixed during optimization. The action ratio is introduced first. A Monte Carlo return minus a critic prediction is identified as one possible estimate; GAE remains in the appendix. Clipping does not impose a hard probability-ratio bound or guarantee a return increase.

The complete example policies, shared-model features/weights, and bandit reward probabilities are specified teaching examples. Their visuals follow those definitions. Choosing a policy or moving a shared weight is not training. The policy demo now preserves the chosen policy across grid selections and restarts; each nonterminal state displays that policy's probabilities. One-action and ten-action controls execute the selected policy using the grid's existing transition and reward rules.

## Verification

The replacement policy demo was checked with both policies at all 24 nonterminal states. Checks cover policy persistence across cell changes and restarts, deterministic East movement and boundary self-loops, termination stopping a multi-action run, and all four random-action branches using controlled RNG inputs. These are implementation checks, not estimates of policy performance.

The numerical verification script checks the existing return, policy-score, baseline, importance-sampling, and PPO arithmetic. Before the single-page deletion, browser checks covered all 80 slides, with focused rechecks after layout fixes. These covered equation rendering, section links, all 24 selectable tabular states, independent row edits, 12 shared-model state/parameter combinations, numeric/color agreement, and both PPO clipping directions. Source and presenter notes remain private; the public build omits notes.


## Grid policy table and function approximation (current slides 19–20)

Slide 20 now displays every nonterminal row of the 5×5 grid policy. Grid selection highlights the matching row. A manual edit changes only that row; loading Uniform random or Always East intentionally replaces the complete table. The closing diagram introduces a shared model before its concrete equations on slide 21.

Slide 19 compares the original grid, a finer grid, and continuous positions. The storage counts are exact for four stored probabilities per nonterminal row and one terminal cell. No finite table enumerates a continuous state space. This is not a claim that all continuous-state policies require approximation error or neural networks: simple exact rules are possible. Discretization and shared models are practical representation choices. Approximation concerns the chosen policy family, not necessarily inaccurate state measurements.

Sources: [CS443 function approximation, PDF pp.2,5](https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf) for scaling and parameter sharing; [Sutton et al. (1999), PDF pp.1–2](https://proceedings.neurips.cc/paper_files/paper/1999/file/464d828b85b0bed98e80ade0a5c43b0f-Paper.pdf) for directly parameterized policies. These figures and manual edits illustrate representation; they do not establish better training or guaranteed generalization.

Verification: the browser check counted all 24 rows and 96 probability entries, matched every nonterminal grid cell to its row, confirmed that one-row edits persist after changing selection, and checked both complete-table loads. It also verified that G has no selected action row and disables row editing. Rendered slides 19–22 had no equation errors or content overlapping the navigation bar. The public build continues to exclude notes.


## Page 10: available actions versus the chosen policy

The original example assigned q and 1-q to East and North without explicitly listing the zero probabilities on South and West. All four actions remain available in the grid. The revised slide shows the four next states and full probability vector [1-q,0,0,q], alongside shaded probability arrows. South is a valid boundary action that leaves (3,4) unchanged; West goes to (2,4). The two-path expectation applies only to this chosen policy and its fixed East/South continuation, not to an arbitrary stochastic policy.

The return arithmetic is unchanged: -1 and -2.9701 at gamma=.99, averaging to -1.98505 at q=.5. The page now explicitly fixes the starting state and uses the previously introduced J objective, leaving state-value terminology to the later value/advantage section. Source: [CS443 MDPs, printed slides 5 and 8](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf), plus direct calculation under the stipulated policy.

Verification checked all four next states and all 21 slider settings, including q=0 and q=1. Table probabilities, arrow probabilities, and the expected-return calculation agree. Slides 9–11 render without equation errors or overlap with the navigation bar. The public payload omits presenter notes.
