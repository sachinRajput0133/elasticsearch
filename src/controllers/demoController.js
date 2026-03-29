// ─────────────────────────────────────────────────────────────
// PROFILING DEMO — two endpoints: one fast, one deliberately slow
// The profiler will clearly show the slow function eating CPU
// ─────────────────────────────────────────────────────────────

// Slow: heavy synchronous CPU work (simulates bad code)
function slowSum(n) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += Math.sqrt(i) * Math.random(); // expensive per iteration
  }
  return total;
}

// Fast: same idea but tiny loop
function fastSum(n) {
  let total = 0;
  for (let i = 0; i < n; i++) {
    total += i;
  }
  return total;
}

const slowEndpoint = (req, res) => {
  const result = slowSum(5_000_000); // 5 million iterations
  res.json({ result, type: 'slow' });
};

const fastEndpoint = (req, res) => {
  const result = fastSum(100);
  res.json({ result, type: 'fast' });
};

module.exports = { slowEndpoint, fastEndpoint };
