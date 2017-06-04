const Population = require('./Population');
const defaultSeed = require('./data');
// import?
// controls

// HTML ALREADY EXISTS
// ATTACH step, play/pause, restart

function initCanvas (population) {
  const gCanvas = document.getElementById('genetic');
  const fCanvas = document.getElementById('fitness');
  const gCtx = gCanvas.getContext('2d');
  const fCtx = fCanvas.getContext('2d');

  const tickFunc = makePopTick(gCanvas, gCtx, fCtx, population);
  initButtons(tickFunc);

  const seed = null || defaultSeed;
  clearCanvas(gCtx, gCanvas);
  clearCanvas(fCtx, fCanvas);
  drawLocations(gCtx, seed);

}

function drawLocations(ctx, locations) {
  const pxSize = 5;
  const offset = pxSize / 2;
  locations.forEach(location => {
    ctx.fillRect(location.x - offset, location.y - offset, pxSize, pxSize);
  });
}

function clearCanvas(ctx, canvas) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, 0);
}

function initButtons(tick) {
  const step = document.getElementById('step');
  const go = document.getElementById('go');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

  let tickInterval;

  step.addEventListener('click', tick);
  go.addEventListener('click', () => { tickInterval = setInterval(tick, 0); });
  stop.addEventListener('click', stopTicking);
  reset.addEventListener('click', () => {
    if (tickInterval) stopTicking();
    clearListeners(step, go, stop, reset);
    setup();
  });

  function stopTicking () {
    clearInterval(tickInterval);
    tickInterval = null;
  }
}

function clearListeners (...domNodes) {
  domNodes.forEach(domElement => {
    const clone = domElement.cloneNode(true);
    domElement.parentNode.replaceChild(clone, domElement);
  });
}
// create a ticker for each population,
// so they can each clear and draw on canvas on command
function makePopTick (canvas, gtx, ftx, population) {
  return function () {
    population.nextGen();
    population.genNumber += 1;

    const fittest = population.getFittest();
    population.fittestEver = fittest.getFitness() > population.fittestEver.getFitness()
      ? fittest
      : population.fittestEver;

    gtx.clearRect(0, 0, canvas.width, canvas.height);
    fittest.draw(gtx);
    drawFitness(ftx, population.genNumber, fittest.getFitness());
  };
}
// for init, reset
// how to acquire control values?
function newCohort () {
  // const size = document.getElementById('sizeSlide').value
  const size = 50;
  const pC = 0.8;
  const pM = 0.01;
  const seed = null || defaultSeed;
  const population = new Population(size, seed, pC, pM);

  return population;
}

function drawFitness(ctx, xAxis, score) {
  ctx.lineTo(xAxis, score * 100000 );
  ctx.stroke();
}

function setup () {
  const population = newCohort();
  initCanvas(population);

}

setup();
