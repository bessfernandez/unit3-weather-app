$(document).ready(function($) {
	function runProgram(){

		$(document).on("click", ".data-trigger", function(event){			
			$(this).toggleClass("active").next().slideToggle();
			if (!$(this).hasClass("active")){
				dataTrigger.text("More Informaiton [+]");
			}
			else {
				dataTrigger.text("More Informaiton [-]")
			}
		});


	
		// Set lines 17 - 21 so the DOM is scanned only once.
		var locationText = $(".location-text");
		var circle = $("header");
		var temp = $("#temp");
		var moreData = $(".more-data");
		var dataTrigger = $(".data-trigger a");
		moreData.hide();
	


		//The Functions
		function setNewClass(arg){
			var colors = ["cold", "frozen", "hot", "lukewarm", "unfilled", "warm", "white-text"]; //See css.css lines 128 - 180
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
		
		
		function pushToObject(objName, ary, jsonName){
			for (i=0 ; i < ary.length ; i++) {
				objName[ary[i]] = jsonName[ary[i]];
			}
			return objName;
		}
	
	

		function getWeatherData(){
			//The API Key is a variable should it need to be regenerated:
			var apikey = "784bfc9f8a6f1730";

			//This grabs the user's location from the browser:
			$.ajax({
				url : "http://api.wunderground.com/api/"+apikey+"/geolookup/q/autoip.json",
				dataType : "jsonp",
				cache: false,
				success : function(jsonObj) {
				    var userLocation = {};
					var locationDataNeeded = ["city", "state", "country"];
					var jsonToParse = jsonObj["location"];
					pushToObject(userLocation, locationDataNeeded, jsonToParse);
				    locationText.html("<b>Your Current Location:</b><br/>"+userLocation.city+", "+userLocation.state+" "+userLocation.country);

		    
				    //This uses the broswer location data to pull in weather data:
				    $.ajax({
				    	url: "http://api.wunderground.com/api/"+apikey+"/conditions/q/"+userLocation.state+"/"+userLocation.city+".json",
				    	dataType: "jsonp",
				    	cache: false,
				    	success : function(jsonObj){						
							//Gathers more data:
							var conditionDataNeeded = ["weather", "wind_string", "relative_humidity", "pressure_in", "visibility_mi", "precip_today_in", "dewpoint_f", "UV", "temp_f"];
							var jsonToParse = jsonObj["current_observation"];
							pushToObject(userLocation, conditionDataNeeded, jsonToParse);
							var currentTempF = Math.round(userLocation.temp_f);
							
							//Removes the loading message and adds the current weather conditions:
							dataTrigger.text("More Informaiton [+]");
				    		moreData.html('Status: '+userLocation.weather+'<br/>Wind: '+userLocation.wind_string+'<br/>Humidity: '+userLocation.relative_humidity+'<br/>Pressure: '+userLocation.pressure_in+'<br/>Visibility: '+userLocation.visibility_mi+'<br/>Percipitation: '+userLocation.precip_today_in+'<br/>Dewpoint: '+userLocation.dewpoint_f+'<br/>UV Index: '+userLocation.UV);
							setBackgroundColor(currentTempF);
				    		temp.html(currentTempF+"&deg");
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

		getWeatherData();
	}

runProgram();
});