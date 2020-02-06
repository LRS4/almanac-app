// Get TOTAL POPULATION STATS
var populationTotals = [];
var populationYears = [];

$.ajax({
type:"GET",
url:"https://api.worldbank.org/v2/country/gb/indicator/SP.POP.TOTL.?format=json",
async:false,
dataType: "json",
success: function(data) {

    // get current population and set in table
    if (data[1][0]["value"] == null) {
    var currentPopulationTotal = data[1][1]["value"]
    } else {
    var currentPopulationTotal = data[1][0]["value"]
    }
    $("#populationValue").text(numberWithCommas(currentPopulationTotal));

    // add to population trend arrays
    for (let i = 0; i < data[1].length; i++ ) {
    if (data[1][i]["value"] != null) {
        populationTotals.unshift(data[1][i]["value"]);
        populationYears.unshift((data[1][i]["date"])).toString();
    }
    }
},
error: function(errorMessage){
    alert("Error");
}
});

$.ajax({
type:"GET",
url:"https://api.worldbank.org/v2/country/gb/indicator/SP.POP.TOTL.?format=json&page=2",
async:false,
dataType: "json",
success: function(data) {
    // add to arrays
    for (let i = 0; i < data[1].length; i++ ) {
        if (data[1][i]["value"] != null) {
            populationTotals.unshift(data[1][i]["value"]);
            populationYears.unshift((data[1][i]["date"])).toString();
        }
    }
},
error: function(errorMessage){
    alert("Error");
}
});

// Get LATEST WORLD FACTBOOK
var youths;
var adults;
var elderly;
$.ajax({
    type:"GET",
    url:"https://raw.githubusercontent.com/iancoleman/cia_world_factbook_api/master/data/factbook.json",
    async:false,
    dataType: "json",
    success: function(data) {
        console.log("World Factbook finished loading... " + Object.keys(data.countries).length + " entries");
        var uk = data.countries.united_kingdom.data
        console.log(uk)

        // update demographic table data
        let population = Cookies.get('population');
        youths = population / 100 * (uk.people.age_structure['0_to_14'].percent + uk.people.age_structure['15_to_24'].percent);
        adults = population / 100 * (uk.people.age_structure['25_to_54'].percent + uk.people.age_structure['55_to_64'].percent);
        elderly = population / 100 * (uk.people.age_structure['65_and_over'].percent);

        // update birth, death and migration rate
        $('#birthsValue').text(uk.people.birth_rate.births_per_1000_population + ' per 1000 population')
        $('#deathsValue').text(uk.people.death_rate.deaths_per_1000_population + ' per 1000 population')
        $('#migrantValue').text(uk.people.net_migration_rate.migrants_per_1000_population + ' per 1000 population')
    },
    error: function(errorMessage){
        console.error("World Factbook API is not responding...")
    }
});
$('#youthValue').text(numberWithCommas(youths.toFixed(0)));
$('#middleValue').text(numberWithCommas(adults.toFixed(0)));
$('#elderlyValue').text(numberWithCommas(elderly.toFixed(0)));

// DUMMY DATA
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var dailyValues = [15339, 21345, 18483, 24003, 23489, 24092, 12034];

// CREATE LINE CHART
var ctx = document.getElementById("myChart");
var myChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: populationYears,
        datasets: [{
            data: populationTotals,
            lineTension: 0,
            backgroundColor: 'transparent',
            borderColor: '#007bff',
            borderWidth: 4,
            pointBackgroundColor: '#007bff'
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    userCallback: function(value, index, values) {
                        return value.toLocaleString();  // add commas
                    }
                }
            }]
        },
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: ['UK Population Trend', 'Source: World Bank (http://api.worldbank.org/)'],
            position: 'bottom'
        },
        maintainAspectRatio: false
    }
});

// CREATE BAR CHART
var chrt = document.getElementById("myBarChart");
var myBarChart = new Chart(chrt, {
    type: 'bar',
    data: {
        labels: ['Youths', 'Adults', 'Over 65s'],
        datasets: [{
            data: [youths, adults, elderly],
            lineTension: 0,
        }]
    },
    options: {
        scales: {
            yAxes: [{
                ticks: {
                    beginAtZero: true,
                    userCallback: function(value, index, values) {
                        return value.toLocaleString();  // add commas
                    }
                }
            }]
        },
        legend: {
            display: false,
        },
        title: {
            display: true,
            text: ['UK Population Trend', 'Source: World Bank (http://api.worldbank.org/)'],
            position: 'bottom'
        },
        maintainAspectRatio: false
    }
});

// CHANGE GRAPH LOGIC
$("tr").click(function(event) {
    //console.log(event.target.parentElement.id);
});

$("#populationRow").click(function() {
    $('#myBarChart').css('display', 'none');
    $('#myChart').css('display', 'block');
    myChart.data.datasets[0].data = populationTotals;
    myChart.data.labels = populationYears; 
    myChart.options.title.text = ['UK Population Trend', 'Source: World Bank (http://api.worldbank.org/)'];
    myChart.update();
});

$('.ageRows').click(function() {
    $('#myChart').css('display', 'none');
    $('#myBarChart').css('display', 'block');
});

// Full screen toggle
$('#btnFullScreen').click(function(e){
    $('#chartDiv').toggleClass('fullscreen');
});