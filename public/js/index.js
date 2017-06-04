// This file runs setup() to create the front-end

/*
  WHAT NEXT:
    display and acquire control values for population generation
    invert and label fitness graph
    introduce elitism ? tournament select ?
    analytics
      most important:
        # generations
        fittest individual
*/
import Population from './Population';
import defaultSeed from './data';
import { clearCanvas, drawLocations, clearListeners, makeTicker } from './utils';

// RUN ONCE- call plain restart afterwards
function firstInit() {
  // shift origin to bottom left, Y axis draws up instead of down
  const gCanvas = document.getElementById('genetic');
  const fCanvas = document.getElementById('fitness');
  const gCtx    = gCanvas.getContext('2d');
  const fCtx    = fCanvas.getContext('2d');

  gCtx.transform(1, 0, 0, -1, 0, gCanvas.height);
  fCtx.transform(1, 0, 0, -1, 0, fCanvas.height);

  initControls();
  restart();
}

function initControls() {
  linkOutputElements(getInputElements());
}

function restart () {
  const population = newCohort(getInputElements());
  initCanvas(population);
}

// generate new cohort based on configured controls
function newCohort ({ popSizeIn, pCrossIn, pMutateIn }) {
  const size    = +popSizeIn.value;
  const pCross  = +pCrossIn.value;
  const pMutate = +pMutateIn.value;
  const seed = null || defaultSeed;

  return new Population(size, seed, pCross, pMutate);
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

  addButtonListeners(tick, buttons);
}

function addButtonListeners(tick, {step, play, pause, reset}) {
  let tickInterval;
  const playTicking = () => {
    if (tickInterval) return;
    const stepInterval = +document.getElementById('intervalIn').value;
    tickInterval = setInterval(tick, stepInterval);
  };

  const pauseTicking = () => {
    clearInterval(tickInterval);
    tickInterval = null;
  };

  const resetTicking = () => {
    if (tickInterval) pauseTicking();
    clearListeners(step, play, pause, reset);
    restart();
  };

  step.addEventListener('click', tick);
  play.addEventListener('click', playTicking);
  pause.addEventListener('click', pauseTicking);
  reset.addEventListener('click', resetTicking);
}

function linkOutputElements (controls) {
  Object.values(controls).forEach(input => {
    const outputId = `${input.id.slice(0, -2)}Out`;
    const output = document.getElementById(outputId);
    output.innerHTML = input.value;

    input.oninput = () => {
      output.innerHTML = input.value;
    };
  });
}

function getInputElements() {
  const intervalIn = document.getElementById('intervalIn');
  const popSizeIn  = document.getElementById('popSizeIn');
  const pCrossIn   = document.getElementById('pCrossIn');
  const pMutateIn  = document.getElementById('pMutateIn');
  return { intervalIn, popSizeIn, pCrossIn, pMutateIn };
}

firstInit();
