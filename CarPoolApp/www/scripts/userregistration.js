
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function (global) {
    "use strict";

    //document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        loadCamera();

    };

    function loadCamera() {
        document.getElementById('btnTakenPhoto').onclick = function () {

            navigator.camera.getPicture(function (imageUri) {
                var dataURL = encodeImageUri(imageUri);
                document.getElementById('selfieImage').style.border = "0";
                document.getElementById('selfieImage').innerHTML = "<img id='blah' style='height:120px;width:90px;border: 2px dotted #808080' src='" + imageUri + "' />";
                window.localStorage.setItem("binaryImage", dataURL);
            }, null, null);


        };
    }

    function encodeImageUri(imageUri) {
        var c = document.createElement('canvas');
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function () {
            c.width = this.width;
            c.height = this.height;
            ctx.drawImage(img, 0, 0);
        };
        img.src = imageUri;
        var dataURL = c.toDataURL("image/jpeg");
        return dataURL;
    }

    document.addEventListener("deviceready", onDeviceReady, false);
})(window);
