import Individual from './individual';

// create new Population of size x
// this population's initial pop is an array with shuffled versions of seed
export default function Population (size, seed, pC, pM) {
  this.currentPop = this.generate(size, seed);
  this.currentFitnesses = this.currentPop.map(individual => individual.getFitness());
  this.probCross = pC;
  this.probMuta = pM;
  this.genNumber = 0;
  this.fittestEver = this.getFittest();
}

// all members of a population MUST HAVE SAME SET OF LOCATIONS IN DNA
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
      return individual.mutate(this.probMuta);
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
  let num1 = Math.floor(mom.dna.length * Math.random());
  let num2 = Math.floor(dad.dna.length * Math.random());

  const segmentStart = Math.min(num1, num2);
  const segmentEnd = Math.max(num1, num2);

  const firstOffspring = orderedCross(segmentStart, segmentEnd, mom, dad);
  const secOffspring = orderedCross(segmentStart, segmentEnd, dad, mom);
  return [new Individual(firstOffspring), new Individual(secOffspring)];
};

// returns fittest individual
Population.prototype.getFittest = function () {
  const fittestIndex = this.currentFitnesses.reduce((fittestInd, currentScore, i, scores) => {
    if (currentScore > scores[fittestInd]) return i;
    return fittestInd;
  }, 0);

  return this.currentPop[fittestIndex];
};

// due to genome being a route, should exchange segments while maintaining order
// read into 'ordered crossover'
export function orderedCross (startInd, endInd, segParent, otherParent) {
  const childDNA  = segParent.dna.slice(startInd, endInd);
  const dnaLength = segParent.dna.length;

  for (let index = 0; index < dnaLength; index++) {
    const parentInd = (endInd + index) % dnaLength;
    const parentLoc = otherParent.dna[parentInd];

    if (!childDNA.some(location => sameLocation(location, parentLoc))) {
      childDNA.push(parentLoc);
    }
  }

  // spliced segment should be in same relative location for parent and child
  return rotate(childDNA, startInd);
}

export function sameLocation (location1, location2) {
  return location1.x === location2.x && location1.y === location2.y;
}

export function rotate (array, index) {
  const offset = array.length - index;
  return [...array.slice(offset), ...array.slice(0, offset)];
}

// Fisher-yates shuffle...
export function shuffle(array) {
  let rand, index = -1,
      length = array.length,
      result = Array(length);
  while (++index < length) {
    rand = Math.floor(Math.random() * (index + 1));
    result[index] = result[rand];
    result[rand] = array[index];
  }
  return result;
}

