// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function (global) {
    "use strict";

    //document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        loadMapsApi();

    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
        loadMapsApi();
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
        loadMapsApi();
    };

    function loadMapsApi() {
        var viewport = {
            width: $(window).width(),
            height: $(window).height()
        };

        $("#map").css("width", viewport.width);
        $("#map").css("height", viewport.height - 210);
        //TODO: Add your own Google maps API key to the URL below.        
        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCZmYWHb3GXK-Z-yrmowHMJLfjfl-VytI0&sensor=true&libraries=places&callback=intilize');
    };


    var startLat;
    var startLong;
    var endLat = 17.4258143;
    var endLong = 78.34054739999999;
    var waypoints = [];
    var map;
    var service = {
        locations: [],
        pickuplocations: [],
        user: []
    };

    global.intilize = function () {
        var userid = window.localStorage.getItem("userid");
        service.user.push({ user: userid });
        var autocompleteStart = new google.maps.places.Autocomplete(document.getElementById("txtSource"));
        var autocompleteMarkup = new google.maps.places.Autocomplete(document.getElementById("txtMarkup"));

        google.maps.event.addListener(autocompleteStart, 'place_changed', function () {
            var startPlace = autocompleteStart.getPlace();
            startLat = startPlace.geometry.location.lat();
            startLong = startPlace.geometry.location.lng();
            $("#ddlMarkup").html("");
            var locationObject = { startpoint: null, endpoint: 'Wipro, Gachibowli', seatsavailability: null };
            locationObject.startpoint = $("#txtSource").val();
            service.locations.push(locationObject);
            onMapsApiLoaded();

        });

        $("#btnAddMarker").on("click", function () {
            var waypointObj = { locationName: null, lattitude: null, longitude: null };
            var ddlVal = $("#ddlMarkup").val();
            var latlngStr = ddlVal.split(',', 2);
            var myLatLng = new google.maps.LatLng(latlngStr[0], latlngStr[1]);
            waypointObj.lattitude = latlngStr[0];
            waypointObj.longitude = latlngStr[1];
            waypointObj.address = $("#ddlMarkup:selected").text();
            var marker = new google.maps.Marker({ position: myLatLng });

            marker.setMap(map);
            service.pickuplocations.push(waypointObj);

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://wiprocarpool.azurewebsites.net/updatelocation",
                data: JSON.stringify(service),
                dataType: "json",
                success: function () {
                    alert('pickpoint added into database');
                }
            });

        });
    }

    function onMapsApiLoaded() {

        var markerArray = [];
        var fromLocation = { lat: startLat, lng: startLong };
        var toLocation = { lat: endLat, lng: endLong };

        map = new google.maps.Map(document.getElementById('map'), {
            center: fromLocation,
            scrollwheel: true,
            zoom: 7
        });

        var directionsDisplay = new google.maps.DirectionsRenderer({
            draggable: true,
            map: map
        });

        // Set destination, origin and travel mode.
        var request = {
            destination: toLocation,
            origin: fromLocation,
            travelMode: google.maps.TravelMode.WALKING
        };

        // Instantiate an info window to hold step text.
        var stepDisplay = new google.maps.InfoWindow;

        // Pass the directions request to the directions service.
        var directionsService = new google.maps.DirectionsService();
        directionsService.route(request, function (response, status) {
            if (status == google.maps.DirectionsStatus.OK) {
                // Display the route on the map.
                directionsDisplay.setDirections(response);
                showSteps(response, markerArray, stepDisplay, map);
            }
        });
    };

    function showSteps(directionResult, markerArray, stepDisplay, map) {
        var myRoute = directionResult.routes[0].legs[0].steps;
        $(myRoute).each(function (index, obj) {
            var marker = markerArray[index] = markerArray[index] || new google.maps.Marker;
            geocodeLatLng(obj.start_location);
        });
    }

    function attachInstructionText(stepDisplay, marker, text, map) {
        google.maps.event.addListener(marker, 'click', function () {
            // Open an info window when the marker is clicked on, containing the text
            // of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
        });
    }



    function geocodeLatLng(inputObj) {
        var geocoder = new google.maps.Geocoder;
        //var input = document.getElementById('latlng').value;
        var input = String(inputObj);
        input = input.replace('(', '');
        input = input.replace(')', '');

        var latlngStr = input.split(',', 2);
        var latlng = { lat: parseFloat(latlngStr[0]), lng: parseFloat(latlngStr[1]) };
        geocoder.geocode({ 'location': latlng }, function (results, status) {

            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {

                    var option = $("<option></option>").val(input).html(results[1].formatted_address);
                    $("#ddlMarkup").append(option);

                }
               
            }
            else if (status === google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
                setTimeout(function () {
                    geocodeLatLng(inputObj);
                }, 100);
            }
        });
    }

    document.addEventListener("deviceready", onDeviceReady, false);
})(window);
