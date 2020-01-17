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
		let population = Cookies.get('population');
		$(".populationMetric").text(numberWithCommas(population));
	}

	// TO DO - implement economy and happiness index calls
	
	$('#navMetrics').fadeIn();
});

// function to add commas to large numbers
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}