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
        $("#map").css("height", viewport.height);
        //TODO: Add your own Google maps API key to the URL below.        
        $.getScript('https://maps.googleapis.com/maps/api/js?key=AIzaSyCZmYWHb3GXK-Z-yrmowHMJLfjfl-VytI0&sensor=true&libraries=places&callback=intilize');
    };


    var markers = [];
    var waypoints = [];
    var detailedWayPoints = [];
    var geoLat = 17.4258143;
    var geoLong = 78.34054739999999;
    var geoLocationName = null;
    var map;
    var endLocation;
    var startLocation;
    var geoLocation;
    var service = {
        locations: [],
        pickuplocations: [],
        users: []
    };


    global.intilize = function () {
        var userid = window.localStorage.getItem("userid");
        service.users.push({ user: userid });

        getLocation();

    }
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(showPosition);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function showPosition(position) {
        var directionsService = new google.maps.DirectionsService();
        var directionsDisplay = new google.maps.DirectionsRenderer();
        var geocoder = new google.maps.Geocoder;

        //geoLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geoLocation = new google.maps.LatLng(geoLat, geoLong);
        geocoder.geocode({ 'location': geoLocation }, function (results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                if (results[1]) {
                    geoLocationName = results[1].formatted_address;
                }
            }
        });
        map = new google.maps.Map(document.getElementById('map'), {
            center: geoLocation,
            scrollwheel: true,
            zoom: 13,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            draggableCursor: "pointer",
            mapTypeControl: false,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.VERTICAL_BAR,
                position: google.maps.ControlPosition.RIGHT_CENTER
            },
            zoomControl: true,
            zoomControlOptions: {
                position: google.maps.ControlPosition.LEFT_CENTER
            },
            streetViewControl: false,
            streetViewControlOptions: {
                position: google.maps.ControlPosition.LEFT_TOP
            }
        });
        directionsDisplay.setMap(map);

        var autocompleteStart = new google.maps.places.Autocomplete(document.getElementById("txtDestination"));
        $("#btnRoute").click(function () {
            var mode = google.maps.DirectionsTravelMode.DRIVING;
            var request = {
                origin: geoLocation,
                destination: endLocation,
                waypoints: waypoints,
                travelMode: mode,
                optimizeWaypoints: true,
                avoidHighways: false
            };

            directionsService.route(request, function (response, status) {
                if (status == google.maps.DirectionsStatus.OK) {
                    clearMarkers();
                    directionsDisplay.setDirections(response);
                }
            });
        });
        $("#btnReset").click(function () {
            clearMarkers();
            clearWaypoints();
            directionsDisplay.setMap(null);
            directionsDisplay.setPanel(null);
            directionsDisplay = new google.maps.DirectionsRenderer();
            directionsDisplay.setMap(map);
            addMarker(geoLocation, map);
            addMarker(endLocation, map);
        });
        $("#btnSubmit").click(function () {
            var locationObject = { startpoint: null, startlat: null, startlng: null, endpoint: 'Wipro, Gachibowli', endlng: null, endlat: null, seatsavailability: null };
            locationObject.startpoint = geoLocationName;
            locationObject.startlat = geoLocation.lat();
            locationObject.startlng = geoLocation.lng();
            locationObject.endpoint = $("#txtSource").val();
            locationObject.endlat = endLocation.lat();
            locationObject.endlng = endLocation.lng();
            service.locations.push(locationObject);
            service.pickuplocations = detailedWayPoints;

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://azurecarpool.azurewebsites.net/updatelocation",
                //url: "http://localhost:1513/updatelocation",
                data: JSON.stringify(service),
                dataType: "json",
                success: function () {
                    alert('Ride is shared');
                }
            });
        });

        google.maps.event.addListener(autocompleteStart, 'place_changed', function () {
            clearMarkers();
            clearWaypoints();
            var endPlace = autocompleteStart.getPlace();
            var Lat = endPlace.geometry.location.lat();
            var Long = endPlace.geometry.location.lng();
            endLocation = new google.maps.LatLng(Lat, Long);

            var latlngbounds = new google.maps.LatLngBounds();

            latlngbounds.extend(geoLocation);
            latlngbounds.extend(endLocation);

            map.setCenter(latlngbounds.getCenter());
            map.fitBounds(latlngbounds);

            google.maps.event.addListener(map, 'mousedown', function (event) {
                var latLong = event.latLng;
                var geocoder = new google.maps.Geocoder;
                waypoints.push({ location: latLong, stopover: true });
                addMarker(latLong, map);
                geocoder.geocode({ 'location': latLong }, function (results, status) {
                    if (status === google.maps.GeocoderStatus.OK) {
                        if (results[1]) {
                            var addressObject = { address: null, lat: null, lng: null };
                            addressObject.address = results[1].formatted_address;
                            addressObject.lat = latLong.lat();
                            addressObject.lng = latLong.lng();
                            detailedWayPoints.push(addressObject);
                        }
                    }
                });
            });


            addMarker(geoLocation, map);
            addMarker(endLocation, map);
        });

    }

    function addMarker(latlng, map1) {
        markers.push(new google.maps.Marker({
            position: latlng,
            map: map1,
            icon: "http://maps.google.com/mapfiles/marker" + String.fromCharCode(markers.length + 65) + ".png"
        }));
    }

    function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    function clearWaypoints() {
        markers = [];
        waypoints = [];
        detailedWayPoints = [];
    }

    document.addEventListener("deviceready", onDeviceReady, false);
})(window);