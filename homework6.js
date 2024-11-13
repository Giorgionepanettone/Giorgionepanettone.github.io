let variables_list;
const variables_form = document.getElementById("variables_form");
const intervals_input = document.getElementById("intervals");
let intervals = parseInt(intervals_input.value);
let steps;
let chart;

intervals_input.addEventListener('change', intervals_have_changed);

const errorText = document.getElementById("error");
errorText.style.color = "red";

document.getElementById('button__generate').addEventListener("click", (event) => {
    event.preventDefault();
    generate();
  });

document.addEventListener('DOMContentLoaded', (event) => {
    generate();
});

  for(let i = 0; i < intervals; i++){
    add_variable(i);
}

function intervals_have_changed(){
    const new_intervals = parseInt(intervals_input.value);
    if(intervals < new_intervals){
        for(let i = intervals; i < new_intervals; i++){
            add_variable(i);
        }   
    }   
    
    if(intervals > new_intervals){
        for(let i = new_intervals; i < intervals; i++){
            remove_variable();
            console.log("removed_variable");
        }  
    }
        
    intervals = new_intervals;
}

function input_retrieval(){
    variables_list = [];
    for(let i = 0; i < intervals; i++){
        variables_list.push(parseFloat(document.getElementById("Variable " + String(i)).value));
    }
    return check_input_correctness();
}

function check_input_correctness(){
    let total_probability = 0;
    for(let i = 0; i < variables_list.length; i++){
        total_probability += variables_list[i];
        if(total_probability > 100){
            error.textContent = "Probability sum greater than 100%";
            return -1;
        }
    }
    if(total_probability != 100){
        error.textContent = "Probability sum is " + String(total_probability) + "%, different from 100%.";
        return -1;
    }
    error.textContent = "";
    return 0;
}

function generate_data(){
    let probability_slices = [];
    probability_slices[0] = variables_list[0]/100;
    let scores = [];
    for(let i = 1; i < intervals; i++){
        probability_slices.push(probability_slices[i-1] + variables_list[i]/100);
        scores.push(0);
    }
    scores.push(0);
    
    steps = parseInt(document.getElementById("steps").value);
    const increment_factor = 1/steps;
    for(let i = 0; i < steps; i++){
        const random_number = Math.random();
        scores[binary_search(probability_slices, random_number)]+= increment_factor;
    }
    return scores;
}

function binary_search(array, target){
    let low = 0;
    let high = array.length - 1;

    while(low <= high){
        const mid = Math.floor((low + high) / 2);

        if(array[mid] == target) return mid;

        if(array[mid] < target)     low =  mid + 1;
        else                        high = mid - 1;
    }
    return low;
}

function display_graph(scores){
    let x_axis_values = [];
    for(let i = 0; i < intervals; i++){
        x_axis_values.push("Var " + String(i));
    }

    if(chart) chart.destroy();

    chart = createChart_scoreboard("chart_scoreBoard", x_axis_values, scores, poolColors(x_axis_values.length));
}


function generate(){
    if(input_retrieval() == -1) return;

    const scores = generate_data();

    display_graph(scores);

    set_mean_and_variance(scores);
}

function set_mean_and_variance(scores){
    const mean_and_variance = arithmetic_mean_and_variance(scores);
    const expected_mean_and_variance = arithmetic_mean_and_variance(variables_list.map(element => element/100));
    document.getElementById("expected_mean").textContent = "Expected mean: " + String(expected_mean_and_variance.mean);
    document.getElementById("arithmetic_mean").textContent = "Actual mean: " + String(mean_and_variance.mean);
    document.getElementById("expected_variance").textContent = "Expected variance: " + String(expected_mean_and_variance.variance);
    document.getElementById("variance").textContent = "Actual variance: " + String(mean_and_variance.variance);
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

function add_variable(variable_number){
    string_to_add = `<!-- comment --><label class="label">` +"Variable " + String(variable_number) + `</label><br></br>`;
    string_to_add += `<!-- comment --><input class="input" type="number" id=` + `"Variable ` + String(variable_number) + `" value="50"><br>`;
    variables_form.innerHTML += string_to_add;
}

function remove_variable(){
    let lines = variables_form.innerHTML.split("<!-- comment -->");
        
    lines = lines.slice(0, -2);

    variables_form.innerHTML = lines.join("<!-- comment -->");
    console.log(lines.join("<!-- comment -->"));
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
            },
            x: {
                title: {
                display: true,        
                
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