$(document).ready(function(){

	// update the $, population and happiness :) nav metrics then show nav metrics
	// if cookie not yet set, fire ajax and set cookie else just read the cookie :)
	if (Cookies.get('population') == undefined) {
		$.ajax({
			type:"GET",
			url:"http://api.worldbank.org/v2/country/gb/indicator/SP.POP.TOTL.?format=json",
			async:false,
			dataType: "json",
			success: function(data) {
				console.log("fired")
				// get current population and set in nav
				if (data[1][0]["value"] == null) {
				var currentPopulationTotal = data[1][1]["value"]
				} else {
				var currentPopulationTotal = data[1][0]["value"]
				}
				$(".populationMetric").text(numberWithCommas(currentPopulationTotal));
				Cookies.set('population', currentPopulationTotal);
			},
			error: function(errorMessage){
				console.error(errorMessage)
			}
		});
	} else {
		$(".populationMetric").text(numberWithCommas(Cookies.get('population')));
	}

	// TO DO - implement economy and happiness index calls
	if (Cookies.get('currentAccountBalance') == undefined) {
		$.ajax({
			type:"GET",
			url:"https://api.db.nomics.world/v22/series/ONS/PNBP/HBOP.Q?observations=1",
			async:false,
			dataType: "json",
			success: function(data) {
				var arrayLength = data.series.docs[0].value.length
				var currentAccountBalance = (data.series.docs[0].value[arrayLength-1]) * 1000000
				$('.economyMetric').text(numberWithCommas(currentAccountBalance));
				Cookies.set('currentAccountBalance', currentAccountBalance);
			},
			error: function(errorMessage){
				console.error(errorMessage)
			}
		});
	} else {
		$('.economyMetric').text(numberWithCommas(Cookies.get('currentAccountBalance')));
	}

	$('#navMetrics').fadeIn();
});

// function to add commas to large numbers
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}