let currentChart0;
let currentChart1;

const generateButton = document.getElementById('button__generate');
const errorText = document.getElementById("error");
const arithmetic_mean_label = document.getElementById("arithmetic_mean");
const expected_mean_label = document.getElementById("expected_mean");
const expected_variance_label = document.getElementById("expected_variance");
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
  const r = Math.floor(Math.random() * 255);
  const g = Math.floor(Math.random() * 255);
  const b = Math.floor(Math.random() * 255);
  return "rgba(" + r + "," + g + "," + b + ", 1.0)";
}

function poolColors(a) {
  let pool = [];
  for(i = 0; i < a; i++) {
      pool.push(dynamicColors());
  }
  return pool;
}

function generate(){

  let lambda = parseFloat(document.getElementById('lambda').value)
  let hackers = parseInt(document.getElementById('hackers').value)
  let t = parseInt(document.getElementById('t').value)
  let n = parseInt(document.getElementById('n').value)

  if(isNaN(t) || isNaN(hackers) || isNaN(n) || isNaN(lambda)){
    errorText.textContent = "Invalid numbers";
    return;
  }

  if(t <= 0 || hackers <= 0 || lambda <= 0 || n <= 0) {
    errorText.textContent = "numbers cannot be negative";
    return;
  }
  const p = lambda/n;

  errorText.textContent = "";

  if(currentChart0) currentChart0.destroy();
  if(currentChart1) currentChart1.destroy();

  let array = [];
  let dataset = [];
  let tArray = [];
  let scores = [];

  for(let i = 0; i < n+1; i++){
    tArray.push(i*t/n);
  }
  
  const increment_factor = 1/Math.sqrt(n);
  let max = 0;
  let min = n+1;
  for(let i = 0; i < hackers; i++){
    array[i] = [];
    let totalSystemsHacked = 0;
    
    for(let j = 0; j < n; j++){
      const randomNumber = Math.random();
      array[i].push(totalSystemsHacked);
      if(randomNumber <= p) totalSystemsHacked += increment_factor;
      else                  totalSystemsHacked -= increment_factor;
    }
    
    dataset.push({
      data: array[i],
      stepped: "after",
      pointStyle: false
    })

    scores.push(totalSystemsHacked);
    if(totalSystemsHacked > max) max = totalSystemsHacked;
    if(totalSystemsHacked < min) min = totalSystemsHacked;
  }

  scores.forEach((score, index) => {
    scores[index] = Math.round(score * 1000) / 1000;
});

    let dict = {};
    scores.forEach(element => {
    if(element in dict)   dict[element] = dict[element]+1;
    else                  dict[element] = 1;
    })

    const keys = Object.keys(dict).map(Number);

    const sortedKeys = keys.slice().sort((a, b) => a - b);
    const sortedValues = sortedKeys.map(key => dict[key]);

    const decimation = {
        enabled: true,
        algorithm: 'min-max',
    };

  currentChart0 = new Chart(
    document.getElementById('chart_hackersPath'),
    {
      type: 'line',
      data: {
        labels: tArray,
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
              text: 'Time',
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
  
  let colors = poolColors(max-min);

  const arithmeticMean_variance_object = arithmetic_mean_and_variance(scores);

  arithmetic_mean_label.textContent = "Actual mean: " + String(arithmeticMean_variance_object.mean);
  expected_mean_label.textContent = "Expected mean: " + String((2*lambda - n)/Math.sqrt(n));
  expected_variance_label.textContent = "Expected variance: " + String(1 - Math.pow((2*lambda -n)/n ,2));
  variance_label.textContent = "Variance: " + String(arithmeticMean_variance_object.variance);
  
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
      },
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
}
