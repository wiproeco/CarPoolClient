var app = angular.module('myApp12', []);
app.constant('Serviceurl', 'http://wiprocarpool.azurewebsites.net');

app.controller('UpdateCntrl', function ($scope, $http, $window, $filter) {
    var logdetails = {
        userid: "",
        logdescription: "",
        logDate: $filter('date')(new Date(), 'dd/MM/yyyy'),
        logTime: $filter('date')(new Date(), 'HH:mm'),
        type: 'Diagnostic'
    }
    $scope.processing = false;
    $scope.userName = localStorage.getItem("username");
    var id = localStorage.getItem('userid');
    try {
        $http.get("http://wiprocarpool.azurewebsites.net/UpdateProfileDetails/" + id)
        .success(function (data) {
            $scope.username = data[0].userName;
            $scope.password = data[0].password;
            $scope.email = data[0].email;
            $scope.mobile = data[0].mobile;
            $scope.photo = data[0].photo;
        }).error(function (result, status) {
            logdetails.userid = localStorage.getItem("username");
            logdetails.logdescription = status;
            Errorlog($http, logdetails, true);
        });
    }
    catch (e) {
        logdetails.userid = localStorage.getItem("username");
        logdetails.logdescription = e.message;
        Errorlog($http, logdetails, true);
    }

    $scope.ChangePassword = function () {
        window.location.href = "Changepassword.html";
    }

    // change passowrd screen 
    $scope.UpdatePassword = function () {

        $scope.ismatchpswd = false;

        var password = $scope.txtnewpswd;
        var confirmpassowrd = $scope.txtconfirmpswd;

        if (password !== confirmpassowrd) {
            $scope.ismatchpswd = true;
        }
        else {
            $scope.ismatchpswd = false;

            if (password !== "" && confirmpassowrd !== "" && password !== undefined && confirmpassowrd !== undefined) {
                var updatepswd = {
                    password: $scope.txtnewpswd,
                    id: localStorage.getItem('userid')
                }
                $scope.processing = true;
                try {
                    var url = $http.post('http://wiprocarpool.azurewebsites.net/updatePassword', updatepswd, { headers: { 'Content-Type': 'application/json' } });
                    url.success(function (result) {
                        //alert(result);
                        $scope.success = true;
                        $scope.processing = false;
                        window.location.href = "UpdateProfile.html";
                    }).error(function (data, status) {
                        logdetails.userid = localStorage.getItem("username");
                        logdetails.logdescription = status;
                        Errorlog($http, logdetails, true);
                    });
                } catch (e) {
                    logdetails.userid = localStorage.getItem("username");
                    logdetails.logdescription = e.message;
                    Errorlog($http, logdetails, true);
                }
            }
            else {

            }
        }
    }

    $scope.GoBack = function () {
        window.location.href = "UpdateProfile.html";
    }

    //save/update profile in update screen.
    $scope.saveProfile = function () {
        var usrname = $scope.username;
        var password = $scope.password;
        var emailId = $scope.email;
        var mobileno = $scope.mobile;
        //var photo = $scope.photo;

        if (usrname !== "" && password !== "" && emailId !== "" && mobileno !== "" &&
            usrname !== undefined && password !== undefined && emailId !== undefined && mobileno !== undefined) {

            var updatedetails = {
                id: localStorage.getItem('userid'),
                username: $scope.username,
                password: $scope.password,
                email: $scope.email,
                mobile: $scope.mobile,
                //photo: $scope.photo
            };
            $scope.processing = true;
            try {
                var url = $http.post('http://wiprocarpool.azurewebsites.net/SaveProfile', updatedetails,
                                          { headers: { 'Content-Type': 'application/json' } });
                url.success(function (result) {
                    if (result !== "" && result !== undefined) {
                        $scope.success = true;
                        $scope.processing = false;
                        $("#updateform").hide();
                        //window.location.href = "NewDashboard.html";
                    }
                }).error(function (data, status) {
                    logdetails.userid = localStorage.getItem("username");
                    logdetails.logdescription = status;
                    Errorlog($http, logdetails, true);
                });
            }
            catch (e) {
                logdetails.userid = localStorage.getItem("username");
                logdetails.logdescription = e.message;
                Errorlog($http, logdetails, true);
            }
        }
    }

    $scope.Cancel = function () {
        window.location.href = "NewDashboard.html";
    }

    $scope.validPhone = true;

    $scope.checkPhoneNumber = function (phone) {
        if (phone !== undefined) {
            var phoneReg = /^\d{10}$/;
            $scope.validPhone = phoneReg.test(phone);
        }
    }

    navigationLinks($scope, $http, $window);
});