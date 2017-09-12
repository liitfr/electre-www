/* global $ */

import TweenLite from 'TweenLite'; // eslint-disable-line
import AttrPlugin from 'AttrPlugin'; // eslint-disable-line
import dropdowns from 'ShoelaceDropDowns'; // eslint-disable-line
import tabs from 'ShoelaceTabs'; // eslint-disable-line
import electre from 'electre-js';
import csvtojson from 'csvtojson';

// Load a dataset
$('#show-example').on('click', (ev) => {
  ev.preventDefault();
  const method = $('#method .checked').attr('id');
  switch (method) {
    case 'meth-EI':
      $('#c-index').val(0.7);
      $('#d-index').val(0.6);
      $('#e-matrix').val('criterias, g1, g2, g3, g4\nweights, 2, 1, 5, 3\na1, 150, 1, 20, 3000\na2, 300, 0, 10, 0\na3, 250, 0, 10, 2250\na4, 110, 1, 20, 2800\na5, 120, 1, 50, 1000');
      break;
    default:
      break;
  }
  $('#start-process').removeAttr('disabled');
});

// Check if we can start to process data
// on any form element, catch events
$('input, textarea').on('input', () => {
  const method = $('#method .checked').attr('id');
  const disabled = $('#start-process').is('[disabled]');
  let canStart = false;
  // checks depend on method user wants to use
  switch (method) {
    case 'meth-EI':
      if ($('#c-index').val() && $('#d-index').val() && $('#e-matrix').val()) {
        canStart = true;
      }
      break;
    default:
      break;
  }
  // toggle `disabled` attr of "process" button
  if (canStart && disabled) {
    $('#start-process').removeAttr('disabled');
  } else if (!canStart && !disabled) {
    $('#start-process').attr('disabled', true);
  }
});

// when user wants to start process
$('#start-process').on('click', () => {
  $('#start-process, #processing, #kill-process').toggle();
  // convert csv to json
  // & start calculation once its done
  // numberOfCriterias
  // numberOfAlternatives
  // criterias
  // weights
  // alternatives
  // evaluations
  // cThreshold
  // dThreshold

  csvtojson({ noheader: true })
    .fromString('1,2,3\n4,5,6\n7,8,9')
    .on('csv', (csvRow) => { // this func will be called 3 times
      console.log(csvRow); // => [1,2,3] , [4,5,6]  , [7,8,9]
    })
    .on('done', () => {
      //parsing finished
    });
});


//
// const calculation = electre.start(params.version, params.inputData);
//
// calculation.then((result) => {
//   console.log(result);
// }, () => {
//
// });

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
