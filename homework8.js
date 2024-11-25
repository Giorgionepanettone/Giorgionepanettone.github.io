let chart_italian;

let chart_text;

const primes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 
    73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 
    157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 
    239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 
    331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 
    421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 
    509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 
    613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 
    709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 
    821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 
    919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997, 1009, 1013, 1019, 
    1021, 1031, 1033, 1039, 1049, 1051, 1061, 1063, 1069, 1087, 1091, 1093, 1097, 
    1103, 1109, 1117, 1123, 1129, 1151, 1153, 1163, 1171, 1181, 1187, 1193, 1201, 
    1213, 1217, 1223, 1229, 1231, 1237, 1249, 1259, 1277, 1279, 1283, 1289, 1291, 
    1297, 1301, 1303, 1307, 1319, 1321, 1327, 1361, 1367, 1373, 1381, 1399, 1409, 
    1423, 1427, 1429, 1433, 1439, 1447, 1451, 1453, 1459, 1471, 1481, 1483, 1487, 
    1489, 1493, 1499, 1511, 1523, 1531, 1543, 1549, 1553, 1559, 1567, 1571, 1579, 
    1583, 1597, 1601, 1607, 1609, 1613, 1619, 1621, 1627, 1637, 1657, 1663, 1667, 
    1669, 1693, 1697, 1699, 1709, 1721, 1723, 1733, 1741, 1747, 1753, 1759, 1777, 
    1783, 1787, 1789, 1801, 1811, 1823, 1831, 1847, 1861, 1867, 1871, 1873, 1877, 
    1879, 1889, 1901, 1907, 1913, 1931, 1933, 1949, 1951, 1973, 1979, 1987, 1993, 
    1997, 1999, 2003, 2011, 2017, 2027, 2029, 2039, 2053, 2063, 2069, 2081, 2083, 
    2087, 2089, 2099, 2111, 2113, 2129, 2131, 2137, 2141, 2143, 2153, 2161, 2179, 
    2203, 2207, 2213, 2221, 2237, 2239, 2243, 2251, 2267, 2269, 2273, 2281, 2287, 
    2293, 2297, 2309, 2311, 2333, 2339, 2341, 2347, 2351, 2357, 2371, 2377, 2381, 
    2383, 2389, 2393, 2399, 2411, 2417, 2423, 2437, 2441, 2447, 2459, 2467, 2473, 
    2477, 2503, 2521, 2531, 2539, 2543, 2549, 2551, 2557, 2579, 2591, 2593, 2609, 
    2617, 2621, 2633, 2647, 2657, 2659, 2663, 2671, 2677, 2683, 2687, 2689, 2693, 
    2699, 2707, 2711, 2713, 2719, 2729, 2731, 2741, 2749, 2753, 2767, 2777, 2789, 
    2791, 2797, 2801, 2803, 2819, 2833, 2837, 2843, 2851, 2857, 2861, 2879, 2887, 
    2897, 2903, 2909, 2917, 2927, 2939, 2953, 2957, 2963, 2969, 2971, 2999, 3001
  ];  

document.getElementById('button__generate').addEventListener("click", (event) => {
    event.preventDefault();
    generate();
  });

  document.addEventListener('DOMContentLoaded', (event) => {
    fetch("./promessi_sposi/Promessi_sposi.txt")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Error: ${response.statusText}`);
            }
            return response.text();
        })
        .then(data => {
            
            document.getElementById("plainText").value = data;

            
            generate();
        })
        .catch(error => {
            console.error('Error fetching the file:', error);
        });
});


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

function display_graph(x_axis_values, y_axis_values, html_name, chart){

    if(chart) chart.destroy();

    return createChart_scoreboard(html_name, x_axis_values, y_axis_values, poolColors(x_axis_values.length));
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

function retrieve_text(){
    return document.getElementById("plainText").value;
}

const frequenze_lingua_italiana = [11.74 - 0.002, 0.92, 4.50, 3.73, 11.79, 0.95, 1.64, 1.54, 11.28 - 0.001, 0.001, 0.002, 6.51 - 0.003, 2.51, 6.88 - 0.004, 9.83 - 0.005, 3.05, 0.51, 6.37, 4.98, 5.62, 3.01, 2.10, 0.003, 0.004, 0.005, 0.49];

const alphabetArray = Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i));

chart_italian = display_graph(alphabetArray, frequenze_lingua_italiana, "chart_italian", chart_italian);

function apply_caesar_cipher(text, positions){
    document.getElementById("shift_quantity").textContent = "Shift random quantity = " + String(positions);


    let shifted_text = "";
    for (const char of text){
        if(is_character_letter(char)){
            shifted_text += shiftCharacter(char, positions);
        }
        else{
            shifted_text += char;
        }
    }
    return shifted_text;
}

function lcm(x, y){
    return Math.abs(x*y) / gcd(x,y);
}

function extendedGCD(a, b) {
    if (b === 0) {
      return { gcd: a, x: 1, y: 0 };
    }
    const { gcd, x: x1, y: y1 } = extendedGCD(b, a % b);
    return { gcd, x: y1, y: x1 - Math.floor(a / b) * y1 };
}

function modularInverse(e, lambda) {
    const { gcd, x } = extendedGCD(e, lambda);
  
    if (gcd !== 1) {
        return -1;
    }
  
    return (x % lambda + lambda) % lambda;
}

function apply_rsa_cipher(text){
    const p = randomPrime(11,30);
    const q = randomPrime(31,100);

    const n = p * q;

    const lambda = (p-1) * (q-1);//lcm(p-1, q-1);

    let e = 65537;
    if(e >= lambda || gcd(e, lambda) != 1){
        for(i = 2; i < lambda; i++){
            if(gcd(i, lambda) == 1){
                e = i;
                break;
            }
        }
    }
    
    const d = modularInverse(e, lambda);

    return rsaEncrypt(text, e, n);
}

function is_character_letter(char){
    return (char >= 'a' && char <= 'z') || (char >= 'A' && char <='Z');
}

function shannon_entropy(dataset){
    let entropy = 0;
    for(let i = 0; i < dataset.length; i++){
        const probability = dataset[i]/100;
        if(probability == 0) continue;
        entropy += probability * Math.log(probability);
    }
    return -entropy;
}

function shiftCharacter(char, positions){
    if(isUpper(char)){
        const newCharCode = ((char.charCodeAt(0) - 65 + positions ) %26) + 65;
        return String.fromCharCode(newCharCode);
    }
    else{
        const newCharCode = ((char.charCodeAt(0) - 97 + positions) %26) + 97;
        return String.fromCharCode(newCharCode);
    }
}

function isUpper(char){
    return char >= 'A' && char <= 'Z';
}

function generatePermutationMatrix(arr, perm) {
    const n = arr.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));
  
    for (let i = 0; i < n; i++) {
      const permutedIndex = arr.indexOf(perm[i]);
      matrix[permutedIndex][i] = 1;
    }
  
    return matrix;
}
 
function mult_arr_matrix(arr, matrix){
    let result_arr = Array(arr.length).fill(0);

    for(let i = 0; i < arr.length; i++){ // columns
        for(let j = 0; j < arr.length; j++){ //row
            result_arr[i] += arr[j] * matrix[j][i];
        }
        
    }
    return result_arr;
}

function decrypt_caesar(cypherText){
    let frequency_array = countLetters(cypherText);
    chart_text = display_graph(alphabetArray, frequency_array,"chart_text", chart_text);

    document.getElementById("shannon").textContent = "Shannon entropy: " + String(shannon_entropy(frequency_array));
    let min = Infinity;
    let shift_quantity;
    let stat_distances = Array(frequency_array.length); 
    for(let i = 0; i < 26; i++){
        let stat_dist = statistical_distance(shift_array_by_n(frequency_array, i), frequenze_lingua_italiana);
        stat_distances[i] = stat_dist;
        if(stat_dist < min){
            min = stat_dist;
            shift_quantity = (26 - i)%26;
        }
    }
    document.getElementById("shift_quantity_recovered").textContent = "Recovered shift quantity = " + String(26 - shift_quantity);
    console.log("stat_distances = ", stat_distances);
    console.log("shift_quantity = ", shift_quantity);

    return apply_caesar_cipher(cypherText, 26 - shift_quantity);
}

function decrypt_rsa(cypherText, plainText){
    return rsa(cypherText, plainText);
}

function find_closest_match(value, array){
    let closest_match = -1;
    let closest_gap = Math.abs(value - array[0]) + 1;
    for(let i = 0; i < array.length; i++){
        const curr_gap = Math.abs(value - array[i]);
        if( curr_gap < closest_gap){
            closest_match = i;
            closest_gap = curr_gap;
        }
    }
    return closest_match;
}

function shift_array_by_n(array, n){
    let copy_array = [...array];
    for(let i = 0; i < n; i++){
        copy_array.unshift(copy_array.pop());
    }
    return copy_array;
}

function singleCaesar(cypherText, array){
     
}

function sortKeysAndValues(map){
    const keys = Array.from(map.keys());

    const sortedKeys = keys.slice().sort((a, b) => a - b);
    const sortedValues = sortedKeys.map(key => map.get(key));

    return{ sortedKeys: sortedKeys, sortedValues: sortedValues};
}

function rsa(cypherText, plainText){
    let frequency_map = countLetters_rsa(cypherText, plainText);

    let {sortedKeys, sortedValues} = sortKeysAndValues(frequency_map);
    chart_text = display_graph(sortedKeys, sortedValues,"chart_text", chart_text);
    
    const sorted_frequenze = frequenze_lingua_italiana.map((x) => x).sort((a, b) => a - b);

    const permutation_matrix = generatePermutationMatrix(sorted_frequenze, frequenze_lingua_italiana);

    const sorted_frequencies = sortedValues.sort((a,b) => a - b);

    const result_array = mult_arr_matrix(sorted_frequencies, permutation_matrix);

    document.getElementById("shannon").textContent = "Shannon entropy: " + String(shannon_entropy(result_array));


    return translate_rsa(cypherText, result_array, frequency_map);
}

function translate_rsa(cypherText, result_array, original_map){
    let res = "";
    for(let char of cypherText){
        if(!original_map.has(char)) res += char;

        else{
            res += String.fromCharCode( result_array.indexOf(original_map.get(char)) + 'a'.charCodeAt(0));
        }
    }
    return res;
}

function countLetters(text){
    let frequency_array = Array(26).fill(0);

    let letters_count = 0;
    for(const char of text){
        if(!is_character_letter(char)) continue;
        letters_count++;
        const charCode = char.toLowerCase().charCodeAt(0);

        frequency_array[charCode - 97]++;
    }

    for(let i = 0; i < 26; i++){
        frequency_array[i] = frequency_array[i] * 100 / letters_count;
    }

    return frequency_array;
}

function countLetters_rsa(cypherText, plainText){
    const counts = new Map();
    let lettersCount = 0;
    let i = -1;
    for(let char of cypherText){
        i++;
        if(char == plainText[i]) continue;
        lettersCount++;
        if (counts.has(char)){
            counts.set(char, counts.get(char) + 1)
        }
        else{
            counts.set(char, 1);
        }
    }
    for(let [key, value] of counts){
        counts.set(key, value * 100 / lettersCount);
    }
    for(let i = 0; counts.size < 26; i++){
        let character = String.fromCharCode(i);
        if(!counts.has(character)) counts.set(character,0);
    }
    return counts;
}

function statistical_distance(set1, set2){
    if(set1.length != set2.length) return -1;

    let statistical_distance = 0;
    for(let i = 0; i < set1.length; i++){
        statistical_distance += Math.abs(set1[i] - set2[i]);
    }
    
    return 0.5 * statistical_distance;
}

function apply_changes_to_html(plainText, cypherText, decryptedText){
    const plainText_div = document.getElementById("plainText_div");
    const cypherText_div = document.getElementById("cypherText_div");
    const decryptedText_div = document.getElementById("decryptedText_div");

    const limit = 600;

    if(plainText.length >= limit){
        plainText = plainText.slice(0, limit) + "...";
    }

    if(cypherText.length >= limit){
        cypherText = cypherText.slice(0, limit) + "...";
    }

    if(decryptedText.length >= limit){
        decryptedText = decryptedText.slice(0, limit) + "...";
    }
    
    plainText_div.textContent = plainText;
    cypherText_div.textContent = cypherText;
    decryptedText_div.textContent = decryptedText;
}

function gcd(a, b) {
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

function binarySearch(array, target, findFirst) {
    let low = 0, high = array.length - 1, result = -1;
    while (low <= high) {
      const mid = Math.floor((low + high) / 2);
      if (array[mid] === target) {
        result = mid;
        if (findFirst) {
          high = mid - 1;
        } else {
          low = mid + 1;
        }
      } else if (array[mid] < target) {
        low = mid + 1;
      } else {
        high = mid - 1;
      }
    }
    return result === -1 ? (findFirst ? low : high) : result;
}

function randomPrime(min, max) {
    if(max < min)   return -1;
    const firstIndex = binarySearch(primes, min, true);
    const secondIndex = binarySearch(primes, max, false);

    return primes[Math.floor(Math.random() * (secondIndex - firstIndex + 1)) + firstIndex];
}

function rsaEncrypt(text, e, n) {
    return text
        .split("")
        .map(char => {
            if(is_character_letter(char)){
                let L = char.toLowerCase().charCodeAt(0);
                return String.fromCharCode(modularExponentiation(L, e, n));
            }
            else return char;         
        })
        .join("");
}

function modInverse(e, phi) {
    let [a, b, u] = [0, phi, 1];
    while (e > 0) {
        let q = Math.floor(b / e);
        [e, a, b, u] = [b % e, u, e, a - q * u];
    }
    if (b === 1) return a % phi + (a < 0 ? phi : 0);
    throw new Error("No modular inverse");
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

function clean_previous(){
    document.getElementById("shift_quantity_recovered").textContent = "";
    document.getElementById("shift_quantity").textContent = "";
}

function generate(){
    const text = retrieve_text();
    console.log("plaintext = ", text);

    const random_shift_value = Math.floor(Math.random() * 25);
    console.log("random shift value = ", random_shift_value);

    const option_selected = document.getElementById("options").value;
    
    let cypherText;
    let decrypted_text;
    
    if(option_selected == "Caesar"){
        cypherText = apply_caesar_cipher(text, random_shift_value);
        decrypted_text = decrypt_caesar(cypherText);
    } 
    if(option_selected == "Rsa"){
        clean_previous();
        cypherText = apply_rsa_cipher(text);
        decrypted_text = decrypt_rsa(cypherText, text);
    }
    console.log("cyphertext = ", cypherText);

    console.log("decryptedText = ", decrypted_text);

    apply_changes_to_html(text, cypherText, decrypted_text);
}