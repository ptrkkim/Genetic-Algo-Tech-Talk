// codewars 2kyu GA to generate a binary number representing an integer value

// special considerations for Traveling Salesman
// all locations included once and only once- no missed locations
// mutation method should therefore only shuffle

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

// will need to customize to cross in-order segments
GeneticAlgorithm.prototype.crossedover = function(chromosome1, chromosome2) {
  const crossIndex = Math.floor(Math.random() * chromosome1.length);
  if (crossIndex === 0) {
    return [[chromosome2[0], ...chromosome1.slice(1)], [chromosome1[0], ...chromosome2.slice(1)]];
  }
  const newChromo1 = [...chromosome1.slice(0,crossIndex), ...chromosome2.slice(crossIndex)];
  const newChromo2 = [...chromosome2.slice(0,crossIndex), ...chromosome1.slice(crossIndex)];
  return [newChromo1, newChromo2];
};

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
