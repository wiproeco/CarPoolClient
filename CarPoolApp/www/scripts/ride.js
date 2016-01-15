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
    var rideObject = null;
    var carOwnerId = null;   

    global.intilize = function () {
        
        getLocation();
    }
    
    function getLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var directionsService = new google.maps.DirectionsService();
                var directionsDisplay = new google.maps.DirectionsRenderer();

                geoLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                //geoLocation = new google.maps.LatLng(geoLat, geoLong);
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

                google.maps.event.addListener(autocompleteStart, 'place_changed', function () {
                    clearMarkers();
                    var searchLocation = autocompleteStart.getPlace();
                    var userId = localStorage.getItem("userid");
                    var currentdate = moment().format('MM-DD-YYYY');
                    $.ajax({
                        type: "GET",
                        contentType: "application/json",
                        url: "http://wiprocarpool.azurewebsites.net/searchrides/" + searchLocation.vicinity + "/" + userId + "/" + currentdate,
                        //url: "http://carpooltestapp.azurewebsites.net/searchrides/" + searchLocation.vicinity,
                        //data: JSON.stringify(service),
                        dataType: "json",
                        success: function (data) {
                            var latlngbounds = new google.maps.LatLngBounds();
                            $(data).each(function (index, obj) {
                                var vehicleLatLng = new google.maps.LatLng(obj.lat, obj.lng);
                                var querystring = obj.id + "/" + obj.rideid;
                                addMarker(vehicleLatLng, map, querystring);
                                latlngbounds.extend(vehicleLatLng);
                            });

                            latlngbounds.extend(geoLocation);
                            map.setCenter(latlngbounds.getCenter());
                            map.fitBounds(latlngbounds);

                            directionsDisplay.setMap(map);
                        }
                    });
                });


                $("#btnJoinRide").click(function () {

                    var reqforcurrgeolocnvalue = "";

                    if (document.getElementById("chkreqforcurrgeolocn").checked)
                        reqforcurrgeolocnvalue = true;
                    else
                        reqforcurrgeolocnvalue = false;

                    $.ajax({
                        type: "POST",
                        contentType: "application/json",
                        url: "http://wiprocarpool.azurewebsites.net/joinride/",
                        data: JSON.stringify({ carownerId: carOwnerId, userId: localStorage.getItem("userid"), rideid: rideObject.rideid, boardingid: $("#ddlPickuppoints").val(), reqforcurrgeolocn: reqforcurrgeolocnvalue }),
                        dataType: "json",
                        success: function (data) {
                            $("#carmodal").modal("toggle");
                            window.location.href = "usernotification.html";
                            //alert('Request sent to Owner. Please be wait...');
                        }
                    });
                });

                $("#lnkDashboard").click(function () {
                    window.location.href = "NewDashboard.html";
                });

                $("#lnkNotifications").click(function () {
                    var isowner = window.localStorage.getItem("isowner");
                    var notificationurl = '';
                    if (isowner == "true")
                        notificationurl = "ownernotification.html";
                    else
                        notificationurl = "usernotification.html";

                    window.location.href = notificationurl;
                });

                $("#lnkLogOut").click(function () {
                    window.localStorage.setItem("userid", 0);
                    window.location.href = 'index.html';
                });

            }, function (error) { alert("enable location in your mobile"); }, { timeout:1000, enableHighAccuracy: true, maximumAge: 90000 });
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    function showPosition() {
        
    }

    function addMarker(latlng, map1, docId) {
        var marker = new google.maps.Marker({
            position: latlng,
            map: map1
            //icon: "/images/car-image.png"
            //title: docId
        });
        marker.setTitle(docId);
        marker.addListener('click', function () {            
            var position = marker.getPosition();
            var docId = marker.getTitle();
            carOwnerId = docId.split("/")[0];
            
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: "http://wiprocarpool.azurewebsites.net/getridedetails/" + docId,
                //url: "http://carpooltestapp.azurewebsites.net/getcarowner/" + docId,
                //data: JSON.stringify(service),
                dataType: "json",
                success: function (response) {
                    
                    $("#ddlPickuppoints").html("");
                    var data = response[0];
                    rideObject = response[0];
                    $("#carmodal").modal("toggle");                    
                    $("#carOwner").text(response[0].userName);
                    $("#carNumber").text(response[0].carNo);
                    $("#carSeatsCount").text(response[0].seatsavailable);
                    $("#carFrom").text(response[0].startpoint);
                    $("#carTo").text(response[0].endpoint);
                    $(data.boardingpoints).each(function (index, obj) {
                        var option = $("<option></option>");
                        option.attr("value", obj.boardingid).text(obj.address);
                        $("#ddlPickuppoints").append(option);
                    });                                       
                }
            });
            
        });
        markers.push(marker);
    }

    function clearMarkers() {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
    }

    document.addEventListener("deviceready", onDeviceReady, false);
})(window);
