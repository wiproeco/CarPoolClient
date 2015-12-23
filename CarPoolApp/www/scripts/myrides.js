var app = angular.module('myApp1', []);

app.controller('myRideCtrl', function ($scope, $http, $window) {

    navigationLinks($scope, $http, $window);

    $scope.rideId = "";
    $scope.rides = [];
   
    var userid = localStorage.getItem("userid");
    //var userid = "011251e3-a03d-60ad-a981-973b0bc60253";
    $scope.iserror = true;
    $scope.success = false;
    $http.get("http://carpoolserver.azurewebsites.net/getallridedetails/" + userid)
        .success(function (response) {
            $scope.rides = response[0].rides;
        })
        .error(function (data, status) {
            //alert('failed');
        });
    $scope.cancel = function (rideId) {
        $http.post("http://carpoolserver.azurewebsites.net/cancelride", { id: localStorage.getItem("userid"), rideid: rideId })
       .success(function (response) {
           //alert(rideId + " has been cancelled");
           $scope.iserror = true;
           $scope.success = true;
       })
       .error(function (data, status) {
           //alert('failed');
           //$scope.iserror = false;
           //$scope.success = false;
       });          
    }
    $scope.getDetails = function (rideId) {
        localStorage.setItem("currentRideId", rideId);
        window.location.href = "marker.html?rideid=" + rideId;
    }
    $scope.newRide = function () {
        window.location.href = "marker.html";
    }
});


function navigationLinks($scope, $http, $window) {

    var isowner = window.localStorage.getItem("isowner");

    if (isowner == "true") {
        $("#carownerShow").show();
        $("#passangerShow").hide();
        $("#carownerShow2").show();
        $("#passangerShow2").hide();
    }
    else {
        $("#passangerShow").show();
        $("#carownerShow").hide();
        $("#passangerShow2").show();
        $("#carownerShow2").hide();
    }

    $scope.MyDashboard = function () {
        //alert("kuhuh");
        window.location.href = "NewDashboard.html";
    }
   
    $scope.MyNotifications = function () {

        var isowner = window.localStorage.getItem("isowner");
        var notificationurl= '';
        if (isowner == "true")
            notificationurl = "ownernotification.html";
        else
            notificationurl = "usernotification.html";

        window.location.href = notificationurl;
    }

    $scope.ShareRide = function () {

        window.location.href = "addmarker.html";
    }

    $scope.MyRides = function () {

        window.location.href = "myrides.html";
    }

    $scope.JoinRide = function () {

        window.location.href = "ride.html";
    }

    $scope.logOut = function () {
        window.localStorage.setItem("userid", 0);
        window.location.href = 'index.html';
    }
}

app.controller('myRideDetailsCtrl', function ($scope, $http, $window) {
    navigationLinks($scope, $http, $window);
    $scope.rideId = "";
    if (getUrlParameter('rideid') !== undefined) {
        $scope.rideId = getUrlParameter('rideid');
        var rideJSON = localStorage.getItem("currentRideObject");
        var rideObject = JSON.parse(rideJSON);
        $scope.seats = rideObject.seatsavailable;
        $scope.date.startdate = new Date(rideObject.startdatetime);
        $scope.date.enddate = new Date(rideObject.enddatetime);
    }
    $scope.date = {
        startdate: new Date(),
        enddate: new Date()
    }
    $scope.updateRide = function () {
        var rideJSON = localStorage.getItem("currentRideObject");
        var rideObject = JSON.parse(rideJSON);
        rideObject.seatsavailable = $scope.seats;
        //alert($scope.date.startdate);
        rideObject.startdatetime = $scope.date.startdate.toJSON();
        alert(rideObject.startdatetime);

        rideObject.enddatetime = $scope.date.enddate.toJSON();
        $scope.iserror = true;
        $scope.success = false;
        //alert(JSON.stringify(rideObject));

        $http.post("http://carpoolserver.azurewebsites.net/updateroute/", { userid: localStorage.getItem("userid"), ride: rideObject })
       .success(function (response) {
          /* $scope.rides = response[0].rides;  */         
           $scope.iserror = true;
           $scope.success = true;
           window.location.href = 'myrides.html';
       })
       .error(function (data, status) {
           //$scope.iserror = false;
           //$scope.success = false;
           //alert('failed');
       });
    }
});

