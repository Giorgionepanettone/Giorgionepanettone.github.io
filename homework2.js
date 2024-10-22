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
  let mean = 0;
  let variance = 0;
  let i = 0;

  while(i < set.length){
    const element = set[i];

    const delta =   element - mean;
    mean +=         delta/++i;
    variance +=     (element - mean) * delta;
  }
  if(i >1)  variance /= i-1;
  else      variance /= i;
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
  let scores = [];
  let savedScores = [];

  for(let i = 0; i < systems; i++){
    systemsArray.push(i);
  }
  systemsArray.push(systems-1);

  for(let i = 0; i < hackers; i++){
    array[i] = [];
    let totalSystemsHacked = 0;
    let totalToPush = 0;

    for(let j = 0; j < systems; j++){
      const randomNumber = Math.random();

      array[i].push(totalToPush);  

      if(randomNumber <= p)   totalSystemsHacked++;   
      else                    totalSystemsHacked--;

      if(frequency_select.value == "Relative frequencies")        totalToPush = totalSystemsHacked/(j+1);

      else if(frequency_select.value == "Absolute frequencies")   totalToPush = totalSystemsHacked;

      if(j == n-1) savedScores.push(totalToPush); 
    }
    array[i].push(totalToPush);

    dataset.push({
      data: array[i],
      stepped: "after",
      pointStyle: false
    })

    scores.push(totalToPush);
  }

  if(frequency_select.value == "Relative frequencies"){
    scores.forEach((score, index) => {
      scores[index] = Math.round(score * 1000) / 1000;
  });
  

    savedScores.forEach((score, index) => {
      savedScores[index] = Math.round(score * 1000) / 1000;
  });
}

  let dict = {};
  scores.forEach(element => {
    if(element in dict)   dict[element] = dict[element]+1;
    else                  dict[element] = 1;
  })

  const keys = Object.keys(dict).map(Number);
 
  const sortedKeys = keys.slice().sort((a, b) => a - b);
  const sortedValues = sortedKeys.map(key => dict[key]);

  let internalDict = {};
  savedScores.forEach(element => {
    if(element in internalDict)   internalDict[element] = internalDict[element]+1;
    else                          internalDict[element] = 1;
  })

  const internalKeys = Object.keys(internalDict).map(Number);

  const internalSortedKeys = internalKeys.slice().sort((a, b) => a - b);
  const internalSortedValues = internalSortedKeys.map(key => internalDict[key]);

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

  const arithmeticMean_variance_object = arithmetic_mean_and_variance(scores);

  arithmetic_mean_label.textContent = "Actual mean: " + String(arithmeticMean_variance_object.mean);
  expected_mean_label.textContent = "Expected mean: " + String(systems * (2*p-1));
  variance_label.textContent = "variance: " + String(arithmeticMean_variance_object.variance);

  const arithmeticMean_variance_objectInternal = arithmetic_mean_and_variance(savedScores);

  arithmetic_mean_label1.textContent = "Actual mean: " + String(arithmeticMean_variance_objectInternal.mean);
  expected_mean_label1.textContent = "Expected mean: " + String(n * (2*p-1));
  variance_label1.textContent = "variance: " + String(arithmeticMean_variance_objectInternal.variance);

  let scoreBoardText = "";

  if(frequency_select.value == "Relative frequencies"){
    scoreBoardText = "Number of hackers";
  }
  else if(frequency_select.value == "Absolute frequencies"){
    scoreBoardText = "Number of hackers";
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
        labels: sortedKeys,
        datasets: [{
          label: "Score",
          data: sortedValues,
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
        labels: internalSortedKeys,
        datasets: [{
          label: "Score",
          data: internalSortedValues,
          backgroundColor: colors,
          borderColor: colors,
          color: colors
        }]
      }
    }
  )
}