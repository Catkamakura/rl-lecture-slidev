# Teaching guide: RL foundations → REINFORCE → PPO

## Claim audit

See [CLAIM_AUDIT.md](CLAIM_AUDIT.md) for the complete correction register and a basis for every slide. Outcome descriptions are limited to exact examples or the disclosed seeded run. An unbiased gradient is not a policy-improvement guarantee. Use plain SGD when illustrating the exact θ + α ĝ step.

## Teaching structure

Use the opening map to explain the argument. Each example has a purpose: navigation defines the task, the bandit makes a gradient update calculable, and a recorded episode extends the update through time. Return to the same bandit when introducing baselines.

| Slides | Purpose | Suggested time in a 90-minute class |
|---|---|---:|
| 1–2 | Course map | 2 min |
| 3–17 | Formal MDP, RL feedback, objective, Markov, reward and discount choices | 20 min |
| 18–23 | Policy representation and function approximation | 10 min |
| 24–36 | RL landscape, exploration, sampled REINFORCE, on-policy data | 22 min |
| 37–44 | Trajectories, return-to-go, implementation | 14 min |
| 45–52 | Baseline recap, variance math, critic | 12 min |
| 53–59 | PPO at a high level | 7 min |
| 60–61 | Project path and discussion | 3 min |

These are pacing estimates, not a one-slide-per-minute rule. Some transitions take seconds; demos and worked calculations need time. In a shorter class, assign the loss/code pair and optional PPO details as reading. Keep the formal objective, one-sample calculation, return-to-go, and baseline calculation in class. The appendix is a reference rather than part of the timed lecture.

## Earlier structure revision

- Added a clickable overview, section recaps, a persistent section/progress bar, and a linked appendix index.
- Added an explicit contrast between RL feedback and supervised action labels. Distinguished planning with a known model from learning through samples.
- Added a selectable RL landscape. It introduces neighboring methods without teaching their update rules.
- Turned the sigmoid-policy table into an exploration demonstration with the same visible model equation.
- Added the variance definition, outcome probabilities, exact live arithmetic, and the independent-batch variance relation.
- Combined the two discount-motivation slides. Removed the repeated early return table and folded the credit-assignment caution into return-to-go.
- Moved the full batch-algorithm specification to Appendix G; retained the practical loss and code in the main lecture.
- Removed the repeated grid-policy appendix and repeated numerical variance appendix. The model and variance calculations now appear where used.
- Replaced the closing question wall with six selectable questions and answer reveals.

The deck has 61 main slides and 31 optional appendix/reference slides. The extra structure replaces repetition rather than adding another algorithm lecture.

## Navigation and figures

The footer shows the current section and its progress. Map opens slide 2. The six cards jump to the section starts. Compact maps on transition slides highlight the next question and are also clickable. Slidev's original hover controls are at the upper right so they do not cover the course navigation. Arrow-key navigation and presenter notes still work.

Slide 24 defaults to policy gradients. Select the other routes to compare the intermediate object being learned: a model, action values, or policy parameters. These are overlapping ideas, not an exhaustive partition. Actor–critic adds value prediction to policy optimization; model-based systems can also use actors and critics.

## Demo results and teaching prompts

**Navigation, slide 4.** Four East moves then four South moves reach G in eight actions, with return −8. A collision also costs −1. Entry into G costs −1 and terminates. The near-goal comparison on slide 14 starts at (3,4): East gives return −1; North, East, South gives −3. Markov prediction does not erase those future consequences.

**Discounting, slide 17.** At gamma=1, eight and twelve moves give −8 and −12; an endless loop gives −infinity. At gamma=.9, the route returns are about −5.695328 and −7.175705, and the loop has return −10. Discounting changes the objective. It is not required by the policy-gradient method itself. Bounded rewards and gamma<1 ensure convergence of the continuing sum.

**Shared policy, slide 23.** At theta=0, probabilities are all .25. At state (1,2), Set θ=1 gives features dx=.75, dy=.50 and scores [−.50, .50, −.75, .75] for N/S/W/E. Exponentiate and normalize to obtain probabilities; East is about .436979. Selecting another cell changes inputs; the slider changes shared weights. This is a restricted toy model, not a trained navigation controller. Function approximation supports generalization across states. It does not restore hidden information automatically.

**Exploration, slide 28.** Theta=0 gives p(A)=.5 and 50 expected selections of each action per 100 episodes. Favor A sets theta=4.6 and p(A)≈.990; B receives only about one expected selection. Expected counts are 100*pi(a), not actual sampled counts. No learning takes place in this slider. The learner only sees rewards for chosen actions, so probabilities control data coverage as well as current performance. Nonzero probabilities alone do not ensure adequate exploration.

**One update, slide 32.** Every button restarts at theta=0 and alpha=.4. They compare possible observations, not sequential updates. A/+3 gives gradient 1.5, new theta .6, and p(A)≈.645656. A/−1 and B/+1 each give gradient −.5, new theta −.2, and p(A)≈.450166. One episode can point away from the better action. The estimate is correct in expectation, not necessarily close on each sample.

**Seeded update demonstration, slide 34.** Each batch contains 64 fresh one-action episodes under fixed parameters; alpha=.4, seed=443. After 40 batches, p(A)≈.931658. The learner only uses sampled actions, observed rewards, and policy derivatives. The curve shows the sampled updates’ p(A). The separate numeric expected reward is calculated analytically as 1 + p and is not an input to learning. The reproduced curve describes one seed only. It does not establish reliable or monotonic improvement.

**Baseline variance, slides 46–50.** Reset to the same bandit, theta=0. Its three action–reward outcomes have probabilities .375, .125, .5. Uncentered gradients are 1.5, −.5, −.5, with mean .25. The definition on slide 48 explains each column in slide 49.

| Baseline | Gradients for A/+3, A/−1, B/+1 | Mean | Variance |
|---:|---|---:|---:|
| 0 | 1.5, −.5, −.5 | .25 | .9375 |
| 1.5 | .75, −1.25, .25 | .25 | .375 |
| 4 | −.5, −2.5, 1.5 | .25 | 1.9375 |

At b=0, variance is .375(1.5−.25)^2 + .125(−.5−.25)^2 + .5(−.5−.25)^2 = .9375. At b=1.5, it is .375(.75−.25)^2 + .125(−1.25−.25)^2 + .5(.25−.25)^2 = .375. Ask students to predict the effect before moving the slider. b=4 demonstrates that an arbitrary baseline need not help.

For N independent episodes at fixed theta and a fixed baseline, the batch-mean variance is single-episode variance/N. The 60% reduction in this example describes gradient variance at the same data budget, not a guaranteed improvement in learning speed or final reward. Subtracting a constant does not reduce the variance of rewards alone. It changes the variance of the product (G−b)*score because the score depends on the action.

**PPO clipping, slide 57.** With positive advantage +1, moving the ratio above 1.2 leaves the clipped score at 1.2. With negative advantage −1, moving below .8 leaves it at −.8. Moving in the harmful direction still worsens the objective. Clipping changes incentives; it does not impose a hard bound on realized probabilities or guarantee policy improvement.

**Review, slide 61.** Select a question, ask for an explanation, then reveal the answer. Switching questions hides the previous answer. Students should connect the objective, policy parameters, estimator, baseline, and data distribution in their own words.

## Important mathematical distinctions

- The MDP tuple describes the task even if the learner does not know its transition or reward rules. The start distribution and terminal rule are specified separately.
- G_t is return data, J(theta) is expected performance, and g-hat estimates a parameter gradient. The learning examples use complete finite episodes and gamma=1.
- REINFORCE differentiates the policy. It does not require a differentiable environment or a known transition model. The derivation assumes the environment has no direct dependence on theta.
- Basic REINFORCE's uncorrected expectation is under the current policy. After an update, the old batch retains the old sampling frequencies. Recomputing log-probability derivatives does not change those frequencies.
- In the old-p=.5/new-p=.8 bandit example, the unweighted old-data gradient has mean −.20 while the correct current-policy gradient is +.16. Action importance weights 1.6 and .4 restore +.16 in this one-state case.
- A fixed state-only baseline has zero expected score contribution. Hold it fixed in the actor derivative. Fitting a baseline from the very same sampled action/reward can require care for strict finite-sample unbiasedness.
- A value predictor fitted to complete returns is a Monte Carlo baseline and can have prediction error. The PPO paper’s actor–critic algorithm also uses value predictions to estimate advantages; bootstrapping is introduced in the appendix.
- PPO's action ratio is an importance-sampling weight inside a local surrogate. It does not fully correct changed state visitation or make a batch valid forever. Full-trajectory importance sampling requires a product of action ratios.
- TRPO introduced a KL-constrained approach in 2015. The 2017 PPO paper includes clipping and an adaptive KL-penalty variant. A fixed-reference KL penalty in later RLHF applications serves a different role from comparison with the recent collecting policy.
- For the exact start-state discounted objective, the return-to-go gradient includes an outer gamma^t. See Appendix D; do not silently omit it when switching objectives.

## Appendix map

| Slides | Material |
|---|---|
| 62 | Clickable topic index |
| 63–65 | Conditional expectation and total expectation |
| 66–69 | One-action REINFORCE, observed rewards, sigmoid derivatives |
| 70–72 | Trajectory distribution and gradient |
| 73–79 | Baseline cancellation, variance, action restriction, return-to-go |
| 80–81 | Discounted gradients and effective horizon |
| 82–85 | Importance sampling and the PPO surrogate |
| 86–89 | PPO clipping, KL controls, fixed references, GAE |
| 90 | Complete batch REINFORCE specification |
| 91–92 | Notation and sources |

The probability refresher uses the same bandit: conditional means 2 and 1 become the overall mean 1+p by averaging over actions. Total expectation does not require independence. In the sampled-reward proof, condition on the action, then take its fixed log-probability gradient outside the inner expectation.

## Sources

- [Nan Jiang, CS 443](https://nanjiang.cs.illinois.edu/cs443/), especially the MDP, function-approximation, and [policy-gradient slides](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf).
- [Sutton and Barto, Reinforcement Learning](https://www.incompleteideas.net/book/the-book-2nd.html), chapters 2, 3, and 13.
- [Williams, REINFORCE (1992)](https://link.springer.com/article/10.1007/BF00992696).
- [ProbabilityCourse, conditional expectation](https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php).
- Schulman et al., [TRPO (2015)](https://arxiv.org/abs/1502.05477), [PPO (2017)](https://arxiv.org/abs/1707.06347), and [GAE](https://arxiv.org/abs/1506.02438).
- Ouyang et al., [RL from human feedback (2022)](https://arxiv.org/abs/2203.02155), optional reference-policy context.

Detailed assumptions and teaching prompts remain in each slide's presenter notes.
