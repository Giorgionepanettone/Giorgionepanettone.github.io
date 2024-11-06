let currentChart0;
let currentChart1;
let currentChart2;

let hackers;
let internal_step;
let systems;
let p;
let lambda;
let t;
let n;

let increment_factor;
let deincrement_factor;

document.getElementById('button__generate').addEventListener("click", (event) => {
  event.preventDefault();
  generate();
});

document.addEventListener('DOMContentLoaded', (event) => {
  generate();
});
document.getElementById("invis").style.display = "none";

document.getElementById('options').addEventListener('change', change_form_internally);

function change_form_internally(){
    const selected = document.getElementById('options').value;
    const form = document.getElementById('input_form');
    const chartContainer = document.getElementById("invis");

    switch (selected){
        case "Homework 1":
            form.innerHTML = `<select class = "select" id ="options">
                    <option>Homework 1</option>
                    <option>Homework 2</option>
                    <option>Homework 3</option>
                    <option>Homework 4</option>
                </select>
                <label class="label" for="hackers">Hackers:</label><br>
                <input class="input" type="number" id="hackers" name="hackers" value="50"><br>
    
                <label class="label" for="systems">Systems:</label><br>
                <input class="input" type="number" id="systems" name="systems" value="50"><br>
    
                <label class="label" for="probability">Success probability:</label><br>
                <input class="input" type="number" id="probability" name="probability" value="0.7"><br>
                
                <button class="button_generate" id="button__generate" role="button">Generate</button>
                <span id="error"></span>`;
                chartContainer.style.display = "none";
        break;
        case "Homework 2":
            form.innerHTML = `<select class = "select" id ="options">
                    <option>Homework 1</option>
                    <option>Homework 2</option>
                    <option>Homework 3</option>
                    <option>Homework 4</option>
                </select>
                <label class="label" for="hackers">Hackers:</label><br>
                <input class="input" type="number" id="hackers" name="hackers" value="500"><br>
    
                <label class="label" for="systems">Systems:</label><br>
                <input class="input" type="number" id="systems" name="systems" value="500"><br>
    
                <label class="label" for="probability">Success probability:</label><br>
                <input class="input" type="number" id="probability" name="probability" value="0.5"><br>

                <label class="label" for="internal n">Internal step:</label><br>
                <input class="input" type="number" id="internal_step" name="internal_n" value="200"><br>

                <select class = "select" id ="select_frequency">
                    <option>Absolute frequencies</option>
                    <option>Relative frequencies</option>
                </select>
                
                
                <button class="button_generate" id="button__generate" role="button">Generate</button>
                <span id="error"></span>`;
                chartContainer.style.display = "";
            break;
        case "Homework 3":
            form.innerHTML = `<select class = "select" id ="options">
                    <option>Homework 1</option>
                    <option>Homework 2</option>
                    <option>Homework 3</option>
                    <option>Homework 4</option>
                </select>
                <label class="label" for="lambda">λ:</label><br>
            <input class="input" type="number" id="lambda" name="lambda" value="100"><br>

            <label class="label" for="n">n:</label><br>
            <input class="input" type="number" id="n" name="n" value="500"><br>

            <label class="label" for="t">t: (in seconds)</label><br>
            <input class="input" type="number" id="t" name="t" value="4"><br>

            <label class="label" for="Hackers">Hackers:</label><br>
            <input class="input" type="number" id="hackers" name="Hackers" value="200"><br>

            <button class="button_generate" id="button__generate" role="button">Generate</button>
            <span id="error"></span>`;
            chartContainer.style.display = "none";
            break;
        case "Homework 4":
            form.innerHTML = `<select class = "select" id ="options">
                    <option>Homework 1</option>
                    <option>Homework 2</option>
                    <option>Homework 3</option>
                    <option>Homework 4</option>
                </select>
                <label class="label" for="lambda">λ:</label><br>
            <input class="input" type="number" id="lambda" name="lambda" value="250"><br>

            <label class="label" for="n">n:</label><br>
            <input class="input" type="number" id="n" name="n" value="500"><br>

            <label class="label" for="t">t: (in seconds)</label><br>
            <input class="input" type="number" id="t" name="t" value="4"><br>

            <label class="label" for="Hackers">Hackers:</label><br>
            <input class="input" type="number" id="hackers" name="Hackers" value="200"><br>

            <button class="button_generate" id="button__generate" role="button">Generate</button>
            <span id="error"></span>`;
            chartContainer.style.display = "none";
            break;
    }
    document.getElementById('options').addEventListener('change', change_form_internally);
    document.getElementById('options').value = selected;
    document.getElementById('button__generate').addEventListener("click", (event) => {
        event.preventDefault();
        generate();
    });
    generate();
}

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
    if(i > 1)   variance /= i-1;
    else        variance /= i;
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

function input_retrieval(operating_mode){
    const errorText = document.getElementById("error");
    errorText.style.color = "red";

    switch(operating_mode){
        case "Homework 1":
            hackers = parseInt(document.getElementById('hackers').value);
            systems = parseInt(document.getElementById('systems').value);
            p = parseFloat(document.getElementById('probability').value);

            if(isNaN(systems) || isNaN(hackers) || isNaN(p)){
                errorText.textContent = "Invalid numbers";
                return -1;
            } 
            
            if(systems <= 0 || hackers <= 0 || p < 0) {
                errorText.textContent = "numbers cannot be negative";
                return -1;
            }
        break;
        case "Homework 2":
            hackers = parseInt(document.getElementById('hackers').value);
            systems = parseInt(document.getElementById('systems').value);
            p = parseFloat(document.getElementById('probability').value);
            internal_step = parseInt(document.getElementById('internal_step').value)

            if(isNaN(systems) || isNaN(hackers) || isNaN(p) || isNaN(internal_step)){
                errorText.textContent = "Invalid numbers";
                return -1;
            } 
            
            if(systems <= 0 || hackers <= 0 || p < 0 || internal_step < 0) {
                errorText.textContent = "numbers cannot be negative";
                return -1;
            }
        break;
        case "Homework 3":
            lambda = parseFloat(document.getElementById('lambda').value)
            hackers = parseInt(document.getElementById('hackers').value)
            t = parseInt(document.getElementById('t').value)
            n = parseInt(document.getElementById('n').value)

            if(isNaN(t) || isNaN(hackers) || isNaN(n) || isNaN(lambda)){
                errorText.textContent = "Invalid numbers";
                return -1;
            }

            if(t <= 0 || hackers <= 0 || lambda <= 0 || n <= 0) {
                errorText.textContent = "numbers cannot be negative";
                return -1;
            }
        break;
        case "Homework 4":
            lambda = parseFloat(document.getElementById('lambda').value)
            hackers = parseInt(document.getElementById('hackers').value)
            t = parseInt(document.getElementById('t').value)
            n = parseInt(document.getElementById('n').value)

            if(isNaN(t) || isNaN(hackers) || isNaN(n) || isNaN(lambda)){
                errorText.textContent = "Invalid numbers";
                return -1;
            }

            if(t <= 0 || hackers <= 0 || lambda <= 0 || n <= 0) {
                errorText.textContent = "numbers cannot be negative";
                return -1;
            }
        break;
    }
    errorText.textContent = "";
    return 0;
}

function sortKeysAndValues(scoresArray){
    let dict = {};   
    scoresArray.forEach(element => {
    if(element in dict)   dict[element]++;
    else                  dict[element] = 1;
    })

    const keys = Object.keys(dict).map(Number);

    const sortedKeys = keys.slice().sort((a, b) => a - b);
    const sortedValues = sortedKeys.map(key => dict[key]);

    return{ sortedKeys: sortedKeys, sortedValues: sortedValues};
}

function roundScores(scores){
    scores.forEach((score, index) => {
        scores[index] = Math.round(score * 1000) / 1000;
    });
}

function createChart_scoreboard(chartName_html, sortedKeys, sortedValues, colors){
    return new Chart(
        document.getElementById(chartName_html),
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

function generate(){
    const operating_mode = document.getElementById('options').value;
    let savedScores = [];
    let internal_loop_variable;    
    let scores_roundable = false;
    let array = [];
    let dataset = [];
    let tArray = [];
    let scores = [];
    let systemsArray = [];

    if(input_retrieval(operating_mode) == -1) return;

    if(currentChart0) currentChart0.destroy();
    if(currentChart1) currentChart1.destroy();
    if(currentChart2) currentChart2.destroy();

    if (operating_mode == "Homework 3" || operating_mode == "Homework 4"){
        for(let i = 0; i < n+1; i++){
            tArray.push(i*t/n);
        }
    }
    
    if(operating_mode == "Homework 1" || operating_mode == "Homework 2"){
        for(let i = 0; i < systems+1; i++){
            systemsArray.push(i);
        }
    }

    switch(operating_mode){
        case "Homework 1":
            increment_factor = 1;
            deincrement_factor = 0;
            internal_loop_variable = systems;
        break;
        case "Homework 2":
            internal_loop_variable = systems;    
            const selectedFrequency = document.getElementById("select_frequency").value
            if(selectedFrequency == "Absolute frequencies"){
                increment_factor = 1;
                deincrement_factor = 1;
            }
            if(selectedFrequency == "Relative frequencies"){
                increment_factor = 1/internal_loop_variable;
                deincrement_factor = increment_factor;
                scores_roundable = true;
            }
        break;
        case "Homework 3":
            increment_factor = 1;
            deincrement_factor = 0;
            p = lambda/n;
            internal_loop_variable = n;
        break;
        case "Homework 4":
            increment_factor = 1/Math.sqrt(n);
            deincrement_factor = increment_factor;
            p = lambda/n;
            internal_loop_variable = n;
            scores_roundable = true;
        break;
    }

    let max = 0;
    let min = internal_loop_variable+1;
    for(let i = 0; i < hackers; i++){
        array[i] = [];
        let totalSystemsHacked = 0;
        
        for(let j = 0; j < internal_loop_variable; j++){
            const randomNumber = Math.random();
            array[i].push(totalSystemsHacked);
            if(randomNumber <= p) totalSystemsHacked += increment_factor;
            else                  totalSystemsHacked -= deincrement_factor;

            if(internal_step && j == internal_step) savedScores.push(totalSystemsHacked);
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

    if(scores_roundable){
        roundScores(scores);

        if(savedScores){
            roundScores(savedScores);
        }
    }
    
    const {sortedKeys: sortedKeys, sortedValues: sortedValues} = sortKeysAndValues(scores);

    const decimation = {
        enabled: true,
        algorithm: 'min-max',
    };

    const modeMap = {
        "Homework 1": systemsArray,
        "Homework 2": systemsArray,
        "Homework 3": tArray,
        "Homework 4": tArray,
    };
    
    const secondModeMap ={
        "Homework 1": "Systems",
        "Homework 2": "Systems",
        "Homework 3": "Time",
        "Homework 4": "Time",
    };

    const firstChartLabels = modeMap[operating_mode];
    const firstCharText = secondModeMap[operating_mode];

    currentChart0 = new Chart(
        document.getElementById('chart_hackersPath'),
        {
        type: 'line',
        data: {
            labels: firstChartLabels,
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
                text: firstCharText,
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
    
    let colors = poolColors(sortedKeys.length);

    const arithmeticMean_variance_object = arithmetic_mean_and_variance(scores);

    document.getElementById("arithmetic_mean").textContent = "Mean: " + String(arithmeticMean_variance_object.mean);
    document.getElementById("variance").textContent = "Variance: " + String(arithmeticMean_variance_object.variance);
    
    if(operating_mode == "Homework 2"){
        const {sortedKeys: internalSortedKeys, sortedValues: internalSortedValues} = sortKeysAndValues(savedScores);

        const arithmeticMean_variance_object1 = arithmetic_mean_and_variance(savedScores);
        document.getElementById("arithmetic_mean1").textContent = "Mean: " + String(arithmeticMean_variance_object1.mean);
        document.getElementById("variance1").textContent = "Variance: " + String(arithmeticMean_variance_object1.variance);

        currentChart2 = createChart_scoreboard('chart_scoreBoard1', internalSortedKeys, internalSortedValues, colors);        
    }

    currentChart1 = createChart_scoreboard('chart_scoreBoard', sortedKeys, sortedValues, colors);
}
