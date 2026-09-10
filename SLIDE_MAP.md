# Slide map

80 slides: 49 main, 31 optional appendix slides.

| Page | Title |
|---:|---|
| 1 | Reinforcement learning |
| 2 | Our route: from an RL task to a learning algorithm |
| 3 | A Markov decision process |
| 4 | How an MDP generates experience |
| 5 | A policy specifies the action choice |
| 6 | The objective: maximize expected discounted return |
| 7 | The Markov property |
| 8 | Example: instantiate the navigation MDP |
| 9 | Example: reward and return compare different quantities |
| 10 | Example: expected return under a stochastic policy |
| 11 | Example: different histories, the same prediction |
| 12 | Example: when position is not a sufficient state |
| 13 | Why discounting makes the return well-defined |
| 14 | Example: apply the discount weights |
| 15 | Episodic tasks: stop at a terminal state |
| 16 | Example: choose a reward that matches the task |
| 17 | From an MDP to a reinforcement-learning problem |
| 18 | How can we represent a policy? |
| 19 | A tabular policy stores one distribution per state |
| 20 | Why does a larger state space need more than a table? |
| 21 | Function approximation: parameters shared across states |
| 22 | Specify the model before moving its parameter |
| 23 | One shared model produces the action probabilities |
| 24 | Where do policy gradients fit in RL? |
| 25 | Policy gradients: objective, estimator, and update |
| 26 | Episodic REINFORCE: the algorithm |
| 27 | One decision, two actions, then a reward |
| 28 | The policy controls both actions and data collection |
| 29 | The known reward rules let us check the objective |
| 30 | The one-action REINFORCE update |
| 31 | The two derivatives needed for our update |
| 32 | One sample, one parameter update |
| 33 | A batch averages the gradient contributions |
| 34 | REINFORCE demo: updates from fresh batches |
| 35 | Why basic REINFORCE collects a new batch |
| 36 | Old action frequencies can reverse the gradient |
| 37 | The same gradient idea extends to an episode |
| 38 | From one decision to a sequence of decisions |
| 39 | The complete-episode REINFORCE estimator |
| 40 | Weight each action by the rewards that follow it |
| 41 | Implement REINFORCE with a loss function |
| 42 | The code follows the return calculation and update |
| 43 | A baseline centers the return weight |
| 44 | Value and advantage: compare an action with its policy |
| 45 | From REINFORCE to PPO: reuse a batch carefully |
| 46 | Why trust a recent batch only near its collecting policy? |
| 47 | The PPO ratio reweights actions from the old policy |
| 48 | PPO-Clip: the objective and its advantage estimate |
| 49 | PPO clipping discourages excessive changes |
| 50 | Optional proofs and implementation reference |
| 51 | A.0 Conditional expectation: average within a group |
| 52 | A.0 The law of total expectation |
| 53 | A.0 Why the group averages give the overall mean |
| 54 | A. REINFORCE for one decision |
| 55 | A. Replace the mean reward with a sampled reward |
| 56 | A. Derivatives for the two-action policy |
| 57 | A. Numerical check of the expected gradient |
| 58 | B. The same argument applies to trajectories |
| 59 | B. Factoring the trajectory probability |
| 60 | B. Only policy factors contribute direct derivatives |
| 61 | C. What we need to show |
| 62 | C. The expected score is zero |
| 63 | C. Subtracting b leaves the mean unchanged |
| 64 | C. The bandit verifies the cancellation |
| 65 | C. The baseline changes gradient variance, not reward variance |
| 66 | C. An action-dependent baseline can remove the true signal |
| 67 | C. Why return-to-go preserves the expected gradient |
| 68 | D. Discounted return-to-go needs a time weight |
| 69 | D. Discounting and effective horizon |
| 70 | E. Importance sampling changes which distribution we average over |
| 71 | E. Reweighting fixes the bandit gradient |
| 72 | E. Correcting a whole trajectory needs a product of ratios |
| 73 | E. PPO reweights actions while retaining old state samples |
| 74 | F. The PPO-Clip objective |
| 75 | F. KL constraints and KL penalties |
| 76 | F. A reference-policy penalty serves a different purpose |
| 77 | F. How a critic can estimate advantages |
| 78 | G. Complete episodic REINFORCE |
| 79 | Notation reference |
| 80 | Sources and acknowledgments |
