let currentChart0;
let currentChart1;
let currentChart2;

let systems;
let hackers;
let n;
let p;

const generateButton = document.getElementById('button__generate');

const errorText = document.getElementById("error");

const arithmetic_mean_label = document.getElementById("arithmetic_mean");
const expected_mean_label = document.getElementById("expected_mean");
const variance_label = document.getElementById("variance");

const arithmetic_mean_label1 = document.getElementById("arithmetic_mean1");
const expected_mean_label1 = document.getElementById("expected_mean1");
const variance_label1 = document.getElementById("variance1");

const frequency_select = document.getElementById("select_frequency");

errorText.style.color = "red"

generateButton.addEventListener("click", (event) => {
  event.preventDefault();
  generate();
});

document.addEventListener('DOMContentLoaded', (event) => {
  generate();
});

function arithmetic_mean_and_variance(set){
  let count = 0;
  let mean = 0;
  let variance = 0;
  let i = 0;

  while(i < set.length){
    let element = set[i];
    if (element != 0){
      let j = 0;
      let value = -systems + i;
      while(j++ < element){
        count++;

        let delta = value - mean;
        mean += (delta)/count;
        variance += (value - mean) * delta;
      }
    } 
    i++;
  }
  variance /= count-1
  return {mean, variance};
}

function dynamicColors() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgba(" + r + "," + g + "," + b + ", 1.0)";
}

function poolColors(a) {
  var pool = [];
  for(i = 0; i < a; i++) {
      pool.push(dynamicColors());
  }
  return pool;
}

function generate(){

  systems = parseInt(document.getElementById('systems').value)
  hackers = parseInt(document.getElementById('hackers').value)
  p = parseFloat(document.getElementById('probability').value)
  n = parseInt(document.getElementById("internal_n").value)

  if(isNaN(systems) || isNaN(hackers) || isNaN(p) || isNaN(n)){
    errorText.textContent = "Invalid numbers";
    return;
  }

  if(systems <= 0 || hackers <= 0 || p < 0 || n < 0) {
    errorText.textContent = "numbers cannot be negative";
    return;
  }

  errorText.textContent = "";

  if(n > systems){
    errorText.textContent = "internal step is too big";
  }

  if(currentChart0) currentChart0.destroy()
  if(currentChart1) currentChart1.destroy()
  if(currentChart2) currentChart2.destroy()

  let array = [];
  let dataset = [];
  let systemsArray = [];
  let scoreBoard = [];
  let scoreBoardInternal = [];

  for(let i = 0; i < systems; i++){
    systemsArray.push(i);

    scoreBoard.push(0);
    scoreBoard.push(0);

    scoreBoardInternal.push(0);
    scoreBoardInternal.push(0);
  }
  scoreBoard.push(0);
  scoreBoardInternal.push(0);
  systemsArray.push(systems-1);

  for(let i = 0; i < hackers; i++){
    array[i] = [];
    let totalSystemsHacked = 0;
    let totalSystemsHackedInternal = 0;
    for(let j = 0; j < systems; j++){
      let randomNumber = Math.random();
      array[i].push(totalSystemsHacked);

      if(randomNumber <= p) totalSystemsHacked++;
      else totalSystemsHacked--;

      if(j == n-1){
        totalSystemsHackedInternal = totalSystemsHacked;
      }
    }
    array[i].push(totalSystemsHacked);

    dataset.push({
      data: array[i],
      stepped: "after",
      pointStyle: false
    })

    scoreBoardInternal[totalSystemsHackedInternal + systems]++;
    scoreBoard[totalSystemsHacked + systems]++;
  }


  const decimation = {
    enabled: true,
    algorithm: 'min-max',
  };

  currentChart0 = new Chart(
    document.getElementById('chart_hackersPath'),
    {
      type: 'line',
      data: {
        labels: systemsArray,
        datasets: dataset
      },
      options: {
        scales: {
          y: {
              ticks: {
                  color: '#d3cfca'
              },
              grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
              }
          },
          x: {
            title: {
              display: true,        
              text: 'Systems',
              color: '#d3cfca',
              font: {
                  size: 16
              }
            },
              ticks: {
                  color: '#d3cfca'
              },
              grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
              }
          }
      },
        animation: false,
        parsing: true,
        
        interaction: {
          mode: 'nearest',
          axis: 'x',
          intersect: true
        },
        plugins: {
          decimation: decimation,
          tooltip: {
            enabled: true
          },
          legend: {
            display: false
          }
        }
      }
    }
  );
  
  let colors = poolColors(systems);

  let hackerArray = [];
  for(let i = -systems; i < systems+1; i++){
    hackerArray.push(i);
  }

  let arithmeticMean_variance_object = arithmetic_mean_and_variance(scoreBoard);

  arithmetic_mean_label.textContent = "Actual mean: " + String(arithmeticMean_variance_object.mean);
  expected_mean_label.textContent = "Expected mean: " + String(systems * (2*p-1));
  variance_label.textContent = "variance: " + String(arithmeticMean_variance_object.variance);

  let arithmeticMean_variance_objectInternal = arithmetic_mean_and_variance(scoreBoardInternal);

  arithmetic_mean_label1.textContent = "Actual mean: " + String(arithmeticMean_variance_objectInternal.mean);
  expected_mean_label1.textContent = "Expected mean: " + String(n * (2*p-1));
  variance_label1.textContent = "variance: " + String(arithmeticMean_variance_objectInternal.variance);

  let scoreBoardText = "";

  if(frequency_select.value == "Relative frequencies"){
    scoreBoardText = "Percentage of hackers";
  }
  else if(frequency_select.value == "Absolute frequencies"){
    scoreBoardText = "Number of hackers";
  }

  if (frequency_select.value == "Relative frequencies"){
    for(let i = 0; i < scoreBoard.length; i++){
      scoreBoard[i] /= hackers;
      scoreBoardInternal[i] /= hackers;
    }
  }

  currentChart1 = new Chart(
    document.getElementById('chart_scoreBoard'),
    {
      type: 'bar',
      options:{
        scales: {
          y: {
            title: {
              display: true,        
              text: scoreBoardText,
              color: '#d3cfca',
              font: {
                  size: 14
              }
            },
              ticks: {
                  color: '#d3cfca'
              },
              grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
              }
          },
          x: {
            title: {
              display: true,        
              text: 'Score',
              color: '#d3cfca',
              font: {
                  size: 14
              }
            },
              ticks: {
                  color: '#d3cfca'
              },
              grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
              }
          }
      }
      },
      data: {
        labels: hackerArray,
        datasets: [{
          label: "Score",
          data: scoreBoard,
          backgroundColor: colors,
          borderColor: colors,
          color: colors
        }]
      }
    }
  )

  currentChart2 = new Chart(
    document.getElementById('chart_scoreBoard1'),
    {
      type: 'bar',
      options:{
        scales: {
          y: {
            title: {
              display: true,        
              text: scoreBoardText,
              color: '#d3cfca',
              font: {
                  size: 14
              }
            },
              ticks: {
                  color: '#d3cfca'
              },
              grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
              }
          },
          x: {
            title: {
              display: true,        
              text: 'Score',
              color: '#d3cfca',
              font: {
                  size: 14
              }
            },
              ticks: {
                  color: '#d3cfca'
              },
              grid: {
                  color: 'rgba(255, 255, 255, 0.1)'
              }
          }
      }
      },
      data: {
        labels: hackerArray,
        datasets: [{
          label: "Score",
          data: scoreBoardInternal,
          backgroundColor: colors,
          borderColor: colors,
          color: colors
        }]
      }
    }
  )
}


