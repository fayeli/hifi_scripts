(function () {
    var PHOTOBOOTH_WINDOW_HTML_URL = Script.resolvePath("./html/photobooth.html");
    var photoboothWindowListener = {};
    photoboothWindowListener.onLoad = function (event) {
        print("loaded" + event.name);
    };

    var photoboothWindow = new OverlayWebWindow({
      title: 'Photo Booth',
      source: PHOTOBOOTH_WINDOW_HTML_URL,
      width: 450,
      height: 450,
      visible: true
    });

    photoboothWindow.webEventReceived.connect(function (data) {
        var event = JSON.parse(data);
        if (photoboothWindowListener[event.type]) {
            photoboothWindowListener[event.type](event);
        }
    });
}());