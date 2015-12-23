var NotificationClientService = (function () {

    var _serviceeUrl;
    var _tMinusSecs;
    var _TotalSecs;
    var _notificationStr;
    var _notificationCallBack;
    var _refreshIntervalId;

    //Expires after TotalSecs seconds given in input; default 5mins
    //Default ping gap is 5 secs
    function AutomaticNotifications(serviceeUrl, tMinusSecs, TotalSecs, notificationStr, notificationCallBack) {

        InitNotifications(serviceeUrl, tMinusSecs, TotalSecs, notificationStr, notificationCallBack);

        //Start Notifications
        var myinterval = 1000 * tMinusSecs;
        this.RefreshIntervalId = setInterval(SendNotification, myinterval);
        //Clear timer after TotalSecs
        setTimeout(function (refreshIntervalId) {
            clearInterval(refreshIntervalId);
        }, TotalSecs);

    }

    function InitNotifications(serviceeUrl, tMinusSecs, TotalSecs, notificationStr, notificationCallBack) {
        _serviceeUrl = serviceeUrl;
        _tMinusSecs = tMinusSecs;
        _TotalSecs = TotalSecs;
        _notificationStr = notificationStr;
        _notificationCallBack = notificationCallBack;

        if (!TotalSecs) TotalSecs = 5 * 60;
        if (!tMinusSecs) tMinusSecs = 5;
    }

    function ManualNotication(serviceeUrl, TotalSecs, notificationStr, notificationCallBack) {
        InitNotifications(serviceeUrl, null, TotalSecs, notificationStr, notificationCallBack);
        setTimeout(SendNotification, 1000 * TotalSecs);
    }

    function SendNotification() {
        notificationData = JSON.parse(_notificationStr);
        PostData(_serviceeUrl, notificationData, _notificationCallBack);
        return;
    }

    function PostData(serviceeUrl, notificationData, hndlrName) {
        if (serviceeUrl == null)
            return;

        var $http = angular.injector(["ng"]).get("$http");
        $http.get(serviceeUrl).then(hndlrName, null);

       
    }

    return {
        AutomaticNotifications: AutomaticNotifications,
        ManualNotication: ManualNotication,
        NotificationClientService: NotificationClientService,
        RefreshIntervalId: _refreshIntervalId
    }
})();

var CancelNotification = (function () {

    function Clear(refreshIntervalId) {
        clearInterval(refreshIntervalId);
    }
    return {
        Clear:Clear
     }
})();


