import Individual, { getDistance } from './individual';

describe('An individual route', () => {
  const cities = [{ x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }];
  const testRoute = new Individual(cities);
  const mathRandomMock = jest.fn().mockReturnValue(0);
  global.Math.random = mathRandomMock;

  it('initializes properly', () => {
    const empty = new Individual();
    expect(empty).toBeInstanceOf(Individual);
    expect(empty.dna).toEqual([]);

    const filled = new Individual(cities);
    expect(filled).toBeInstanceOf(Individual);
    expect(filled.dna).toEqual(cities);
  })

  describe('mutates properly', () => {

    it('returns a completely new individual', () => {
      const mutated1 = testRoute.mutate(0); // no swaps
      expect(mutated1).not.toBe(testRoute);
      expect(mutated1).toEqual(testRoute);
    });

    it('mutates by swapping cities in the route', () => {
      const mutated1 = testRoute.mutate(1); // swap every time
      const expected = [{x: 0, y: 2}, {x: 0, y: 0}, {x: 0, y: 1}];
      expect(mutated1.dna).toEqual(expected);
    });

    it('only mutates if mutation probability is above threshold', () => {
      const shouldBeMutated = testRoute.mutate(1);
      const shouldNotBeMutated = testRoute.mutate(0);
      expect(shouldBeMutated).not.toEqual(testRoute);
      expect(shouldNotBeMutated).toEqual(testRoute);
    });
  });

  describe('calculates fitness properly', () => {
    const getDistanceMock = jest.fn(getDistance);

    beforeEach(() => {
      getDistanceMock.mockClear();
    });

    it('calculates distance to visit all cities and return to origin', () => {
      const expectedDistance = 4;
      expect(getDistanceMock(testRoute.dna)).toBe(expectedDistance);
    });

    it('high distances have low fitness scores and vice-versa', () => {
      const longRoute = new Individual(cities.concat([{x: 0, y: 3}]));
      Individual.prototype.getFitness = function() { return 1 / getDistanceMock(this.dna) };

      const shortFitness = testRoute.getFitness();
      const longFitness = longRoute.getFitness();
      expect(getDistanceMock).toHaveBeenCalledWith(testRoute.dna);
      expect(getDistanceMock).toHaveBeenCalledWith(longRoute.dna);
      expect(shortFitness).toBeGreaterThan(longFitness);
      expect(shortFitness).toBe(1 / 4);
      expect(longFitness).toBe(1 / 6);
    });
  })
});
