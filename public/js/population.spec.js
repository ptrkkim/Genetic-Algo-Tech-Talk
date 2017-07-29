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

    it('uses Fisher-Yates shuffle to shuffle cities in linear time', () => {
      const shuffleMock = jest.fn(pop.shuffle);
      Population.prototype.generate = function(size, seed) {
        return Array(size).fill(null).map( () => new Individual(shuffleMock(seed)));
      };

      const shuffleTwo = new Population(2, testRoute.dna, 0, 0);
      expect(shuffleMock).toHaveBeenCalledTimes(2);
      shuffleMock.mockClear();

      const shuffleTen = new Population(10, testRoute.dna, 0, 0);
      expect(shuffleMock).toHaveBeenCalledTimes(10);
      shuffleMock.mockClear();

      const shuffle100 = new Population(100, testRoute.dna, 0, 0);
      expect(shuffleMock).toHaveBeenCalledTimes(100);
      shuffleMock.mockClear();

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
});
