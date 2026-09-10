# Lecture claim audit

**Historical snapshot.** The subsequent [MDP revision](MDP_SOURCE_MAP.md) follows CS443’s deterministic-reward definition and supersedes this document’s MDP coverage and joint-kernel opening. The prior correction record below is retained for traceability.

Audited on 2026-09-10 against source commit `f1373507c422951db08a47ea9a9c3b5b29512426`.

Scope: all 92 current slides, presenter notes, interactive component text and calculations, and the instructor guide. This audits the delivered version, not every historical draft. The records below separate false implications, missing assumptions, terminology, and labeling; **the edit count is not a count of hallucinated facts**.

## Claims withdrawn or narrowed

| Location | Previous claim or implication | What the evidence supports |
|---|---|---|
| 34, 45 | Repeated sampled updates learn a better policy; REINFORCE “works on average.” | Under stated assumptions the gradient estimator is unbiased. This is not a guarantee that a finite update improves expected return. |
| 20–23 | Unmeasured data coverage; successful transfer through shared weights; a manual slider could read as learning. | Independent rows and parameter sharing are structural facts. The feature model is hand-designed and the slider does no training. |
| 25, 29 | There exists an optimizing finite parameter θ*. | In this example J = 1 + sigmoid(θ) approaches 2 but never reaches it for finite θ. |
| 43–44 | Any optimizer step equals θ + α ĝ. | This exact step is plain SGD without momentum. Other optimizers can use different transformations. |
| 49 | “Seven decimal places suffice” for exact variance terms. | Some slider positions require nine decimal places for terms and six for their total. The early rounding was corrected. |
| 49–50 | Lower variance presented as a claim about successful learning. | The stated independent-batch calculation gives lower mean squared gradient error at fixed θ. It does not prove faster learning or higher final return. |
| 52 | A fitted critic learns the true expected return. | The predictor is trained toward that target and may have error. The Monte Carlo baseline and the PPO critic are now distinguished. |
| 54, 57 | Limited “progress”; a larger clipped score means a “better proposed change.” | The score is a surrogate. Neither a return increase nor a hard trust-region bound follows from clipping. |
| 60 | Adding a baseline or trying PPO is an “Improve” stage. | These are comparisons whose outcomes must be measured. |
| 3, 9, 16, 51, 64, 66, 70, 73, 77, 84, 90 | Conditions appeared only in notes, or were incomplete. | The necessary joint reward law, expectation, sampling, baseline, support, and variance conditions are now visible. |
| 10, 27, 32–34, 36, 38, 40, 83 | Constructed examples, expectations, and sampled runs were not always clearly distinguished. | Authored examples are labeled; rounded values use approximation; seed and sample procedure are disclosed. |
| 87–88 | KL objectives omitted matching normalization or the distribution being compared. | The sampled terms use matching averages; the reference objective specifies prompt-conditioned output distributions. |

The precise previous text, replacement, and reason for every recorded substantive edit follow below. Definitions such as “policy,” mathematical identities, and reproducible arithmetic remain. They are not experimental evidence of algorithm performance.

## Verification basis

The audit read the primary papers and CS443 materials listed below. The supplied original PDF confirmed its authors/presenters and CC BY-NC-SA 4.0 attribution. The Sutton–Barto website was unavailable during this audit, so no new finding relies solely on retrieving that book; its existing further-reading credit remains.

`node scripts/verify-lecture.mjs` independently enumerates the finite outcomes and checks the displayed arithmetic, derivatives, baseline moments, importance weights, trajectory identities, geometric bounds, KL values, and clipping formula. These checks corroborate the examples. The general identities also require the displayed mathematical assumptions and derivations.

The seed-443 run is reproducible: 40 batches × 64 new one-action episodes, α = 0.4, p(A) ≈ 0.9316579033. This is evidence about that implementation and seed only. Duplicating one gradient sample leaves its variance unchanged; averaging independent samples has the stated 1/N variance reduction.

## Sources consulted


- **MDP:** [Nan Jiang, CS443 MDPs, PDF pp. 2–7, 19–22](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf)
- **FA:** [Nan Jiang, CS443 Function Approximation, PDF pp. 2–5](https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf)
- **PG:** [Nan Jiang, CS443 Policy Gradients, PDF pp. 2–10, 12–16](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf)
- **Williams:** [Williams (1992), REINFORCE](https://link.springer.com/article/10.1007/BF00992696)
- **Loss:** [Spinning Up, policy optimization and the loss-function distinction](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html)
- **Probability:** [ProbabilityCourse, total expectation](https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php)
- **Variance:** [Greensmith, Bartlett, Baxter (2004), variance reduction](https://jmlr.org/papers/v5/greensmith04a.html)
- **TRPO:** [Schulman et al. (2015), TRPO, Sections 2–4](https://arxiv.org/pdf/1502.05477)
- **PPO:** [Schulman et al. (2017), PPO, Sections 2–5 and Algorithm 1](https://arxiv.org/pdf/1707.06347)
- **GAE:** [Schulman et al., GAE, Section 3](https://arxiv.org/pdf/1506.02438)
- **RLHF:** [Ouyang et al. (2022), Section 3.5, Equation 2](https://arxiv.org/pdf/2203.02155)

## Coverage of every slide

| Slide | Subject | Kind of claim | Basis retained after revision |
|---:|---|---|---|
| 1 | Reinforcement learning | Teaching structure | Course sequence, transitions, or suggested workflow. No asserted outcome.  |
| 2 | Our route: from an RL task to a learning algorithm | Teaching structure | Course sequence, transitions, or suggested workflow. No asserted outcome.  |
| 3 | Formal problem: a Markov decision process | Definition | MDP, feedback, policy, objective, or predictive sufficiency. Joint response law and assumptions explicit. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 4 | The navigation MDP | Constructed example + exact calculation | Stipulated grid rules and route comparisons; G₀ = −T when γ = 1. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 5 | Interaction generates states, actions, and rewards | Definition | MDP, feedback, policy, objective, or predictive sufficiency. Joint response law and assumptions explicit. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 6 | What makes this reinforcement learning? | Definition | MDP, feedback, policy, objective, or predictive sufficiency. Joint response law and assumptions explicit. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 7 | Transition and reward functions in this grid | Definition | MDP, feedback, policy, objective, or predictive sufficiency. Joint response law and assumptions explicit. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 8 | A policy specifies how the agent acts | Definition | MDP, feedback, policy, objective, or predictive sufficiency. Joint response law and assumptions explicit. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 9 | The objective: maximize expected return | Definition | MDP, feedback, policy, objective, or predictive sufficiency. Joint response law and assumptions explicit. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 10 | For navigation, this means minimizing expected moves | Constructed example + exact calculation | Stipulated grid rules and route comparisons; G₀ = −T when γ = 1. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 11 | The Markov property | Definition | MDP, feedback, policy, objective, or predictive sufficiency. Joint response law and assumptions explicit. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 12 | The MDP assumption, applied to navigation | Definition | MDP, feedback, policy, objective, or predictive sufficiency. Joint response law and assumptions explicit. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 13 | Choosing a state: what information must it contain? | Definition | MDP, feedback, policy, objective, or predictive sufficiency. Joint response law and assumptions explicit. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 14 | Same immediate reward, different future returns | Constructed example + exact calculation | Stipulated grid rules and route comparisons; G₀ = −T when γ = 1. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 15 | The reward function must express the task goal | Constructed example + exact calculation | Stipulated grid rules and route comparisons; G₀ = −T when γ = 1. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 16 | Why introduce a discount factor? | Exact calculation | Geometric sums for the stipulated costs; boundedness conditions stated. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 17 | How discounting scores the same navigation routes | Exact calculation | Geometric sums for the stipulated costs; boundedness conditions stated. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf) |
| 18 | We have a task. What can the optimizer change? | Teaching structure | Course sequence, transitions, or suggested workflow. No asserted outcome.  |
| 19 | Start with a table: one policy row per state | Representation + calculation | Independent table rows versus shared parameters; illustrative storage count. No performance guarantee. [FA](https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf) |
| 20 | Why does a larger state space need more than a table? | Representation + calculation | Independent table rows versus shared parameters; illustrative storage count. No performance guarantee. [FA](https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf) |
| 21 | Function approximation: parameters shared across states | Representation + calculation | Independent table rows versus shared parameters; illustrative storage count. No performance guarantee. [FA](https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf) |
| 22 | Specify the model before moving its parameter | Specified model + calculation | Hand-designed features, logits, softmax, and manual parameter changes.  |
| 23 | Watch the same model compute its probabilities | Specified model + calculation | Hand-designed features, logits, softmax, and manual parameter changes.  |
| 24 | Where do policy gradients fit in RL? | Conceptual organization | Conceptual routes through model, value, and policy learning; routes overlap. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf) |
| 25 | Policy gradients: objective, estimator, and update | Identity / algorithm | On-policy gradient estimation, score derivatives, update procedure; no monotonic-return claim. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Williams](https://link.springer.com/article/10.1007/BF00992696) |
| 26 | Episodic REINFORCE: the algorithm | Identity / algorithm | On-policy gradient estimation, score derivatives, update procedure; no monotonic-return claim. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Williams](https://link.springer.com/article/10.1007/BF00992696) |
| 27 | A one-decision MDP makes the update easier to see | Constructed example + calculation | Specified bandit distribution and sigmoid model; exact or rounded arithmetic.  |
| 28 | The policy controls both actions and data collection | Constructed example + calculation | Specified bandit distribution and sigmoid model; exact or rounded arithmetic.  |
| 29 | The known reward rules let us check the objective | Constructed example + calculation | Specified bandit distribution and sigmoid model; exact or rounded arithmetic.  |
| 30 | The one-action REINFORCE update | Identity / algorithm | On-policy gradient estimation, score derivatives, update procedure; no monotonic-return claim. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Williams](https://link.springer.com/article/10.1007/BF00992696) |
| 31 | The two derivatives needed for our update | Identity / algorithm | On-policy gradient estimation, score derivatives, update procedure; no monotonic-return claim. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Williams](https://link.springer.com/article/10.1007/BF00992696) |
| 32 | One sample, one parameter update | Constructed example + calculation | Specified bandit distribution and sigmoid model; exact or rounded arithmetic.  |
| 33 | A batch averages the gradient contributions | Constructed example + calculation | Specified bandit distribution and sigmoid model; exact or rounded arithmetic.  |
| 34 | REINFORCE demo: updates from fresh batches | Reproduced demonstration | Fresh batches computed by bandit.mjs; seed 443 disclosed. One run is not general evidence.  |
| 35 | Why basic REINFORCE collects a new batch | Identity / algorithm | On-policy gradient estimation, score derivatives, update procedure; no monotonic-return claim. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Williams](https://link.springer.com/article/10.1007/BF00992696) |
| 36 | Old action frequencies can reverse the gradient | Constructed example + calculation | Specified bandit distribution and sigmoid model; exact or rounded arithmetic.  |
| 37 | The same gradient idea extends to an episode | Teaching structure | Course sequence, transitions, or suggested workflow. No asserted outcome.  |
| 38 | From one decision to a sequence of decisions | Constructed example + calculation | Authored two-action trace and a stipulated shared sigmoid policy. Not measured rollout data.  |
| 39 | The complete-episode REINFORCE estimator | Identity / algorithm | Trajectory estimator, causality, return-to-go, and backward recursion at γ = 1. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Loss](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html) |
| 40 | The two-action episode gives a numerical update | Constructed example + calculation | Authored two-action trace and a stipulated shared sigmoid policy. Not measured rollout data.  |
| 41 | REINFORCE with return-to-go | Identity / algorithm | Trajectory estimator, causality, return-to-go, and backward recursion at γ = 1. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Loss](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html) |
| 42 | The return weights are computed after the episode | Identity / algorithm | Trajectory estimator, causality, return-to-go, and backward recursion at γ = 1. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Loss](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html) |
| 43 | A negative weighted log loss implements gradient ascent | Algebra / pseudocode | Negative weighted-log gradient; plain SGD implements the stated parameter step. [Loss](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html) |
| 44 | The code follows the return calculation and update | Algebra / pseudocode | Negative weighted-log gradient; plain SGD implements the stated parameter step. [Loss](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html) |
| 45 | Unbiased gradients and noisy updates | Teaching structure | Course sequence, transitions, or suggested workflow. No asserted outcome.  |
| 46 | Recall the bandit and its gradient estimator | Exact calculation | Three finite outcomes; baseline means, variances and fixed-policy batch MSE.  |
| 47 | Using expected return as the baseline | Exact calculation | Three finite outcomes; baseline means, variances and fixed-policy batch MSE.  |
| 48 | Variance: how far do estimates spread around their mean? | Exact calculation | Three finite outcomes; baseline means, variances and fixed-policy batch MSE.  |
| 49 | Calculate the variance as we change the baseline | Exact calculation | Three finite outcomes; baseline means, variances and fixed-policy batch MSE.  |
| 50 | Independent batches: variance and estimation error | Exact calculation | Three finite outcomes; baseline means, variances and fixed-policy batch MSE.  |
| 51 | Subtract a baseline without changing the mean gradient | Identity / definition | Fixed action-independent baseline and a fitted value predictor; accuracy not assumed. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [FA](https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf) |
| 52 | A learned value function provides a baseline | Identity / definition | Fixed action-independent baseline and a fitted value predictor; accuracy not assumed. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [FA](https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf) |
| 53 | From REINFORCE to PPO: reuse a batch carefully | Teaching structure | Course sequence, transitions, or suggested workflow. No asserted outcome.  |
| 54 | Why trust a recent batch only near its collecting policy? | Definitions / specified algorithm | Old-policy surrogate, advantages, action ratios, clipping, KL alternatives, and the paper’s actor–critic algorithm. [TRPO](https://arxiv.org/pdf/1502.05477); [PPO](https://arxiv.org/pdf/1707.06347) |
| 55 | PPO weights actions by estimated advantage | Definitions / specified algorithm | Old-policy surrogate, advantages, action ratios, clipping, KL alternatives, and the paper’s actor–critic algorithm. [TRPO](https://arxiv.org/pdf/1502.05477); [PPO](https://arxiv.org/pdf/1707.06347) |
| 56 | The PPO ratio reweights actions from the old policy | Definitions / specified algorithm | Old-policy surrogate, advantages, action ratios, clipping, KL alternatives, and the paper’s actor–critic algorithm. [TRPO](https://arxiv.org/pdf/1502.05477); [PPO](https://arxiv.org/pdf/1707.06347) |
| 57 | PPO clipping discourages excessive changes | Definitions / specified algorithm | Old-policy surrogate, advantages, action ratios, clipping, KL alternatives, and the paper’s actor–critic algorithm. [TRPO](https://arxiv.org/pdf/1502.05477); [PPO](https://arxiv.org/pdf/1707.06347) |
| 58 | KL divergence offers another way to limit policy change | Definitions / specified algorithm | Old-policy surrogate, advantages, action ratios, clipping, KL alternatives, and the paper’s actor–critic algorithm. [TRPO](https://arxiv.org/pdf/1502.05477); [PPO](https://arxiv.org/pdf/1707.06347) |
| 59 | PPO retains the interaction-and-update loop | Definitions / specified algorithm | Old-policy surrogate, advantages, action ratios, clipping, KL alternatives, and the paper’s actor–critic algorithm. [TRPO](https://arxiv.org/pdf/1502.05477); [PPO](https://arxiv.org/pdf/1707.06347) |
| 60 | Suggested project workflow | Teaching structure | Course sequence, transitions, or suggested workflow. No asserted outcome.  |
| 61 | Check the full argument | Review | Answers restate earlier definitions and checked calculations. [MDP](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf); [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [PPO](https://arxiv.org/pdf/1707.06347) |
| 62 | Optional proofs and implementation reference | Teaching structure | Course sequence, transitions, or suggested workflow. No asserted outcome.  |
| 63 | A.0 Conditional expectation: average within a group | Identity + proof | Discrete conditional means, total expectation, and taking out a known factor. [Probability](https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php) |
| 64 | A.0 The law of total expectation | Identity + proof | Discrete conditional means, total expectation, and taking out a known factor. [Probability](https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php) |
| 65 | A.0 Why the group averages give the overall mean | Identity + proof | Discrete conditional means, total expectation, and taking out a known factor. [Probability](https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php) |
| 66 | A. REINFORCE for one decision | Proof | Finite-action score-function identity and conditional-mean substitution. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Williams](https://link.springer.com/article/10.1007/BF00992696); [Probability](https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php) |
| 67 | A. Replace the mean reward with a sampled reward | Proof | Finite-action score-function identity and conditional-mean substitution. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Williams](https://link.springer.com/article/10.1007/BF00992696); [Probability](https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php) |
| 68 | A. Derivatives for the two-action policy | Exact calculation | Sigmoid derivatives and enumeration of expected gradient 0.25.  |
| 69 | A. Numerical check of the expected gradient | Exact calculation | Sigmoid derivatives and enumeration of expected gradient 0.25.  |
| 70 | B. The same argument applies to trajectories | Proof | Joint trajectory factorization and likelihood-ratio derivation under stated regularity conditions. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf) |
| 71 | B. Factoring the trajectory probability | Proof | Joint trajectory factorization and likelihood-ratio derivation under stated regularity conditions. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf) |
| 72 | B. Only policy factors contribute direct derivatives | Proof | Joint trajectory factorization and likelihood-ratio derivation under stated regularity conditions. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf) |
| 73 | C. What we need to show | Proof | Zero-mean score and cancellation of a baseline fixed before sampling. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf) |
| 74 | C. The expected score is zero | Proof | Zero-mean score and cancellation of a baseline fixed before sampling. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf) |
| 75 | C. Subtracting b leaves the mean unchanged | Proof | Zero-mean score and cancellation of a baseline fixed before sampling. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf) |
| 76 | C. The bandit verifies the cancellation | Exact calculation | Numeric cancellation and counterexample to uncorrected action-dependent subtraction.  |
| 77 | C. The baseline changes gradient variance, not reward variance | Direct derivation | Derivative of one fixed-state contribution’s second moment. Scope and positive denominator stated. [Variance](https://jmlr.org/papers/v5/greensmith04a.html) |
| 78 | C. An action-dependent baseline can remove the true signal | Exact calculation | Numeric cancellation and counterexample to uncorrected action-dependent subtraction.  |
| 79 | C. Why return-to-go preserves the expected gradient | Proof | Conditional cancellation of past rewards and the outer γᵗ in the start-state discounted gradient. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf) |
| 80 | D. Discounted return-to-go needs a time weight | Proof | Conditional cancellation of past rewards and the outer γᵗ in the start-state discounted gradient. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf) |
| 81 | D. Discounting and effective horizon | Direct derivation | Geometric tail bound and exact discount-weight sum. Horizon interpretation separated from equality.  |
| 82 | E. Importance sampling changes which distribution we average over | Proof + calculation | Importance identity, exact one-step enumeration, and product of trajectory likelihood ratios. [TRPO](https://arxiv.org/pdf/1502.05477) |
| 83 | E. Reweighting fixes the bandit gradient | Proof + calculation | Importance identity, exact one-step enumeration, and product of trajectory likelihood ratios. [TRPO](https://arxiv.org/pdf/1502.05477) |
| 84 | E. Correcting a whole trajectory needs a product of ratios | Proof + calculation | Importance identity, exact one-step enumeration, and product of trajectory likelihood ratios. [TRPO](https://arxiv.org/pdf/1502.05477) |
| 85 | E. PPO reweights actions while retaining old state samples | Proof / specified objective | Local surrogate gradient, clipped objective, and consistently normalized sampled KL problems. [TRPO](https://arxiv.org/pdf/1502.05477); [PPO](https://arxiv.org/pdf/1707.06347) |
| 86 | F. The PPO-Clip objective | Proof / specified objective | Local surrogate gradient, clipped objective, and consistently normalized sampled KL problems. [TRPO](https://arxiv.org/pdf/1502.05477); [PPO](https://arxiv.org/pdf/1707.06347) |
| 87 | F. KL constraints and KL penalties | Proof / specified objective | Local surrogate gradient, clipped objective, and consistently normalized sampled KL problems. [TRPO](https://arxiv.org/pdf/1502.05477); [PPO](https://arxiv.org/pdf/1707.06347) |
| 88 | F. A reference-policy penalty serves a different purpose | Specified objective | Prompt-conditioned reward minus fixed-reference output-distribution KL; auxiliary pretraining term omitted. [RLHF](https://arxiv.org/pdf/2203.02155) |
| 89 | F. How a critic can estimate advantages | Specified estimator | TD residuals, truncated GAE, terminal and cutoff handling. [GAE](https://arxiv.org/pdf/1506.02438); [PPO](https://arxiv.org/pdf/1707.06347) |
| 90 | G. Complete episodic REINFORCE | Algorithm | Complete-episode batch REINFORCE at γ = 1 with fixed collection parameters. [PG](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf); [Williams](https://link.springer.com/article/10.1007/BF00992696) |
| 91 | Notation reference | Notation | Symbols agree with the preceding definitions.  |
| 92 | Sources and acknowledgments | Attribution | External references; original names and license checked against supplied PDF pp. 1–2.  |

## Complete slide correction register

75 edits across 47 slides. Several edits repair wording or assumptions rather than false equations.

### 1. Slide 3: Incomplete definition

**Previous**

```text
\mathcal M=(\mathcal S,\mathcal A,p,r,\gamma).
```

**Revised**

```text
\mathcal M=(\mathcal S,\mathcal A,p,\gamma).
```

**Reason:** Next-state probabilities and a mean reward alone do not specify the joint random response law. Use the joint kernel consistently with the trajectory appendix.

**Basis:** MDP, PDF pp. 2–3.

### 2. Slide 3: Incomplete definition

**Previous**

```text
| $p(s'\mid s,a)$ | Probability of the next state | Move to a neighbor, or stay at a wall |
| $r(s,a)$ | Expected reward for one action | $-1$ for each move before termination |
```

**Revised**

```text
| $p(s',u\mid s,a)$ | Joint probability of next state $s'$ and reward $u$ | Neighbor or boundary stay, reward $-1$ |
| $r(s,a)$, derived from $p$ | Expected immediate reward | $-1$ at nonterminal states |
```

**Reason:** The reward mean remains available, but is a derived quantity.

**Basis:** MDP, PDF pp. 2–3.

### 3. Slide 3: Missing assumption

**Previous**

```text
We also specify the starting state or distribution $S_0\sim\mu$, and when the episode ends.
```

**Revised**

```text
Also specify $S_0\sim\mu$ and termination. If a deadline affects the task, include time in the state.
```

**Reason:** Finite-horizon values may depend on remaining time; state-only notation requires this convention.

**Basis:** MDP definition / finite-horizon state augmentation.

### 4. Slide 7: Qualification

**Previous**

```text
The transition function tells us **where the action leads**:
```

**Revised**

```text
The next-state marginal of the joint response law is:
```

**Reason:** Connect the marginal notation to the complete MDP definition.

**Basis:** Direct calculation / stated assumptions.

### 5. Slide 9: Missing assumption

**Previous**

```text
The expectation averages over the initial state, the policy's action choices, and the environment's randomness.
```

**Revised**

```text
The expectation includes the initial state, actions, transitions, and rewards. Assume $\mathbb E[|G_0|]<\infty$ for policies under comparison.
```

**Reason:** A finite expectation was previously only assumed in notes.

**Basis:** Direct calculation / stated assumptions.

### 6. Slide 10: Illustration labeling

**Previous**

```text
| Policy behavior from the start | Expected moves | Expected return |
```

**Revised**

```text
| Hypothetical policy behavior | Expected moves | Expected return |
```

**Reason:** These are stipulated examples, not measured policy outcomes.

**Basis:** Direct calculation / stated assumptions.

### 7. Slide 15: Overstatement

**Previous**

```text
The agent optimizes the reward objective we specify. A learning algorithm does not choose the task objective for us.
```

**Revised**

```text
The reward and discount define the objective. Whether training finds a good policy is a separate question.
```

**Reason:** The algorithm attempts optimization; the wording must not assert it succeeds.

**Basis:** Direct calculation / stated assumptions.

### 8. Slide 16: Missing assumption

**Previous**

```text
For finite episodes we can use <MathInline tex="\gamma=1" />. Policy gradients do not themselves require discounting.
```

**Revised**

```text
Bounded episode lengths and rewards allow <MathInline tex="\gamma=1" />. Policy gradients do not require discounting.
```

**Reason:** Almost-sure finite termination alone does not imply a finite expected return.

**Basis:** Direct calculation / stated assumptions.

### 9. Slide 20: Unsupported outcome

**Previous**

```text
Many rows receive little or no data.<br>Learning one row does not update the others.
```

**Revised**

```text
Separate rows need separate experience.<br>Updating one row leaves the others unchanged.
```

**Reason:** The slide specifies a table size, not an observed data-coverage distribution.

**Basis:** Direct calculation / stated assumptions.

### 10. Slide 21: Overstatement

**Previous**

```text
# Function approximation shares what the policy learns
```

**Revised**

```text
# Function approximation: parameters shared across states
```

**Reason:** Sharing is a representation property; successful transfer is not guaranteed.

**Basis:** Definition / displayed calculation.

### 11. Slide 21: Illustration labeling

**Previous**

```text
In our grid, **distance to the goal** can provide useful shared features.
```

**Revised**

```text
For the next example, we choose **distance to the goal** as the shared features.
```

**Reason:** The example defines features; it does not evaluate their usefulness.

**Basis:** Direct calculation / stated assumptions.

### 12. Slide 21: Overstatement

**Previous**

```text
Shared weights reuse experience. The model may miss useful policies.
```

**Revised**

```text
An update can affect other states. It may improve or worsen their action choices.
```

**Reason:** Shared parameters do not guarantee beneficial generalization.

**Basis:** FA, PDF p. 2; model equations on slide 22.

### 13. Slide 22: Illustration labeling

**Previous**

```text
This is a small teaching model. Learning will change θ; the feature and score formulas stay fixed.
```

**Revised**

```text
Hand-designed teaching model. The next slider sets θ manually; no training occurs.
```

**Reason:** The next interactive page only sets a parameter, and must not be presented as learning.

**Basis:** PolicyPlayground.vue and gridPolicyDetails.

### 14. Slide 25: Overstatement

**Previous**

```text
# Policy gradients learn θ from experience
```

**Revised**

```text
# Policy gradients: objective, estimator, and update
```

**Reason:** State the method without asserting a learning outcome.

**Basis:** Definition / displayed calculation.

### 15. Slide 25: Mathematical error

**Previous**

```text
\qquad \theta^*\in\arg\max_\theta J(\theta).
```

**Revised**

```text
\qquad \text{goal: maximize }J(\theta).
```

**Reason:** An attained maximizer need not exist in a chosen parameterization; the sigmoid bandit is a counterexample.

**Basis:** J=1+sigmoid(theta)<2 for every finite theta.

### 16. Slide 25: Missing condition

**Previous**

```text
Exact gradient: direction of local increase in expected return
```

**Revised**

```text
Exact gradient: an ascent direction when nonzero
```

**Reason:** At a stationary point, a zero gradient is not a direction of increase.

**Basis:** Direct calculation / stated assumptions.

### 17. Slide 25: Overstatement

**Previous**

```text
**One sample can point the wrong way.** REINFORCE supplies an estimator that is correct on average.
```

**Revised**

```text
REINFORCE gives $\mathbb E[\hat g]=\nabla_\theta J$ under the appendix assumptions. **An update need not increase return.**
```

**Reason:** Unbiased gradient estimation is not improvement in expectation of the updated policy.

**Basis:** PG identity; one-sample counterexample on slide 32.

### 18. Slide 26: Terminology

**Previous**

```text
# REINFORCE: learn from complete sampled episodes
```

**Revised**

```text
# Episodic REINFORCE: the algorithm
```

**Reason:** Specify the variant; REINFORCE originally names a family of gradient estimators.

**Basis:** Williams 1992; PG.

### 19. Slide 26: Overstatement

**Previous**

```text
**REINFORCE is a policy-gradient algorithm.** It learns from complete episodes generated by the current policy.
```

**Revised**

```text
We use **episodic REINFORCE**, a Monte Carlo policy-gradient method. It estimates the gradient from complete current-policy episodes.
```

**Reason:** Describe the estimator, not successful learning.

**Basis:** Williams 1992; PG.

### 20. Slide 27: Illustration labeling

**Previous**

```text
Use one decision state, actions A and B, and a terminal state. Both actions end the episode.
```

**Revised**

```text
**Constructed example:** one decision state, actions A and B, then termination.
```

**Reason:** Make the invented teaching environment explicit on the visible slide.

**Basis:** Direct calculation / stated assumptions.

### 21. Slide 29: Mathematical correction

**Previous**

```text
Here $\bar r(a)=r(s,a)$ at the single decision state. The true reward means let us check the answer, but the learner receives only sampled rewards.
```

**Revised**

```text
Here $\bar r(a)=r(s,a)$. The learner receives sampled rewards.

For finite θ, $J(\theta)<2$. It approaches 2 as $\theta\to\infty$; no finite θ attains it.
```

**Reason:** Make the parameter-optimum issue explicit in the example rather than leaving an invalid argmax claim.

**Basis:** Direct calculation / stated assumptions.

### 22. Slide 30: Scope

**Previous**

```text
Positive returns follow that direction; negative returns reverse it.
```

**Revised**

```text
At the sampled state, positive returns follow that gradient; negative returns reverse it.
```

**Reason:** The statement concerns the sample contribution, not improvement of the whole policy.

**Basis:** Direct calculation / stated assumptions.

### 23. Slide 33: Illustration labeling

**Previous**

```text
Collect these four one-step episodes with the same frozen policy, $p=0.5$.
```

**Revised**

```text
**One possible batch:** four episodes collected with a frozen policy, $p=0.5$.
```

**Reason:** The table is a constructed possible batch, not data from an experiment.

**Basis:** Direct calculation / stated assumptions.

### 24. Slide 33: Numerical notation

**Previous**

```text
$\theta=0.2$ and $p=0.550$
```

**Revised**

```text
$\theta=0.2$ and $p\approx0.550$
```

**Reason:** The sigmoid output is rounded, not exactly 0.550.

**Basis:** Direct calculation / stated assumptions.

### 25. Slide 34: Unsupported outcome

**Previous**

```text
# Repeated sampled updates learn a better policy
```

**Revised**

```text
# REINFORCE demo: updates from fresh batches
```

**Reason:** The old title asserted a general improvement result that the demo does not establish.

**Basis:** bandit.mjs; reproduced run; PG identity.

### 26. Slide 34: Unsupported outcome

**Previous**

```text
Each batch samples 64 episodes, averages their contributions, and takes one update with <MathInline tex="\alpha=0.4" />.
```

**Revised**

```text
Each update uses 64 fresh one-action episodes, with <MathInline tex="\alpha=0.4" />.<br>This seeded run illustrates the update. It does not establish reliable improvement.
```

**Reason:** Describe the actual procedure and the evidentiary limit of one run.

**Basis:** bandit.mjs.

### 27. Slide 34: Editorial error

**Previous**

```text
Next we restore multiple actions per episode.
```

**Revised**

```text
Next we explain why the next batch uses the updated policy.
```

**Reason:** Stale transition text no longer matched the slide order.

**Basis:** Direct calculation / stated assumptions.

### 28. Slide 36: Numerical labeling

**Previous**

```text
| Action | Mean reward | Old frequency | Current probability | Current log derivative |
```

**Revised**

```text
| Action | Mean reward | Collection probability | Current probability | Current log derivative |
```

**Reason:** The exact entries are sampling probabilities, not necessarily observed batch frequencies.

**Basis:** Direct calculation / stated assumptions.

### 29. Slide 38: Illustration labeling

**Previous**

```text
For a short numerical illustration, suppose we observed:
```

**Revised**

```text
For a **constructed trace**, assume these two decisions and rewards:
```

**Reason:** This trace was authored for arithmetic; no environment rollout produced it.

**Basis:** Direct calculation / stated assumptions.

### 30. Slide 40: Numerical notation

**Previous**

```text
p_{\mathrm{new}}=\sigma(0.4)=0.599
```

**Revised**

```text
p_{\mathrm{new}}=\sigma(0.4)\approx0.599
```

**Reason:** The displayed probability is rounded.

**Basis:** Direct calculation / stated assumptions.

### 31. Slide 41: Terminology

**Previous**

```text
# Each action can use only the rewards that follow it
```

**Revised**

```text
# REINFORCE with return-to-go
```

**Reason:** Full-episode returns are also valid; the old title could imply they are prohibited.

**Basis:** Definition / displayed calculation.

### 32. Slide 43: Mathematical error

**Previous**

```text
Descending this loss gives the REINFORCE update: $\theta\leftarrow\theta+\alpha\hat g_{\mathrm{batch}}$.
```

**Revised**

```text
A **plain SGD** step gives $\theta\leftarrow\theta+\alpha\hat g_{\mathrm{batch}}$. Adam or momentum changes the step rule.
```

**Reason:** The exact parameter update is not the update made by every optimizer.

**Basis:** Algebra of SGD vs adaptive or momentum updates.

### 33. Slide 43: Missing condition

**Previous**

```text
Average episode sums. Then collect a fresh batch under the updated policy.
```

**Revised**

```text
Evaluate this gradient at the collection parameters. The loss value does not estimate expected return.
```

**Reason:** The displayed loss equality needs its on-policy evaluation point; numerical loss is not a task-performance metric.

**Basis:** Spinning Up, loss-function discussion.

### 34. Slide 44: Implementation clarification

**Previous**

```text
Each episode stores `(reward, log_probability_of_sampled_action)` pairs.
```

**Revised**

```text
Use plain SGD without momentum. Each episode stores `(reward, log_probability)` pairs.
```

**Reason:** Make the code agree with the exact parameter-update formula.

**Basis:** Direct calculation / stated assumptions.

### 35. Slide 45: Unsupported outcome

**Previous**

```text
# REINFORCE works on average. Why are updates noisy?
```

**Revised**

```text
# Unbiased gradients and noisy updates
```

**Reason:** Works on average ambiguously claimed successful learning rather than an unbiased estimator.

**Basis:** PG identity.

### 36. Slide 46: Overstatement

**Previous**

```text
# Recall the bandit model and the update we are improving
```

**Revised**

```text
# Recall the bandit and its gradient estimator
```

**Reason:** The slide recalls an estimator; it has not yet established an improvement.

**Basis:** Definition / displayed calculation.

### 37. Slide 47: Overgeneralization

**Previous**

```text
# A baseline compares the return with what was expected
```

**Revised**

```text
# Using expected return as the baseline
```

**Reason:** A baseline can be any suitable action-independent function, not necessarily expected return.

**Basis:** Definition / displayed calculation.

### 38. Slide 50: Overstatement

**Previous**

```text
# Why does lower variance help learning?
```

**Revised**

```text
# Independent batches: variance and estimation error
```

**Reason:** The result concerns error at a fixed policy, not a guarantee about the training process.

**Basis:** Definition / displayed calculation.

### 39. Slide 50: Missing condition

**Previous**

```text
For **independent episodes** and a fixed baseline:
```

**Revised**

```text
For this bandit at θ = 0, use **independent episodes** and a fixed baseline:
```

**Reason:** The mean 0.25 is specific to the displayed bandit and parameter.

**Basis:** Direct calculation / stated assumptions.

### 40. Slide 50: Exact result

**Previous**

```text
\boxed{\operatorname{Var}(\bar g_N)=\frac{\operatorname{Var}(\hat g_b)}{N}.}
```

**Revised**

```text
\boxed{\mathbb E[(\bar g_N-0.25)^2]=\operatorname{Var}(\bar g_N)=\frac{\operatorname{Var}(\hat g_b)}{N}.}
```

**Reason:** For an unbiased scalar estimator the stated precision improvement is exactly a reduction of mean squared error.

**Basis:** Direct calculation / stated assumptions.

### 41. Slide 50: Scope

**Previous**

```text
Same data, **60% lower variance**: a more precise gradient estimate in this example.
```

**Revised**

```text
For the same N, b = 1.5 gives **60% lower mean squared gradient error** at θ = 0.
```

**Reason:** Same data could imply the same realized estimator is closer; this is an expectation over independent batches.

**Basis:** Direct calculation / stated assumptions.

### 42. Slide 51: Missing condition

**Previous**

```text
- Hold it fixed in the actor derivative.
```

**Revised**

```text
- Fix it before collecting the batch.
- Hold it fixed in the actor derivative.
```

**Reason:** Detaching a same-sample fitted baseline does not alone ensure statistical independence.

**Basis:** Score identity conditional on pre-action history.

### 43. Slide 52: Overstatement

**Previous**

```text
# A critic learns the expected return from a state
```

**Revised**

```text
# A learned value function provides a baseline
```

**Reason:** Training a predictor does not establish that it learns the true value; a Monte Carlo baseline also need not bootstrap.

**Basis:** Definition / displayed calculation.

### 44. Slide 52: Overstatement

**Previous**

```text
Train $V_\phi(s)$ to predict this value from observed returns.
```

**Revised**

```text
Fit $V_\phi(s)$ to observed returns. It estimates $v_\pi(s)$ and can have prediction error.
```

**Reason:** Distinguish the fitting target from an achieved accurate estimate.

**Basis:** Squared-error conditional-mean target; FA.

### 45. Slide 52: Terminology

**Previous**

```text
Critic: <MathInline tex="V_\phi(s)" />
```

**Revised**

```text
Value predictor: <MathInline tex="V_\phi(s)" />
```

**Reason:** Avoid equating Monte Carlo baseline fitting with every definition of actor–critic.

**Basis:** Direct calculation / stated assumptions.

### 46. Slide 52: Terminology

**Previous**

```text
Was the outcome better or worse than expected from this state?
```

**Revised**

```text
PPO uses a value predictor as its **critic**, typically with bootstrapping (Appendix F).
```

**Reason:** Locate actor–critic terminology in the PPO algorithm actually being described.

**Basis:** PPO Algorithm 1 and Section 5.

### 47. Slide 54: Illustration labeling

**Previous**

```text
The batch describes **what happened under $\pi_{\mathrm{old}}$**.
```

**Revised**

```text
The batch contains samples from $\pi_{\mathrm{old}}$. The bars below are **illustrative probabilities at one state**.
```

**Reason:** The chosen probability shifts are not tested safety thresholds or benchmark outcomes.

**Basis:** Direct calculation / stated assumptions.

### 48. Slide 54: Unsupported outcome

**Previous**

```text
PPO favors limited progress on the current batch, followed by fresh evidence.
```

**Revised**

```text
The surrogate uses old-policy data. Clipping does not guarantee a trust region or a return increase.
```

**Reason:** Limited progress implied improvement and a reliable bound not established by clipping.

**Basis:** PPO Eq. 7; TRPO local surrogate.

### 49. Slide 57: Mathematical error

**Previous**

```text
The update score $L_t$ is larger for a better proposed change. Here $\epsilon=0.2$.
```

**Revised**

```text
PPO maximizes a **surrogate score** $L_t$. A larger score need not mean higher return. Here $\epsilon=0.2$.
```

**Reason:** This was an invalid equivalence between surrogate improvement and task improvement.

**Basis:** PPO Eq. 7; TRPO local approximation.

### 50. Slide 58: Scope

**Previous**

```text
Constrains the average KL change
```

**Revised**

```text
Approximately solves a problem with an average KL constraint
```

**Reason:** The implementation approximately solves a sampled surrogate, not the exact theoretical bound.

**Basis:** PPO Section 2.2; TRPO practical algorithm.

### 51. Slide 59: Overgeneralization

**Previous**

```text
Standard PPO uses an **actor and a critic**.
```

**Revised**

```text
The PPO paper’s Algorithm 1 uses an **actor and a critic**.
```

**Reason:** Attribute the architectural claim to a specified algorithm; clipping itself does not require one architecture.

**Basis:** PPO Algorithm 1.

### 52. Slide 60: Recommendation labeling

**Previous**

```text
# From this lecture to a working project
```

**Revised**

```text
# Suggested project workflow
```

**Reason:** These steps are teaching recommendations, not verified guarantees of project success.

**Basis:** Definition / displayed calculation.

### 53. Slide 60: Unsupported outcome

**Previous**

```text
<b>5 · Improve</b>
```

**Revised**

```text
<b>5 · Compare</b>
```

**Reason:** Trying a baseline or PPO is an experiment, not guaranteed improvement.

**Basis:** Direct calculation / stated assumptions.

### 54. Slide 61: Overstatement

**Previous**

```text
theta parameterizes the policy and shared approximators generalize across states
```

**Revised**

```text
theta parameterizes the policy and shared weights can change predictions across states
```

**Reason:** Remove a success claim in presenter notes as well.

**Basis:** Direct calculation / stated assumptions.

### 55. Slide 64: Missing condition

**Previous**

```text
**Average within each group. Then weight by how often the group occurs.**
```

**Revised**

```text
For integrable $X$ and discrete $Y$, average within each group, then weight by its probability.
```

**Reason:** The sum form uses discrete Y and finite absolute expectation for signed X.

**Basis:** Total expectation.

### 56. Slide 66: Missing condition

**Previous**

```text
Finite actions, differentiable $\pi_\theta(a)>0$, and a reward distribution with no direct dependence on θ.
```

**Revised**

```text
Finite actions, differentiable $\pi_\theta(a)>0$, integrable rewards, and no direct dependence of the environment on θ.
```

**Reason:** The reward expectation must exist.

**Basis:** Direct calculation / stated assumptions.

### 57. Slide 70: Missing condition

**Previous**

```text
The initial distribution and environment are fixed with respect to θ. Differentiation and expectation can be interchanged. Continuous trajectories use densities and integrals.
```

**Revised**

```text
The environment and initial distribution are θ-independent. Policy support is fixed and positive. Returns are integrable; derivative and expectation interchange is valid. Use densities for continuous variables.
```

**Reason:** The likelihood-ratio proof also needs fixed support and integrability.

**Basis:** Direct calculation / stated assumptions.

### 58. Slide 73: Missing condition

**Previous**

```text
The action is sampled from $\pi_\theta(\cdot\mid s)$. The baseline is the same for every action at this state.
```

**Revised**

```text
Sample $A\sim\pi_\theta(\cdot\mid s)$. Fix $b(s)$ before sampling the action and reward.
```

**Reason:** Same value across actions as code does not alone ensure independence from the current sample.

**Basis:** Direct calculation / stated assumptions.

### 59. Slide 77: Missing condition

**Previous**

```text
Fix a state and θ. Write $z=\nabla_\theta\log\pi_\theta(A\mid s)$ and $\hat g_b=(G-b)z$.
```

**Revised**

```text
Fix a state and θ. Let $z=\nabla_\theta\log\pi_\theta(A\mid s)$, $\hat g_b=(G-b)z$. Assume finite second moments and $\mathbb E[\|z\|^2]>0$.
```

**Reason:** The denominator and variance minimization require these conditions.

**Basis:** Direct calculation / stated assumptions.

### 60. Slide 77: Scope

**Previous**

```text
A good baseline reduces the **return-weighted score's** spread. Subtracting $b$ alone leaves $\operatorname{Var}(G-b)=\operatorname{Var}(G)$.
```

**Revised**

```text
This minimizes variance of **one state’s contribution**. It need not minimize variance of a whole trajectory sum.
```

**Reason:** The fixed-state formula is not a global optimum for sums of dependent contributions.

**Basis:** Direct calculation / stated assumptions.

### 61. Slide 77: Attribution correction

**Previous**

```text
Source: Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf .
```

**Revised**

```text
This slide derives a fixed-state result directly. Related primary analysis: Greensmith, Bartlett, and Baxter (2004), https://jmlr.org/papers/v5/greensmith04a.html .
```

**Reason:** The specific optimum formula should not be attributed to CS443 without locating it there.

**Basis:** Direct calculation / stated assumptions.

### 62. Slide 81: Definition clarification

**Previous**

```text
The common scale $H_{\mathrm{eff}}\approx1/(1-\gamma)$ describes decay of reward weights. It is about 10 steps for $\gamma=0.9$ and 100 for $\gamma=0.99$.
```

**Revised**

```text
The **sum of discount weights** is exactly $\sum_{k\geq0}\gamma^k=1/(1-\gamma)$. This common effective-horizon scale is 10 for $\gamma=0.9$ and 100 for $\gamma=0.99$.
```

**Reason:** Distinguish an exact weight sum from a convention for horizon and a truncation-error bound.

**Basis:** Direct calculation / stated assumptions.

### 63. Slide 83: Scope

**Previous**

```text
It also repairs the current gradient estimate:
```

**Revised**

```text
For fixed old and target policies, the weighted **expected gradient** is:
```

**Reason:** The equality uses exact expectations, not the result of any finite batch.

**Basis:** Direct calculation / stated assumptions.

### 64. Slide 83: Scope

**Previous**

```text
The correction fixes the sampling frequencies. Finite-sample noise still remains.
```

**Revised**

```text
This equality holds in expectation. A finite weighted sample still has estimation error.
```

**Reason:** Importance sampling changes weights, not the empirical sampling frequencies themselves.

**Basis:** Direct calculation / stated assumptions.

### 65. Slide 84: Missing condition

**Previous**

```text
Assume the environment and initial-state distribution do not depend on θ. Their factors cancel:
```

**Revised**

```text
Assume fixed old and target policies, θ-independent dynamics, and old-policy support covering the target. Environment factors cancel:
```

**Reason:** Full trajectory reweighting needs coverage; an adaptively selected finite-batch target needs additional care.

**Basis:** Direct calculation / stated assumptions.

### 66. Slide 85: Missing condition

**Previous**

```text
With exact advantages, its gradient agrees locally:
```

**Revised**

```text
With exact advantages and the Appendix B assumptions, its gradient agrees locally:
```

**Reason:** Carry the relevant regularity assumptions into the local-gradient statement.

**Basis:** Direct calculation / stated assumptions.

### 67. Slide 87: Normalization clarification

**Previous**

```text
Let $\bar D_{\mathrm{KL}}$ average this quantity over recorded states.
```

**Revised**

```text
Use matching averages over M recorded transitions:

$\bar L=M^{-1}\sum_t\rho_t\hat A_t$, $\quad\bar D_{\mathrm{KL}}=M^{-1}\sum_t D_{\mathrm{KL},t}$.
```

**Reason:** The prior page defined an episode sum but this page paired it with a timestep-average KL without specifying scaling.

**Basis:** Direct calculation / stated assumptions.

### 68. Slide 87: Normalization clarification

**Previous**

```text
| TRPO | Maximize $L_{\mathrm{sur}}(\theta)$ subject to $\bar D_{\mathrm{KL}}\leq\delta$ |
```

**Revised**

```text
| TRPO surrogate | Maximize $\bar L(\theta)$ subject to $\bar D_{\mathrm{KL}}\leq\delta$ |
```

**Reason:** Use the explicitly normalized sampled surrogate.

**Basis:** Direct calculation / stated assumptions.

### 69. Slide 87: Normalization clarification

**Previous**

```text
| PPO with a KL penalty | Maximize $L_{\mathrm{sur}}(\theta)-\beta\bar D_{\mathrm{KL}}$ |
```

**Revised**

```text
| PPO with a KL penalty | Maximize $\bar L(\theta)-\beta\bar D_{\mathrm{KL}}$ |
```

**Reason:** Use matching sample normalization.

**Basis:** Direct calculation / stated assumptions.

### 70. Slide 88: Incomplete definition

**Previous**

```text
A reference-regularized objective has the form
```

**Revised**

```text
For prompts $x\sim D$ and complete outputs $y\sim\pi_\theta(\cdot\mid x)$, one objective is
```

**Reason:** The original schematic KL did not identify the distribution or the prompt average.

**Basis:** Ouyang et al., Section 3.5 Eq. 2, without auxiliary pretraining term.

### 71. Slide 88: Incomplete definition

**Previous**

```text
\text{maximize}\quad\text{expected task reward}
-\beta\,D_{\mathrm{KL}}(\pi_\theta\|\pi_{\mathrm{ref}}).
```

**Revised**

```text
\max_\theta\;\mathbb E_{x\sim D}\!\left[
\mathbb E_{y\sim\pi_\theta(\cdot\mid x)}[r(x,y)]
-\beta D_{\mathrm{KL}}\!\left(\pi_\theta(\cdot\mid x)\|\pi_{\mathrm{ref}}(\cdot\mid x)\right)\right].
```

**Reason:** Specify the reward and complete conditional output distributions in the KL.

**Basis:** Ouyang et al. Eq. 2 (RL term).

### 72. Slide 90: Missing condition

**Previous**

```text
Here <MathInline tex="i" /> indexes episodes and <MathInline tex="t" /> indexes time within an episode.
```

**Revised**

```text
Here <MathInline tex="\gamma=1" />. The N episodes are independent at fixed θ; i indexes episodes and t indexes actions.
```

**Reason:** Restate the undiscounted and sampling assumptions beside the complete algorithm.

**Basis:** Direct calculation / stated assumptions.

### 73. Slide 49: Numerical error

**Previous**

```text
All slider values use quarter increments, so seven decimal places suffice for exact displayed variance terms.
```

**Revised**

```text
Quarter-step baselines produce variance terms with denominator at most 512, requiring up to nine decimal places. The variance itself needs up to six decimal places.
```

**Reason:** The previous precision claim was false. At b = 0.25, a variance term is 243/512 = 0.474609375, and other settings have variance requiring six decimal places. The interactive display now retains the needed digits.

**Basis:** Exact rational arithmetic and all 17 slider positions.

### 74. Slide 58: Scope

**Previous**

```text
| PPO with a KL penalty (2017) | Trades estimated improvement against a KL penalty |
```

**Revised**

```text
| PPO with a KL penalty (2017) | Subtracts a KL penalty from the surrogate |
```

**Reason:** Use the defined surrogate consistently rather than imply an estimate of actual new-policy performance.

**Basis:** PPO Eq. 8.

### 75. Slide 58: Scope

**Previous**

```text
\text{update score}=\text{estimated improvement}-\beta\,\text{KL change},
```

**Revised**

```text
\text{update score}=\text{surrogate score}-\beta\,\text{KL change},
```

**Reason:** Keep the schematic equation consistent with the specified surrogate objective.

**Basis:** PPO Eq. 8.


## Interactive text corrections

### components/ReinforceDemo.vue

- Previous: “Live sampled REINFORCE run”
  Revised: “Sampled REINFORCE run · seed 443”

- Previous: “Analytical evaluation: 1 + p”
  Revised: “Exact model expectation: J = 1 + p”

### components/BaselineVariance.vue

- Previous: “Lower variance: less noise in the batch update.”
  Revised: “Variance below 0.9375 at this fixed policy.”

- Previous: “Higher variance: this baseline makes the estimate noisier.”
  Revised: “Variance above 0.9375 at this fixed policy.”

- Previous: “Variance terms rounded to 7 decimal places; total rounded to 4”
  Revised: “Variance terms keep up to 9 decimal places; total keeps up to 6”

### components/BanditUpdate.vue

- Previous: “One observed sample”
  Revised: “Chosen example outcome”

- Previous: “This unlucky A outcome makes A less likely.”
  Revised: “For A with reward −1, the update decreases p(A).”

- Previous: “A is better on average, yet one observation can move the policy in the wrong direction.”
  Revised: “Here J = 1 + p(A). The A/−1 and B/+1 updates decrease J.”

### components/PolicyPlayground.vue

- Previous: “Move θ: change the shared weight. Select a cell: change the input state.”
  Revised: “Manual exploration: θ sets the shared weight. A cell click sets the input state.”

### components/ConceptCheck.vue

- Previous: “so learning can generalize.”
  Revised: “so an update can change predictions at other states. This need not improve them.”

- Previous: “Why does PPO use a ratio and restrict policy changes?”
  Revised: “Why does PPO use a ratio and discourage large policy changes?”

### components/RLLandscape.vue

- Previous: “Learn how the world responds”
  Revised: “Estimate transitions and rewards”

- Previous: “Learn which actions lead to high return”
  Revised: “Estimate returns for actions”


## Instructor guide correction

The guide called the training chart an “analytical curve.” That was inaccurate: the chart plots p(A) after sampled updates. Only the separate J = 1 + p readout is analytical. The guide now says this explicitly.

## Outcome descriptions retained

- Grid route totals: deterministic consequences of the stated move costs. No trained navigation result is claimed.

- Softmax bars and exploration counts: exact model calculations, displayed with rounding. No optimizer runs in these sliders.

- Bandit update buttons: calculations for selected possible observations, each starting at θ = 0. They are not newly sampled data.

- Training curve: a seeded pseudorandom run with the implemented update. The exact model expectation J = 1 + p is evaluation only.

- Baseline comparison: exact distributional moments at θ = 0. An arbitrary baseline can increase variance.

- PPO plots: single-sample objective values computed from the clipped formula, not policy performance measurements.

- Project workflow and lecture timings: teaching suggestions, not factual predictions of outcomes.
