// data
const data40 = [{"x":116,"y":404},{"x":161,"y":617},{"x":16,"y":97},{"x":430,"y":536},{"x":601,"y":504},{"x":425,"y":461},{"x":114,"y":544},{"x":127,"y":118},{"x":163,"y":357},{"x":704,"y":104},{"x":864,"y":125},{"x":847,"y":523},{"x":742,"y":170},{"x":204,"y":601},{"x":421,"y":377},{"x":808,"y":49},{"x":860,"y":466},{"x":844,"y":294},{"x":147,"y":213},{"x":550,"y":124},{"x":238,"y":313},{"x":57,"y":572},{"x":664,"y":190},{"x":612,"y":644},{"x":456,"y":154},{"x":120,"y":477},{"x":542,"y":313},{"x":620,"y":29},{"x":245,"y":246},{"x":611,"y":578},{"x":627,"y":373},{"x":534,"y":286},{"x":577,"y":545},{"x":539,"y":340},{"x":794,"y":328},{"x":855,"y":139},{"x":700,"y":47},{"x":275,"y":593},{"x":130,"y":196},{"x":863,"y":35}];

// special considerations for TSP
// all locations included once and only once- no missed locations

// mutation method should therefore only shuffle
//

var GeneticAlgorithm = function () {};

GeneticAlgorithm.prototype.generate = function(length) {
  return [...Array(length)].map(bit => Math.random() < 0.5 ? 0 : 1);
};


// roulette selection
GeneticAlgorithm.prototype.select = function(population, fitnesses) {
  const fitnessSum = fitnesses.reduce((sum, fitness) => sum + fitness, 0);
  let roll = Math.random() * fitnessSum;

  for (let i = 0; i < population.length; i++) {
    if (roll < fitnesses[i]) return population[i];
    roll -= fitnesses[i];
  }
};

// will need to customize to swap
GeneticAlgorithm.prototype.mutate = function(locations, p) {
  const swappedLocations = locations.slice();
  for (let index in swappedLocations) {
    if (p > Math.random()) {
      const randInd = Math.floor(Math.random() * swappedLocations.length);
      const tempLoc = swappedLocations[randInd];
      swappedLocations[randInd] = swappedLocations[index];
      swappedLocations[index] = tempLoc;
    }
  }

  return swappedLocations;
};

// takes a random sized subroute from first parent
// passes that route to child
// then iterate through second parent's route to fill in
// MAINTAINS ORDER
// returns array(2) of route arrays
// now returns two Individuals with crossed DNA
GeneticAlgorithm.prototype.crossover = function(mom, dad) {
  let segmentStart = Math.floor(mom.length * Math.random());
  let segmentEnd = Math.floor(dad.length * Math.random());

  if ( segmentStart > segmentEnd ) {
    const temp = segmentStart;
    segmentStart = segmentEnd;
    segmentEnd = temp;
  }

  const firstOffspring = createCrossed(segmentStart, segmentEnd, mom, dad);
  const secOffspring = createCrossed(segmentStart, segmentEnd, dad, mom);
  return [new Individual(firstOffspring), new Individual(secOffspring)];
};

function createCrossed (startInd, endInd, segParent, otherParent) {
  let offspring = Array(otherParent.length).fill(null);
  const segment = segParent.slice(startInd, endInd);

  for (let index = startInd; index < endInd; index++) {
    offspring[index] = segParent[index];
  }

  for (let parentIndex in otherParent) {
    const parentLoc = otherParent[parentIndex];
    if (!segment.some(location => sameLocation(location, parentLoc))) {
      fillOnce(offspring, parentLoc);
    } else {
      console.log('SAME LOCATION');
    }
  }

  return offspring;
}

function fillOnce(offspring, locToInsert) {
  const insertAt = offspring.indexOf(null);
  if (insertAt === -1) {
    console.log('already filled?????');
  } else {
    offspring[insertAt] = locToInsert;
  }
}

function sameLocation (location1, location2) {
  return location1.x === location2.x && location1.y === location2.y;
}

// will need to customize to swap
GeneticAlgorithm.prototype.crossedover = function(chromosome1, chromosome2) {
  const crossIndex = Math.floor(Math.random() * chromosome1.length);
  if (crossIndex === 0) {
    return [[chromosome2[0], ...chromosome1.slice(1)], [chromosome1[0], ...chromosome2.slice(1)]];
  }
  const newChromo1 = [...chromosome1.slice(0,crossIndex), ...chromosome2.slice(crossIndex)];
  const newChromo2 = [...chromosome2.slice(0,crossIndex), ...chromosome1.slice(crossIndex)];
  return [newChromo1, newChromo2];
};

// how to represent a route?
// in-order array of coordinates

// generate new pops, once each iteration
// for each new pop, generate new fitness mapping
// loop, creating new evolved generations based on past generations
// return the fittest individual after max iterations reached
function distanceFitness (locations) {
  let prev = locations[0];
  let distance = locations.reduce((totalDist, location, i) => {
    const distToAdd = Math.hypot(location.x - prev.x, location.y - prev.y);
    prev = location;
    return distToAdd;
  }, 0);

  // make circular
  const first = locations[0];
  const last = locations[locations.length - 1];
  distance += Math.hypot(first.x - last.x, first.y - last.y);

  return 1 / distance;
}
// takes a fitness function, length of routes, mutation/cross probs, iterations
// returns single fittest member of all generations
GeneticAlgorithm.prototype.run = function(fitness, length, p_c, p_m, iterations = 100) {
  const OGpopulation = [...Array(100)].map(() => this.generate(length));
  const OGfitnesses = OGpopulation.map(routesChromosome => fitness(routesChromosome));
  let evolvedPop = OGpopulation;
  let evolvedFit = OGfitnesses;

  for (let i = 0; i < iterations; i++) {
    evolvedPop = this.evolve(evolvedPop, evolvedFit, p_c, p_m);
    evolvedFit = evolvedPop.map(routesChromosome => fitness(routesChromosome));
  }

  const fittestInd = evolvedFit.reduce((fittest, fitVal, i) => {
    return fitVal > fitness(evolvedPop[fittest]) ? i : fittest;
  }, 0);
  return evolvedPop[fittestInd];
};

// roulette select 2 children of current population, cross if necessary, mutate if necessary, add to evolved/new pop
GeneticAlgorithm.prototype.evolve = function(population, fitnesses, p_c, p_m) {
  let evolvedPop = [];
  while (evolvedPop.length < population.length) {
    const firstChromo = this.select(population, fitnesses);
    const secondChromo = this.select(population, fitnesses);
    const crossedChromos = Math.random() < p_c
      ? this.crossover(firstChromo, secondChromo)
      : [firstChromo, secondChromo];

    const mutatedChromos = crossedChromos.map(chromosome => this.mutate(chromosome, p_m));
    evolvedPop = [...evolvedPop, ...mutatedChromos];
  }
  if (evolvedPop.length > population.length) evolvedPop.splice(-1,1);
  return evolvedPop;
};

const tsp = new GeneticAlgorithm();
tsp.run(distanceFitness, 20, 0.6, 0.002);
