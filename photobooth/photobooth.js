(function () {
    var PHOTOBOOTH_WINDOW_HTML_URL = Script.resolvePath("./html/photobooth.html");
    var PHOTOBOOTH_SETUP_JSON_URL = Script.resolvePath("./photoboothSetup.json");

    var PhotoBooth = {};
    PhotoBooth.init = function () {
        var success = Clipboard.importEntities(PHOTOBOOTH_SETUP_JSON_URL);
        var spawnLocation = MyAvatar.position;
        if (success) {
            this.pastedEntityIDs = Clipboard.pasteEntities(spawnLocation);
            this.findCameraEntities();
        }
    };

    PhotoBooth.findCameraEntities = function () {
        var results = {};
        this.pastedEntityIDs.forEach(function(id) {
            var props = Entities.getEntityProperties(id);
            var parts = props["name"].split(":");
            if (parts[0] === "Photo Booth Camera") {
                results[parts[1]] = id;
            }
        });
        print(JSON.stringify(results));
        this.cameraEntities = results;
    };

    PhotoBooth.destroy = function () {
        this.pastedEntityIDs.forEach(function(id) {
            Entities.deleteEntity(id);
        });
    };

    var main = function () {
        PhotoBooth.init();

        var photoboothWindowListener = {};
        photoboothWindowListener.onLoad = function (event) {
            print("loaded" + event.value);
            if (!event.hasOwnProperty("value")){
                return;
            }
        };

        photoboothWindowListener.onSelectCamera = function (event) {
            print("selected camera " + event.value);
            if (!event.hasOwnProperty("value")){
                return;
            }
            if (event.value === "First Person Camera") {
                Camera.mode = "first person";
            } else {
                Camera.mode = "entity";
                var cameraID = PhotoBooth.cameraEntities[event.value];
                Camera.setCameraEntity(cameraID);
            }
        };

        photoboothWindowListener.onSelectLightingPreset = function (event) {
            print("selected lighting preset" + event.value);
            if (!event.hasOwnProperty("value")){
                return;
            }
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
    };
    main();
    
    function cleanup() {
        PhotoBooth.destroy();
    }
    Script.scriptEnding.connect(cleanup);
}());