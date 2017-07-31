import Population, * as pop from './population';
import Individual from './individual';

describe('A population of routes', () => {
  const cities = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }];
  const testRoute = new Individual(cities);

  describe('initializes correctly', () => {
    const testPopSize = 3;
    const testPop = new Population(testPopSize, testRoute.dna, 0, 0);

    test('has a property containing the current generation with (arg) number of Individuals', () => {
      const size1 = new Population(1, testRoute.dna, 0, 0);
      const size10 = new Population(10, testRoute.dna, 0, 0);
      const size100 = new Population(100, testRoute.dna, 0, 0);

      expect(size1).toBeInstanceOf(Population);
      expect(size1.currentPop).toHaveLength(1);
      expect(size10).toBeInstanceOf(Population);
      expect(size10.currentPop).toHaveLength(10);
      expect(size100).toBeInstanceOf(Population);
      expect(size100.currentPop).toHaveLength(100);
    });

    test('contains only instances of Individual in its current generation', () => {
      testPop.currentPop.forEach(individual => {
        expect(individual).toBeInstanceOf(Individual);
      });
    });

    test('follows the constraint that every Individual contains the same cities', () => {
      testPop.currentPop.forEach(individual => {
        expect(individual.dna).toHaveLength(cities.length);
        expect(individual.dna).toEqual(expect.arrayContaining(cities));
        // above line checks if items in cities are a subset of items in dna
        // combined with length, tests ensure these arrays contain same items (in any order)
      })
    });

    test('has a property containing the fitness of every Individual', () => {
      expect(testPop).toHaveProperty('currentFitnesses');
      expect(testPop.currentFitnesses).toHaveLength(testPopSize);

      testPop.currentPop.forEach((individual, ind) => {
        expect(testPop.currentFitnesses[ind]).toEqual(individual.getFitness());
      });
    });

    test('has a property pointing to the fittest Individual of all past/present generations', () => {
      expect(testPop).toHaveProperty('fittestEver');
      expect(testPop.fittestEver).toBeInstanceOf(Individual);

      // shortest path for 0,0; 0,1; 0,2 is length 4, fitness 1/4
      expect(testPop.fittestEver.getFitness()).toBe(0.25);
    });
  });

  describe('uses Fisher-Yates shuffle to randomize city order', () => {
    const swapMock = jest.fn(pop.fisherSwap);
    const shuffleMock = jest.fn(pop.shuffle);
    const trueRandom = Math.random;

    beforeEach(() => {
      global.Math.random = trueRandom; // reset Math.random in case I replace it with a mock
      jest.clearAllMocks();
    })

    test('correctly swaps values', () => {
      global.Math.random = jest.fn(() => 0); // any fn in this block calling Math.random receives 0
      const testArr = [1, 2];
      swapMock(testArr, 1); // first swap call, idx = arr.length - 1
      expect(testArr).toEqual([2, 1]);
    });

    test('mutates the original seed dna, taking no extra memory', () => {
      const seedArray = [1, 2, 3];
      const shuffled = shuffleMock(seedArray, swapMock);
      expect(shuffled).toBe(seedArray); // toBe checks equality of memory references
    });

    test('runs in linear time', () => {
      // swap should run once per element in a dna array, * number of individuals in the population
      Population.prototype.generate = function(size, seed) {
        return Array(size).fill(null).map( () => new Individual(shuffleMock(seed, swapMock)));
      };

      for (let popSize = 2; popSize < 200; popSize += 20) {
        const shuffled = new Population(popSize, testRoute.dna, 0, 0);
        expect(shuffleMock).toHaveBeenCalledTimes(popSize);
        expect(swapMock).toHaveBeenCalledTimes(popSize * testRoute.dna.length)
        shuffleMock.mockClear();
        swapMock.mockClear();
      }
    });
  });

  describe('evolves, using current generation of routes to create the next', () => {
    describe('uses roulette selection to select parent Individuals', () => {
      const testPop = new Population(3, testRoute.dna, 0, 0);
      testPop.currentFitnesses = [1/2, 1/4, 1/8];

      test('higher fitness individuals are more likely to be selected', () => {
        // this is not a great test
        // only checks that the distribution vaguely matches the fitness proportions
        const counts = testPop.currentPop.reduce((map, individual) => {
          map.set(individual, 0);
          return map;
        }, new Map());

        for (let i = 0; i < 100000; i++) {
          const thisIndividual = testPop.select();
          const currentCount = counts.get(thisIndividual);
          counts.set(thisIndividual, currentCount + 1);
        }

        const isDescending = map => [...map.values()].reduce((acc, tally, i, allCounts) => {
          return i === 0
            ? true
            : acc && tally <= allCounts[i - 1];
        }, true);

        expect(isDescending(counts)).toBeTruthy();
      });
    });

    describe('uses ordered crossover to create child Individuals', () => {
      const dna = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 }, { x: 0, y: 4 }];
      const crossoverTest = new Population(3, dna, 0, 0);
      const mom = crossoverTest.select();
      const dad = crossoverTest.select();

      test('crossover takes two Individuals and returns two new Individuals', () => {
        const crossed = crossoverTest.crossover(mom, dad);
        expect(Array.isArray(crossed)).toBe(true);
        expect(crossed).toHaveLength(2);
        expect(crossed[0]).toBeInstanceOf(Individual);
        expect(crossed[1]).toBeInstanceOf(Individual);
      });

      test('maintains order of dna segments as they appear in parents', () => {
        const midpoint = Math.floor(mom.dna.length / 2);
        const childDNA = pop.orderedCross(0, midpoint, mom, dad);
        expect(childDNA.slice(0, midpoint)).toEqual(mom.dna.slice(0, midpoint));
        expect(childDNA).toEqual(expect.arrayContaining(dad.dna));
        expect(childDNA).toEqual(expect.arrayContaining(mom.dna));
      });

      test('sameLocation util checks if two x/y pairs are the same', () => {
        const home = { x: 0, y: 0 };
        const alsoHome = { x: 0, y: 0 };
        const work = { x: 10, y: 10 };

        expect(pop.sameLocation(home, alsoHome)).toBe(true);
        expect(pop.sameLocation(home, work)).toBe(false);
      });

      test('rotate util rotates an input array by an offset', () => {
        const original = [0, 1, 2, 3, 4];
        for (let i = 0; i < original.length; i++) {
          const rotated = pop.rotate(original, i);
          expect(rotated[0]).toBe((original.length - i) % original.length);
        }
      });
    });
  });
});

