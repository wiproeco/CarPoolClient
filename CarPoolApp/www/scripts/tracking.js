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
    var directionsDisplay;
    var directionsService;
    var rideId = null;
    var currentRideObject = null;
    var ride = {
        rideid: null,
        startpoint: null,
        startlat: null,
        startlng: null,
        endpoint: null,
        endlat: null,
        endlng: null,
        startdatetime: null,
        enddatetime: null,
        seatsavailable: null,
        ridestatus: "open",
        isfavouiteride: true,
        boardingpoints: [],
        passengers: []
    };

    var myCenter;

    global.intilize = function () {
        var userid = window.localStorage.getItem("userid");
        //var userid = "5029ce11-7535-6c69-4108-f5f0a1cd387a";
        localStorage.setItem("userid", userid);

        var address="";
        var latitude = "";
        var longitude = "";

        var ownerId = getUrlParameter('ownerId');
        if (ownerId === undefined) {
            //getLocation();
        }
        else {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: "http://wiprocarpool.azurewebsites.net/getuserdetails/" + ownerId,
                dataType: "json",
                success: function (data) {
                    //currentRideObject = data[0];
                    address = data[0].currgeolocnaddress;
                    latitude =  data[0].currgeolocnlat;
                    longitude = data[0].currgeolocnlong;
                    //myCenter = new google.maps.LatLng(latitude, longitude);
                    //myCenter = new google.maps.LatLng(51.508742, -0.120850);
                    //myCenter = new google.maps.LatLng(17.4479216, 78.377201);
                    myCenter = new google.maps.LatLng(latitude, longitude);

       
                    directionsService = new google.maps.DirectionsService();

                    directionsDisplay = new google.maps.DirectionsRenderer();

                    var mapProp = {
                        center: myCenter,
                        zoom: 15,
                        scrollwheel: true,
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
                        },
                        mapTypeId: google.maps.MapTypeId.ROADMAP
                    };
                    var map = new google.maps.Map(document.getElementById("map"), mapProp);
                    placeMarker(myCenter, map);


                    directionsDisplay.setMap(map);
                }
            });

        }

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
    }


    function placeMarker(myCenter, map) {
        var marker = new google.maps.Marker({
            position: myCenter,
            map: map,
        });
    }

    document.addEventListener("deviceready", onDeviceReady, false);
})(window);