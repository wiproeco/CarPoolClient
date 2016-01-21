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
    $scope.checkuser = true;
    $scope.userName = localStorage.getItem("username");
    var id = localStorage.getItem('userid');
    var prevUsername;
    try {
        $http.get("http://wiprocarpool.azurewebsites.net/UpdateProfileDetails/" + id)
        .success(function (data) {
            $scope.username = data[0].userName;
            prevUsername = data[0].userName;            
            $scope.password = data[0].password;
            $scope.email = data[0].email;
            $scope.mobile = data[0].mobile;
            $scope.isCarOwner = data[0].isowner;
            $scope.change(data[0].isowner);
            $scope.carno = data[0].carNo;
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

    $scope.change = function (isowner) {

        if (isowner == true)
            $scope.edit = true;
        else
            $scope.edit = false;
    }

    $scope.ChangePassword = function () {
        window.location.href = "Changepassword.html";
    }

    $scope.validpassword = true;

    $scope.passwordValidation = function (password) {
        $scope.passworderror = false;
        if (password !== undefined) {
            var passwordReg = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
            $scope.validpassword = passwordReg.test(password);
        }
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
                if (!$scope.validpassword) {
                    $scope.passworderror = true;
                    $("#form-confirm-password").focus();
                } else {
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
            }
            else {

            }
        }
    }

    $scope.GoBack = function () {
        window.location.href = "UpdateProfile.html";
    }

    $scope.checkUserName = function (username) {
        $scope.checkuser = true;
        var userName = username.toLowerCase();
        if (username !== undefined && username!==prevUsername) {
            $http.get("http://wiprocarpool.azurewebsites.net/CheckUsername/" + userName)
                .success(function (response) {
                    if (response.length > 0) {
                        $scope.checkuser = false;
                        $("#form-username").focus();
                    }
                }).error(function (data, status) {
                    //  Errorlog($http, logdetails, true);
                });
        }
    }

    //save/update profile in update screen.
    $scope.saveProfile = function () {
        $scope.carnumber = false;
        if ($scope.edit && $scope.carno === "") {
            $scope.carnumber = true;
            $("#form-carnumber").focus();
        } else {

            var usrname = $scope.username.toLowerCase();
            var password = $scope.password;
            var emailId = $scope.email;
            var mobileno = $scope.mobile;
            var isCarOwner = $scope.edit;
            var carNo = "";
            if (isCarOwner) {
                carNo = $scope.carno;
            }

            if (usrname !== "" && password !== "" && emailId !== "" && mobileno !== "" &&
                usrname !== undefined && password !== undefined && emailId !== undefined && mobileno !== undefined) {
                $scope.checkUserName(usrname);
                if ($scope.checkuser) {
                    var updatedetails = {
                        id: localStorage.getItem('userid'),
                        username: $scope.username.toLowerCase(),
                        password: $scope.password,
                        mobile: $scope.mobile,
                        isowner: isCarOwner,
                        carNo: carNo
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
                                $(".collapsed").prop("disabled", true);
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
                return false;
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