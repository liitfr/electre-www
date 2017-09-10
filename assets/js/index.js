import TweenLite from 'TweenLite'; // eslint-disable-line
import AttrPlugin from 'AttrPlugin'; // eslint-disable-line
import electre from 'electre-js';

const params = {
  version: 'EI',
  inputData: {
    numberOfCriterias: 4,
    numberOfAlternatives: 5,
    criterias: ['g1', 'g2', 'g3', 'g4'],
    weights: [2, 1, 5, 3],
    alternatives: ['a1', 'a2', 'a3', 'a4', 'a5'],
    evaluations: [
      [150, 1, 20, 3000],
      [300, 0, 10, 0],
      [250, 0, 10, 2250],
      [110, 1, 20, 2800],
      [120, 1, 50, 1000],
    ],
    cThreshold: 0.7,
    dThreshold: 0.6,
  },
};

const calculation = electre.start(params.version, params.inputData);

calculation.then((result) => {
  console.log(result);
}, () => {

});

// -----------------------------------------------------------------------------
// Logo

const updateInterval = 1.351;
const logoSize = 200;
const radius = 100;

function generatePoint(index, logoSides) {
  const logoRadius = radius;
  const minRadius = radius * 0.9;
  const x = 0;
  const y = Math.ceil(minRadius + (Math.random() * (logoRadius - minRadius)));
  const angle = ((Math.PI * 2) / logoSides) * index;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);
  const tx = Math.floor(((x * cos) - (y * sin)) + (logoSize / 2));
  const ty = Math.floor((x * sin) + (y * cos) + (logoSize / 2));
  return { x: tx, y: ty };
}

function generate(mask, logoSides) {
  const path = (`M ${Array(...{ length: logoSides }).map((obj, index) => {
    const point = generatePoint(logoSides - index, logoSides);
    return `${point.x} ${point.y}`;
  }).join(' L ')} Z`);
  return path;
}

function flickLogo() {
  TweenLite.to('.polylogo', updateInterval, { attr: { d: generate(false, 40) }, onComplete: flickLogo });
}

if (document.getElementsByClassName('polylogo').length > 0) {
  document.querySelector('.polylogo').setAttribute('d', generate(false, 40));
  flickLogo();
}
