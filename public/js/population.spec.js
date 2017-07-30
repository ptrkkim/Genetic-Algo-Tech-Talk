import Population, * as pop from './population';
import Individual from './individual';

describe('A population of routes', () => {
  const cities = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }];
  const testRoute = new Individual(cities);

  describe('initializes correctly', () => {
    const testPopSize = 3;
    const testPop = new Population(testPopSize, testRoute.dna, 0, 0);

    it('has a property containing the current generation with (arg) number of Individuals', () => {
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

    it('contains only instances of Individual in its current generation', () => {
      testPop.currentPop.forEach(individual => {
        expect(individual).toBeInstanceOf(Individual);
      });
    });

    it('follows the constraint that every Individual contains the same cities', () => {
      testPop.currentPop.forEach(individual => {
        expect(individual.dna).toHaveLength(cities.length);
        expect(individual.dna).toEqual(expect.arrayContaining(cities));
        // above line checks if items in cities are a subset of items in dna
        // combined with length, tests ensure these arrays contain same items (in any order)
      })
    });

    it('has a property containing the fitness of every Individual', () => {
      expect(testPop).toHaveProperty('currentFitnesses');
      expect(testPop.currentFitnesses).toHaveLength(testPopSize);

      testPop.currentPop.forEach((individual, ind) => {
        expect(testPop.currentFitnesses[ind]).toEqual(individual.getFitness());
      });
    });

    it('has a property pointing to the fittest Individual of all past/present generations', () => {
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
      swapMock.mockClear(); // resets calls count, instances
      shuffleMock.mockClear();
    })

    it('correctly swaps values', () => {
      global.Math.random = jest.fn(() => 0); // any fn in this block calling Math.random receives 0
      const testArr = [1, 2];
      swapMock(testArr, 1); // first swap call, idx = arr.length - 1
      expect(testArr).toEqual([2, 1]);
    });

    it('mutates the original seed dna, taking no extra memory', () => {
      const seedArray = [1, 2, 3];
      const shuffled = shuffleMock(seedArray, swapMock);
      expect(shuffled).toBe(seedArray); // toBe checks equality of memory references
    });

    it('runs in linear time', () => {
      // should run once per element in a dna array, * number of individuals in the population
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

  describe('can generate the next generation of routes', () => {

  });
});
