// Simple load test script — hammers slow and fast endpoints
// Run: node scripts/load-test.js

const http = require('http');

function hit(path) {
  return new Promise((resolve) => {
    const start = Date.now();
    http.get(`http://localhost:3000/api/auth${path}`, (res) => { // routes mounted at /api/auth
      res.resume();
      res.on('end', () => resolve(Date.now() - start));
    });
  });
}

async function run() {
  console.log('Hitting /demo/fast 5 times...');
  for (let i = 0; i < 5; i++) {
    const ms = await hit('/demo/fast');
    console.log(`  fast → ${ms}ms`);
  }

  console.log('\nHitting /demo/slow 5 times...');
  for (let i = 0; i < 5; i++) {
    const ms = await hit('/demo/slow');
    console.log(`  slow → ${ms}ms`);
  }
}

run();
