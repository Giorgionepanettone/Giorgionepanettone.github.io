let currentChart0;
let currentChart1;

const generateButton = document.getElementById('button__generate');
const errorText = document.getElementById("error");
const arithmetic_mean_label = document.getElementById("arithmetic_mean");
const expected_mean_label = document.getElementById("expected_mean");
const slice_checkbox = document.getElementById("myCheckbox");

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
  let scoreBoard = [];
  let possibleScoresArray = [];
  let scores = [];

  for(let i = 0; i < n*t+1; i++){
    tArray.push(i/n);
    scoreBoard.push(0);
  }
  
  let max = 0;
  let min = n*t+1;
  for(let i = 0; i < hackers; i++){
    array[i] = [];
    let totalSystemsHacked = 0;
    
    for(let j = 0; j < n*t; j++){
      const randomNumber = Math.random();
      array[i].push(totalSystemsHacked);
      if(randomNumber <= p) totalSystemsHacked++;
    }
    
    dataset.push({
      data: array[i],
      stepped: "after",
      pointStyle: false
    })
    scores.push(totalSystemsHacked);
    if(totalSystemsHacked > max) max = totalSystemsHacked;
    if(totalSystemsHacked < min) min = totalSystemsHacked;
    scoreBoard[totalSystemsHacked]++;
  }

  if(slice_checkbox.checked)    for(let i = min; i < max+1; i++) possibleScoresArray.push(i);
  else                          for(let i = 0; i < max+1; i++) possibleScoresArray.push(i);

  const decimation = {
    enabled: true,
    algorithm: 'min-max',
  };

  console.log(tArray);
  console.log(scoreBoard);

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

  arithmetic_mean_label.textContent = "Actual mean: " + String(arithmetic_mean_and_variance(scores).mean);
  expected_mean_label.textContent = "Expected mean: " + String(lambda * t);

  if(slice_checkbox.checked)    scoreBoard = scoreBoard.slice(min, max+1); 
  else                          scoreBoard = scoreBoard.slice(0, max+1);                     

                       
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
              text: 'Succesful hacks',
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
        labels: possibleScoresArray,
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
}
