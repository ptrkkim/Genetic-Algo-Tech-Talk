// just to declutter big picture logic in index/population/individual
import Individual from './Individual';

export const clearCanvas = (canvas) => {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.beginPath();
  ctx.moveTo(0, 0);
};

// for both seeding and ticking
export const drawLocations = (ctx, locations) => {
  const pxSize = 5;
  const offset = pxSize / 2;
  locations.forEach(location => {
    ctx.fillRect(location.x - offset, location.y - offset, pxSize, pxSize);
  });
};

export const drawRoute = (ctx, locations) => {
  ctx.beginPath();
  locations.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });

  ctx.closePath();
  ctx.stroke();
};

// clones and replaces to strip listeners
export const clearListeners = (...domNodes) => {
  domNodes.forEach(domElement => {
    const clone = domElement.cloneNode(true);
    domElement.parentNode.replaceChild(clone, domElement);
  });
};

export const drawFitness = (ctx, xAxis, score) => {
  ctx.lineTo(xAxis, score * 100000 );
  ctx.stroke();
};

export const getCanvasesAndContexts = () => {
  const gCanvas = document.getElementById('genetic');
  const fCanvas = document.getElementById('fitness');
  const bCanvas = document.getElementById('best');
  const gCtx    = gCanvas.getContext('2d');
  const fCtx    = fCanvas.getContext('2d');
  const bCtx    = bCanvas.getContext('2d');

  return { gCanvas, gCtx, fCanvas, fCtx, bCanvas, bCtx };
};

export const fitRouteToCanvas = (seedArray, canvasString) => {
  const { gCanvas, bCanvas } = getCanvasesAndContexts();
  const canvas = (canvasString === 'gCanvas')
    ? gCanvas
    : bCanvas;

  const allX = seedArray.map(point => point.x);
  const allY = seedArray.map(point => point.y);

  const greatest = Math.max(...allX, ...allY);
  const scale = canvas.height / greatest;
  const scaled  = seedArray.map(point => ({ x: point.x * scale, y: point.y * scale }));
  const bottomLeft = scaled.reduce((lowest, point) => {
    return Math.hypot(point.x, point.y) < Math.hypot(lowest.x, lowest.y)
      ? point
      : lowest;
  }, { x: greatest, y: greatest});

  // must shift left and down
  const offsetX = bottomLeft.x - (canvas.width * 0.05);
  const offsetY = bottomLeft.y - (canvas.width * 0.05);
  const shifted = scaled.map(point => ({ x: point.x - offsetX, y: point.y - offsetY }));

  return shifted;
};

// create a ticker for each population
// so that canvas activity only represents 1 population at a time
// buttons use tick to step/play/pause/reset
export const makeTicker = (population) => {
  const { gCanvas, gCtx, fCtx, bCanvas, bCtx } = getCanvasesAndContexts();
  const analyticGenNum = document.getElementById('genNumber');
  const shortestNow  = document.getElementById('shortestNow');

  return function () {
    population.nextGen();
    population.genNumber += 1;
    analyticGenNum.innerHTML = population.genNumber;
    // ++

    const fittest = population.getFittest();
    shortestNow.innerHTML = Math.floor(1 / fittest.getFitness());

    if (fittest.getFitness() > population.fittestEver.getFitness()) {
      population.fittestEver = fittest;
      updateBest(population, bCanvas, bCtx);
    }

    clearCanvas(gCanvas);
    fittest.draw(gCtx);
    drawFitness(fCtx, population.genNumber, fittest.getFitness());
  };
};

function updateBest (population, bCanvas, bCtx) {
  const shortestEver = document.getElementById('shortestEver');
  const fittestGens  = document.getElementById('fittestGens');
  const best         = population.fittestEver;

  shortestEver.innerHTML = Math.floor(1 / best.getFitness());
  fittestGens.innerHTML = population.genNumber;

  const resized = fitRouteToCanvas(best.dna, 'bCanvas');
  const bestButSmaller = new Individual(resized);
  clearCanvas(bCanvas);
  bestButSmaller.draw(bCtx);
}

