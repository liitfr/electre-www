/* global $ */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */

import TweenLite from 'TweenLite'; // eslint-disable-line
import AttrPlugin from 'AttrPlugin'; // eslint-disable-line
import dropdowns from 'ShoelaceDropDowns'; // eslint-disable-line
import tabs from 'ShoelaceTabs'; // eslint-disable-line
import electre from 'electre-js';
import csvtojson from 'csvtojson';

// -------------------------------------------------------------------------- //
// Load a dataset                                                             //
// -------------------------------------------------------------------------- //

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
  // had to add this because this code doesn't trigger input event catched below.
  $('#start-process').removeAttr('disabled');
});

// -------------------------------------------------------------------------- //
// Check if we can start to process data                                      //
// -------------------------------------------------------------------------- //

// On any form element, catch events
$('input, textarea').on('input', () => {
  const method = $('#method .checked').attr('id');
  const disabled = $('#start-process').is('[disabled]');
  let canStart = false;
  // checklist depends on method user wants to use
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

// -------------------------------------------------------------------------- //
// When user starts a new calculation                                         //
// -------------------------------------------------------------------------- //

$('#start-process').on('click', () => {
  // reset display
  $('#start-process, #processing, #kill-process').toggle();
  $('#errors').hide();
  $('#results').hide();
  // prepare data to be processed
  const data = {};
  const method = $('#method .checked').attr('id');
  let csvParser;
  // for each supported method
  switch (method) {
    case 'meth-EI':
      // define input data object
      data.cThreshold = Number($('#c-index').val());
      data.dThreshold = Number($('#d-index').val());
      data.numberOfCriterias = 0;
      data.numberOfAlternatives = 0;
      data.criterias = [];
      data.weights = [];
      data.alternatives = [];
      data.evaluations = [];
      // define callback for csvtojson's behavior, line by line
      csvParser = (csvRow, rowIndex) => {
        if (rowIndex === 0) {
          csvRow.shift();
          data.criterias = csvRow;
          data.numberOfCriterias = data.criterias.length;
        } else if (rowIndex === 1) {
          csvRow.shift();
          data.weights = csvRow.map(Number);
        } else {
          data.alternatives.push(csvRow[0]);
          csvRow.shift();
          data.evaluations.push(csvRow.map(Number));
          data.numberOfAlternatives += 1;
        }
      };
      break;
    default:
      break;
  }

  // ------------------------------------------------------------------------ //
  // Launch calculation !                                                     //
  // ------------------------------------------------------------------------ //

  // start convertion from csv to json
  new Promise((res) => {
    csvtojson({ noheader: true })
      .fromString($('#e-matrix').val())
      .on('csv', (csvRow, rowIndex) => {
        csvParser(csvRow, rowIndex);
      })
      .on('done', () => {
        res();
      });
  }).then(() => electre.start(method.split('-')[1], data))
    .then((res) => {
      // -------------------------------------------------------------------- //
      // Display results                                                      //
      // ---------------------------------------------------------------------//

      // empty everything first
      $('#list-kernel, #list-dominated').empty();
      $('#textarea-cred, #textarea-conc, #textarea-disc').val('');
      // insert fresh results
      res.kernel.forEach((val) => {
        $('#list-kernel').append(`<li>${val}</li>`);
      });
      res.dominated.forEach((val) => {
        $('#list-dominated').append(`<li>${val}</li>`);
      });
      const serializeMatrix = (matrix) => {
        let serializedArray = `alternatives, ${data.alternatives.join(', ')}\n`;
        matrix.forEach((val, i) => {
          serializedArray += `${data.alternatives[i]}, ${val.join(', ')}\n`;
        });
        return serializedArray;
      };
      $('#textarea-cred').val(serializeMatrix(res.credibility));
      $('#textarea-conc').val(serializeMatrix(res.concordance));
      $('#textarea-disc').val(serializeMatrix(res.discordance));
      $('#results').show();
      $('#start-process, #processing, #kill-process').toggle();
    }, (rej) => {
      // -------------------------------------------------------------------- //
      // Error handling                                                       //
      // ---------------------------------------------------------------------//

      $('#err-msg').text(rej.message);
      $('#errors').show();
      $('#start-process, #processing, #kill-process').toggle();
    });
});

// -------------------------------------------------------------------------- //
// copy feature                                                               //
// -------------------------------------------------------------------------- //

$('.copy').on('click', (ev) => {
  $('.copy-msg').remove();
  const copyTextarea = document.querySelector($(ev.target).attr('data-target'));
  copyTextarea.select();
  try {
    const successful = document.execCommand('copy');
    const msg = successful ? '<span class="copy-msg text-primary pad-l-sm">successful ✓</span>' : '<span class="copy-msg text-danger pad-l-sm">unsuccessful ✗</span>';
    $(ev.target).after(msg);
  } catch (err) {
    console.error('Oops, unable to copy');
  }
});

$('.tabs').on('hide', () => {
  $('.copy-msg').remove();
});

// -------------------------------------------------------------------------- //
// kill calculation                                                           //
// -------------------------------------------------------------------------- //

$('#kill-process').on('click', () => {
  electre.kill();
  // reset display
  $('#start-process, #processing, #kill-process').toggle();
  $('#errors').hide();
  $('#results').hide();
});

// -------------------------------------------------------------------------- //
// Logo                                                                       //
// -------------------------------------------------------------------------- //

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
