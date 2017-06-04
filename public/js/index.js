// This file runs setup() to create the front-end

import Population from './Population';
import defaultSeed from './data';
import { clearCanvas, drawLocations, clearListeners, makeTicker } from './utils';

// HTML ALREADY EXISTS
// ATTACH step, play/pause, restart
function setup () {
  const population = newCohort();
  initCanvas(population);
}

// how to acquire control values?
function newCohort () {
  // const size = document.getElementById('sizeSlide').value
  const size = 50;
  const pC   = 0.8;
  const pM   = 0.01;
  const seed = null || defaultSeed;
  const population = new Population(size, seed, pC, pM);

  return population;
}

function initCanvas (population) {
  const gCanvas = document.getElementById('genetic');
  const fCanvas = document.getElementById('fitness');
  const gCtx    = gCanvas.getContext('2d');
  const fCtx    = fCanvas.getContext('2d');

  const tickingFunc = makeTicker(gCanvas, gCtx, fCtx, population);
  initButtons(tickingFunc);

  const seed = null || defaultSeed;
  clearCanvas(gCtx, gCanvas);
  clearCanvas(fCtx, fCanvas);
  drawLocations(gCtx, seed);
}

function initButtons(tick) {
  const step    = document.getElementById('step');
  const play    = document.getElementById('play');
  const pause   = document.getElementById('pause');
  const reset   = document.getElementById('reset');
  const buttons = {step, play, pause, reset};

  addListeners(tick, buttons);
}

function addListeners(tick, {step, play, pause, reset}) {
  let tickInterval;
  const playTicking = () => {
    if (tickInterval) return;
    tickInterval = setInterval(tick, 0);
  };

  const pauseTicking = () => {
    clearInterval(tickInterval);
    tickInterval = null;
  };

  const resetTicking = () => {
    if (tickInterval) pauseTicking();
    clearListeners(step, play, pause, reset);
    setup(); // SETUP ONLY CALLED FOR INIT, AND FOR RESETS
  };

  step.addEventListener('click', tick);
  play.addEventListener('click', playTicking);
  pause.addEventListener('click', pauseTicking);
  reset.addEventListener('click', resetTicking);
}

setup();
