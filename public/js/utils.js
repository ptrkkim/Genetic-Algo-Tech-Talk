// just to declutter big picture logic in index/population/individual

export const clearCanvas = (ctx, canvas) => {
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

// create a ticker for each population
// so that canvas activity only represents 1 population at a time
// buttons use tick to step/play/pause/reset
export const makeTicker = (canvas, gtx, ftx, population) => {
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
};
