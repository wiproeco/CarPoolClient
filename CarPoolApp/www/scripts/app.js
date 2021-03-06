
var app = angular.module('myApp', []);
app.constant('Serviceurl', 'http://wiprocarpool.azurewebsites.net');

//$(document).ready(function () {

//    $('#divLoginfailed').removeClass('hide');
//    $('#errordiv').removeClass('hide');
//    $('#dvSuccess').removeClass('hide');
//    $('alert alert-danger').removeClass('hide');
//    var allSpanElements = $("span");
//    allSpanElements.removeClass("hide");
//});


app.controller('userCtrl', function ($scope, $http, $window, $filter, Serviceurl) {

    $scope.authenticated = false;
    $scope.errormsg = false;
    $scope.iserror = false;
    $scope.success = false;
    $scope.inputRegGender = 'Male';
    //$("#errormsg").hide();
    //$("#errordiv").hide();
    var logdetails = {
        userid: "",
        logdescription: "",
        logDate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        logTime: $filter('date')(new Date(), 'HH:mm'),
        type: 'Diagnostic'
    }
    var numofLoginAttempts;
    $scope.login = function () {
        $scope.errormsg = false;
        $scope.authenticated = false;
        window.localStorage.clear();

        var emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if ($scope.txtEmail != undefined) {
            if (emailReg.test($scope.txtEmail)) {
                var email = $scope.txtEmail.toLowerCase();
                var pass = $scope.txtPassword;
                var owner = $scope.Owner;
                window.localStorage.setItem("owner", owner);
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

                                if (isowner) {
                                    isowner = $scope.edit;
                                }

                                window.localStorage.setItem("userid", userid);
                                window.localStorage.setItem("isowner", isowner);
                                window.localStorage.setItem("username", username);
                                document.location.href = 'NewDashboard.html';
                                numofLoginAttempts = 0;
                            }
                            else {
                                document.getElementById("Loading").style.display = "none";
                                $scope.authenticated = true;
                                if (numofLoginAttempts == undefined) {
                                    numofLoginAttempts = 1;
                                }
                                else {
                                    numofLoginAttempts = numofLoginAttempts + 1;
                                }
                                if (numofLoginAttempts >= 3) {
                                    //$scope.authenticated = true;
                                    logdetails.userid = $scope.txtEmail;
                                    logdetails.logdescription = $scope.txtEmail + " login attempt failed more than 3 times....";
                                    Errorlog($http, $scope, logdetails, false);
                                    numofLoginAttempts = 0;
                                }
                            }

                        })
                        .error(function (data, status) {
                            $scope.authenticated = true;
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
                //$("#errordiv").show();
                //$("#errormsg").show();
                $scope.authenticated = false;
                $scope.errormsg = true;
                $("#errormsg").html("Enter valid email");
                $("#form-username").focus();
                $scope.txtPassword = "";
            }
        }
    }
    $scope.edit = false;
    $scope.change = function (isowner) {

        if (isowner == true)
            $scope.edit = true;
        else
            $scope.edit = false;
    }
    $scope.iserror = false;
    $scope.issuccess = false;
    $scope.ismatch = true;

    $scope.validEmail = true;
    $scope.validPhone = true;
    $scope.validpassword = true;
    $scope.checkuser = true;
    $scope.checkemail = true;
 //   $scope.confirmpassword = false;


    $scope.checkEmail = function (email) {
        $scope.checkemail = true;
        var Email = email.toLowerCase();
        var emailexits;
        if (Email !== undefined) {
            var emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            $scope.validEmail = emailReg.test(email);
            if ($scope.validEmail) {
                $http.get("http://wiprocarpool.azurewebsites.net/CheckEmail/" + Email)
               .success(function (response) {
                   if (response.length > 0) {
                       emailexits = true;
                   }
                   if (emailexits == true) {
                       $scope.checkemail = false;
                       $scope.authenticated = false;
                   }

               }).error(function (data, status) {
                   //  Errorlog($http, logdetails, true);
               });
            } else {
                $scope.checkemail = true;
            }
        }
    }

    $scope.checkUserName = function (username) {
        $scope.checkuser = true;
        var userName = username.toLowerCase();
        if (username !== undefined) {
            $http.get("http://wiprocarpool.azurewebsites.net/CheckUsername/" + userName)
                .success(function (response) {
                    if (response.length > 0) {
                        $scope.checkuser = false;
                    }
                }).error(function (data, status) {
                    //  Errorlog($http, logdetails, true);
                });
        }
    }

    $scope.checkPhoneNumber = function (phone) {
        if (phone !== undefined) {
            var phoneReg = /^\d{10}$/;
            $scope.validPhone = phoneReg.test(phone);
        }
    }

    $scope.accepttermsandconditions = function () {
        $("#termsandconditions").modal("toggle");
    }

    $scope.passwordValidation = function (password) {
        if (password !== undefined) {
            var passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
            $scope.validpassword = passwordReg.test(password);
        }
    }

    $scope.AddUser = function () {
        $scope.gender = false;
        $scope.EmailId = false;
        $scope.UserNameerror = false;
        $scope.termsandcond = false;
        $scope.passworderror = false;
        $scope.carnumber = false;
        $scope.confirmpassword = false;

        //$("#errordiv").hide();
        //$("#errormsg").hide();
        var emailReg = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var phoneReg = /^\d{10}$/;
        if ($scope.txtRegEmail != undefined && $scope.txtRegMobile != undefined) {
            if (!emailReg.test($scope.txtRegEmail)) {
                //$("#errordiv").show();
                //$("#errormsg").show();
                $("#errormsg").html("Enter valid email");
                $("#form-emailId").focus();
                $("#topHeader").focus();

                
            }

            else if ($scope.txtRegPwd != $scope.txtRegConfirmPwd)
            {
                $scope.confirmpassword = true;
                $("#topHeader").focus();
                
            }
            else
                if (!phoneReg.test($scope.txtRegMobile)) {
                    //$("#errordiv").show();
                    //$("#errormsg").show();
                    $("#errormsg").html("Enter valid phone number");
                    $("#form-mobileno").focus();
                    $("#topHeader").focus();

                } else
                    if (!$scope.checkemail) {
                        //$scope.iserror = true;
                        $scope.EmailId = false;
                        // $("#errormsg").html("Email ID already exists");
                        $("#form-emailId").focus();
                        $("#topHeader").focus();

                    } else
                        if (!$scope.checkuser) {
                            //$scope.iserror = true;
                            $scope.UserNameerror = false;
                            //$("#errormsg").html("User already exists");
                            $("#form-username").focus();
                            $("#topHeader").focus();

                        } else
                            if ($scope.inputRegGender === undefined) {
                                //$scope.error = false;
                                $scope.gender = true;
                                //$("#errormsg").html("Select Gender");
                                $("#optionsRadiosInline1").focus();
                                $("#topHeader").focus();

                            } else
                                if (!$scope.validpassword) {
                                    $scope.passworderror = true;
                                    $("#form-password").focus();
                                    $("#topHeader").focus();

                                } else
                                    if ($scope.termsandconditions === undefined || $scope.termsandconditions === false) {
                                        //$scope.iserror = true;
                                        $scope.termsandcond = true;
                                        //$("#errormsg").html("Accept Terms and Conditions");
                                        $("#form-termsandconditions").focus();
                                        $("#topHeader").focus();

                                    } else
                                        if ($scope.edit && $scope.carno === undefined) {
                                            $scope.carnumber = true;
                                            $("#form-carnumber").focus();
                                            $("#topHeader").focus();

                                        }
                                        else {

                                            var UserName = $scope.txtRegUserName.toLowerCase();
                                            var Password = $scope.txtRegPwd;
                                            var ConfirmPwd = $scope.txtRegConfirmPwd;
                                            var Email = $scope.txtRegEmail.toLowerCase();
                                            var Mobile = $scope.txtRegMobile;
                                            var Gender = $scope.inputRegGender;
                                            var isCarOwner = $scope.edit;
                                            var binaryImage = window.localStorage.getItem("binaryImage");
                                            var carNo = "";
                                            //var seatCap = "";
                                            if (Password != ConfirmPwd) {
                                                $scope.ismatch = false;
                                            } else {
                                                $scope.ismatch = true;
                                            }
                                            if (isCarOwner) {
                                                carNo = $scope.carno;
                                                //seatCap = $scope.seats;
                                            }
                                            $scope.Errors = "";
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
                                                    //totalseats: seatCap,
                                                    photo: binaryImage,
                                                    currgeolocnaddress: "",
                                                    currgeolocnlat: "",
                                                    currgeolocnlong: "",
                                                    rides: [
                                                    ]
                                                });
                                                $scope.processing = true;
                                                $("#topHeader").focus();
                                                try {
                                                    var res = $http.post('http://wiprocarpool.azurewebsites.net/register', user,
                                                              { headers: { 'Content-Type': 'application/json' } });
                                                    res.success(function (data, status, headers, config) {
                                                        $scope.iserror = false;


                                                        $scope.issuccess = true;
                                                        $scope.txtRegUserName = '';
                                                        $scope.txtRegPwd = '';
                                                        $scope.txtRegConfirmPwd = '';
                                                        $scope.txtRegEmail = '';
                                                        $scope.txtRegMobile = '';
                                                        $scope.termsandconditions = '';
                                                        $scope.inputRegGender = 'Male';
                                                        $scope.carno = '';
                                                        $scope.processing = false;
                                                        window.localStorage.removeItem("binaryImage");
                                                        document.getElementById('selfieImage').style.border = "2px dotted #808080";
                                                        document.getElementById('selfieImage').innerHTML = "120 X 90";
                                                        $("#aSignin").focus();
                                                    });
                                                    res.error(function (data, status, headers, config) {
                                                       
                                                        $scope.iserror = true;

                                                        if (status == '404' || status == '403')
                                                            $scope.Errors = "Error : Server is down try after some time!!";
                                                        else
                                                            $scope.Errors = "Getting some fatal error please try again.";

                                                        $scope.issuccess = false;
                                                        $scope.Error = data;
                                                        //$scope.txtRegUserName = '';
                                                        //$scope.txtRegPwd = '';
                                                        //$scope.txtRegConfirmPwd = '';
                                                        //$scope.txtRegEmail = '';
                                                        //$scope.txtRegMobile = '';
                                                        //$scope.termsandconditions = '';
                                                        //$scope.inputRegGender = '';
                                                        //$scope.carno = '';
                                                        //document.getElementById('selfieImage').innerHTML = '';
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
        logdetails.userid = userid;
        logdetails.logdescription = e.message;
        Errorlog($http, logdetails, true);
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
            logdetails.userid = userid;
            logdetails.logdescription = e.message;
            Errorlog($http, logdetails, true);
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
        window.localStorage.clear();
    }
}

function PushNotifications() {
    var notificationurl = "http://wiprocarpool.azurewebsites.net/";
    var isowner = window.localStorage.getItem("isowner");
    var userId = window.localStorage.getItem("userid");
    var currentdate = moment().format('MM-DD-YYYY');
    var totaltimeout = 5;
    $("#MyNotifications").css("color", "green");

    if (isowner == "true") {
        var latitude = "";
        var longitude = "";
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                latitude = position.coords.latitude.toString();
                longitude = position.coords.longitude.toString();
                notificationurl = notificationurl + "getnotitifications/" + userId + "/" + currentdate + "/" + latitude + "/" + longitude;
                totaltimeout = 15;
                NotificationClientService.AutomaticNotifications(notificationurl, 2, totaltimeout, null, NotificationCallback);
            });
        }
    }
    else {
        notificationurl = notificationurl + "receivenotitifications/" + userId + "/" + currentdate;
        NotificationClientService.AutomaticNotifications(notificationurl, 2, totaltimeout, null, NotificationCallback);
    }
}

function NotificationCallback(notifications) {
    var isowner = window.localStorage.getItem("isowner");
    var cacheData = window.localStorage.getItem("notificationData");
    var currentData = JSON.stringify(notifications);

    if (notifications != undefined && notifications != null && cacheData != currentData) {
        window.localStorage.setItem("notificationData", currentData);

        if (isowner == "true") {
            $("#MyNotifications").css("color", "red");
            playAudio();

            CancelNotification.Clear(NotificationClientService.RefreshIntervalId);
        }
        else {
            if (pendingCheck(notifications)) {
                $("#MyNotifications").css("color", "yellow");
            }
            else {
                $("#MyNotifications").css("color", "red");
                playAudio();

                CancelNotification.Clear(NotificationClientService.RefreshIntervalId);
            }
        }
    }
}

function pendingCheck(notifications) {
    for (var i = 0; i < notifications.data.length; i++) {
        if (notifications.data[i].status == "pending")
            return true;
    }
    return false;
}

function playAudio() {

    var my_media = new Media('/android_asset/www/audio/alert.mp3');

    my_media.play();

    navigator.notification.alert(
      'You have received a new message!',  // message
      '',         // callback
      'Notification',            // title
      'Done'                  // buttonName
    );
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
    var currentdate = moment().format('MM-DD-YYYY');

    //var url = "http://wiprocarpool.azurewebsites.net/receivenotitifications/53946907-3b48-6904-f599-db29de2e74e6";
    try {
        var url = "http://wiprocarpool.azurewebsites.net/receivenotitifications/" + userId + "/" + currentdate;
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

    $scope.cancelRideNotification = function (ownerid, rideid, passengerid, bookingstatus) {
        document.getElementById("Loading").style.display = "block";

        var user = JSON.stringify({
            id: ownerid,
            rideid: rideid,
            userid: passengerid,
            status: bookingstatus
        });

        var res = $http.post('http://wiprocarpool.azurewebsites.net/cancelriderequest', user, { headers: { 'Content-Type': 'application/json' } });
        try {
            res.success(function (data, status, headers, config) {
                $scope.notificationdata = "";
                window.location.href = 'usernotification.html';
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


    $scope.trackownerlocation = function (ownerid) {
        window.location.href = "tracking.html?ownerId=" + ownerid;
    };
});

app.controller('ownernotificationCtrl', function ($scope, $http, $window, $filter) {
    $scope.isOwnerNotificationHasData = false;
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
    var currentdate = moment().format('MM-DD-YYYY');
    var latitude = "";
    var longitude = "";
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            latitude = position.coords.latitude.toString();
            longitude = position.coords.longitude.toString();

            var url = "http://wiprocarpool.azurewebsites.net/getnotitifications/" + userId + "/" + currentdate + "/" + latitude + "/" + longitude;
            try {
                $http.get(url)
                        .success(function (response) {
                            var data = JSON.stringify(response);
                            var result = JSON.parse(data);
                            if (result.length > 0) {
                                $scope.notificationdata = result;
                                $scope.isOwnerNotificationHasData = true;
                            }
                            else {
                                $scope.isOwnerNotificationHasData = false;
                            }
                            document.getElementById("Loading").style.display = "none";

                        }).error(function (data, status) {
                            // alert(data);    
                            document.getElementById("Loading").style.display = "none";
                            logdetails.userid = userId;
                            logdetails.logdescription = status;
                            $scope.isOwnerNotificationHasData = false;
                            Errorlog($http, logdetails, true);
                        });
            } catch (e) {
                logdetails.userid = userId;
                logdetails.logdescription = e.message;
                Errorlog($http, logdetails, true);
                $scope.isOwnerNotificationHasData = false;
            }
        });
    }
    $scope.updateRideNotification = function (ownerid, rideid, passengerid, bookingstatus) {
        document.getElementById("Loading").style.display = "block";

        var userreqforcurrgeolocnvalue = "";

        if (document.getElementById("chkuserreqforcurrgeolocn")) {
            if (document.getElementById("chkuserreqforcurrgeolocn").checked)
                userreqforcurrgeolocnvalue = true;
            else
                userreqforcurrgeolocnvalue = false;
        }
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

app.controller('ridesHistoryCtrl', function ($scope, $http, $window, $filter) {
    $scope.processing = true;
    var isowner;
    var email = window.localStorage.getItem("email", email);
    var id = window.localStorage.getItem("userid");
    $scope.userName = localStorage.getItem("username");
    var username = $scope.userName;
    var d = new Date();
    var currenttime = d.getTime();

    if (window.localStorage.getItem("owner") === "true") {
        isowner = true;
        $scope.ridehistoryas = "As a Owner"
    } else {
        isowner = false;
        $scope.ridehistoryas = "As a User"
    }
    $http.get("http://wiprocarpool.azurewebsites.net/getrideshistory/" + id + "/" + isowner + "/" + currenttime)
        .success(function (response) {
            if (response.rides.length > 0) {
                var ridesHistory = { rides: [] };
                for (var i = 0; i < response.rides.length; i++) {
                    var date = new Date(response.rides[i].EndDate);
                    var rideDateTime = date.toDateString() + " " + addZero(date.getHours()) + ":" + addZero(date.getMinutes()) + ":" + addZero(date.getSeconds());
                    ridesHistory.rides.push({ "EndDate": rideDateTime, "StartPoint": response.rides[i].StartPoint, "EndPoint": response.rides[i].EndPoint });
                }
                $scope.ridesavailable = true;
            }
            else {
                var ridesHistory = "no rides";
                //ridesHistory.push("no rides");
                $scope.ridesavailable = false;
            }
            $scope.processing = false;
            $scope.rides = ridesHistory;
            document.getElementById("Loading").style.display = "none";
        }).error(function (data, status) {
            $scope.authenticated = true;
            document.getElementById("Loading").style.display = "none";
            logdetails.userid = $scope.txtEmail;
            logdetails.logdescription = status;
            Errorlog($http, logdetails, true);

        });
    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }
    navigationLinks($scope, $http, $window);
});


