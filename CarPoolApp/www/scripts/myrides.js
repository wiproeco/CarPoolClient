var app = angular.module('myApp1', []);

app.controller('myRideCtrl', function ($scope, $http, $window, $filter) {
    $("#errormsg").hide();
    $("#errordiv").hide();
    var logdetails = {
        userID: "",
        logdescription: "",
        logDate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        logTime: $filter('date')(new Date(), 'HH:mm'),
        type: 'Diagnostic'
    }
    document.getElementById("Loading").style.display = "block";
    navigationLinks($scope, $http, $window);

    $scope.rideId = "";
    $scope.rides = [];
    var userid = localStorage.getItem("userid");
    $scope.userName = localStorage.getItem("username");
    //var userid = "011251e3-a03d-60ad-a981-973b0bc60253";
    $scope.iserror = true;
    $scope.success = false;
    getAllRideDetails($scope, $http, userid);
    $scope.cancel = function (rideId) {
        document.getElementById("Loading").style.display = "block";
        try {
            $http.post("http://wiprocarpool.azurewebsites.net/cancelride", { id: localStorage.getItem("userid"), rideid: rideId })
           .success(function (response) {
               getAllRideDetails($scope, $http, localStorage.getItem("userid"));
               document.getElementById("Loading").style.display = "none";
               //alert(rideId + " has been cancelled");
               $scope.iserror = true;
               $scope.success = true;
           })
           .error(function (data, status) {
               document.getElementById("Loading").style.display = "none";
               //alert('failed');
               //$scope.iserror = false;
               //$scope.success = false;
               logdetails.userID = userid;
               logdetails.logdescription = status;
               Errorlog($http, logdetails, true);
           });
        }
        catch (e) {
            logdetails.userID = userid;
            logdetails.logdescription = e.message;
            Errorlog($http, logdetails);
        }
    }
    $scope.getDetails = function (rideId) {
        localStorage.setItem("currentRideId", rideId);
        window.location.href = "marker.html?rideid=" + rideId;
    }
    $scope.newRide = function () {
        window.location.href = "marker.html";
    }
});

function getAllRideDetails($scope, $http, userid) {
    document.getElementById("Loading").style.display = "block";
    var currentdate = moment().format('MM-DD-YYYY');
    $http.get("http://wiprocarpool.azurewebsites.net/getallridedetails/" + userid + "/" + currentdate)
    .success(function (response) {
        if (response.length > 0) {
            $scope.rides = response[0].rides;
        }
        document.getElementById("Loading").style.display = "none";

    })
    .error(function (data, status) {
        //alert('failed');
        document.getElementById("Loading").style.display = "none";
    });
}
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
        var notificationurl = '';
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

    $scope.UpdateProfile = function (name) {

        window.location.href = "UpdateProfile.html";
    }

    $scope.JoinRide = function () {

        window.location.href = "ride.html";
    }

    $scope.RidesHistory = function () {

        window.location.href = "rideshistory.html"
    }

    $scope.logOut = function () {
        window.localStorage.setItem("userid", 0);
        window.location.href = 'index.html';
        window.localStorage.Clear();
    }
}

app.controller('myRideDetailsCtrl', function ($scope, $http, $window, $filter) {
    $("#errormsg").hide();
    $("#errordiv").hide();
    $scope.datevalidation = false;
    $scope.validation = false;
    var logdetails = {
        userID: "",
        logdescription: "",
        logDate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        logTime: $filter('date')(new Date(), 'HH:mm'),
        type: 'Diagnostic'
    }
    navigationLinks($scope, $http, $window);
    $scope.rideId = "";
    if (getUrlParameter('rideid') !== undefined) {
        $scope.rideId = getUrlParameter('rideid');
        var rideJSON = localStorage.getItem("currentRideObject");
        var rideObject = JSON.parse(rideJSON);
        $scope.seats = rideObject.totalseats;
        //$scope.date.startdate = new Date(rideObject.startdatetime);
        //$scope.date.enddate = new Date(rideObject.enddatetime);
    }
    var now = new Date();
    $scope.date = {

        startdate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()),
        enddate: new Date(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes()),
        //startdate: moment(),
        //enddate: new Date()
    }
    $scope.updateRide = function (date) {
        if ($scope.seats != "" && $scope.seats != undefined && $scope.date.startdate != "" && $scope.date.startdate != undefined && $scope.date.enddate != "" && $scope.date.enddate != undefined) {
            $scope.validation = false;
            var rideJSON = localStorage.getItem("currentRideObject");
            var rideObject = JSON.parse(rideJSON);
            rideObject.seatsavailable = parseInt($scope.seats);
            rideObject.totalseats = parseInt($scope.seats);
            rideObject.startdatetime = moment(date.startdate).valueOf();  // Milliseconds
            rideObject.startdate = moment(date.startdate).format('MM-DD-YYYY');
            rideObject.starttime = moment(date.startdate).format('HH:mm');
            rideObject.enddatetime = moment(date.enddate).valueOf();
            rideObject.enddate = moment(date.enddate).format('MM-DD-YYYY');
            rideObject.endtime = moment(date.enddate).format('HH:mm');
            $scope.iserror = true;
            $scope.success = false;
            if (rideObject.startdatetime >= rideObject.enddatetime) {
                $scope.datevalidation = true;

            } else {
                $scope.datevalidation = false;
                try {
                    $http.post("http://wiprocarpool.azurewebsites.net/updateroute/", { userid: localStorage.getItem("userid"), ride: rideObject })
                   .success(function (response) {
                       //to update current location
                       $http.post("http://wiprocarpool.azurewebsites.net/updatecarlocation/", {
                           userid: localStorage.getItem("userid"), currgeolocnaddress: rideObject.startpoint, currgeolocnlat: rideObject.startlat, currgeolocnlong: rideObject.startlng
                       });
                       /* $scope.rides = response[0].rides;  */
                       $scope.iserror = true;
                       $scope.success = true;
                       window.location.href = 'myrides.html';
                   })
                   .error(function (data, status) {
                       //$scope.iserror = false;
                       //$scope.success = false;
                       //alert('failed');
                       var userid = localStorage.getItem("userid");
                       logdetails.userID = userid;
                       logdetails.logdescription = status;
                       Errorlog($http, logdetails, true);
                   });
                }
                catch (e) {
                    var userid = localStorage.getItem("userid");
                    logdetails.userID = userid;
                    logdetails.logdescription = e.message;
                    Errorlog($http, logdetails, true);
                }
            }
        }
        else {
            $scope.validation = true;
            return false;
        }
    }
});


function GetStartDate() {
    return (new Date()).toString();
}
function GetEndDate() {
    return (new Date()).toString();

}
function formatDate() {
    var d = new Date(),
        month = '-' + (d.getMonth() + 1),
        day = '-' + d.getDate(),
        year = d.getFullYear();

    var strDate = year + month + day;

    //2015-12-24

    return strDate;
}

