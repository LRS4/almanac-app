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
				Cookies.set('population', currentPopulationTotal, { expires: 7 });
			},
			error: function(errorMessage) {
				console.error(errorMessage)
			}
		});
	} else {
		$(".populationMetric").text(numberWithCommas(Cookies.get('population')));
	}

	// Economic budget surplus or deficit from db.nomics
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
				Cookies.set('currentAccountBalance', currentAccountBalance, { expires: 7 });
			},
			error: function(errorMessage){
				console.error(errorMessage)
			}
		});
	} else {
		$('.economyMetric').text(numberWithCommas(Cookies.get('currentAccountBalance')));
	}

	// get approval ratings data for current PM
	if (Cookies.get('pmApprovalRating') == undefined) {
		var pm;
		$.ajax({
			type:"GET",
			url:"https://raw.githubusercontent.com/iancoleman/cia_world_factbook_api/master/data/factbook.json",
			async:false,
			dataType: "json",
			success: function(data) {
				console.log("World Factbook finished loading... " + Object.keys(data.countries).length + " entries");
				var uk = data.countries.united_kingdom.data;
				pm = (uk.government.executive_branch.head_of_government).split(" ");
				let surname = pm[3].toLowerCase();
				surname = surname.charAt(0).toUpperCase() + surname.slice(1)
				pm = pm[2] + "_" + surname
			},
			error: function(errorMessage){
				console.error(errorMessage);
			}
		});

		$.ajax({
			type:"GET",
			url: '/approval?pm=' + pm,
			async:false,
			dataType: "json",
			success: function(data) {
				$('.approvalMetric').text(data + '%');
				Cookies.set('pmApprovalRating', data, { expires: 7 });
			},
			error: function(errorMessage) {
				console.error(errorMessage);
			}
		});
	} else {
		$('.approvalMetric').text(Cookies.get('pmApprovalRating') + '%')
	}

	$('#navMetrics').fadeIn();
});

// function to add commas to large numbers
function numberWithCommas(x) {
	return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}