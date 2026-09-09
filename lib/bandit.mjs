export const sigmoid = theta => 1 / (1 + Math.exp(-theta));

export function sampleGradient(action, reward, probabilityA) {
  const score = action === 'A' ? 1 - probabilityA : -probabilityA;
  return reward * score;
}

export function createRun(seed = 443) {
  return {
    seed: seed >>> 0,
    theta: 0,
    batch: 0,
    lastGradient: 0,
    lastReward: null,
    history: [{batch: 0, p: .5}],
  };
}

function random(run) {
  run.seed = (Math.imul(1664525, run.seed) + 1013904223) >>> 0;
  return run.seed / 4294967296;
}

export function runBatch(run, size = 64, alpha = .4) {
  // Freeze the collection policy for the whole batch.
  const p = sigmoid(run.theta);
  let gradientSum = 0;
  let rewardSum = 0;
  for (let i = 0; i < size; i++) {
    const action = random(run) < p ? 'A' : 'B';
    // These rules belong to the environment, not the learning update.
    const reward = action === 'A' ? (random(run) < .75 ? 3 : -1) : 1;
    gradientSum += sampleGradient(action, reward, p);
    rewardSum += reward;
  }
  run.lastGradient = gradientSum / size;
  run.lastReward = rewardSum / size;
  run.theta += alpha * run.lastGradient;
  run.batch += 1;
  run.history.push({batch: run.batch, p: sigmoid(run.theta)});
  return run;
}
