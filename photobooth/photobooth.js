(function () {
    var SNAPSHOT_DELAY = 500; // 500ms
    var PHOTOBOOTH_WINDOW_HTML_URL = Script.resolvePath("./html/photobooth.html");
    var PHOTOBOOTH_SETUP_JSON_URL = Script.resolvePath("./photoboothSetup.json");
    var toolbar = Toolbars.getToolbar("com.highfidelity.interface.toolbar.system");

    var PhotoBooth = {};
    PhotoBooth.init = function () {
        var success = Clipboard.importEntities(PHOTOBOOTH_SETUP_JSON_URL);
        var frontFactor = 10;
        var frontUnitVec = Vec3.normalize(Quat.getFront(MyAvatar.orientation));
        var frontOffset = Vec3.multiply(frontUnitVec,frontFactor);
        var rightFactor = 3;
        var rightUnitVec = Vec3.normalize(Quat.getRight(MyAvatar.orientation));
        var spawnLocation = Vec3.sum(Vec3.sum(MyAvatar.position,frontOffset),rightFactor);
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

        photoboothWindowListener.onClickPictureButton = function (event) {
            print("clicked picture button");
            // hide HUD tool bar
            toolbar.writeProperty("visible", false);
            // hide Overlays (such as Running Scripts or other Dialog UI)
            Menu.setIsOptionChecked("Overlays", false);
            // giving a delay here before snapshotting so that there is time to hide toolbar and other UIs
            // void WindowScriptingInterface::takeSnapshot(bool notify, bool includeAnimated, float aspectRatio)
            Script.setTimeout(function () {
                Window.takeSnapshot(false, false, 1.91);
            }, SNAPSHOT_DELAY);
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