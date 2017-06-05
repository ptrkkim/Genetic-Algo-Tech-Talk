// Create front-end
/*
  WHAT NEXT:
    DONE display and acquire control values for population generation
    invert and label fitness graph
    introduce elitism ? tournament select ?
    DONE analytics
      most important:
        # generations
        fittest individual (shortest path so far, + drawing);
    future analytics?

  change seedData
  need to improve algorithm
    preserve 10% elite?
    or take best in pop and clone/mutate for first 10% of next pop?

  clear button should reset analytics
*/

import Population from './Population';
import { random40, smallSquare, createCircularPolygon } from './data';
import {
  getCanvasesAndContexts,
  clearCanvas,
  drawLocations,
  clearListeners,
  makeTicker,
  fitRouteToCanvas
} from './utils';

// FORGIVE THIS GLOBAL VARIABLE
const defaultSeed = createCircularPolygon(15);
// const defaultSeed = smallSquare;

firstInit(); // only thing this file actually does on load

function firstInit () {
  const { gCanvas, gCtx, fCanvas, fCtx, bCanvas, bCtx } = getCanvasesAndContexts();
  // DO ONCE!! shift origin to bottom left, Y axis draws up instead of down
  gCtx.transform(1, 0, 0, -1, 0, gCanvas.height);
  fCtx.transform(1, 0, 0, -1, 0, fCanvas.height);
  bCtx.transform(1, 0, 0, -1, 0, bCanvas.height);

  initControls();
  restart();
}

function initControls () {
  setDefaultConfig();
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
  const resized = fitRouteToCanvas(defaultSeed, 'gCanvas');
  return new Population(size, resized, pCross, pMutate);
}

function initCanvas (population) {
  const { gCanvas, fCanvas, bCanvas, gCtx } = getCanvasesAndContexts();

  const tickingFunc = makeTicker(population);
  initButtons(tickingFunc);

  const seed = population.getFittest().dna;

  clearCanvas(gCanvas);
  clearCanvas(fCanvas);
  clearCanvas(bCanvas);
  drawLocations(gCtx, seed);
}

function initButtons (tick) {
  const step    = document.getElementById('step');
  const play    = document.getElementById('play');
  const pause   = document.getElementById('pause');
  const reset   = document.getElementById('reset');
  const config  = document.getElementById('config');
  const buttons = { step, play, pause, reset, config };

  addButtonListeners(tick, buttons);
}

function addButtonListeners (tick, { step, play, pause, reset, config }) {
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
  config.addEventListener('click', setDefaultConfig);
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

function getInputElements () {
  const intervalIn = document.getElementById('intervalIn');
  const popSizeIn  = document.getElementById('popSizeIn');
  const pCrossIn   = document.getElementById('pCrossIn');
  const pMutateIn  = document.getElementById('pMutateIn');
  return { intervalIn, popSizeIn, pCrossIn, pMutateIn };
}

// who doesn't love some magic numbers
function setDefaultConfig () {
  const { intervalIn, popSizeIn, pCrossIn, pMutateIn } = getInputElements();

  intervalIn.value = 0;
  popSizeIn.value  = 50;
  pCrossIn.value   = 0.8;
  pMutateIn.value  = 0.01;
}
