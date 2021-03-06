const test = require('ava'); // eslint-disable-line
const path = require('path');
const rimraf = require('rimraf'); // eslint-disable-line
const Spike = require('spike-core'); // eslint-disable-line

const p = path.join(__dirname, '..');

test.cb.before((t) => {
  rimraf(path.join(p, 'public'), () => { t.end(); });
});

// this test simply ensures your project compiles properly
// for more reliability, you'll want to edit or add your own tests

// this test is currently skiped because of an non-blocking issue with csvtojson package :
// Error: Can't resolve 'child_process'
// in '/home/mathias/dev-web/electre-www/node_modules/csvtojson/libs/core'
test.skip('compiles project with spike', (t) => {
  const project = new Spike({ root: p });
  return new Promise((resolve, reject) => {
    project.on('error', reject);
    project.on('warning', reject);
    project.on('compile', resolve);
    project.compile();
  }).then(() => { t.pass(); }, (err) => { t.fail(err.message); });
});
