
var app = angular.module('myApp', []);

app.controller('userCtrl', function ($scope, $http, $window, $filter) {
    $("#errormsg").hide();
    $("#errordiv").hide();
    var logdetails = {
        userid: "",
        logdescription: "",
        logDate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        logTime: $filter('date')(new Date(), 'HH:mm'),
        type: 'Diagnostic'
    }
    var numofLoginAttempts;
    $scope.authenticated = true;
    $scope.login = function () {
        $("#errordiv").hide();
        $("#errormsg").hide();
        var emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ($scope.txtEmail != undefined) {
            if (emailReg.test($scope.txtEmail)) {
                var email = $scope.txtEmail;
                var pass = $scope.txtPassword;
                document.getElementById("Loading").style.display = "block";
                if (email != "" && pass != "" && email != undefined && pass != undefined) {
                    try {
                        $http.get("http://wiprocarpool.azurewebsites.net/authenticate/" + email + "/" + pass)
                        .success(function (response) {
                            var data = JSON.stringify(response);
                            var result = JSON.parse(data);
                            if (result.length > 0) {
                                var userid = result[0].id;
                                var isowner = result[0].isowner;
                                var username = result[0].userName;
                                window.localStorage.setItem("userid", userid);
                                window.localStorage.setItem("isowner", isowner);
                                window.localStorage.setItem("username", username);
                                document.location.href = 'NewDashboard.html';
                                numofLoginAttempts = 0;
                            }
                            else {
                                document.getElementById("Loading").style.display = "none";
                                $scope.authenticated = false;
                                if (numofLoginAttempts == undefined) {
                                    numofLoginAttempts = 1;
                                }
                                else {
                                    numofLoginAttempts = numofLoginAttempts + 1;
                                }
                                if (numofLoginAttempts >= 3) {
                                    $scope.authenticated = true;
                                    logdetails.userid = $scope.txtEmail;
                                    logdetails.logdescription = $scope.txtEmail + " login attempt failed more than 3 times....";
                                    Errorlog($http, logdetails, false);
                                    numofLoginAttempts = 0;
                                }
                            }

                        })
                        .error(function (data, status) {
                            $scope.authenticated = false;
                            document.getElementById("Loading").style.display = "none";
                            logdetails.userid = $scope.txtEmail;
                            logdetails.logdescription = status;
                            Errorlog($http, logdetails, true);

                        });
                    }
                    catch (e) {
                        logdetails.userid = $scope.txtEmail;
                        logdetails.logdescription = e.message;
                        Errorlog($http, logdetails);
                    }

                }
                else { document.getElementById("Loading").style.display = "none"; }

            } else {
                $("#errordiv").show();
                $("#errormsg").show();
                $("#errormsg").html("Enter valid email");
                $("#form-username").focus();
                $scope.txtPassword = "";
                $scope.authenticated = true;
            }
        }
    }
    $scope.edit = false;
    $scope.change = function () {

        if ($scope.isCarOwner == true)
            $scope.edit = true;
        else
            $scope.edit = false;
    }
    $scope.iserror = true;
    $scope.success = false;
    $scope.ismatch = true;

    $scope.validEmail = true;
    $scope.validPhone = true;

    $scope.checkEmail = function (email) {

        if (email !== undefined) {
            var emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            $scope.validEmail = emailReg.test(email);
            if (emailReg.test(email)) {
                $("#errordiv").hide();
                $("#errormsg").hide();
            }
            $scope.authenticated = true;
        }
    }

    $scope.checkPhoneNumber = function (phone) {
        if (phone !== undefined) {
            var phoneReg = /^\d{10}$/;
            $scope.validPhone = phoneReg.test(phone);
        }
    }

    $scope.AddUser = function () {
        $("#errordiv").hide();
        $("#errormsg").hide();
        var emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var phoneReg = /^\d{10}$/;
        if ($scope.txtRegEmail != undefined && $scope.txtRegMobile != undefined) {
            if (!emailReg.test($scope.txtRegEmail)) {
                $("#errordiv").show();
                $("#errormsg").show();
                $("#errormsg").html("Enter valid email");
                $("#form-emailId").focus();
            } else
                if (!phoneReg.test($scope.txtRegMobile)) {
                    $("#errordiv").show();
                    $("#errormsg").show();
                    $("#errormsg").html("Enter valid phone number");
                    $("#form-mobileno").focus();
                } else {


                    var UserName = $scope.txtRegUserName;
                    var Password = $scope.txtRegPwd;
                    var ConfirmPwd = $scope.txtRegConfirmPwd;
                    var Email = $scope.txtRegEmail;
                    var Mobile = $scope.txtRegMobile;
                    var Gender = $scope.inputRegGender;
                    var isCarOwner = $scope.edit;
                    var binaryImage = window.localStorage.getItem("binaryImage");
                    var carNo = "";
                    var seatCap = "";
                    if (Password != ConfirmPwd) {
                        $scope.ismatch = false;
                    } else {
                        $scope.ismatch = true;
                    }
                    if (isCarOwner) {
                        carNo = $scope.carno;
                        seatCap = $scope.seats;
                    }
                    //$window.alert(UserName + ',' + Password + ',' + Email + ',' + Mobile + ',' + Gender + ',' + isCarOwner + ',' + carNo + ',' + seatCap + ',' + spoint + ',' + epoint);
                    if ($scope.ismatch && UserName != "" && Password != "" && ConfirmPwd != "" && Email != "" && Mobile != "" && Gender != ""
                       && UserName != undefined && Password != undefined && ConfirmPwd != undefined && Email != undefined && Mobile != undefined && Gender != undefined) {


                        var user = JSON.stringify({
                            type: "user",
                            userName: UserName,
                            password: Password,
                            email: Email,
                            mobile: Mobile,
                            gender: Gender,
                            isowner: isCarOwner,
                            carNo: carNo,
                            totalseats: seatCap,
                            photo: binaryImage,
                            currgeolocnaddress: "",
                            currgeolocnlat: "",
                            currgeolocnlong: "",
                            rides: [
                            ]
                        });
                        $scope.processing = true;
                        try {
                            var res = $http.post('http://wiprocarpool.azurewebsites.net/register', user,
                                      { headers: { 'Content-Type': 'application/json' } });
                            res.success(function (data, status, headers, config) {
                                $scope.iserror = true;
                                $scope.success = true;
                                $scope.txtRegUserName = '';
                                $scope.txtRegPwd = '';
                                $scope.txtRegConfirmPwd = '';
                                $scope.txtRegEmail = '';
                                $scope.txtRegMobile = '';
                                $scope.carno = '';
                                $scope.processing = false;
                                window.localStorage.removeItem("binaryImage");
                            });
                            res.error(function (data, status, headers, config) {
                                $scope.iserror = false;
                                $scope.success = false;
                                $scope.Error = data;
                                $scope.txtRegUserName = '';
                                $scope.txtRegPwd = '';
                                $scope.txtRegConfirmPwd = '';
                                $scope.txtRegEmail = '';
                                $scope.txtRegMobile = '';
                                $scope.carno = '';
                                $scope.processing = false;
                                logdetails.userid = $scope.txtRegEmail;
                                logdetails.logdescription = status;
                                Errorlog($http, logdetails, true);
                            });
                        } catch (ex) {
                            logdetails.userid = $scope.txtRegEmail;
                            logdetails.logdescription = ex.message;
                            Errorlog($http, logdetails, true);
                        }
                    }
                    return false;
                }
        }

    }
});

app.controller('searchCtrl', function ($scope, $http, $window, $rootScope, $filter) {
    var logdetails = {
        userid: "",
        logdescription: "",
        logDate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        logTime: $filter('date')(new Date(), 'HH:mm'),
        type: 'Diagnostic'
    }
    var url = "http://wiprocarpool.azurewebsites.net/listsharedrides/";
    var userid = window.localStorage.getItem("userid");
    try {
        $http.get(url + "undefined/undefined/" + userid)
           .success(function (response) {
               $scope.users = response;

           })

            .error(function (data, status) {
                //alert('failed');
                logdetails.userid = userid;
                logdetails.logdescription = status;
                Errorlog($http, logdetails, true);
            });
    }
    catch (e) {
        alert(e);
        logdetails.userid = userid;
        logdetails.logdescription = e.message;
        Errorlog($http, logdetails);
    }

    //click on join link
    $scope.ActiveChange = function (user) {
        alert('Request to join the route is created succesfully ');


    }

    //search funtionality
    $scope.search = function () {
        try {
            if ($scope.txtsource != "" && $scope.txtdestination != "") {
                var source = $scope.txtsource;
                var destin = $scope.txtdestination;
                $http.get(url + source + "/" + destin + "/0")
                   .success(function (Result) {

                       $scope.users = Result;
                   })
                    .error(function (data, status) {
                        //alert('Search failed');
                        logdetails.userid = userid;
                        logdetails.logdescription = status;
                        Errorlog($http, logdetails, true);
                    });
            }
            else { return false; }
        }
        catch (e) {
            //alert(e);
        }

    }

});

app.controller('newRideCtrl', function ($scope, $http, $window) {
    $("#errormsg").hide();
    $("#errordiv").hide();
    $scope.userName = localStorage.getItem("username");
    navigationLinks($scope, $http, $window);
});

app.controller('dashboardCtrl', function ($scope, $http, $window) {
    $("#errordiv").hide();
    $("#errormsg").hide();
    $scope.userName = localStorage.getItem("username");
    PushNotifications();
    navigationLinks($scope, $http, $window);
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

    $scope.JoinRide = function () {

        window.location.href = "ride.html";
    }

    $scope.logOut = function () {
        window.localStorage.setItem("userid", 0);
        window.location.href = 'index.html';
    }
}

function PushNotifications() {
    var notificationurl = "http://localhost:1513/";
    var isowner = window.localStorage.getItem("isowner");
    var userId = window.localStorage.getItem("userid");
    var todayDate = new Date();
    var date = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate();

    var totaltimeout = 5;

    if (isowner == "true") {
        var latitude = "";
        var longitude = "";
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude.toString();
                longitude = position.coords.longitude.toString();
                notificationurl = notificationurl + "getnotitifications/" + userId + "/" + date.toString() + "/" + latitude + "/" + longitude;                
                totaltimeout = 15;
                $("#MyNotifications").css("color", "green");
                NotificationClientService.AutomaticNotifications(notificationurl, 2, totaltimeout, null, NoticationCallback);
            });
        }
    }
    else {        
        notificationurl = notificationurl + "receivenotitifications/" + userId;
        $("#MyNotifications").css("color", "green");
        NotificationClientService.AutomaticNotifications(notificationurl, 2, totaltimeout, null, NoticationCallback);
    }
}

function NoticationCallback(data) {
    var isowner = window.localStorage.getItem("isowner");

    if (data != undefined && data != null && data.data.length > 0) {
        if (isowner == "true") {
            $("#MyNotifications").css("color", "red");
            CancelNotification.Clear(NotificationClientService.RefreshIntervalId);
        }
        else {
            if (data.data[0].status == "pending") {
                $("#MyNotifications").css("color", "yellow");
            }
            else {
                $("#MyNotifications").css("color", "red");
                CancelNotification.Clear(NotificationClientService.RefreshIntervalId);
            }
        }
    }
}

app.controller('usernotificationCtrl', function ($scope, $http, $window, $filter) {
    $("#errormsg").hide();
    $("#errordiv").hide();
    var logdetails = {
        userid: "",
        logdescription: "",
        logDate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        logTime: $filter('date')(new Date(), 'HH:mm'),
        type: 'Diagnostic'
    }
    document.getElementById("Loading").style.display = "block";
    navigationLinks($scope, $http, $window);
    $scope.notificationdata = "";
    var userId = window.localStorage.getItem("userid");
    $scope.userName = localStorage.getItem("username");

    //var url = "http://wiprocarpool.azurewebsites.net/receivenotitifications/53946907-3b48-6904-f599-db29de2e74e6";
    try {
        var url = "http://wiprocarpool.azurewebsites.net/receivenotitifications/" + userId;
        $http.get(url)
                .success(function (response) {

                    var data = JSON.stringify(response);
                    var result = JSON.parse(data);
                    if (result.length > 0) {
                        $scope.notificationdata = result;
                    }
                    document.getElementById("Loading").style.display = "none";

                }).error(function (data, status) {
                    document.getElementById("Loading").style.display = "none";
                    logdetails.userid = userId;
                    logdetails.logdescription = status;
                    Errorlog($http, logdetails, true);
                });
    } catch (e) {
        logdetails.userid = userId;
        logdetails.logdescription = e.message;
        Errorlog($http, logdetails, true);
    }

    $scope.trackownerlocation = function (ownerid) {
        window.location.href = "tracking.html?ownerId=" + ownerid;
    };
});

app.controller('ownernotificationCtrl', function ($scope, $http, $window, $filter) {
    $("#errormsg").hide();
    $("#errordiv").hide();
    var logdetails = {
        userid: "",
        logdescription: "",
        logDate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        logTime: $filter('date')(new Date(), 'HH:mm'),
        type: 'Diagnostic'
    }
    document.getElementById("Loading").style.display = "block";
    navigationLinks($scope, $http, $window);
    $scope.notificationdata = "";
    var userId = window.localStorage.getItem("userid");
    $scope.userName = localStorage.getItem("username");
    var todayDate = new Date();
    var date = todayDate.getFullYear() + "-" + (todayDate.getMonth() + 1) + "-" + todayDate.getDate(); 
    //var date = todayDate.getFullYear() + "-" + ("0" + (todayDate.getMonth() + 1)).slice(-2) + "-" + ("0" + (todayDate.getDate())).slice(-2);
    //var url = "http://wiprocarpool.azurewebsites.net/getnotitifications/bae03711-08e6-7d8f-8101-457caa0368a8/2011-07-14";
    var url = "http://wiprocarpool.azurewebsites.net/getnotitifications/" + userId + "/" + date.toString();
    try {
        $http.get(url)
                .success(function (response) {
                    var data = JSON.stringify(response);
                    var result = JSON.parse(data);
                    if (result.length > 0) {
                        $scope.notificationdata = result;
                    }
                    document.getElementById("Loading").style.display = "none";

                }).error(function (data, status) {
                    // alert(data);    
                    document.getElementById("Loading").style.display = "none";
                    logdetails.userid = userId;
                    logdetails.logdescription = status;
                    Errorlog($http, logdetails, true);
                });
    } catch (e) {
        logdetails.userid = userId;
        logdetails.logdescription = e.message;
        Errorlog($http, logdetails, true);
    }

    $scope.updateRideNotification = function (ownerid, rideid, passengerid, bookingstatus) {
        document.getElementById("Loading").style.display = "block";

        var userreqforcurrgeolocnvalue = "";

        if (document.getElementById("chkuserreqforcurrgeolocn").checked)
            userreqforcurrgeolocnvalue = true;
        else
            userreqforcurrgeolocnvalue = false;

        var user = JSON.stringify({
            id: ownerid,
            rideid: rideid,
            userid: passengerid,
            status: bookingstatus,
            reqforcurrgeolocn: userreqforcurrgeolocnvalue
        });

        var res = $http.post('http://wiprocarpool.azurewebsites.net/rideconfirmation', user, { headers: { 'Content-Type': 'application/json' } });
        try {
            res.success(function (data, status, headers, config) {
                $scope.notificationdata = "";
                window.location.href = 'ownernotification.html';
                $scope.iserror = true;
                $scope.success = true;
                document.getElementById("Loading").style.display = "none";
            }).error(function (data, status) {
                //alert(data);
                //$scope.iserror = false;
                //$scope.success = false;
                document.getElementById("Loading").style.display = "none";
                logdetails.userid = userId;
                logdetails.logdescription = status;
                Errorlog($http, logdetails, true);
            });
        } catch (e) {
            logdetails.userid = userId;
            logdetails.logdescription = e.message;
            Errorlog($http, logdetails, true);
        }
    }

});


