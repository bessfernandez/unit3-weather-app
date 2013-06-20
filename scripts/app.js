$(document).ready(function($) {

	function getCurrentTemp(){

		var apikey = "784bfc9f8a6f1730";
		$(".more-data").hide();

		//This grabs the user's location from the browser:
		$.ajax({
			url : "http://api.wunderground.com/api/"+apikey+"/geolookup/q/autoip.json",
			dataType : "jsonp",
			cache: false,
			success : function(jsonObj) {
			    var userLocation = {};
			    userLocation.city = jsonObj.location.city;
			    userLocation.state = jsonObj.location.state;
			    userLocation.country = jsonObj.location.country;
			    $(".location-text").text(userLocation.city+", "+userLocation.state+" "+userLocation.country);
		    
			    //This uses the broswer location data to pull in weather data:
			    $.ajax({
			    	url: "http://api.wunderground.com/api/"+apikey+"/conditions/q/"+userLocation.state+"/"+userLocation.city+".json",
			    	dataType: "jsonp",
			    	cache: false,
			    	success : function(jsonObj){
			    		var currentTempF = Math.ceil(jsonObj.current_observation.temp_f);
			    		$("#temp").html(currentTempF+"&deg");
			      	},
					error : function(result) {
						if (result.statusText != "abort") {  //Won't show the error message if the Ajax call was aborted.
							$("#temp").text("timed out");
							$(".location-text").text("We were unable to grab weather data. We apologize for the inconvenience.");
		            	}
					}
			    });//End inner Ajax call
			},//End outer Ajax success function

			error : function(result) {
				if (result.statusText != "abort") {  //Won't show the error message if the Ajax call was aborted.
					$("#temp").text("timed out");
					$(".location-text").text("We were unable to grab your location data.  We apologize for the inconvenience.");
				}
			}//End error function
		});//End outer Ajax call
	}//End getCurrentTemp()

	getCurrentTemp();
});