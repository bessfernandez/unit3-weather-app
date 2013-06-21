$(document).ready(function($) {
function runProgram(){
	
	// Set lines 5 - 7 so the DOM is scanned only once.
	var locationText = $(".location-text");
	var circle = $("header");
	var temp = $("#temp");
	var colors = ["cold", "frozen", "hot", "lukewarm", "unfilled", "warm", "white-text"]; //See css.css lines 160 - 208

	function setNewClass(arg){
		circle.removeClass(colors.join(" "));
		temp.addClass("white-text");
		circle.addClass(arg);
	}

		
	function setBackgroundColor(arg) {
		if(arg <= 120 && arg >= 90){
			setNewClass("hot");
		}
		else if(arg <= 89 && arg >= 80){
			setNewClass("warm");
		}
		else if(arg <= 79 && arg >= 60){
			setNewClass("lukewarm");
		}
		else if(arg <= 59 && arg >= 33){
			setNewClass("cold");
		}
		else {
			setNewClass("frozen");
		}
	}
	
	

	function getCurrentTemp(){

		var apikey = "784bfc9f8a6f1730";  //Made the API Key a variable in case I need to generate a new key.
		
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
			    locationText.text(userLocation.city+", "+userLocation.state+" "+userLocation.country);
		    
			    //This uses the broswer location data to pull in weather data:
			    $.ajax({
			    	url: "http://api.wunderground.com/api/"+apikey+"/conditions/q/"+userLocation.state+"/"+userLocation.city+".json",
			    	dataType: "jsonp",
			    	cache: false,
			    	success : function(jsonObj){
						userLocation.relativeHumidity = jsonObj.current_observation.relative_humidity;
						userLocation.weather = jsonObj.current_observation.weather;
						userLocation.windString = jsonObj.current_observation.wind_string;
						userLocation.pressureIn = jsonObj.current_observation.pressure_in;
						userLocation.dewpointF = jsonObj.current_observation.dewpoint_f;
						userLocation.visibilityMi = jsonObj.current_observation.visibility_mi;
						userLocation.uv = jsonObj.current_observation.UV;
						userLocation.precipTodayIn = jsonObj.current_observation.precip_today_in;
						
						
						var moreData = '<p>Status: '+userLocation.weather+'<br/>Wind: '+userLocation.windString+'<br/>Humidity: '+userLocation.relativeHumidity+'<br/>Pressure: '+userLocation.pressureIn+'<br/>Visibility: '+userLocation.visibilityMi+'<br/>Percipitation: '+userLocation.precipTodayIn+'<br/>Dewpoint: '+userLocation.dewpointF+'<br/>UV Index: '+userLocation.uv+'</p>';
			    		var currentTempF = Math.ceil(jsonObj.current_observation.temp_f);
						setBackgroundColor(currentTempF);
			    		temp.html(currentTempF+"&deg");
			
						$(".more-data").append(moreData).show();
			
			      	},
					error : function(result) {
						if (result.statusText != "abort") {  //Won't show the error message if the Ajax call was aborted.
							temp.text("timed out");
							locationText.text("We were unable to grab weather data. We apologize for the inconvenience.");
		            	}
					}
			    });//End inner Ajax call
			},//End outer Ajax success function

			error : function(result) {
				if (result.statusText != "abort") {  //Won't show the error message if the Ajax call was aborted.
					temp.text("timed out");
					locationText.text("We were unable to grab your location data.  We apologize for the inconvenience.");
				}
			}//End error function
		});//End outer Ajax call
	}//End getCurrentTemp()

	getCurrentTemp();
}

runProgram();
});