# Slide map

| Slide | Topic | Section |
|---:|---|---|
| 1 | Reinforcement learning | Overview |
| 2 | Our route: from an RL task to a learning algorithm | Overview |
| 3 | Formal problem: a Markov decision process | Define the task |
| 4 | The navigation MDP | Define the task |
| 5 | Interaction generates states, actions, and rewards | Define the task |
| 6 | What makes this reinforcement learning? | Define the task |
| 7 | Transition and reward functions in this grid | Define the task |
| 8 | A policy specifies how the agent acts | Define the task |
| 9 | The objective: maximize expected return | Define the task |
| 10 | For navigation, this means minimizing expected moves | Define the task |
| 11 | The Markov property | Define the task |
| 12 | The MDP assumption, applied to navigation | Define the task |
| 13 | Choosing a state: what information must it contain? | Define the task |
| 14 | Same immediate reward, different future returns | Define the task |
| 15 | The reward function must express the task goal | Define the task |
| 16 | Why introduce a discount factor? | Define the task |
| 17 | How discounting scores the same navigation routes | Define the task |
| 18 | We have a task. What can the optimizer change? | Represent the policy |
| 19 | Start with a table: one policy row per state | Represent the policy |
| 20 | Why does a larger state space need more than a table? | Represent the policy |
| 21 | Function approximation shares what the policy learns | Represent the policy |
| 22 | Specify the model before moving its parameter | Represent the policy |
| 23 | Watch the same model compute its probabilities | Represent the policy |
| 24 | Where do policy gradients fit in RL? | Learn from samples |
| 25 | Policy gradients learn θ from experience | Learn from samples |
| 26 | REINFORCE: learn from complete sampled episodes | Learn from samples |
| 27 | A one-decision MDP makes the update easier to see | Learn from samples |
| 28 | The policy controls both actions and data collection | Learn from samples |
| 29 | The known reward rules let us check the objective | Learn from samples |
| 30 | The one-action REINFORCE update | Learn from samples |
| 31 | The two derivatives needed for our update | Learn from samples |
| 32 | One sample, one parameter update | Learn from samples |
| 33 | A batch averages the gradient contributions | Learn from samples |
| 34 | Repeated sampled updates learn a better policy | Learn from samples |
| 35 | Why basic REINFORCE collects a new batch | Learn from samples |
| 36 | Old action frequencies can reverse the gradient | Learn from samples |
| 37 | The same gradient idea extends to an episode | Extend to trajectories |
| 38 | From one decision to a sequence of decisions | Extend to trajectories |
| 39 | The complete-episode REINFORCE estimator | Extend to trajectories |
| 40 | The two-action episode gives a numerical update | Extend to trajectories |
| 41 | Each action can use only the rewards that follow it | Extend to trajectories |
| 42 | The return weights are computed after the episode | Extend to trajectories |
| 43 | A negative weighted log loss implements gradient ascent | Extend to trajectories |
| 44 | The code follows the return calculation and update | Extend to trajectories |
| 45 | REINFORCE works on average. Why are updates noisy? | Reduce gradient noise |
| 46 | Recall the bandit model and the update we are improving | Reduce gradient noise |
| 47 | A baseline compares the return with what was expected | Reduce gradient noise |
| 48 | Variance: how far do estimates spread around their mean? | Reduce gradient noise |
| 49 | Calculate the variance as we change the baseline | Reduce gradient noise |
| 50 | Why does lower variance help learning? | Reduce gradient noise |
| 51 | Subtract a baseline without changing the mean gradient | Reduce gradient noise |
| 52 | A critic learns the expected return from a state | Reduce gradient noise |
| 53 | From REINFORCE to PPO: reuse a batch carefully | Reuse recent experience |
| 54 | Why trust a recent batch only near its collecting policy? | Reuse recent experience |
| 55 | PPO weights actions by estimated advantage | Reuse recent experience |
| 56 | The PPO ratio reweights actions from the old policy | Reuse recent experience |
| 57 | PPO clipping discourages excessive changes | Reuse recent experience |
| 58 | KL divergence offers another way to limit policy change | Reuse recent experience |
| 59 | PPO retains the interaction-and-update loop | Reuse recent experience |
| 60 | From this lecture to a working project | Reuse recent experience |
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
