# Slide map

79 slides: 48 main, 31 optional appendix slides.

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
| 10 | Example: different histories, the same prediction |
| 11 | Example: when position is not a sufficient state |
| 12 | Why discounting makes the return well-defined |
| 13 | Example: apply the discount weights |
| 14 | Episodic tasks: stop at a terminal state |
| 15 | Example: choose a reward that matches the task |
| 16 | How can we represent a policy? |
| 17 | A tabular policy stores one distribution per state |
| 18 | What happens when the grid becomes finer? |
| 19 | The grid's policy table: what could we share? |
| 20 | Specify the model before moving its parameter |
| 21 | One shared model produces the action probabilities |
| 22 | Where do policy gradients fit in RL? |
| 23 | Policy gradients: objective, estimator, and update |
| 24 | Episodic REINFORCE: the algorithm |
| 25 | One decision, two actions, then a reward |
| 26 | State value: expected return from a state |
| 27 | The policy controls both actions and data collection |
| 28 | The known reward rules let us check the objective |
| 29 | The one-action REINFORCE update |
| 30 | The two derivatives needed for our update |
| 31 | One sample, one parameter update |
| 32 | A batch averages the gradient contributions |
| 33 | REINFORCE demo: updates from fresh batches |
| 34 | Why basic REINFORCE collects a new batch |
| 35 | Old action frequencies can reverse the gradient |
| 36 | The same gradient idea extends to an episode |
| 37 | From one decision to a sequence of decisions |
| 38 | The complete-episode REINFORCE estimator |
| 39 | Weight each action by the rewards that follow it |
| 40 | Implement REINFORCE with a loss function |
| 41 | The code follows the return calculation and update |
| 42 | A baseline centers the return weight |
| 43 | Value and advantage: compare an action with its policy |
| 44 | From REINFORCE to PPO: reuse a batch carefully |
| 45 | Why trust a recent batch only near its collecting policy? |
| 46 | The PPO ratio reweights actions from the old policy |
| 47 | PPO-Clip: the objective and its advantage estimate |
| 48 | PPO clipping discourages excessive changes |
| 49 | Optional proofs and implementation reference |
| 50 | A.0 Conditional expectation: average within a group |
| 51 | A.0 The law of total expectation |
| 52 | A.0 Why the group averages give the overall mean |
| 53 | A. REINFORCE for one decision |
| 54 | A. Replace the mean reward with a sampled reward |
| 55 | A. Derivatives for the two-action policy |
| 56 | A. Numerical check of the expected gradient |
| 57 | B. The same argument applies to trajectories |
| 58 | B. Factoring the trajectory probability |
| 59 | B. Only policy factors contribute direct derivatives |
| 60 | C. What we need to show |
| 61 | C. The expected score is zero |
| 62 | C. Subtracting b leaves the mean unchanged |
| 63 | C. The bandit verifies the cancellation |
| 64 | C. The baseline changes gradient variance, not reward variance |
| 65 | C. An action-dependent baseline can remove the true signal |
| 66 | C. Why return-to-go preserves the expected gradient |
| 67 | D. Discounted return-to-go needs a time weight |
| 68 | D. Discounting and effective horizon |
| 69 | E. Importance sampling changes which distribution we average over |
| 70 | E. Reweighting fixes the bandit gradient |
| 71 | E. Correcting a whole trajectory needs a product of ratios |
| 72 | E. PPO reweights actions while retaining old state samples |
| 73 | F. The PPO-Clip objective |
| 74 | F. KL constraints and KL penalties |
| 75 | F. A reference-policy penalty serves a different purpose |
| 76 | F. How a critic can estimate advantages |
| 77 | G. Complete episodic REINFORCE |
| 78 | Notation reference |
| 79 | Sources and acknowledgments |
