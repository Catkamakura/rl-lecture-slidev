export const sigmoid = x => 1 / (1 + Math.exp(-x));
export function gridPolicyDetails(x, y, theta) {
  const dx = (4 - x) / 4, dy = (4 - y) / 4;
  const logits = [-theta * dy, theta * dy, -theta * dx, theta * dx];
  const peak = Math.max(...logits), weights = logits.map(v => Math.exp(v - peak));
  const total = weights.reduce((a, b) => a + b, 0);
  const exponentials = logits.map(v => Math.exp(v));
  const normalizer = exponentials.reduce((a, b) => a + b, 0);
  const probabilities = weights.map(v => v / total);
  return {dx, dy, logits, exponentials, normalizer, probabilities};
}
export function gridPolicy(x, y, theta) {
  return gridPolicyDetails(x, y, theta).probabilities;
}
export function routeReturn(length, gamma) {
  return -Array.from({length}, (_, k) => gamma ** k).reduce((a, b) => a + b, 0);
}
export function oneUpdate(theta, action, reward, alpha = .4, baseline = 0) {
  const p = sigmoid(theta);
  const score = action === 'A' ? 1 - p : -p;
  const gradient = (reward - baseline) * score;
  const nextTheta = theta + alpha * gradient;
  return {p, score, gradient, nextTheta, nextP: sigmoid(nextTheta)};
}
export function baselineMetrics(baseline) {
  const outcomes = [
    {label:'A gives +3', reward:3, probability:.375, score:.5},
    {label:'A gives −1', reward:-1, probability:.125, score:.5},
    {label:'B gives +1', reward:1, probability:.5, score:-.5},
  ].map(o => ({...o, raw:o.reward*o.score, gradient:(o.reward-baseline)*o.score}));
  const mean=outcomes.reduce((sum,o)=>sum+o.probability*o.gradient,0);
  for (const o of outcomes) o.varianceTerm=o.probability*(o.gradient-mean)**2;
  return {outcomes, mean, variance:outcomes.reduce((sum,o)=>sum+o.varianceTerm,0)};
}
