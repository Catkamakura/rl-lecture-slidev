# MDP section: definitions before examples

Updated 2026-09-10. The initial formulation follows [Nan Jiang’s CS443 MDP lecture](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf). Source slide numbers below are the numbers printed in that PDF.

## Formulation and notation

The initial model is **M = (S, A, P, R, γ)**: finite state/action sets, next-state distribution P, deterministic state–action reward R, and γ in [0,1). It runs indefinitely. The goal in the navigation illustration is absorbing and has reward zero.

The deck keeps zero-based time and Rₜ₊₁ for the reward following Aₜ. This changes indexing, not the definition. P and R retain CS443’s roles. The received reward Rₜ₊₁ and the reward function R(s,a) are explicitly distinguished.

The previous audit used a general joint response kernel in the opening definition. That is a valid alternative formulation, but unnecessary for CS443’s deterministic-reward starting point. **The tuple with P and deterministic R is already complete.** The joint kernel now appears only when extending the model and deriving trajectory probabilities.

## Teaching order and source basis

| Lecture slide | Knowledge introduced first | Illustration / application | CS443 source |
|---:|---|---|---|
| 3 | MDP definition and component types | None | 2–3 |
| 4 | Interaction and received-reward indexing | Agent/environment diagram | 2 |
| 5 | Deterministic, stochastic, stationary policies | None | 8 |
| 6 | Discounted return and expected-return objective | None | 2, 8 |
| 7 | Markov predictive sufficiency | No-action intuition | 21–22 |
| 8 | Apply the MDP definition | Navigation with absorbing goal, γ = .99 | 5 |
| 9 | Apply reward versus return | One-move and three-move continuations | 5, 8; direct calculation |
| 10 | Apply the expected-return objective from a fixed start | Show all four actions; the chosen policy assigns zero to South/West | 8; direct calculation |
| 11 | Apply the Markov condition | Two histories ending at the same cell | 5, 21; stipulated transitions |
| 12 | State must retain reward-relevant information | CS443 consumable-food counterexample | 21–22 |
| 13 | Boundedness of discounted return | Endless step-cost loop | 6–8; geometric-series derivation |
| 14 | Apply discount weights | Interactive evaluation of fixed routes | 6–8; direct calculation |
| 15 | Episodic formulation; undiscounted objective | Terminal navigation, G₀ = −T | 23–25 |
| 16 | Reward/horizon express task preferences | Goal-only versus per-move reward | 6, 23; direct comparison |

The two-route example applies the expected-return objective from slide 6 with start fixed at (3,4). All four actions remain available. The policy deliberately assigns probability zero to South and West at this state; zero probability does not remove an action from the MDP. It specifies a valid stationary policy: at (3,4), choose East with probability q or North with probability 1−q; after North, take East then South. There are no repeated nonterminal states on these routes. The manual slider calculates the policy’s expected return; it does not train it.

## Explicit changes of assumptions

- Slide 15 defines T as the first time a terminal state is reached, rather than a preset horizon. Complete-episode analysis assumes probability-one termination under the policies considered; the presence of terminal states alone does not imply it. With γ = 1 and reward −1 per move, finite expected episode length gives finite J = −E[T]. This equality is not used for the earlier discounted objective.
- Slide 26 introduces random rewards before specifying the bandit outcomes. In this extension, R(s,a) denotes the conditional mean reward and the reward distribution is separately specified.
- Slide 58 defines the joint response law p(s′,u | s,a). With deterministic rewards it reduces to P(s′ | s,a) times the indicator that u = R(s,a). This connects the general trajectory proof to the opening model.

## Checks

`node scripts/verify-lecture.mjs` checks all 25 states and four navigation actions, goal-entry cost, the absorbing zero-reward tail, discounted sums, and all 21 settings of the policy-return slider. At γ = .99 the one- and three-move returns are −1 and −2.9701; their equal-probability average is −1.98505.

Browser checks covered 25 affected or connected slides, with no detected math errors or footer overlaps. Interactive checks exercised boundary moves, goal entry, the absorbing tail, all 21 displayed policy-return values, discount endpoints, and section navigation. The public build omits presenter notes.

Examples illustrate definitions and consequences of specified rules. They do not supply empirical evidence for general claims about learning performance. The earlier [claim audit](CLAIM_AUDIT.md) remains a historical record; this document supersedes its MDP coverage and notation discussion.
