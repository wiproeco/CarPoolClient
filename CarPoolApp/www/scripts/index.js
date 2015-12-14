
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function (global) {
    "use strict";

    //document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );
    
    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener( 'resume', onResume.bind( this ), false );        
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
        //if (navigator.connection.type === Connection.NONE || (global.google !== undefined && global.google.maps)) {
        //    return;
        //}
        var viewport = {
            width: $(window).width(),
            height: $(window).height()
        };

        $("#map").css("width", viewport.width);
        $("#map").css("height", viewport.height - 100);
        //TODO: Add your own Google maps API key to the URL below.        
        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCZmYWHb3GXK-Z-yrmowHMJLfjfl-VytI0&sensor=true&libraries=places&callback=onMapsApiLoaded');
    }

    global.onMapsApiLoaded = function () {
        // Maps API loaded and ready to be used.
        //var map = new google.maps.Map(document.getElementById("map"), {
        //    zoom: 8,
        //    center: new google.maps.LatLng(-34.397, 150.644)
        //});
        
        var markerArray = [];
        var fromLocation = { lat: 17.4947934, lng: 78.39964409999993 };
        var toLocation = { lat: 17.4400802, lng: 78.34891679999998 };

        var map = new google.maps.Map(document.getElementById('map'), {
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
        // For each step, place a marker, and add the text to the marker's info window.
        // Also attach the marker to an array so we can keep track of it and remove it
        // when calculating new routes.
        var myRoute = directionResult.routes[0].legs[0];
        for (var i = 0; i < myRoute.steps.length; i++) {
            var marker = markerArray[i] = markerArray[i] || new google.maps.Marker;
            marker.setMap(map);
            marker.setPosition(myRoute.steps[i].start_location);
            attachInstructionText(
                stepDisplay, marker, "5-8-344/1, Mahesh Nagar Colony, Abids, Hyderabad, Telangana 500001, India", map);
        }
    }
    function attachInstructionText(stepDisplay, marker, text, map) {
        google.maps.event.addListener(marker, 'click', function () {
            // Open an info window when the marker is clicked on, containing the text
            // of the step.
            stepDisplay.setContent(text);
            stepDisplay.open(map, marker);
        });
    }

    document.addEventListener("deviceready", onDeviceReady, false);
} )(window);
