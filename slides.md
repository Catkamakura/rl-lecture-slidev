---
theme: default
title: Reinforcement Learning — MDPs, REINFORCE, and PPO
info: |
  Formal foundations, visual policy-gradient examples, and optional mathematical appendices.
author: CS 498 Robotics Team Project
class: cover
layout: default
canvasWidth: 1280
aspectRatio: 16/9
colorSchema: light
fonts:
  sans: Arial
  provider: none
transition: none
drawings:
  persist: false
mdc: true
download: false
---
# Reinforcement learning

<div class="sub">MDPs, policy gradients, and REINFORCE</div>
<p class="cover-question">Define the task.<br>Learn a policy from experience.</p>
MDPs define the task. Navigation illustrates the definitions.<br>
A small bandit makes the learning update visible.<br>
We finish with a short bridge from REINFORCE to PPO.
<div class="course">CS 498 · Robotics Team Project</div>

<!--
Overview. Slide 1.
This is a project-based introduction. Teach the main argument and work the sampled updates. Detailed derivations are optional appendix material. Students should already know expectation, derivatives, and gradient descent. Several concepts can share a slide when they form one explanation.
-->

---
class: structure
---
# Our route: from an RL task to a learning algorithm

<CourseMap />

<div class="takeaway">REINFORCE is the main worked algorithm. PPO is the closing connection.</div>

<!--
Overview. Slide 2.
Use this map to preview the argument. Define each concept first, then use the example to apply it. Click a card to jump to its section. Return using Map in the footer. The grid illustrates the MDP and objective; the bandit illustrates a gradient calculation. Proofs are optional appendix material.
-->

---
class: dense
---

# A Markov decision process

We begin with the **infinite-horizon discounted MDP** used in CS443:

$$
\mathcal M=(\mathcal S,\mathcal A,P,R,\gamma).
$$

| Component | Definition |
|---|---|
| $\mathcal S$ | Finite set of states |
| $\mathcal A$ | Finite set of actions |
| $P:\mathcal S\times\mathcal A\to\Delta(\mathcal S)$ | Distribution of the next state |
| $R:\mathcal S\times\mathcal A\to\mathbb R$ | Deterministic reward for a state–action pair |
| $\gamma\in[0,1)$ | Discount factor |

$\Delta(\mathcal S)$ is the set of probability distributions over states.

<p class="small">The process continues indefinitely. For evaluating a policy, also specify the start state or distribution <MathInline tex="S_0\sim\mu" />.</p>

<p class="small muted">Definition: <a href="https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf#page=2" target="_blank">CS443, MDPs, slide 2</a>.</p>

<!--
Introduce the mathematical model before any grid. P and R follow CS443 notation. Deterministic rewards are a deliberate starting assumption, not a restriction on all RL. Finite spaces make R bounded. The stochastic reward extension is introduced at the bandit. Use time zero and following-reward index t+1 consistently with the rest of this lecture.
Source: Nan Jiang, CS443 MDPs, printed slides 2–3, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# How an MDP generates experience

At time $t$, the agent sees $S_t$ and chooses $A_t$. The model then specifies:

$$
R_{t+1}=R(S_t,A_t),\qquad
S_{t+1}\sim P(\cdot\mid S_t,A_t).
$$

<InteractionLoop class="compact-loop" />

Repeating this interaction gives $S_0,A_0,R_1,S_1,A_1,R_2,\ldots$.

<p class="small">Uppercase denotes random quantities. Lowercase <MathInline tex="s_t,a_t,r_{t+1}" /> denotes observed values. <MathInline tex="R(s,a)" /> is the reward function; <MathInline tex="R_{t+1}" /> is the received reward.</p>

<!--
Read the conditional generation rule before the diagram. The reward is deterministic once the state and action are fixed, although its value across runs can vary when states or actions vary. P may still be stochastic. The model does not yet specify the agent’s action choice; the policy supplies that next.
Source: Nan Jiang, CS443 MDPs, printed slides 2, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# A policy specifies the action choice

A **deterministic policy** maps a state to an action: $\pi:\mathcal S\to\mathcal A$.

A **stochastic policy** maps a state to an action distribution:

$$
\pi:\mathcal S\to\Delta(\mathcal A),\qquad
A_t\sim\pi(\cdot\mid S_t).
$$

Thus $\pi(a\mid s)\geq0$ and $\sum_a\pi(a\mid s)=1$.

| What the policy specifies | What the MDP specifies |
|---|---|
| Which action to choose in each state | The next-state distribution and reward |

We first use **stationary policies**: the action rule depends on the current state, with no separate time index.

<!--
Define the policy independently of the example. A deterministic policy is a special case of a stochastic one with all probability on one action. Later function approximation parameterizes this mapping; it does not change the MDP definition. Finite-horizon policies may depend on time, addressed with the episodic extension.
Source: Nan Jiang, CS443 MDPs, printed slides 8, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# The objective: maximize expected discounted return

The **reward** $R_{t+1}$ scores one transition. The **return** counts the rewards from time $t$ onward:

$$
G_t=\sum_{k=0}^{\infty}\gamma^kR_{t+k+1}.
$$

For a fixed initial distribution $\mu$, the objective is

$$
\boxed{\max_\pi J(\pi)},\qquad
J(\pi)=\mathbb E_{\mu,\pi,P}[G_0].
$$

The expectation includes random initial states, action choices, and transitions.

**Actions affect future states and rewards.** The objective therefore concerns the full return.

<p class="small muted">CS443, MDPs, slides 2 and 8. The discount bound is developed below.</p>

<!--
State the objective before instantiating navigation. G_t is a random return; J is its expectation from the specified start distribution. In this deterministic-reward formulation there is no additional reward draw after conditioning on the state and action. Finite states/actions and gamma<1 ensure integrability. The received-reward indexing is offset from CS443’s r_t=R(s_t,a_t), but the objective is the same.
Source: Nan Jiang, CS443 MDPs, printed slides 2, 8, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# The Markov property

Let $H_t=(S_0,A_0,R_1,\ldots,S_t)$ be the history before action $A_t$.

The next-state distribution depends on the current state and action:

$$
\Pr(S_{t+1}\mid H_t,A_t)
=\Pr(S_{t+1}\mid S_t,A_t).
$$

Our reward rule also uses only this pair: $R_{t+1}=R(S_t,A_t)$.

<div class="takeaway">For a process with no action choice: knowing the whole history <MathInline tex="S_0,\ldots,S_t" /> gives no better prediction of the next state than knowing just <MathInline tex="S_t" />.</div>

<p class="small">This is predictive sufficiency. It does not say the next state is deterministic, or that future rewards can be ignored.</p>

<!--
The MDP model requires a sufficient state for its response distribution. The no-action wording preserves the instructor’s requested intuition; the displayed equation restores the action for controlled processes. The grid will demonstrate the assumption, and the consumable-food example will show when position alone fails it.
Source: Nan Jiang, CS443 MDPs, printed slides 21–22, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# Example: instantiate the navigation MDP

The grid below illustrates the preceding definition, using CS443’s navigation rules.

<div class="cols wide-right">
<NavGrid :size="300" :discount="0.99" interactive absorbing />
<div>

$\mathcal S=\{0,1,2,3,4\}^2$, $\mathcal A=\{\mathrm N,\mathrm S,\mathrm E,\mathrm W\}$.

Start at $(0,0)$; the goal is $(4,4)$. Set $\gamma=0.99$.

**Transitions:** move one cell. A boundary move leaves the position unchanged.

**Rewards:** $R(s,a)=-1$ outside G, and $R(\mathrm G,a)=0$.

**Absorbing goal:** once at G, every action stays there and gives zero reward.

</div>
</div>

<!--
The 5-by-5 illustration uses the dynamics/reward/discount choices on CS443 slide 5. In the infinite-horizon model the process does not terminate at G; it has a zero-reward absorbing tail. Demonstrate a boundary attempt, the eight-step route, and one additional zero-reward action at G. Entry into G still costs -1 because reward depends on the state before the action. The interactive readout is the discounted sum collected so far.
Source: Nan Jiang, CS443 MDPs, printed slides 5, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# Example: reward and return compare different quantities

The reward scores the next move. Return includes the continuation. Use $\gamma=0.99$ and start at $(3,4)$:

<div class="cols route-comparison">
<div><NavGrid mode="east" :size="200" near /><h3>East to G</h3><p>Rewards: −1, 0, 0, …<br>Return: −1</p></div>
<div><NavGrid mode="north" :size="200" near /><h3>North, East, South</h3><p>Rewards: −1, −1, −1, 0, …<br>Return: −1 − 0.99 − 0.99² = −2.9701</p></div>
</div>

Both first moves receive **−1**. Their illustrated continuations have different returns.

<div class="takeaway">The Markov property identifies the information needed for prediction. The objective still includes future rewards.</div>

<!--
Apply the reward and return definitions from slide 6 to two explicitly specified continuations. These are deterministic route calculations, not measured policy performance. Zero rewards after G make the infinite series terminate algebraically. The North route is one possible continuation, not every possible outcome of choosing North.
Source: Nan Jiang, CS443 MDPs, printed slides 5, 8, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# Example: expected return under a stochastic policy

The **state value** averages returns when the policy starts from a given state:

$$v_\pi(s)=\mathbb E_\pi[G_0\mid S_0=s].$$

At $s=(3,4)$, let $q=\pi(\mathrm E\mid s)$ and $1-q=\pi(\mathrm N\mid s)$.

After North, the policy takes East then South. The two possible returns are −1 and −2.9701.

<PolicyReturn />

<!--
The value definition precedes the calculation. The specified policy gives two paths without revisiting a nonterminal state: East directly, or North then East then South. It is therefore a valid stationary policy from the illustrated start. Other unreachable states can be assigned arbitrary actions. The slider manually sets q; it is not a learning algorithm. The expectation is exact for the specified policy and gamma=.99.
Source: Nan Jiang, CS443 MDPs, printed slides 8, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# Example: different histories, the same prediction

The Markov condition says that history adds no information once the current state and action are given.

| History from $(0,0)$ | Current state | Next action | Next state | Reward |
|---|---|---|---|---:|
| East, East, South, South | $(2,2)$ | East | $(3,2)$ | $-1$ |
| South, South, East, East | $(2,2)$ | East | $(3,2)$ | $-1$ |

For either history:

$$P((3,2)\mid(2,2),\mathrm E)=1,\qquad R((2,2),\mathrm E)=-1.$$

Position is sufficient for this grid because its transition and reward rules use no other changing information.

<!--
This is an application of the already-stated Markov assumption. The two paths are constructed examples. Checking only two histories would not prove the property in an unknown environment; here the known transition and reward definitions establish it for every history.
Source: Nan Jiang, CS443 MDPs, printed slides 5, 21, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# Example: when position is not a sufficient state

The state must retain information that affects the next reward or transition.

Now modify the task: one food cell gives **+1 on first arrival**, and 0 on later visits.

| Before entering the food cell | Reward on entry |
|---|---:|
| Food remains | $+1$ |
| Food was already collected | $0$ |

The same position and move can give different rewards. Include the missing information:

$$S_t=(\text{position},\ \text{food remains?}).$$

<p class="small muted">CS443’s consumable-food example. This is a modified task, with a different reward rule.</p>

<!--
The modeling requirement precedes the counterexample. With one food item and otherwise unchanged grid dynamics, position plus food status suffices. This is CS443’s example of deterministic coordinate dynamics with non-Markov coordinate-only rewards. Do not silently mix its reward rule into the navigation task.
Source: Nan Jiang, CS443 MDPs, printed slides 21–22, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# Why discounting makes the return well-defined

An infinite sum of rewards need not converge. For bounded rewards and $0\leq\gamma<1$:

$$
|R(s,a)|\leq R_{\max}
\quad\Longrightarrow\quad
|G_t|\leq\sum_{k=0}^{\infty}\gamma^kR_{\max}
=\frac{R_{\max}}{1-\gamma}.
$$

**Apply the bound to an endless grid loop:** every move gives −1.

| Objective | Return along this loop |
|---|---|
| No discount, $\gamma=1$ | $-1-1-\cdots=-\infty$ |
| Discount, $\gamma=0.99$ | $-1-0.99-0.99^2-\cdots=-100$ |

Discounting also changes the objective: later rewards have smaller weights.

<p class="small muted">CS443, MDPs, slides 6–8. The finite bound is why the initial formulation requires <MathInline tex="\gamma<1" />.</p>

<!--
Present the convergence result before the loop calculation. The bound follows from the triangle inequality and geometric series. Gamma=1 in this table is a comparison outside the initial discounted formulation, not a contradictory definition. Finite spaces make the deterministic reward function bounded. We do not claim a universal improvement in training speed from smaller gamma.
Source: Nan Jiang, CS443 MDPs, printed slides 6–8, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# Example: apply the discount weights

<ReturnExplorer />

<!--
This is a manual evaluation of stipulated routes using the return formula, not training. Begin at gamma=.99: eight moves give approximately -7.725531, twelve give -11.361513, and an endless loop gives -100. With gamma=.9 they are about -5.695328, -7.175705 and -10. The gamma=1 endpoint deliberately shows what happens without discounting: -8, -12 and negative infinity. Episodic undiscounted objectives are introduced on the next slide.
Source: Nan Jiang, CS443 MDPs, printed slides 6–8, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# Episodic tasks: stop at a terminal state

CS443 also considers **episodic MDPs**. A trajectory ends on reaching a terminal state after $T$ actions.

$$G_0=\sum_{t=0}^{T-1}\gamma^tR_{t+1}.$$

With finite expected absolute return, we may set $\gamma=1$.

In the navigation task with −1 per move and terminal G:

$$G_0=-T,\qquad J(\pi)=-\mathbb E_\pi[T].$$

| Moves to G | $3$ | $8$ | $12$ |
|---|---:|---:|---:|
| Undiscounted return | $-3$ | $-8$ | $-12$ |

**This is the convention for our REINFORCE examples:** complete episodes and $\gamma=1$.

<p class="small">For the step-cost grid, require <MathInline tex="\mathbb E_\pi[T]<\infty" />. Fixed deadlines may require time in the state.</p>

<!--
This is an explicit change of formulation, corresponding to CS443’s indefinite-horizon episodic model. With gamma1 and -1 steps, finite expected time ensures a finite expected return. A bounded episode length and bounded rewards are sufficient in the later demos. Keeping gamma=.99 and simply stopping the zero tail would not change the discounted return; setting gamma1 does change it. Do not identify expected discounted cost with negative expected moves.
Source: Nan Jiang, CS443 MDPs, printed slides 23–25, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# Example: choose a reward that matches the task

The reward and horizon define which behaviors the objective prefers.

Suppose the intended task is **reach G in as few moves as possible**, with $\gamma=1$.

| Reward rule | 8-move route | 12-move route |
|---|---:|---:|
| $0$ before the final move, then $+1$ | $G_0=1$ | $G_0=1$ |
| $-1$ for every move before termination | $G_0=-8$ | $G_0=-12$ |

The first rule gives these successful routes equal return. The second distinguishes their lengths.

<div class="takeaway">Check what the objective prefers before choosing a learning algorithm.</div>

<!--
The general task-formulation principle is stated before its two numerical illustrations. The two rows are alternative reward rules, not two feedback mechanisms of one environment. In this deterministic grid a final-entry reward can be expressed as a state-action function. These calculations concern objective preferences, not the behavior a trained algorithm is guaranteed to produce.
Source: Nan Jiang, CS443 MDPs, printed slides 6, 23, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: dense
---

# From an MDP to a reinforcement-learning problem

The MDP specifies the task. It need not be known to the learner.

| Access to the environment | How a policy can be sought |
|---|---|
| Known transition and reward model | Plan using $P$ and $R$ |
| Sampled interaction | Learn from observed states, actions, and rewards |

For navigation, a sampled transition might be

$$s_t=(0,0),\quad a_t=\mathrm N,\quad r_{t+1}=-1,\quad s_{t+1}=(0,0).$$

This supplies an outcome, not a label saying which action is correct.

The policy affects both **the return** and **which experience is collected**.

<!--
The planning-versus-learning distinction concerns the algorithm’s access to the model. A simulator designer may know the dynamics while the learning update receives only samples. The formal MDP definition alone does not constitute a learning algorithm. Use this as the transition to policy representation and the policy-gradient estimator. The North sample is a boundary collision from the previously defined grid.
Source: Nan Jiang, CS443 MDPs, printed slides 2, 5, https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf .
-->

---
class: structure dense
---
# We have a task. What can the optimizer change?

<CourseMap compact focus="policy" />

<div class="bridge-pair"><div><h3>Defined so far</h3><p>An MDP and its return objective.<br>A policy chooses the actions.</p></div><div><h3>Next question</h3><p>How can a table or a shared model represent a policy?</p></div></div>

For the learning examples, use complete finite episodes and $\gamma=1$:

$$
G_t=\sum_{k=t}^{T-1}R_{k+1},
\qquad \max_\pi J(\pi)=\max_\pi\mathbb E_\pi[G_0].
$$

We will replace “choose a policy” with **“learn its parameters θ.”**

<!--
Represent the policy. Slide 18.
This closes the modeling section by returning to the original optimization target. The demonstration episodes are finite by construction. Do not claim all gamma=1 navigation policies terminate. This is a recap and section transition, not a new objective.
-->

---
class: dense
---
# Start with a table: one policy row per state

A policy gives action probabilities: $\pi_\theta(a\mid s)$. **θ contains the learnable numbers.**

For a **tabular policy**, store one probability for each state–action pair:

$$
\pi_\theta(a\mid s)=\theta_{s,a},
\qquad \theta_{s,a}\geq0,\quad \sum_a\theta_{s,a}=1.
$$

| State in our grid | North | South | West | East |
|---|---:|---:|---:|---:|
| $(1,2)$ | $0.10$ | $0.20$ | $0.10$ | $0.60$ |
| $(2,2)$ | $0.25$ | $0.25$ | $0.25$ | $0.25$ |

Changing the first row leaves the second row unchanged.

<div class="takeaway">Our grid: 24 decision states × 4 actions = 96 stored probabilities.</div>

<!--
Represent the policy. Slide 19.
Source: Nan Jiang, CS 443, function approximation motivation: https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf . The source illustrates value approximation; this lecture applies the same scale and generalization motivation to a policy. The goal is terminal, so it needs no action row. Probabilities have row-sum constraints: 96 stored values are not 96 independent degrees of freedom. Tabular policies can instead use unconstrained logits and row-wise softmax; that is still tabular. Do not suggest all parameterized policies use function approximation with sharing. This simple direct-probability table explains the representation, not a proposed unconstrained gradient update.
-->

---
class: dense
---
# Why does a larger state space need more than a table?

Imagine extending navigation to a moving robot. Discretize four state variables:

<div class="bin-product"><div><span>Horizontal x</span><b>100</b><small>bins</small></div><i>×</i><div><span>Vertical y</span><b>100</b><small>bins</small></div><i>×</i><div><span>Heading</span><b>36</b><small>bins</small></div><i>×</i><div><span>Speed</span><b>10</b><small>bins</small></div></div>

$$
100\times100\times36\times10=3.6\text{ million state rows.}
$$

<div class="cols">
<div><h3>Storage</h3><p>Four actions need 14.4 million probabilities.<br>Finer bins make the table larger.</p></div>
<div><h3>Experience</h3><p>Separate rows need separate experience.<br>Updating one row leaves the others unchanged.</p></div>
</div>

<div class="takeaway">We want experience at one state to help at other states.</div>

<!--
Represent the policy. Slide 20.
Source: Nan Jiang, CS 443, function approximation motivation: https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf . The source illustrates value approximation; this lecture applies the same scale and generalization motivation to a policy. These bin counts are illustrative, not a benchmark claim. A continuous state space cannot be enumerated by a finite exact table. Discretization trades resolution for size. Even when storage fits, collecting sufficient experience at each separate row can be infeasible. This is the central motivation to emphasize.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# Function approximation: parameters shared across states

Replace separate rows with a **shared function**: a linear model or neural network.

<div class="flow-row"><div class="term">State features<br><MathInline tex="f(s)" /></div><span class="arrow">→</span><div class="term">Shared weights<br><MathInline tex="\theta" /></div><span class="arrow">→</span><div class="term">Action probabilities<br><MathInline tex="\pi_\theta(a\mid s)" /></div></div>

| Tabular policy | Shared function approximator |
|---|---|
| Stores a separate row for each state | Computes probabilities from state features |
| An update can change just one row | One weight change can affect many states |
| Unvisited rows have no direct experience | Can generalize to unvisited states |

For the next example, we choose **distance to the goal** as the shared features.

<div class="takeaway">An update can affect other states. It may improve or worsen their action choices.</div>

<!--
Represent the policy. Slide 21.
Source: Nan Jiang, CS 443, function approximation motivation: https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf . The source illustrates value approximation; this lecture applies the same scale and generalization motivation to a policy. Here function approximation means a restricted shared model for the policy, not approximating the physical state. Generalization is a possibility, not a guarantee: unsuitable features or sharing can harm performance. The number of weights is chosen by the model architecture rather than by enumerating all states. Tabular models can also be written as functions with one-hot inputs; the teaching contrast is independent rows versus meaningful sharing. The same principle applies to value functions, but this sequence focuses on policies.
-->

---
class: dense
---
# Specify the model before moving its parameter

For our grid, the goal is at $(4,4)$. Let the current state be $s=(x,y)$.

<div class="cols model-equations">
<div>

**1. Compute two features**

$$
d_x=\frac{4-x}{4},\qquad d_y=\frac{4-y}{4}.
$$

They describe the distance to the goal.

**2. Use one shared weight θ**

$$
\begin{aligned}
z_{\mathrm N}&=-\theta d_y,&z_{\mathrm S}&=\theta d_y,\\
z_{\mathrm W}&=-\theta d_x,&z_{\mathrm E}&=\theta d_x.
\end{aligned}
$$

These $z_a$ are action **scores**.

</div>
<div>

**3. Convert scores to probabilities**

$$
\pi_\theta(a\mid s)=\frac{e^{z_a}}{\sum_b e^{z_b}}.
$$

This conversion is called **softmax**.

- $\theta=0$: all four scores are zero; each probability is $1/4$.
- $\theta>0$: larger goal-distance features favor South and East.

</div>
</div>

<p class="small muted">Hand-designed teaching model. The next slider sets θ manually; no training occurs.</p>

<!--
Represent the policy. Slide 22.
Coordinates increase right and down. A state click changes dx and dy. A slider move changes theta, the only learnable parameter. The signs in the score formulas are hand-designed; they are not learned. South and East favor the goal because it is in the bottom-right corner. This family is deliberately restrictive, can waste boundary moves, and is not claimed to contain an optimal navigation policy. Scores are linear in the parameter; probabilities are nonlinear because of softmax. No neural network is needed for this example.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# Watch the same model compute its probabilities

<PolicyPlayground />

<!--
Represent the policy. Slide 23.
First leave theta at 0: every score is 0 and every exponential is 1. The denominator is 4, so all probabilities are .25. Press Set theta = 1 at state (1,2): dx=.75, dy=.50; scores N/S/W/E are -.5,.5,-.75,.75. Follow the East numerator through the denominator to its probability. Keep theta fixed and click state (4,2): dx becomes zero, so East and West tie. The grid click changes the input; the slider changes a shared weight. This is manual model exploration, not training. The actual REINFORCE update is taught with the bandit later.
-->

---
class: dense
---
# Where do policy gradients fit in RL?

All three routes aim to produce a good policy. Select a route to compare what it learns.

<RLLandscape />

<!--
Learn from samples. Slide 24.
Source: Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf . This is a conceptual map, not an exhaustive or mutually exclusive taxonomy. Model-based methods can also use value functions and policy optimization. We do not teach Bellman backups or Q-learning updates here. Actor–critic combines an explicit actor with value prediction.
-->

---
class: dense
---
# Policy gradients: objective, estimator, and update

Choose policy parameters to maximize expected return:

$$
J(\theta)=\mathbb E_{\pi_\theta}[G_0],
\qquad \text{goal: maximize }J(\theta).
$$

<div class="learning-cycle"><div>Run the<br>current policy</div><span>→</span><div>Observe actions<br>and returns</div><span>→</span><div>Estimate the<br>gradient</div><span>→</span><div>Update θ<br>and collect again</div></div>

| Symbol | Meaning |
|---|---|
| $\nabla_\theta J(\theta)$ | Exact gradient: an ascent direction when nonzero |
| $\hat g$ | Gradient estimate computed from sampled experience |

$$
\theta_{\mathrm{new}}=\theta+\alpha\hat g,
\qquad \alpha>0\text{ is the learning rate.}
$$

REINFORCE gives $\mathbb E[\hat g]=\nabla_\theta J$ under the appendix assumptions. **An update need not increase return.**

<!--
Learn from samples. Slide 25.
The hat means an estimate computed from random data. It is not an approximate-equality claim that one sample must be numerically close to the true gradient. For REINFORCE under the assumptions in the appendix, E[g-hat]=gradient J. Averaging independent samples under the same policy reduces variance. Function approximation describes the representation of pi; sampling describes how the gradient is estimated. These are two distinct uses of approximation. A gradient gives a first-order local direction; a noisy update or a large step need not improve J.
-->

---
class: dense
---
# Episodic REINFORCE: the algorithm

We use **episodic REINFORCE**, a Monte Carlo policy-gradient method. It estimates the gradient from complete current-policy episodes.

Each update combines:

| Experience supplies | The policy model supplies |
|---|---|
| The return after a sampled action | How θ affects that action's log-probability |

1. Run the policy and record actions and rewards.
2. Weight action log-probability gradients by returns.
3. Average over episodes, then update θ.

It is a **Monte Carlo** method: use sampled episodes to estimate an expectation.

<div class="takeaway">Differentiate the policy only. The environment supplies samples.</div>

<!--
Learn from samples. Slide 26.
This is the algorithm introduction, before its update formula. It needs differentiable policy probabilities and reward samples, not a differentiable environment. In the one-action example next, one episode is just one action and one reward.
Source: Williams (1992), Simple statistical gradient-following algorithms for connectionist reinforcement learning. https://link.springer.com/article/10.1007/BF00992696
-->

---
---
# A one-decision MDP makes the update easier to see

MDPs can also have **random rewards**. Specify their distribution for each state–action pair.

**Constructed example:** one decision state, actions A and B, then termination.

<div class="cols decision-options">
<div>

### Action A

Reward **+3** with probability 0.75.<br>
Reward **−1** with probability 0.25.

</div>
<div>

### Action B

Reward **+1** every time.

</div>
</div>

The learner observes only the action it sampled and that action's reward. Here $G_0=R_1$.

This is a **two-armed bandit** with objective $\max_\theta\mathbb E_{\pi_\theta}[R_1]$.

<p class="small">For random rewards, <MathInline tex="R(s,a)" /> denotes their conditional mean. We compute it below.</p>

<!--
Learn from samples. Slide 27.
Navigation explained sequential decision-making. We now temporarily remove the sequence to isolate how a reward changes a probability. The class can see the payout rules to check the derivation; the learning update receives only samples. These are constructed teaching values, not empirical results.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# The policy controls both actions and data collection

The same bandit uses one parameter θ. Let $p$ be the probability of A:

$$
p=\pi_\theta(\mathrm A)=\sigma(\theta)=\frac{1}{1+e^{-\theta}},
\qquad \pi_\theta(\mathrm B)=1-p.
$$

<ExplorationPolicy />

**Exploration** tries actions to learn their rewards. **Exploitation** favors actions that currently look better.

<p class="small">A nearly deterministic policy collects little evidence about the other action. Sampling helps exploration; it does not guarantee enough of it.</p>

<!--
Learn from samples. Slide 28.
Use theta=0, then the Favor A button. The bars show expected counts N*pi(a) in 100 independent one-step episodes at a fixed policy, not an actual rollout. Actual counts vary. The slider is manual parameter setting, not a learning update. Both actions receive data initially. The true reward means are unknown to the learner; the next slide reveals them for analysis. Exploration may be difficult even with nonzero action probabilities. Source: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 2.
-->

---
---
# The known reward rules let us check the objective

The true mean rewards are:

$$
\bar r(\mathrm A)=0.75(3)+0.25(-1)=2,
\qquad \bar r(\mathrm B)=1
$$

So the expected reward of the policy is:

$$
J(\theta)=p\cdot2+(1-p)\cdot1=1+p
$$

Here $\bar r(a)=R(s,a)$. The learner receives sampled rewards.

For finite θ, $J(\theta)<2$. It approaches 2 as $\theta\to\infty$; no finite θ attains it.

<!--
Learn from samples. Slide 29.
The bar distinguishes an unknown action mean from one observed reward. We use the known environment only to check what the correct gradient should be. REINFORCE will not insert these true means into its update.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# The one-action REINFORCE update

Sample action $a$ from the current policy and observe reward $r_1$. Here $G_0=r_1$.

$$
\boxed{\hat g=G_0\,\nabla_\theta\log\pi_\theta(a)},
\qquad \theta_{\mathrm{new}}=\theta+\alpha\hat g.
$$

| Factor | Meaning in this update |
|---|---|
| $G_0$ | Scalar score of this sampled episode |
| $\nabla_\theta\log\pi_\theta(a)$ | Direction that locally increases the sampled action's log-probability |
| $\hat g$ | Estimated gradient, with the same shape as θ |

At the sampled state, positive returns follow that gradient; negative returns reverse it.

Under the appendix assumptions, $\mathbb E[\hat g]=\nabla_\theta J$: **the estimate is correct on average**.

<p class="small">Why the logarithm gives the correct expected gradient is proved in Appendix A.</p>

<!--
Learn from samples. Slide 30.
Read the update before any proof. Do not imply that increasing raw positive-reward actions always improves J in one sample. Every action may receive a positive reward, and relative quality emerges in the expectation. A baseline later makes the comparison relative to expected performance.
Source: Williams (1992), Simple statistical gradient-following algorithms for connectionist reinforcement learning. https://link.springer.com/article/10.1007/BF00992696
-->

---
class: dense
---
# The two derivatives needed for our update

For our sigmoid policy, $p=\pi_\theta(\mathrm A)=\sigma(\theta)$ and $\pi_\theta(\mathrm B)=1-p$.

| Sampled action | Log-probability derivative | At $\theta=0$, so $p=0.5$ |
|---|---|---:|
| A | $\dfrac{d}{d\theta}\log\pi_\theta(\mathrm A)=1-p$ | $+0.5$ |
| B | $\dfrac{d}{d\theta}\log\pi_\theta(\mathrm B)=-p$ | $-0.5$ |

Increasing θ makes A more likely. Decreasing θ makes B more likely.

REINFORCE multiplies the derivative for the **sampled action** by its observed return:

$$
\hat g=G_0\times\text{the sampled action's log-probability derivative}.
$$

<p class="small">These two calculus results are derived in Appendix A. Next, use them to calculate an actual update.</p>

<!--
Learn from samples. Slide 31.
Supply the derivative results so the class can concentrate on applying the update. The chain-rule derivation is in the appendix. These are scalar derivatives because theta has one component in this example. The general gradient is a vector.
-->

---
---
# One sample, one parameter update

<BanditUpdate />

<!--
Learn from samples. Slide 32.
Choose A/+3, then A/-1, then B/+1. Each button resets the comparison to theta=0, rather than applying sequential updates. The direction is tied to the action that was actually sampled. Even B/+1 increases B probability under plain REINFORCE, while A is better on average. The later baseline example explains how centering changes individual contributions.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
---
# A batch averages the gradient contributions

**One possible batch:** four episodes collected with a frozen policy, $p=0.5$.

| Action | Reward | Log-probability derivative | Contribution |
|---|---:|---:|---:|
| A | $3$ | $+0.5$ | $+1.5$ |
| B | $1$ | $-0.5$ | $-0.5$ |
| A | $3$ | $+0.5$ | $+1.5$ |
| A | $-1$ | $+0.5$ | $-0.5$ |

$$
\hat g_{\mathrm{batch}}=\frac{1.5-0.5+1.5-0.5}{4}=0.5
$$

With $\alpha=0.4$, one update gives $\theta=0.2$ and $p\approx0.550$.

<!--
Learn from samples. Slide 33.
The positive reward for B reinforces B in that sample. Overall, A's larger rewards create a positive expected direction for theta. A baseline later makes relative performance explicit. This is an illustrative possible batch; do not update between rows.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
---
# REINFORCE demo: updates from fresh batches

<ReinforceDemo />

<p class="small">Each update uses 64 fresh one-action episodes, with <MathInline tex="\alpha=0.4" />.<br>This seeded run illustrates the update. It does not establish reliable improvement.</p>

<!--
Learn from samples. Slide 34.
This is actual sampled REINFORCE code, not a prerecorded curve. Start from reset, run one batch, then 20 batches twice. Seed 443 gives p(A)=.931658 after 40 batches. The expected reward 1+p is analytical evaluation only; the learner receives sampled rewards. Next we explain why the next batch uses the updated policy.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# Why basic REINFORCE collects a new batch

Recall the one-action gradient. Its expectation uses the **current policy**:

$$
\nabla_\theta J(\theta)
=\mathbb E_{\color{#d94d00}{A_0\sim\pi_\theta},\,R_1}
\!\left[R_1\nabla_\theta\log\pi_\theta(A_0)\right].
$$

1. Collect a batch with $\pi_{\mathrm{old}}$.
2. Take a gradient step. The action probabilities change.
3. The old batch still reflects $\pi_{\mathrm{old}}$, not the updated sampling probabilities.

Recomputing log-probability gradients on that batch does **not** change how its actions were sampled.

<div class="takeaway">Basic REINFORCE collects fresh trajectories to match the new policy. Reusing old data requires a correction or a different update objective.</div>

<!--
Learn from samples. Slide 35.
Source: Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf . This is about the uncorrected on-policy estimator used in the lecture. It is not a claim that every policy-gradient algorithm must discard data after one optimizer step. Old fixed gradients become stale; recomputing gradients on old samples changes the integrand but not their distribution. For trajectories, both action frequencies and visited states / continuations change. The next slide gives a one-state counterexample without those additional complications.
-->

---
class: dense
---
# Old action frequencies can reverse the gradient

Same bandit: $\pi_\theta(\mathrm A)=p=\sigma(\theta)$, $\pi_\theta(\mathrm B)=1-p$.

The batch was collected at $p_{\mathrm{old}}=0.5$. Now suppose $p=0.8$.

| Action | Mean reward | Collection probability | Current probability | Current log derivative |
|---|---:|---:|---:|---:|
| A | $2$ | $0.5$ | $0.8$ | $1-p=0.2$ |
| B | $1$ | $0.5$ | $0.2$ | $-p=-0.8$ |

**Using the old frequencies, without correction:**

$$
0.5(2)(0.2)+0.5(1)(-0.8)=-0.20.
$$

**The correct gradient under the current policy:**

$$
0.8(2)(0.2)+0.2(1)(-0.8)=+0.16.
$$

The mismatch persists even with an infinite old-policy batch. It is **bias**, not just sampling noise.

<!--
Learn from samples. Slide 36.
Source: Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf . This is an analytical comparison using conditional reward means, not a particular four-sample batch. At p=.8 the true derivative p(1-p) is .16. An unweighted expectation of R times the current score under old action probabilities is -.2. We compare fixed old and new parameters; the example does not claim one normal training step necessarily jumps from .5 to .8. Importance weights later correct these frequencies exactly in the one-step bandit.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: structure dense
---
# The same gradient idea extends to an episode

<CourseMap compact focus="episodes" />

<div class="bridge-pair"><div>

### One decision

$$\hat g=G_0\nabla_\theta\log\pi_\theta(a_0)$$

One sampled action contributes a gradient.

</div><div>

### Several decisions

<div class="episode-mini">action → action → … → end</div>

Which return should weight each action's contribution?

</div></div>

We will **sum action contributions**, then keep only each action's future rewards.

<p class="small">The objective stays <MathInline tex="J(\theta)=\mathbb E[G_0]" />. The example now has more than one decision.</p>

<!--
Extend to trajectories. Slide 37.
Ask students what changes when the episode is longer. The target is unchanged; the sampled trajectory has several log-probability factors. Avoid implying rewards arrive only at the end. The next timeline shows rewards after each action.
-->

---
class: dense
---
# From one decision to a sequence of decisions

In navigation and most projects, an episode contains several actions. Write the recorded sequence as a trajectory $\tau$:

$$
\tau=(s_0,a_0,r_1,s_1,a_1,r_2,\ldots,s_T).
$$

For a **constructed trace**, assume these two decisions and rewards:

| Time | State | Sampled action | Following reward |
|---|---|---|---:|
| 0 | $s_0$ | A | $r_1=0$ |
| 1 | $s_1$ | A | $r_2=4$, then terminate |

Here $T=2$ and $G_0(\tau)=0+4=4$. Both sampled decisions preceded the final reward.

<!--
Extend to trajectories. Slide 38.
The two-step trace is a generic recorded episode used to calculate an update. It is not a new navigation reward rule or a fully specified new benchmark. G_0(tau) means the scalar return of this particular trajectory. The environment can be unknown.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
---
# The complete-episode REINFORCE estimator

For a whole episode, add the log-probability gradients of its sampled actions:

$$
\hat g=\underbrace{G_0(\tau)}_{\text{episode return}}
\underbrace{\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t\mid s_t)}_{\text{trajectory log-probability gradient}}
$$

| Symbol | Meaning in this equation |
|---|---|
| $G_0(\tau)$ | One scalar: the total observed reward in the episode |
| $\hat g$ | The resulting estimate of the parameter-gradient vector |
| $T$ | Number of actions before termination |

The policy update is still $\theta_{\mathrm{new}}=\theta+\alpha\hat g$.

<!--
Extend to trajectories. Slide 39.
Return to the G-versus-g distinction explicitly. Multiplying a scalar return by a gradient vector produces a gradient estimate, not another return. Some texts label this estimator g without a hat. The formula is for gamma=1 here.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf The trajectory factorization proof is in Appendix B. In words: trajectory probabilities contain a product of action probabilities, and the logarithm changes that product into a sum.
-->

---
---
# The two-action episode gives a numerical update

Recall the recorded actions **A, A**, with rewards **0, 4**, so $G_0=4$.

Suppose both visited states use $\pi_\theta(\mathrm A\mid s)=\sigma(\theta)$ and $\theta=0$.

Each sampled A has derivative $1-p=0.5$. Therefore:

$$
\hat g=4(0.5+0.5)=4
$$

With learning rate $\alpha=0.1$:

$$
\theta_{\mathrm{new}}=0+0.1(4)=0.4,
\qquad p_{\mathrm{new}}=\sigma(0.4)\approx0.599
$$

<!--
Extend to trajectories. Slide 40.
The policy deliberately shares the same scalar parameter across the two visited states, so the two score derivatives add into one scalar gradient. We need only this sampled trace to compute its contribution; it is not proof that the whole policy improved. Alpha .1 is chosen here for a modest visible step.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# REINFORCE with return-to-go

Recall the three-move navigation route with rewards $-1,-1,-1$ and $\gamma=1$:

| Action | Already received | Rewards still to follow | Return-to-go |
|---|---|---|---:|
| North at $t=0$ | None | $-1,-1,-1$ | $G_0=-3$ |
| East at $t=1$ | $-1$ | $-1,-1$ | $G_1=-2$ |
| South at $t=2$ | $-1,-1$ | $-1$ | $G_2=-1$ |

A later action cannot affect rewards already received. Remove those terms without changing the expected gradient:

$$
\boxed{\hat g=\sum_{t=0}^{T-1}G_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)}.
$$

This is REINFORCE with **return-to-go**. An episode still gives noisy credit: a good return can follow an unhelpful action.

<!--
Extend to trajectories. Slide 41.
Use the familiar navigation trace only to identify which rewards remain at each time, not to claim these three samples train a complete navigation policy. Negative returns give negative sample weights; the expected update is still the gradient of the negative-step objective. Rewards from the past have zero expected score contribution conditional on pre-action history.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf This prevents an overly literal interpretation of reinforcing every successful-episode action. The next change is justified by causality, not by assuming we can infer the unique cause of success.
-->

---
---
# The return weights are computed after the episode

For $\gamma=1$, compute backward from the terminal state:

$$
G_T=0,\qquad G_t=R_{t+1}+G_{t+1}.
$$

| Calculation order for the three-move route | Return |
|---|---:|
| Terminal state | $G_3=0$ |
| Last action | $G_2=-1+0=-1$ |
| Second action | $G_1=-1+(-1)=-2$ |
| First action | $G_0=-1+(-2)=-3$ |

Store each return beside the log-probability of the action taken at that time.

<!--
Extend to trajectories. Slide 42.
This is why REINFORCE waits for complete episodes. The weighted log-probability needs the return from that action onward. A scalar return is a fixed weight in the policy derivative, not a differentiable simulation output.
-->

---
class: dense
---
# A negative weighted log loss implements gradient ascent

Collect $N$ complete episodes at fixed θ. Let $i$ index episodes and $t$ index their actions. Optimizers minimize a loss:

$$
L(\theta)=-\frac{1}{N}\sum_{i=1}^{N}\sum_{t=0}^{T_i-1}
G_{i,t}\log\pi_\theta(a_{i,t}\mid s_{i,t})
$$

Treat the sampled returns as fixed weights. Then:

$$
\nabla_\theta L=-\hat g_{\mathrm{batch}}
$$

A **plain SGD** step gives $\theta\leftarrow\theta+\alpha\hat g_{\mathrm{batch}}$. Adam or momentum changes the step rule.

<p class="small">Evaluate this gradient at the collection parameters. The loss value does not estimate expected return.</p>

<!--
Extend to trajectories. Slide 43.
The loss is a device for constructing the desired gradient. Its numerical value is not an estimate of J. The action log-probabilities carry gradients; sampled actions, rewards, and return weights are treated as data.
-->

---
class: dense
---
# The code follows the return calculation and update

Use plain SGD without momentum. Each episode stores `(reward, log_probability)` pairs.

```python
optimizer.zero_grad()
loss = 0
for episode in batch:
    G = 0
    for reward, logp in reversed(episode):
        G = reward + G                 # gamma = 1
        loss = loss - G * logp
loss = loss / len(batch)               # average episode sums
loss.backward()
optimizer.step()
```

Then collect new episodes with the updated policy.

<!--
Extend to trajectories. Slide 44.
The stored log probabilities must remain differentiable evaluations under the collection policy. Parameters stay fixed throughout collection. A real rollout samples actions and rewards, and stores the corresponding log probability. The sketch omits that plumbing so students can map every line to the estimator. Trace rewards [-1,-1,-1] through the inner loop. Returns should be [-3,-2,-1].
-->

---
class: structure dense
---
# Unbiased gradients and noisy updates

<CourseMap compact focus="baselines" />

<div class="bridge-pair"><div>

### What we can now implement

Collect episodes → compute returns → update θ.

Evaluate with **fresh episode returns**, not the training loss.

</div><div>

### What still varies

The sampled actions and their rewards change from run to run.

A single update can point in the wrong direction.

</div></div>

**Next:** recall the bandit, subtract a baseline, and measure the change in gradient variance.

<!--
Reduce gradient noise. Slide 45.
The bandit demo shows p(A) and an analytical expected reward because its model is known to the instructor. A general unknown environment instead needs sampled evaluation episodes. Do not interpret monotonic optimizer loss as monotonic task improvement. This transition distinguishes noisy gradient estimates from the scalar performance metric. Frozen-policy evaluation measures return on fresh episodes; do not use the weighted log loss as a return estimate.
-->

---
class: dense
---
# Recall the bandit and its gradient estimator

Return to the **one-decision bandit**. Reset the policy to $\theta=0$:

$$
\pi_\theta(\mathrm A)=p=\sigma(\theta)=\frac{1}{1+e^{-\theta}},\qquad
\pi_\theta(\mathrm B)=1-p,\qquad p=0.5.
$$

| Sampled action | Reward rule | Mean reward | Log-probability derivative at $\theta=0$ |
|---|---|---:|---:|
| A | $+3$ with probability $.75$; otherwise $-1$ | $2$ | $1-p=+0.5$ |
| B | Always $+1$ | $1$ | $-p=-0.5$ |

One episode has one reward, so $G_0=R_1$. The update is

$$
\hat g=G_0\,\frac{d}{d\theta}\log\pi_\theta(a),
\qquad \theta_{\mathrm{new}}=\theta+\alpha\hat g.
$$

Example: A gives $+3$. Then $\hat g=3(0.5)=1.5$.

With $\alpha=0.4$, $\theta_{\mathrm{new}}=0.6$. Next we change the **return weight** in this update.

<!--
Reduce gradient noise. Slide 46.
Explicitly return to the bandit, rather than the earlier four-action grid model. The bandit uses one sigmoid probability; the grid used a four-action softmax. Recall that +3 is one possible reward, not the expected reward of A. The reset matters because the live training demonstration may have ended with a different theta. The alpha=.4 example matches the one-sample bandit demonstration.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# Using expected return as the baseline

At $p=0.5$, the current policy's expected return is

$$
b=\mathbb E[G_0]=0.5(2)+0.5(1)=1.5.
$$

Replace the return weight in the same bandit update:

$$
\hat g_b=(G_0-b)\,\frac{d}{d\theta}\log\pi_\theta(a).
$$

| Observed outcome | $G_0$ | $G_0-b$ | Resulting gradient $\hat g_b$ |
|---|---:|---:|---:|
| A gives $+3$ | $3$ | $+1.5$ | $(1.5)(0.5)=+0.75$ |
| B gives $+1$ | $1$ | $-0.5$ | $(-0.5)(-0.5)=+0.25$ |
| A gives $-1$ | $-1$ | $-2.5$ | $(-2.5)(0.5)=-1.25$ |

B gives a positive reward, but falls below the policy's average. Its centered update now decreases B's probability.

<!--
Reduce gradient noise. Slide 47.
This returns to the same bandit, rather than introducing a new task. The earlier positive B reward increased B's probability in plain REINFORCE. Subtracting a baseline gives a more direct better/worse-than-expected interpretation. Tie each centered return to the score derivative from the preceding recap. Increasing theta raises A and lowers B. This motivates relative feedback; the following slides separate unbiasedness from variance reduction.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense variance-definition
---
# Variance: how far do estimates spread around their mean?

For a scalar random quantity $X$ with mean $m=\mathbb E[X]$:

$$
\boxed{\operatorname{Var}(X)=\mathbb E[(X-m)^2]
=\sum_i p_i(x_i-m)^2.}
$$

Here $x_i$ is a possible value; $p_i$ is its probability.

For our bandit at $\theta=0$, the **uncentered gradient** has this distribution:

| Outcome | Probability $p_i$ | Gradient $x_i=\hat g_0$ |
|---|---:|---:|
| Choose A, receive +3 | $0.5\times0.75=0.375$ | $3(0.5)=1.5$ |
| Choose A, receive −1 | $0.5\times0.25=0.125$ | $(-1)(0.5)=-0.5$ |
| Choose B, receive +1 | $0.5\times1=0.5$ | $1(-0.5)=-0.5$ |

$$m=0.375(1.5)+0.125(-0.5)+0.5(-0.5)=0.25.$$

<!--
Reduce gradient noise. Slide 48.
This is variance of the gradient estimator, not variance of the reward. The scalar model avoids introducing covariance matrices. The outcome probabilities include both the policy probability and the reward probability. Two outcomes happen to give the same gradient; keeping them separate connects to the known bandit. Variance measures squared spread, in squared gradient units. It is not a guarantee on any one estimate.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# Calculate the variance as we change the baseline

<BaselineVariance />

<!--
Reduce gradient noise. Slide 49.
Start with b=0. The raw gradient values are 1.5, -.5, -.5 with probabilities .375, .125, .5. Their mean is .25 and variance .9375. Set b=1.5. The values become .75, -1.25, .25. The rare unlucky A outcome moves farther from the mean, but the more likely outcomes move closer. The probability-weighted squared deviations fall to .375, a 60% reduction. The mean remains .25. Set b=4 to show variance 1.9375: any baseline is not necessarily helpful. Subtracting a constant does not change reward variance; multiplying by the action-dependent score changes the gradient variance. Lower gradient variance makes a batch estimate more precise for the same number of episodes. The appendix gives the algebra and the independent-batch variance formula. Start at b=0. Sum the last column: .5859375+.0703125+.28125=.9375. Set b=1.5: .09375+.28125+0=.375. The exact mean remains .25. b=4 is a counterexample to the claim that every baseline helps. Quarter-step baselines produce variance terms with denominator at most 512, requiring up to nine decimal places. The variance itself needs up to six decimal places.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# Independent batches: variance and estimation error

Recall the batch update at fixed θ:

$$
\bar g_N=\frac1N\sum_{i=1}^N\hat g_b^{(i)},
\qquad \theta_{\mathrm{new}}=\theta+\alpha\bar g_N.
$$

For this bandit at θ = 0, use **independent episodes** and a fixed baseline:

$$
\mathbb E[\bar g_N]=0.25,
\qquad
\boxed{\mathbb E[(\bar g_N-0.25)^2]=\operatorname{Var}(\bar g_N)=\frac{\operatorname{Var}(\hat g_b)}{N}.}
$$

<div class="variance-budget"><div><h3>Without a baseline</h3><p>Single episode: <b>0.9375</b></p><div class="budget-track"><i style="width:100%"></i></div></div><div><h3>With b = 1.5</h3><p>Single episode: <b>0.3750</b></p><div class="budget-track"><i style="width:40%"></i></div></div></div>

For the same N, b = 1.5 gives **60% lower mean squared gradient error** at θ = 0.

<!--
Reduce gradient noise. Slide 50.
At N=10 the batch variances are .09375 and .0375. Var(theta_new | theta)=alpha^2 Var(batch gradient), with fixed alpha. The expected gradient is still .25. This compares gradient precision at a fixed policy; it is not a 60% guarantee about training speed or final reward. A baseline does not reduce Var(G) merely by subtracting a constant. It reduces Var((G-b)z), because z depends on the sampled action.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: dense
---
# Subtract a baseline without changing the mean gradient

For one complete episode, replace $G_t$ with $G_t-b(s_t)$:

$$
\hat g_b=\sum_{t=0}^{T-1}\bigl(G_t-b(s_t)\bigr)
\nabla_\theta\log\pi_\theta(a_t\mid s_t).
$$

<div class="cols">
<div>

**Which baseline is allowed?**

- It may vary with the state.
- Use the same $b(s)$ for all actions at that state.
- Fix it before collecting the batch.
- Hold it fixed in the actor derivative.

</div>
<div>

**What changes?**

- Individual sample updates change.
- The expected gradient stays the same.
- A suitable baseline can reduce variance.

</div>
</div>

<p class="small muted">The same conditions apply at every state. Appendix C proves that the expected gradient is unchanged.</p>

<!--
Reduce gradient noise. Slide 51.
Keep baseline values fixed during the policy gradient computation. The theorem concerns action-independent baseline functions; a fitted baseline correlated with the same sample can require extra care for strict finite-sample unbiasedness. We use a fixed exact baseline for the numerical example.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf Appendix C proves the result line by line. This slide states the condition and the estimator; no proof is required for the main lecture. Interpret the condition as a fixed state-only function during the gradient estimate. For strict unbiasedness, do not construct b from the very sampled action/reward it centers without accounting for that dependence.
-->

---
class: dense
---
# A learned value function provides a baseline

Recall the **state value** under the current policy:

$$
v_\pi(s)=\mathbb E_\pi[G_t\mid S_t=s].
$$

Fit $V_\phi(s)$ to observed returns. It estimates $v_\pi(s)$ and can have prediction error.

<div class="actor-critic"><div><h3>Actor: <MathInline tex="\pi_\theta(a\mid s)" /></h3><p>Chooses actions.<br>θ controls the policy.</p></div><div><h3>Value predictor: <MathInline tex="V_\phi(s)" /></h3><p>Predicts expected return.<br>φ controls the value prediction.</p></div></div>

Use the prediction as a baseline:

$$
G_t-V_\phi(s_t)
=\text{observed return}-\text{predicted return}.
$$

PPO uses a value predictor as its **critic**, typically with bootstrapping (Appendix F).

<!--
Reduce gradient noise. Slide 52.
A learned Monte Carlo baseline by itself does not require bootstrapping. Standard PPO is an actor-critic method and typically uses bootstrapped advantage estimates. Architectures may share feature layers; separate theta and phi here distinguish the optimization roles. Hold the baseline fixed when forming the actor gradient.
-->

---
class: structure dense
---
# From REINFORCE to PPO: reuse a batch carefully

<CourseMap compact focus="ppo" />

<div class="bridge-pair"><div><h3>What we have</h3><p>A policy-gradient update.<br>A critic can help estimate returns.</p></div><div><h3>What we want next</h3><p>Several updates from one recent batch.<br>Less new interaction per optimizer step.</p></div></div>

The old-data example showed a **sampling mismatch** after the policy changes.

**Proximal Policy Optimization (PPO)** uses probability ratios and discourages excessive policy changes.

<div class="takeaway">Reuse recent experience locally. Then collect fresh experience.</div>

<!--
Reuse recent experience. Slide 53.
Source: Schulman et al., Proximal Policy Optimization Algorithms (2017), sections 2–5, https://arxiv.org/abs/1707.06347 . Keep this at the high level. PPO uses an action likelihood ratio in a surrogate objective; it does not use an exact full-trajectory importance-sampled return gradient. PPO still needs fresh interaction after several passes through a recent batch. Critic details and exact objectives remain optional appendix material.
-->

---
class: dense
---
# Why trust a recent batch only near its collecting policy?

The batch contains samples from $\pi_{\mathrm{old}}$. The bars below are **illustrative probabilities at one state**.

The batch estimates how actions perform when followed by the old policy. A large change also changes later decisions and the states the agent visits.

<div class="policy-shifts">
<div><h3>Collection policy</h3><p><MathInline tex="\pi_{\mathrm{old}}=(0.50,\;0.50)" /></p><div class="split-bar"><span style="width:50%">A</span><i style="width:50%">B</i></div></div>
<div><h3>Smaller change</h3><p><MathInline tex="\pi_{\mathrm{new}}=(0.60,\;0.40)" /></p><div class="split-bar"><span style="width:60%">A</span><i style="width:40%">B</i></div></div>
<div><h3>Larger change</h3><p><MathInline tex="\pi_{\mathrm{new}}=(0.95,\;0.05)" /></p><div class="split-bar"><span style="width:95%">A</span><i style="width:5%"></i></div></div>
</div>

- Large changes can move the agent into states with little data.
- A noisy estimate can receive too much influence over repeated updates.

<div class="takeaway">The surrogate uses old-policy data. Clipping does not guarantee a trust region or a return increase.</div>

<!--
Reuse recent experience. Slide 54.
Source: Schulman et al., Proximal Policy Optimization Algorithms (2017), sections 2–5, https://arxiv.org/abs/1707.06347 . Source: Schulman et al., Trust Region Policy Optimization (2015), sections 2–4, https://arxiv.org/abs/1502.05477 . The probability bars illustrate change at one state, not measured performance or guaranteed safe thresholds. In the bandit, there are no changed future states, but finite-data noise and unstable weights still matter. In a multi-step MDP, the surrogate uses the collecting policy state distribution. Its local gradient matches the policy gradient with exact advantages and the proper time weighting, but its value is not the actual new-policy return. Close policy distributions can limit this mismatch under the theoretical assumptions; PPO clipping itself is not a hard trust-region guarantee.
-->

---
class: dense
---
# PPO weights actions by estimated advantage

An **advantage** asks: how much better is this action than the state's usual outcome?

$$
A^\pi(s,a)=Q^\pi(s,a)-v_\pi(s).
$$

Here $Q^\pi(s,a)$ is expected return after taking $a$ in $s$, then following $\pi$.

In the bandit at $p(\mathrm A)=0.5$, the state value is 1.5:

| Action | Expected reward | Advantage |
|---|---:|---:|
| A | $2$ | $2-1.5=+0.5$ |
| B | $1$ | $1-1.5=-0.5$ |

PPO uses an estimate $\hat A_t$:

- Positive: favor increasing the sampled action's probability.
- Negative: favor decreasing it.

<!--
Reuse recent experience. Slide 55.
True advantage is a conditional expectation. A realized return minus a baseline is a noisy estimate, not the true advantage itself. PPO commonly constructs estimates from critic predictions and generalized advantage estimation (GAE). The main lecture does not derive GAE. These conditional means come from the same bandit.
-->

---
class: dense
---
# The PPO ratio reweights actions from the old policy

For each recorded state–action pair, keep the old probability fixed:

$$
\rho_t(\theta)=\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\mathrm{old}}(a_t\mid s_t)}.
$$

This is an **importance-sampling weight** for the action at that state.

| Old probability | New probability | Ratio | Effect on this sample's weight |
|---:|---:|---:|---|
| $0.5$ | $0.4$ | $0.8$ | Decrease it |
| $0.5$ | $0.5$ | $1.0$ | Keep it |
| $0.5$ | $0.6$ | $1.2$ | Increase it |

The unclipped score is $\rho_t(\theta)\hat A_t$. The batch and advantage estimates stay fixed during these updates.

<p class="small">This ratio corrects action frequencies at recorded states. It does not fully correct the distribution of entire trajectories. The appendix derives the distinction.</p>

<!--
Reuse recent experience. Slide 56.
Source: Schulman et al., Trust Region Policy Optimization (2015), sections 2–4, https://arxiv.org/abs/1502.05477 . Source: Schulman et al., Proximal Policy Optimization Algorithms (2017), sections 2–5, https://arxiv.org/abs/1707.06347 . At a fixed state the ordinary importance identity is exact for a suitable integrand and sufficient support. PPO then clips a surrogate based on fixed old-policy state samples and advantage estimates. Clipping modifies the objective and is not an unbiased IS estimate of the new policy return. Preserve the old log-probability denominator throughout a PPO batch; replacing it with the newest policy would destroy this comparison.
-->

---
class: dense
---
# PPO clipping discourages excessive changes

PPO maximizes a **surrogate score** $L_t$. A larger score need not mean higher return. Here $\epsilon=0.2$.

<div class="cols clip-pair">
<div><h3>Positive advantage: increase probability</h3><ClipChart :adv="1" :initial="1" /></div>
<div><h3>Negative advantage: decrease probability</h3><ClipChart :adv="-1" :initial="1" /></div>
</div>

Beyond the threshold, further movement in the favored direction earns no additional score.

<p class="small">Clipping removes an incentive for further change. The actual probability ratio can still move beyond the threshold.</p>

<!--
Reuse recent experience. Slide 57.
Move the positive slider above 1.2: the clipped objective stops rising. Move the negative slider below .8: the clipped objective stops rising there. Then move each in the harmful direction to see why clipping is one-sided. The exact min/clip expression is in the appendix. The plots show a fixed sample and fixed advantage; other samples and shared parameters can still move its probability.
Source: Schulman et al. (2017), Proximal Policy Optimization Algorithms, https://arxiv.org/abs/1707.06347. PPO-Clip is the variant discussed here.
-->

---
class: dense
---
# KL divergence offers another way to limit policy change

**KL divergence** measures how different two action distributions are at a state. It is zero when they agree.

| Method | How it controls a policy update |
|---|---|
| TRPO (2015) | Approximately solves a problem with an average KL constraint |
| PPO with a KL penalty (2017) | Subtracts a KL penalty from the surrogate |
| PPO-Clip (2017) | Removes the incentive for excessive changes in selected action ratios |

For a KL penalty, the idea is

$$
\text{update score}=\text{surrogate score}-\beta\,\text{KL change},
\qquad \beta>0.
$$

Larger $\beta$ discourages more change. The penalty strength can adapt to a target KL.

<p class="small">The original PPO paper includes both clipping and an adaptive KL-penalty variant. The appendix compares these with later uses of a fixed reference policy.</p>

<!--
Reuse recent experience. Slide 58.
Source: Schulman et al., Trust Region Policy Optimization (2015), sections 2–4, https://arxiv.org/abs/1502.05477 . Source: Schulman et al., Proximal Policy Optimization Algorithms (2017), sections 2–5, https://arxiv.org/abs/1707.06347 . KL constraints predate PPO; adaptive KL penalties are in the original PPO paper rather than only later methods. The practical TRPO method approximately solves a constrained surrogate problem. A penalty is a tradeoff, not a guaranteed hard bound. PPO-Clip may also monitor KL and stop optimization early in implementations; do not present that optional safeguard as the definition of clipping. KL is asymmetric, so the appendix specifies its order.
-->

---
class: dense
---
# PPO retains the interaction-and-update loop

<div class="learning-cycle"><div>Collect a rollout<br>with <MathInline tex="\pi_{\mathrm{old}}" /></div><span>→</span><div>Use the critic<br>to estimate <MathInline tex="\hat A_t" /></div><span>→</span><div>Take several<br>clipped updates</div><span>→</span><div>Collect fresh data<br>with the new policy</div></div>

| Basic REINFORCE in this lecture | Typical PPO-Clip |
|---|---|
| Complete episodes provide returns | Critic helps estimate returns and advantages |
| One update per newly collected batch | Several minibatch passes over a recent rollout |
| Return-weighted log-probability gradient | Ratio-based clipped objective with advantage weights |

After several passes, PPO collects a new rollout. The ratio and clipping do not make one batch valid forever.

The PPO paper’s Algorithm 1 uses an **actor and a critic**.

<!--
Reuse recent experience. Slide 59.
The critic also receives its own regression updates. Entropy bonuses and early stopping by KL divergence are common practical additions, not covered in the main loop. PPO remains an on-policy family despite limited reuse within a collection iteration. Do not promise greater stability on every problem.
Source: Schulman et al. (2017), Proximal Policy Optimization Algorithms, https://arxiv.org/abs/1707.06347. PPO-Clip is the variant discussed here. Close the loop explicitly: reuse is limited to a recent batch, and the old policy snapshot is refreshed for the next collection phase.
-->

---
class: dense
---
# Suggested project workflow

<div class="project-stages"><div><b>1 · Define</b><p>State, actions, reward.<br>Termination and evaluation.</p></div><span>→</span><div><b>2 · Verify</b><p>Run a random policy.<br>Inspect one episode.</p></div><span>→</span><div><b>3 · Learn</b><p>Implement REINFORCE.<br>Check one update by hand.</p></div></div>

<div class="project-stages"><div><b>4 · Measure</b><p>Evaluate fresh episodes.<br>Repeat across random seeds.</p></div><span>→</span><div><b>5 · Compare</b><p>Compare a baseline.<br>Then try a PPO implementation.</p></div></div>

**Does the reward measure the behavior your project actually needs?**

<p class="small">A useful first plot compares learned-policy returns with a random-policy reference.</p>

<!--
Reuse recent experience. Slide 60.
This is a suggested development route, not a claim that the course assignment requires implementing PPO from scratch. For this project-based course, students should understand and debug the simpler algorithm before relying on a larger implementation. Evaluate fixed policies on fresh runs. A random-policy run helps expose environment, reward, and termination mistakes before debugging learning. PPO is a suggested comparison, not a requirement to implement it from scratch.
-->

---
class: dense
---
# Check the full argument

<ConceptCheck />

<p class="small muted">Explain the idea first. Then reveal an answer or use the footer to revisit that section.</p>

<!--
Reuse recent experience. Slide 61.
Answers: reward -1 and gamma1 give J=-E[T]; Markov is predictive sufficiency, not an immediate-reward objective; theta parameterizes the policy and shared weights can change predictions across states; return is scalar data, J is expected performance, g-hat estimates its parameter gradient; REINFORCE uses current-policy actions, their log-probabilities, and returns; a baseline centers, a critic predicts, clipping changes the update incentive. Invite a student to compute the A/+3 update. Ask the class before revealing. The controls reset the answer when switching questions.
-->

---
class: appendix dense
---
# Optional proofs and implementation reference

The main lecture uses the update rules. Open a topic to see why they work.

<AppendixMap />

<!--
Appendix. Slide 62.
Use these as optional board material or follow-up reading. Appendix C preserves the CS 443 baseline proof requested by the instructor.
-->

---
class: appendix dense
---
# A.0 Conditional expectation: average within a group

In our bandit, condition on **which action was chosen**:

| Chosen action | Possible rewards | Mean within this action |
|---|---|---|
| $A_0=\mathrm A$ | $+3$ with probability $.75$; $-1$ with probability $.25$ | $.75(3)+.25(-1)=2$ |
| $A_0=\mathrm B$ | Always $+1$ | $1$ |

$$
\mathbb E[R_1\mid A_0=\mathrm A]=2,
\qquad \mathbb E[R_1\mid A_0=\mathrm B]=1.
$$

More generally, $\mathbb E[X\mid Y=y]$ means **average $X$ among outcomes where $Y=y$**.

Write $m(y)=\mathbb E[X\mid Y=y]$. Before $Y$ is known, $m(Y)$ is itself random.

<div class="takeaway">The conditional mean is a group average, not a single observed reward.</div>

<!--
Appendix. Slide 63.
Source: ProbabilityCourse, Conditional Expectation: https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php . The bandit arithmetic is constructed for this lecture. Read the vertical bar as given. In the bandit m(A0) is 2 when A is chosen and 1 when B is chosen; it is not the random reward itself. Define this before applying the tower rule to a reward times a gradient. For continuous conditioning variables, use the corresponding conditional expectation; the simple discrete example is enough for this lecture.
-->

---
class: appendix dense
---
# A.0 The law of total expectation

For integrable $X$ and discrete $Y$, average within each group, then weight by its probability.

$$
\boxed{\mathbb E[X]=\sum_y\Pr(Y=y)\,\mathbb E[X\mid Y=y]
=\mathbb E_Y\!\left[\mathbb E[X\mid Y]\right].}
$$

In our bandit, let $\Pr(A_0=\mathrm A)=p$ and $\Pr(A_0=\mathrm B)=1-p$:

$$
\begin{aligned}
\mathbb E[R_1]
&=p\,\mathbb E[R_1\mid A_0=\mathrm A]
 +(1-p)\,\mathbb E[R_1\mid A_0=\mathrm B]\\[4pt]
&=p\cdot2+(1-p)\cdot1=1+p.
\end{aligned}
$$

At $p=0.5$, the overall mean reward is **1.5**.

<div class="takeaway">No independence assumption is needed. The group means may differ.</div>

<!--
Appendix. Slide 64.
Source: ProbabilityCourse, Conditional Expectation: https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php . The bandit arithmetic is constructed for this lecture. Also called the tower property or iterated expectation. State integrability: E[|X|] is finite for the general signed-variable result used here. The finite reward example satisfies this. If the student treats the inner expectation as a constant, return to m(Y): its value changes with Y. Later take X=R1 z_theta(A0) and Y=A0, applying the identity to each component of the gradient.
-->

---
class: appendix dense proof-wide
---
# A.0 Why the group averages give the overall mean

For finite discrete variables $X$ and $Y$:

$$
\begin{aligned}
\mathbb E[X]
&=\sum_x x\Pr(X=x)
&&\text{definition}\\[5pt]
&=\sum_x x\sum_y\Pr(X=x,Y=y)
&&\text{split by the groups }y\\[5pt]
&=\sum_y\Pr(Y=y)\sum_x x\Pr(X=x\mid Y=y)
&&\text{conditional probability; reorder}\\[5pt]
&=\sum_y\Pr(Y=y)\mathbb E[X\mid Y=y]
&&\text{mean within each group.}
\end{aligned}
$$

We will also use **taking a known factor out**:

$$
\mathbb E[c(Y)X\mid Y=y]=c(y)\,\mathbb E[X\mid Y=y].
$$

Once we condition on $Y=y$, the factor $c(y)$ is fixed.

<!--
Appendix. Slide 65.
Source: ProbabilityCourse, Conditional Expectation: https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php . The bandit arithmetic is constructed for this lecture. Terms for groups of probability zero can be omitted. Infinite sums require the usual integrability conditions to interchange them. The fixed-factor identity is ordinary linearity of expectation inside the conditional distribution. In the policy-gradient proof the known factor is z_theta(a), fixed once the action a is given. For a vector gradient, apply each identity component by component.
-->

---
class: appendix dense proof-wide
---
# A. REINFORCE for one decision

**Assumptions.** Finite actions, differentiable $\pi_\theta(a)>0$, integrable rewards, and no direct dependence of the environment on θ. Write $\bar r(a)=\mathbb E[R_1\mid A_0=a]$.

$$
\begin{aligned}
J(\theta)&=\sum_a\pi_\theta(a)\bar r(a),\\[2pt]
\nabla_\theta J(\theta)
&=\sum_a\bar r(a)\nabla_\theta\pi_\theta(a)
&&\text{differentiate the finite sum}\\[2pt]
&=\sum_a\pi_\theta(a)\bar r(a)\nabla_\theta\log\pi_\theta(a)
&&\text{use the identity below}\\[2pt]
&=\mathbb E_{A_0\sim\pi_\theta}
[\bar r(A_0)\nabla_\theta\log\pi_\theta(A_0)]
&&\text{definition of expectation.}
\end{aligned}
$$

**Log-derivative identity, from the chain rule:**

$$
\nabla_\theta\log\pi_\theta(a)=\frac{\nabla_\theta\pi_\theta(a)}{\pi_\theta(a)}
\quad\Longrightarrow\quad
\nabla_\theta\pi_\theta(a)=\pi_\theta(a)\nabla_\theta\log\pi_\theta(a).
$$

<!--
Appendix. Slide 66.
Read top to bottom as one mathematical proof. The reward mean is fixed while differentiating. The identity is a direct scalar chain rule applied to a positive probability with vector parameters. Positivity avoids division by zero; fixed support and regularity permit extensions. No mysterious missing factor is introduced.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf
-->

---
class: appendix dense proof-wide
---
# A. Replace the mean reward with a sampled reward

Write $z_\theta(a)=\nabla_\theta\log\pi_\theta(a)$. Once action $a$ is fixed, this factor is fixed.

Apply total expectation with $X=R_1z_\theta(A_0)$ and $Y=A_0$:

$$
\begin{aligned}
\mathbb E[R_1z_\theta(A_0)]
&=\sum_a\pi_\theta(a)\mathbb E[R_1z_\theta(a)\mid A_0=a]
&&\text{total expectation}\\[4pt]
&=\sum_a\pi_\theta(a)z_\theta(a)\mathbb E[R_1\mid A_0=a]
&&\text{take out the fixed factor}\\[4pt]
&=\sum_a\pi_\theta(a)z_\theta(a)\bar r(a)
&&\text{conditional mean reward}\\[4pt]
&=\nabla_\theta J(\theta)
&&\text{the preceding derivation.}
\end{aligned}
$$

Thus $\hat g=r_1\nabla_\theta\log\pi_\theta(a)$ is **unbiased**:

$$
\boxed{\mathbb E[\hat g]=\nabla_\theta J(\theta).}
$$

<!--
Appendix. Slide 67.
The first line is the law of total expectation. The second pulls out a deterministic vector after conditioning on the action. This proves the sample estimator instead of asking students to accept that an observed reward can replace a mean. Samples are from the current policy.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf The new probability refresher defines the law used in line 1 and the fixed-factor property in line 2. The equality is about an average over fresh action–reward samples at fixed theta, not equality of each individual sampled estimate to the gradient. Source: ProbabilityCourse, Conditional Expectation: https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php . The bandit arithmetic is constructed for this lecture.
-->

---
class: appendix dense
---
# A. Derivatives for the two-action policy

For $p=\sigma(\theta)$, we have $dp/d\theta=p(1-p)$. Thus

$$
\begin{aligned}
\frac{d}{d\theta}\log\pi_\theta(\mathrm A)
&=\frac{d}{d\theta}\log p
=\frac{1}{p}p(1-p)=1-p,\\[6pt]
\frac{d}{d\theta}\log\pi_\theta(\mathrm B)
&=\frac{d}{d\theta}\log(1-p)
=-\frac{1}{1-p}p(1-p)=-p.
\end{aligned}
$$

In the teaching bandit, $J=1+p$, so the exact gradient is $dJ/d\theta=p(1-p)$.

At $p=0.5$, this equals $0.25$. The next slide checks that sampled gradients have this mean.

<!--
Appendix. Slide 68.
This is the calculus behind the derivatives supplied in the main lecture. The same theta changes both action probabilities, and normalization forces the two derivatives to have opposite signs.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: appendix dense
---
# A. Numerical check of the expected gradient

At $p=0.5$, the outcomes and their probabilities are:

| Outcome | Probability | Sampled gradient $\hat g$ |
|---|---:|---:|
| A gives $3$ | $0.5\times0.75=0.375$ | $1.5$ |
| A gives $-1$ | $0.5\times0.25=0.125$ | $-0.5$ |
| B gives $1$ | $0.5$ | $-0.5$ |

$$
\mathbb E[\hat g]=0.375(1.5)+0.125(-0.5)+0.5(-0.5)=0.25
$$

This is the same +0.25 derivative we calculated from the known reward means.

<!--
Appendix. Slide 69.
Close the loop between the ideal-gradient calculation and the sample estimator. The previous four-example sample mean .5 is not supposed to equal this exact expectation on every batch. This slide is a useful pause for checking understanding.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: appendix dense
---
# B. The same argument applies to trajectories

For a recorded trajectory $\tau$, let $P_\theta(\tau)$ be its probability and $G_0(\tau)$ its fixed observed return.

$$
\begin{aligned}
J(\theta)&=\sum_\tau P_\theta(\tau)G_0(\tau),\\[3pt]
\nabla_\theta J
&=\sum_\tau G_0(\tau)\nabla_\theta P_\theta(\tau)\\[3pt]
&=\sum_\tau P_\theta(\tau)G_0(\tau)\nabla_\theta\log P_\theta(\tau)\\[3pt]
&=\mathbb E_{\tau\sim P_\theta}[G_0(\tau)\nabla_\theta\log P_\theta(\tau)].
\end{aligned}
$$

**Assumptions.** The environment and initial distribution are θ-independent. Policy support is fixed and positive. Returns are integrable; derivative and expectation interchange is valid. Use densities for continuous variables.

<!--
Appendix. Slide 70.
For a fixed finite horizon and finite spaces the displayed steps are straightforward finite sums. Random terminal times need appropriate integrability and derivative-interchange conditions. This accounts for the effects of actions on future rewards through their changed trajectory distribution.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf
-->

---
class: appendix dense
---
# B. Factoring the trajectory probability

For a two-action episode, its probability factors as:

$$
\begin{aligned}
P_\theta(\tau)
={}&\mu(s_0)\,\pi_\theta(a_0\mid s_0)\,p(s_1,r_1\mid s_0,a_0)\\
&\times\pi_\theta(a_1\mid s_1)\,p(s_2,r_2\mid s_1,a_1).
\end{aligned}
$$

| Factor | What it means |
|---|---|
| $\mu(s_0)$ | Probability of the initial state |
| $\pi_\theta(a_t\mid s_t)$ | Probability that the policy chooses the action |
| $p(s_{t+1},r_{t+1}\mid s_t,a_t)$ | Probability of the environment's response |

Here $p$ is the **joint** next-state and reward law. The deterministic-reward MDP is the special case

$$p(s',u\mid s,a)=P(s'\mid s,a)\,\mathbf 1\{u=R(s,a)\}.$$

<!--
Appendix. Slide 71.
The joint response kernel allows reward and next state to be correlated. The policy is Markov in its state representation. If the starting state is fixed, its initial-state factor is 1. This expression is for explanation; the learner does not need to evaluate the environment factors.
-->

---
class: appendix dense proof-wide
---
# B. Only policy factors contribute direct derivatives

For the general trajectory, take the logarithm of its probability factorization:

$$
\log P_\theta(\tau)=\log\mu(s_0)
+\sum_{t=0}^{T-1}\log\pi_\theta(a_t\mid s_t)
+\sum_{t=0}^{T-1}\log p(s_{t+1},r_{t+1}\mid s_t,a_t).
$$

The first and last terms have zero derivative with respect to θ. Hence

$$
\nabla_\theta\log P_\theta(\tau)=\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(a_t\mid s_t).
$$

Substituting into the previous result gives

$$
\boxed{\nabla_\theta J=\mathbb E\!\left[G_0\sum_{t=0}^{T-1}\nabla_\theta\log\pi_\theta(A_t\mid S_t)\right]}.
$$

<!--
Appendix. Slide 72.
Hold the recorded trajectory fixed in the derivative. The environment may be unknown or nondifferentiable; the policy likelihoods remain differentiable. Their log gradients can be computed without evaluating the environment factors.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf
-->

---
class: appendix dense
---
# C. What we need to show

Fix a state $s$ and the current policy parameters $\theta$. Define the action's score vector:

$$
z_\theta(a,s)=\nabla_\theta\log\pi_\theta(a\mid s)
$$

Here $G$ is the sampled return from state $s$. We want:

$$
\mathbb E[(G-b(s))z_\theta(A,s)\mid s]
=\mathbb E[Gz_\theta(A,s)\mid s].
$$

By linearity, it is enough to prove $\mathbb E[b(s)z_\theta(A,s)\mid s]=0$.

Sample $A\sim\pi_\theta(\cdot\mid s)$. Fix $b(s)$ before sampling the action and reward.

<!--
Appendix. Slide 73.
This proof follows the baseline argument in Nan Jiang's CS 443 Policy Gradient slide labeled 7. Assume finite actions, differentiable policy probabilities with fixed support, and finite relevant expectations. The continuous-action version needs the corresponding differentiation-under-the-integral conditions. G can be a sampled return whose conditional mean is an action value.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf
-->

---
class: appendix dense
---
# C. The expected score is zero

Expand the conditional expectation over actions:

$$
\begin{aligned}
\mathbb E[z_\theta(A,s)\mid s]
&=\sum_a\pi_\theta(a\mid s)\nabla_\theta\log\pi_\theta(a\mid s)\\[8pt]
&=\sum_a\nabla_\theta\pi_\theta(a\mid s)\\[8pt]
&=\nabla_\theta\sum_a\pi_\theta(a\mid s)\\[8pt]
&=\nabla_\theta 1=0.
\end{aligned}
$$

The steps use the log-derivative identity, linearity of differentiation, and normalization of the policy probabilities.

<!--
Appendix. Slide 74.
Do this line by line on the board. The first line is an expectation under the policy that generated the action. The third and fourth lines are the essential cancellation: the total probability mass is always 1. This is not a claim that an individual action's score is zero.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf
-->

---
class: appendix dense
---
# C. Subtracting b leaves the mean unchanged

Because $b(s)$ does not depend on the sampled action:

$$
\mathbb E[b(s)z_\theta(A,s)\mid s]
=b(s)\mathbb E[z_\theta(A,s)\mid s]=0.
$$

Therefore:

$$
\begin{aligned}
\mathbb E[(G-b(s))z_\theta(A,s)\mid s]
&=\mathbb E[Gz_\theta(A,s)\mid s]\\
&\quad-\mathbb E[b(s)z_\theta(A,s)\mid s]\\
&=\mathbb E[Gz_\theta(A,s)\mid s].
\end{aligned}
$$

Average over visited states and sum over time. The same equality holds for the full episodic gradient estimator.

<!--
Appendix. Slide 75.
Use the law of total expectation for the state distribution. Its dependence on theta does not break this zero-mean identity, which is evaluated at a fixed current theta. The same argument allows a time-dependent state baseline. The baseline output is held fixed while computing the policy gradient; do not add a derivative through its prediction.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf
-->

---
class: appendix dense
---
# C. The bandit verifies the cancellation

At $p=0.5$, use $b=1.5$:

| Outcome | Probability | Raw $Gz$ | Centered $(G-b)z$ |
|---|---:|---:|---:|
| A gives $3$ | $0.375$ | $1.5$ | $0.75$ |
| A gives $-1$ | $0.125$ | $-0.5$ | $-1.25$ |
| B gives $1$ | $0.5$ | $-0.5$ | $0.25$ |

$$
\mathbb E[(G-b)z]=0.375(0.75)+0.125(-1.25)+0.5(0.25)=0.25
$$

The raw estimator also has mean 0.25. Here its variance falls from **0.9375** to **0.375** after centering.

Preserving the mean is guaranteed under the stated conditions. Reducing variance depends on the baseline choice.

<!--
Appendix. Slide 76.
Verify variance with E[X^2]-(E[X])^2. The raw second moment is 1, and the centered second moment is .4375. Both means are .25. This is a numerical illustration, not a claim that any baseline always improves variance.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: appendix dense proof-wide
---
# C. The baseline changes gradient variance, not reward variance

Fix a state and θ. Let $z=\nabla_\theta\log\pi_\theta(A\mid s)$, $\hat g_b=(G-b)z$. Assume finite second moments and $\mathbb E[\|z\|^2]>0$.

Because $\mathbb E[z]=0$, the mean gradient $m=\mathbb E[\hat g_b]$ does not depend on $b$.

The total squared spread around that mean is

$$
\mathbb E[\|\hat g_b-m\|^2]
=\mathbb E[(G-b)^2\|z\|^2]-\|m\|^2.
$$

Minimize the first term with respect to $b$:

$$
\frac{d}{db}\mathbb E[(G-b)^2\|z\|^2]
=-2\mathbb E[(G-b)\|z\|^2]=0
\quad\Longrightarrow\quad
b^*=\frac{\mathbb E[G\|z\|^2]}{\mathbb E[\|z\|^2]}.
$$

This minimizes variance of **one state’s contribution**. It need not minimize variance of a whole trajectory sum.

<!--
Appendix. Slide 77.
This slide derives a fixed-state result directly. Related primary analysis: Greensmith, Bartlett, and Baxter (2004), https://jmlr.org/papers/v5/greensmith04a.html . This is a fixed-state, single-score contribution calculation. Assume finite second moments and E[||z||²]>0. The expression is trace of gradient covariance for vector parameters, ordinary variance for a scalar parameter. It is not a global minimum-variance baseline formula for an arbitrary sum of dependent time-step contributions. In general b*=E[G||z||²]/E[||z||²], so v_pi(s)=E[G|s] is a useful predictor but not always the exact variance minimizer.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: appendix dense
---
# C. An action-dependent baseline can remove the true signal

In the same bandit, try $b(\mathrm A)=2$ and $b(\mathrm B)=1$.

Each baseline equals that action's mean reward. Thus $G-b(A)$ has conditional mean zero for each action, and the centered estimator has mean zero.

But the true policy gradient at $p=0.5$ is **0.25**.

The removed term is:

$$
\mathbb E[b(A)z(A)]=0.5(2)(0.5)+0.5(1)(-0.5)=0.25\ne0.
$$

We could not factor a single $b(s)$ out of the action expectation. That restriction is essential.

<!--
Appendix. Slide 78.
This is a counterexample to casually subtracting arbitrary action-dependent predictions. Specialized action-dependent control variates require correction terms. A learned state baseline is treated as fixed for the actor gradient, and training it on the same sample can require additional care for exact finite-sample unbiasedness.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: appendix dense
---
# C. Why return-to-go preserves the expected gradient

With $\gamma=1$, write $G_0=C_t+G_t$, where $C_t=R_1+\cdots+R_t$ is already known before action $A_t$.

Condition on the pre-action history $H_t$. Its current state is $S_t$, and $C_t$ is fixed:

$$
\begin{aligned}
\mathbb E[C_t\nabla_\theta\log\pi_\theta(A_t\mid S_t)\mid H_t]
&=C_t\sum_a\pi_\theta(a\mid S_t)\nabla_\theta\log\pi_\theta(a\mid S_t)\\
&=0.
\end{aligned}
$$

So replacing $G_0$ by $G_t$ in the time-$t$ contribution preserves its expectation. Summing over $t$ proves the return-to-go estimator.

<!--
Appendix. Slide 79.
This is the same zero-mean score identity used for baselines. The action distribution conditional on the history is the Markov policy at the current state. Past rewards may correlate with the current state, so unconditional independence would be an incorrect justification.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf
-->

---
class: appendix dense
---
# D. Discounted return-to-go needs a time weight

For $J(\theta)=\mathbb E[G_0]$ and

$$
G_t=\sum_{k=0}^{T-t-1}\gamma^kR_{t+k+1},
$$

the future part of $G_0$ after time $t$ is $\gamma^tG_t$. Therefore:

$$
\nabla_\theta J
=\mathbb E\!\left[\sum_{t=0}^{T-1}\gamma^tG_t
\nabla_\theta\log\pi_\theta(A_t\mid S_t)\right].
$$

The factor inside $G_t$ measures delay from time $t$. The outer $\gamma^t$ measures time from the episode's start.

<!--
Appendix. Slide 80.
The whole-episode estimator G_0 sum(score) remains valid for a discounted G_0. The outer gamma^t appears when removing past rewards and expressing the remaining discounted rewards relative to t. The main lecture consistently uses gamma=1 so these factors equal 1.
Sources: Sutton and Barto, Reinforcement Learning: An Introduction, Chapter 13; Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf
-->

---
class: appendix dense
---
# D. Discounting and effective horizon

For $|R_{t+1}|\leq R_{\max}$ and $0\leq\gamma<1$:

$$
\begin{aligned}
\left|\sum_{k=n}^{\infty}\gamma^kR_{t+k+1}\right|
&\leq R_{\max}\sum_{k=n}^{\infty}\gamma^k\\
&=\frac{R_{\max}\gamma^n}{1-\gamma}.
\end{aligned}
$$

The **sum of discount weights** is exactly $\sum_{k\geq0}\gamma^k=1/(1-\gamma)$. This common effective-horizon scale is 10 for $\gamma=0.9$ and 100 for $\gamma=0.99$.

It is a gradual weighting scale, not a hard cutoff or the same thing as episode length. The tail bound determines how much error a particular truncation permits.

<!--
Appendix. Slide 81.
The sum of weights is exactly 1/(1-gamma); calling it an effective horizon is an interpretation. An exponential decay time is -1/log(gamma), approximately this scale when gamma is close to 1. Gamma=1 has no finite discount horizon. This reasoning applies to the return objective regardless of how the policy is optimized.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: appendix dense
---
# E. Importance sampling changes which distribution we average over

We want an expectation under a **target** distribution $p$, but our samples come from $q$.

$$
\begin{aligned}
\mathbb E_{X\sim p}[f(X)]
&=\sum_x p(x)f(x)\\[3pt]
&=\sum_x q(x)\frac{p(x)}{q(x)}f(x)\\[3pt]
&=\mathbb E_{X\sim q}\!\left[w(X)f(X)\right],
\qquad w(x)=\frac{p(x)}{q(x)}.
\end{aligned}
$$

Each sample receives more weight if the target distribution would produce it more often.

**Support condition:** $q(x)>0$ wherever $p(x)>0$. The sampling distribution must cover the target.

<p class="small">Here <MathInline tex="p" /> and <MathInline tex="q" /> name general distributions. An importance weight can exceed 1; it is not itself a probability.</p>

<!--
Appendix. Slide 82.
Source: Schulman et al., Trust Region Policy Optimization (2015), sections 2–4, https://arxiv.org/abs/1502.05477 . This finite discrete identity is a direct change of measure. Continuous variables use densities and integrals. With integrability and coverage, the ordinary sample mean of w(X)f(X) is unbiased for the target expectation. It need not have low variance. For the bandit, q is pi_old and p is pi_theta; the reward distribution conditioned on action stays unchanged.
-->

---
class: appendix dense
---
# E. Reweighting fixes the bandit gradient

Recall the old batch at $p_{\mathrm{old}}=0.5$ and the new policy with $p=0.8$.

| Action | Old probability | New probability | Weight $\pi_\theta/\pi_{\mathrm{old}}$ |
|---|---:|---:|---:|
| A | $0.5$ | $0.8$ | $1.6$ |
| B | $0.5$ | $0.2$ | $0.4$ |

Using the reward means 2 and 1, the weighted old-data average gives the new mean reward:

$$
0.5(1.6)(2)+0.5(0.4)(1)=1.8.
$$

For fixed old and target policies, the weighted **expected gradient** is:

$$
0.5(1.6)(2)(0.2)+0.5(0.4)(1)(-0.8)=+0.16.
$$

Without the weights, the old-data gradient was $-0.20$.

<div class="takeaway">This equality holds in expectation. A finite weighted sample still has estimation error.</div>

<!--
Appendix. Slide 83.
We use reward means only to verify the expectation analytically. An implementation uses observed R, weight pi_new(A)/pi_old(A), and the current score derivative. At fixed old and target policies the weighted one-step score estimator is unbiased. In an adaptively selected policy trained on the same finite batch, expectation statements need the usual dependence qualifications. The example is the exact counterpart of the earlier wrong-sign calculation.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: appendix dense proof-wide
---
# E. Correcting a whole trajectory needs a product of ratios

Assume fixed old and target policies, θ-independent dynamics, and old-policy support covering the target. Environment factors cancel:

$$
W(\tau)=\frac{P_\theta(\tau)}{P_{\mathrm{old}}(\tau)}
=\prod_{t=0}^{T-1}\frac{\pi_\theta(a_t\mid s_t)}{\pi_{\mathrm{old}}(a_t\mid s_t)}.
$$

For the finite-episode objective $J(\theta)=\mathbb E_{P_\theta}[G_0]$, exact trajectory reweighting gives

$$
\nabla_\theta J(\theta)
=\mathbb E_{\tau\sim P_{\mathrm{old}}}\!\left[
W(\tau)G_0(\tau)\sum_t\nabla_\theta\log\pi_\theta(a_t\mid s_t)
\right].
$$

Products can become extreme: ten factors of $1.6$ give a weight of about $110$.

**PPO uses one action ratio per time step in a local surrogate.** It does not use this full-trajectory estimator.

<!--
Appendix. Slide 84.
Source: Nan Jiang, CS 443 Policy Gradient, https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf . Source: Schulman et al., Trust Region Policy Optimization (2015), sections 2–4, https://arxiv.org/abs/1502.05477 . Assume support, finite relevant moments, and permission to interchange derivative and expectation. This formula applies ordinary trajectory importance sampling to the already-derived REINFORCE gradient. Products can have high variance over long horizons; this is a possibility, not a claim that every product necessarily explodes. A single PPO ratio does not account for how preceding action changes altered the distribution of the current state.
-->

---
class: appendix dense proof-wide
---
# E. PPO reweights actions while retaining old state samples

At a fixed state $s$, the importance-sampling identity is exact:

$$
\mathbb E_{a\sim\pi_{\mathrm{old}}(\cdot\mid s)}
\!\left[\rho(a,s)A^{\mathrm{old}}(s,a)\right]
=\mathbb E_{a\sim\pi_\theta(\cdot\mid s)}
\!\left[A^{\mathrm{old}}(s,a)\right].
$$

But the recorded **states** still come from $\pi_{\mathrm{old}}$. For $\gamma=1$, consider the surrogate

$$
L_{\mathrm{sur}}(\theta)
=\mathbb E_{\tau\sim P_{\mathrm{old}}}
\!\left[\sum_t\rho_t(\theta)A^{\mathrm{old}}(s_t,a_t)\right].
$$

With exact advantages and the Appendix B assumptions, its gradient agrees locally:

$$
\left.\nabla_\theta L_{\mathrm{sur}}(\theta)\right|_{\theta=\theta_{\mathrm{old}}}
=\nabla_\theta J(\theta_{\mathrm{old}}).
$$

Farther away, $L_{\mathrm{sur}}$ need not track the actual return. PPO clips the surrogate and periodically collects new data.

<!--
Appendix. Slide 85.
Source: Schulman et al., Trust Region Policy Optimization (2015), sections 2–4, https://arxiv.org/abs/1502.05477 . Source: Schulman et al., Proximal Policy Optimization Algorithms (2017), sections 2–5, https://arxiv.org/abs/1707.06347 . This episode-sum convention aligns the gamma=1 start-state objective with the earlier lecture. In finite horizon tasks, time is included in the state as needed. The practical average over collected time steps differs by a batch scaling convention. Discounted start-state gradients require the corresponding time weighting discussed in the discount appendix. Equality requires exact old-policy advantages and the usual policy-gradient assumptions. At theta_old each ratio is 1 and its derivative is the score, recovering the on-policy gradient. Clipping intentionally modifies this surrogate away from theta_old; it is not an unbiased estimate of full new-policy return.
-->

---
class: appendix dense
---
# F. The PPO-Clip objective

For a recorded state–action pair, define $\rho_t(\theta)=\pi_\theta(a_t\mid s_t)/\pi_{\mathrm{old}}(a_t\mid s_t)$. PPO-Clip maximizes the batch average of

$$
L_t^{\mathrm{clip}}(\theta)=\min\!\left(
\rho_t(\theta)\hat A_t,\;
\operatorname{clip}(\rho_t(\theta),1-\epsilon,1+\epsilon)\hat A_t
\right).
$$

For a fixed advantage estimate:

$$
L_t^{\mathrm{clip}}=
\begin{cases}
\hat A_t\min(\rho_t,1+\epsilon),&\hat A_t\geq0,\\[3pt]
\hat A_t\max(\rho_t,1-\epsilon),&\hat A_t<0.
\end{cases}
$$

The old policy probabilities and advantage estimates stay fixed during these updates. A separate value loss trains the critic; implementations often add an entropy bonus.

<!--
Appendix. Slide 86.
The formula is the orange curve in the main lecture. Min matters: naively clipping the ratio in both directions loses the penalty for harmful moves. It is a surrogate objective on recent data, not an exact expression for the new policy return or a hard trust-region constraint.
Source: Schulman et al. (2017), Proximal Policy Optimization Algorithms, https://arxiv.org/abs/1707.06347. PPO-Clip is the variant discussed here.
-->

---
class: appendix dense
---
# F. KL constraints and KL penalties

For a recorded state, compare the full old and new action distributions:

$$
D_{\mathrm{KL}}(\pi_{\mathrm{old}}\|\pi_\theta)
=\sum_a\pi_{\mathrm{old}}(a\mid s)
\log\frac{\pi_{\mathrm{old}}(a\mid s)}{\pi_\theta(a\mid s)}.
$$

From $(0.5,0.5)$ to $(0.6,0.4)$, KL is about $0.0204$. To $(0.95,0.05)$, it is about $0.8304$.

Use matching averages over M recorded transitions:

$\bar L=M^{-1}\sum_t\rho_t\hat A_t$, $\quad\bar D_{\mathrm{KL}}=M^{-1}\sum_t D_{\mathrm{KL},t}$.

| Approach | Optimization problem |
|---|---|
| TRPO surrogate | Maximize $\bar L(\theta)$ subject to $\bar D_{\mathrm{KL}}\leq\delta$ |
| PPO with a KL penalty | Maximize $\bar L(\theta)-\beta\bar D_{\mathrm{KL}}$ |

The penalty version can increase $\beta$ when KL is too large, and decrease it when KL is too small.

<p class="small">KL is nonnegative and asymmetric. A penalty discourages change; it does not enforce a hard constraint.</p>

<!--
Appendix. Slide 87.
Source: Schulman et al., Trust Region Policy Optimization (2015), sections 2–4, https://arxiv.org/abs/1502.05477 . Source: Schulman et al., Proximal Policy Optimization Algorithms (2017), sections 2–5, https://arxiv.org/abs/1707.06347 . Main-lecture surrogate averages are understood with matching normalization in this schematic comparison; practical objectives use the same sampled-state averaging convention for the surrogate and KL term. TRPO approximately solves its constrained problem. The PPO paper section 4 specifies an adaptive beta schedule. Use natural logarithms for the numerical KL examples. Some implementations also stop PPO epochs early when a measured KL exceeds a target; this is an optional safeguard. An average on visited states does not directly constrain unseen states.
Evidence: constructed example or displayed algebra, recomputed by scripts/verify-lecture.mjs. No benchmark or general improvement claim follows.
-->

---
class: appendix dense
---
# F. A reference-policy penalty serves a different purpose

Later applications also use KL regularization. For example, RL from human feedback can penalize drift from a **fixed reference policy**.

| Comparison | Which policy is the reference? | Purpose |
|---|---|---|
| KL control during a policy update | Recent collection policy $\pi_{\mathrm{old}}$ | Limit change while reusing a batch |
| KL regularization to a reference | A chosen policy $\pi_{\mathrm{ref}}$, often held fixed | Discourage long-term drift from that policy |

For prompts $x\sim D$ and complete outputs $y\sim\pi_\theta(\cdot\mid x)$, one objective is

$$
\max_\theta\;\mathbb E_{x\sim D}\!\left[
\mathbb E_{y\sim\pi_\theta(\cdot\mid x)}[r(x,y)]
-\beta D_{\mathrm{KL}}\!\left(\pi_\theta(\cdot\mid x)\|\pi_{\mathrm{ref}}(\cdot\mid x)\right)\right].
$$

The reference penalty can coexist with PPO clipping. **Always specify which two policies the KL compares.**

<p class="small">This is optional context for later study. The main lecture's PPO ratio always uses the policy that collected the current batch.</p>

<!--
Appendix. Slide 88.
Source: Ouyang et al., Training language models to follow instructions with human feedback (2022), section 3.5 / equation 2, https://arxiv.org/abs/2203.02155 . The displayed objective is schematic: for language models, condition on prompts and compare output sequence distributions, often implementing the log-ratio as per-token rewards. InstructGPT adds a KL penalty relative to a supervised reference and, in one variant, an auxiliary pretraining objective not shown here. Do not confuse the fixed-reference forward KL shown here with the old-to-new KL used on the preceding slide. This penalty changes the task objective, whereas a moving old-policy trust-region term controls optimization steps.
-->

---
class: appendix dense
---
# F. How a critic can estimate advantages

One temporal-difference residual compares an observed transition with the critic's prediction:

$$
\delta_t=R_{t+1}+\gamma V_\phi(S_{t+1})-V_\phi(S_t).
$$

**Generalized advantage estimation (GAE)** combines residuals from one trajectory segment ending at time $K$:

$$
\hat A_t=\sum_{l=0}^{K-t-1}(\gamma\lambda)^l\delta_{t+l},
\qquad 0\leq\lambda\leq1.
$$

At a true terminal state, use zero continuation value. At an ordinary rollout cutoff, bootstrap from the critic at the next state.

Unlike basic REINFORCE, this can update from partial episodes. Accuracy now depends partly on the learned value estimates.

<!--
Appendix. Slide 89.
This is optional orientation, not a required derivation. Residuals and the sum must respect episode boundaries. Time-limit semantics depend on the task definition: only a genuine terminal state has zero continuation. Gamma discounts rewards; lambda controls the residual weighting. Neither is the PPO clipping parameter epsilon.
Source: Schulman et al. (2017), Proximal Policy Optimization Algorithms, https://arxiv.org/abs/1707.06347. PPO-Clip is the variant discussed here.
Source: Schulman et al., High-Dimensional Continuous Control Using Generalized Advantage Estimation, https://arxiv.org/abs/1506.02438
-->

---
class: appendix dense
---
# G. Complete episodic REINFORCE

1. **Collect $N$ complete episodes** with the current policy, holding its parameters fixed.
2. **Compute each return-to-go** from the observed rewards.
3. **Average the episode gradient contributions.**

$$
\hat g_{\mathrm{batch}}=\frac{1}{N}\sum_{i=1}^{N}\sum_{t=0}^{T_i-1}
G_{i,t}\nabla_\theta\log\pi_\theta(a_{i,t}\mid s_{i,t})
$$

4. **Update once:** $\theta\leftarrow\theta+\alpha\hat g_{\mathrm{batch}}$.
5. **Collect a fresh batch** using the updated policy.

<p class="small">Here <MathInline tex="\gamma=1" />. The N episodes are independent at fixed θ; i indexes episodes and t indexes actions.</p>

<!--
Appendix. Slide 90.
N is the number of episodes, and T_i is the number of actions in episode i. This averages episode sums for the expected episodic-return objective. Repeated optimization on a fixed old batch is not the algorithm being demonstrated.
Source: Williams (1992), Simple statistical gradient-following algorithms for connectionist reinforcement learning. https://link.springer.com/article/10.1007/BF00992696
-->

---
class: appendix dense
---
# Notation reference

| Symbol | Meaning |
|---|---|
| $S_t,A_t,R_{t+1}$ | State, action, following reward as random quantities |
| $s_t,a_t,r_{t+1}$ | Recorded samples |
| $P(s'\mid s,a),\ p(s',u\mid s,a)$ | Next-state law; joint next-state and reward law |
| $\pi_\theta(a\mid s)$ | Parameterized action-selection policy |
| $\tau,\ P_\theta(\tau)$ | Recorded trajectory and its probability |
| $T,\ G_t,\ G_0$ | Terminal time, return-to-go, whole-episode return |
| $J(\theta),\ \nabla_\theta J,\ \hat g$ | Objective, exact gradient, sampled gradient estimate |
| $N,\ i,\ \alpha,\ \gamma$ | Batch episode count, episode index, learning rate, discount |
| $b(s),\ v_\pi(s),\ V_\phi(s)$ | Baseline, true state value, learned value prediction |

<!--
Appendix. Slide 91.
G_0 and g-hat have different roles and generally different dimensions. A trajectory return G_0(tau) is the numerical return of a particular recorded episode. The action mean r-bar(a) used in the bandit is E[R_1|A_0=a].
-->

---
class: appendix dense sources-slide
---
# Sources and acknowledgments

<div class="cols">
<div>

**Foundations and function approximation**

Nan Jiang, [CS 443](https://nanjiang.cs.illinois.edu/cs443/): [MDPs](https://nanjiang.cs.illinois.edu/files/cs443s23/2_basic.pdf), [Function Approximation](https://nanjiang.cs.illinois.edu/files/cs443s23/7_td_fa.pdf), [Policy Gradients](https://nanjiang.cs.illinois.edu/files/cs443s24/10_pg.pdf).

**Probability and variance**

[Conditional Expectation](https://www.probabilitycourse.com/chapter5/5_1_5_conditional_expectation.php); [Greensmith et al., variance reduction](https://jmlr.org/papers/v5/greensmith04a.html).

**Policy optimization**

Williams, [REINFORCE (1992)](https://link.springer.com/article/10.1007/BF00992696).

Schulman et al., [TRPO (2015)](https://arxiv.org/abs/1502.05477), [PPO (2017)](https://arxiv.org/abs/1707.06347), [GAE](https://arxiv.org/abs/1506.02438).

</div>
<div>

**Notation and further reading**

Sutton and Barto, [Reinforcement Learning: An Introduction](https://www.incompleteideas.net/book/the-book-2nd.html), Chapters 2, 3, and 13.

OpenAI Spinning Up, [Introduction to Policy Optimization](https://spinningup.openai.com/en/latest/spinningup/rl_intro3.html).

Ouyang et al., [RL from human feedback (2022)](https://arxiv.org/abs/2203.02155).

**Original course lecture**

CS 498 Robotics Team Project.<br>Nancy M. Amato and Irving Solis.

Original presenters:<br>Robert Molina and Saketh Kantipudi.

</div>
</div>

<p class="small muted">Original lecture material is marked CC BY-NC-SA 4.0. This adaptation retains that license where applicable.<br>External sources retain their own terms.</p>

<!--
Appendix. Slide 92.
The supplied original Lecture 14 and the instructor's annotated slide images informed this revision. The original acknowledgment page credits Rahul Mangharam, Hongrui Zheng (lead), Matthew O’Kelly (lead), Johannes Betz (lead), Houssam Abbas, Joseph Auckley, Madhur Behl, Luca Carlone, Jack Harkins, Paril Jain, Kuk Jang, Paritosh Kelkar, Sertac Karaman, Dhruv Karthik, Nischal KN, Thejas Kesari, Matthew Lebermann, Kim Luong, Yash Pant, Varundev Shukla, Nitesh Singh, Siddharth Singh, Nandan Tumu, Zirui Zang, and many others.
Original license: https://creativecommons.org/licenses/by-nc-sa/4.0/
The numerical bandit and recorded two-action episode were constructed for teaching. The browser demonstration performs actual sampled updates with reproducible seed 443. The revision adds parameterized-policy, discount, sampled-update, and PPO clipping explorations.
-->
