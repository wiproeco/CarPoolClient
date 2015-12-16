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
    var currentUserObject = null;

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
                    $.ajax({
                        type: "GET",
                        contentType: "application/json",
                        //url: "http://D-113049821.fareast.corp.microsoft.com:1513/searchrides/" + searchLocation.vicinity,
                        url: "http://carpooltestapp.azurewebsites.net/searchrides/" + searchLocation.vicinity,
                        //data: JSON.stringify(service),
                        dataType: "json",
                        success: function (data) {
                            $(data).each(function (index, obj) {
                                var vehicleLatLng = new google.maps.LatLng(obj.lat, obj.lng);
                                addMarker(vehicleLatLng, map, obj.id);
                            });
                            directionsDisplay.setMap(map);
                        }
                    });
                });

                //nearVehicles.push({ lat: 17.4400802, long: 78.34891679999998, docId : 1 });
                //nearVehicles.push({ lat: 17.4447918, long: 78.34830979999992, docId : 2 });
                //nearVehicles.push({ lat: 17.4474117, long: 78.37623039999994, docId : 3 });
                //nearVehicles.push({ lat: 17.4208251, long: 78.34439889999999, docId : 4 });
                //nearVehicles.push({ lat: 17.43792029999999, long: 78.36465169999997, docId: 5 });





                $("#btnJoinRide").click(function () {
                    var userdocid = window.localStorage.getItem("userid");
                    //var socketjson = window.localStorage.getItem("socket");
                    var socket = io('http://carpooltestapp.azurewebsites.net:3000/');
                    socket.on('connect', function () { });
                    socket.emit('regUser', { userid: userdocid });
                    //var socket = window.localStorage.getItem("socket");
                    var notificationMessage = 'Mr/Mrs. ' + currentUserObject.userName + ' has sent a request for a new ride, Please confirm the request';

                    //var socket = io('http://carpooltestapp.azurewebsites.net:3000');
                    //socket.on('connect', function () { });
                    //socket.emit('regUser', { userid: userdocid });
                    socket.emit('sendNotification', { data: notificationMessage, userid: currentUserObject.id });
                    //socket.on('recieveNotification', function (text) {
                    //    navigator.notification.confirm(text, onConfirm, 'Confirmation', ['Accept', 'Reject']);
                    });


                    //var emailBody = "Hi,<br/><p> Ramesh has intrested about to share a ride on your car on 11-December-2015 at 7:30PM. <br> You can contact him by mobile no : 9989123456. <br> or <br> You could confirm by clicking below link. <br> <a href=\"" + "http://d113077841.fareast.corp.microsoft.com:1513/confirm" + "\">Confirm</a><p><br/>Thanks & Regards,<br/>Car Pool App Admin."

                    //var req = { from: "wiprocarpool@gmail.com", to: "sreerama.tedla@wipro.com", subject: "Car pool request alert ✪", text: emailBody };

                    //$.ajax({
                    //    type: "POST",
                    //    contentType: "application/json",
                    //    url: "http://carpooltestapp.azurewebsites.net/send",
                    //    //url: "http://localhost:1513/updatelocation",
                    //    data: JSON.stringify(req),
                    //    dataType: "json",
                    //    success: function () {
                    //        alert('Ride is shared');
                    //    }
                    //});
                });
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
            
            $.ajax({
                type: "GET",
                contentType: "application/json",
                //url: "http://D-113049821.fareast.corp.microsoft.com:1513/getcarowner/" + docId,
                url: "http://carpooltestapp.azurewebsites.net/getcarowner/" + docId,
                //data: JSON.stringify(service),
                dataType: "json",
                success: function (users) {
                    $("#ddlPickuppoints").html("");
                    var data = users[0];
                    currentUserObject = users[0];
                    $("#carmodal").modal("toggle");                    
                    $("#carOwner").text(data.userName);
                    $("#carNumber").text(data.carNo);
                    $("#carSeatsCount").text(data.totalseats);
                    $("#carFrom").text(data.location[0].startpoint);
                    $("#carTo").text(data.location[0].endpoint);
                    $(data.pickuplocations).each(function (index, obj) {
                        var option = $("<option></option>");
                        option.attr("value", obj.address).text(obj.address);
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