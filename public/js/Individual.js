module.exports = Individual;

function Individual (dna) {
  this.dna = dna || [];
}

// NON MUTATING
// returns plain dna
Individual.prototype.mutate = function (pM) {
  const mutatedRoute = this.dna.slice();
  for (let index = 0; index < mutatedRoute.length; index++) {
    if (pM > Math.random()) {

      const randInd = Math.floor(Math.random() * mutatedRoute.length);
      if (randInd === index) return this.mutate(pM);

      const tempLoc = mutatedRoute[randInd];
      mutatedRoute[randInd] = mutatedRoute[index];
      mutatedRoute[index] = tempLoc;
    }
  }

  return new Individual(mutatedRoute);
};

Individual.prototype.getFitness = function () {
  return distanceFitness(this.dna);
};

Individual.prototype.draw = function (ctx) {
  
  drawLocations(ctx, this.dna);
  drawRoute(ctx, this.dna);
};

function drawRoute (ctx, locations) {
  ctx.beginPath();
  locations.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });

  // close the path
  ctx.lineTo(locations[0].x, locations[0].y);
  ctx.stroke();
  ctx.closePath();
}

function drawLocations(ctx, locations) {
  const pxSize = 5;
  const offset = pxSize / 2;
  locations.forEach(location => {
    ctx.fillRect(location.x - offset, location.y - offset, pxSize, pxSize);
  });
}

function distanceFitness (route) {
  let prev = route[0];
  let distance = route.reduce((totalDist, location) => {
    const distToAdd = Math.hypot(location.x - prev.x, location.y - prev.y);
    prev = location;

    return totalDist + distToAdd;
  }, 0);

  // make circular
  const first = route[0];
  const last = route[route.length - 1];
  distance += Math.hypot(first.x - last.x, first.y - last.y);

  return 1 / distance;
}
