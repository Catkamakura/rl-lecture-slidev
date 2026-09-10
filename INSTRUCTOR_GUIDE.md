# Teaching guide: RL foundations, REINFORCE, and PPO

The deck has **48 main slides and 31 optional appendix slides**. Define the knowledge first, then use examples to apply it. The navigation model illustrates MDPs. The bandit demonstrates REINFORCE. Baselines occupy two slides without a numerical demonstration.

## Teaching sequence

| Slides | Purpose |
|---|---|
| 1–2 | Overview and clickable map |
| 3–16 | MDP, policy, objective, Markov property, navigation, discounting, episodic tasks |
| 17–22 | Recall policy; tabular probabilities; shared function approximation |
| 23–35 | Policy gradients, bandit, REINFORCE updates, current-policy sampling |
| 36–41 | Trajectories, return-to-go, loss, implementation |
| 42–43 | Baseline idea, state value, action value, advantage |
| 44–48 | PPO motivation, sampling mismatch, ratio, clipped objective, plots |

The footer and course map use these new page numbers. Appendix links are also updated. REINFORCE remains the main worked algorithm; the proofs are optional reference material.

## Demonstrations

**Navigation (8).** The initial model has deterministic rewards, gamma=.99, and an absorbing goal. Every action outside G costs -1, including goal entry. Subsequent actions at G stay there and earn zero. Four East and four South actions produce discounted return about -7.725531. A ninth action leaves the state and return unchanged.

**Return and expectation (9–10).** Starting at (3,4), East gives -1; North, East, South gives -2.9701 at gamma=.99. The specified stationary policy chooses these continuations with probabilities q and 1-q. At q=.5, expected return is -1.98505. The slider is a manual setting, not training.

**Discounts (13–14).** Establish the geometric-series bound, then explore weighted route returns. Gamma=1 gives -8 and -12 for the routes and negative infinity for an endless loop. Slide 15 separately introduces episodic returns and the finite-expected-length condition for J=-E[T].

**Two complete policies (18).** Uniform random assigns [.25,.25,.25,.25] to N/S/W/E at every nonterminal state. Always East assigns [0,0,0,1]. Choose a policy, then click different cells: the policy stays active. Clicking a cell resets the episode state, counters, and path only. Take one action samples from the displayed distribution. The ten-action button stops after ten actions or on reaching G. Always East from (0,0) reaches (4,0) and then stays against the boundary; from (3,4), it reaches G in one action. Reaching G ends the episode and disables stepping. The restart button preserves the chosen policy. These are fixed teaching policies, not learning updates; random trajectories can differ between runs.

**Shared policy (21–22).** First read the feature, score, and softmax equations. At theta=0, all action probabilities are .25. At state (1,2), theta=1 gives dx=.75, dy=.50, scores [-.5,.5,-.75,.75], and East probability about .436979. Select another state to change the input; move theta to change a shared parameter. The arrows use the same scale as the tabular demonstration. This hand-designed policy family is not claimed to contain an optimal navigation policy.

**Bandit visual (26).** Separate policy choice from reward randomness. The policy chooses A or B. After A, the environment draws +3 with probability .75 or -1 with probability .25. After B, the reward is always +1. All outcomes terminate. These stipulated rules let the class verify the expected return and update arithmetic.

**Exploration (27).** The sigmoid policy controls the expected action counts. At theta=0, p(A)=.5. Favor A sets theta=4.6, so p(A) is about .990. Counts are expected counts in 100 episodes, not an actual rollout.

**One update (31).** Each outcome button starts from theta=0 and alpha=.4. A/+3 gives gradient 1.5, theta_new=.6, and p(A) about .645656. A/-1 and B/+1 each give gradient -.5, theta_new=-.2, and p(A) about .450166. These compare possible samples rather than successive updates.

**Sampled updates (33).** Batch size 64, alpha=.4, seed 443. After 40 batches, p(A) is approximately .931658. The learner uses sampled rewards. The analytical expected return 1+p is for evaluation only. One seeded run does not establish reliable or monotonic improvement.

**PPO clipping (48).** First read the ratio (46), then the exact clipped surrogate and advantage estimate (47). The positive-advantage plot is flat above ratio 1.2; the negative-advantage plot is flat below ratio 0.8. Other samples and shared parameters can still move a ratio beyond these thresholds. Clipping changes the objective's incentive; it does not impose a hard trust region.

## Baseline and advantage explanations

Slide 42 introduces a fixed state-only baseline in the return-to-go estimator. It preserves the expected gradient. A suitable baseline can reduce gradient-estimate variance; an arbitrary baseline need not help. Hold baseline outputs fixed in the actor derivative. Fixing the baseline before collecting the batch is sufficient for the stated unbiasedness result; strict finite-sample claims need care if the baseline is fitted using the same action/reward being centered.

Slide 43 defines v_pi(s) as expected return starting from s and following pi. Q_pi(s,a) takes a first, then follows pi. Advantage is Q-v. The actor chooses actions; the critic V_phi predicts expected return and can supply the baseline. No numerical example is needed here.

Slide 47 uses hat-A to mean an estimate of the collecting policy's advantage. For complete episodes, G_t-V_phi(s_t) is one simple estimator. It is not necessarily the true advantage. PPO commonly uses GAE; its residual formula is in the appendix. Keep advantage estimates and the old-policy denominator fixed during the optimization passes.

## Mathematical distinctions to preserve

- The initial MDP tuple is (S,A,P,R,gamma), with deterministic R and gamma<1. Episodic and random-reward extensions appear on 15 and 26.
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
