$(document).ready(function(){

	// set timeout for loading section
	setTimeout(function(){
		$("#loading").css("display", "none");
		$("#one").css("display", "block");
	}, 3000);

	// show and hide sections = array of all div sections, on next click show next array index, on back show previous array index
	var page_index = ["#one", "#two", "#three", "#four", "#five", "#six", "#seven", "#eight"];
	var page_counter = 1;
	var index_length = page_index.length;

	// implement show next section function
	function nextPage() {
		// show the next page
		var next_page = page_index[page_counter];	
		$(next_page).css("display", "block");
		console.log("current Section: " + next_page);

		// hide all other pages
		for (let i = 0; i < index_length; i++) {
			if (page_index[i] == page_index[page_counter]) {
				continue;
			} else {
				$(page_index[i]).css("display", "none");
			}
		}

		// increment the page counter
		page_counter += 1;
	}

	// implement show previous section
	$(".backBtns").click(function() {
		// decrease the page counter by 2 to go back
		page_counter -= 2;

		// show the previous page
		let next_page = page_index[page_counter];
		$(next_page).css("display", "block");
		console.log("current Section: " + next_page);

		// hide all other pages
		for (let i = 0; i < index_length; i++) {
			if (page_index[i] == page_index[page_counter]) {
				continue;
			} else {
				$(page_index[i]).css("display", "none");
			}
		}

		// increment the page counter
		page_counter += 1;
	});

	// implement error checking page by page, if correct fire nextPage function
	$("#nextOne").click(function() {
		nextPage();
	});

	// function to validate if string contains numbers
	function isNumeric(n) {
		return !isNaN(parseFloat(n)) && isFinite(n);
	  }
	
	// validate name
	$("#nextTwo").click(function() {
		let name = $("#fullName").val();
		if (name == "" || isNumeric(name) === true) {
			$("#fullName").addClass("is-invalid").next().css("display", "block");
		} else {
			$("#fullName").addClass("is-valid").removeClass("is-invalid").next().css("display", "none");
			setTimeout(nextPage, 0);
		}
	});

	// validate title
	$("#nextThree").click(function() {
		let selected = $('select[name=title] option:selected').val();
		if (selected == "" || selected == null) {
			$('select[name=title]').addClass("is-invalid").next().css("display", "block");
		} else {
			$('select[name=title]').addClass("is-valid").removeClass("is-invalid").next().css("display", "none");
			nextPage();
		}
	});

	// validate title - remove warning
	$('select[name=title]').change(function() {
		$(this).addClass("is-valid").removeClass("is-invalid");
		$("#titleWarning").css("display", "none");
	});

	// validate age
	$("#nextFour").click(function() {
		let age = $('#inputAge').val();
		if (age == null || isNaN(age) == true || age == "") {
			$('#inputAge').addClass("is-invalid").next().css("display", "block");
		} else if (Number(age) <= 0 || Number(age) > 100) {
			$('#inputAge').addClass("is-invalid").next().next().css("display", "block");
		} 
		else {
			$('#inputAge').addClass("is-valid").removeClass("is-invalid").next().css("display", "none");
			$('#inputAge').next().next().css("display", "none");
			nextPage();
		}
	});

	// validate sex
	$('#nextFive').click(function() {
		let sex = $('input[name=gender]:checked').val();
		if (sex == null || sex == undefined) {
			$('#genderWarning').css("display", "block");
		} else {
			$('#genderWarning').css("display", "none");	
			nextPage();
		}
	});

	// validate passenger class
	$('#nextSix').click(function() {
		let pclass = $('input[name=class]:checked').val();
		if (pclass == null || pclass == undefined) {
			$('#classWarning').css("display", "block");
		} else {
			$('#classWarning').css("display", "none");	
			nextPage();
		}
	});

	// validate family size
	$('#nextSeven').click(function() {
		let family = $('#inputFamily').val();
		if (family == null || family == undefined || family == "") {
			$('#inputFamily').addClass("is-invalid");
			$('#familyWarning').css("display", "block");
		} else {
			$('#inputFamily').addClass("is-valid").removeClass("is-invalid");
			$('#familyWarning').css("display", "none");
			confirmation();
			nextPage();
		}
	});

	// function to gather entered details for confirmation page
	function confirmation() {
		// calculate average fare
		let price;
		let ticketClass = $('input[name="class"]:checked + label').text();
		if (ticketClass == "First Class") {
			price = 84;
		} else if (ticketClass == "Second Class") {
			price = 21;
		} else {
			price = 14;
		}

		// populate confirmation page details
		$("#confirmName").html("Your full name is <b>" + $("select[name=title] option:selected").text() + " " + $("#fullName").val() + "</b>");
		$("#confirmAge").html("Your age is <b>" + $("#inputAge").val() + "</b>");
		$("#confirmSex").html("Your sex is <b>" + $('input[name="gender"]:checked + label').text() + "</b>");
		$("#confirmClass").html("You would travel in <b>" + $('input[name="class"]:checked + label').text() + "</b>");
		$("#confirmFare").html("You would pay on average <b>£" + price + "</b> for a ticket");
		$("#confirmFamily").html("You would travel with <b>" + $("#inputFamily").val() + "</b> family member(s)");
	}

	// prevent form submission on enter key
	$('form input').keydown(function(e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			return false;
		}
	});

	// on final submit display loading again while server prepares data and executes model
	// retrieve first name
	$("#submit").click(function() {
		$("#eight").css("display", "none");
		$("#loading").css("display", "block");
		var name = $("#fullName").val();
		var first = name.replace(/ .*/,'');
		sessionStorage.setItem("firstname", first)
	});

	// redirect to analysis page from results page
	$("#nextExplain").click(function() {
		document.location.href = "/analysis";
	});

	$(".firstName").click(function() {
		$("#sayBye").html("Thanks for checking out this app " + sessionStorage.getItem("firstname") + ", I hope you enjoyed it and it increased your interest in machine learning.")
	});
	
});