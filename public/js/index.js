const Population = require('./Population');
const seed = require('./data');
// controls

// HTML ALREADY EXISTS
// ATTACH step, play/pause, restart

function initButtons (population) {
  const gCanvas = document.getElemenyById('genetic');
  const gCtx = gCanvas.getContext('2d');
  const fCanvas = document.getElemenyById('fitness');
  const fCtx = fCanvas.getContext('2d');
  const tick = makePopTick(gCanvas, gCtx, fCtx, population);
  let tickInterval;

  document.getElementById('next').addEventListener('click', tick);
  document.getElementById('go').addEventListener('click', () => {
    tickInterval = setInterval(tick, 0);
  });
  document.getElementById('stop').addEventListener('click', () => { clearInterval(tickInterval); });
  // document.getElementById('clear').addEventListener('click', () => {
  //   newCohort();
  // });
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
