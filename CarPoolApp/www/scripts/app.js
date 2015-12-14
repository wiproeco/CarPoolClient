
var app = angular.module('myApp', []);
app.controller('userCtrl', function ($scope, $http, $window) {
    $scope.authenticated = true;
    $scope.login = function () {
        var email = $scope.txtEmail;
        var pass = $scope.txtPassword;              
        if (email != "" && pass != "" && email!=undefined && pass!=undefined) {

            //var url="http://azurecarpool.azurewebsites.net/authenticate/" + email + "/" + pass;
            //$.ajax({
            //    type: "GET",
            //    contentType: "application/json",
            //    url: url,              
            //    dataType: "json",
            //    success: function () {

            //        var data = JSON.stringify(response);
            //        var result = JSON.parse(data);
            //        if (result.length > 0) {
            //            alert('test');
            //            var userid = result[0].id;                      
            //            window.localStorage.setItem("userid", userid);
            //            window.location.href = '/Dashboard.html';
            //        }
            //        else {
            //            $scope.authenticated = false;
            //        }
            //    }
            //});

            $http.get("http://carpooltestapp.azurewebsites.net/authenticate/" + email + "/" + pass)
            .success(function (response) {                               
                var data = JSON.stringify(response);
                var result = JSON.parse(data);
                if (result.length > 0) {                    
                    var userid = result[0].id;
                    window.localStorage.setItem("userid", userid);
                    document.location.href = 'Dashboard.html';
                }
                else {
                   
                    $scope.authenticated = false;
                }
               
            }).error(function (data, status) {
                $scope.loginError = data;
                $scope.authenticated = false;
            });
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
    $scope.AddUser = function () {
        var UserName = $scope.txtRegUserName;
        var Password = $scope.txtRegPwd;
        var ConfirmPwd = $scope.txtRegConfirmPwd;
        var Email = $scope.txtRegEmail;
        var Mobile = $scope.txtRegMobile;
        var Gender = $scope.inputRegGender;
        var isCarOwner = $scope.edit;
        var carNo = "";
        var seatCap = "";
        if (Password != ConfirmPwd) {
            $scope.ismatch = false;
        } else
        {
            $scope.ismatch = true;
        }
        if (isCarOwner) {
            carNo = $scope.carno;
            seatCap = $scope.seats;
        }
        //$window.alert(UserName + ',' + Password + ',' + Email + ',' + Mobile + ',' + Gender + ',' + isCarOwner + ',' + carNo + ',' + seatCap + ',' + spoint + ',' + epoint);
        if ($scope.ismatch && UserName != "" && Password != "" && ConfirmPwd != "" && Email != "" && Mobile != "" && Gender != ""
           && UserName != undefined && Password != undefined && ConfirmPwd != undefined && Email != undefined && Mobile != undefined && Gender != undefined)
        {
            var user = JSON.stringify({
                type: "User", UserName: UserName,
                password: Password,
                email: Email,
                Mobile: Mobile,
                Gender: Gender,
                isowner: isCarOwner,
                carNo:carNo,
                totalseats: seatCap,
                isActive:'true',
                location: [
                    {
                        startpoint: '',
                        endpoint: '',
                        seatavail: seatCap
                    }
                ],
                setlocation:[
                    {
                        pickuplocations:""
                    }
                ],
                joinride: [
                {
                    id:""
                }]
            });
            //var settings = {
            //    "async": true,
            //    "crossDomain": true,
            //    "url": "http://carpooltestapp.azurewebsites.net/register",
            //    "method": "POST",
            //    "headers": {
            //        "content-type": "application/json",
            //        "cache-control": "no-cache",
            //    },
            //    "processData": false,
            //    "data": user
            //}

            //$.ajax(settings).success(function (response) {
            //    $scope.iserror = true;
            //    // window.location.href = '/index.html';
            //    $window.alert('sucess');
            //    $scope.success = true;
            //    $scope.txtRegUserName='';
            //    $scope.txtRegPwd='';
            //    $scope.txtRegConfirmPwd='';
            //    $scope.txtRegEmail='';
            //    $scope.txtRegMobile='';
            //}).error(function (jqXHR, textStatus, errorThrown) {
            //    $scope.iserror = false;
            //    $scope.success = false;
            //    //$window.alert(errorThrown);
            //    console.log(errorThrown);
            //    $scope.Error = errorThrown;
            //});
            $http.post('http://carpooltestapp.azurewebsites.net/register', user,            
                    {headers: { 'Content-Type': 'application/json'}}).then(function(data, status){
                       // $window.alert('sucess');
                        $scope.iserror = true;
                        $scope.success = true;
                        $scope.txtRegUserName='';
                        $scope.txtRegPwd='';
                        $scope.txtRegConfirmPwd='';
                        $scope.txtRegEmail='';
                        $scope.txtRegMobile='';
                    }
                    ,error(function(response){
                       // $window.alert('failed with errror' + response);
                        $scope.iserror = false;
                        $scope.success = false;
                        $scope.Error = response;
                    }));                 
        } 
        }
    

});
app.controller('searchCtrl', function ($scope, $http, $window) {

    var url = "http://carpooltestapp.azurewebsites.net/listsharedrides/";
    var userid = window.localStorage.getItem("userid");    
    try {
        $http.get(url + "undefined/undefined/"+userid)
           .success(function (response) {               
               $scope.users = response;

           })
            .error(function (data, status) {
                alert('failed');
            });
    }
    catch (e) {
        alert(e);
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
                        alert('Search failed');
                    });
            }
            else { return false; }
        }
        catch (e) {
            alert(e);
        }

    }

});



app.controller('dashboardCtrl', function ($scope, $http, $window) {
    $scope.ShareRide = function () {
        
        window.location.href = "addmarker.html";
    }

    $scope.ShareRide1 = function () {

        window.location.href = "marker.html";
    }

    $scope.JoinRide = function () {

        window.location.href = "ride.html";
    }

    $scope.logOut = function () {
        window.localStorage.setItem("userid", 0);
        window.location.href = 'index.html';
   }
});



