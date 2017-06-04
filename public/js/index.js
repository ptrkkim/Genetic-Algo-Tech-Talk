const Population = require('./Population');
const seed = require('./data');
// controls

// HTML ALREADY EXISTS
// ATTACH step, play/pause, restart

function initButtons (population) {
  const gCanvas = document.getElementById('genetic');
  const gCtx = gCanvas.getContext('2d');
  const fCanvas = document.getElementById('fitness');
  const fCtx = fCanvas.getContext('2d');

  const tick = makePopTick(gCanvas, gCtx, fCtx, population);
  let tickInterval;

  const step = document.getElementById('step');
  const go = document.getElementById('go');
  const stop = document.getElementById('stop');
  const reset = document.getElementById('reset');

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
  const population = new Population(size, seed, pC, pM);

  return population;
}

function drawFitness(ctx, xAxis, score) {
  ctx.lineTo(xAxis, score * 100000 );
  ctx.stroke();
}

function setup () {
  const population = newCohort();
  initButtons(population);
}

setup();

// for use by front-end buttons
// evolve population once, pull out and draw the fittest
// function tick (population) {
//   population.nextGen();
//   population.genNumber += 1;

//   const fittest = population.getFittest();
//   population.fittestEver = fittest.getFitness() > population.fittestEver.getFitness()
//     ? fittest
//     : population.fittestEver;

//   fittest.draw(gCtx);
//   gCtx.clearRect(0, 0, gCanvas.width, gCanvas.height);

// // }

// function runAlgorithm () {
//   ourPopulation = new Population(pC, pM);
//   ourPopulation.currentPop = ourPopulation.generate(popSize, seed);
//   ourPopulation.currentFitnesses = ourPopulation.currentPop.map(individual => individual.getFitness());

//   // evolve population, pull out and draw the fittest
//   function tick() {
//     ourPopulation.nextGen();
//     genNumber += 1;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     seedCanvas(ctx, smaller);
//     ourPopulation.getFittest().draw(ctx);
//     const highScore = ourPopulation.getFittest().getFitness();
//     highest = (highScore > highest) ? highScore : highest;
//     console.log('BEST: ', highest, 'current Fittest: ', highScore);
//     drawFitness(genNumber, highScore);

//   }

//   let interval;
//   document.getElementById('next').addEventListener('click', tick);
//   document.getElementById('go').addEventListener('click', () => {
//     interval = setInterval(tick, 0);
//   });
//   document.getElementById('stop').addEventListener('click', () => { clearInterval(interval); });
// }
