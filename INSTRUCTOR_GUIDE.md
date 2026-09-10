# Teaching guide: RL foundations, REINFORCE, and PPO

The deck has **48 main slides and 31 optional appendix slides**. Define the knowledge first, then use examples to apply it. The navigation model illustrates MDPs. The bandit demonstrates REINFORCE. Baselines occupy two slides without a numerical demonstration.

## Teaching sequence

| Slides | Purpose |
|---|---|
| 1–2 | Overview and clickable map |
| 3–15 | MDP, policy, objective, Markov property, navigation, discounting, episodic tasks |
| 16–21 | Recall policy; tabular probabilities; shared function approximation |
| 22–35 | Policy gradients, bandit, state value, REINFORCE updates, current-policy sampling |
| 36–41 | Trajectories, return-to-go, loss, implementation |
| 42–43 | Baseline idea, state value, action value, advantage |
| 44–48 | PPO motivation, sampling mismatch, ratio, clipped objective, plots |

The footer and course map use these new page numbers. Appendix links are also updated. REINFORCE remains the main worked algorithm; the proofs are optional reference material.

## Demonstrations

**Navigation (8).** The initial model has deterministic rewards, gamma=.99, and an absorbing goal. Every action outside G costs -1, including goal entry. Subsequent actions at G stay there and earn zero. Four East and four South actions produce discounted return about -7.725531. A ninth action leaves the state and return unchanged.

**Reward and return (9).** Compare the specified one- and three-move continuations. Both first moves receive -1; their discounted returns differ. The state-value introduction follows the bandit on slide 26.

**Discounts (12–13).** Establish the geometric-series bound, then explore weighted route returns. Gamma=1 gives -8 and -12 for the routes and negative infinity for an endless loop. Slide 14 separately introduces episodic returns and the finite-expected-length condition for J=-E[T].

**Two complete policies (17).** Uniform random assigns [.25,.25,.25,.25] to N/S/W/E at every nonterminal state. Always East assigns [0,0,0,1]. Choose a policy, then click different cells: the policy stays active. Clicking a cell resets the episode state, counters, and path only. Take one action samples from the displayed distribution. The ten-action button stops after ten actions or on reaching G. Always East from (0,0) reaches (4,0) and then stays against the boundary; from (3,4), it reaches G in one action. Reaching G ends the episode and disables stepping. The restart button preserves the chosen policy. These are fixed teaching policies, not learning updates; random trajectories can differ between runs.

**Table size and continuous states (18).** Compare 24 nonterminal rows in the 5×5 grid with 9,999 in a 100×100 grid. At four stored probabilities per row, these require 96 and 39,996 entries. The continuous-position comparison shows why no finite table can enumerate every state. Discretization groups positions into bins; a shared model computes probabilities from features. Continuous states do not force approximation error in every problem: a constant action policy can be represented exactly. The continuous row is a representation comparison, not a new transition model.

**Full grid-policy table (19).** Start with Uniform random. Click (1,2): its row highlights in the left table. Set this row to always East, then click (2,2): the edited row retains [0,0,0,1] while the neighboring row retains [.25,.25,.25,.25]. Only the complete-table buttons reset all entries. The terminal G has no action row. This is a manual illustration of independent table entries, not training. Contrast it with shared weights that can change probabilities at many states. The simple grid does not require function approximation, and the two constant example policies can also be represented by exact short rules. A chosen shared model may fail to express an optimal policy; beneficial generalization is not guaranteed.

**Shared policy (20–21).** First read the feature, score, and softmax equations. At theta=0, all action probabilities are .25. At state (1,2), theta=1 gives dx=.75, dy=.50, scores [-.5,.5,-.75,.75], and East probability about .436979. Select another state to change the input; move theta to change a shared parameter. The arrows use the same scale as the tabular demonstration. This hand-designed policy family is not claimed to contain an optimal navigation policy.

**Bandit visual (25).** Separate policy choice from reward randomness. The policy chooses A or B. After A, the environment draws +3 with probability .75 or -1 with probability .25. After B, the reward is always +1. All outcomes terminate. These stipulated rules let the class verify the expected return and update arithmetic.

**State value (26).** Define v_pi(s) as expected return from s under pi. Reuse the preceding one-decision bandit with pi(A|s)=pi(B|s)=.5. The conditional reward means are 2 and 1, giving v_pi(s)=1.5. One episode returns 3, -1, or 1; 1.5 is the expectation. This is a fixed illustration, not training. Slide 28 connects J(theta) to v_pi_theta(s) because the start state is fixed; slide 43 recalls value before defining advantage.

**Exploration (27).** The sigmoid policy controls the expected action counts. At theta=0, p(A)=.5. Favor A sets theta=4.6, so p(A) is about .990. Counts are expected counts in 100 episodes, not an actual rollout.

**One update (31).** Each outcome button starts from theta=0 and alpha=.4. A/+3 gives gradient 1.5, theta_new=.6, and p(A) about .645656. A/-1 and B/+1 each give gradient -.5, theta_new=-.2, and p(A) about .450166. These compare possible samples rather than successive updates.

**Sampled updates (33).** Batch size 64, alpha=.4, seed 443. After 40 batches, p(A) is approximately .931658. The learner uses sampled rewards. The analytical expected return 1+p is for evaluation only. One seeded run does not establish reliable or monotonic improvement.

**PPO clipping (48).** First read the ratio (46), then the exact clipped surrogate and advantage estimate (47). The positive-advantage plot is flat above ratio 1.2; the negative-advantage plot is flat below ratio 0.8. Other samples and shared parameters can still move a ratio beyond these thresholds. Clipping changes the objective's incentive; it does not impose a hard trust region.

## Baseline and advantage explanations

Slide 42 introduces a fixed state-only baseline in the return-to-go estimator. It preserves the expected gradient. A suitable baseline can reduce gradient-estimate variance; an arbitrary baseline need not help. Hold baseline outputs fixed in the actor derivative. Fixing the baseline before collecting the batch is sufficient for the stated unbiasedness result; strict finite-sample claims need care if the baseline is fitted using the same action/reward being centered.

Slide 43 recalls v_pi(s), introduced on slide 26: expected return starting from s and following pi. Q_pi(s,a) takes a first, then follows pi. Advantage is Q-v. The actor chooses actions; the critic V_phi predicts expected return and can supply the baseline. No numerical example is needed here.

Slide 47 uses hat-A to mean an estimate of the collecting policy's advantage. For complete episodes, G_t-V_phi(s_t) is one simple estimator. It is not necessarily the true advantage. PPO commonly uses GAE; its residual formula is in the appendix. Keep advantage estimates and the old-policy denominator fixed during the optimization passes.

## Mathematical distinctions to preserve

- The initial MDP tuple is (S,A,P,R,gamma), with deterministic R and gamma<1. Episodic and random-reward extensions appear on 14 and 25.
- G_t is sampled return; J is expected return; g-hat estimates the gradient of J. A sample update need not improve return.
- Basic REINFORCE's uncorrected estimator requires current-policy sampling. Old trajectories retain their collection distribution after theta changes.
- Return-to-go removes past rewards because their expected score contribution is zero. This is not an equality between individual sampled gradients.
- The negative weighted log loss constructs the policy gradient. Its scalar value does not measure expected return. Plain SGD implements theta+alpha*g-hat; other optimizers change the step rule.
- PPO uses an action importance ratio in a surrogate over old state samples. It does not fully correct trajectory distributions. Clipping is not an unbiased estimator of the new policy's return.
- For the start-state discounted objective, the return-to-go gradient includes an outer gamma^t. See Appendix D.

## Appendix map

| Slides | Material |
|---|---|
| 49 | Clickable topic index |
| 50–52 | Conditional expectation and total expectation |
| 53–56 | One-action REINFORCE and sigmoid derivatives |
| 57–59 | Trajectory probability and gradient |
| 60–66 | Baseline cancellation, variance, restrictions, return-to-go |
| 67–68 | Discounted gradients and effective horizon |
| 69–72 | Importance sampling and PPO's surrogate |
| 73–76 | PPO clipping, KL methods, fixed references, GAE |
| 77 | Batch REINFORCE algorithm |
| 78–79 | Notation and sources |

The detailed baseline proof and variance calculation remain in Appendix C. KL constraints, PPO's adaptive KL penalty, and later fixed-reference penalties remain in Appendix F. They are not additional main-lecture topics.

## Sources and verification

- [MDP_SOURCE_MAP.md](MDP_SOURCE_MAP.md): MDP formulation and example assumptions.
- [REVISION_NOTES.md](REVISION_NOTES.md): latest page edits and verification scope.
- [CLAIM_AUDIT.md](CLAIM_AUDIT.md): historical claim corrections, using its original page numbers.
- [CS443](https://nanjiang.cs.illinois.edu/cs443/) and [policy-gradient lecture](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf).
- [Sutton and Barto](https://www.incompleteideas.net/book/the-book-2nd.html), Chapters 3 and 13.
- [Spinning Up policy optimization](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html): return-to-go, baseline and advantage identities.
- [PPO paper](https://arxiv.org/abs/1707.06347), Eq. 7 and Algorithm 1: clipped objective and rollout reuse.

Run `node scripts/verify-lecture.mjs` for the numerical checks. Presenter notes remain in the private source and local build. The public Pages build omits them.
