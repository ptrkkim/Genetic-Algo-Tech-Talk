function Population (pC, pM) {
  this.currentPop = [];
  this.currentFitnesses = [];
  this.probCross = pC;
  this.probMuta = pM;
}

Population.prototype.nextGen = function () {
  let evolvedPop = [];
  while (evolvedPop.length < this.currentPop.length) {
    // const firstChromo = this.select(); // instance of individual
    // const secondChromo = this.select();
    // const crossedChromos = Math.random() < this.probCross
    //   ? this.crossover(firstChromo, secondChromo)
    //   : [firstChromo, secondChromo];

    // const mutatedChromos = crossedChromos.map(chromosome => this.mutate(chromosome, p_m));
    // evolvedPop = [...evolvedPop, ...mutatedChromos];
    evolvedPop = [...evolvedPop, ...this.haveTwoChildren()];
  }
  if (evolvedPop.length > this.currentPop.length) evolvedPop.splice(-1, 1);
  
  this.currentPop = evolvedPop;
  this.currentFitnesses = evolvedPop.map(individual => individual.fitness());
};

Population.prototype.haveTwoChildren = function () {
  const mom = this.select();
  const dad = this.select();
  const possiblyCrossed = Math.random() < this.probCross
      ? this.crossover(mom, dad)
      : [new Individual(mom), new Individual(dad)];

  const mutatedChildren = possiblyCrossed.map(individual => individual.mutate(this.probMuta));
  return mutatedChildren;
};

// uses roulette selection to give fitter chromosomes a better chance to be picked
Population.prototype.select = function() {
  const fitnessArr = this.currentFitnesses;
  const fitnessSum = fitnessArr.reduce((sum, fitness) => sum + fitness, 0);
  let roll = Math.random() * fitnessSum;

  for (let i = 0; i < this.currentPop.length; i++) {
    if (roll < fitnessArr[i]) return this.currentPop[i];
    roll -= fitnessArr[i];
  }
};

function distanceFitness (route) {
  let prev = route[0];
  let distance = route.reduce((totalDist, location, i) => {
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

function Individual (dna) {
  this.dna = dna || [];
}

Individual.prototype.mutate = function (pM) {
  const mutatedRoute = this.dna.slice();
  for (let index in mutatedRoute) {
    if (pM > Math.random()) {
      const randInd = Math.floor(Math.random() * mutatedRoute.length);
      const tempLoc = mutatedRoute[randInd];
      mutatedRoute[randInd] = mutatedRoute[index];
      mutatedRoute[index] = tempLoc;
    }
  }

  return this;
};


// produce new population, draw the fittest
function tick() {
  // create one new generation using previous generation (initialize random)
  // increment generation count

  // pull out fittest individual
  // draw fittest
}

// within a runSimulation function...
// clock = setInterval(tick, 0);
function runSimulation() {
  document.body.classList.remove('genetics-inactive');
  document.body.classList.add('genetics-active');

  if (isPaused())
    startTime = new Date().getTime() - resumedTime;

  if (isStopped()) {
    jiffies = 0;
    numberOfImprovements = 0;
    startTime = new Date().getTime();
    population = new Population(populationSize);
  }

  /* Each tick produces a new population and new fittest */
  function tick() {

    /* Breed a new generation */
    population.iterate();
    jiffies++;

    var fittest = population.getFittest();
    var totalTime = ((new Date().getTime() - startTime) / 1000);
    var timePerGeneration = (totalTime / jiffies) * 1000;
    var timePerImprovment = (totalTime / numberOfImprovements) * 1000;
    var currentFitness = (fittest.fitness * 100);

    if (currentFitness > highestFitness) {
      highestFitness = currentFitness;
      /* Improvement was made */
      numberOfImprovements++;
    } else if (currentFitness < lowestFitness) {
      lowestFitness = currentFitness;
    }

    /* Draw the best fit to output */
    fittest.draw(outputCtx, 350, 350);

    /* Write out the internal state to analytics panel */
    ap.elapsedTime.text(secondsToString(Math.round(totalTime)));
    ap.numberOfGenerations.text(jiffies);
    ap.timePerGeneration.text(timePerGeneration.toFixed(2) + ' ms');
    ap.timePerImprovment.text(timePerImprovment.toFixed(2) + ' ms');
    ap.currentFitness.text(currentFitness.toFixed(2) + '%');
    ap.highestFitness.text(highestFitness.toFixed(2) + '%');
    ap.lowestFitness.text(lowestFitness.toFixed(2) + '%');
  }

  /* Begin the master clock */
  clock = setInterval(tick, 0);
}

  function startSimulation() {
    if (isStopped()) {
      getConfiguration();
      prepareImage();
    }

    $('.conf-slider').slider('option', 'disabled', true);
    $('input[type="checkbox"]').attr('disabled', true);
    $('#start').text('Pause');
    $('.results-btn').attr('disabled', 'disabled');
    runSimulation();
  }

  /*
   * Pause the simulation.
   */
  function pauseSimulation() {
    clearInterval(clock);
    clock = null;
    resumedTime = new Date().getTime() - startTime;
    $('#start').text('Resume');
    $('.results-btn').removeAttr('disabled');
  }