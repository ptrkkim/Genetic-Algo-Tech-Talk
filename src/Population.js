const Individual = require('./Individual');

module.exports = Population;
// at start
// generate random set of points based on canvas size
// create new Population of size x
// this population's initial pop is an array with the points, shuffled

// for now hardcode
// size = 10
// seed = data1;
// pc = .6
// pm = .1

function Population (size, seed, pC, pM) {
  this.currentPop = this.generate(size, seed);
  this.currentFitnesses = this.currentPop.map(individual => individual.getFitness());
  this.probCross = pC;
  this.probMuta = pM;
}

// all members of a population MUST HAVE SAME LOCATIONS
// thus generate a pop by shuffling a single set of locations
Population.prototype.generate = function (size, seed) {
  return Array(size).fill(null).map( () => new Individual(shuffle(seed)) );
};

// creates next generation for a population
// updates currentPop, currentFitnesses, returns modified population object
Population.prototype.nextGen = function () {
  let evolvedPop = [];
  while (evolvedPop.length < this.currentPop.length) {
    evolvedPop = [...evolvedPop, ...this.haveTwoChildren()];
  }

  if (evolvedPop.length > this.currentPop.length) evolvedPop.splice(-1, 1);
  this.currentPop = evolvedPop;
  this.currentFitnesses = evolvedPop.map(individual => individual.getFitness());

  return this;
};

// from current population, roulette select 2 parents (indivs), create 2 Individuals
// cross and mutate if probability dictates
Population.prototype.haveTwoChildren = function () {
  const mom = this.select();
  const dad = this.select();
  const possiblyCrossed = Math.random() < this.probCross
      ? this.crossover(mom, dad)
      : [mom, dad];

  const mutatedChildren = possiblyCrossed.map(individual => {
      return new Individual(individual.mutate(this.probMuta));
    });
  return mutatedChildren;
};

// uses roulette selection to give fitter chromosomes a better chance to be picked
Population.prototype.select = function () {
  const fitnessArr = this.currentFitnesses;
  const fitnessSum = fitnessArr.reduce((sum, fitness) => sum + fitness, 0);
  let roll = Math.random() * fitnessSum;

  for (let i = 0; i < this.currentPop.length; i++) {
    if (roll < fitnessArr[i]) return this.currentPop[i];
    roll -= fitnessArr[i];
  }
};

Population.prototype.crossover = function (mom, dad) {
  let segmentStart = Math.floor(mom.dna.length * Math.random());
  let segmentEnd = Math.floor(dad.dna.length * Math.random());

  if ( segmentStart > segmentEnd ) {
    const temp = segmentStart;
    segmentStart = segmentEnd;
    segmentEnd = temp;
  }

  const firstOffspring = orderedCross(segmentStart, segmentEnd, mom, dad);
  const secOffspring = orderedCross(segmentStart, segmentEnd, dad, mom);
  return [new Individual(firstOffspring), new Individual(secOffspring)];
};

// returns fittest individual
Population.prototype.getFittest = function () {
  const fittestIndex = this.currentFitnesses.reduce((fittestInd, currentScore, i, scores) => {
    if (currentScore > scores[fittestInd]) return i;
    return fittestInd;
  });

  return this.currentPop[fittestIndex];
};

// due to genome being a route, should exchange segments while maintaining order
function orderedCross (startInd, endInd, segParent, otherParent) {
  let crossedDNA = Array(otherParent.dna.length).fill(null);
  const segment = segParent.dna.slice(startInd, endInd);

  for (let index = startInd; index < endInd; index++) {
    crossedDNA[index] = segParent.dna[index];
  }

  for (let parentIndex in otherParent.dna) {
    const parentLoc = otherParent.dna[parentIndex];
    if (!segment.some(location => sameLocation(location, parentLoc))) {
      fillOnce(crossedDNA, parentLoc);
    }
  }

  return crossedDNA;
}

function sameLocation (location1, location2) {
  return location1.x === location2.x && location1.y === location2.y;
}

function fillOnce(offspring, locToInsert) {
  const insertAt = offspring.indexOf(null);
  if (insertAt === -1) {
    console.log('already filled?????');
  } else {
    offspring[insertAt] = locToInsert;
  }
}

function shuffle(array) {
    var rand, index = -1,
        length = array.length,
        result = Array(length);
    while (++index < length) {
        rand = Math.floor(Math.random() * (index + 1));
        result[index] = result[rand];
        result[rand] = array[index];
    }
    return result;
}

