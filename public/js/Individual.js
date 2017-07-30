import { drawLocations, drawRoute } from './utils';

export { Individual as default, getDistance };

function Individual (dna) {
  this.dna = dna ? dna.slice() : [];
}

// TSP requires all chromosomes to share same unique set of routes
// therefore we have two options:
//   1. only SWAP locations to mutate, always producing valid routes
//   2. insert/delete random locations, cull invalid routes post-hoc (nahhh)

Individual.prototype.mutate = function (probMutate) {
  const mutatedRoute = this.dna.slice();
  for (let index = 0; index < mutatedRoute.length; index++) {
    if (Math.random() < probMutate) {

      const randInd = Math.floor(Math.random() * mutatedRoute.length);
      // if (randInd === index) return this.mutate(probMutate);

      const tempLoc = mutatedRoute[randInd];
      mutatedRoute[randInd] = mutatedRoute[index];
      mutatedRoute[index] = tempLoc;
    }
  }

  return new Individual(mutatedRoute);
};

Individual.prototype.getFitness = function () {
  return 1 / getDistance(this.dna); 
};

Individual.prototype.draw = function (ctx) {
  drawLocations(ctx, this.dna);
  drawRoute(ctx, this.dna);
};

function getDistance (route) {
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

  return distance;
}
