let variables_list;
const variables_form = document.getElementById("variables_form");
const intervals_input = document.getElementById("intervals");
let intervals = parseInt(intervals_input.value);
let steps;
let chart;
let samples;
let variables_list_percentages;
let optional_chart;
let g;
let U;
let n;

intervals_input.addEventListener('change', (event) =>{
    intervals_have_changed();
});

const errorText = document.getElementById("error");
errorText.style.color = "red";

const optional_errorText = document.getElementById("optional_error");
optional_errorText.style.color = "red";

document.getElementById('button__generate').addEventListener("click", (event) => {
    event.preventDefault();
    generate();
  });

document.getElementById('optional_button__generate').addEventListener("click", (event) => {
    event.preventDefault();
    optional_generate();
});

document.addEventListener('DOMContentLoaded', (event) => {
    let a,b,c;
    a = document.getElementById("Variable 0");
    b = document.getElementById("Variable 1");
    c = document.getElementById("Variable 2");
    if (a && b && c){
        a.value = 50;
        b.value = 25;
        c.value = 25;
    }
    generate();
    optional_generate();
});

for(let i = 0; i < intervals; i++){
    add_variable(i);
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
        }  
    }
        
    intervals = new_intervals;
}

function input_retrieval(){
    variables_list = [];
    for(let i = 0; i < intervals; i++){
        variables_list.push(parseFloat(document.getElementById("Variable " + String(i)).value));
    }
    variables_list_percentages = [];
    for(let i = 0; i < variables_list.length; i++){
        variables_list_percentages.push(variables_list[i]/100);
    }
    return check_input_correctness();
}

function check_input_correctness(){
    let total_probability = 0;
    for(let i = 0; i < variables_list.length; i++){
        total_probability += variables_list[i];
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
    }
    
    steps = parseInt(document.getElementById("steps").value);
    const increment_factor = 1/steps;

    samples = parseInt(document.getElementById("samples").value);
    
    for(let i = 0; i < samples; i++){ 
        scores[i] = [];
        for(let j = 0; j < intervals; j++){
            scores[i].push(0);
        }

        for(let j = 0; j < steps; j++){
            const random_number = Math.random();
            scores[i][binary_search(probability_slices, random_number)]+= increment_factor;
        }
    }
    return scores;
}

function shannon_entropy(dataset, total_samples){
    let entropy = 0;
    for(let i = 0; i < dataset.length; i++){
        const probability = dataset[i]/total_samples;
        if(probability == 0) continue;
        entropy += probability * Math.log2(probability);
    }
    return -entropy;
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

function display_graph(x_axis_values, y_axis_values){

    if(chart) chart.destroy();

    chart = createChart_scoreboard("chart_scoreBoard", x_axis_values, y_axis_values, poolColors(x_axis_values.length));
}

function compute_means_and_variances(scores){
 
    let averages = [];
    let variances = [];
    for(let i = 0; i < scores.length; i++){
        average_and_mean = 
        averages.push(probability_weighted_mean(scores[i], variables_list_percentages));
        variances.push(arithmetic_mean_and_variance(scores[i]).variance);
    }
    return {averages, variances};
}


function generate(){
    if(input_retrieval() == -1) return;

    const scores = generate_data();

    const averages_and_variances = compute_means_and_variances(scores);

    roundScores(averages_and_variances.averages);

    const average_scores = sortKeysAndValues(averages_and_variances.averages);
    
    display_graph(average_scores.sortedKeys, average_scores.sortedValues);

    set_mean_and_variance(scores, averages_and_variances);
}

function optional_generate(){
    do_optional_homework();
}

function do_optional_homework(){
    optional_input_retrieval();

    let optional_scores = optional_generate_data();

    optional_display_graph(optional_scores);

    optional_set_entropy(shannon_entropy(optional_scores, U));
}

function optional_set_entropy(entropy){
    document.getElementById("shannon_entropy").textContent = "Shannon bit entropy= " +  String(entropy);
    document.getElementById("max_shannon_entropy").textContent = "Max possible shannon entropy= " +  String(shannon_entropy(Array(n).fill(U/n), U));   
}

function optional_display_graph(optional_scores){
    let x_axis_values = [];
    for(let i = 0; i < n; i++){
        x_axis_values.push(i);
    }

    if(optional_chart) optional_chart.destroy();

    optional_chart = createChart_scoreboard("chart_optional_first", x_axis_values, optional_scores, poolColors(x_axis_values.length));
}

function optional_input_retrieval(){
    g = parseInt(document.getElementById("g").value);
    U = parseInt(document.getElementById("U").value);
    n = parseInt(document.getElementById("n").value);

    if(isNaN(g) || isNaN(U) || isNaN(n)){
        optional_errorText.textContent = "invalid numbers";
    }
    
    if(g < 0 || U < 0 || n < 0){
        optional_errorText.textContent = "numbers cannot be negative";
    }
}

function optional_generate_data(){
    let optional_scores = Array(n).fill(0);

    for(let i = 1; i <= U; i++){
        optional_scores[modularExponentiation(g, i, n)]++;
    }
    return optional_scores;
}

function modularExponentiation(base, exponent, mod) {
    let result = 1;
    base = base % mod;
    
    while (exponent > 0) {
        if (exponent % 2 === 1) {
            result = (result * base) % mod;
        }
        base = (base * base) % mod;
        exponent = Math.floor(exponent / 2);
    }
    return result;
}

function set_mean_and_variance(scores, averages_and_variances){
    const mean_and_variance = arithmetic_mean_and_variance(averages_and_variances.averages);

    document.getElementById("average_of_averages").textContent = "Average of averages: " + String(mean_and_variance.mean);
    document.getElementById("parent_average").textContent = "Parent average: " + String(probability_weighted_mean(variables_list_percentages, variables_list_percentages));
    document.getElementById("variance_of_averages").textContent = "Variance of averages: " + String(mean_and_variance.variance);
    document.getElementById("parent_variance").textContent = "Parent variance: " + String(arithmetic_mean_and_variance(variables_list_percentages).variance);
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
    
    if (i > 1) variance /= i - 1;
    else if (i == 1) variance = 0;
    else variance = NaN;

    return {mean, variance};
}

function probability_weighted_mean(set, probabilities){
    let mean = 0;
    for(let i = 0; i < set.length; i++){
        mean += set[i] * probabilities[i];
    }
    return mean;
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