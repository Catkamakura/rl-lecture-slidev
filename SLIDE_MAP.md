# Slide map

| Slide | Topic | Section |
|---:|---|---|
| 1 | Reinforcement learning | Overview |
| 2 | Our route: from an RL task to a learning algorithm | Overview |
| 3 | A Markov decision process | Define the task |
| 4 | How an MDP generates experience | Define the task |
| 5 | A policy specifies the action choice | Define the task |
| 6 | The objective: maximize expected discounted return | Define the task |
| 7 | The Markov property | Define the task |
| 8 | Example: instantiate the navigation MDP | Define the task |
| 9 | Example: reward and return compare different quantities | Define the task |
| 10 | Example: expected return under a stochastic policy | Define the task |
| 11 | Example: different histories, the same prediction | Define the task |
| 12 | Example: when position is not a sufficient state | Define the task |
| 13 | Why discounting makes the return well-defined | Define the task |
| 14 | Example: apply the discount weights | Define the task |
| 15 | Episodic tasks: stop at a terminal state | Define the task |
| 16 | Example: choose a reward that matches the task | Define the task |
| 17 | From an MDP to a reinforcement-learning problem | Define the task |
| 18 | We have a task. What can the optimizer change? | Represent the policy |
| 19 | Start with a table: one policy row per state | Represent the policy |
| 20 | Why does a larger state space need more than a table? | Represent the policy |
| 21 | Function approximation: parameters shared across states | Represent the policy |
| 22 | Specify the model before moving its parameter | Represent the policy |
| 23 | Watch the same model compute its probabilities | Represent the policy |
| 24 | Where do policy gradients fit in RL? | Learn from samples |
| 25 | Policy gradients: objective, estimator, and update | Learn from samples |
| 26 | Episodic REINFORCE: the algorithm | Learn from samples |
| 27 | A one-decision MDP makes the update easier to see | Learn from samples |
| 28 | The policy controls both actions and data collection | Learn from samples |
| 29 | The known reward rules let us check the objective | Learn from samples |
| 30 | The one-action REINFORCE update | Learn from samples |
| 31 | The two derivatives needed for our update | Learn from samples |
| 32 | One sample, one parameter update | Learn from samples |
| 33 | A batch averages the gradient contributions | Learn from samples |
| 34 | REINFORCE demo: updates from fresh batches | Learn from samples |
| 35 | Why basic REINFORCE collects a new batch | Learn from samples |
| 36 | Old action frequencies can reverse the gradient | Learn from samples |
| 37 | The same gradient idea extends to an episode | Extend to trajectories |
| 38 | From one decision to a sequence of decisions | Extend to trajectories |
| 39 | The complete-episode REINFORCE estimator | Extend to trajectories |
| 40 | The two-action episode gives a numerical update | Extend to trajectories |
| 41 | REINFORCE with return-to-go | Extend to trajectories |
| 42 | The return weights are computed after the episode | Extend to trajectories |
| 43 | A negative weighted log loss implements gradient ascent | Extend to trajectories |
| 44 | The code follows the return calculation and update | Extend to trajectories |
| 45 | Unbiased gradients and noisy updates | Reduce gradient noise |
| 46 | Recall the bandit and its gradient estimator | Reduce gradient noise |
| 47 | Using expected return as the baseline | Reduce gradient noise |
| 48 | Variance: how far do estimates spread around their mean? | Reduce gradient noise |
| 49 | Calculate the variance as we change the baseline | Reduce gradient noise |
| 50 | Independent batches: variance and estimation error | Reduce gradient noise |
| 51 | Subtract a baseline without changing the mean gradient | Reduce gradient noise |
| 52 | A learned value function provides a baseline | Reduce gradient noise |
| 53 | From REINFORCE to PPO: reuse a batch carefully | Reuse recent experience |
| 54 | Why trust a recent batch only near its collecting policy? | Reuse recent experience |
| 55 | PPO weights actions by estimated advantage | Reuse recent experience |
| 56 | The PPO ratio reweights actions from the old policy | Reuse recent experience |
| 57 | PPO clipping discourages excessive changes | Reuse recent experience |
| 58 | KL divergence offers another way to limit policy change | Reuse recent experience |
| 59 | PPO retains the interaction-and-update loop | Reuse recent experience |
| 60 | Suggested project workflow | Reuse recent experience |
| 61 | Check the full argument | Reuse recent experience |
| 62 | Optional proofs and implementation reference | Appendix |
| 63 | A.0 Conditional expectation: average within a group | Appendix |
| 64 | A.0 The law of total expectation | Appendix |
| 65 | A.0 Why the group averages give the overall mean | Appendix |
| 66 | A. REINFORCE for one decision | Appendix |
| 67 | A. Replace the mean reward with a sampled reward | Appendix |
| 68 | A. Derivatives for the two-action policy | Appendix |
| 69 | A. Numerical check of the expected gradient | Appendix |
| 70 | B. The same argument applies to trajectories | Appendix |
| 71 | B. Factoring the trajectory probability | Appendix |
| 72 | B. Only policy factors contribute direct derivatives | Appendix |
| 73 | C. What we need to show | Appendix |
| 74 | C. The expected score is zero | Appendix |
| 75 | C. Subtracting b leaves the mean unchanged | Appendix |
| 76 | C. The bandit verifies the cancellation | Appendix |
| 77 | C. The baseline changes gradient variance, not reward variance | Appendix |
| 78 | C. An action-dependent baseline can remove the true signal | Appendix |
| 79 | C. Why return-to-go preserves the expected gradient | Appendix |
| 80 | D. Discounted return-to-go needs a time weight | Appendix |
| 81 | D. Discounting and effective horizon | Appendix |
| 82 | E. Importance sampling changes which distribution we average over | Appendix |
| 83 | E. Reweighting fixes the bandit gradient | Appendix |
| 84 | E. Correcting a whole trajectory needs a product of ratios | Appendix |
| 85 | E. PPO reweights actions while retaining old state samples | Appendix |
| 86 | F. The PPO-Clip objective | Appendix |
| 87 | F. KL constraints and KL penalties | Appendix |
| 88 | F. A reference-policy penalty serves a different purpose | Appendix |
| 89 | F. How a critic can estimate advantages | Appendix |
| 90 | G. Complete episodic REINFORCE | Appendix |
| 91 | Notation reference | Appendix |
| 92 | Sources and acknowledgments | Appendix |
