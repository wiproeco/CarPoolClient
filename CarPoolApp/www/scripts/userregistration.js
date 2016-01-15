
// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in Ripple or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
(function (global) {
    "use strict";
    var pictureSource;
    var destinationType;

    //document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        pictureSource = navigator.camera.PictureSourceType;
        destinationType = navigator.camera.DestinationType;

        loadCamera();
        loadGallery();
    };

    function loadCamera() {
        document.getElementById('btnTakenPhoto').onclick = function () {
            navigator.camera.getPicture(onSuccess, onFail, {
                quality: 50,
                destinationType: Camera.DestinationType.DATA_URL
            });

            function onSuccess(imageData) {
                document.getElementById('selfieImage').style.border = "0";
                document.getElementById('selfieImage').innerHTML = "<img id='blah' style='height:120px;width:90px;border: 2px dotted #808080' src='data:image/jpeg;base64," + imageData + "' />";
                window.localStorage.setItem("binaryImage", "data:image/jpeg;base64," + imageData);
            }

            function onFail(message) {
                console.log('Failed to capture photo');
            }
        };
    }

    //To access data from galley
    function loadGallery() {
        document.getElementById('btnGallery').onclick = function () {
            navigator.camera.getPicture(onPhotoURISuccess, onFail, {
                quality: 50,
                destinationType: destinationType.DATA_URL,
                sourceType: pictureSource.PHOTOLIBRARY
            });

            function onPhotoURISuccess(imageData) {
                document.getElementById('selfieImage').style.border = "0";
                document.getElementById('selfieImage').innerHTML = "<img id='blah' style='height:120px;width:90px;border: 2px dotted #808080' src='data:image/jpeg;base64," + imageData + "' />";
                window.localStorage.setItem("binaryImage", "data:image/jpeg;base64," + imageData);
            }

            function onFail(imageData) {
                console.log('failed');
            }
        }
    }


    document.addEventListener("deviceready", onDeviceReady, false);
})(window);
