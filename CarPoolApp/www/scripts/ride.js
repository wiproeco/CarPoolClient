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
    var geoLat = 17.4258143;
    var geoLong = 78.34054739999999;
    var map;
    var geoLocation;
    var startLocation;
    var service = {
        locations: [],
        pickuplocations: [],
        user: []
    };
    var nearVehicles = [];


    global.intilize = function () {

        
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

        //geoLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        geoLocation = new google.maps.LatLng(geoLat, geoLong);
        var autocompleteStart = new google.maps.places.Autocomplete(document.getElementById("txtDestination"));

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

        var currentlocation = new google.maps.Marker({
            position: geoLocation,
            map: map,            
        })
            

        nearVehicles.push({ lat: 17.4400802, long: 78.34891679999998 });
        nearVehicles.push({ lat: 17.4447918, long: 78.34830979999992 });
        nearVehicles.push({ lat: 17.4474117, long: 78.37623039999994 });
        nearVehicles.push({ lat: 17.4208251, long: 78.34439889999999 });
        nearVehicles.push({ lat: 17.43792029999999, long: 78.36465169999997 });

        $(nearVehicles).each(function (index, obj) {
            var vehicleLatLng = new google.maps.LatLng(obj.lat, obj.long);
            addMarker(vehicleLatLng, map);
        });
        directionsDisplay.setMap(map);

        $("#btnJoinRide").click(function () {
            var emailBody = "Hi,<br/><p> Ramesh has intrested about to share a ride on your car on 11-December-2015 at 7:30PM. <br> You can contact him by mobile no : 9989123456. <br> or <br> You could confirm by clicking below link. <br> <a href=\"" + "http://d113077841.fareast.corp.microsoft.com:1513/confirm" + "\">Confirm</a><p><br/>Thanks & Regards,<br/>Car Pool App Admin."

            var req = { from: "wiprocarpool@gmail.com", to: "sreerama.tedla@wipro.com", subject: "Car pool request alert ✪", text: emailBody };
           
            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "http://azurecarpool.azurewebsites.net/send",
                //url: "http://localhost:1513/updatelocation",
                data: JSON.stringify(req),
                dataType: "json",
                success: function () {
                    alert('Ride is shared');
                }
            });
        });
    }

    function addMarker(latlng, map1) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map1,
            icon: "/images/car-image.png"
        });
        marker.addListener('click', function () {            
            var position = marker.getPosition();            
            $("#carmodal").modal("toggle");
        });
        markers.push(marker);
    }    

    document.addEventListener("deviceready", onDeviceReady, false);
})(window);