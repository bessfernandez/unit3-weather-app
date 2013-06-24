$(document).ready(function ($) {
    function runProgram() {

        function WeatherObj() {
            //These are set so the DOM is scanned only once:
            this.locationText = $(".location-text");
            this.circle = $("header");
            this.temp = $("#temp");
            this.moreData = $(".more-data");
            this.dataTrigger = $(".data-trigger a");
            this.locationDataRetreived = false;
            this.apikey = "784bfc9f8a6f1730";
        }

        WeatherObj.prototype.setNewClass = function (arg) {
        	// BF - remove array bracket here and just pass in as string
            var colors = "cold frozen hot lukewarm unfilled warm white-text"; //See css.css lines 128 - 180
            this.circle.removeClass(colors);
            //this.temp.addClass("white-text");
            this.circle.addClass(arg);
        };


        WeatherObj.prototype.setBackgroundColor = function (arg) {
            if (arg <= 120 && arg >= 90) {
                this.setNewClass("hot");
            }
            else if (arg <= 89 && arg >= 80) {
                this.setNewClass("warm");
            }
            else if (arg <= 79 && arg >= 60) {
                this.setNewClass("lukewarm");
            }
            else if (arg <= 59 && arg >= 33) {
                this.setNewClass("cold");
            }
            else {
                this.setNewClass("frozen");
            }
        };


        WeatherObj.prototype.pushToThis = function (ary, jsonName) {
            for (var i = 0; i < ary.length; i++) {
                this[ary[i]] = jsonName[ary[i]];
            }
        };

        // BF - you accidentally named your function here incorrectly i changed it to the right name :)
        WeatherObj.prototype.getLocationData = function () {
        	// BF - a function within this function would create a new scope such as function(), 'this' becomes relative to the function, not to the object
        	// therefore you have to set the object 'this' to a separate variable and use it as such within that child function
        	var self = this;

            $.ajax({
            	// BF - here you can see 'this' is still working because its not within a function
                url: "http://api.wunderground.com/api/" + this.apikey + "/geolookup/q/autoip.json",
                dataType: "jsonp",
                cache: false,
                success: function (jsonObj) {
                	// BF - now you would use self to reference the WeatherObj
                    self.locationDataRetreived = true;
                    var locationDataNeeded = ["city", "state", "country"];
                    var jsonToParse = jsonObj["location"];
                    WeatherObj.prototype.pushToThis(locationDataNeeded, jsonToParse);
                    self.locationText.html("<b>Your Current Location:</b><br/>" + self.city + ", " + self.state + " " + self.country);
               		
                    // BF callback needed after success to run the check on wo.locationDataRetreived
               		getWeather();
                },
                error: function (result) {
                    if (result.statusText != "abort") {  //Won't show the error message if the Ajax call was aborted.
                        self.temp.text("timed out");
                        self.locationText.text("We were unable to grab your location data.  We apologize for the inconvenience.");
                    }
                }
            }); //End Ajax call
        };


        WeatherObj.prototype.getWeatherData = function () {
        	var self = this;

            $.ajax({
                url: "http://api.wunderground.com/api/" + this.apikey + "/conditions/q/" + this.state + "/" + this.city + ".json",
                dataType: "jsonp",
                cache: false,
                success: function (jsonObj) {
                    //Gathers more data:
                    var conditionDataNeeded = ["weather", "wind_string", "relative_humidity", "pressure_in", "visibility_mi", "precip_today_in", "dewpoint_f", "UV", "temp_f"];
                    var jsonToParse = jsonObj["current_observation"];
                    WeatherObj.prototype.pushToThis(conditionDataNeeded, jsonToParse);
                    var currentTempF = Math.round(self.temp_f);

                    //Removes the loading message and adds the current weather conditions:
                    self.dataTrigger.text("More Information [+]");
                    self.moreData.html('Status: ' + self.weather + '<br/>Wind: ' + self.wind_string + '<br/>Humidity: ' + self.relative_humidity + '<br/>Pressure: ' + self.pressure_in + ' in<br/>Visibility: ' + self.visibility_mi + ' mi<br/>Percipitation: ' + self.precip_today_in + ' in<br/>Dewpoint: ' + self.dewpoint_f + ' &deg F<br/>UV Index: ' + self.UV);
                    self.setBackgroundColor(currentTempF);
                    self.temp.html(currentTempF + "&deg");
                },
                error: function (result) {
                    if (result.statusText != "abort") {  //Won't show the error message if the Ajax call was aborted.
                        self.temp.text("timed out");
                        self.locationText.text("We were unable to grab weather data. We apologize for the inconvenience.");
                    }
                }
            });//End Ajax call
        };

        var wo = new WeatherObj();
        wo["moreData"].hide();
        wo.getLocationData();

        function getWeather() {
        	// BF - only check locationDataRetreived when function is called
	        if (wo.locationDataRetreived) {
	            wo.getWeatherData();
	        }
    	}

        $(document).on("click", ".data-trigger", function () {
            $(this).toggleClass("active").next().slideToggle();
            if (!$(this).hasClass("active")) {
                wo.dataTrigger.text("More Information [+]");
            }
            else {
                wo.dataTrigger.text("More Information [-]")
            }
        });
    } //End run program

    runProgram();
});