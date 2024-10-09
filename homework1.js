let currentChart0;
let currentChart1;

const generateButton = document.getElementById('button__generate');
const errorText = document.getElementById("error");
const arithmetic_mean_label = document.getElementById("arithmetic_mean");
const expected_mean_label = document.getElementById("expected_mean");
errorText.style.color = "red"
generateButton.addEventListener("click", (event) => {
  event.preventDefault();
  generate();
});

document.addEventListener('DOMContentLoaded', (event) => {
  generate();
});

function arithmetic_mean(set){
  let count = 0;
  let mean = 0;
  let i = 0;

  while(i < set.length){
    let element = set[i];
    if (element != 0){
      let j = 0;
      while(j < element){
        count++;
        mean = mean + (i - mean)/count;
        j++
      }
      
    } 
    i++;
  }
  return mean;
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

  if(isNaN(systems) || isNaN(hackers) || isNaN(p)){
    errorText.textContent = "Invalid numbers";
    return;
  } 

  if(systems <= 0 || hackers <= 0 || p < 0) {
    errorText.textContent = "numbers cannot be negative";
    return;
  }

  errorText.textContent = "";

  if(currentChart0) currentChart0.destroy();
  if(currentChart1) currentChart1.destroy();

  let array = [];
  let dataset = [];
  let systemsArray = [];
  let scoreBoard = [];

  for(let i = 0; i < systems; i++){
    systemsArray.push(i);
    scoreBoard.push(0);
  }
  scoreBoard.push(0);
  systemsArray.push(systems-1);


  for(let i = 0; i < hackers; i++){
    array[i] = [];
    let totalSystemsHacked = 0;
    for(let j = 0; j < systems; j++){
      let randomNumber = Math.random();
      array[i].push(totalSystemsHacked);
      if(randomNumber <= p) totalSystemsHacked++;
    }
    array[i].push(totalSystemsHacked);
    dataset.push({
      data: array[i],
      stepped: "after",
      pointStyle: false
    })
    scoreBoard[totalSystemsHacked]++;
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

  let copyArray = systemsArray.slice(0, systems);
  copyArray.push(systems);

  arithmetic_mean_label.textContent = "Actual mean: " + String(arithmetic_mean(scoreBoard));
  expected_mean_label.textContent = "Expected mean: " + String(systems * p);
  currentChart1 = new Chart(
    document.getElementById('chart_scoreBoard'),
    {
      type: 'bar',
      options:{
        scales: {
          y: {
            title: {
              display: true,        
              text: 'Succesfull hacks',
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
          }
      },
      },
      data: {
        labels: copyArray,
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
