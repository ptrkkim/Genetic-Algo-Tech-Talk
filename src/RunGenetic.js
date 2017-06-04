// const Individual = require('./Individual');
const Population = require('./Population');


// things i need before i can press play:
// play button (can run forever honestly)
// generate Random points button - sets a seed data variable somewhere
//   actually draws the points
// a div with a target canvas

// PRESS PLAY
function runAlgorithm () {
  const population = new Population(size, seed, pC, pM);

  // evolve population, pull out and draw the fittest
  function tick() {
    population.nextGen();
    population.getFittest().draw(outputCtx);
  }

  clock = setInterval(tick, 0);
}


// produce new population, draw the fittest


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