const fs = require('fs');
const content = fs.readFileSync('client/dist/assets/index-CXZL_Qw3.js', 'utf8');
const onrender = content.indexOf('onrender');
console.log('Index of onrender:', onrender);

// Find where /api is used
const idx = content.indexOf('/api');
console.log('Index of /api:', idx);
if (idx !== -1) {
  console.log('Context around /api:', content.substring(Math.max(0, idx - 100), idx + 200));
}
