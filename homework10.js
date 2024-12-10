const errorText = document.getElementById("error");
errorText.style.color = "red";
let chart;

document.getElementById('button__generate').addEventListener("click", (event) => {
    event.preventDefault();
    generate();
});

document.addEventListener('DOMContentLoaded', (event) => {
    generate();
});

function riemann_integration(a, b, math_function, granularity){
    if(b < a) return null;
    
    let result = 0;
    const dx = (b - a)/ granularity;

    for(let i = 0; i < granularity; i++){
        result += math_function(a + dx*i) * dx;
    }
    return result;
}

function lebesgue_integration(a, b, math_function, granularity){
    if(b < a) return null;

    let result = 0;
    const dy = (b - a)/ granularity;

    for(let i = 0; i < granularity; i++){
        result += (math_function(a + dy*(i+1)) - math_function(a + dy*i)) * (b - (a+(dy*i)) );
    }

    if(math_function(a) != 0 ){
        result += math_function(a) * (b-a);
    }
    return result;
}

function square(x){
    return Math.pow(x,2);
}

function euler_exponentiation(x){
    const e = 2.718;
    return Math.pow(e, x);
}

function retrieve_input(){
    const granularity = parseInt(document.getElementById("granularity").value);
    const a = parseInt(document.getElementById("a").value);
    const b = parseInt(document.getElementById("b").value);

    if(isNaN(granularity) || isNaN(a) || isNaN(b)){
        errorText.textContent = "values must be numbers";
        return null;
    }
    
    if(granularity <= 0){
        errorText.textContent = "Granularity must be positive";
        return null;
    }

    if(a > b){
        errorText.textContent = "Upper limit must be greater than lower limit";
        return null;
    }

    errorText.textContent = "";
    return [granularity, a, b];
}

function dynamicColors() {
    const r = Math.floor(Math.random() * 255);
    const g = Math.floor(Math.random() * 255);
    const b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + ", 1.0)";
}
  
function poolColors(x) {
    let pool = [];
    for(i = 0; i < x; i++) {
        pool.push(dynamicColors());
    }
    return pool;
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

function set_chart(riemann, lebesgue){
    let x_axis_values = Array();
    x_axis_values.push("Riemann integral");
    x_axis_values.push("Lebesgue integral");

    let y_axis_values = Array();
    y_axis_values.push(riemann);
    y_axis_values.push(lebesgue);

    if(chart) chart.destroy();
    chart = createChart_scoreboard("chart_scoreBoard", x_axis_values, y_axis_values, poolColors(2));
}

function generate(){
    const [granularity,a,b] = retrieve_input();

    if(!granularity || !a || !b) return;

    const integral_value_riemann = riemann_integration(a, b, euler_exponentiation, granularity);
    const integral_value_lebesgue = lebesgue_integration(a, b, euler_exponentiation, granularity);

    set_chart(integral_value_riemann, integral_value_lebesgue);
}