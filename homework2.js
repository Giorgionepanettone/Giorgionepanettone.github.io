let currentChart0;
let currentChart1;
let currentChart2;

const generateButton = document.getElementById('button__generate');
const errorText = document.getElementById("error");
const arithmetic_mean_label = document.getElementById("arithmetic_mean");
const expected_mean_label = document.getElementById("expected_mean");
const variance_label = document.getElementById("variance");

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
      while(j < element){
        let delta = i - mean;
        count++;
        mean += (delta)/count;
        variance += (i - mean) * delta;
        j++
      }
      
    } 
    i++;
  }
  variance /= count -1
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

  let systems = parseInt(document.getElementById('systems').value)
  let hackers = parseInt(document.getElementById('hackers').value)
  let p = parseFloat(document.getElementById('probability').value)
  let n = parseInt(document.getElementById("internal_n").value)

  if(isNaN(systems) || isNaN(hackers) || isNaN(p) || isNaN(n)){
    errorText.textContent = "Invalid numbers";
    return;
  }

  if(systems <= 0 || hackers <= 0 || p < 0 || n < 0) {
    errorText.textContent = "numbers cannot be negative";
    return;
  }

  errorText.textContent = "";

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

      if(j == n){
        totalSystemsHackedInternal = totalSystemsHacked;
      }
    }
    array[i].push(totalSystemsHacked);

    dataset.push({
      data: array[i],
      stepped: "after",
      pointStyle: false
    })

    if (totalSystemsHackedInternal >= 0) scoreBoardInternal[totalSystemsHackedInternal + systems]++;
    else scoreBoardInternal[systems - Math.abs(totalSystemsHackedInternal)]++;

    if (totalSystemsHacked >= 0) scoreBoard[totalSystemsHacked + systems]++;
    else scoreBoard[systems - Math.abs(totalSystemsHacked)]++;
  }

  const decimation = {
    enabled: true,
    algorithm: 'min-max',
  };

  console.log(scoreBoard);

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

  let copyArray = systemsArray.slice(0, systems);
  copyArray.push(systems);

  let arithmeticMean_variance_object = arithmetic_mean_and_variance(scoreBoard);

  arithmetic_mean_label.textContent = "Actual mean: " + String(arithmeticMean_variance_object.mean);
  expected_mean_label.textContent = "Expected mean: " + String(systems * p);
  variance_label.textContent = "variance: " + String(arithmeticMean_variance_object.variance);

  currentChart1 = new Chart(
    document.getElementById('chart_scoreBoard'),
    {
      type: 'bar',
      options:{
        scales: {
          y: {
            title: {
              display: true,        
              text: 'Number of hackers',
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
              text: 'Number of hackers',
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


