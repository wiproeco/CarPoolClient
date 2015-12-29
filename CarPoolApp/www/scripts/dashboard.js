// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function () {
    "use strict";

    //document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {

            //var socket = null;
            ////Socket registration related
            //var userdocid = window.localStorage.getItem("userid");
            //socket = io('http://carpooltestapp.azurewebsites.net:3000/');
            //socket.on('connect', function () { });
            //socket.emit('regUser', { userid: userdocid });

            //socket.on('recieveNotification', function (text) {
            //    navigator.notification.confirm(text, onConfirm, 'Confirmation', ['Accept', 'Reject']);
            //});
            //function onConfirm(buttonIndex) {
            //    if (buttonIndex == 1) {
            //        socket.emit('sendNotification', { data: 'Your ride is accepted by Owner', userid: '' });
            //    }
            //    if (buttonIndex == 2) {
            //        socket.emit('sendNotification', { data: 'Your ride is rejected by Owner', userid: '' });
            //    }

            //}

        // Handle the Cordova pause and resume events
        document.addEventListener('pause', onPause.bind(this), false);
        document.addEventListener('resume', onResume.bind(this), false);

        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
    };

    function onPause() {
        // TODO: This application has been suspended. Save application state here.
    };

    function onResume() {
        // TODO: This application has been reactivated. Restore application state here.
    };
})();